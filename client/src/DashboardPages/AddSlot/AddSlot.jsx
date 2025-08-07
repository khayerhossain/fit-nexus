import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const AddSlot = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const slotData = {
        trainerEmail: user?.email,
        title: data.title,
        availableDays: data.availableDays.split(",").map((d) => d.trim()),
        availableTime: data.availableTime,
        skills: data.skills.split(",").map((s) => s.trim()),
        description: data.description,
        profileImage: photoUrl,
        status: "trainer",
        createdAt: new Date(),
      };
      await axios.post(`${import.meta.env.VITE_BASE_URL}/classes`, slotData);
      toast.success(" Class added Successfully!");
      reset();
      setPhotoUrl("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add slot.");
    }
  };

  const handleUploadImage = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;
      const res = await axios.post(url, formData);
      setPhotoUrl(res.data.data.display_url);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 text-white rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Add New Slot</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Class Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full bg-white/20 px-3 py-2 rounded"
            placeholder="e.g., Yoga, HIIT, etc."
          />
          {errors.title && <p className="text-red-400 text-xs">Title is required</p>}
        </div>

        <div>
          <label className="block text-sm">Available Days (Comma Separated)</label>
          <input
            {...register("availableDays", { required: true })}
            className="w-full bg-white/20 px-3 py-2 rounded"
            placeholder="Mon, Wed, Fri"
          />
          {errors.availableDays && <p className="text-red-400 text-xs">Required</p>}
        </div>

        <div>
          <label className="block text-sm">Available Time</label>
          <input
            {...register("availableTime", { required: true })}
            className="w-full bg-white/20 px-3 py-2 rounded"
            placeholder="e.g., 10:00 AM - 12:00 PM"
          />
          {errors.availableTime && <p className="text-red-400 text-xs">Required</p>}
        </div>

        <div>
          <label className="block text-sm">Skills (Comma Separated)</label>
          <input
            {...register("skills", { required: true })}
            className="w-full bg-white/20 px-3 py-2 rounded"
            placeholder="Yoga, Pilates, Strength"
          />
          {errors.skills && <p className="text-red-400 text-xs">Required</p>}
        </div>

        <div>
          <label className="block text-sm">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full bg-white/20 px-3 py-2 rounded"
            placeholder="Write something about this class..."
          />
          {errors.description && <p className="text-red-400 text-xs">Required</p>}
        </div>

        <div>
          <label className="block text-sm">Upload Image</label>
          <input
            type="file"
            onChange={handleUploadImage}
            className="w-full text-xs bg-white/10 rounded file:bg-red-500 file:text-white file:px-3 file:py-2"
          />
          {uploading && <p className="text-yellow-300 text-xs">Uploading...</p>}
          {photoUrl && (
            <img src={photoUrl} alt="Preview" className="w-24 h-24 rounded-full mt-2" />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-red-500 hover:bg-red-600 rounded"
        >
          Add Slot / Class
        </button>
      </form>
    </div>
  );
};

export default AddSlot;
