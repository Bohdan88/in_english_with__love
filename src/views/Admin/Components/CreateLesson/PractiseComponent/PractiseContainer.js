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
  EXERCISES_DESCRIPTIONS,
  EXERCISES_TYPES,
  NOT_FOUND_OPTION,
  REMOVE_EXERCISE,
  CONFIRMATION_REMOVE_ALERT,
  MATCHING,
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
} from "semantic-ui-react";
import Swal from "sweetalert2";
import { transformToOptions, fireAlert } from "../../../../../utils";
import MatchExercise from "./MatchExercise";

class PractiseContainer extends PureComponent {
  state = {
    exercisesViewState: {},
  };

  onDropDownChange = (data, dropDownType, exerciseId) => {
    console.log(dropDownType, "dropdownType");
    const { newPostExercisesValues } = this.props.newPostState;

    this.props.onSetNewPostValues({
      newPostExercisesValues: newPostExercisesValues.map((obj) =>
        obj.id === exerciseId ? { ...obj, [dropDownType]: data.value } : obj
      ),
    });
  };

  componentDidMount() {}

  removeExerciseById = (exerciseId, stateExerciseView) => {
    const { newPostExercisesValues } = this.props.newPostState;
    fireAlert(true, REMOVE_EXERCISE, null, CONFIRMATION_REMOVE_ALERT).then(
      (res) => {
        if (res.value) {
          this.props.onSetNewPostValues({
            newPostExercisesValues: newPostExercisesValues.filter(
              (obj) => obj.id !== exerciseId
            ),
          });

          // set view to undefined because we removed an bject from the array
          this.setState({
            exercisesViewState: {
              ...this.state.exercisesViewState,
              [stateExerciseView]: undefined,
            },
          });
        }
      }
    );
  };
  addExercise = () => {
    const { newPostExercisesValues } = this.props.newPostState;
    const currentId = newPostExercisesValues.length;

    this.props.onSetNewPostValues({
      newPostExercisesValues: newPostExercisesValues.concat({
        id: currentId,
        name: EXERCISES_NAMES[0].text,
        type: EXERCISES_TYPES[0].text,
        description: EXERCISES_DESCRIPTIONS[0].text,
        content: [],
      }),
    });
  };

  // handle views by name of an exercise
  toggleView = (stateName) => {
    console.log(stateName, "stateName");
    const { exercisesViewState } = this.state;
    // if init exercise === undefined => exercise is currently open
    this.setState({
      exercisesViewState: {
        ...exercisesViewState,
        [stateName]:
          exercisesViewState[stateName] === undefined
            ? false
            : !exercisesViewState[stateName],
      },
    });
  };

  closeView = (stateName) =>
    this.setState({
      [stateName]: false,
    });

  openView = (stateName) =>
    this.setState({
      [stateName]: true,
    });

