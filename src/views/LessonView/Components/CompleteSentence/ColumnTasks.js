import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
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
              <span> {dividedSentence[0]}</span>

              <span className="lesson-complete-key-word-holder">
                {/* {values.columns["column-2"].taskIds[key] || "______"} */}
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
                        snaphot.isDraggingOver ? "dragging-over" : ""
                      }`}
                    >
                      <Draggable
                        draggableId={
                          values.columns[`answer-${key + 1}`].taskIds[0] ||
                          key.toString()
                        }
                        /* values.columns[`answer-${key + 1}`].taskIds[0] || */

                        index={0}
                      >
                        {(provided, snaphot) => (
                          <>
                            <div
                              className=""
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              {values.columns[`answer-${key + 1}`].taskIds[0]}
                            </div>
                          </>
                        )}
                      </Draggable>

                      {/* {values.columns[`answer-${key + 1}`].taskIds[0]} */}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </span>
              <span style={{ paddingLeft: "50px" }}> {dividedSentence[1]}</span>
            </div>
          );
        })}
        {/* {provided.placeholder} */}
        {/* </div> */}
        )}
      </div>
    );
  }
}

export default ColumnTasks;
