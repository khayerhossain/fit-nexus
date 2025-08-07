import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const AddClass = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const handleUploadImage = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const url = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_UPLOAD_KEY
      }`;
      const res = await axios.post(url, formData);
      setPhotoUrl(res.data.data.display_url);
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!photoUrl) {
      toast.error("Please upload an image.");
      return;
    }
    const classInfo = {
      title: data.title,
      image: photoUrl,
      trainerName: data.trainerName,
      availableSeats: parseInt(data.availableSeats),
      price: parseFloat(data.price),
      category: data.category,
      description: data.description,
    };

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/classes`, classInfo);
      toast.success("Class added successfully!");
      reset();
      setPhotoUrl("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add class.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white/10 p-6 rounded-xl text-white space-y-4">
      <h2 className="text-2xl font-bold mb-4">➕ Add New Class</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <input
            {...register("title", { required: true })}
            placeholder="Class Title"
            className="w-full px-3 py-2 rounded bg-white/20 text-white"
          />
          {errors.title && (
            <span className="text-red-400 text-xs">Title is required</span>
          )}
        </div>

        {/* Trainer Name */}
        <div>
          <input
            {...register("trainerName", { required: true })}
            placeholder="Trainer Name"
            className="w-full px-3 py-2 rounded bg-white/20 text-white"
          />
          {errors.trainerName && (
            <span className="text-red-400 text-xs">
              Trainer name is required
            </span>
          )}
        </div>

        {/* Available Seats */}
        <div>
          <input min={0}
            type="number"
            {...register("availableSeats", { required: true })}
            placeholder="Available Seats"
            className="w-full px-3 py-2 rounded bg-white/20 text-white"
          />
          {errors.availableSeats && (
            <span className="text-red-400 text-xs">Seats required</span>
          )}
        </div>

        {/* Price */}
        <div>
          <input min={0}
            type="number"
            step="0.01"
            {...register("price", { required: true })}
            placeholder="Price $"
            className="w-full px-3 py-2 rounded bg-white/20 text-white"
          />
          {errors.price && (
            <span className="text-red-400 text-xs">Price required</span>
          )}
        </div>

        {/* Category */}
        <div>
          <input
            {...register("category", { required: true })}
            placeholder="Category (Yoga, Cardio...)"
            className="w-full px-3 py-2 rounded bg-white/20 text-white"
          />
          {errors.category && (
            <span className="text-red-400 text-xs">Category required</span>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            {...register("description", { required: true })}
            placeholder="Description"
            className="w-full px-3 py-2 rounded bg-white/20 text-white"
          ></textarea>
          {errors.description && (
            <span className="text-red-400 text-xs">Description required</span>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <input
            type="file"
            onChange={handleUploadImage}
            className="block w-full text-xs text-white bg-white/10 rounded file:mr-2 file:py-2 file:px-3 file:bg-red-500 file:text-white hover:file:bg-red-600"
          />
          {uploading && (
            <p className="text-yellow-300 text-sm mt-1">Uploading...</p>
          )}
          {photoUrl && (
            <img src={photoUrl} className="w-24 h-24 rounded mt-2" />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-red-500 hover:bg-red-600 rounded text-white"
        >
          Add Class
        </button>
      </form>
    </div>
  );
};

export default AddClass;
