import axios from "axios";
// import { getToken } from "./sessionStorage";
export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
 /* headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },*/
  // headers: {
  //   Authorization: `Bearer ${getToken()}`,
  // },
});
