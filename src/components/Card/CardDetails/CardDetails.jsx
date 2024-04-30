import React, { useState, useEffect } from "react";
import { CheckSquare, CreditCard, Tag, Trash, X } from "react-feather";
import { DatePicker, Input, Space } from "antd";
import moment from "moment";
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import { v4 as uuidv4 } from "uuid";
import Label from "../../Label/Label";

const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];

export default function CardDetails(props) {
  // Define state variables
  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.title);
  const [labelShow, setLabelShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Function to add task
  const addTask = (value) => {
    values.task.push({
      id: uuidv4(),
      task: value,
      completed: false,
    });
    setValues({ ...values });
  };

  // Function to remove task
  const removeTask = (id) => {
    const remainingTask = values.task.filter((item) => item.id !== id);
    setValues({ ...values, task: remainingTask });
  };

  // Function to delete all tasks
  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  // Function to update task completion status
  const updateTask = (id) => {
    const taskIndex = values.task.findIndex((item) => item.id === id);
    values.task[taskIndex].completed = !values.task[taskIndex].completed;
    setValues({ ...values });
  };

  // Function to remove tag
  const removeTag = (id) => {
    const tempTag = values.tags.filter((item) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

  // Function to add tag
  const addTag = (value, color) => {
    values.tags.push({
      id: uuidv4(),
      tagName: value,
      color: color,
    });

    setValues({ ...values });
  };

  // Function to update card title
  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  // Function to calculate completion percentage
  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  // Event handler for key press
  const handleKeyPress = (e) => {
    if (e.code === "Enter") {
      setInput(false);
      updateTitle(text === "" ? values.title : text);
    }
  };

  // Date handler
  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };
  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setSelectedDate(dateString);
  };
  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  });

  useEffect(() => {
    if (props.updateCard) props.updateCard(props.bid, values.id, values);
  }, [values]);

  return (
    <Modal onClose={props.onClose}>
      <div className="local__bootstrap">
        <div
          className="container"
          style={{ minWidth: "650px", position: "relative" }}
        >
          <div className="row pb-4">
            {/* Title Section */}
            <div className="col-12">
              <div className="d-flex align-items-center pt-3 gap-2">
                <CreditCard className="icon__md" />
                {input ? (
                  <Input title={values.title} />
                ) : (
                  <h5
                    style={{ cursor: "pointer" }}
                    onClick={() => setInput(true)}
                  >
                    {values.title}
                  </h5>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            {/* Label and Task Section */}
            <div className="col-8">
              {/* Label Section */}
              <h6 className="text-justify">Label</h6>
              <div
                className="d-flex label__color flex-wrap"
                style={{ width: "500px", paddingRight: "10px" }}
              >
                {values.tags.length !== 0 ? (
                  values.tags.map((item) => (
                    <span
                      className="d-flex justify-content-between align-items-center gap-2"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.tagName.length > 10
                        ? item.tagName.slice(0, 6) + "..."
                        : item.tagName}
                      <X
                        onClick={() => removeTag(item.id)}
                        style={{ width: "15px", height: "15px" }}
                      />
                    </span>
                  ))
                ) : (
                  <span
                    style={{ color: "#ccc" }}
                    className="d-flex justify-content-between align-items-center gap-2"
                  >
                    <i>No Labels</i>
                  </span>
                )}
              </div>
              {/* Check List Section */}
              <div className="check__list mt-2">
                <div className="d-flex align-items-end justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <CheckSquare className="icon__md" />
                    <h6>Check List</h6>
                  </div>
                  <div className="card__action__btn">
                    <button onClick={() => deleteAllTask()}>
                      Delete all tasks
                    </button>
                  </div>
                </div>
                <div className="progress__bar mt-2 mb-2">
                  <div className="progress flex-1">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      style={{ width: calculatePercent() + "%" }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {calculatePercent() + "%"}
                    </div>
                  </div>
                </div>
                <div className="my-2">
                  {values.task.length !== 0 ? (
                    values.task.map((item, index) => (
                      <div className="task__list d-flex align-items-start gap-2">
                        <input
                          className="task__checkbox"
                          type="checkbox"
                          defaultChecked={item.completed}
                          onChange={() => {
                            updateTask(item.id);
                          }}
                        />
                        <h6
                          className={`flex-grow-1 ${
                            item.completed === true ? "strike-through" : ""
                          }`}
                        >
                          {item.task}
                        </h6>
                        <Trash
                          onClick={() => {
                            removeTask(item.id);
                          }}
                          style={{
                            cursor: "pointer",
                            width: "18px",
                            height: "18px",
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <></>
                  )}
                  <Editable
                    parentClass={"task__editable"}
                    name={"Add Task"}
                    btnName={"Add task"}
                    onSubmit={addTask}
                  />
                </div>
              </div>
            </div>
            {/* Add to Card Section */}
            <div className="col-4">
              <h6>Add to card</h6>
              <div className="d-flex card__action__btn flex-column gap-2">
                <button onClick={() => setLabelShow(true)}>
                  <span className="icon__sm">
                    <Tag />
                  </span>
                  Add Label
                </button>
                {labelShow && (
                  <Label
                    color={colors}
                    addTag={addTag}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}

                {/* Date picker  */}
                <Space direction="vertical">
                  <DatePicker
                    onChange={onChange}
                    style={{ width: "100%" }}
                    disabledDate={disabledDate}
                  />
                </Space>
                <button onClick={() => props.removeCard(props.bid, values.id)}>
                  <span className="icon__sm">
                    <Trash />
                  </span>
                  Delete Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
