import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ColumnAnswers from "./ColumnAnswers";
import ColumnTasks from "./ColumnTasks";
import { Popup, Icon, Button, Sticky, Message } from "semantic-ui-react";
import { shuffleArray } from "../../../../utils";
import { SUB_FIELD } from "../../../../constants";

// styles
import "./style.scss";

class CompleteSentence extends Component {
  state = {
    exerciseData: {},
    exerciseDescription: "",
    isShowingSolution: false,
    checked: false,
    correctAnswers: [],
  };

  setInitValues = () => {
    const { lessonValues } = this.props;

    const transformedValues = this.transformLessonValues(lessonValues.content);
    this.setState({
      exerciseData: {
        ...transformedValues,
        columns: {
          ...transformedValues.columns,
          // eslint-disable-next-line
          ["column-1"]: {
            ...transformedValues.columns["column-1"],
            taskIds: shuffleArray(
              transformedValues.columns["column-1"].taskIds
            ),
          },
        },
      },
      correctAnswers: this.transformLessonValues(lessonValues.content).columns[
        "column-1"
      ].taskIds,
      exerciseDescription: lessonValues.description,
      checked: false,
    });
  };

  componentDidMount() {
    this.setInitValues();
  }

  componentDidUpdate() {
    const { exerciseDescription } = this.state;
    if (this.props.lessonValues.description !== exerciseDescription) {
      this.setInitValues();
    }
  }

  transformLessonValues = (content) => {
    let transfomedObj = { columns: {}, tasks: {} };

    content.forEach((obj) => {
      // fill columns
      transfomedObj.columns[`answer-${obj.id + 1}`] = {
        id: `answer-${obj.id + 1}`,
        isCorrect: false,
        taskIds: [],
      };
      // fill tasks
      transfomedObj.tasks[obj.answer] = {
        ...obj,
        id: obj.id + 1,
      };
    });

    // add main column
    transfomedObj.columns["column-1"] = {
      id: "column-1",
      taskIds: Object.keys(transfomedObj.tasks),
      title: "Sentences",
    };

    return transfomedObj;
  };

  removeWordFromColumn = (word, column) => {
    const exerciseData = Object.assign({}, this.state.exerciseData);
    exerciseData.columns[column].taskIds = [];
    exerciseData.columns["column-1"].taskIds.push(word);
    this.setState({ exerciseData });
  };

