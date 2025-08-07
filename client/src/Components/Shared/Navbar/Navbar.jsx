import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Container from "../Container/Container";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import logo from "../../../assets/logo.png";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // hide navbar in login/register page
  const hideNavbarPaths = ["/login", "/register"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white/30 text-red-500 font-semibold"
      : "hover:bg-white/10";

  const handleLogout = () => {
    signOutUser();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between py-2">
          {/* Logo + Title together */}
          <Link to="/" className="flex items-center">
            <img className="w-8 h-8" src={logo} alt="Logo" />
            <span className="text-xl font-bold text-red-500 px-2 py-1 rounded-xl hover:bg-white/10 transition">
              FitNexus
            </span>
          </Link>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm lg:text-base transition ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>
            <Link
              to="/alltrainers"
              className={`px-3 py-2 rounded-xl text-sm lg:text-base transition ${isActive(
                "/alltrainers"
              )}`}
            >
              All Trainers
            </Link>
            <Link
              to="/allclasses"
              className={`px-3 py-2 rounded-xl text-sm lg:text-base transition ${isActive(
                "/allclasses"
              )}`}
            >
              All Classes
            </Link>
            <Link
              to="/community"
              className={`px-3 py-2 rounded-xl text-sm lg:text-base transition ${isActive(
                "/community"
              )}`}
            >
              Community
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-xl text-sm lg:text-base transition ${isActive(
                  "/dashboard-layout"
                )}`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link
                  to="/dashboard/profile"
                  className="p-1 rounded-full hover:bg-white/10 transition"
                >
                  <img
                    src={
                      user.photoURL || "https://i.ibb.co/y5Yj7vD/profile.png"
                    }
                    alt="Profile"
                    className="h-7 w-7 lg:h-8 lg:w-8 rounded-full object-cover"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl text-xs lg:text-sm text-white border border-white/30 hover:bg-white/10 transition hidden lg:block"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs lg:text-sm text-white border border-white/30 hover:bg-white/10 transition hidden lg:block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-xl text-xs lg:text-sm text-black bg-white hover:bg-gray-200 transition font-semibold hidden lg:block"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger menu */}
          <div className="dropdown dropdown-end md:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-black/80 backdrop-blur-md rounded-box w-40 space-y-1"
            >
              <li>
                <Link to="/" className={isActive("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/alltrainers" className={isActive("/alltrainers")}>
                  All Trainers
                </Link>
              </li>
              <li>
                <Link to="/allclasses" className={isActive("/allclasses")}>
                  All Classes
                </Link>
              </li>
              <li>
                <Link to="/community" className={isActive("/community")}>
                  Community
                </Link>
              </li>
              {user && (
                <li>
                  <Link
                    to="/dashboard"
                    className={isActive("/dashboard-layout")}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              {user ? (
                <>
                  <li>
                    <Link to="/dashboard/profile">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="w-full text-left">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
