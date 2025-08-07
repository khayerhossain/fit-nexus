import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axios from "axios";

const useUser = () => {
  const { user } = useAuth();
  const { data: userInfo = {}, isLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  return { userInfo, isLoading };
};

export default useUser;
