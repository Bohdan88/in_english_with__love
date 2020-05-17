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
} from "../../../../constants/shared";
import { getAllPostsValues, setNewPostValues } from "../../../../redux/actions";
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
import { transformToOptions } from "../../../../utils";

class Practise extends PureComponent {
  state = {
    exercisesQuantity: 1,
    charValues: {},
  };

  // Match: []

  addField = (exerciseName) => {
    exerciseName = exerciseName.toLowerCase();
    const { charValues } = this.state;
    const { exerciseContent } = this.props.newPostState;

    const inrementedNumber =
      exerciseContent[exerciseName] && !!exerciseContent[exerciseName].length
        ? exerciseContent[exerciseName].length + 1
        : 1;

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

    // add char according to current exercise
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
  };

  // match = [{ id: 1, number, conent: '', letter }, { }]

  removeField = (exerciseName) => {
    const { newPostState } = this.props;
    exerciseName = exerciseName.toLowerCase();

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

    // remove char from dropdown options
    // const charValues = this.state.charValues;
    // this.setState({
    //   charValues: [
    //     ...this.state.charValues,
    //     transformToOptions(CHAR_SEQUENCE[inrementedNumber])[0],
    //   ],
    // });
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
    console.log(exerciseIndex, "exerciseIndex");
    this.props.onSetNewPostValues({
      exercisesSequence: exercisesSequence.concat({
        [currentId]: EXERCISES_NAMES[exerciseIndex].text,
      }),
    });
  };
  onChangePostExerciseValues = (data, exerciseName, id, keyName) => {
    exerciseName = exerciseName.toLowerCase();
    const { exerciseContent } = this.props.newPostState;

    const contentCloned = Object.assign({}, exerciseContent);

    const foundObject = contentCloned[exerciseName].filter(
      (obj) => obj.id === id
    );

    if (foundObject) {
      foundObject[0][keyName] = data.value;
    }

    this.props.onSetNewPostValues({
      exerciseContent: {
        ...exerciseContent,
        [exerciseName]: contentCloned[exerciseName],
      },
    });
  };
  render() {
    const { exercisesQuantity, charValues } = this.state;
    const { sectionKey, exercises } = this.props;
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

    console.log(exercisesSequence, "exercisesSequence");
    return (
      <div className="init-exercises-container">
        <Segment className="segment-init-exercises" secondary>
          <Header className="header-init-exercises" as="h2">
            {`You've created ${exercisesSequence.length} exercises`}
          </Header>
          <Popup
            inverted
            className="init-exercises-popup"
            position="top center"
            content="Add an exercise."
            trigger={
              <Button
                basic
                color="green"
                icon="plus"
                onClick={this.setExercisesSequence}
              />
            }
          />
        </Segment>
        {exercisesSequence.map((el) => {
          return (
            <div
              key={Object.keys(el)[0]}
              style={{ border: "1px solid black" }}
              className="exercise-builder-container"
            >
              <Form className="practise-form" widths="equal">
                <Header as="h3">Exercise {exercisesQuantity}</Header>
                <Form.Group>
                  <Form.Field>
                    <Form.Dropdown
                      label={PRACTISE_DROPDOWN_TITLES.name.label}
                      placeholder={PRACTISE_DROPDOWN_TITLES.name.placeholder}
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
                      placeholder={PRACTISE_DROPDOWN_TITLES.type.placeholder}
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
                      <Button onClick={() => this.removeField(exerciseName)}>
                        Remove field <Icon name="minus" />
                      </Button>
                    )}
                  <Statistic size="tiny" color="teal">
                    <Statistic.Value>
                      {exerciseContent[exerciseName.toLowerCase()]
                        ? exerciseContent[exerciseName.toLowerCase()].length
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
                                            label={MATH_FIELDS.letter.label}
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
          );
        })}
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
export default connect(mapStateToProps, mapDispatchToProps)(Practise);
