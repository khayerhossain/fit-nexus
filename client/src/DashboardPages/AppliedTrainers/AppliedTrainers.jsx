import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { FaCheckCircle, FaEye, FaTimesCircle } from "react-icons/fa";
import Loading from "../../Pages/Loading/Loading";
import Swal from "sweetalert2";

const AppliedTrainers = () => {
  const queryClient = useQueryClient();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [rejectingTrainer, setRejectingTrainer] = useState(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");

  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["applied-trainers"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/applied-trainers`
      );
      return res.data;
    },
  });

  const approveTrainer = useMutation({
    mutationFn: (id) =>
      axios.patch(
        `${import.meta.env.VITE_BASE_URL}/applied-trainers/approve/${id}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["applied-trainers"]);
      Swal.fire("Approved!", "Trainer has been approved.", "success");
    },
  });

  const rejectTrainer = useMutation({
    mutationFn: ({ id, feedback }) =>
      axios.patch(
        `${import.meta.env.VITE_BASE_URL}/applied-trainers/reject/${id}`,
        { feedback }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["applied-trainers"]);
      Swal.fire(
        "Rejected!",
        "Trainer has been rejected with feedback.",
        "success"
      );
    },
  });

  const handleApprove = (id) => {
    Swal.fire({
      title: "Approve Trainer?",
      text: "Do you want to approve this trainer?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve",
    }).then((result) => {
      if (result.isConfirmed) {
        approveTrainer.mutate(id);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <section className="py-16 text-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto p-6 md:p-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Pending Trainer Applications
        </h2>

        {trainers.length === 0 ? (
          <p className="text-center text-gray-300">No pending trainers</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/20">
                  <th className="py-3 px-4 font-semibold">Profile</th>
                  <th className="py-3 px-4 font-semibold">Name & Email</th>
                  <th className="py-3 px-4 font-semibold">Age</th>
                  <th className="py-3 px-4 font-semibold">Available</th>
                  <th className="py-3 px-4 font-semibold">Time</th>
                  <th className="py-3 px-4 font-semibold">Applied</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer) => (
                  <tr
                    key={trainer._id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={trainer.profileImage}
                        alt={trainer.fullName}
                        className="w-12 h-12 rounded-full border border-white/30 object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">{trainer.fullName}</div>
                      <div className="text-xs text-gray-300">
                        {trainer.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">{trainer.age}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {trainer.availableDays.map((day, idx) => (
                          <span
                            key={idx}
                            className="bg-green-600/30 text-xs px-2 py-0.5 rounded-full"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">{trainer.availableTime}</td>
                    <td className="py-3 px-4 text-xs">
                      {new Date(trainer.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-4 text-xl">
                        <button
                          onClick={() => handleApprove(trainer._id)}
                          className="text-green-500 hover:scale-110 transition-transform cursor-pointer"
                          title="Approve"
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={() => setRejectingTrainer(trainer)}
                          className="text-red-500 hover:scale-110 transition-transform cursor-pointer"
                          title="Reject"
                        >
                          <FaTimesCircle />
                        </button>
                        <button
                          onClick={() => setSelectedTrainer(trainer)}
                          className="text-yellow-400 hover:scale-110 transition-transform cursor-pointer"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Trainer Details Modal */}
      <Dialog
        open={!!selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg bg-white/10 text-white p-6 rounded-xl backdrop-blur-xl border border-white/20 shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-4 text-center">
              Trainer Details
            </Dialog.Title>
            {selectedTrainer && (
              <>
                <div className="flex flex-col items-center gap-2 mb-4">
                  <img
                    src={selectedTrainer.profileImage}
                    alt={selectedTrainer.fullName}
                    className="w-24 h-24 rounded-full border-2 border-white"
                  />
                  <h3 className="text-lg font-semibold">
                    {selectedTrainer.fullName}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {selectedTrainer.email}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Age:</span>{" "}
                    {selectedTrainer.age}
                  </p>
                  <p>
                    <span className="font-semibold">Available Time:</span>{" "}
                    {selectedTrainer.availableTime}
                  </p>
                  <p>
                    <span className="font-semibold">Applied On:</span>{" "}
                    {new Date(selectedTrainer.appliedTime).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Skills:</span>
                  </p>
                  <ul className="flex flex-wrap gap-2 mt-1">
                    {selectedTrainer.skills.map((skill, i) => (
                      <li
                        key={i}
                        className="bg-red-500/30 px-2 py-0.5 rounded-full text-xs"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <span className="font-semibold">Available Days:</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTrainer.availableDays.map((day, i) => (
                      <span
                        key={i}
                        className="bg-green-500/30 px-2 py-0.5 rounded-full text-xs"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => setSelectedTrainer(null)}
                    className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-300 text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Reject Feedback Modal */}
      <Dialog
        open={!!rejectingTrainer}
        onClose={() => setRejectingTrainer(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white/10 text-white p-6 rounded-xl backdrop-blur-xl border border-white/20 shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-4 text-center">
              Reason for Rejection
            </Dialog.Title>
            <textarea
              className="w-full p-2 rounded bg-white/10 text-white"
              rows="4"
              placeholder="Write feedback for rejection..."
              value={rejectionFeedback}
              onChange={(e) => setRejectionFeedback(e.target.value)}
            />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  rejectTrainer.mutate({
                    id: rejectingTrainer._id,
                    feedback: rejectionFeedback,
                  });
                  setRejectingTrainer(null);
                  setRejectionFeedback("");
                }}
                className="px-4 py-2 bg-red-500 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setRejectingTrainer(null);
                  setRejectionFeedback("");
                }}
                className="px-4 py-2 bg-gray-500 rounded"
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default AppliedTrainers;
