import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../../Components/Shared/Container/Container";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "../../Pages/Loading/Loading";

const Reviews = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () =>
      await axios
        .get(`${import.meta.env.VITE_BASE_URL}/reviews`)
        .then((res) => res.data),
  });

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // +1 for next, -1 for prev

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const getIndex = (offset) =>
    (current + offset + reviews.length) % reviews.length;

  if (isLoading) return <Loading />;

  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <Container>
        <h2 className="text-3xl font-bold mb-10 text-center">
          🌟 User Reviews
        </h2>
        <div className="flex justify-center items-center relative max-w-4xl mx-auto h-80 overflow-hidden">
          {/* Left preview */}
          <div className="absolute left-4 hidden md:block opacity-30 scale-90 blur-sm -translate-x-6">
            <ReviewCard review={reviews[getIndex(-1)]} />
          </div>

          {/* Animated main card */}
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={reviews[current]?._id || current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="z-10"
            >
              <ReviewCard review={reviews[current]} />
            </motion.div>
          </AnimatePresence>

          {/* Right preview */}
          <div className="absolute right-4 hidden md:block opacity-30 scale-90 blur-sm translate-x-6">
            <ReviewCard review={reviews[getIndex(1)]} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-md transition"
          >
            <ChevronLeft size={20} /> Prev
          </button>
          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-md transition"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </Container>
    </section>
  );
};

// Motion variants to animate left or right based on direction
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

const ReviewCard = ({ review }) => {
  if (!review) return null;
  return (
    <div className="w-80 h-72 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center space-y-3 shadow-xl mx-auto flex flex-col justify-center">
      <img
        src={review.userPhoto}
        alt={review.userName}
        className="w-16 h-16 mx-auto rounded-full object-cover border border-white/20"
      />
      <h3 className="text-lg font-semibold">{review.userName}</h3>
      <p className="text-yellow-400">⭐ {review.rating} / 5</p>
      <p className="text-gray-300 text-sm line-clamp-3">{review.feedback}</p>
    </div>
  );
};

export default Reviews;
