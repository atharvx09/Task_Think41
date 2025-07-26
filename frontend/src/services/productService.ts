// services/productService.ts
import api from "./api";

export const getProductById = async (productId: string) => {
  try {
    const res = await api.get(`/products/${productId}`);
    return res.data;
  } catch (error) {
    console.error("Product fetch error:", error);
    throw error;
  }
};
