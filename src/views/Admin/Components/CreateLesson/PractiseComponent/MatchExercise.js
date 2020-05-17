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

    console.log(intNumber, "int");
    // console.log(newPostExercisesValues,'newPostExercisesValues')
    if (intNumber < CHAR_SEQUENCE.length) {
      this.props.onSetNewPostValues({
        newPostExercisesValues: newPostExercisesValues.map((obj) =>
          obj.id === objValues.id
            ? {
                ...obj,
                content: obj.content.concat({
                  ...INIT_FIELDS_CONTENT["Match"],
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
    // obj.content.concat({
    //   ...INIT_FIELDS_CONTENT[objValues.name.toLowerCase()],
    //   id: intNumber,
    // })

    // this.props.onSetNewPostValues({
    //     newPostExercisesValues: newPostExercisesValues.map((obj) =>
    //       obj.id === objValues.id
    //         ? {
    //             ...obj,
    //             content: obj.content.map((nestedObj) =>
    //               nestedObj.id === fieldId
    //                 ? { ...nestedObj, [keyName]: data.value }
    //                 : nestedObj
    //             ),
    //           }
    //         : obj
    //     ),
    //   });

    // console.log(exerciseNames, "exerciseNames");
    let exerciseNames = "ALO";
    exerciseNames = exerciseNames;
    // const { charValues } = this.state;
    const { exerciseContent } = this.props.newPostState;

    // inrement exercise number
    const inrementedNumber =
      exerciseContent[exerciseNames] && !!exerciseContent[exerciseNames].length
        ? exerciseContent[exerciseNames].length
        : 0;
    let currentExerciseValues = 1;
    // add a new field if a number of fields is less than letters in the alphabet (26)
    if (currentExerciseValues == 2) {
      if (inrementedNumber < CHAR_SEQUENCE.length) {
        this.props.onSetNewPostValues({
          exerciseContent: {
            ...exerciseContent,
            [exerciseNames]: !exerciseContent[exerciseNames]
              ? [INIT_FIELDS_CONTENT[exerciseNames]]
              : exerciseContent[exerciseNames].concat({
                  ...INIT_FIELDS_CONTENT[exerciseNames],
                  id: inrementedNumber,
                }),
          },
        });

        this.setState({
          charValues: !charValues[exerciseNames]
            ? { [exerciseNames]: INIT_CHAR_VALUES }
            : {
                ...charValues,
                [exerciseNames]: charValues[exerciseNames].concat(
                  transformToOptions([CHAR_SEQUENCE[inrementedNumber]])[0]
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
    }
  };

  removeField = (exerciseNames) => {
    const { newPostState } = this.props;

    exerciseNames = exerciseNames;

    // clone objects to keep props immutable
    const exerciseContent = Object.assign({}, newPostState.exerciseContent);

    const charValues = Object.assign({}, this.state.charValues);

    if (exerciseContent[exerciseNames].length === 1) {
      delete exerciseContent[exerciseNames];
      // set char values to init
      delete charValues[exerciseNames];
    } else {
      exerciseContent[exerciseNames].pop();
      charValues[exerciseNames].pop();
    }

    this.setState({ charValues });
    this.props.onSetNewPostValues({ exerciseContent });
  };

  onChangePostExerciseValues = (data, objValues, fieldId, keyName) => {
    // exerciseNames
    objValues.name = objValues.name;
    const { exerciseContent, newPostExercisesValues } = this.props.newPostState;

    // const contentCloned = Object.assign({}, newPostExercisesValues[objValues.id]);
    // // find object by id and whatever user changed inside
    // const findObject = contentCloned[exerciseNames].filter(
    //   (obj) => obj.id === id
    // );

    //   if (findObject) {
    //   findObject[0][keyName] = data.value;
    // }

    //  this.props.onSetNewPostValues({
    //     newPostExercisesValues: {
    //     ...exerciseContent,
    //     [exerciseNames]: contentCloned[exerciseNames],
    //   },
    // });
    // console.log( data.value,'ID')
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
    // console.log(contentCloned,'contentCloned')
    // clone object to
    // console.log(id, "ididid");
    // const contentCloned = Object.assign({}, exerciseContent);

    // // find object by id and whatever user changed inside
    // const findObject = contentCloned[exerciseNames].filter(
    //   (obj) => obj.id === id
    // );

    // if (findObject) {
    //   findObject[0][keyName] = data.value;
    // }

    // this.props.onSetNewPostValues({
    //   exerciseContent: {
    //     ...exerciseContent,
    //     [exerciseNames]: contentCloned[exerciseNames],
    //   },
    // });
  };

  render() {
    const { exercisesQuantity, charValues, allExercisesView } = this.state;
    const { currentExerciseValues } = this.props;
    const {
      allExercisesTypes,
      allExercisesDescriptions,
      allexerciseNames,
    } = this.props.posts;
    const {
      exerciseNames,

      exerciseContent,
      exercisesSequence,
      newPostExercisesValues,
    } = this.props.newPostState;

    // console.log(this.props.newPostState, "exerciseContentexerciseContent");
    // console.log(currentExerciseValues, "currentExerciseValues");
    console.log(this.state.charValues, "CHHHHH");
    return (
      <div className="exercises-container">
        <div className="exercises-handler">
          <Header as="h3"> {currentExerciseValues.name}</Header>
          <Button onClick={() => this.addField(currentExerciseValues)}>
            Add field <Icon name="plus" />
          </Button>
          {currentExerciseValues.name &&
            currentExerciseValues.name && (
              <Button
                onClick={() => this.removeField(currentExerciseValues.name)}
              >
                Remove field <Icon name="minus" />
              </Button>
            )}
          <Statistic size="tiny" color="teal">
            <Statistic.Value>
              {/* {exerciseContent[exerciseNames.toLowerCase()]
                ? exerciseContent[exerciseNames.toLowerCase()].length
                : 0} */}
            </Statistic.Value>
          </Statistic>
        </div>

        <div className="match-field-container">
          <Segment>
            <Grid className="match-grid" columns={2}>
              {/* {exerciseContent &&
                exerciseContent[currentExerciseValues.name.toLowerCase()] &&
                exerciseContent[currentExerciseValues.name.toLowerCase()].map(
                  (obj) => { */}
              {newPostExercisesValues[currentExerciseValues.id].content.map(
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
                                    <Statistic.Value>{obj.id}.</Statistic.Value>
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
                                  /* data,
                                      exerciseNames,
                                      obj.id,
                                      MATH_KEYS.contentId */
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
                }
              )}
            </Grid>
            <Divider vertical></Divider>
          </Segment>
        </div>
      </div>
    );
  }
}

// export default MatchExercise;

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
