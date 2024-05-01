import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import "./Board.css";
import { MoreHorizontal } from "react-feather";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";
import { Droppable } from "react-beautiful-dnd";
export default function Board(props) {
  const [dropdown, setDropdown] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");

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

  return (
    <div style={{ marginBottom: "20px" }} className="board">
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
              <p onClick={() => props.removeBoard(props.id)}>Delete Board</p>
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
      <div className="board__footer">
        <Editable
          name={"Add Card"}
          btnName={"Add Card"}
          placeholder={"Enter Card Title"}
          onSubmit={(value) => props.addCard(value, props.name)}
        />
      </div>
    </div>
  );
}
