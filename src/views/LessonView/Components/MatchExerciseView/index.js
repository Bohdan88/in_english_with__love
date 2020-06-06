import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";

import Column from "./Column";
import {
  Container,
  Header,
  Button,
  Icon,
  Progress,
  Popup,
  Message,
  Table,
} from "semantic-ui-react";
import { CHAR_SEQUENCE } from "../../../../constants/shared";

// styles
import "./style.scss";

class MatchExerciseView extends Component {
  state = {
    meaningColumn: {},
    checked: false,
    correctAnswers: [],
    isShowingSolution: false,
    exerciseDescription: "",
  };

  setInitValues = () => {
    const { lessonValues } = this.props;
    let solutions = [];
    Object.values(this.transformLessonValues(lessonValues.content).tasks).map(
      (obj) => (solutions[obj.answer] = obj.id)
    );
    this.setState({
      meaningColumn: this.transformLessonValues(lessonValues.content),
      correctSequence: solutions,
      exerciseDescription: lessonValues.description,
      checked: false,
    });
  };

  componentDidMount() {
    this.setInitValues();
  }

  componentDidUpdate() {
    const { exerciseDescription } = this.state;
    const { lessonValues } = this.props;

    if (lessonValues.description !== exerciseDescription) {
      this.setInitValues();
    }
  }
  transformLessonValues = (content) => {
    let transformedObj = {
      tasks: {},
      column: {
        id: "column",
        title: "Sentences",
        taskIds: CHAR_SEQUENCE.slice(0, content.length),
      },
    };

    content.forEach((obj) => {
      transformedObj.tasks[[obj.letter]] = {
        ...obj,
        answer: obj.id.toString(),
        id: obj.letter,
      };
    });

    return transformedObj;
  };

  checkTask = () => {
    this.setState({
      checked: true,
      correctAnswers: this.state.meaningColumn.column.taskIds.filter(
        (id, key) => {
          return this.state.correctSequence[key] === id;
        }
      ),
    });
  };

  retryTask = () => {
    const { meaningColumn } = this.state;
    const { lessonValues } = this.props;
    this.setState({
      checked: false,
      correctAnswers: [],
      meaningColumn: {
        ...meaningColumn,
        column: {
          ...meaningColumn.column,
          taskIds: this.transformLessonValues(lessonValues.content).column
            .taskIds,
        },
      },
      isShowingSolution: false,
    });
  };

  showSolution = () => {
    const { meaningColumn, correctSequence } = this.state;

    this.setState({
      isShowingSolution: true,
      correctAnswers: correctSequence,
      meaningColumn: {
        ...meaningColumn,
        column: {
          ...meaningColumn.column,
          taskIds: correctSequence,
        },
      },
    });
  };

  onDragEnd = (result) => {
    const { meaningColumn } = this.state;
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
    // copy new array
    const newTasksIds = Array.from(meaningColumn.column.taskIds);
    newTasksIds.splice(source.index, 1);
    newTasksIds.splice(destination.index, 0, draggableId);

    this.setState({
      meaningColumn: {
        ...meaningColumn,
        column: {
          ...meaningColumn.column,
          taskIds: newTasksIds,
        },
      },
    });
  };

  render() {
    const {
      meaningColumn,
      checked,
      correctAnswers,
      isShowingSolution,
      correctSequence,
      exerciseDescription,
    } = this.state;
    const { lessonValues } = this.props;
    // console.log(lessonValues, "lessonValues");
    // console.log(this.state, "MATCHSTATE");
    return !!Object.entries(meaningColumn).length &&
      !!meaningColumn.column.taskIds.length ? (
      <div className="lesson-view-match-container">
        <p className="lesson-view-exercise-explanation">
          {exerciseDescription}
          <Popup
            inverted
            className="lesson-view-exercise-popup"
            content="Please use your mouse or touchpad to move sentences with letters in the front in an appropriate field."
            trigger={
              <Icon
                name="circle question"
                className="lesson-view-match-icon"
                size="small"
              />
            }
          />
        </p>

        <Container className="lesson-view-match-content">
          <div className="columns-sentences-container">
            <Header
              as="h4"
              textAlign="center"
              className="lesson-view-match-header"
            >
              Sentences
            </Header>
            {lessonValues.content.map((taskId, key) => {
              const wordsInCurlyBraces = /\{.*?\}/g;

              const answerValues = taskId.contentId.match(wordsInCurlyBraces);
              let clonedSentence = taskId.contentId;
              if (answerValues) {
                answerValues.forEach(
                  (word) =>
                    (clonedSentence = clonedSentence.replace(
                      word,
                      `<b> ${word.slice(1, -1)}</b>`
                    ))
                );
              }
              return (
                <div className="tasks-container-contentId" key={key}>
                  <div>
                    {`${taskId.id + 1}. `}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: clonedSentence,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="columns-container">
              <Column
                key={meaningColumn.column.id}
                column={meaningColumn.column}
                content={"contentLetter"}
                title={"Meaning"}
                tasks={meaningColumn.column.taskIds.map(
                  (taskId) => meaningColumn.tasks[taskId]
                )}
                checked={checked}
              />
            </div>
          </DragDropContext>
          <div className="lesson-match-view-container-answers">
            {this.transformLessonValues(
              lessonValues.content
            ).column.taskIds.map((taskId, key) => (
              <div className="lesson-match-view-check-answer" key={key}>
                <Icon
                  className="lesson-match-view-check-icon"
                  style={{ display: checked ? "inline-block" : "none" }}
                  name={
                    checked &&
                    meaningColumn.column.taskIds[key] === correctSequence[key]
                      ? "check"
                      : "close"
                  }
                  color={
                    checked &&
                    meaningColumn.column.taskIds[key] === correctSequence[key]
                      ? "green"
                      : "red"
                  }
                  size="large"
                />
              </div>
            ))}
          </div>
        </Container>
        {checked ? (
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
              color="teal"
              disabled={
                meaningColumn.column.taskIds.length === correctAnswers.length ||
                isShowingSolution
                  ? true
                  : false
              }
              className="lesson-view-button-exercise-check"
              onClick={this.showSolution}
            >
              Solution
              <Icon
                fitted
                className="lesson-view-match-icon-check"
                name={
                  meaningColumn.column.taskIds.length ===
                    correctAnswers.length || isShowingSolution
                    ? "lock open"
                    : "lock"
                }
              />
            </Button>
            {/* <Progress
              size={"medium"}
              className="lesson-view-match-progress"
              total={this.state.meaningColumn.column.taskIds.length}
              value={this.state.correctAnswers.length}
              success={
                correctAnswers.length ===
                this.state.meaningColumn.column.taskIds.length
                  ? true
                  : false
              }
              warning={
                correctAnswers.length >= 1 &&
                correctAnswers.length <
                  this.state.meaningColumn.column.taskIds.length
                  ? true
                  : false
              }
              error={correctAnswers.length === 0}
            /> */}
          </div>
        ) : (
          <div className="lesson-view-exercise-check-container">
            <Button
              primary
              className="lesson-view-button-exercise-check"
              onClick={this.checkTask}
            >
              Check
              <Icon
                fitted
                className="lesson-view-match-icon-check"
                name="check"
              />
            </Button>
          </div>
        )}
      </div>
    ) : (
      <Message className="error-message" size="massive" negative>
        <Message.Header>Oops! something went wrong...</Message.Header>
        <Message.Content>
          Unfortunately an exercise can't be loaded = (
        </Message.Content>
      </Message>
    );
  }
}

export default MatchExerciseView;
