import React from "react";
import { Link, useLoaderData } from "react-router";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import Container from "../../Components/Shared/Container/Container";

const TrainersDetails = () => {
  const trainer = useLoaderData();

  return (
    <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
      <Helmet>
        <title>FitNexus | Trainer - {trainer.fullName}</title>
      </Helmet>

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden md:flex"
        >
          {/* Image part */}
          <div className="md:flex-shrink-0 flex justify-center items-center p-8 bg-white/5">
            <motion.img
              src={trainer.profileImage}
              alt={trainer.fullName}
              className="h-48 w-48 rounded-full object-cover border-4 border-red-500"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>

          {/* Info part */}
          <div className="p-8 flex flex-col justify-center text-white w-full">
            <h1 className="uppercase tracking-wide text-sm text-red-400 font-semibold">
              Trainer Profile
            </h1>
            <h2 className="block mt-1 text-3xl md:text-4xl font-extrabold">
              {trainer.fullName}
            </h2>

            {/* Two columns for details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-6 text-gray-300">
              <p>
                <strong>Email:</strong> {trainer.email}
              </p>
              <p>
                <strong>Age:</strong> {trainer.age}
              </p>

              {/* Skills */}
              <div>
                <strong>Skills:</strong>
                <ul className="flex flex-wrap gap-2 mt-1">
                  {trainer.skills.map((skill, i) => (
                    <li
                      key={i}
                      className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Available Days */}
              <div>
                <strong>Available Days:</strong>
                <ul className="flex flex-wrap gap-2 mt-1">
                  {trainer.availableDays.map((day, i) => (
                    <li
                      key={i}
                      className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {day}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Available Time */}
              <p className="md:col-span-2 mt-4">
                <strong>Available Time:</strong> {trainer.availableTime}
              </p>
            </div>

            {/* Book Now button */}
            <div className="mt-8">
              <Link to={`/trainer-booking-form/${trainer._id}`}>
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105 cursor-pointer"
                >
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default TrainersDetails;
