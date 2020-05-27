import React, { Component } from "react";
import { Draggable } from "react-beautiful-dnd";

class Task extends Component {
  render() {
    const { task, index, content } = this.props;
    return (
      <div className="task-blocks">
        <Draggable draggableId={task.id.toString()} index={index}>
          {(provided, snaphot) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              /* style={{
              backgroundColor: `${
                snaphot.isDragging ? "lightgreen" : "white"
              } `,
            }} */

              className={`tasks-container-${content} ${
                snaphot.isDragging ? "" : ""
              }`}
            >
              {this.props.task[content]}
            </div>
          )}
        </Draggable>
        <div className={`after-column-${content}`}> </div>
      </div>
    );
  }
}

export default Task;
