import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import axiosSecure from "../../Hooks/useAxiosSecure";
import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../Pages/Loading/Loading";

const Profile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [name, setName] = useState("");

  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/profile/${user?.email}`);
      setName(res.data.name);
      setPhotoUrl(res.data.photo);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleUploadImage = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const imageURL = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_UPLOAD_KEY
      }`;
      const res = await axios.post(imageURL, formData);
      setPhotoUrl(res.data.data.display_url);
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(
        `/profile/${user?.email}`,
        updatedData
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", user?.email]);
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile.");
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    mutation.mutate({
      name: name || profile.name,
      photo: photoUrl || profile.photo,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="py-16 text-white">
      <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10 space-y-6 text-center">
        <h2 className="text-2xl font-bold mb-4">👤 My Profile</h2>

        <div className="flex justify-center">
          <img
            src={photoUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-red-500 shadow"
          />
        </div>

        {/* Profile Info - Centered */}
        <div className="space-y-2 text-base font-medium">
          <p>
            <span className="text-gray-400">Name:</span> {profile.name}
          </p>
          <p>
            <span className="text-gray-400">Email:</span> {profile.email}
          </p>
          <p>
            <span className="text-gray-400">Role:</span>{" "}
            {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
          </p>
          <p>
            <span className="text-gray-400">Joined:</span>{" "}
            {new Date(
              profile.createdAt || profile.created_at
            ).toLocaleDateString()}
          </p>
        </div>

        <hr className="border-white/10 my-4" />

        <form onSubmit={handleUpdate} className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1">Update Name</label>
            <input
              type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Update Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              className="w-full text-xs bg-white/10 rounded file:mr-2 file:py-1 file:px-3 file:bg-red-500 file:text-white cursor-pointer"
            />
            {uploading && (
              <p className="text-yellow-300 text-xs mt-1">Uploading...</p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold text-sm transition-all hover:scale-105"
          >
            {mutation.isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Profile;
