import React, { Component } from "react";
import { List, Input, Button, Icon } from "semantic-ui-react";

// styles
import "./style.scss";

const content = [
  {
    answer: "merge",
    id: 0,
    sentence:
      "We can {merge} (marge) our two small businesses into a bigger one.",
    userValue: "",
    isCorrect: false,
  },
  {
    answer: "overlook",
    id: 1,
    sentence:
      "It’s easy to {overlook} (overlook) a small detail like this one.",
    userValue: "",
    isCorrect: false,
  },

  {
    answer: "daredevil",
    id: 3,
    sentence:
      "She’s a bit of a {daredevil} (daredevil). She loves climbing buildings and mountains.",
    userValue: "",
    isCorrect: false,
  },
  {
    answer: "defy",
    id: 4,
    sentence:
      "Importing food that we can grow here {defy} (defy) common sense.",
    userValue: "",
    isCorrect: false,
  },
  {
    answer: "antsy",
    id: 5,
    sentence: "I feel {antsy} (antsy) today, I don’t know why.",
    userValue: "",
    isCorrect: false,
  },
  {
    answer: "tenacity",
    id: 6,
    sentence:
      "We’ve always admired him for his {tenacity} (tenacity) and dedication.",
    userValue: "",
    isCorrect: false,
  },
];

class AnotherWay extends Component {
  state = {
    content: content,
    isChecked: false,
    isShowingSolution: false,
  };

  onChangeUserValue = (value, id) => {
    const { content } = this.state;

    const findEditedObjById = content.findIndex((obj) => obj.id === id);
    const clonedContent = this.state.content;

    clonedContent[findEditedObjById].userValue = value;
    this.setState({
      content: clonedContent,
    });
  };

  checkTask = () => {
    const { content } = this.state;

    // const clonedContent = this.state.content;
    this.setState({
      content: content.map((obj) =>
        obj.userValue.trim().toLowerCase() === obj.answer
          ? { ...obj, isCorrect: true }
          : { ...obj, isCorrect: false }
      ),

      isChecked: true,
    });
  };

  retryTask = () => {
    this.setState({
      content: content.map((obj) => ({ ...obj, userValue: "" })),
      isChecked: false,
      isShowingSolution: false,
    });
  };

  showSolution = () => {
    this.setState({
      content: content.map((obj) => ({
        ...obj,
        userValue: obj.answer,
        isCorrect: true,
      })),
      isChecked: true,
      isShowingSolution: true,
    });
  };
  render() {
    const { content, isChecked, isShowingSolution } = this.state;
    const wordsInCurlyBraces = /\{.*?\}/g;

    return (
      content && (
        <div>
          AnotherWay
          <div className="another-way-container">
            <List>
              {content.map((obj, key) => {
                const answerValues = obj.sentence.match(wordsInCurlyBraces);
                let clonedSentence = obj.sentence;
                answerValues.forEach(
                  (rx) => (clonedSentence = clonedSentence.replace(rx, "** "))
                );
                clonedSentence = clonedSentence.split("**");
                return (
                  <List.Item
                    key={obj.answer}
                    className="another-way-item-container"
                    as="li"
                  >
                    {`${key + 1}. `}
                    {clonedSentence[0]}
                    <Input
                      className={`another-way-input ${
                        isChecked
                          ? obj.isCorrect
                            ? "another-way-correct"
                            : "another-way-incorrect"
                          : ""
                      }`}
                      value={obj.userValue}
                      onChange={(e, data) =>
                        this.onChangeUserValue(data.value, obj.id)
                      }
                    />
                    {clonedSentence[1]}
                  </List.Item>
                );
              })}
            </List>

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
                  color="teal"
                  /* disabled={
                    meaningColumn.column.taskIds.length ===
                      correctAnswers.length || isShowingSolution
                      ? true
                      : false
                  } */
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
        </div>
      )
    );
  }
}

export default AnotherWay;
