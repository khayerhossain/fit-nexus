import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Container from "../../Components/Shared/Container/Container";

const Newsletter = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  // Simple handleChange with console
  const handleChange = (e) => {
    console.log("Name:", e.target.name);
    console.log("Value:", e.target.value);

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      return Swal.fire("Error", "Please fill in all fields", "error");
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/subscribe`, form);
      Swal.fire("Subscribed!", "Thank you for joining our newsletter!", "success");
      setForm({ name: "", email: "" });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Swal.fire("Oops", "You are already subscribed", "info");
      } else {
        Swal.fire("Error", "Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black">
      <Container>
        <div className="max-w-2xl mx-auto text-center bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-6">
            Get the latest updates, offers & fitness tips directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 border border-red-500 text-red-500 rounded-md transition transform hover:scale-105 cursor-pointer"
            >
              {loading ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
