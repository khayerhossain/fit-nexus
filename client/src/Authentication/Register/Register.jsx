import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import registerAnimation from "../../assets/Animations/login.json";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import usePageTitle from "../../PageTitle/PageTitle";

const Register = () => {
    usePageTitle("Register");
  const { createUser, updatedUser, signInWithGoogle } = useAuth();

  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(""); // New error state

  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUploadImage = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("image", image);

      const imageURL = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_UPLOAD_KEY
      }`;
      const res = await axios.post(imageURL, formData);
      setPhotoUrl(res.data.data.display_url);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("Image upload failed, please try again.");
      setPhotoUrl("");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!photoUrl) {
      setFormError("Please upload your photo first.");
      return;
    }

    try {
      await createUser(data.email, data.password);
      await updatedUser({ displayName: data.name, photoURL: photoUrl });

      const userInfo = {
        name: data.name,
        email: data.email,
        photo: photoUrl,
        role: "member",
        created_at: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_BASE_URL}/users`, userInfo);

      navigate(redirectPath);
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Registration failed:", error);
      setFormError("Registration failed. Try again."); 
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();

      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        role: "member",
        created_at: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_BASE_URL}/users`, userInfo);

      navigate(redirectPath);
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl px-4 py-12 mt-6">
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:flex flex-1 justify-center"
        >
          <Lottie
            animationData={registerAnimation}
            loop
            autoplay
            className="w-3/4 max-w-md"
          />
        </motion.div>

        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 flex justify-center"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 space-y-3"
          >
            <h2 className="text-2xl font-semibold text-center text-white mb-2">
              Create Account
            </h2>

            {/* Name */}
            <div>
              <label className="block mb-0.5 text-white text-xs">Name</label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-0.5">
                  {errors.name.message}
                </p>
              )}
            </div>

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

            {/* Photo upload */}
            <div>
              <label className="block mb-0.5 text-white text-xs">Photo</label>
              <input
                type="file"
                onChange={handleUploadImage}
                className="block w-full text-xs text-white bg-white/10 rounded-md cursor-pointer file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600"
              />
              {uploading && (
                <p className="text-sm text-yellow-400 mt-1">
                  Uploading photo...
                </p>
              )}
              {uploadError && (
                <p className="text-sm text-red-500 mt-1">{uploadError}</p>
              )}
              {photoUrl && !uploading && (
                <p className="text-sm text-green-400 mt-1">
                  Photo uploaded successfully!
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

            {/* 🔴 Form-wide error */}
            {formError && (
              <p className="text-center text-red-400 text-sm">{formError}</p>
            )}

            {/* Register button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md transition transform hover:scale-105 cursor-pointer"
            >
              Register
            </button>

            {/* or */}
            <div className="text-center text-white/60 text-xs">or</div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2 flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition"
            >
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-white/70 text-xs mt-3">
              Already have an account?{" "}
              <a href="/login" className="text-red-400 hover:underline">
                Login
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
