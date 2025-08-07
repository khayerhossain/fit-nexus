import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import Loading from "../../Pages/Loading/Loading";
import axios from "axios";

const Subscribers = () => {
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  const {
    data: subscribers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const res = await axios.get("/subscribers");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load subscribers
      </p>
    );

  return (
    <section className="py-10 text-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto p-6 md:p-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-auto"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          Newsletter Subscribers
        </h2>

        {subscribers.length === 0 ? (
          <p className="text-center text-gray-300">No subscribers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/20">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Subscribed At</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber._id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4">{subscriber.name}</td>
                    <td className="py-3 px-4">{subscriber.email}</td>
                    <td className="py-3 px-4 text-xs">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedSubscriber(subscriber)}
                        className="text-yellow-400 hover:scale-110 transition-transform"
                        title="View Details"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modal for subscriber details */}
      <Dialog
        open={!!selectedSubscriber}
        onClose={() => setSelectedSubscriber(null)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white/10 text-white p-6 rounded-xl backdrop-blur-xl border border-white/20 shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-4 text-center">
              Subscriber Details
            </Dialog.Title>

            {selectedSubscriber && (
              <div className="space-y-4 text-sm">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedSubscriber.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedSubscriber.email}
                </p>
                <p>
                  <span className="font-semibold">Subscribed At:</span>{" "}
                  {new Date(selectedSubscriber.subscribedAt).toLocaleString()}
                </p>
              </div>
            )}

            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedSubscriber(null)}
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

export default Subscribers;
