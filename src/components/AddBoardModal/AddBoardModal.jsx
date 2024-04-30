import React, { useState } from "react";
import { Modal, Input, Button, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const AddBoardModal = ({ isModalOpen, setIsModalOpen }) => {
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState(["Todo", "In Progress"]);

  const handleOk = () => {
    setIsModalOpen(false);
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
        onOk={handleOk}
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
        <h6>Board columns</h6>
        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {columns.map((column, index) => (
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
        </Button>
      </Modal>
    </>
  );
};

export default AddBoardModal;
