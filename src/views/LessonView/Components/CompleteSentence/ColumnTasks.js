import React, { Component } from "react";
import { Droppable } from "react-beautiful-dnd";
class ColumnTasks extends Component {
  render() {
    const { values } = this.props;

    const wordsInCurlyBraces = /\{.*?\}/g;
    return (
      <div>
        {Object.values(values.tasks).map((obj, key) => {
          const answerValues = obj.sentence.match(wordsInCurlyBraces);
          const dividedSentence = obj.sentence.split(answerValues[0]);

          return (
            <div className="lesson-complete-sentence" key={obj.id}>
              {`${key + 1}.  `} {dividedSentence[0]}
              <div className="lesson-complete-key-word-taken-holder">
                <Droppable
                  isDropDisabled={
                    values.columns[`answer-${key + 1}`].taskIds.length === 1
                      ? true
                      : false
                  }
                  droppableId={`answer-${key + 1}`}
                >
                  {(provided, snaphot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`lesson-complete-sentences-content ${
                        snaphot.isDraggingOver ? "dragging-over-complete" : ""
                      }`}
                    >
                      <span
                        className={`lesson-complete-answer-span ${
                          values.isChecked ? "correct-answer" : "wrong-answer"
                        }`}
                        onClick={() => {
                          this.props.removeWordFromColumn(
                            values.columns[`answer-${key + 1}`].taskIds[0],
                            `answer-${key + 1}`
                          );
                        }}
                      >
                        {values.columns[`answer-${key + 1}`].taskIds[0]}
                      </span>

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              {dividedSentence[1]}
            </div>
          );
        })}
      </div>
    );
  }
}

export default ColumnTasks;
