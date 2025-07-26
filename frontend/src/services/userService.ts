// services/userService.ts
import api from "./api";

export const getUserById = async (userId: string) => {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (error) {
    console.error("User fetch error:", error);
    throw error;
  }
};
