import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = "http://localhost:5050";

const $api = axios.create({
  //це для того щоб для кожного запиту куки ціплялися автоматично
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

//перезаписує accessToken в випадку якщо прийшов 401 статус код
$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    //повторюємо ісходний запит
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      //поле яке дозволить постійно не перезавантажувати сторінку якщо час життя accessToken 15s
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        console.log("NOT AUTHORIZED");
      }
    }
    throw error;
  }
);

export default $api;
