import React, { Component } from "react";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";

class Column extends Component {
  render() {
    const { column, tasks, content } = this.props;
    // console.log(this.props, "column");

    return (
      <>
        <div className={`lesson-view-match-column column-${content}`}>
          <h2 className="title">{column.title}</h2>
          <Droppable droppableId={column.id.toString()}>
            {(provided, snaphot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`tasks ${snaphot.isDraggingOver ? "skyblue" : ""}`}
              >
                {tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    content={content}
                    index={index}
                  />
                ))}
                {/* placeholder */}

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
