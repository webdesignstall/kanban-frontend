import React, { useState, useEffect } from "react";
import { CheckSquare, CreditCard, Tag, Trash, X } from "react-feather";
import { Button, DatePicker, Input, Space } from "antd";
import moment from "moment";
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import Label from "../../Label/Label";
import { createColumn, getColumnsByBoardId } from "../../../APIs/ColumnAPIs";
import { PlusOutlined } from "@ant-design/icons";

const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];

export default function CardDetails(props) {
  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.title);
  const [labelShow, setLabelShow] = useState(false);
  const [isCreateSubTask, setIsCreateSubTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Function to add task
  const addSubTask = async () => {
    /*
    const searchColumn = props?.boards?.find(item => item?.columnName === props?.columnName);

    const newTask = {...searchColumn, tasks: [...searchColumn?.tasks, {value}] };

    const task = searchColumn?.tasks?.find(task => task?._id === props?.cardId)

    const newSubTask = {...task, subTasks: [...task?.subTasks, {title: value}] };

    const t = {...searchColumn, newSubTask}

      debugger
      console.log(t);
      debugger

   /!* const result = await createColumn(newTask);
    if (result?.status === "success") {
      setRefetchColumn((prev) => !prev);
      console.log(result);
    } else {
      console.log(result);
    }*!/

    debugger
    console.log("Add new subtask", { subtask: value, column: props?.columnName });
    debugger
    // call the subtask api*/

    // Find the column
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );

    // Find the task
    const task = searchColumn?.tasks?.find(
      (task) => task?._id === props?.cardId
    );

    if (task) {
      // Add a new subtask to the task if the task is found
      const newSubTask = {
        ...task,
        subTasks: [...task?.subTasks, { title: newTaskTitle }],
      };

      // Update the task in the column with the new subtask
      const updatedTasks = searchColumn.tasks.map((t) => {
        if (t._id === task._id) {
          return newSubTask;
        }
        return t;
      });

      // Update the column with the updated tasks
      const updatedColumn = { ...searchColumn, tasks: updatedTasks };

      // debugger

      const result = await createColumn(updatedColumn);

      // const subTaskIndex = updatedTasks?.subTasks?.findIndex((item) => item._id === id);
      /*
      const currentColumn = result?.data?.find(
          (item) => item?.columnName === props?.columnName
      );*/
      // debugger

      const currentCard = result?.data?.tasks?.find(
        (item) => item?._id === props?.cardId
      );

      const boardData = await getColumnsByBoardId(searchColumn?.boardId);

      props.setData(boardData?.data);

      setValues({ ...currentCard });

      setIsCreateSubTask(false);
      if (result?.status === "success") {
        // setRefetchColumn((prev) => !prev);
        console.log(result);
      } else {
        console.log(result);
      }

      /* debugger
      console.log(updatedColumn)*/
      // Now you can use the updatedColumn for further processing if needed
    } else {
      // Handle the case where the task is not found
    }
  };

  // Function to remove task
  const removeSubTask = async (id) => {
    console.log("Remove subtask", { subtaskId: id });
    // const remainingTask = values.subTasks?.filter((item) => item._id !== id);
    // setValues({ ...values, task: remainingTask });

    // Find the column containing the task
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );

    // Find the task within the column
    const task = searchColumn?.tasks?.find(
      (task) => task?._id === props?.cardId
    );

    if (task) {
      // Find the index of the subtask within the task
      const subTaskIndex = task?.subTasks?.findIndex((item) => item._id === id);

      if (subTaskIndex !== -1) {
        // Update the completion status of the subtask
        /* task.subTasks[subTaskIndex].completed =
            !task.subTasks[subTaskIndex].completed;*/

        task.subTasks.splice(subTaskIndex, 1);

        console.log({ ...task });

        setValues({ ...task });

        // Update the task within the column
        const updatedTasks = searchColumn.tasks.map((t) => {
          if (t._id === task._id) {
            return { ...t, subTasks: task.subTasks };
          }
          return t;
        });

        // Update the column with the updated tasks
        const updatedColumn = { ...searchColumn, tasks: updatedTasks };

        // debugger

        // Save the updated column
        const result = await createColumn(updatedColumn);
        if (result?.status === "success") {
          // Optionally, you can handle success here
          console.log("Subtask updated successfully.");
        } else {
          // Handle errors
          console.log("Error updating subtask:", result?.error);
        }
      } else {
        console.log("Subtask not found.");
      }
    } else {
      console.log("Task not found.");
    }
  };

  // Function to delete all tasks
  const deleteAllSubTask = async () => {
    // remove all subtask by parent task id
    console.log("Remove all the subtask", { AllTaskByTaskId: props.card._id });
    // setValues({
    //   ...values,
    //   task: [],
    // });

    // Find the column containing the task
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );

    // Find the task within the column
    const task = searchColumn?.tasks?.find(
      (task) => task?._id === props?.cardId
    );

    task.subTasks = [];

    setValues({
      ...task,
      task: [],
    });

    // Update the task within the column
    const updatedTasks = searchColumn.tasks.map((t) => {
      if (t._id === task._id) {
        return { ...t, subTasks: task.subTasks };
      }
      return t;
    });

    // Update the column with the updated tasks
    const updatedColumn = { ...searchColumn, tasks: updatedTasks };

    // debugger

    // Save the updated column
    const result = await createColumn(updatedColumn);
  };

  // Function to update task completion status
  /*const updateSubTask = (id) => {
  /!*  console.log("Update subtask as complete or incomplete", id);
    const taskIndex = values.subTasks.findIndex((item) => item._id === id);
    values.subTasks[taskIndex].completed =
      !values.subTasks[taskIndex].completed;
    setValues({ ...values });*!/


    // Find the column
    const searchColumn = props?.boards?.find(item => item?.columnName === props?.columnName);

// Find the task
    const task = searchColumn?.tasks?.find(task => task?._id === props?.cardId);

    const taskIndex = task?.subTasks?.findIndex((item) => item._id === id);

    task.subTasks[taskIndex].completed = !task.subTasks[taskIndex].completed

    setValues({ ...task })

    console.log({...task});


  };*/

  const handleDeleteTaskCard = async () => {
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );

    const remainingTask = searchColumn.tasks.filter(
      (task) => task._id !== props?.cardId
    );
    const updatedColumn = {
      ...searchColumn,
      tasks: [...remainingTask],
    };
    const result = await createColumn(updatedColumn);
    if (result.status === "success") {
      setInput(false);
      const currentCard = result?.data?.tasks?.find(
        (item) => item?._id === props?.cardId
      );
      const boardData = await getColumnsByBoardId(searchColumn?.boardId);
      props.setData(boardData?.data);
      setValues({ ...currentCard });
    }
  };

  const updateSubTask = async (id) => {
    // Find the column containing the task
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );

    // Find the task within the column
    const task = searchColumn?.tasks?.find(
      (task) => task?._id === props?.cardId
    );

    if (task) {
      // Find the index of the subtask within the task
      const subTaskIndex = task?.subTasks?.findIndex((item) => item._id === id);

      if (subTaskIndex !== -1) {
        // Update the completion status of the subtask
        task.subTasks[subTaskIndex].completed =
          !task.subTasks[subTaskIndex].completed;

        console.log({ ...task });

        setValues({ ...task });

        // Update the task within the column
        const updatedTasks = searchColumn.tasks.map((t) => {
          if (t._id === task._id) {
            return { ...t, subTasks: task.subTasks };
          }
          return t;
        });

        // Update the column with the updated tasks
        const updatedColumn = { ...searchColumn, tasks: updatedTasks };

        // debugger

        // Save the updated column
        const result = await createColumn(updatedColumn);
        if (result?.status === "success") {
          // Optionally, you can handle success here
          console.log("Subtask updated successfully.");
        } else {
          // Handle errors
          console.log("Error updating subtask:", result?.error);
        }
      } else {
        console.log("Subtask not found.");
      }
    } else {
      console.log("Task not found.");
    }
  };

  const removeLabel = async (labelId) => {
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );
    const task = searchColumn?.tasks?.find(
      (task) => task?._id === props?.cardId
    );
    const remainingTask = searchColumn.tasks.filter(
      (task) => task._id !== props?.cardId
    );
    const remainingLabels = task.labels.filter(
      (label) => label._id !== labelId
    );
    const updatedColumn = {
      ...searchColumn,
      tasks: [...remainingTask, { ...task, labels: [...remainingLabels] }],
    };
    const result = await createColumn(updatedColumn);
    if (result?.status === "success") {
      setInput(false);
      const currentCard = result?.data?.tasks?.find(
        (item) => item?._id === props?.cardId
      );
      const boardData = await getColumnsByBoardId(searchColumn?.boardId);
      props.setData(boardData?.data);
      setValues({ ...currentCard });
    }
  };

  const addNewLabel = async (value, color) => {
    const newLabel = {
      labelName: value,
      color,
    };
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );
    const task = searchColumn?.tasks?.find(
      (task) => task?._id === props?.cardId
    );
    const remainingTask = searchColumn.tasks.filter(
      (task) => task._id !== props?.cardId
    );
    const updatedLabels = [...task.labels, newLabel];
    const updatedColumn = {
      ...searchColumn,
      tasks: [...remainingTask, { ...task, labels: [...updatedLabels] }],
    };

    const result = await createColumn(updatedColumn);
    if (result?.status === "success") {
      setInput(false);
      setLabelShow(false);
      const currentCard = result?.data?.tasks?.find(
        (item) => item?._id === props?.cardId
      );
      const boardData = await getColumnsByBoardId(searchColumn?.boardId);
      props.setData(boardData?.data);
      setValues({ ...currentCard });
    }
  };

  const updateTitleByEnterKey = async (value) => {
    await handleUpdateTaskTitle(value);
  };

  const handleUpdateTaskTitle = async (title) => {
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );
    console.log(searchColumn);
    const task = searchColumn?.tasks?.find(
      (task) => task?._id === props?.cardId
    );
    const updatedTask = { ...task, title: title };
    const remainingTask = searchColumn.tasks.filter(
      (task) => task._id !== props?.cardId
    );
    const updatedColumn = {
      ...searchColumn,
      tasks: [...remainingTask, updatedTask],
    };
    console.log(updatedColumn);
    const result = await createColumn(updatedColumn);
    if (result?.status === "success") {
      setInput(false);
      const currentCard = result?.data?.tasks?.find(
        (item) => item?._id === props?.cardId
      );
      const boardData = await getColumnsByBoardId(searchColumn?.boardId);
      props.setData(boardData?.data);
      setValues({ ...currentCard });
    }
  };

  const calculatePercent = () => {
    const totalTask = values.subTasks?.length;
    const completedTask = values.subTasks?.filter(
      (item) => item.completed === true
    )?.length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  // the entire stored date should be selected on calendar
  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const handleDateChange = async (date, dateString) => {
    const searchColumn = props?.boards?.find(
      (item) => item?.columnName === props?.columnName
    );
    const task = searchColumn?.tasks?.find(
      (task) => task?._id === props?.cardId
    );
    const updatedTask = { ...task, date: dateString };
    const remainingTask = searchColumn.tasks.filter(
      (task) => task._id !== props?.cardId
    );
    const updatedColumn = {
      ...searchColumn,
      tasks: [...remainingTask, updatedTask],
    };

    const result = await createColumn(updatedColumn);
    if (result.status === "success") {
      setInput(false);
      const currentCard = result?.data?.tasks?.find(
        (item) => item?._id === props?.cardId
      );
      const boardData = await getColumnsByBoardId(searchColumn?.boardId);
      props.setData(boardData?.data);
      setValues({ ...currentCard });
    }
  };

  const handleKeyPress = (e) => {
    if (e.code === "Enter") {
      setInput(false);
      updateTitleByEnterKey(text === "" ? values.title : text);
    }
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
                  <Input
                    onBlur={handleUpdateTaskTitle}
                    defaultValue={values.title}
                    onChange={(e) => setText(e.target.value)}
                  />
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
                {values?.labels?.length !== 0 ? (
                  values?.labels?.map((item) => (
                    <span
                      key={item._id}
                      className="d-flex justify-content-between align-items-center gap-2"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.labelName?.length > 10
                        ? item.labelName.slice(0, 6) + "..."
                        : item.labelName}
                      <X
                        onClick={() => removeLabel(item._id)}
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
                    <button onClick={() => deleteAllSubTask()}>
                      Delete all tasks
                    </button>
                  </div>
                </div>
                <div className="progress__bar mt-2 mb-2">
                  <div className="progress flex-1">
                    <div
                      className="progress-bar"
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
                  {values.subTasks?.length !== 0 ? (
                    values.subTasks?.map((item) => (
                      <div
                        key={item._id}
                        className="task__list d-flex align-items-start gap-2"
                      >
                        <input
                          className="task__checkbox"
                          type="checkbox"
                          defaultChecked={item.completed}
                          onChange={() => {
                            updateSubTask(item._id);
                          }}
                        />
                        <h6
                          className={`flex-grow-1 ${
                            item.completed === true ? "strike-through" : ""
                          }`}
                        >
                          {item.title}
                        </h6>
                        <Trash
                          onClick={() => {
                            removeSubTask(item._id);
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
                  {/* <Editable
                    parentClass={"task__editable"}
                    name={"Add Task"}
                    btnName={"Add task"}
                    onSubmit={addSubTask}
                  /> */}
                  <div style={{ margin: "10px 0px" }}>
                    {isCreateSubTask ? (
                      <div style={{ paddingRight: "10px" }}>
                        <p style={{ display: "flex", gap: "10px" }}>
                          <Input
                            autoFocus
                            onBlur={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="Enter task name"
                            style={{ padding: "10px" }}
                          />
                          <PlusOutlined
                            onClick={() => setIsCreateSubTask(false)}
                            style={{
                              transform: "rotate(45deg)",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                          />
                        </p>
                        <Button onClick={addSubTask} type="primary">
                          Create
                        </Button>
                      </div>
                    ) : (
                      <Button
                        style={{ marginLeft: "7px" }}
                        onClick={() => setIsCreateSubTask(true)}
                      >
                        <PlusOutlined /> <span>Add Task</span>
                      </Button>
                    )}
                  </div>
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
                    addNewLabel={addNewLabel}
                    labels={values?.labels || []}
                    onClose={setLabelShow}
                  />
                )}

                {/* Date picker  */}
                <Space direction="vertical">
                  <DatePicker
                    onChange={handleDateChange}
                    style={{
                      width: "100%",
                      backgroundColor: "#f0f0f0f0",
                      cursor: "pointer",
                    }}
                    disabledDate={disabledDate}
                    placeholder={values?.date}
                  />
                </Space>
                <button onClick={handleDeleteTaskCard}>
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
