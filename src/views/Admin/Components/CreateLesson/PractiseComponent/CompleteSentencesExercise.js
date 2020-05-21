import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getAllPostsValues,
  setNewPostValues,
} from "../../../../../redux/actions";
import {
  Segment,
  Icon,
  Button,
  Label,
  Statistic,
  Grid,
  Container,
  TextArea,
  Form,
} from "semantic-ui-react";
import {
  EXERCISES_LABELS_COLORS,
  INIT_FIELDS_CONTENT,
  COMPLETE_FIELDS,
  COMPLETE_KEYS,
  REPLACED_ANSWER,
} from "../../../../../constants/shared";

class CompleteSentencesExercise extends Component {
  addField = (objValues) => {
    const { newPostExercisesValues } = this.props.newPostState;
    console.log(objValues.name, "objValues.name");
    const incrementedNumber =
      newPostExercisesValues[objValues.id] &&
      !!newPostExercisesValues[objValues.id].content.length
        ? newPostExercisesValues[objValues.id].content.length
        : 0;

    //
    this.props.onSetNewPostValues({
      newPostExercisesValues: newPostExercisesValues.map((obj) =>
        obj.id === objValues.id
          ? {
              ...obj,
              content: obj.content.concat({
                ...INIT_FIELDS_CONTENT[objValues.name],
                id: incrementedNumber,
              }),
            }
          : obj
      ),
    });
  };

  onChangePostExerciseValues = (data, objValues, fieldId, keyName) => {
    const { newPostExercisesValues } = this.props.newPostState;
    this.props.onSetNewPostValues({
      newPostExercisesValues: newPostExercisesValues.map((obj) =>
        obj.id === objValues.id
          ? {
              ...obj,
              content: obj.content.map((nestedObj) => {
                return nestedObj.id === fieldId
                  ? { ...nestedObj, [keyName]: data.value }
                  : nestedObj;
              }),
            }
          : obj
      ),
    });
  };

  identifyAnswerInSentence = (objValues, fieldId) => {
    const { newPostExercisesValues } = this.props.newPostState;
    this.props.onSetNewPostValues({
      newPostExercisesValues: newPostExercisesValues.map((obj) =>
        obj.id === objValues.id
          ? {
              ...obj,
              content: obj.content.map((nestedObj) => {
                const { sentence, answer } = nestedObj;
                // remove empty space and enters
                const editedAnswer = answer.trim("").replace("\u21b5", "");
                // console.log(sentence === editedAnswer, "sentence");
                // console.log(editedAnswer,'editedAnswer')
                return nestedObj.id === fieldId
                  ? {
                      ...nestedObj,
                      sentence: sentence.replace(editedAnswer, REPLACED_ANSWER),
                      // sentence: /\s/.test(editedAnswer)
                      //   ? sentence
                      //   : sentence.replace(editedAnswer, REPLACED_ANSWER),
                    }
                  : nestedObj;
              }),
            }
          : obj
      ),
    });
  };

  identifyAllAnswersInSentences = () => {
    const { newPostExercisesValues } = this.props.newPostState;
    this.props.onSetNewPostValues({
      newPostExercisesValues: newPostExercisesValues.map((obj) => ({
        ...obj,
        content: obj.content.map((nestedObj) => ({
          ...nestedObj,
          sentence: nestedObj.sentence.replace(
            nestedObj.answer.trim("").replace("\u21b5", ""),
            REPLACED_ANSWER
          ),
        })),
      })),
    });
  };

  removeField = (objValues) => {
    const { newPostState } = this.props;

    // clone objects to keep props immutable
    const newPostExercisesValues = Object.assign(
      {},
      newPostState.newPostExercisesValues[objValues.id]
    );

    // remove last field
    newPostExercisesValues.content.pop();

    this.props.onSetNewPostValues(newPostExercisesValues);
  };

