import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router";
import Container from "../Container/Container";
import logo from "../../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-14">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* Logo + Name */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center">
              <img className="w-12 h-10" src={logo} alt="Logo" />
              <span className="text-xl font-bold text-red-500 mt-2 py-1 rounded-xl hover:bg-white/10 transition">
                FitNexus
              </span>
            </Link>
            <p className="max-w-xs mt-2">
              Empowering your fitness journey with expert trainers and smart
              tools.
            </p>
          </div>

          {/* Terms & Policy */}
          <div>
            <h4 className="text-white font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
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

          {/* Social Media + Payment */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow & Pay</h4>

            {/* Social Media */}
            <div className="flex space-x-4 text-xl mb-4">
              <a
                href="https://www.facebook.com/share/1CUzuCoed7/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-500"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/khayerhossain_45?igsh=NXNrOGY3dWwyYzlo"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-500"
              >
                <FaInstagram />
              </a>
              <a
                href="https://x.com/khayerhossain45"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400"
              >
                <FaTwitter />
              </a>
              <a
                href="mailto:khayerhossain62@gmail.com"
                className="hover:text-green-400"
              >
                <FaEnvelope />
              </a>
            </div>

            {/* Payment Cards */}
            <div className="flex space-x-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="w-10 h-7 object-contain rounded-lg shadow-md bg-white p-1 cursor-pointer transform transition duration-300 hover:scale-110 hover:shadow-lg"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
                className="w-10 h-7 object-contain rounded-lg shadow-md bg-white p-1 cursor-pointer transform transition duration-300 hover:scale-110 hover:shadow-lg"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="MasterCard"
                className="w-10 h-7 object-contain rounded-lg shadow-md bg-white p-1 cursor-pointer transform transition duration-300 hover:scale-110 hover:shadow-lg"
              />
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
