import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";

import Column from "./Column";
import {
  Container,
  Segment,
  Header,
  Label,
  Button,
  Icon,
  Progress,
  Popup,
} from "semantic-ui-react";

const matchExercise = {
  description: "Match the following sentences to their meanings below.",
  id: 0,
  name: "Matching",
  type: "From the video",
  content: [
    {
      contentId: "It is death-defying",
      contentLetter: "It’s very dangerous.",
      id: 0,
      letter: "C",
    },
    {
      contentId: "What we do is life-affirming",
      contentLetter:
        "What we do shows that we support and believe strongly in life.",
      id: 1,
      letter: "E",
    },
    {
      contentId: "The dance activates those spaces",
      contentLetter: "The dance makes those places alive and active.",
      id: 2,
      letter: "D",
    },
    {
      contentId: "It made sense to me.",
      contentLetter: "It felt right to me.",
      id: 3,
      letter: "A",
    },
    {
      contentId: "My goal is to achieve the state of non-thinking",
      contentLetter: "I want to feel completely present and in the moment.",
      id: 4,
      letter: "B",
    },
  ],
};

const initData = {
  tasks: {
    c: {
      contentId: "It is death-defying",
      contentLetter: "c) It’s very dangerous.",
      id: "c",
      answer: "0",
    },
    e: {
      contentId: "What we do is life-affirming",
      contentLetter:
        "e) What we do shows that we support and believe strongly in life.",
      id: "e",
      answer: "1",
    },
    d: {
      contentId: "The dance activates those spaces",
      contentLetter: "d) The dance makes those places alive and active.",
      id: "d",
      answer: "2",
    },
    a: {
      contentId: "It made sense to me.",
      contentLetter: "a) It felt right to me.",
      id: "a",
      answer: "3",
    },
    b: {
      contentId: "5. My goal is to achieve the state of non-thinking",
      contentLetter: "b) I want to feel completely present and in the moment.",
      id: "b",
      answer: "4",
    },
  },
  column: {
    id: "column",
    title: "Sentences",
    taskIds: ["a", "b", "c", "d", "e"],
  },

  columnOrder: ["column"],
};

class MatchExerciseView extends Component {
  state = {
    meaningColumn: initData,
    initData,
    checked: false,
    correctAnswers: [],
    isShowingSolution: false,
  };

  componentDidMount() {
    let solutions = [];
    Object.values(initData.tasks).map(
      (obj) => (solutions[obj.answer] = obj.id)
    );
    this.setState({
      correctSequence: solutions,
    });
  }

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
    this.setState({
      checked: false,
      correctAnswers: [],
      meaningColumn: {
        ...meaningColumn,
        column: {
          ...meaningColumn.column,
          taskIds: initData.column.taskIds,
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
    } = this.state;
    return (
      !!meaningColumn.column.taskIds.length && (
        <div className="lesson-view-match-container">
          <Label size="big" className="lesson-view-match-label">
            From the Video
          </Label>

          <p className="lesson-view-match-explanation">
            Match the following sentences to their meanings below.
            <Popup
              inverted
              className="lesson-view-match-popup"
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

          {checked && (
            <Progress
              size={"tiny"}
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
            />
          )}

          <Container className="lesson-view-match-content">
            <div className="columns-sentences-container">
              <Header
                as="h4"
                textAlign="center"
                className="lesson-view-match-header"
              >
                Sentences
              </Header>
              {matchExercise.content.map((taskId, key) => (
                <div className="tasks-container-contentId" key={key}>
                  <div>
                    {`${taskId.id + 1}. `}
                    {taskId.contentId}
                  </div>
                </div>
              ))}
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
              {initData.column.taskIds.map((taskId, key) => (
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
            <div className="lesson-view-match-retry-container">
              <Button
                primary
                className="lesson-view-match-check"
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
                  meaningColumn.column.taskIds.length ===
                    correctAnswers.length || isShowingSolution
                    ? true
                    : false
                }
                className="lesson-view-match-check"
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
            </div>
          ) : (
            <div className="lesson-view-match-retry-container">
              <Button
                primary
                className="lesson-view-match-check"
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
      )
    );
  }
}

export default MatchExerciseView;
