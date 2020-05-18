import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  PRACTISE_DROPDOWN_TITLES,
  INIT_FIELDS_CONTENT,
  MATH_FIELDS,
  CHAR_SEQUENCE,
  INIT_CHAR_VALUES,
  MATH_KEYS,
  EXERCISES_NAMES,
  ICON_POST_REMOVE_STATUS,
  NOT_FOUND_OPTION,
  CONFIRMATION_ALERT,
  EXERCISES_LABELS_COLORS,
} from "../../../../../constants/shared";
import {
  getAllPostsValues,
  setNewPostValues,
} from "../../../../../redux/actions";
import {
  Tab,
  Form,
  Header,
  Grid,
  Button,
  Icon,
  Statistic,
  Divider,
  Segment,
  TextArea,
  Container,
  Transition,
  Popup,
  Label,
} from "semantic-ui-react";
import { transformToOptions, fireAlert } from "../../../../../utils";

class MatchExercise extends PureComponent {
  state = {
    charValues: {},
  };

  addField = (objValues) => {
    const { charValues } = this.state;
    const { newPostExercisesValues } = this.props.newPostState;

    const intNumber =
      newPostExercisesValues[objValues.id] &&
      !!newPostExercisesValues[objValues.id].content.length
        ? newPostExercisesValues[objValues.id].content.length
        : 0;

    // console.log(intNumber, "int");
    // console.log(newPostExercisesValues,'newPostExercisesValues')
    if (intNumber < CHAR_SEQUENCE.length) {
      this.props.onSetNewPostValues({
        newPostExercisesValues: newPostExercisesValues.map((obj) =>
          obj.id === objValues.id
            ? {
                ...obj,
                content: obj.content.concat({
                  ...INIT_FIELDS_CONTENT[objValues.name],
                  id: intNumber,
                }),
              }
            : obj
        ),
      });

      objValues.name = objValues.name;
      this.setState({
        charValues: !charValues[objValues.name]
          ? { [objValues.name]: INIT_CHAR_VALUES }
          : {
              ...charValues,
              [objValues.name]: charValues[objValues.name].concat(
                transformToOptions([CHAR_SEQUENCE[intNumber]])[0]
              ),
            },
      });
    } else {
      fireAlert(
        false,
        ICON_POST_REMOVE_STATUS,
        "You can't create more fields than a number of letters in the alphabet which is 26."
      );
    }
  };

  removeField = (objValues) => {
    const { newPostState } = this.props;

    // clone objects to keep props immutable
    const newPostExercisesValues = Object.assign(
      {},
      newPostState.newPostExercisesValues[objValues.id]
    );
    const charValues = Object.assign({}, this.state.charValues);

    if (newPostExercisesValues.content.length === 1) {
      newPostExercisesValues.content = [];
      delete charValues[objValues.name];
    } else {
      newPostExercisesValues.content.pop();
      charValues[objValues.name].pop();
    }

    this.setState({ charValues });
    this.props.onSetNewPostValues(newPostExercisesValues);
  };

  onChangePostExerciseValues = (data, objValues, fieldId, keyName) => {
    const { newPostExercisesValues } = this.props.newPostState;

    this.props.onSetNewPostValues({
      newPostExercisesValues: newPostExercisesValues.map((obj) =>
        obj.id === objValues.id
          ? {
              ...obj,
              content: obj.content.map((nestedObj) =>
                nestedObj.id === fieldId
                  ? { ...nestedObj, [keyName]: data.value }
                  : nestedObj
              ),
            }
          : obj
      ),
    });
  };

