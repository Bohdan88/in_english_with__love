import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ColumnAnswers from "./ColumnAnswers";
import ColumnTasks from "./ColumnTasks";
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
      // console.log(newTasksIds, "newTasksIds");

      const newColumn = {
        ...start,
        taskIds: newTasksIds,
      };

      // console.log(newColumn,'newColumn.id]')
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
      console.log(source.index,'source.index')
      startTasksIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTasksIds,
      };

      // console.log(start.taskIds,'start.taskIds')

      const finishTasksIds = Array.from(finish.taskIds);
      finishTasksIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTasksIds,
      };

      // console.log(newStart,'newStart')
      // console.log(newFinish,'newFINISH')
      // console.log(newStart.id, "NEWSTARTID");
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
  render() {
    console.log(this.state, "this.state");
    return (
      <div className="lesson-complete-container">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className="lesson-complete-column-answers-container">
            <ColumnAnswers
              tasks={this.state.columns["column-1"].taskIds.map(
                (taskId) => this.state.tasks[taskId]
              )}
            />
          </div>
          <div className="lesson-complete-column-tasks-container">
            <ColumnTasks values={this.state} />
          </div>
        </DragDropContext>
      </div>
    );
  }
}

export default CompleteSentence;
