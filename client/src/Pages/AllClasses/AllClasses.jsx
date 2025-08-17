import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import AllClassesCard from "../AllClassesCard/AllClassesCard";
import Container from "../../Components/Shared/Container/Container";
import usePageTitle from "../../PageTitle/PageTitle";
import Loading from "../Loading/Loading";
import { ArrowUpDown } from "lucide-react"; // icon

const AllClasses = () => {
  usePageTitle("All Classes");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest"); // default newest
  const limit = 6;

  const { data, isLoading } = useQuery({
    queryKey: ["classes", page, sortOrder],
    queryFn: async () => {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/classes?page=${page}&limit=${limit}&sort=${sortOrder}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const { result = [], total = 0 } = data || {};
  const totalPages = Math.ceil(total / limit);

  return (
    <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Container>
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">Here is our all Classes</h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Explore a variety of classes led by expert trainers. Find the
            perfect session that fits your style, goals, and schedule.
          </p>
        </div>

        {/* Sorting (Right Side) */}
        <div className="flex justify-end mb-6">
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => {
                setPage(1); // reset page when sort changes
                setSortOrder(e.target.value);
              }}
              className="appearance-none px-6 py-2 rounded-xl bg-gray-800 text-white font-medium shadow-lg border focus:ring-2 cursor-pointer transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            {/* Icon */}
            <ArrowUpDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.map((cls) => (
            <AllClassesCard key={cls._id} cls={cls} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num}
                onClick={() => setPage(num + 1)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  page === num + 1
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {num + 1}
              </button>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default AllClasses;
