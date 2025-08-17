require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");
const Stripe = require("stripe");
const admin = require("firebase-admin");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// service key
const decoded = Buffer.from(
  process.env.FIRE_BASE_SERVICE_KEY,
  "base64"
).toString("utf8");
const serviceAccount = JSON.parse(decoded);

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Root test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("FitNexusDB");
    const usersCollection = db.collection("users");
    const newsletterCollection = db.collection("newsletter");
    const appliedTrainersCollection = db.collection("appliedTrainers");
    const packagesCollection = db.collection("packages");
    const bookingsCollection = db.collection("bookingData");
    const mostBookingClassesCollection = db.collection("mostBoking");
    const reviewsCollection = db.collection("reviews");
    const classesCollection = db.collection("classes");
    const forumCollection = db.collection("forums");

    const verifyToken = async (req, res, next) => {
      const authHeader = req.headers.authorization;
      console.log("Auth Header:", authHeader);

      if (!authHeader?.startsWith("Bearer ")) {
        console.log("No Bearer token in header");
        return res.status(401).send({ message: "Unauthorized: No token" });
      }

      const token = authHeader.split(" ")[1];
      try {
        const decodedUser = await admin.auth().verifyIdToken(token);
        console.log("Decoded user:", decodedUser.email);
        req.user = decodedUser;
        next();
      } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).send({ message: "Forbidden: Invalid token" });
      }
    };

    // verify admin or not
    const verifyAdmin = async (req, res, next) => {
      const userEmail = req.user?.email;
      if (!userEmail) {
        return res
          .status(401)
          .send({ message: "Unauthorized - No user email" });
      }

      try {
        const user = await usersCollection.findOne({ email: userEmail });

        if (!user || user.role !== "admin") {
          return res.status(403).send({ message: "Forbidden - Not an admin" });
        }

        next(); // User is admin, carry on
      } catch (error) {
        return res
          .status(500)
          .send({ message: "Server error checking admin", error });
      }
    };

    // save users in database
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        user.createdAt = new Date(); // Added createdAt here
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error("Failed to save user:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // get all traines for all trainers page and admin trainers table
    // get all trainers with sorting
    app.get("/trainers", async (req, res) => {
      try {
        const { sort } = req.query; // "newest" or "oldest"
        let sortOption = { _id: -1 }; // default newest

        if (sort === "oldest") {
          sortOption = { _id: 1 };
        }

        const trainers = await appliedTrainersCollection
          .find({ status: "trainer" })
          .sort(sortOption)
          .toArray();

        res.send(trainers);
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
        res.status(500).send({ message: "Failed to fetch trainers" });
      }
    });

    // save newsletter or  subscribers into database
    app.post("/subscribe", verifyToken, async (req, res) => {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }
      // Check if email already subscribed (optional)
      const exists = await newsletterCollection.findOne({ email });
      if (exists) {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      const result = await newsletterCollection.insertOne({
        name,
        email,
        subscribedAt: new Date(),
      });
      res.status(201).json({ message: "Subscribed successfully" });
      res.send(result);
    });

    // get subscribers for subscribers page
    app.get("/subscribers", verifyToken, verifyAdmin, async (req, res) => {
      const result = await newsletterCollection.find().toArray();
      res.send(result);
    });

    // save applied trainers data into database (pending requests)
    app.post("/applied-trainers", async (req, res) => {
      try {
        const trainerData = req.body;
        const result = await appliedTrainersCollection.insertOne(trainerData);
        res.send(result);
      } catch (error) {
        console.error("Error applying as trainer:", error);
        res.status(500).send({ message: "Failed to apply as trainer" });
      }
    });

    // get all pending trainers for applied page:
    app.get("/applied-trainers", async (req, res) => {
      const trainers = await appliedTrainersCollection
        .find({ status: "pending" })
        .toArray();
      res.send(trainers);
    });

    // approve trainers by patch
    app.patch(
      "/applied-trainers/approve/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;

        try {
          // 1️ First, update the appliedTrainersCollection -> status: 'trainer'
          const trainerResult = await appliedTrainersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: "trainer" } }
          );

          // 2️ Find the trainer's email from appliedTrainersCollection by id
          const appliedTrainer = await appliedTrainersCollection.findOne({
            _id: new ObjectId(id),
          });
          const email = appliedTrainer?.email;

          // 3️ If no email found, return error
          if (!email) {
            return res.status(404).send({
              message: "Trainer email not found in appliedTrainersCollection.",
            });
          }

          // 4️ Update the user's role to 'trainer' in usersCollection using the email
          const userResult = await usersCollection.updateOne(
            { email: email },
            { $set: { role: "trainer" } }
          );

          // 5️ Send both update results as response
          res.send({
            trainerUpdate: trainerResult,
            userUpdate: userResult,
          });
        } catch (error) {
          // 6️ Error handling
          console.error("Failed to approve trainer:", error);
          res.status(500).send({
            message: "Internal Server Error while approving trainer.",
          });
        }
      }
    );

    // Reject trainers by patch with feedback
    app.patch(
      "/applied-trainers/reject/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const { feedback } = req.body;

        try {
          const result = await appliedTrainersCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "rejected",
                feedback: feedback,
              },
            }
          );

          res.send({ result });
        } catch (error) {
          console.error("Failed to reject trainer:", error);
          res.status(500).send({
            message: "Internal Server Error while rejecting trainer.",
          });
        }
      }
    );

    // delete applied trainers request
    app.delete("/applied-trainers/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await appliedTrainersCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // get packages for booking and price
    app.get("/packages", async (req, res) => {
      const result = await packagesCollection.find().toArray(); // get all docs as array
      res.send({ packages: result });
    });

    // get approved trainers for all trainers admin page
    app.get("/applied-trainers", async (req, res) => {
      try {
        const trainers = await appliedTrainersCollection
          .find({ status: "trainer" })
          .toArray();
        res.send(trainers);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch trainers" });
      }
    });

    // get trainer details by id
    app.get("/trainers/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const trainer = await appliedTrainersCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!trainer) {
          return res.status(404).send({ message: "Trainer not found" });
        }

        res.send(trainer);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to fetch trainer", error: error.message });
      }
    });

    // create payment intent and save data into database
    app.post("/create-payment-intent", async (req, res) => {
      const {
        userName,
        trainerName,
        day,
        time,
        selectedClasses,
        package,
        notes,
        email,
        amount,
        paymentMethodId,
        createdAt,
        classDetails,
      } = req.body;

      try {
        // Stripe payment creation
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "usd",
          payment_method: paymentMethodId,
          confirmation_method: "manual",
          confirm: true,
          return_url: "https://yourfrontend.com/payment-success",
        });

        if (
          paymentIntent.status === "requires_action" &&
          paymentIntent.next_action?.type === "use_stripe_sdk"
        ) {
          return res.status(200).json({
            requiresAction: true,
            paymentIntentClientSecret: paymentIntent.client_secret,
          });
        } else if (paymentIntent.status === "succeeded") {
          // Save booking data
          const bookingData = {
            userName,
            trainerName,
            day,
            time,
            selectedClasses,
            package,
            notes,
            email,
            amount,
            paymentStatus: paymentIntent.status,
            paymentIntentId: paymentIntent.id,
            createdAt: createdAt || new Date().toISOString(),
          };

          await bookingsCollection.insertOne(bookingData);
          console.log("📦 Received classDetails:", classDetails);
          console.log("📦 Received selectedClasses:", selectedClasses);

          // Safely update mostBookingClassesCollection
          for (const className of selectedClasses) {
            const classInfo = classDetails?.[className];
            const title = classInfo?.title || "No title";
            const description = classInfo?.description || "No description";

            await mostBookingClassesCollection.updateOne(
              { name: className },
              {
                $inc: { bookingCount: 1 },
                $set: { title, description },
              },
              { upsert: true }
            );
          }

          return res.status(200).json({ success: true });
        } else {
          return res
            .status(400)
            .json({ error: "Payment failed or incomplete" });
        }
      } catch (err) {
        console.error("Payment/DB Error:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // get user bookings data for my booking page
    app.get("/bookings", verifyToken, async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      try {
        const bookings = await bookingsCollection
          .find({ email: email })
          .toArray();
        res.status(200).json(bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Failed to fetch bookings" });
      }
    });

    // GET: /most-booked-classes for  deatured classes
    app.get("/most-booked-classes", async (req, res) => {
      try {
        const result = await mostBookingClassesCollection
          .find()
          .sort({ bookingCount: -1 })
          .limit(6)
          .toArray();

        res.send(result);
      } catch (error) {
        console.error("Fetch failed:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // save member review into database!!
    app.post("/reviews", async (req, res) => {
      try {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.send({ insertedId: result.insertedId });
      } catch (err) {
        res
          .status(500)
          .send({ message: "Failed to submit review", error: err });
      }
    });

    // get reviews for  showings customers reviews
    app.get("/reviews", async (req, res) => {
      try {
        const result = await reviewsCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (err) {
        res
          .status(500)
          .send({ message: "Failed to fetch reviews", error: err });
      }
    });

    // get user role by email
    app.get("/role/:email", async (req, res) => {
      const emailParam = req.params.email;
      try {
        const user = await usersCollection.findOne({ email: emailParam });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ role: user.role }); // Return role without auth check
      } catch (error) {
        console.error("Error fetching user role:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Get Admin/trainer/member Profile API
    app.get("/profile/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
      } catch (error) {
        res.status(500).send({ message: "Failed to get user profile" });
      }
    });

    // update profile details
    app.patch("/profile/:email", verifyToken, async (req, res) => {
      try {
        const result = await usersCollection.updateOne(
          { email: req.params.email },
          { $set: req.body }
        );
        if (result.matchedCount === 0)
          return res.status(404).json({ message: "User not found" });
        res.json({ message: "Profile updated" });
      } catch {
        res.status(500).json({ message: "Server error" });
      }
    });

    // class added by admin and save into database
    app.post("/classes", async (req, res) => {
      const newClass = req.body;
      const result = await classesCollection.insertOne(newClass);
      res.send(result);
    });

    // get classes for all classes page with search, pagination & sort
    app.get("/classes", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortOrder = req.query.sort === "oldest" ? 1 : -1; // default newest first
        const skip = (page - 1) * limit;
        const titleSearch = req.query.title || "";

        // build query
        const query = {};
        if (titleSearch) {
          query.title = { $regex: titleSearch, $options: "i" }; // case-insensitive search
        }

        const total = await classesCollection.countDocuments(query); // count with search
        const result = await classesCollection
          .find(query)
          .sort({ createdAt: sortOrder })
          .skip(skip)
          .limit(limit)
          .toArray();

        res.send({ total, result });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch classes" });
      }
    });

    // For All Classes page: get trainers by category (max 5)
    app.get("/trainers-by-class/:category", async (req, res) => {
      const category = req.params.category;
      try {
        const trainers = await appliedTrainersCollection
          .find({ skills: category, status: "trainer" })
          .limit(5)
          .toArray();
        res.send(trainers);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch trainers" });
      }
    });

    // remove trainers from all trainers by admin route
    app.patch(
      "/applied-trainers/remove/:id",
      verifyAdmin,
      verifyToken,
      async (req, res) => {
        const id = req.params.id;
        try {
          // Update appliedTrainersCollection - set status to "member"
          await appliedTrainersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: "member" } }
          );

          // Update userCollection - set role to "member"
          await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { role: "member" } }
          );

          res.send({ message: "Trainer removed successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).send({ error: "Failed to remove trainer" });
        }
      }
    );

    // get slot for trainer by their emails
    app.get("/my-slots", verifyToken, async (req, res) => {
      const email = req.query.email;
      const result = await appliedTrainersCollection
        .find({ trainerEmail: email })
        .toArray();
      res.send(result);
    });

    // delete slot by trainer
    app.delete("/my-slots/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await appliedTrainersCollection.deleteOne(query);
      res.send(result);
    });

    // Get pending/rejected applied trainers by email  for activity log
    app.get("/activity-log/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await appliedTrainersCollection
        .find({ email, status: { $in: ["pending", "rejected"] } })
        .toArray();
      res.send(result);
    });

    // Get total balance API
    app.get("/admin-stats", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const payments = await bookingsCollection.find().toArray();

        const totalRevenue = payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );

        const lastSixPayments = payments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        res.send({
          totalRevenue,
          lastSixPayments,
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch revenue" });
      }
    });

    // get subscribers bs paid members
    app.get("/chart-stats", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const subscribersCount =
          await newsletterCollection.estimatedDocumentCount();
        const paidMembersCount = await usersCollection.countDocuments({
          role: "member",
        });

        res.send({
          subscribersCount,
          paidMembersCount,
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch chart stats" });
      }
    });

    // get user by email for forum page user role
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send(user);
    });

    // save forum data into database by form
    app.post("/forum", async (req, res) => {
      const forum = req.body;
      const result = await forumCollection.insertOne(forum);
      res.send(result);
    });

    // get all posts data for community page
    app.get("/forums", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const total = await forumCollection.estimatedDocumentCount();
        const result = await forumCollection
          .find()
          .sort({ createdAt: -1 }) // sort by newest
          .skip(skip)
          .limit(limit)
          .toArray();

        res.send({ total, result });
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch forum posts" });
      }
    });

    // get forums for home page (recents forums
    app.get("/recent-forums", async (req, res) => {
      try {
        const recentForums = await forumCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(6)
          .toArray();
        res.send(recentForums);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch recent forums" });
      }
    });

    //get revenue for showing growth!
    app.get("/revenue-history", async (req, res) => {
      try {
        const bookingsCollection = db.collection("bookingData");

        const history = await bookingsCollection
          .aggregate([
            { $match: { paymentStatus: "succeeded" } }, // only success
            {
              $group: {
                _id: { month: { $month: { $toDate: "$createdAt" } } }, // convert string to date
                totalRevenue: { $sum: "$amount" },
              },
            },
            {
              $project: {
                month: "$_id.month",
                amount: "$totalRevenue",
                _id: 0,
              },
            },
            { $sort: { month: 1 } },
          ])
          .toArray();

        // month number -> month name
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const formattedHistory = history.map((item) => ({
          month: months[item.month - 1],
          amount: item.amount,
        }));

        res.json(formattedHistory);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`the server is going to be fire at${port}`);
});
