import { BACKEND_BASE } from "./config";

/**
 * Format image URL with backend base URL
 */
export const getImg = (src?: string): string => {
  if (!src) return "https://via.placeholder.com/300x200?text=No+Image";
  if (src.startsWith("http")) return src;
  return BACKEND_BASE + src;
};

/**
 * Format number to Vietnamese Dong currency
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Format date to dd/MM/yyyy HH:mm:ss format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const ampm = parseInt(hh) >= 12 ? "PM" : "AM";
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}` + ` ${ampm}`;
};
