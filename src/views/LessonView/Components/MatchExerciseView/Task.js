import React, { Component } from "react";
import { Draggable } from "react-beautiful-dnd";

class Task extends Component {
  render() {
    const { task, index, content, checked, checkedValues } = this.props;

    return (
      <div className="task-blocks">
        <Draggable
          draggableId={task.id.toString()}
          isDragDisabled={checked && true}
          index={index}
        >
          {(provided, snaphot) => (
            <>
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className={`tasks-container-${content} ${
                  checked
                    ? checkedValues[task.id] !== task.id.toString()
                      ? "incorrect-match"
                      : "correct-match"
                    : ""
                } ${snaphot.isDragging ? "dragging" : ""}`}
              >
                {this.props.task[content]}
              </div>
            </>
          )}
        </Draggable>
      </div>
    );
  }
}

export default Task;
