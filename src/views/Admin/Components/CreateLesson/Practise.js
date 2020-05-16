import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { PRACTISE_DROPDOWN_TITLES } from "../../../../constants/shared";
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
} from "semantic-ui-react";

class Practise extends PureComponent {
  state = {
    exercisesQuantity: 1,
    exerciseValues: {},
  };

  // Match: []

  addField = (exerciseName) => {
    const { exerciseValues } = this.state;
    // const inrementedNumber = exerciseValues[exerciseName]
    //   ? exerciseValues[exerciseName].id + 1
    //   : 1;

    // console.log(exerciseValues.Match, "exerciseValues[exerciseName]");
    // console.log(inrementedNumber, "inrementedNumber");
    // let val = 1;

    const inrementedNumber =
      exerciseValues[exerciseName] && !!exerciseValues[exerciseName].length
        ? exerciseValues[exerciseName].length + 1
        : 1;

    this.setState({
      exerciseValues: {
        ...exerciseValues,
        [exerciseName]: !exerciseValues
          ? [
              {
                id: inrementedNumber,
                content: "",
                letter: "",
              },
            ]
          : exerciseValues[exerciseName].concat({
              id: inrementedNumber,
              content: "",
              letter: "",
            }),
      },
    });
    // [exerciseName]: { [id]: id, content: "", letter: "" },
  };

  // match = [{ id: 1, number, conent: '', letter }, { }]

  removeField = (exerciseName) => {
    const exerciseValues = Object.assign({}, this.state.exerciseValues);
    if (exerciseValues[exerciseName] === 1) {
      delete exerciseValues[exerciseName];
    } else {
      exerciseValues[exerciseName] = exerciseValues[exerciseName] - 1;
    }
    this.setState({ exerciseValues });
  };

  onDropDownChange = (data, dropDownType) => {
    this.props.onSetNewPostValues({
      [dropDownType]: data.value,
    });
  };

  render() {
    const { exercisesQuantity, exerciseValues } = this.state;
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
    } = this.props.newPostState;
    console.log(this.state.exerciseValues.Match, "exerciseName");
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
            {exerciseValues[exerciseName] && (
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
              <Grid columns={2}>
                <Grid.Column textAlign="left">LEft</Grid.Column>
                <Grid.Column textAlign="right">Right</Grid.Column>
              </Grid>
              <Divider vertical>And</Divider>
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
