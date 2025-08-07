import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router";
import { FaBars } from "react-icons/fa";
import Sidebar from "../../DashboardPages/Sidebar/Sidebar";
import useRole from "../../Hooks/useRole";
import usePageTitle from "../../PageTitle/PageTitle";
import Loading from "../../Pages/Loading/Loading";

const DashboardLayout = () => {
  usePageTitle("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [role, isLoading] = useRole();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  // If it's exactly /dashboard (not /dashboard/something) then redirect by role
  if (location.pathname === "/dashboard") {
    if (role === "admin") {
      return <Navigate to="/dashboard/subscribers" replace />;
    }
    if (role === "trainer") {
      return <Navigate to="/dashboard/manage-slots" replace />;
    }
    if (role === "member") {
      return <Navigate to="/dashboard/activity-log" replace />;
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar role={role} closeSidebar={() => setIsOpen(false)} />
      </div>

      {/* Toggle Button for mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 md:hidden z-50 text-2xl text-white"
      >
        <FaBars />
      </button>

      {/* Sidebar Drawer (mobile) */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white/10 backdrop-blur-xl shadow-xl border-r border-white/20 z-40 md:hidden transition-all rounded-r-2xl">
          <Sidebar role={role} closeSidebar={() => setIsOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
