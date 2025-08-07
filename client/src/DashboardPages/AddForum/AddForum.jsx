import { useForm } from "react-hook-form";
import axios from "axios";
import useUser from "../../Hooks/useUser";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import Loading from "../../Pages/Loading/Loading";

const AddForum = () => {
  const { userInfo, isLoading } = useUser();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const forumData = {
      ...data,
      userName: userInfo?.name || "Anonymous",
      userEmail: userInfo?.email,
      userRole: userInfo?.role,
      userPhoto: userInfo?.photo,
      createdAt: new Date(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/forum`, forumData);
      reset();
      toast.success("Forum post added successfully!");
    } catch (err) {
      console.error("Failed to add forum post:", err);
      toast.error("Something went wrong!");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <section className="py-12 text-white">
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-lg">
        <div className="flex justify-center items-center gap-2 mb-6">
          <PencilSquareIcon className="w-7 h-7 text-red-500" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Add New Post
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("title", { required: true })}
              placeholder="Forum Title"
              className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <textarea
              {...register("description", { required: true })}
              placeholder="Write your forum description..."
              rows="4"
              className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md font-semibold text-white transition cursor-pointer ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddForum;
