// services/orderService.ts
import api from "./api";

export const getUserOrders = async (userId: string) => {
  try {
    const res = await api.get(`/orders/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Order fetch error:", error);
    throw error;
  }
};
