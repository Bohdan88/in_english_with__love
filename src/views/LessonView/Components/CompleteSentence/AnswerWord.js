import React, { Component } from "react";
import { Draggable } from "react-beautiful-dnd";

class AnswerWord extends Component {
  render() {
    const { task, index } = this.props;
    return task ? (
      <div>
        <Draggable draggableId={task.answer} index={index}>
          {(provided, snaphot) => (
            <>
              <div
                className="lesson-complete-answer-word"
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
              >
                {task.answer}
              </div>
            </>
          )}
        </Draggable>
      </div>
    ) : null;
  }
}

export default AnswerWord;
