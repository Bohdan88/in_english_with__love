import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  PRACTISE_DROPDOWN_TITLES,
  INIT_FIELDS_CONTENT,
  MATH_FIELDS,
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
} from "semantic-ui-react";

class Practise extends PureComponent {
  state = {
    exercisesQuantity: 1,
  };

  // Match: []

  addField = (exerciseName) => {
    exerciseName = exerciseName.toLowerCase();
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
  };

  // match = [{ id: 1, number, conent: '', letter }, { }]

  removeField = (exerciseName) => {
    const { newPostState } = this.props;

    exerciseName = exerciseName.toLowerCase();

    const exerciseContent = Object.assign({}, newPostState.exerciseContent);

    if (exerciseContent[exerciseName].length === 1) {
      delete exerciseContent[exerciseName];
    } else {
      exerciseContent[exerciseName].pop();
    }
    this.props.onSetNewPostValues({ exerciseContent });
  };

  onDropDownChange = (data, dropDownType) => {
    this.props.onSetNewPostValues({
      [dropDownType]: data.value,
    });
  };

  render() {
    const { exercisesQuantity } = this.state;
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
    } = this.props.newPostState;
    // const { exerciseContent } = this.props.newPostState;
    console.log(exerciseContent, "exerciseContent");
    // console.log(exerciseDescription, "this.props.posts");
    return (
      <div>
        <Header as="h3">Exercise {exercisesQuantity}</Header>
        <Form className="practise-form" widths="equal">
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
                placeholder={PRACTISE_DROPDOWN_TITLES.description.placeholder}
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
            {exerciseContent && exerciseContent[exerciseName.toLowerCase()] && (
              <Button onClick={() => this.removeField(exerciseName)}>
                Remove field <Icon name="minus" />
              </Button>
            )}
            {/* <Statistic size="tiny" color="teal">
              <Statistic.Value>
                {exerciseValues[exerciseName]
                  ? exerciseValues[exerciseName]
                  : 0}
              </Statistic.Value>
            </Statistic> */}
          </div>

          <div className="match-field-container">
            <Segment>
              <Grid className="match-grid" columns={2}>
                {exerciseContent &&
                  exerciseContent[exerciseName.toLowerCase()] &&
                  exerciseContent[exerciseName.toLowerCase()].map((obj) => {
                    return (
                      <Grid.Row key={obj.id}>
                        <Grid.Column textAlign="left">
                          <Form>
                            <Form.Group style={{ border: "1px solid white" }}>
                              <Form.Field>
                                <Form.Dropdown
                                  label={MATH_FIELDS.letter.label}
                                  /* placeholder={MATH_FIELDS.letter.placeholder} */
                                  compact
                                  selection
                                  className="match-dropwdown-letter"
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
                                />
                              </Container>
                            </Form.Group>
                          </Form>
                        </Grid.Column>
                      </Grid.Row>
                    );
                  })}
              </Grid>
              <Divider vertical></Divider>
            </Segment>
          </div>
        </div>
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
