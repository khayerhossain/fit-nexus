import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import axios from "axios";

const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useRole hook running, user:", user);

    if (!user?.email) {
      console.log("No user email found, setting role to null");
      setRole(null);
      setIsLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching role for email:", user.email);

        // Replace with your backend role API URL
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/role/${user
          .email}`
        );

        console.log("Role API response:", response.data);

        setRole(response.data.role || null);
      } catch (error) {
        console.error("Failed to fetch role:", error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  return [role, isLoading];
};

export default useRole;
