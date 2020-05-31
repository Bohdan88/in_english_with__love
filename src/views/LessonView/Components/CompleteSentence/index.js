import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ColumnAnswers from "./ColumnAnswers";
import ColumnTasks from "./ColumnTasks";
import { Popup, Icon, Button } from "semantic-ui-react";
// styles
import "./style.scss";

const content = [
  {
    answer: "merge",
    id: 0,
    sentence: "We can {merge} our two small businesses into a bigger one.",
  },
  {
    answer: "overlook",
    id: 1,
    sentence: "It’s easy to {overlook} a small detail like this one.",
  },

  {
    answer: "daredevil",
    id: 3,
    sentence:
      "She’s a bit of a {daredevil}. She loves climbing buildings and mountains.",
  },
  {
    answer: "defy",
    id: 4,
    sentence: "Importing food that we can grow here {defy} common sense.",
  },
  {
    answer: "antsy",
    id: 5,
    sentence: "I feel {antsy} today, I don’t know why.",
  },
  {
    answer: "tenacity",
    id: 6,
    sentence: "We’ve always admired him for his {tenacity} and dedication.",
  },
];

const initData = {
  tasks: {
    merge: {
      answer: "merge",
      id: 0,
      sentence: "We can {merge} our two small businesses into a bigger one.",
    },
    overlook: {
      answer: "overlook",
      id: 1,
      sentence: "It’s easy to {overlook} a small detail like this one.",
    },

    daredevil: {
      answer: "daredevil",
      id: 3,
      sentence:
        "She’s a bit of a {daredevil}. She loves climbing buildings and mountains.",
    },
    defy: {
      answer: "defy",
      id: 4,
      sentence: "Importing food that we can grow here {defy} common sense.",
    },
    antsy: {
      answer: "antsy",
      id: 5,
      sentence: "I feel {antsy} today, I don’t know why.",
    },
    tenacity: {
      answer: "tenacity",
      id: 6,
      sentence: "We’ve always admired him for his {tenacity} and dedication.",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Sentences",
      taskIds: ["merge", "overlook", "daredevil", "defy", "antsy", "tenacity"],
    },

    "answer-1": {
      id: "answer-1",
      taskIds: [],
    },
    "answer-2": {
      id: "answer-2",
      taskIds: [],
    },
    "answer-3": {
      id: "answer-3",
      taskIds: [],
    },
    "answer-4": {
      id: "answer-4",
      taskIds: [],
    },
    "answer-5": {
      id: "answer-5",
      taskIds: [],
    },
    "answer-6": {
      id: "answer-6",
      taskIds: [],
    },
  },
  // columnOrder: ["column-1", "column-2"],
};

class CompleteSentence extends Component {
  state = initData;

  removeWordFromColumn = (word, column) => {
    const state = Object.assign({}, this.state);
    state.columns[column].taskIds = [];
    state.columns["column-1"].taskIds.push(word);
    this.setState({ state });
  };
  onDragEnd = (result) => {
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

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

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
        ...this.state,
        columns: {
          ...this.state.columns,
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
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };

      this.setState(newState);
    }
  };

  checkTask = () => {};
  render() {
    return (
      <div className="lesson-complete-container">
        <p className="lesson-view-exercise-explanation">
          Complete the sentences with one of the words below.
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
          <div className="lesson-complete-column-answers-container">
            <ColumnAnswers
              tasks={this.state.columns["column-1"].taskIds.map(
                (taskId) => this.state.tasks[taskId]
              )}
            />
          </div>
          <div className="lesson-complete-column-tasks-container">
            <ColumnTasks
              removeWordFromColumn={this.removeWordFromColumn}
              values={this.state}
            />
          </div>
        </DragDropContext>
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
      </div>
    );
  }
}

export default CompleteSentence;
