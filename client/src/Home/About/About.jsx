import React from "react";
import { motion } from "framer-motion";
import Container from "../../Components/Shared/Container/Container";

const About = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text Content with animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              About <span className="text-red-500">FitNexus</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-4">
              FitNexus is your ultimate fitness companion, built to help you
              crush your health goals. Whether you're a newbie or a pro, our
              platform offers personalized tracking, expert trainers, and smart
              tools — all in one place.
            </p>
            <p className="text-gray-300 text-base md:text-lg mb-4">
              We’re not just a fitness app — we’re a community. From booking
              classes to sharing your progress, everything is designed to keep
              you moving forward. With real-time tracking and interactive
              features, FitNexus turns your fitness grind into a lifestyle.
            </p>
            <p className="text-gray-100 font-semibold mt-4">
              Empower your workout. Track smarter. Live healthier.
            </p>
          </motion.div>

          {/* Image with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
              alt="About FitNexus"
              className="w-full rounded-xl shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default About;
