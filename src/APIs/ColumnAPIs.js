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

export const updateColumnName = async (columnId, updatedData) => {
  try {
    const { data } = await AxiosInstance.patch(
      `/columns/${columnId}`,
      updatedData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteColumn = async (columnId) => {
  try {
    const { data } = await AxiosInstance.delete(`/columns/${columnId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const organizeDragAndDrop = async (payload) => {
  try {
    const { data } = await AxiosInstance.post("/columns/drag-drop", payload);
    return data;
  } catch (error) {
    console.log(error);
  }
};
