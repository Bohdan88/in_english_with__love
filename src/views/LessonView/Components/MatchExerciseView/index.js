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
} from "semantic-ui-react";

const matchExercise = {
  description: "Match the following sentences to their meanings below.",
  id: 0,
  name: "Matching",
  type: "From the video",
  content: [
    {
      contentId: "1.It is death-defying",
      contentLetter: "It’s very dangerous.",
      id: 0,
      letter: "C",
    },
    {
      contentId: "2.What we do is life-affirming",
      contentLetter:
        "What we do shows that we support and believe strongly in life.",
      id: 1,
      letter: "E",
    },
    {
      contentId: "3.The dance activates those spaces",
      contentLetter: "The dance makes those places alive and active.",
      id: 2,
      letter: "D",
    },
    {
      contentId: "4.It made sense to me.",
      contentLetter: "It felt right to me.",
      id: 3,
      letter: "A",
    },
    {
      contentId: "5.My goal is to achieve the state of non-thinking",
      contentLetter: "I want to feel completely present and in the moment.",
      id: 4,
      letter: "B",
    },
  ],
};

const initData = {
  tasks: {
    "0": {
      contentId: "It is death-defying",
      contentLetter: "c) It’s very dangerous.",
      id: "0",
      letter: "C",
    },
    "1": {
      contentId: "What we do is life-affirming",
      contentLetter:
        "e) What we do shows that we support and believe strongly in life.",
      id: "1",
      letter: "E",
    },
    "2": {
      contentId: "The dance activates those spaces",
      contentLetter: "d) The dance makes those places alive and active.",
      id: "2",
      letter: "D",
    },
    "3": {
      contentId: "It made sense to me.",
      contentLetter: "a) It felt right to me.",
      id: "3",
      letter: "A",
    },
    "4": {
      contentId: "5. My goal is to achieve the state of non-thinking",
      contentLetter: "b) I want to feel completely present and in the moment.",
      id: "4",
      letter: "B",
    },
  },
  column: {
    id: "column",
    title: "Sentences",
    taskIds: ["0", "1", "2", "3", "4"],
  },

  columnOrder: ["column"],
};

const shuffleArray = (arr) =>
  arr
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);

class MatchExerciseView extends Component {
  state = {
    meaningColumn: initData,
    initData,
    checked: false,
    correctAnswers: [],
    isShowingSolution: false,
  };

  componentDidMount() {
    this.setState({
      meaningColumn: {
        ...this.state.meaningColumn,
        column: {
          ...this.state.meaningColumn.column,
          taskIds: shuffleArray(initData.column.taskIds),
        },
      },
    });
  }

  checkTask = () => {
    this.setState({
      checked: true,
      checkedValues: this.state.meaningColumn.column.taskIds,
      correctAnswers: this.state.meaningColumn.column.taskIds.filter(
        (id, key) => initData.column.taskIds[key] === id
      ),
    });
  };

  retryTask = () => {
    const { meaningColumn } = this.state;
    this.setState({
      checked: false,
      checkedValues: [],
      meaningColumn: {
        ...meaningColumn,
        column: {
          ...meaningColumn.column,
          taskIds: shuffleArray(initData.column.taskIds),
        },
      },
      isShowingSolution: false,
    });
  };

  showSolution = () => {
    const { meaningColumn } = this.state;
    this.setState({
      isShowingSolution: true,
      checkedValues: initData.column.taskIds,
      correctAnswers: initData.column.taskIds,
      meaningColumn: {
        ...meaningColumn,
        column: {
          ...meaningColumn.column,
          taskIds: initData.column.taskIds,
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
    console.log(newTasksIds, "newTasksIdsnewTasksIds");
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
      checkedValues,
      correctAnswers,
      isShowingSolution,
    } = this.state;

    return (
      !!meaningColumn.column.taskIds.length && (
        <div className="lesson-view-match-container">
          <Label size="big" className="lesson-view-match-label">
            From the Video
          </Label>

          <p className="lesson-view-match-explanation">
            Match the following sentences to their meanings below.
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
              {initData.column.taskIds.map((taskId, key) => (
                <div className="tasks-container-contentId" key={key}>
                  <div>
                    {`${+initData.tasks[taskId].id + 1}. `}
                    {initData.tasks[taskId].contentId}
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
                  checkedValues={checkedValues}
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
                      checked && checkedValues[key] === key.toString()
                        ? "check"
                        : "close"
                    }
                    color={
                      checked && checkedValues[key] === key.toString()
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
          )}
        </div>
      )
    );
  }
}

export default MatchExerciseView;
