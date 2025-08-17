import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AllTrainersCard from "../AllTrainersCard/AllTrainersCard";
import Container from "../../Components/Shared/Container/Container";
import Loading from "../Loading/Loading";
import { ArrowUpDown } from "lucide-react";

const AllTrainers = () => {
  const [sortOrder, setSortOrder] = useState("newest");

  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["trainers", sortOrder],
    queryFn: async () => {
      const res = await axios.get(`/trainers?sort=${sortOrder}`);
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">Meet Our Trainers</h2>
          <p className="text-gray-400 mt-2">
            Discover our experienced trainers dedicated to your fitness journey.
          </p>
        </div>

        {/* Sorting UI */}
        <div className="flex justify-end mb-6">
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none px-6 py-2 pr-10 rounded-xl bg-gray-800 text-white font-medium shadow-md focus:ring-2 cursor-pointer transition duration-300"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <ArrowUpDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <AllTrainersCard key={trainer._id} trainer={trainer} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default AllTrainers;
