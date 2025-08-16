import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import Container from "../../Components/Shared/Container/Container";
import Loading from "../../Pages/Loading/Loading";

const MyBookings = () => {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myBookings", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/bookings?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleSubmitReview = async () => {
    const review = {
      trainerId: selectedBooking.trainerId,
      trainerName: selectedBooking.trainerName,
      userName: user.displayName,
      userPhoto: user.photoURL,
      rating,
      feedback,
      createdAt: new Date(),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/reviews`,
        review
      );
      if (res.data.insertedId) {
        Swal.fire("✅ Success", "Review submitted!", "success");
        setShowModal(false);
        setFeedback("");
        setRating(5);
      }
    } catch (err) {
      Swal.fire("❌ Error", "Something went wrong", "error");
    }
  };

  return (
    <section className="text-white min-h-screen">
      <Container>
        <h2 className="text-3xl font-bold mb-8 text-center">📋 My Bookings</h2>

        {isLoading && (
         <Loading/>
        )}

        {error && (
          <p className="text-center text-red-500">Error: {error.message}</p>
        )}

        {bookings.length === 0 && !isLoading ? (
          <p className="text-center text-gray-400">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 text-indigo-400">
                  {booking.trainerName}
                </h3>
                <p>
                  <span className="font-medium">Package:</span>{" "}
                  {booking.package.name}
                </p>
                <p>
                  <span className="font-medium">Classes:</span>{" "}
                  {booking.selectedClasses.join(", ")}
                </p>
                <p>
                  <span className="font-medium">Day:</span> {booking.day}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {booking.time}
                </p>
                <p>
                  <span className="font-medium">Price:</span> $
                  {booking.package.price}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Booked on: {new Date(booking.createdAt).toLocaleString()}
                </p>

                <button
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowModal(true);
                  }}
                >
                  Leave a Review
                </button>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md w-full text-white relative">
            <h3 className="text-xl font-bold mb-4 text-center">
              Review for {selectedBooking?.trainerName}
            </h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded p-3 mb-4 resize-none placeholder-gray-400 focus:outline-none"
              placeholder="Write your honest feedback..."
              rows="4"
            />
            <div className="mb-4">
              <label className="block font-medium mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full bg-black/30 border border-white/20 rounded p-2 focus:outline-none"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 && "s"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyBookings;
