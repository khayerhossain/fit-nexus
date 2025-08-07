import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLoaderData } from "react-router";
import { Helmet } from "react-helmet";
import useAuth from "../../Hooks/useAuth";
import Container from "../../Components/Shared/Container/Container";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import BookingModal from "../../Pages/BookingModal/BookingModal";
import Select from "react-select";
import toast from "react-hot-toast";

const TrainerBookingForm = () => {
  const trainer = useLoaderData();
  const { user } = useAuth();

  const [packages, setPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [bookingTime, setBookingTime] = useState(""); // single input only

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/packages`)
      .then((res) => setPackages(res.data.packages))
      .catch((err) => console.error("Failed to fetch packages", err));
  }, []);

  const onSubmit = (data) => {
    if (!selectedPackageId) return alert("Please select a package");
    if (selectedClasses.length === 0)
      return toast.error("Please select at least one class");
    if (!data.selectedDays || data.selectedDays.length === 0)
      return toast.error("Please select at least one day");
    if (!bookingTime.trim()) return alert("Please enter a valid booking time");

    const selectedPackage = packages.find((p) => p._id === selectedPackageId);

    const bookingDetails = {
      trainerId: trainer._id,
      trainerName: trainer.fullName,
      trainerEmail: trainer.email,
      userName: user?.displayName || "Anonymous",
      userEmail: user?.email,
      days: data.selectedDays.map((d) => d.value),
      times: [bookingTime],
      notes: data.notes,
      bookingTime: new Date().toISOString(),
      package: selectedPackage,
      selectedClasses,
    };

    setBookingData(bookingDetails);
    setIsModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/bookings`,
        bookingData
      );
      toast.success("Booking successful!");
      reset();
      setSelectedClasses([]);
      setSelectedPackageId(null);
      setBookingTime("");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Booking failed");
      console.error(error);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black text-white min-h-screen">
      <Helmet>
        <title>FitNexus | Book {trainer.fullName}</title>
      </Helmet>
      <Container>
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Book MR. {trainer.fullName}
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Trainer Info */}
            <div>
              <label className="block mb-1 font-semibold">Trainer Name</label>
              <input
                readOnly
                disabled
                value={trainer.fullName}
                className="w-full px-4 py-2 rounded bg-white/10 text-gray-300"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Trainer Email</label>
              <input
                readOnly
                disabled
                value={trainer.email}
                className="w-full px-4 py-2 rounded bg-white/10 text-gray-300"
              />
            </div>

            {/* Multi-Select Days */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Select Days</label>
              <Controller
                name="selectedDays"
                control={control}
                rules={{ required: "Please select days" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={trainer.availableDays.map((d) => ({
                      label: d,
                      value: d,
                    }))}
                    className="text-black"
                    placeholder="Choose days..."
                  />
                )}
              />
              {errors.selectedDays && (
                <p className="text-red-400">{errors.selectedDays.message}</p>
              )}
            </div>

            {/* Booking Time - Single Input */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Booking Time</label>
              <input
                type="text"
                value={bookingTime}
                placeholder="e.g. 10 AM - 12 PM"
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-white/50"
              />
            </div>

            {/* Package Selection */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-2">Select a Package</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {packages.map((pkg, i) => {
                  const isSelected = selectedPackageId === pkg._id;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedPackageId(pkg._id)}
                      className={`relative cursor-pointer p-4 rounded-xl transition-all duration-200 border
                        ${
                          isSelected
                            ? "border-4 border-green-500 bg-green-700/30"
                            : "border-white/20 bg-white/5 hover:border-green-400 opacity-70 hover:opacity-100"
                        }`}
                    >
                      {isSelected && (
                        <CheckCircle
                          className="absolute top-2 right-2 text-green-400"
                          size={24}
                        />
                      )}
                      <h4 className="text-lg font-bold">{pkg.name}</h4>
                      <p className="text-green-400 font-semibold">
                        ${pkg.price}
                      </p>
                      <ul className="text-sm mt-2 text-gray-300 list-disc list-inside">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Select Classes */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-2">Select Classes</h3>
              <div className="flex flex-wrap gap-4">
                {trainer.skills.map((skill, i) => (
                  <label key={i} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={selectedClasses.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedClasses((prev) => [...prev, skill]);
                        else
                          setSelectedClasses((prev) =>
                            prev.filter((s) => s !== skill)
                          );
                      }}
                      className="form-checkbox text-red-500"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* User Info */}
            <div>
              <label className="block mb-1 font-semibold">Your Name</label>
              <input
                readOnly
                disabled
                value={user?.displayName || "Anonymous"}
                className="w-full px-4 py-2 rounded bg-white/10 text-gray-300"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Your Email</label>
              <input
                readOnly
                disabled
                value={user?.email || "unknown@example.com"}
                className="w-full px-4 py-2 rounded bg-white/10 text-gray-300"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">
                Additional Notes
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-white/50"
                placeholder="Any specific instructions or questions?"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all hover:scale-105 cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </Container>

      {/* Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleFinalConfirm}
        bookingInfo={bookingData}
      />
    </section>
  );
};

export default TrainerBookingForm;
