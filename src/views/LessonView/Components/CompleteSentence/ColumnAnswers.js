import React, { Component } from "react";
import { Droppable } from "react-beautiful-dnd";
import AnswerWord from "./AnswerWord";

class ColumnAnswers extends Component {
  render() {
    const { tasks } = this.props;
    return (
      <div>
        <Droppable droppableId={"column-1"} direction="horizontal">
          {(provided, snaphot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`lesson-complete-answers-content ${
                snaphot.isDraggingOver ? "dragging-over" : ""
              }`}
            >
              {tasks.map((task, index) => {
                return <AnswerWord key={task.id} task={task} index={index} />;
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default ColumnAnswers;
