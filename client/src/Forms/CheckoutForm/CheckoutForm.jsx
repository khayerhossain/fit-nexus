import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";

const classesInfo = {
  Yoga: {
    title: "Morning Yoga Boost",
    description: "Relax, stretch, and energize your day with yoga",
  },
  Zumba: {
    title: "Zumba Fiesta",
    description: "Burn calories while having fun!",
  },
  Crossfit: {
    title: "Crossfit Challenge",
    description: "Push your limits and build strength",
  },
  WeightLefting: {
    title: "Power Up with Weight Lifting",
    description:
      "Build muscle, boost strength, and transform your body with expert weight training sessions.",
  },
  Cardio: {
    title: "Energize with Cardio Workouts",
    description:
      "Improve endurance, burn calories, and keep your heart healthy with our dynamic cardio sessions.",
  },
};

const CheckoutForm = ({ onClose, bookingInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth(); //  Get user with email

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create Stripe Payment Method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          email: user?.email || "unknown@email.com",
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Step 2: Build classDetails
      const classDetails = {};
      (bookingInfo.selectedClasses || []).forEach((className) => {
        if (classesInfo[className]) {
          classDetails[className] = {
            title: classesInfo[className].title || "No title",
            description: classesInfo[className].description || "No description",
          };
        } else {
          classDetails[className] = {
            title: "No title",
            description: "No description",
          };
        }
      });

      // Step 3: Build bookingData
      const bookingData = {
        userName: bookingInfo.userName,
        trainerName: bookingInfo.trainerName,
        day: bookingInfo.days ? bookingInfo.days[0] : "N/A",
        time: bookingInfo.times ? bookingInfo.times[0] : "N/A",
        selectedClasses: bookingInfo.selectedClasses || [],
        classDetails,
        package: {
          name: bookingInfo.package?.name || "N/A",
          price: bookingInfo.package?.price || 0,
        },
        notes: bookingInfo.notes || "",
        email: bookingInfo.userEmail,
        amount: bookingInfo.package?.price || 0,
        paymentMethodId: paymentMethod.id,
        paymentStatus: "paid",
        createdAt: new Date().toISOString(),
      };

      console.log(" BookingData sending:", bookingData); // Debugging

      // Step 4: Send to backend
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/create-payment-intent`,
        bookingData
      );

      if (res.status !== 200) throw new Error("Booking not saved");

      toast.success("Payment Successful!");
      onClose();
    } catch (err) {
      console.error("DB / Payment Error:", err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 mt-4 bg-gradient-to-br from-white/10 via-white/5 to-white/10 
                 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20"
    >
      <h2 className="text-xl font-semibold text-center mb-4 text-white">
        Complete Payment
      </h2>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Card Details
        </label>
        <div className="border border-white/20 px-3 py-3 rounded-md shadow-sm min-h-[48px] bg-white/10">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#fff",
                  "::placeholder": { color: "#bbb" },
                },
                invalid: { color: "#ff6b6b" },
              },
            }}
          />
        </div>
      </div>

      {/* Error */}
      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md 
                   disabled:opacity-50 transition-transform transform hover:scale-105 cursor-pointer"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </motion.form>
  );
};

export default CheckoutForm;
