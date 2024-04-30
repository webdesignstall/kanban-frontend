import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Board from "../Board/Board";
import Editable from "../Editable/Editable";

const AllBoards = ({ selectedItem }) => {
  const [data, setData] = useState(() => {
    const localStorageData = localStorage.getItem("Kanban-Board");
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      return parsedData[selectedItem] || [];
    }
    return [];
  });

  const updateData = (newData) => {
    setData((prevData) => {
      const updatedData = { ...prevData, [selectedItem]: newData };
      localStorage.setItem("Kanban-Board", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const setName = (title, bid) => {
    updateData(
      data?.map((board) =>
        board.id === bid ? { ...board, boardName: title } : board
      )
    );
  };

  const dragCardInBoard = (source, destination) => {
    const newData = [...data];
    const sourceBoard = newData.find(
      (board) => board.id === source.droppableId
    );
    const destinationBoard = newData.find(
      (board) => board.id === destination.droppableId
    );
    const sourceIndex = sourceBoard.card.findIndex(
      (card) => card.id === source.draggableId
    );
    const [draggedCard] = sourceBoard.card.splice(sourceIndex, 1);
    const destinationIndex = destination.index;
    destinationBoard.card.splice(destinationIndex, 0, draggedCard);
    updateData(newData);
  };

  const addCard = (title, bid) => {
    updateData(
      data?.map((board) =>
        board.id === bid
          ? { ...board, card: [...board.card, { id: uuidv4(), title }] }
          : board
      )
    );
  };

  const removeCard = (boardId, cardId) => {
    updateData(
      data.map((board) =>
        board.id === boardId
          ? {
              ...board,
              card: board.card.filter((card) => card.id !== cardId),
            }
          : board
      )
    );
  };

  const addBoard = (title) => {
    const newBoard = {
      id: uuidv4(),
      boardName: title,
      card: [],
    };
    updateData([...data, newBoard]);
  };

  const removeBoard = (bid) => {
    updateData(data.filter((board) => board.id !== bid));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    dragCardInBoard(source, destination);
  };

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem("Kanban-Board"));
    if (localStorageData) {
      setData(localStorageData[selectedItem] || []);
    }
  }, [selectedItem]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <div className="app_outer">
          <div className="app_boards">
            {data?.map((board) => (
              <Board
                key={board.id}
                id={board.id}
                name={board.boardName}
                card={board.card}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
              />
            ))}
            <Editable
              className={"add__board"}
              name={"New Column"}
              btnName={"New Column"}
              onSubmit={addBoard}
              placeholder={"Enter column  name"}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default AllBoards;
