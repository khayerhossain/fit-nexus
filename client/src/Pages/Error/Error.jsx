import React from "react";
import Lottie from "react-lottie";
import errorAnimation from "../../assets/Animations/error.json"; 
import { Link } from "react-router";

const Error = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: errorAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-4 text-center">
      {/* Lottie Animation */}
      <div className="w-72 md:w-96">
        <Lottie options={defaultOptions} />
      </div>

      <Link
        to="/"
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;
