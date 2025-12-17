import axios from "axios";
import { config } from "./utils/config";

export const api = axios.create({
  baseURL: config.API_BASE,
});

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  products: Product[];
  totalAmount: number;
  paymentTime: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  return res.data;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await api.get("/orders");
  return res.data;
};

export const createOrder = async (productIds: number[]): Promise<Order> => {
  const res = await api.post("/orders", productIds);
  return res.data;
};