  render() {
    const { exercisesViewState } = this.state;
    const {
      allExercisesTypes,
      allExercisesDescriptions,
      allexerciseNames,
    } = this.props.posts;
    const { newPostExercisesValues } = this.props.newPostState;

    return (
      <div className="container-init-exercises">
        <Segment className="segment-init-exercises" secondary>
          <Header className="header-init-exercises" as="h2">
            {`You've created ${newPostExercisesValues.length} ${
              newPostExercisesValues.length === 1 ? "esercise" : "esercises"
            }`}
          </Header>
          <div className="button-group-init-exercises">
            {exercisesViewState["allExercisesView"] !== null && (
              <Popup
                inverted
                className="popup-init-exercises"
                position="top center"
                content={
                  exercisesViewState["allExercisesView"]
                    ? "Hide all exercises."
                    : "Show all exercises."
                }
                trigger={
                  <Button
                    basic
                    color="brown"
                    className="button-toggle-all-exercises"
                    icon={
                      exercisesViewState["allExercisesView"]
                        ? "eye slash"
                        : "eye"
                    }
                    onClick={() => this.toggleView("allExercisesView")}
                  />
                }
              />
            )}
            <Popup
              inverted
              className="popup-init-exercises"
              position="top center"
              content="Add an exercise."
              trigger={
                <Button
                  basic
                  color="green"
                  icon="plus"
                  onClick={() => {
                    this.openView("allExercisesView");
                    this.addExercise();
                  }}
                />
              }
            />
          </div>
        </Segment>
        <Transition
          visible={exercisesViewState["allExercisesView"] ? true : true}
          animation=""
          duration={0}
        >
          <>
            {newPostExercisesValues.map((el, key) => {
              const generatedKey = el.id || key;

              const stateExercise = `${el.id}-${el.name}`;

              // we're getting undefined when component just mounted which means the exercise is currently visible
              const isExerciseOpen =
                exercisesViewState[stateExercise] === undefined ||
                exercisesViewState[stateExercise] === true;

              return (
                <Transition
                  /* visible={this.state[stateExercise] === false ? false : true} */
                  visible={true}
                  animation="fade"
                  duration={1000}
                  key={generatedKey}
                >
                  <Segment className={`container-exercises-builders`} secondary>
                    <div key={key} className="container-exercise-builder">
                      <div className="container-exercise-top">
                        <Header className="header-exercise-top" as="h3">
                          Exercise {el.id + 1}
                        </Header>
                        <div className="button-group-exercise-top">
                          <Popup
                            inverted
                            className="popup-init-exercises"
                            position="top center"
                            content={
                              isExerciseOpen ? "Hide content." : "Show content."
                            }
                            trigger={
                              <Button
                                color="brown"
                                className="button-toggle-exercise-view"
                                icon={isExerciseOpen ? "eye slash" : "eye"}
                                onClick={() => this.toggleView(stateExercise)}
                              />
                            }
                          />
                          <Popup
                            inverted
                            className="popup-init-exercises"
                            position="top center"
                            content="Remove this exercise."
                            trigger={
                              <Button
                                color="red"
                                icon="remove"
                                className="button-remove-exercise"
                                onClick={() =>
                                  this.removeExerciseById(el.id, stateExercise)
                                }
                              />
                            }
                          />
                        </div>
                      </div>
                      <Transition
                        visible={isExerciseOpen}
                        animation="fade"
                        duration={500}
                        transitionOnMount={true}
                        unmountOnHide={true}
                      >
                        <>
                          <Form className="practise-form" widths="equal">
                            <Form.Group>
                              <Form.Field>
                                <Form.Dropdown
                                  label={PRACTISE_DROPDOWN_TITLES.name.label}
                                  placeholder={
                                    PRACTISE_DROPDOWN_TITLES.name.placeholder
                                  }
                                  selection
                                  search
                                  value={
                                    (newPostExercisesValues[el.id] &&
                                      newPostExercisesValues[el.id].name) ||
                                    NOT_FOUND_OPTION
                                  }
                                  options={allexerciseNames}
                                  onChange={(e, data) =>
                                    this.onDropDownChange(
                                      data,
                                      PRACTISE_DROPDOWN_TITLES.name.defaultVal,
                                      el.id
                                    )
                                  }
                                />
                              </Form.Field>
                              <Form.Field>
                                <Form.Dropdown
                                  label={PRACTISE_DROPDOWN_TITLES.type.label}
                                  placeholder={
                                    PRACTISE_DROPDOWN_TITLES.type.placeholder
                                  }
                                  selection
                                  search
                                  value={
                                    newPostExercisesValues[el.id].type ||
                                    NOT_FOUND_OPTION
                                  }
                                  options={allExercisesTypes}
                                  onChange={(e, data) =>
                                    this.onDropDownChange(
                                      data,
                                      PRACTISE_DROPDOWN_TITLES.type.defaultVal,
                                      el.id
                                    )
                                  }
                                />
                              </Form.Field>
                              <Form.Field>
                                <Form.Dropdown
                                  label={
                                    PRACTISE_DROPDOWN_TITLES.description.label
                                  }
                                  placeholder={
                                    PRACTISE_DROPDOWN_TITLES.description
                                      .placeholder
                                  }
                                  selection
                                  search
                                  value={
                                    newPostExercisesValues[el.id].description ||
                                    NOT_FOUND_OPTION
                                  }
                                  options={allExercisesDescriptions}
                                  onChange={(e, data) =>
                                    this.onDropDownChange(
                                      data,
                                      PRACTISE_DROPDOWN_TITLES.description
                                        .defaultVal,
                                      el.id
                                    )
                                  }
                                />
                              </Form.Field>
                            </Form.Group>
                          </Form>

                          {el.name === MATCHING && (
                            <MatchExercise currentExerciseValues={el} />
                          )}
                          {/* {exerciseNames.includes("Match") && (
                            <MatchExercise />
                          )} */}
                          {/* <div className="exercises-container">
                            <div className="exercises-handler">
                              <Header as="h3"> {exerciseNames}</Header>
                              <Button
                                onClick={() => this.addField(exerciseNames)}
                              >
                                Add field <Icon name="plus" />
                              </Button>
                              {exerciseContent &&
                                exerciseContent[exerciseNames.toLowerCase()] && (
                                  <Button
                                    onClick={() =>
                                      this.removeField(exerciseNames)
                                    }
                                  >
                                    Remove field <Icon name="minus" />
                                  </Button>
                                )}
                              <Statistic size="tiny" color="teal">
                                <Statistic.Value>
                                  {exerciseContent[exerciseNames.toLowerCase()]
                                    ? exerciseContent[
                                        exerciseNames.toLowerCase()
                                      ].length
                                    : 0}
                                </Statistic.Value>
                              </Statistic>
                            </div>

                            <div className="match-field-container">
                              <Segment>
                                <Grid className="match-grid" columns={2}>
                                  {exerciseContent &&
                                    exerciseContent[
                                      exerciseNames.toLowerCase()
                                    ] &&
                                    exerciseContent[
                                      exerciseNames.toLowerCase()
                                    ].map((obj) => {
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
                                                /* style={{ border: "1px solid white" }} 
                                                >
                                                  <Form.Field>
                                                    <Form.Dropdown
                                                      label={
                                                        MATH_FIELDS.letter.label
                                                      }
                                                      /* placeholder={MATH_FIELDS.letter.placeholder}  
                                                      compact
                                                      search
                                                      selection
                                                      className="match-dropwdown-letter"
                                                      options={
                                                        charValues[
                                                          exerciseNames.toLowerCase()
                                                        ] || [
                                                          {
                                                            text: "Not Found",
                                                            value: "Not Found",
                                                          },
                                                        ]
                                                      }
                                                      onChange={(e, data) =>
                                                        this.onChangePostExerciseValues(
                                                          data,
                                                          exerciseNames,
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
                                                          {obj.id}.
                                                        </Statistic.Value>
                                                      </Statistic>
                                                    </Segment>
                                                  </div>
                                                  <Container className="match-textarea-container">
                                                    <label className="match-textarea-label">
                                                      {MATH_FIELDS.text.label}
                                                    </label>
                                                    <TextArea
                                                      placeholder={
                                                        MATH_FIELDS.text
                                                          .placeholder
                                                      }
                                                      className="match-textarea"
                                                      onChange={(e, data) =>
                                                        this.onChangePostExerciseValues(
                                                          data,
                                                          exerciseNames,
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
                                                      placeholder={
                                                        MATH_FIELDS.text
                                                          .placeholder
                                                      }
                                                      className="match-textarea"
                                                      onChange={(e, data) =>
                                                        this.onChangePostExerciseValues(
                                                          data,
                                                          exerciseNames,
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
                                    })}
                                </Grid>
                                <Divider vertical></Divider>
                              </Segment>
                            </div>
                          </div> */}
                        </>
                      </Transition>
                    </div>
                  </Segment>
                </Transition>
              );
            })}
          </>
        </Transition>
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
export default connect(mapStateToProps, mapDispatchToProps)(PractiseContainer);
