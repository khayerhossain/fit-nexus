import React from "react";
import { motion } from "framer-motion";
import Container from "../../Components/Shared/Container/Container";

const trainerData = [
  {
    id: 1,
    name: "Ayesha Rahman",
    photo: "https://i.ibb.co/BbPnMJM/download-1.jpg",
    bio: "Certified yoga instructor helping clients find balance and peace.",
    expertise: ["Yoga", "Mindfulness", "Breathwork"],
  },
  {
    id: 2,
    name: "Tanvir Ahmed",
    photo: "https://i.ibb.co/XrdzFW59/KONG-PRO-FITNESS.jpg",
    bio: "Body transformation specialist focused on strength and endurance.",
    expertise: ["Weight Training", "Strength", "Cardio"],
  },
  {
    id: 3,
    name: "Maria Islam",
    photo: "https://i.ibb.co/jvHQzdCS/download.jpg",
    bio: "Energetic trainer known for high-intensity Zumba and group fitness.",
    expertise: ["Zumba", "Dance Fitness", "HIIT"],
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">Meet Our Trainers</h2>
          <p className="text-gray-400">
            Passionate, certified and ready to guide you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainerData.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={trainer.photo}
                  alt={trainer.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-indigo-400 shadow"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {trainer.name}
              </h3>
              <p className="text-sm text-gray-300 mb-4">{trainer.bio}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {trainer.expertise.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-500/20 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TeamSection;