  render() {
    const { charValues } = this.state;
    const { currentExerciseValues } = this.props;
    const { newPostExercisesValues } = this.props.newPostState;

    return (
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
            {currentExerciseValues.name}
          </Label>
          {/* <Statistic horizontal size="tiny" color="teal">
            <Statistic.Label> Total Fields: </Statistic.Label>
            <Statistic.Value>
              {(currentExerciseValues &&
                currentExerciseValues.content &&
                currentExerciseValues.content.length) ||
                0}
            </Statistic.Value>
          </Statistic> */}
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
              disabled={currentExerciseValues.content.length > 0 ? false : true}
              onClick={() => this.removeField(currentExerciseValues)}
            >
              Remove field <Icon name="minus" />
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

        <div className="match-field-container">
          <Segment tertiary>
            <Grid className="match-grid" columns={2}>
              {newPostExercisesValues &&
                newPostExercisesValues[currentExerciseValues.id] &&
                newPostExercisesValues[currentExerciseValues.id].content.map(
                  (obj) => {
                    return (
                      <Transition
                        key={obj.id}
                        visible={true}
                        animation="fade"
                        transitionOnMount={true}
                        unmountOnHide={true}
                        duration={1000}
                      >
                        <Grid.Row className="math-field-row">
                          <Grid.Column textAlign="left">
                            <Form>
                              <Form.Group
                              /* style={{ border: "1px solid white" }} */
                              >
                                <Form.Field>
                                  <Form.Dropdown
                                    label={MATH_FIELDS.letter.label}
                                    /* placeholder={MATH_FIELDS.letter.placeholder}  */
                                    compact
                                    search
                                    selection
                                    className="match-dropwdown-letter"
                                    options={
                                      charValues[
                                        currentExerciseValues.name
                                      ] || [NOT_FOUND_OPTION]
                                    }
                                    onChange={(e, data) =>
                                      this.onChangePostExerciseValues(
                                        data,
                                        currentExerciseValues,
                                        obj.id,
                                        MATH_KEYS.letter
                                      )
                                    }
                                  />
                                </Form.Field>
                                <div className="match-container-id">
                                  <label className="match-label-id">
                                    {MATH_FIELDS.id.label}
                                  </label>
                                  <Segment className="match-segment-id">
                                    <Statistic
                                      className="match-statistic-id"
                                      size="mini"
                                    >
                                      <Statistic.Value>
                                        {obj.id + 1}.
                                      </Statistic.Value>
                                    </Statistic>
                                  </Segment>
                                </div>
                                <Container className="match-textarea-container">
                                  <label className="match-textarea-label">
                                    {MATH_FIELDS.text.label}
                                  </label>
                                  <TextArea
                                    placeholder={MATH_FIELDS.text.placeholder}
                                    className="match-textarea"
                                    onChange={(e, data) =>
                                      this.onChangePostExerciseValues(
                                        data,
                                        currentExerciseValues,
                                        obj.id,
                                        MATH_KEYS.contentId
                                      )
                                    }
                                  />
                                </Container>
                              </Form.Group>
                            </Form>
                          </Grid.Column>
                          <Grid.Column>
                            <Form>
                              <Form.Group>
                                <div className="match-container-id">
                                  <label className="match-label-id">
                                    {MATH_FIELDS.letter.label}
                                  </label>
                                  <Segment className="match-segment-id">
                                    <Statistic
                                      className="match-statistic-id"
                                      size="mini"
                                    >
                                      <Statistic.Value>
                                        {obj.letter}
                                      </Statistic.Value>
                                    </Statistic>
                                  </Segment>
                                </div>
                                <Container className="match-textarea-container">
                                  <label className="match-textarea-label">
                                    {MATH_FIELDS.text.label}
                                  </label>
                                  <TextArea
                                    placeholder={MATH_FIELDS.text.placeholder}
                                    className="match-textarea"
                                    onChange={(e, data) =>
                                      this.onChangePostExerciseValues(
                                        data,
                                        currentExerciseValues,
                                        obj.id,
                                        MATH_KEYS.contentLetter
                                      )
                                    }
                                  />
                                </Container>
                                <Form.Button
                                  className="match-remove-field"
                                  color="red"
                                  icon="remove"
                                />
                              </Form.Group>
                            </Form>
                          </Grid.Column>
                        </Grid.Row>
                      </Transition>
                    );
                  }
                )}
            </Grid>
            <Divider vertical></Divider>
          </Segment>
        </div>
      </Segment>
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
export default connect(mapStateToProps, mapDispatchToProps)(MatchExercise);
