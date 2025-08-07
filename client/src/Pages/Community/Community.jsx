import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Icons for pagination
import Container from "../../Components/Shared/Container/Container";
import Loading from "../Loading/Loading";
import usePageTitle from "../../PageTitle/PageTitle";

const Community = () => {
  usePageTitle("Community");

  const [page, setPage] = useState(1);
  const limit = 6;

  const { data = {}, isLoading } = useQuery({
    queryKey: ["forums", page],
    queryFn: async () => {
      const res = await axios.get(`/forums?page=${page}&limit=${limit}`);
      return res.data; // { total, result }
    },
    keepPreviousData: true,
  });

  const forums = data.result || [];
  const total = data.total || 0;
  const totalPages = Math.ceil(total / limit);

  if (isLoading) return <Loading />;

  return (
    <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Container>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Community Forums</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect, share ideas, ask questions, and support each other in our
            growing fitness community.
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
                <p className="text-gray-300 text-sm">{forum.description}</p>
              </div>

              <p className="text-xs text-gray-400">
                Posted on: {new Date(forum.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Prev
            </button>

            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num}
                onClick={() => setPage(num + 1)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  page === num + 1
                    ? "bg-red-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {num + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 text-gray-300 hover:bg-white/20 disabled:opacity-40"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Community;
