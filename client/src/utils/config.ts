/**
 * Centralized configuration for environment variables and constants
 */

// Environment variables with fallbacks
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const SIGNALR_URL =
  import.meta.env.VITE_SIGNALR_URL || "http://localhost:5000/orderhub";

// Derived constants
export const BACKEND_BASE = API_BASE.replace("/api", "");

// Exported constants
export const config = {
  API_BASE,
  SIGNALR_URL,
  BACKEND_BASE,
};

export default config;
