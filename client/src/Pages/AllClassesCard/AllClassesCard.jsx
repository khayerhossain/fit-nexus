import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router"; 

const AllClassesCard = ({ cls }) => {
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["trainers-by-class", cls.category],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/trainers`);
      return res.data.filter((trainer) =>
        trainer.skills?.some(
          (skill) => skill.toLowerCase() === cls.category.toLowerCase()
        )
      );
    },
  });

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow hover:shadow-lg transition">
      <img
        src={cls.image}
        alt={cls.title}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h3 className="text-lg font-semibold mb-1">{cls.title}</h3>
      <p className="text-xs text-gray-300 mb-2">{cls.description}</p>
      <div className="space-y-1 text-sm">
        <p>👤 Trainer: {cls.trainerName}</p>
        <p>💺 Seats: {cls.availableSeats}</p>
        <p>💲 Price: ${cls.price}</p>
        <p>🏷️ Category: {cls.category}</p>
      </div>

      {/* Related Trainers */}
      {!isLoading && trainers.length > 0 && (
        <div className="flex gap-2 mt-3">
          {trainers.slice(0, 5).map((trainer) => (
            <Link key={trainer._id} to={`/trainers-details/${trainer._id}`}>
              <img
                src={trainer.profileImage}
                className="w-8 h-8 rounded-full border border-white/20 object-cover hover:scale-110 transition"
                title={trainer.fullName}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllClassesCard;
