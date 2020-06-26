import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllPostsValues, setPostValues } from "../../../../../redux/actions";
import {
  Segment,
  Icon,
  Button,
  Label,
  Statistic,
  Grid,
  Container,
  TextArea,
  Popup,
  Header,
  List,
} from "semantic-ui-react";
import {
  EXERCISES_LABELS_COLORS,
  INIT_FIELDS_CONTENT,
  COMPLETE_FIELDS,
} from "../../../../../constants";
import _ from "lodash";

const TutorialContent = () => {
  return (
    <div className="tutorial-popup-container">
      <Header as="h4">
        Please follow the below steps to complete the exercise.
      </Header>
      <List bulleted>
        <List.Item>Fill all the fields.</List.Item>
        <List.Item>
          Wrap an answer into curly brackets in <b> Sentence</b> field.
          <br /> For example:
          <span className="popup-example-sentence-span">
            <q>
              I think we need to
              <b>
                {" {"} rehearse{" }  "}
              </b>
              first scene again.
            </q>
          </span>
        </List.Item>
        <List.Item>
          Once you've wrapped, you should see an answer in an appropriate field.
        </List.Item>
      </List>
    </div>
  );
};

class CompleteSentencesExercise extends Component {
  state = {
    content: [],
  };

  addField = (objValues) => {
    const { newPostExercisesValues } = this.props.newPostState;
    const incrementedNumber =
      newPostExercisesValues[objValues.id] &&
      !!newPostExercisesValues[objValues.id].content.length
        ? newPostExercisesValues[objValues.id].content.length
        : 0;

    //
    this.props.onSetPostNewValues({
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

    this.setState({
      content: this.state.content.concat({ id: incrementedNumber }),
    });
  };

  onChangePostExerciseValues = (data, objValues, fieldId) => {
    const { content } = this.state;

    const contentIndex = content.findIndex((obj) => obj.id === fieldId);

    this.setState({
      content:
        contentIndex === -1
          ? [...content, { id: fieldId, sentence: data.value }]
          : content.map((obj) =>
              obj.id === fieldId
                ? {
                    ...obj,
                    sentence: data.value,
                  }
                : obj
            ),
    });

    this.onPersistPostExerciseValues(data, objValues, fieldId);
  };

  onPersistPostExerciseValues = _.debounce((data, objValues, fieldId) => {
    const { newPostExercisesValues } = this.props.newPostState;
    this.props.onSetPostNewValues({
      newPostExercisesValues: newPostExercisesValues.map((obj) => {
        let answer;
        const wordsInCurlyBraces = /\{.*?\}/g;
        const removeSpecialCharacters = /[^a-z0-9]/g;

        const answerValues = data.value.match(wordsInCurlyBraces);
        if (answerValues) {
          answer = answerValues.map((element) =>
            element.replace(removeSpecialCharacters, " ")
          );
        }

        return obj.id === objValues.id
          ? {
              ...obj,
              content: obj.content.map((nestedObj) => {
                return nestedObj.id === fieldId
                  ? {
                      ...nestedObj,
                      sentence: data.value,
                      answer: answer && answer.join("").trim(),
                    }
                  : nestedObj;
              }),
            }
          : obj;
      }),
    });
  }, 300);

  removeField = (objValues) => {
    const { newPostState } = this.props;

    // clone object && array to keep props immutable
    const newPostExercisesValues = Object.assign(
      {},
      newPostState.newPostExercisesValues[objValues.id]
    );

    const content = this.state.content;

    // remove last field
    newPostExercisesValues.content.pop();
    content.pop();

    this.props.onSetPostNewValues(newPostExercisesValues);
    this.setState({ content });
  };

  componentDidMount() {
    this.setState({
      content: this.props.currentExerciseValues.content,
    });
  }

  render() {
    const { content } = this.state;
    const { currentExerciseValues } = this.props;
    const { newPostExercisesValues } = this.props.newPostState;

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
              <Statistic
                horizontal
                size="mini"
                className="statistic-fields-quantity"
                color="brown"
              >
                <Statistic.Label> Total: </Statistic.Label>
                <Statistic.Value>
                  <span>
                    {(currentExerciseValues &&
                      currentExerciseValues.content &&
                      currentExerciseValues.content.length) ||
                      0}
                  </span>
                </Statistic.Value>
              </Statistic>
              <Popup
                content={<TutorialContent />}
                wide={"very"}
                on="click"
                trigger={
                  <Button
                    basic
                    color="purple"
                    icon
                    labelPosition="right"
                    className="button-remove-field"
                    disabled={
                      !!currentExerciseValues.content.length ? false : true
                    }
                  >
                    Quick tutorial
                    <Icon name="info" />
                  </Button>
                }
              />
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
                Remove last field <Icon name="minus" />
              </Button>
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
                        obj && (
                          <Grid.Row key={obj.id} className="complete-field-row">
                            {/* <Grid.Column width="1" textAlign="left">
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
                          </Grid.Column> */}

                            <Grid.Column
                              className="complete-column"
                              largeScreen={14}
                            >
                              <Container
                                fluid
                                className="complete-textarea-container"
                              >
                                <label className="complete-textarea-label">
                                  {COMPLETE_FIELDS.sentence.label}
                                </label>
                                <TextArea
                                  /* value={
                                    newPostExercisesValues[
                                      currentExerciseValues.id
                                    ].content[obj.id].sentence
                                  } */
                                  value={
                                    content[obj.id]
                                      ? content[obj.id].sentence
                                      : ""
                                  }
                                  placeholder={
                                    COMPLETE_FIELDS.sentence.placeholder
                                  }
                                  className="complete-textarea"
                                  onChange={(e, data) =>
                                    this.onChangePostExerciseValues(
                                      data,
                                      currentExerciseValues,
                                      obj.id
                                    )
                                  }
                                />
                              </Container>
                            </Grid.Column>

                            <Grid.Column
                              className="answer-column"
                              widescreen={2}
                              largeScreen={2}
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
                                    newPostExercisesValues[
                                      currentExerciseValues.id
                                    ].content[obj.id].answer
                                  }
                                  placeholder={
                                    COMPLETE_FIELDS.asnwer.placeholder
                                  }
                                  className="answer-textarea"
                                  disabled
                                />
                              </Container>
                            </Grid.Column>
                            {/* change answer status by id  */}
                            {/* <Grid.Column
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
                            </Form.Button> */}
                            {/* </Grid.Column> */}
                          </Grid.Row>
                        )
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
    onSetPostNewValues: (values) => dispatch(setPostValues(values)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompleteSentencesExercise);
