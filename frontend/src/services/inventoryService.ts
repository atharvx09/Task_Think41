// services/inventoryService.ts
import api from "./api";

export const checkProductAvailability = async (productId: string) => {
  try {
    const res = await api.get(`/inventory/check/${productId}`);
    return res.data;
  } catch (error) {
    console.error("Inventory check error:", error);
    throw error;
  }
};
