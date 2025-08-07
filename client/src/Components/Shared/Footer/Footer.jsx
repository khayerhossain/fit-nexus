import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router";
import Container from "../Container/Container"; // Adjust path if needed
import logo from "../../../assets/logo.png"; // Adjust path if needed

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <Container>
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          {/* Logo + Name */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold text-red-500">FitNexus</span>
            </Link>
            <p className="max-w-xs">
              Empowering your fitness journey with expert trainers and smart
              tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/alltrainers" className="hover:text-white">
                  All Trainers
                </Link>
              </li>
              <li>
                <Link to="/allclasses" className="hover:text-white">
                  All Classes
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-white">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p>Email: support@fitnexus.com</p>
            <p>Phone: +880-1234-567890</p>
            <p>Address: Gulshan, Dhaka, Bangladesh</p>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-500"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-500"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400"
              >
                <FaTwitter />
              </a>
              <a
                href="mailto:support@fitnexus.com"
                className="hover:text-green-400"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-10 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} FitNexus. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
