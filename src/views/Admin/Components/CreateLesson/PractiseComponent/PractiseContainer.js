import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  PRACTISE_DROPDOWN_TITLES,
  INIT_FIELDS_CONTENT,
  EXERCISES_NAMES,
  EXERCISES_DESCRIPTIONS,
  EXERCISES_TYPES,
  REMOVE_EXERCISE,
  CONFIRMATION_REMOVE_ALERT,
  MATCHING,
  COMPLETE_THE_SENTENCES,
  ANOTHER_WAY,
} from "../../../../../constants/shared";
import { getAllPostsValues, setNewValues } from "../../../../../redux/actions";
import {
  Form,
  Header,
  Button,
  Segment,
  Transition,
  Popup,
} from "semantic-ui-react";
import { fireAlert } from "../../../../../utils";
import MatchExercise from "./MatchExercise";
import CompleteSentencesExercise from "./CompleteSentencesExercise";

class PractiseContainer extends PureComponent {
  state = {
    exercisesViewState: {},
  };

  onDropDownChange = (data, dropDownType, exerciseId) => {
    const { newPostExercisesValues } = this.props.newPostState;
    // console.log(dropDownType, "dropDownType");
    this.props.onSetPostNewValues({
      newPostExercisesValues: newPostExercisesValues.map((obj) =>
        obj.id === exerciseId
          ? {
              ...obj,
              [dropDownType]: data.value,
              // content: [INIT_FIELDS_CONTENT[data.value]],
            }
          : obj
      ),
    });
  };

  addItemToDescription = (data) => {
    this.props.onGetAllPostsValues({
      allExercisesDescriptions: [
        { key: data.value, text: data.value, value: data.value },
        ...this.props.posts.allExercisesDescriptions,
      ],
    });
  };

  removeExerciseById = (exerciseId, stateExerciseView) => {
    const { newPostExercisesValues } = this.props.newPostState;
    fireAlert({
      state: true,
      type: CONFIRMATION_REMOVE_ALERT,
      values: REMOVE_EXERCISE,
    }).then((res) => {
      if (res.value) {
        this.props.onSetPostNewValues({
          newPostExercisesValues: newPostExercisesValues.filter((obj) => {
            const filterObjects = obj.id !== exerciseId;
            //  decrement values which are higher than removed obj.id
            obj.id = obj.id > exerciseId ? obj.id - 1 : obj.id;
            return filterObjects;
          }),
        });

        // set view to undefined because we removed an object from an array
        this.setState({
          exercisesViewState: {
            ...this.state.exercisesViewState,
            [stateExerciseView]: undefined,
          },
        });
      }
    });
  };

  addExercise = () => {
    const { newPostExercisesValues } = this.props.newPostState;
    const currentId = newPostExercisesValues.length;
    this.props.onSetPostNewValues({
      newPostExercisesValues: newPostExercisesValues.concat({
        id: currentId,
        name: EXERCISES_NAMES[0].text,
        type: EXERCISES_TYPES[0].text,
        description: EXERCISES_DESCRIPTIONS[0].text,
        content: [INIT_FIELDS_CONTENT[MATCHING]],
      }),
    });
  };

  // handle views by name of an exercise
  toggleView = (stateName) => {
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

              // we're getting undefined when component just mounted which means an exercise is currently visible
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
                            position="top center"
                            className="popup-init-exercises"
                            content="Please note that you're able to add a new value in a Description field."
                            trigger={<Button icon="circle question" />}
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
                                    []
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
                                    (newPostExercisesValues[el.id] &&
                                      newPostExercisesValues[el.id].type) ||
                                    []
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
                                  allowAdditions
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
                                    (newPostExercisesValues[el.id] &&
                                      newPostExercisesValues[el.id]
                                        .description) ||
                                    []
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
                                  onAddItem={(e, data) =>
                                    this.addItemToDescription(data)
                                  }
                                />
                              </Form.Field>
                            </Form.Group>
                          </Form>
                          {el.name === MATCHING && (
                            <MatchExercise currentExerciseValues={el} />
                          )}
                          {(el.name === COMPLETE_THE_SENTENCES ||
                            el.name === ANOTHER_WAY) && (
                            <CompleteSentencesExercise
                              currentExerciseValues={el}
                            />
                          )}
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
    onSetPostNewValues: (values) => dispatch(setNewValues(values)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PractiseContainer);
