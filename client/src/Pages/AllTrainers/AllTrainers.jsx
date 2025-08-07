import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AllTrainersCard from "../AllTrainersCard/AllTrainersCard";
import Container from "../../Components/Shared/Container/Container";
import Loading from "../Loading/Loading";

const AllTrainers = () => {
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const res = await axios.get(`/trainers`);
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
