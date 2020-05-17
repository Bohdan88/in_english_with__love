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
import { transformToOptions, fireAlert } from "../../../../../utils";

class PractiseContainer extends PureComponent {
  state = {
    exercisesQuantity: 1,
    charValues: {},
    allExercisesView: null,
  };

  // Match: []

  addField = (exerciseName) => {
    exerciseName = exerciseName.toLowerCase();
    const { charValues } = this.state;
    const { exerciseContent } = this.props.newPostState;

    // inrement exercise number
    const inrementedNumber =
      exerciseContent[exerciseName] && !!exerciseContent[exerciseName].length
        ? exerciseContent[exerciseName].length + 1
        : 1;

    // add a new field if a number of fields is less than letters in the alphabet (26)
    if (inrementedNumber - 1 < CHAR_SEQUENCE.length) {
      this.props.onSetNewPostValues({
        exerciseContent: {
          ...exerciseContent,
          [exerciseName]: !exerciseContent[exerciseName]
            ? [INIT_FIELDS_CONTENT[exerciseName]]
            : exerciseContent[exerciseName].concat({
                ...INIT_FIELDS_CONTENT[exerciseName],
                id: inrementedNumber,
              }),
        },
      });

      this.setState({
        charValues: !charValues[exerciseName]
          ? { [exerciseName]: INIT_CHAR_VALUES }
          : {
              ...charValues,
              [exerciseName]: charValues[exerciseName].concat(
                transformToOptions([CHAR_SEQUENCE[inrementedNumber - 1]])[0]
              ),
            },
      });
    } else {
      // fire alert if user wants create more than 26 fields for a particular exercise
      fireAlert(
        false,
        ICON_POST_REMOVE_STATUS,
        "You can't create more fields than a number of letters in the alphabet which is 26."
      );
    }
  };

  // match = [{ id: 1, number, conent: '', letter }, { }]

  removeField = (exerciseName) => {
    const { newPostState } = this.props;

    exerciseName = exerciseName.toLowerCase();

    // clone objects to keep props immutable
    const exerciseContent = Object.assign({}, newPostState.exerciseContent);

    const charValues = Object.assign({}, this.state.charValues);

    if (exerciseContent[exerciseName].length === 1) {
      delete exerciseContent[exerciseName];
      // set char values to init
      delete charValues[exerciseName];
    } else {
      exerciseContent[exerciseName].pop();
      charValues[exerciseName].pop();
    }

    this.setState({ charValues });
    this.props.onSetNewPostValues({ exerciseContent });
  };

  onDropDownChange = (data, dropDownType) => {
    this.props.onSetNewPostValues({
      [dropDownType]: data.value,
    });
  };

  componentDidMount() {}

  setExercisesSequence = () => {
    const { exercisesSequence } = this.props.newPostState;
    const currentId = exercisesSequence.length;
    const exerciseIndex = currentId >= EXERCISES_NAMES.length ? 0 : currentId;
    // add exercise sequnce, for example Match should be first than we should display Complete
    this.props.onSetNewPostValues({
      exercisesSequence: exercisesSequence.concat({
        [currentId]: EXERCISES_NAMES[exerciseIndex].text,
      }),
    });
  };

  onChangePostExerciseValues = (data, exerciseName, id, keyName) => {
    exerciseName = exerciseName.toLowerCase();
    const { exerciseContent } = this.props.newPostState;
    // clone object to
    const contentCloned = Object.assign({}, exerciseContent);

    // find object by id and whatever user changed inside
    const findObject = contentCloned[exerciseName].filter(
      (obj) => obj.id === id
    );

    if (findObject) {
      findObject[0][keyName] = data.value;
    }

    this.props.onSetNewPostValues({
      exerciseContent: {
        ...exerciseContent,
        [exerciseName]: contentCloned[exerciseName],
      },
    });
  };

  // handle views by exercise name
  toggleView = (stateName) =>
    this.setState({
      [stateName]: !this.state[stateName],
    });

  closeView = (stateName) =>
    this.setState({
      [stateName]: false,
    });

  openView = (stateName) =>
    this.setState({
      [stateName]: true,
    });

