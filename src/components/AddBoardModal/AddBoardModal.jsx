import React, { useState } from "react";
import { Modal, Input, Button, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { createBoard } from "../../APIs/BoardAPIs";
import { createColumn } from "../../APIs/ColumnAPIs";

const AddBoardModal = ({ isModalOpen, setIsModalOpen, setRefetchBoard }) => {
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState(["Todo", "In Progress"]);

  const userId = "66307f052a62c8119ee36db3";
  // const boardId = "6630884c6e28d468972769a5";

  const handleCreateNewBoard = async () => {
    const newBoardData = {
      boardName,
      userId,
    };
    // create board
    const result = await createBoard(newBoardData);
    if (result?.status === "success") {
      setIsModalOpen(false);
      setRefetchBoard((prev) => !prev);
      // const boardId = result.data._id;
      // after creating board successfully
      // then, create columns
      // const columnData = columns.map((col) => ({
      //   boardId,
      //   userId,
      //   columnName: col,
      // }));

      // const result2 = await createColumn(columnData);
      // console.log(result2);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddColumn = () => {
    setColumns([...columns, ""]);
  };

  const handleRemoveColumn = (index) => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
  };

  const handleColumnChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = value;
    setColumns(updatedColumns);
  };

  return (
    <>
      <Modal
        title="Add New Board"
        open={isModalOpen}
        onOk={handleCreateNewBoard}
        onCancel={handleCancel}
        okText="Create New Board"
      >
        <h6 style={{ marginTop: "20px" }}>Board Name</h6>
        <Input
          placeholder="Board Name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        {/*<h6>Board columns</h6>
        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {columns?.map((column, index) => (
            <Space
              key={index}
              style={{
                marginBottom: "0.5rem",
              }}
            >
              <Input
                placeholder={`Column ${index + 1}`}
                value={column}
                onChange={(e) => handleColumnChange(index, e.target.value)}
              />
              <Button
                type="link"
                icon={<CloseOutlined />}
                onClick={() => handleRemoveColumn(index)}
              />
            </Space>
          ))}
        </div>
        <Button onClick={handleAddColumn} style={{ marginTop: "10px" }}>
          Add New Column
        </Button>*/}
      </Modal>
    </>
  );
};

export default AddBoardModal;
