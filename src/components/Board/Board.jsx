import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import "./Board.css";
import { MoreHorizontal } from "react-feather";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";
import { Droppable } from "react-beautiful-dnd";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createColumn } from "../../APIs/ColumnAPIs";

const Board = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.code === "Enter") {
        setSelectedColumn("");
        props.setShow(false);
      }
    });
    return () => {
      document.removeEventListener("keypress", (e) => {
        if (e.code === "Enter") {
          setSelectedColumn("");
          props.setShow(false);
        }
      });
    };
  });

  const addNewTask = async () => {
    const newTaskData = {
      title: newTaskTitle,
      labels: [],
      subTasks: [],
    };
    const column = props.boards.find((board) => board._id === props.id);
    const updatedColumn = { ...column, tasks: [...column.tasks, newTaskData] };
    const result = await createColumn(updatedColumn);
    if (result?.status === "success") {
      setIsCreateTask(false);
      props.setRefetchColumn((prev) => !prev);
    }
  };
  return (
    <div className="board">
      <div className="board__top">
        {props.show && props.id === selectedColumn ? (
          <div>
            <input
              className="title__input"
              type={"text"}
              defaultValue={props.name}
              onBlur={(e) => {
                setSelectedColumn("");
                props.setName(e.target.value, props.id);
              }}
            />
          </div>
        ) : (
          <div>
            <p
              onClick={() => {
                setSelectedColumn(props?.id);
                props.setShow(true);
              }}
              className="board__title"
            >
              {props?.name || "Name of Board"}
              <span className="total__cards">{props.card?.length}</span>
            </p>
          </div>
        )}
        <div
          onClick={() => {
            setDropdown(true);
          }}
        >
          <MoreHorizontal />
          {dropdown && (
            <Dropdown
              class="board__dropdown"
              onClose={() => {
                setDropdown(false);
              }}
            >
              <p onClick={() => props.removeColumn(props.id)}>Delete Column</p>
            </Dropdown>
          )}
        </div>
      </div>
      <Droppable droppableId={props.id}>
        {(provided) => (
          <div
            className="board__cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props?.card?.map((items, index) => (
              <Card
                  setData={props?.setData}
                boards={props?.boards}
                columnName={props?.name}
                bid={props._id}
                id={items._id}
                index={index}
                key={items._id}
                title={items?.title}
                tags={items?.tags}
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                card={items}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* <div className="board__footer">
        <Editable
          name={"Add Task"}
          btnName={"Add Task"}
          placeholder={"Enter Title"}
          onSubmit={(value) => props.addCard(value, props.id)}
        />
      </div> */}
      <div>
        {isCreateTask ? (
          <div style={{ padding: "0px 20px" }}>
            <p>
              <Input
                autoFocus
                onBlur={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task name"
              />
            </p>
            <Button
              onClick={() => setIsCreateTask(false)}
              style={{ marginRight: "5px" }}
            >
              Cancel
            </Button>
            <Button onClick={addNewTask} type="primary">
              Create
            </Button>
          </div>
        ) : (
          <Button
            style={{ marginLeft: "7px" }}
            onClick={() => setIsCreateTask(true)}
          >
            <PlusOutlined /> <span>Add Task</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Board;
