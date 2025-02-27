import axios, { AxiosInstance } from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const API_URL = "http://127.0.0.1:8000/api/v1";

const commonHeaders = {
   "Content-Type": "application/json",
};

const unauthorizedAxiosInstance: AxiosInstance = axios.create({
   baseURL: API_URL,
   headers: commonHeaders,
});

const authorizedAxiosInstance: AxiosInstance = axios.create({
   baseURL: API_URL,
   headers: commonHeaders,
});

authorizedAxiosInstance.interceptors.request.use(
   async (config) => {
      // Get token directly from cookies
      const token = cookies.get("access_token");
      console.log("Token from cookie:", token); // Debug log

      if (token) {
         config.headers["Authorization"] = `Bearer ${token}`;
         config.withCredentials = true; // Important for CORS
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Add response interceptor to handle unauthorized responses
authorizedAxiosInstance.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
         // Clear token and redirect to login
         cookies.remove("access_token", { path: "/" });
         window.location.href = "/login";
      }
      return Promise.reject(error);
   }
);

export const unauthorizedAPI = unauthorizedAxiosInstance;
export const authorizedAPI = authorizedAxiosInstance;