  replaceAnswersInSentences = () => {};
  render() {
    const { currentExerciseValues } = this.props;
    const { newPostExercisesValues } = this.props.newPostState;
    console.log(newPostExercisesValues, "newPostExercisesValues");
    return (
      <div>
        <Segment className="exercises-container">
          <div className="exercises-handler">
            <Label
              color={
                currentExerciseValues.id < EXERCISES_LABELS_COLORS.length
                  ? EXERCISES_LABELS_COLORS[currentExerciseValues.id]
                  : "blue"
              }
              size="large"
              ribbon
              className="label-exercise-name"
            >
              {currentExerciseValues.name.toUpperCase()}
            </Label>
            <div className="button-group-field-top">
              <Button
                icon
                labelPosition="right"
                basic
                color="green"
                className="button-add-field"
                onClick={() => this.addField(currentExerciseValues)}
              >
                Add field <Icon name="plus" />
              </Button>
              <Button
                basic
                color="red"
                icon
                labelPosition="right"
                className="button-remove-field"
                disabled={
                  currentExerciseValues.content.length > 0 ? false : true
                }
                onClick={() => this.removeField(currentExerciseValues)}
              >
                Remove field <Icon name="minus" />
              </Button>
              <Button
                basic
                color="red"
                icon
                labelPosition="right"
                className="button-remove-field"
                disabled={
                  currentExerciseValues.content.length > 0 ? false : true
                }
                onClick={() => this.identifyAllAnswersInSentences()}
              >
                Replace all sentences <Icon name="minus" />
              </Button>
              <Statistic
                horizontal
                size="mini"
                className="statistic-fields-quantity"
                color="brown"
              >
                <Statistic.Label> Total: </Statistic.Label>
                <Statistic.Value>
                  {(currentExerciseValues &&
                    currentExerciseValues.content &&
                    currentExerciseValues.content.length) ||
                    0}
                </Statistic.Value>
              </Statistic>
            </div>
          </div>
          <div className="complete-field-container">
            <Segment tertiary>
              <Grid className="complete-grid">
                {newPostExercisesValues &&
                  newPostExercisesValues[currentExerciseValues.id] &&
                  newPostExercisesValues[currentExerciseValues.id].content.map(
                    (obj) => {
                      return (
                        <Grid.Row key={obj.id} className="complete-field-row">
                          <Grid.Column width="1" textAlign="left">
                            <div className="complete-container-id">
                              <label className="complete-label-id">
                                {COMPLETE_FIELDS.id.label}
                              </label>
                              <Segment className={`complete-segment-id`}>
                                <Statistic
                                  className="complete-statistic-id"
                                  size="mini"
                                >
                                  <Statistic.Value>
                                    {obj.id + 1}.
                                  </Statistic.Value>
                                </Statistic>
                              </Segment>
                            </div>
                          </Grid.Column>
                          <Grid.Column
                            className="complete-column"
                            largeScreen={11}
                          >
                            <Container
                              fluid
                              className="complete-textarea-container"
                            >
                              <label className="complete-textarea-label">
                                {COMPLETE_FIELDS.sentence.label}
                              </label>
                              <TextArea
                                value={
                                  newPostExercisesValues &&
                                  newPostExercisesValues[
                                    currentExerciseValues.id
                                  ] &&
                                  newPostExercisesValues[
                                    currentExerciseValues.id
                                  ].content[obj.id] &&
                                  newPostExercisesValues[
                                    currentExerciseValues.id
                                  ].content[obj.id].sentence
                                }
                                placeholder={
                                  COMPLETE_FIELDS.sentence.placeholder
                                }
                                className="complete-textarea"
                                onChange={(e, data) =>
                                  this.onChangePostExerciseValues(
                                    data,
                                    currentExerciseValues,
                                    obj.id,
                                    COMPLETE_KEYS.sentence
                                  )
                                }
                              />
                            </Container>
                          </Grid.Column>

                          <Grid.Column
                            className="answer-column"
                            largeScreen={3}
                          >
                            <Container
                              fluid
                              className="answer-textarea-container"
                            >
                              <label className="complete-textarea-label">
                                {COMPLETE_FIELDS.asnwer.label}
                              </label>
                              <TextArea
                                value={
                                  newPostExercisesValues &&
                                  newPostExercisesValues[
                                    currentExerciseValues.id
                                  ] &&
                                  newPostExercisesValues[
                                    currentExerciseValues.id
                                  ].content[obj.id] &&
                                  newPostExercisesValues[
                                    currentExerciseValues.id
                                  ].content[obj.id].asnwer
                                }
                                placeholder={COMPLETE_FIELDS.asnwer.placeholder}
                                className="answer-textarea"
                                onChange={(e, data) =>
                                  this.onChangePostExerciseValues(
                                    data,
                                    currentExerciseValues,
                                    obj.id,
                                    COMPLETE_KEYS.answer
                                  )
                                }
                              />
                            </Container>
                          </Grid.Column>
                          <Grid.Column
                            className="column-replace-field"
                            largeScreen={1}
                          >
                            <Form.Button
                              className="button-replace-field"
                              color="blue"
                              onClick={() =>
                                this.identifyAnswerInSentence(
                                  currentExerciseValues,
                                  obj.id
                                )
                              }
                            >
                              <Icon
                                size="large"
                                className="icon-remove-field"
                                name="reply"
                              />
                            </Form.Button>
                          </Grid.Column>
                        </Grid.Row>
                      );
                    }
                  )}
              </Grid>
            </Segment>
          </div>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { posts, newPostState } = state;
  return { posts, newPostState };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAllPostsValues: (database) => dispatch(getAllPostsValues(database)),
    onSetNewPostValues: (values) => dispatch(setNewPostValues(values)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompleteSentencesExercise);
