import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import loginAnimation from "../../assets/Animations/login.json";
import useAuth from "../../Hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import usePageTitle from "../../PageTitle/PageTitle";

const Login = () => {
  usePageTitle("Login");
  const { signInUser, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      await signInUser(email, password);
      navigate(redirectPath);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const loggedInUser = result.user;

      const userData = {
        name: loggedInUser.displayName,
        email: loggedInUser.email,
        photo: loggedInUser.photoURL,
        role: "member",
        createdAt: new Date(),
      };

      await axios.post(`${import.meta.env.VITE_BASE_URL}/users`, userData);

      navigate(redirectPath);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch w-full lg:max-w-4xl py-12 mt-6 px-4 md:px-6">
        {/* Left Animation */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:flex flex-1 justify-center"
        >
          <Lottie
            animationData={loginAnimation}
            loop
            autoplay
            className="w-3/4 max-w-md"
          />
        </motion.div>

        {/* Right Form */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-none bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 space-y-3"
          >
            <h2 className="text-2xl font-semibold text-center text-white mb-2">
              Welcome Back
            </h2>

            {/* Email */}
            <div>
              <label className="block mb-0.5 text-white text-xs">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-0.5 text-white text-xs">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                placeholder="••••••••"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-6.5 right-3 cursor-pointer text-white"
              >
                {showPassword ? (
                  <AiFillEye size={20} />
                ) : (
                  <AiFillEyeInvisible size={20} />
                )}
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md transition transform hover:scale-105 cursor-pointer"
            >
              Login
            </button>

            <div className="text-center text-white/60 text-xs">or</div>

            {/* Google login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2 flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition cursor-pointer"
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-white/70 text-xs mt-3">
              Don’t have an account?{" "}
              <a href="/register" className="text-red-400 hover:underline">
                Register
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
