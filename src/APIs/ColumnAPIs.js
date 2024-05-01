import { AxiosInstance } from "./axiosInstance";

export const createColumn = async (column) => {
  try {
    // debugger
    const { data } = await AxiosInstance.post("/columns", column);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getColumnsByBoardId = async (boardId) => {
  try {
    const { data } = await AxiosInstance.get(`/columns/${boardId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
