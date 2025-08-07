import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import Container from "../../Components/Shared/Container/Container";

const slides = [
  {
    id: 1,
    title: "Unleash Your Power",
    subtitle: "Strength & Conditioning",
    description:
      "Build muscle and boost endurance with our expert-designed workout plans and equipment.",
    image:
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
    buttonText: "Explore Workouts",
    buttonLink: "/workouts",
  },
  {
    id: 2,
    title: "Feel the Burn",
    subtitle: "High-Intensity Cardio",
    description:
      "Burn calories and improve heart health with our range of HIIT and cardio programs.",
    image: "https://i.ibb.co/S4s77Fkp/e02af83b-0148-40ab-bf6c-df8883e65191.jpg",
    buttonText: "Join Classes",
    buttonLink: "/classes",
  },
  {
    id: 3,
    title: "Stretch & Recover",
    subtitle: "Flexibility & Mobility",
    description:
      "Enhance recovery and reduce injury risk with guided stretching and mobility sessions.",
    image: "https://i.ibb.co/SDYNg6wq/dust-your-hands-503416862.webp",
    buttonText: "Start Now",
    buttonLink: "/recovery",
  },
  {
    id: 4,
    title: "Stretch & Recover",
    subtitle: "Flexibility & Mobility",
    description:
      "Enhance recovery and reduce injury risk with guided stretching and mobility sessions.",
    image:
      "https://i.ibb.co/bZ3fxwr/Personal-Trainer-Training-Partner-Getty-Images-654427364.webp",
    buttonText: "Start Now",
    buttonLink: "/recovery",
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <section
      className="relative min-h-[60vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[90vh] xl:min-h-[95vh] pt-10 lg:pt-20 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Text */}
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-full lg:w-1/2 text-center lg:text-left text-white space-y-4 mt-8 sm:mt-10"
            >
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm">
                {slides[currentSlide].subtitle}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                {slides[currentSlide].title}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg max-w-md mx-auto lg:mx-0">
                {slides[currentSlide].description}
              </p>
              <div className="flex justify-center lg:justify-start gap-3">
                <Link
                  to={slides[currentSlide].buttonLink}
                  className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  {slides[currentSlide].buttonText}
                </Link>
                <Link
                  to="/about"
                  className="text-white border border-white px-5 py-2 rounded-xl hover:bg-white hover:text-black transition"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full lg:w-1/2"
            >
              <img
                src={slides[currentSlide].image}
                alt=""
                className="w-full h-52 md:h-60 lg:h-72 xl:h-80 object-cover rounded-3xl shadow-2xl mt-4 lg:mt-12 mb-3"
              />
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 rounded-full hover:bg-white/30"
      >
        <ChevronLeftIcon className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 rounded-full hover:bg-white/30"
      >
        <ChevronRightIcon className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Progress */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20">
        <motion.div
          key={currentSlide}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-white"
        />
      </div>
    </section>
  );
};

export default Banner;
