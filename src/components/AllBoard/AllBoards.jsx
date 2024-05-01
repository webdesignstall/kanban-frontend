import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Board from "../Board/Board";
import Editable from "../Editable/Editable";
import { createColumn, getColumnsByBoardId } from "../../APIs/ColumnAPIs";

const AllBoards = ({ selectedItem }) => {
  const [data, setData] = useState([]);
  const [refetchColumn, setRefetchColumn] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);

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
    // updateData(
    //   data?.map((board) =>
    //     board.id === bid ? { ...board, columnName: title } : board
    //   )
    // );
    // Example API call to update board name
    // POST request to update board name
    // Params: boardId (or selectedItem), newColumnName
    // Body: { columnName: newColumnName }
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


    const searchColumn = data?.find(item => item?.columnName === bid);


    const newCard = {
      title
    };

    const newTask = {...searchColumn, tasks: [...searchColumn?.tasks, {title}] };
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

  const addNewColumn = async (title) => {
    /*const newData = {
      columnName: title,
      boardId: selectedItem,
      tasks: [],
    };*/

   /* debugger

    console.log();

    debugger*/

    const result = await createColumn({...data, columnName: title, boardId: selectedItem});
    if (result?.status === "success") {
      setRefetchColumn((prev) => !prev);
      console.log(result);
    } else {
      console.log(result);
    }
    // const newBoard = {
    //   id: uuidv4(),
    //   columnName: title,
    //   card: [],
    // };
    // updateData([...data, newBoard]);
    // Example API call to add a board
    // POST request to add a board
    // Params: newBoardData
    // Body: { id: newBoardId, columnName: newBoardColumnName, card: [] }
  };

  const removeBoard = (bid) => {
    updateData(data?.filter((board) => board.id !== bid));
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
            <div className="app_boards">
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
                  removeBoard={removeBoard}
                  show={isEditTitle}
                  setShow={setIsEditTitle}
                />
              ))}
              <Editable
                className={"add__board"}
                name={"New Column"}
                btnName={"New Column"}
                onSubmit={addNewColumn}
                placeholder={"Enter column name"}
              />
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default AllBoards;
