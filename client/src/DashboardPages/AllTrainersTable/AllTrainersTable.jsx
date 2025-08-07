import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; // ✅ SweetAlert2
import Loading from "../../Pages/Loading/Loading";

const AllTrainersTable = () => {
  const queryClient = useQueryClient();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainersList, setTrainersList] = useState([]);

  // Fetch trainers
  const {
    data: trainers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const res = await axios.get(`/trainers`);
      return res.data;
    },
  });

  // When data arrives, set it to local state
  useEffect(() => {
    setTrainersList(trainers);
  }, [trainers]);

  // Mutation to remove trainer (set status to member)
  const removeTrainerMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.patch(`/applied-trainers/remove/${id}`);
    },
    onSuccess: (_, id) => {
      // Remove trainer from local state immediately
      setTrainersList((prev) => prev.filter((trainer) => trainer._id !== id));
      toast.success("Trainer removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove trainer");
    },
  });

  if (isLoading) return <Loading />;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load trainers</p>
    );

  return (
    <section className="py-16 px-4 text-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto p-6 md:p-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          All Trainers
        </h2>

        {trainersList.length === 0 ? (
          <p className="text-center text-gray-300">No trainers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/20">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Joined</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainersList.map((trainer) => (
                  <tr
                    key={trainer._id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4 font-semibold">
                      {trainer.fullName || trainer.name}
                    </td>
                    <td className="py-3 px-4">{trainer.email}</td>
                    <td className="py-3 px-4">{trainer.status}</td>
                    <td className="py-3 px-4">{trainer.appliedAt}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You are about to remove this trainer!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Yes, remove",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              removeTrainerMutation.mutate(trainer._id);
                            }
                          });
                        }}
                        disabled={removeTrainerMutation.isLoading}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold"
                      >
                        {removeTrainerMutation.isLoading
                          ? "Removing..."
                          : "Remove Trainer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default AllTrainersTable;
