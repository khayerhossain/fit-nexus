import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../../Pages/Loading/Loading";

const ManageSlots = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ["my-slots", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/my-slots?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const removeSlotMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/my-slots/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-slots", user?.email]);
      Swal.fire("Deleted!", "Your slot has been removed.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to remove slot.", "error");
    },
  });

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this slot!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeSlotMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">Manage My Slots</h2>

      {slots.length === 0 ? (
        <p className="text-center text-gray-400">
          You have no slots added yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/10 text-left rounded-lg">
            <thead>
              <tr className="bg-white/20">
                <th className="p-3">Title</th>
                <th className="p-3">Days</th>
                <th className="p-3">Time</th>
                <th className="p-3">Booked By</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id} className="border-b border-white/10">
                  <td className="p-3">{slot.title}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {slot.availableDays.map((day, idx) => (
                        <span
                          key={idx}
                          className="bg-green-500/20 px-2 py-0.5 rounded text-xs"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">{slot.availableTime}</td>
                  <td className="p-3">
                    {slot.bookedBy?.length > 0 ? (
                      <ul className="text-xs space-y-1">
                        {slot.bookedBy.map((b, idx) => (
                          <li key={idx}>
                            {b.name} ({b.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No bookings yet
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemove(slot._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                    >
                      Remove Slot
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageSlots;
