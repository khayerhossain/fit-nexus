import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { motion } from "framer-motion";
import Container from "../../Components/Shared/Container/Container";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";

const daysOptions = [
  { value: "Sun", label: "Sun" },
  { value: "Mon", label: "Mon" },
  { value: "Tue", label: "Tue" },
  { value: "Wed", label: "Wed" },
  { value: "Thu", label: "Thu" },
  { value: "Fri", label: "Fri" },
  { value: "Sat", label: "Sat" },
];

const skillsOptions = [
  "Weight Training",
  "Cardio",
  "Yoga",
  "Zumba",
  "Crossfit",
];

const BeATrainer = () => {
  const { user, loading } = useAuth();
  //   console.log("User:", user);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  if (loading) {
    return <Loading />;
  }

  // handle image file change
  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    if (!imageBase64) {
      toast.error("Please upload your profile image");
      return;
    }

    const payload = {
      fullName: data.fullName,
      email: user?.email || "unknown@example.com",
      age: data.age,
      profileImage: imageBase64,
      skills: data.skills || [],
      availableDays: data.availableDays.map((day) => day.value),
      availableTime: data.availableTime,
      status: "pending",
      appliedAt: new Date().toISOString(),
    };

    try {
      await axios.post(`/applied-trainers`,payload);
      toast.success("Trainer application submitted successfully!");
      reset();
      setImagePreview(null);
      setImageBase64("");
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    }
  };

  return (
    <section className="py-10 text-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto p-6 md:p-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-white">
            Apply to Be a Trainer
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Full Name */}
            <div>
              <label className="block mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: "Full Name is required" })}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your full name"
              />
              {errors.fullName && (
                <p className="text-red-400 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block mb-1 font-semibold">Age</label>
              <input
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 18, message: "Minimum age is 18" },
                  max: { value: 65, message: "Maximum age is 65" },
                })}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your age"
              />
              {errors.age && (
                <p className="text-red-400 mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-gray-300 cursor-not-allowed"
              />
            </div>

            {/* Profile Image + Skills in same row */}
            <div className="flex flex-col md:flex-row md:col-span-2 gap-6">
              {/* Profile Image */}
              <div className="flex-1">
                <label className="block mb-1 font-semibold">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="text-white"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-full border-2 border-white/30"
                    />
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Skills</label>
                <div className="flex flex-wrap gap-3">
                  {skillsOptions.map((skill) => (
                    <label
                      key={skill}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        value={skill}
                        {...register("skills")}
                        className="form-checkbox text-red-500"
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Days */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Available Days</label>
              <Controller
                name="availableDays"
                control={control}
                rules={{ required: "Please select available days" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={daysOptions}
                    isMulti
                    placeholder="Select days"
                    className="text-black"
                  />
                )}
              />
              {errors.availableDays && (
                <p className="text-red-400 mt-1">
                  {errors.availableDays.message}
                </p>
              )}
            </div>

            {/* Available Time */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Available Time</label>
              <input
                type="text"
                {...register("availableTime", {
                  required: "Available time is required",
                })}
                placeholder="E.g., 9 AM - 12 PM"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {errors.availableTime && (
                <p className="text-red-400 mt-1">
                  {errors.availableTime.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 text-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-transform transform hover:scale-105 font-semibold"
              >
                {isSubmitting ? "Submitting..." : "Apply Now"}
              </button>
            </div>
          </form>
        </motion.div>
      </Container>
    </section>
  );
};

export default BeATrainer;
