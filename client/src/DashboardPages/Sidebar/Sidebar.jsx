import React from "react";
import { NavLink } from "react-router";
import {
  FaTimes,
  FaHome,
  FaUserTie,
  FaEnvelopeOpenText,
  FaCalendarAlt,
  FaPlusCircle,
  FaSlidersH,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";

const Sidebar = ({ closeSidebar, role }) => {
  return (
    <aside className="w-64 h-full p-5 bg-white/10 backdrop-blur-xl border-r border-white/20 rounded-r-2xl shadow-xl flex flex-col gap-4 relative text-white">
      {/* Close button for mobile */}
      {closeSidebar && (
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 md:hidden text-2xl text-white"
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      )}

      <h2 className="text-2xl font-bold mb-6 mt-2">Dashboard</h2>

      <nav className="flex flex-col gap-2">
        {/* Admin Menu */}
        {role === "admin" && (
          <>
            <NavLink
              to="/dashboard/all-trainers-table"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaUserTie /> All Trainers
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaUser /> Profile
            </NavLink>

            <NavLink
              to="/dashboard/subscribers"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaEnvelopeOpenText /> Subscribers
            </NavLink>

            <NavLink
              to="/dashboard/applied-trainers"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaPlusCircle /> Applied Trainers
            </NavLink>

            <NavLink
              to="/dashboard/balance"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaSlidersH /> Balance
            </NavLink>

            <NavLink
              to="/dashboard/addclass"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaClipboardList /> Add Class
            </NavLink>
          </>
        )}

        {/* Trainer Menu */}
        {role === "trainer" && (
          <>
            <NavLink
              to="/dashboard/manage-slots"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaClipboardList /> Manage Slots
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaUser /> Profile
            </NavLink>

            <NavLink
              to="/dashboard/add-slot"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaPlusCircle /> Add Slot
            </NavLink>
          </>
        )}

        {/* Member Menu */}
        {role === "member" && (
          <>
            <NavLink
              to="/dashboard/activity-log"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaClipboardList /> Activity Log
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaUser /> Profile
            </NavLink>

            <NavLink
              to="/dashboard/be-a-trainer"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaUser /> Be A Trainer
            </NavLink>

            <NavLink
              to="/dashboard/my-bookings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-white text-red-600 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <FaCalendarAlt /> My Bookings
            </NavLink>
          </>
        )}

        {/* Common Link */}
        <NavLink
          to="/dashboard/addforum"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              isActive
                ? "bg-white text-red-600 font-semibold"
                : "hover:bg-white/20"
            }`
          }
        >
          <FaUser /> Add Forum
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              isActive
                ? "bg-white text-red-600 font-semibold"
                : "hover:bg-white/20"
            }`
          }
        >
          <FaHome /> Back Home
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
