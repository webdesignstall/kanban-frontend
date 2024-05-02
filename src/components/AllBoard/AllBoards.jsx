import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Board from "../Board/Board";
import Editable from "../Editable/Editable";
import {
  createColumn,
  getColumnsByBoardId,
  organizeDragAndDrop,
} from "../../APIs/ColumnAPIs";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AllBoards = ({ selectedItem }) => {
  const [data, setData] = useState([]);
  const [refetchColumn, setRefetchColumn] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isCreateColumn, setIsCreateColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    const fetchColumnData = async () => {
      try {
        if (selectedItem) {
          const data = await getColumnsByBoardId(selectedItem);
          setData(data?.data);
          console.log("All column", data?.data);
        }
      } catch (error) {
        console.error("Error fetching column data: ", error);
      }
    };

    fetchColumnData();
  }, [selectedItem, refetchColumn]);

  const updateData = (newData) => {
    setData(newData);
  };

  const updateColumnName = (title, bid) => {
    console.log(title, bid);
    setIsEditTitle(false);
  };

  const addCard = async (title, bid) => {
    /*   const newCard = {
      title,
      serialNo: 4, // how to catch the serial number or input it
      columnId: bid,
    };
    console.log(newCard);*/

    const searchColumn = data?.find((item) => item?.columnName === bid);

    const newCard = {
      title,
    };

    const newTask = {
      ...searchColumn,
      tasks: [...searchColumn?.tasks, { title }],
    };
    /*  debugger
    console.log(newTask);
    debugger*/

    const result = await createColumn(newTask);
    if (result?.status === "success") {
      setRefetchColumn((prev) => !prev);
      console.log(result);
    } else {
      console.log(result);
    }

    // const result = await createColumn(newTask);

    // updateData(
    //   data?.map((board) =>
    //     board.id === bid
    //       ? { ...board, card: [...board.card, { id: uuidv4(), title }] }
    //       : board
    //   )
    // );
    // Example API call to add a card
    // POST request to add a card
    // Params: boardId, newCardData
    // Body: { id: newCardId, title: newCardTitle }
    // const addCard = (title, bid) => {
    // const newCard = {
    //   boardId: selectedItem,
    //   columnName: ,
    //   serialNo: 4, // how to catch the serial number or input it
    //   columnId: bid,
    // };
    console.log(data);
  };

  const removeCard = (boardId, cardId) => {
    updateData(
      data?.map((board) =>
        board.id === boardId
          ? {
              ...board,
              card: board.card?.filter((card) => card.id !== cardId),
            }
          : board
      )
    );
    // Example API call to remove a card
    // POST request to remove a card
    // Params: boardId, cardId
    // Body: None
  };

  const addNewColumn = async () => {
    const newData = {
      columnName: newColumnTitle,
      boardId: selectedItem,
      tasks: [],
    };

    /* debugger

    console.log();

    debugger*/

    // const result = await createColumn({
    //   ...data,
    //   columnName: title,
    //   boardId: selectedItem,
    // });
    const result = await createColumn(newData);
    if (result?.status === "success") {
      setRefetchColumn((prev) => !prev);
      setIsCreateColumn(false);
      console.log(result);
    } else {
      console.log(result);
    }
  };

  const removeColumn = (columnId) => {
    console.log("Delete column", columnId);
    // updateData(data?.filter((board) => board.id !== bid));
    // Example API call to remove a board
    // POST request to remove a board
    // Params: boardId
    // Body: None
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If there's no destination or the source and destination are the same, do nothing
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = data?.find(
      (board) => board?._id === source.droppableId
    );
    const destinationColumn = data?.find(
      (board) => board?._id === destination.droppableId
    );

    // Find the dragged card
    const draggedCard = sourceColumn.tasks?.find(
      (card) => card._id === result.draggableId
    );

    sourceColumn.card = sourceColumn?.tasks?.filter(
      (card) => card._id !== result.draggableId
    );

    destinationColumn.tasks?.splice(destination.index, 0, draggedCard);

    const newData = data?.map((board) => {
      if (board._id === sourceColumn._id) {
        return sourceColumn;
      }
      if (board._id === destinationColumn._id) {
        return destinationColumn;
      }
      return board;
    });

    // update the current state
    setData(newData);
    // call api to make changes on db as frontend

    const payload = {
      rePlacableTaskId: draggedCard._id,
      serialNo: source.index,
      sourceColumnId: source.droppableId,
      destinationColumnId: destination.droppableId,
    };
    handleDragAndDrop(payload);
  };

  const handleDragAndDrop = async (payload) => {
    const result = await organizeDragAndDrop(payload);
    if (result?.status) {
      setRefetchColumn((prev) => !prev);
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <div className="app_outer">
            <div style={{ height: "100vh" }} className="app_boards">
              {data?.map((board) => (
                <Board
                  setData={setData}
                  boards={data}
                  key={board._id}
                  id={board._id}
                  name={board.columnName}
                  card={board?.tasks}
                  setName={updateColumnName}
                  addCard={addCard}
                  removeCard={removeCard}
                  removeColumn={removeColumn}
                  show={isEditTitle}
                  setShow={setIsEditTitle}
                  setRefetchColumn={setRefetchColumn}
                />
              ))}
              {/*<div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F0F0F0",
                  padding: "10px 40px",
                  borderRadius: "5px",
                  height: "82%",
                  border: "1px solid #D3D3D3",
                }}
              >
                {isCreateColumn ? (
                  <div>
                    <p>
                      <Input
                        autoFocus
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        placeholder="Enter column name"
                      />
                    </p>
                    <Button
                      onClick={() => setIsCreateColumn(false)}
                      style={{ marginRight: "5px" }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addNewColumn} type="primary">
                      Create
                    </Button>
                  </div>
                ) : (
                  <p style={{ padding: "0px 24px" }}>
                    <Button onClick={() => setIsCreateColumn(true)}>
                      <PlusOutlined /> <span>New Column</span>
                    </Button>
                  </p>
                )}
              </div>*/}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default AllBoards;
