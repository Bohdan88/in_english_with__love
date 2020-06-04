import React, { Component } from "react";
import { Droppable } from "react-beautiful-dnd";

class ColumnTasks extends Component {
  renderDroppableComponent = (key, value, dropId = undefined) => {
    const { values } = this.props;
    // const currentColumn = values.columns[`answer-${key + 1}`];
    // const currenValue = values.columns[`answer-${key + 1}`].taskIds[0];

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
                values.isChecked
                  ? values.columns[`answer-${key + 1}`].isCorrect
                    ? "correct-answer"
                    : "wrong-answer"
                  : ""
              }`}
            >
              <span
                className={`${
                  !values.isChecked ? "lesson-complete-answer-span" : ""
                }`}
                onClick={() => {
                  !values.isChecked &&
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

          answerValues.forEach(
            (rx) => (clonedSentence = clonedSentence.replace(rx, "** "))
          );

          clonedSentence = clonedSentence.split("**");
          {
            /* const currentColumn = values.columns[`answer-${key + 1}`]; */
          }
          {
            /* console.log( currentColumn,'currentColumn') */
          }

          {
            /* const currentColumn = values.columns[`answer-${key + 1}`];
          console.log(currentColumn.taskIds, "currentColumn.taskIds[0]"); */
          }
          {
            /* console.log(values.columns, "obj"); */
          }
          return (
            !obj.notRender && (
              <div
                style={{ display: `${obj.notRender ? "none" : "block"}` }}
                className={`lesson-complete-sentence ${
                  !!clonedSentence[2] ? "lesson-complete-reverse" : ""
                }`}
                key={obj.id}
              >
                {`${key + 1}.  `} {clonedSentence[0]}
                {/* {this.renderDroppableComponent(
                  key,
                  !!clonedSentence[2] ? 0 : null)} */}
                {/* <div className="lesson-complete-key-word-taken-holder">
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
                        } ${
                          values.isChecked
                            ? values.columns[`answer-${key + 1}`].isCorrect
                              ? "correct-answer"
                              : "wrong-answer"
                            : ""
                        }`}
                      >
                        <span
                          className={`${
                            !values.isChecked
                              ? "lesson-complete-answer-span"
                              : ""
                          }`}
                          onClick={() => {
                            !values.isChecked &&
                              this.props.removeWordFromColumn(
                                values.columns[`answer-${key + 1}`].taskIds[0],
                                `answer-${key + 1}`
                              );
                          }}
                        >
                          {!clonedSentence[2]
                            ? values.columns[`answer-${key + 1}`].taskIds[0]
                            : currentColumn.taskIds[0] &&
                              currentColumn.taskIds[0].split(" ")[0]}
                        </span>

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div> */}
                {this.renderDroppableComponent(
                  key,
                  !clonedSentence[2]
                    ? values.columns[`answer-${key + 1}`].taskIds[0]
                    : values.columns[`answer-${key + 1}`].taskIds[0] &&
                        values.columns[`answer-${key + 1}`].taskIds[0].split(
                          " "
                        )[0]
                )}
                {clonedSentence[1]}
                {
                  !!clonedSentence[2] &&
                    this.renderDroppableComponent(
                      key,
                      (values.columns[`answer-${key + 1}`].taskIds[0] &&
                        values.columns[`answer-${key + 1}`].taskIds[0].split(
                          " "
                        )[1]) ||
                        "",
                      "second"
                    )
                  /* <div className="lesson-complete-key-word-taken-holder">
                    <Droppable
                      isDropDisabled={
                        values.columns[`answer-${key + 1}`].taskIds.length === 1
                          ? true
                          : false
                      }
                      droppableId={`answer-${key + 1}second`}
                    >
                      {(provided, snaphot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`lesson-complete-sentences-content ${
                            snaphot.isDraggingOver
                              ? "dragging-over-complete"
                              : ""
                          } ${
                            values.isChecked
                              ? values.columns[`answer-${key + 1}`].isCorrect
                                ? "correct-answer"
                                : "wrong-answer"
                              : ""
                          }`}
                        >
                          <span
                            className={`${
                              !values.isChecked
                                ? "lesson-complete-answer-span"
                                : ""
                            }`}
                            onClick={() => {
                              !values.isChecked &&
                                this.props.removeWordFromColumn(
                                  values.columns[`answer-${key + 1}`]
                                    .taskIds[0],
                                  `answer-${key + 1}`
                                );
                            }}
                          >
                            {(values.columns[`answer-${key + 1}`].taskIds[0] &&
                              values.columns[
                                `answer-${key + 1}`
                              ].taskIds[0].split(" ")[1]) ||
                              ""}
                          </span>

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div> */
                }
              </div>
            )
          );
        })}
      </div>
    );
  }
}

export default ColumnTasks;