  onDragEnd = (result) => {
    const { exerciseData } = this.state;
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // replace if it's a subfield => 'set' smth 'out' and user tries to put value into 'out' field.
    if (destination.droppableId.includes(SUB_FIELD)) {
      destination.droppableId = destination.droppableId.replace(SUB_FIELD, "");
    }

    const start = exerciseData.columns[source.droppableId];
    const finish = exerciseData.columns[destination.droppableId];

    if (start === finish) {
      // copy new array
      const newTasksIds = Array.from(start.taskIds);
      newTasksIds.splice(source.index, 1);
      newTasksIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTasksIds,
      };

      const newState = {
        ...exerciseData,
        columns: {
          ...exerciseData.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
    } else {
      // moving from one list to another
      const startTasksIds = Array.from(start.taskIds);
      startTasksIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTasksIds,
      };

      const finishTasksIds = Array.from(finish.taskIds);
      finishTasksIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTasksIds,
      };

      const newState = {
        ...exerciseData,
        columns: {
          ...exerciseData.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      this.setState({ exerciseData: newState });
    }
  };

  checkTask = () => {
    const { exerciseData, correctAnswers } = this.state;
    // if all words were dragged from a box of words by user
    // if (!exerciseData.columns["column-1"].taskIds.length) {
    // check if answer was correct
    Object.values(exerciseData.columns)
      .filter((obj) => obj.id !== "column-1")
      .forEach((obj, key) => {
        // check position of answers
        if (correctAnswers[key] === obj.taskIds[0]) {
          obj.isCorrect = true;

          this.setState({
            ...exerciseData,
            columns: {
              ...exerciseData,
              [obj.id]: obj,
            },
          });
        }
      });

    this.setState({
      isChecked: true,
    });
  };

  retryTask = () => {
    const { lessonValues } = this.props;

    const transformedValues = this.transformLessonValues(lessonValues.content);
    this.setState({
      exerciseData: {
        ...transformedValues,
        columns: {
          ...transformedValues.columns,
          // eslint-disable-next-line
          ["column-1"]: {
            ...transformedValues.columns["column-1"],
            taskIds: shuffleArray(
              transformedValues.columns["column-1"].taskIds
            ),
          },
        },
      },
      isChecked: false,
      isShowingSolution: false,
    });
  };

  showSolution = () => {
    const clonedExerciseData = Object.assign({}, this.state.exerciseData);

    Object.values(clonedExerciseData.columns)
      .filter((obj) => obj.id !== "column-1")
      .forEach((obj, key) => {
        // assign correct answers to each object
        obj.taskIds[0] = this.state.correctAnswers[key];
        obj.isCorrect = true;
      });

    clonedExerciseData.columns["column-1"].taskIds = [];

    this.setState({
      exerciseData: {
        ...this.state.exerciseData,
        columns: clonedExerciseData.columns,
      },
      isChecked: true,
      isShowingSolution: true,
    });
  };

  render() {
    const {
      isChecked,
      isShowingSolution,
      exerciseData,
      exerciseDescription,
    } = this.state;

    return !!Object.keys(exerciseData).length ? (
      <div className="lesson-complete-container">
        <p className="lesson-view-exercise-explanation">
          {exerciseDescription}
          <Popup
            inverted
            basic
            className="lesson-view-exercise-popup"
            content="Please use your mouse or touchpad to move words from the box into an empty field in an appropriate sentence."
            trigger={
              <Icon
                name="circle question"
                className="lesson-view-match-icon"
                size="small"
              />
            }
          />
        </p>

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Sticky styleElement={{ top: "167px" }}>
            <div className="lesson-complete-column-answers-container">
              <ColumnAnswers
                tasks={exerciseData.columns["column-1"].taskIds.map(
                  (taskId) => exerciseData.tasks[taskId]
                )}
              />
            </div>
          </Sticky>
          <div className="lesson-complete-column-tasks-container">
            <ColumnTasks
              removeWordFromColumn={this.removeWordFromColumn}
              values={exerciseData}
              isChecked={isChecked}
            />
          </div>
        </DragDropContext>

        {isChecked ? (
          <div className="lesson-view-exercise-check-container">
            <Button
              primary
              className="lesson-view-button-exercise-check"
              onClick={this.retryTask}
            >
              Retry
              <Icon
                fitted
                className="lesson-view-match-icon-check"
                name="repeat"
              />
            </Button>
            <Button
              disabled={isShowingSolution}
              color="teal"
              className="lesson-view-button-exercise-check"
              onClick={this.showSolution}
            >
              Solution
              <Icon
                fitted
                className="lesson-view-match-icon-check"
                name={isShowingSolution ? "lock open" : "lock"}
              />
            </Button>
          </div>
        ) : (
          <div className="lesson-view-exercise-check-container">
            <Popup
              inverted
              on="hover"
              disabled={!exerciseData.columns["column-1"].taskIds.length}
              content={"Please fill all the empty fields to check your result."}
              trigger={
                <Button
                  /* disabled={!!exerciseData.columns["column-1"].taskIds.length} */
                  primary
                  onClick={this.checkTask}
                  /* className={` lesson-view-button-exercise-check ${
                    !!exerciseData.columns["column-1"].taskIds.length
                      ? "button-disabled"
                      : ""
                  }  `} */
                >
                  Check
                  <Icon
                    fitted
                    className="lesson-view-match-icon-check"
                    name="check"
                  />
                </Button>
              }
            />
          </div>
        )}
      </div>
    ) : (
      <Message className="error-message" size="massive" negative>
        <Message.Header>Oops! Something went wrong...</Message.Header>
        <Message.Content>
          Unfortunately an exercise can't be loaded =(
        </Message.Content>
      </Message>
    );
  }
}

export default CompleteSentence;
