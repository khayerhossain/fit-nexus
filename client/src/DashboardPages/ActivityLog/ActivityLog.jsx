import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaEye } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Pages/Loading/Loading";

const ActivityLog = () => {
  const { user } = useAuth();
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["activity-log", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/activity-log/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <Loading />;

  return (
    <section className="py-16 text-white min-h-screen">
      <div className="max-w-5xl mx-auto p-6 bg-white/10 rounded-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Activity Log</h2>

        {logs.length === 0 ? (
          <p className="text-center text-gray-300">No activity found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/20">
                  <th className="py-3 px-4 font-semibold">Profile</th>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Applied Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((trainer) => (
                  <tr
                    key={trainer._id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={trainer.profileImage}
                        alt={trainer.fullName}
                        className="w-10 h-10 rounded-full border border-white/30 object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">{trainer.fullName}</td>
                    <td className="py-3 px-4">{trainer.email}</td>
                    <td className="py-3 px-4">
                      {new Date(trainer.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 capitalize">{trainer.status}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedTrainer(trainer)}
                        className="text-yellow-400 hover:scale-110 transition-transform"
                        title="View Feedback"
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Feedback */}
      <Dialog
        open={!!selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white/10 text-white p-6 rounded-xl border border-white/20">
            <Dialog.Title className="text-xl font-bold mb-4 text-center">
              Application Feedback
            </Dialog.Title>

            {selectedTrainer && (
              <div className="text-center space-y-4">
                <img
                  src={selectedTrainer.profileImage}
                  alt={selectedTrainer.fullName}
                  className="w-16 h-16 mx-auto rounded-full border border-white"
                />
                <h3 className="font-semibold">{selectedTrainer.fullName}</h3>
                <p className="text-xs text-gray-400">{selectedTrainer.email}</p>

                <p>
                  <span className="font-semibold">Applied Date:</span>{" "}
                  {new Date(selectedTrainer.appliedAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedTrainer.status}
                </p>
                <p className="text-sm text-gray-300">
                  {selectedTrainer.status === "pending"
                    ? "Your application is still under review."
                    : selectedTrainer?.feedback || "No feedback provided."}
                </p>
              </div>
            )}

            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedTrainer(null)}
                className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-300 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default ActivityLog;
