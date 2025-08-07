import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../Forms/CheckoutForm/CheckoutForm";

// Stripe initialization outside component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const BookingModal = ({ isOpen, onClose, bookingInfo }) => {
  if (!bookingInfo) return null;

  const {
    trainerName = "N/A",
    userName = "N/A",
    day = "N/A",
    time = "N/A",
    package: selectedPackage = {},
    selectedClasses = [],
    notes,
  } = bookingInfo;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Centered Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="relative w-full max-w-lg p-6 rounded-2xl 
                     bg-white/10 backdrop-blur-xl border border-white/20 
                     shadow-xl text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white"
          >
            <X size={22} />
          </button>

          {/* Title */}
          <Dialog.Title className="text-2xl font-bold mb-4 text-center">
            Confirm Your Booking
          </Dialog.Title>

          {/* Booking Info */}
          <div className="space-y-2 text-sm text-gray-200">
            <p>
              <span className="font-semibold text-white">Trainer:</span>{" "}
              {trainerName}
            </p>
            <p>
              <span className="font-semibold text-white">Your Name:</span>{" "}
              {userName}
            </p>
            <p>
              <span className="font-semibold text-white">Day:</span> {day}
            </p>
            <p>
              <span className="font-semibold text-white">Time:</span> {time}
            </p>
            <p>
              <span className="font-semibold text-white">Package:</span>{" "}
              {selectedPackage.name} - ${selectedPackage.price}
            </p>
            <p>
              <span className="font-semibold text-white">Classes:</span>{" "}
              {selectedClasses.length > 0 ? selectedClasses.join(", ") : "None"}
            </p>
            {notes && (
              <p>
                <span className="font-semibold text-white">Notes:</span> {notes}
              </p>
            )}
          </div>

          {/* Payment Form */}
          <div className="mt-6">
            <Elements stripe={stripePromise}>
              <CheckoutForm bookingInfo={bookingInfo} onClose={onClose} />
            </Elements>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal;
