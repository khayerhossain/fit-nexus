import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router";
import Container from "../../Components/Shared/Container/Container";
import Loading from "../../Pages/Loading/Loading";

const RecentForums = () => {
  const { data: forums = [], isLoading } = useQuery({
    queryKey: ["recent-forums"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/recent-forums`
      );
      return res.data;
    },
  });

  if (isLoading)
<Loading/>
  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Latest Community Posts</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest topics from our vibrant fitness
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forums.map((forum, index) => (
            <motion.div
              key={forum._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-5 space-y-3 hover:shadow-xl transition hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={forum.userPhoto}
                  alt={forum.userName}
                  className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                />
                <div>
                  <h4 className="font-semibold">{forum.userName}</h4>
                  <span className="text-xs px-2 py-0.5 bg-red-500 rounded-full">
                    {forum.userRole}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">{forum.title}</h3>
                <p className="text-gray-300 text-sm">
                  {forum.description.length > 120
                    ? forum.description.slice(0, 120) + "..."
                    : forum.description}
                </p>
              </div>

              <p className="text-xs text-gray-400">
                Posted on: {new Date(forum.createdAt).toLocaleDateString()}
              </p>

              <Link
                to="/community"
                className="text-red-400 hover:text-red-500 text-xs"
              >
                View All Forums →
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default RecentForums;
