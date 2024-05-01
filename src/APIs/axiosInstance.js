import axios from "axios";
// import { getToken } from "./sessionStorage";
export const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByZ2FsYW1naXJAZ21haWwuY29tIiwiX2lkIjoiNjYzMDdmMDUyYTYyYzgxMTllZTM2ZGIzIiwiZmlyc3ROYW1lIjoiYWxhbWdpciIsImxhc3ROYW1lIjoiaG9zc2VuIiwiYXZhdGFyIjoiIiwiaWF0IjoxNzE0NTU0ODA4LCJleHAiOjE3MTQ2NDEyMDh9.PMsqhg7ayF1JTBQaaYDKDc437Iue8GNZ5_DZIopv57A`,
  },
});
