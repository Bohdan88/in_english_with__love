import React, { Component } from "react";
import { Droppable } from "react-beautiful-dnd";
import { SUB_FIELD } from "../../../../constants";

class ColumnTasks extends Component {
  renderDroppableComponent = (key, value, dropId = undefined) => {
    const { values, isChecked } = this.props;
    return (
      <div className="lesson-complete-key-word-taken-holder">
        <Droppable
          isDropDisabled={
            values.columns[`answer-${key + 1}`].taskIds.length === 1
              ? true
              : false
          }
          droppableId={`answer-${key + 1}${dropId || ""}`}
        >
          {(provided, snaphot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`lesson-complete-sentences-content ${
                snaphot.isDraggingOver ? "dragging-over-complete" : ""
              } ${
                isChecked
                  ? values.columns[`answer-${key + 1}`].isCorrect
                    ? "correct-answer"
                    : "wrong-answer"
                  : ""
              }`}
            >
              <span
                className={`${!isChecked ? "lesson-complete-answer-span" : ""}`}
                onClick={() => {
                  !isChecked &&
                    this.props.removeWordFromColumn(
                      values.columns[`answer-${key + 1}`].taskIds[0],
                      `answer-${key + 1}`
                    );
                }}
              >
                {value}
              </span>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };
  render() {
    const { values } = this.props;
    const wordsInCurlyBraces = /\{.*?\}/g;
    return (
      <div>
        {Object.values(values.tasks).map((obj, key) => {
          const answerValues = obj.sentence.match(wordsInCurlyBraces);
          let clonedSentence = obj.sentence;

          answerValues &&
            answerValues.forEach(
              (rx) => (clonedSentence = clonedSentence.replace(rx, "** "))
            );
          clonedSentence = clonedSentence.split("**");
          const column = values.columns[`answer-${key + 1}`];
          return (
            <div
              className={`lesson-complete-sentence ${
                !!clonedSentence[2] ? "lesson-complete-reverse" : ""
              }`}
              key={obj.id}
            >
              {`${key + 1}.  `} {clonedSentence[0]}
              {this.renderDroppableComponent(
                key,
                !clonedSentence[2]
                  ? column.taskIds[0]
                  : column.taskIds[0] && column.taskIds[0].split(" ")[0]
              )}
              {clonedSentence[1]}
              {!!clonedSentence[2] &&
                this.renderDroppableComponent(
                  key,
                  (column.taskIds[0] && column.taskIds[0].split(" ")[1]) || "",
                  SUB_FIELD
                )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default ColumnTasks;
