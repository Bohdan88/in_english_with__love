import React, { Component } from "react";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import { Header } from "semantic-ui-react";

class Column extends Component {
  render() {
    const {
      column,
      tasks,
      content,
      title,
      checked,
      checkedValues,
    } = this.props;
    // console.log(this.props, "column");
    // console.log(column.id, "column.id");
    return (
      <>
        <div className={`lesson-view-match-column column-${content}`}>
          <Header as="h4" textAlign="center" className="title">
            {title}
          </Header>
          <Droppable isDropDisabled={checked && true} droppableId={column.id}>
            {(provided, snaphot) => (
              <div
                /*  skyblue : blue"*/
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`tasks ${snaphot.isDraggingOver ? "skyblue" : ""}`}
              >
                {/* {console.log(provided,'PROVIDED')}
              {console.log(snaphot,'snaphot')} */}
                {tasks.map((task, index) => {
                  return (
                    <Task
                      isDraggingOver={false}
                      key={task.id}
                      task={task}
                      content={content}
                      index={index}
                      checked={checked}
                      checkedValues={checkedValues}
                    />
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </>
    );
  }
}

export default Column;
