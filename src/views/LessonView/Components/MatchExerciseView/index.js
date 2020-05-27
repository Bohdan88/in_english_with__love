import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { Container, Segment } from "semantic-ui-react";

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
      contentId: "1.It is death-defying",
      contentLetter: "It’s very dangerous.",
      id: "0",
      letter: "C",
    },
    "1": {
      contentId: "2.What we do is life-affirming",
      contentLetter:
        "What we do shows that we support and believe strongly in life.",
      id: "1",
      letter: "E",
    },
    "2": {
      contentId: "3.The dance activates those spaces",
      contentLetter: "The dance makes those places alive and active.",
      id: "2",
      letter: "D",
    },
    "3": {
      contentId: "4.It made sense to me.",
      contentLetter: "It felt right to me.",
      id: "3",
      letter: "A",
    },
    "4": {
      contentId: "5.My goal is to achieve the state of non-thinking",
      contentLetter: "I want to feel completely present and in the moment.",
      id: "4",
      letter: "B",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Sentences",
      taskIds: ["0", "1", "2", "3", "4"],
    },
  },

  columnOrder: ["column-1"],
};

// initData.columns["column-1"].taskIds = ["0", "1", "2", "3", "4"]
//   .map((a) => [Math.random(), a])
//   .sort((a, b) => a[0] - b[0])
//   .map((a) => a[1]);

// console.log(initData.columns,'initData.columns.taskIds')
// var shuffled = array.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);

const shuffleArray = (arr) =>
  arr
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
// const shuffledVasa =
class MatchExerciseView extends Component {
  state = {
    meaning: initData,
    initData,
  };

  componentDidMount() {
    this.setState({
      meaning: {
        ...this.state.meaning,
        columns: {
          ...this.state.meaning.columns,
          "column-1": {
            ...this.state.meaning.columns["column-1"],
            taskIds: shuffleArray(["0", "1", "2", "3", "4"]),
          },
        },
      },
    });
  }
  onDragStart = () => {};
  onDragEnd = (result, stateValue) => {
    // console.log(stateValue,'stateValue')
    // const { initData } = this.state;
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
    // console.log(initData,'this.state.columns')
    const start = this.state[stateValue].columns[source.droppableId];
    const finish = this.state[stateValue].columns[destination.droppableId];

    // console.log(destination,'destination.droppableId')
    // console.log(start,'start')
    // console.log(finish,'FINISH')

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
        ...this.state[stateValue],
        columns: {
          ...this.state[stateValue].columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState({ [stateValue]: newState });
    } else {
      // moving from one list to another
      // const startTasksIds = Array.from(start.taskIds);
      // startTasksIds.splice(source.index, 1);
      // // console.log(startTasksIds, "startTasksIds");
      // const newStart = {
      //   ...start,
      //   taskIds: startTasksIds,
      // };
      // const finishTasksIds = Array.from(finish.taskIds);
      // finishTasksIds.splice(destination.index, 0, draggableId);
      // const newFinish = {
      //   ...finish,
      //   taskIds: finishTasksIds,
      // };
      // // console.log(newStart, "newStart");
      // // console.log(draggableId,'draggableId')
      // console.log(finishTasksIds, "newFinish");
      // console.log(finish, "finish");
      // const newState = {
      //   ...this.state.initData,
      //   columns: {
      //     ...this.state.initData.columns,
      //     [newStart.id]: newStart,
      //     [newFinish.id]: newFinish,
      //   },
      // };
      // // console.log(newState, "newState");
      // this.setState({ initData: newState });
    }
  };

  render() {
    const { initData, meaning } = this.state;
    // console.log(initData, "THIs STATE");
    console.log(this.state, "thisdtate");
    return (
      this.state.meaning.columns["column-1"].taskIds.length && (
        <div>
          <Container className="lesson-view-match-container">
            {/* <Segment.Group className="lesson-view-math-segment-group">
            {matchExercise.content.map((obj) => {
              return (
                <div className="lesson-view-segment" key={obj.id}>
                  <Segment key={obj.id}> {obj.contentId}</Segment>
                  <p className="lesson-view-after-segment"> a</p>
                </div>
              );
            })}
          </Segment.Group> */}
            <DragDropContext
              onDragStart={this.onDragStart}
              onDragEnd={(result) => this.onDragEnd(result, "initData")}
            >
              <div className="columns-container">
                <Column
                  key={initData.columns[initData.columnOrder[0]].id}
                  column={initData.columns[initData.columnOrder[0]]}
                  content={"contentId"}
                  tasks={initData.columns[initData.columnOrder[0]].taskIds.map(
                    (taskId) => initData.tasks[taskId]
                  )}
                />
              </div>
            </DragDropContext>

            {/*  */}

            <DragDropContext
              onDragStart={this.onDragStart}
              onDragEnd={(result) => this.onDragEnd(result, "meaning")}
            >
              <div className="columns-container">
                <Column
                  key={meaning.columns[meaning.columnOrder[0]].id}
                  column={meaning.columns[meaning.columnOrder[0]]}
                  content={"contentLetter"}
                  tasks={meaning.columns[meaning.columnOrder[0]].taskIds.map(
                    (taskId) => meaning.tasks[taskId]
                  )}
                />
              </div>
            </DragDropContext>
          </Container>
        </div>
      )
    );
  }
}

export default MatchExerciseView;
