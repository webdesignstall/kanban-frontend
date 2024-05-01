import { AxiosInstance } from "./axiosInstance";

export const createBoard = async (board) => {
  try {
    const { data } = await AxiosInstance.post("/boards", board);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllBoards = async () => {
  try {
    const { data } = await AxiosInstance.get("/boards");
    return data;
  } catch (error) {
    console.log(error);
  }
};
