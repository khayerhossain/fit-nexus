import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import CountUp from "react-countup";
import { FireIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Container from "../../Components/Shared/Container/Container";
import Loading from "../../Pages/Loading/Loading";

const FeaturedClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/most-booked-classes`)
      .then((res) => {
        setClasses(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch featured classes", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <Container>
        <div className="text-center mb-10">
          <h2 className="flex justify-center items-center text-4xl font-bold mb-2 gap-2">
            <FireIcon className="w-7 h-7 text-red-500" /> Featured Classes
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Top 5 most booked classes based on user popularity!
          </p>
        </div>

        {/* Cards container */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {classes.slice(0, 5).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex-shrink-0 w-60 md:w-auto bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-md hover:bg-white/20 transition-transform hover:-translate-y-1 shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-2 line-clamp-1">
                  {item.title || item.name || "Untitled Class"}
                </h3>
                <p className="text-gray-300 text-xs mb-4 line-clamp-3">
                  {item.description ||
                    "Explore our top-rated class to boost your skills and fitness journey!"}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 text-green-400 text-2xl font-bold mt-auto">
                <UserGroupIcon className="w-5 h-5" />
                <CountUp
                  start={0}
                  end={item.bookingCount || 0}
                  duration={1.5}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedClasses;
