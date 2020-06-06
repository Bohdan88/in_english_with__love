import React, { Component } from "react";
import { List, Input, Button, Icon, Message, Popup } from "semantic-ui-react";

// styles
import "./style.scss";

class AnotherWay extends Component {
  state = {
    content: [],
    isChecked: false,
    isShowingSolution: false,
    exerciseDescription: "",
  };

  componentDidMount() {
    const { lessonValues } = this.props;
    this.setState({
      content: lessonValues.content.map((obj) => ({
        ...obj,
        userValue: "",
        isCorrect: false,
      })),
      exerciseDescription: lessonValues.description,
    });
  }

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
      content: this.state.content.map((obj) => ({ ...obj, userValue: "" })),
      isChecked: false,
      isShowingSolution: false,
    });
  };

  showSolution = () => {
    this.setState({
      content: this.state.content.map((obj) => ({
        ...obj,
        userValue: obj.answer,
        isCorrect: true,
      })),
      isChecked: true,
      isShowingSolution: true,
    });
  };
  render() {
    const {
      content,
      isChecked,
      isShowingSolution,
      exerciseDescription,
    } = this.state;
    const wordsInCurlyBraces = /\{.*?\}/g;

    return !!content.length ? (
      <div className="another-way-container">
        <p className="lesson-view-exercise-explanation">
          {exerciseDescription}
          <Popup
            inverted
            basic
            className="lesson-view-exercise-popup"
            content="Please fill all the fields."
            trigger={
              <Icon
                name="circle question"
                className="lesson-view-match-icon"
                size="small"
              />
            }
          />
        </p>
        <List className="another-way-list">
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

export default AnotherWay;
