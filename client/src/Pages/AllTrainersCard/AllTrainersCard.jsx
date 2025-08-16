import { useNavigate } from "react-router";

const AllTrainersCard = ({ trainer }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-5 text-center hover:shadow-2xl transition duration-300">
      <img
        src={trainer.profileImage}
        alt={trainer.name}
        className="w-full h-60 object-cover rounded-xl mb-4"
      />
      <h2 className="text-xl font-semibold text-white">{trainer.fullName}</h2>
      <p className="text-gray-300 text-sm">
        Experience: {trainer.experience || "2+ Years"}
      </p>
      <p className="text-gray-300 text-sm">
        Skills: {trainer.skills?.join(", ")}
      </p>
      <p className="text-gray-300 text-sm mb-3">
        Days: {trainer.availableDays?.join(", ")}
      </p>

      <button
        className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
        onClick={() => navigate(`/trainers-details/${trainer._id}`)}
      >
        Know More
      </button>
    </div>
  );
};

export default AllTrainersCard;
