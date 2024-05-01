import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Board from "../Board/Board";
import Editable from "../Editable/Editable";
import { createColumn, getColumnsByBoardId } from "../../APIs/ColumnAPIs";
import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const AllBoards = ({ selectedItem }) => {
  const [data, setData] = useState([]);
  const [refetchColumn, setRefetchColumn] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [isCreateColumn, setIsCreateColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // useEffect(() => {
  //   const fetchColumnData = async () => {
  //     try {
  //       const res = await fetch("./columns.json");
  //       const columnsData = await res.json();
  //       const selectedBoard = columnsData.find(
  //         (item) => item.boardId === Number(selectedItem)
  //       );
  //       setData(selectedBoard?.columns || []);
  //     } catch (error) {
  //       console.error("Error fetching column data: ", error);
  //     }
  //   };

  //   fetchColumnData();
  // }, [selectedItem]);

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
    // Example API call to update data
    // POST request to update board columns
    // Params: boardId (or selectedItem), newData
    // Body: newData
  };

  const updateColumnName = (title, bid) => {
    console.log(title, bid);
    setIsEditTitle(false);
  };

  // const dragCardInBoard = (source, destination) => {
  //   const newData = [...data];
  //   const sourceBoard = newData.find(
  //     (board) => board.id === source.droppableId
  //   );
  //   const destinationBoard = newData.find(
  //     (board) => board.id === destination.droppableId
  //   );
  //   const sourceIndex = sourceBoard.card.findIndex(
  //     (card) => card.id === source.draggableId
  //   );
  //   const [draggedCard] = sourceBoard.card.splice(sourceIndex, 1);
  //   const destinationIndex = destination.index;
  //   destinationBoard.card.splice(destinationIndex, 0, draggedCard);
  //   updateData(newData);
  //   // Example API call to update card position
  //   // POST request to update card position
  //   // Params: sourceBoardId, destinationBoardId, sourceIndex, destinationIndex
  //   // Body: { sourceIndex, destinationIndex }
  // };

  const dragCardInBoard = (source, destination) => {
    const newData = [...data];
    const sourceColumn = newData.find(
      (board) => board.id === source.droppableId
    );
    const destinationColumn = newData.find(
      (board) => board.id === destination.droppableId
    );

    if (!sourceColumn || !destinationColumn) {
      console.error("Source or destination column not found.");
      return;
    }

    const sourceCardIndex = sourceColumn.card.findIndex(
      (card) => card.id === source.draggableId
    );
    const [draggedCard] = sourceColumn.card.splice(sourceCardIndex, 1);
    const destinationIndex = destination.index;

    if (source.droppableId !== destination.droppableId) {
      // If source and destination columns are different
      destinationColumn.card.splice(destinationIndex, 0, draggedCard);
    } else {
      // If source and destination columns are the same
      sourceColumn.card.splice(destinationIndex, 0, draggedCard);
    }

    updateData(newData);
    // Example API call to update card position
    // POST request to update card position
    // Params: sourceColumnId, destinationColumnId, sourceIndex, destinationIndex
    // Body: { sourceIndex, destinationIndex }
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

    const result = await createColumn({
      ...data,
      columnName: title,
      boardId: selectedItem,
    });
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
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    dragCardInBoard(source, destination);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <div className="app_outer">
            <div style={{ height: "100vh" }} className="app_boards">
              {data?.map((board) => (
                <Board
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
              <div
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
              </div>
              {/* <Editable
                className={"add__board"}
                name={"New Column"}
                btnName={"New Column"}
                onSubmit={addNewColumn}
                placeholder={"Enter column name"}
              /> */}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default AllBoards;
