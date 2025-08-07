import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaUsers,
  FaCalendarCheck,
  FaDumbbell,
} from "react-icons/fa";
import Container from "../../Components/Shared/Container/Container";

const Featured = () => {
  const features = [
    {
      icon: <FaHeartbeat className="text-4xl text-red-500 mb-4" />,
      title: "Track Your Progress",
      desc: "Monitor your workouts, goals, and progress easily through our smart dashboard.",
    },
    {
      icon: <FaUsers className="text-4xl text-blue-500 mb-4" />,
      title: "Join the Community",
      desc: "Connect with fitness lovers, share tips, and motivate each other in forums.",
    },
    {
      icon: <FaCalendarCheck className="text-4xl text-green-500 mb-4" />,
      title: "Easy Class Booking",
      desc: "Book your favorite classes with top trainers — all from one place.",
    },
    {
      icon: <FaDumbbell className="text-4xl text-yellow-500 mb-4" />,
      title: "Expert Trainers",
      desc: "Get trained by certified professionals for personalized workouts.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">Why Choose FitNexus</h2>
          <p className="text-gray-400 mt-2">
            Key features that make your fitness journey smarter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-center border border-white/20 hover:shadow-2xl transition-all duration-300"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Featured;