  render() {
    const { exercisesQuantity, charValues, allExercisesView } = this.state;
    const {
      exercisesTypes,
      exercisesDescriptions,
      exerciseNames,
    } = this.props.posts;
    const {
      exerciseName,
      exerciseType,
      exerciseDescription,
      exerciseContent,
      exercisesSequence,
    } = this.props.newPostState;

    return (
      <div className="container-init-exercises">
        <Segment className="segment-init-exercises" secondary>
          <Header className="header-init-exercises" as="h2">
            {`You've created ${exercisesSequence.length} ${
              exercisesSequence.length === 1 ? "esercise" : "esercises"
            }`}
          </Header>
          <div className="button-group-init-exercises">
            {allExercisesView !== null && (
              <Popup
                inverted
                className="popup-init-exercises"
                position="top center"
                content={
                  allExercisesView
                    ? "Hide all exercises."
                    : "Show all exercises."
                }
                trigger={
                  <Button
                    basic
                    color="brown"
                    className="button-toggle-all-exercises"
                    icon={allExercisesView ? "eye slash" : "eye"}
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
                    this.setExercisesSequence();
                  }}
                />
              }
            />
          </div>
        </Segment>
        <Transition
          visible={allExercisesView ? true : true}
          animation=""
          duration={0}
        >
          <>
            {exercisesSequence.map((el, key) => {
              return (
                <Segment
                  key={
                    el && Object.entries(el).length > 0
                      ? Object.keys(el)[0]
                      : key
                  }
                  className={`container-exercises-builders`}
                  secondary
                >
                  <div key={key} className="container-exercise-builder">
                    <Form className="practise-form" widths="equal">
                      <div className="container-exercise-top">
                        <Header className="header-exercise-top" as="h3">
                          Exercise {exercisesQuantity}
                        </Header>
                        <div className="button-group-exercise-top">
                          <Popup
                            inverted
                            className="popup-init-exercises"
                            position="top center"
                            content={
                              allExercisesView
                                ? "Hide content."
                                : "Show content."
                            }
                            trigger={
                              <Button
                                color="brown"
                                className="button-toggle-exercise-view"
                                icon={allExercisesView ? "eye slash" : "eye"}
                                onClick={() =>
                                  this.toggleView("allExercisesView")
                                }
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
                                onClick={() => {
                                  this.openView("allExercisesView");
                                  this.setExercisesSequence();
                                }}
                              />
                            }
                          />
                        </div>
                      </div>
                      <Form.Group>
                        <Form.Field>
                          <Form.Dropdown
                            label={PRACTISE_DROPDOWN_TITLES.name.label}
                            placeholder={
                              PRACTISE_DROPDOWN_TITLES.name.placeholder
                            }
                            selection
                            search
                            value={exerciseName}
                            options={exerciseNames}
                            onChange={(e, data) =>
                              this.onDropDownChange(
                                data,
                                PRACTISE_DROPDOWN_TITLES.name.defaultVal
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
                            value={exerciseType}
                            options={exercisesTypes}
                            onChange={(e, data) =>
                              this.onDropDownChange(
                                data,
                                PRACTISE_DROPDOWN_TITLES.type.defaultVal
                              )
                            }
                          />
                        </Form.Field>
                        <Form.Field>
                          <Form.Dropdown
                            label={PRACTISE_DROPDOWN_TITLES.description.label}
                            placeholder={
                              PRACTISE_DROPDOWN_TITLES.description.placeholder
                            }
                            selection
                            search
                            value={exerciseDescription}
                            options={exercisesDescriptions}
                            onChange={(e, data) =>
                              this.onDropDownChange(
                                data,
                                PRACTISE_DROPDOWN_TITLES.description.defaultVal
                              )
                            }
                          />
                        </Form.Field>
                      </Form.Group>
                    </Form>

                    <div className="exercises-container">
                      <div className="exercises-handler">
                        <Header as="h3"> {exerciseName}</Header>
                        <Button onClick={() => this.addField(exerciseName)}>
                          Add field <Icon name="plus" />
                        </Button>
                        {exerciseContent &&
                          exerciseContent[exerciseName.toLowerCase()] && (
                            <Button
                              onClick={() => this.removeField(exerciseName)}
                            >
                              Remove field <Icon name="minus" />
                            </Button>
                          )}
                        <Statistic size="tiny" color="teal">
                          <Statistic.Value>
                            {exerciseContent[exerciseName.toLowerCase()]
                              ? exerciseContent[exerciseName.toLowerCase()]
                                  .length
                              : 0}
                          </Statistic.Value>
                        </Statistic>
                      </div>

                      <div className="match-field-container">
                        <Segment>
                          <Grid className="match-grid" columns={2}>
                            {exerciseContent &&
                              exerciseContent[exerciseName.toLowerCase()] &&
                              exerciseContent[exerciseName.toLowerCase()].map(
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
                                                  label={
                                                    MATH_FIELDS.letter.label
                                                  }
                                                  /* placeholder={MATH_FIELDS.letter.placeholder}  */
                                                  compact
                                                  search
                                                  selection
                                                  className="match-dropwdown-letter"
                                                  options={
                                                    charValues[
                                                      exerciseName.toLowerCase()
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
                                                      exerciseName,
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
                                                    MATH_FIELDS.text.placeholder
                                                  }
                                                  className="match-textarea"
                                                  onChange={(e, data) =>
                                                    this.onChangePostExerciseValues(
                                                      data,
                                                      exerciseName,
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
                                                    MATH_FIELDS.text.placeholder
                                                  }
                                                  className="match-textarea"
                                                  onChange={(e, data) =>
                                                    this.onChangePostExerciseValues(
                                                      data,
                                                      exerciseName,
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
                    </div>
                  </div>
                </Segment>
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
