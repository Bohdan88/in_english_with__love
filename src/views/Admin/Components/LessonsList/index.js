import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import {
  Message,
  Loader,
  Dimmer,
  Segment,
  Grid,
  Table,
  Button,
  Icon,
  Header,
  Input,
} from "semantic-ui-react";
import {
  getAllPostsValues,
  // , setNewValues
} from "../../../../redux/actions";
import { withFirebase } from "../../../Firebase";

// styles
import "./style.scss";

class LessonsList extends PureComponent {
  state = {
    isLoading: false,
    error: false,
    errorCode: null,
    searchTitle: "",
    searchLoading: false,
  };

  handleSearchChange = () => {
    return null;
  };
  fetchPostsFromDb = () => {
    // on posts
    this.props.firebase.posts().on(
      "value",
      (snapshot) => {
        const postsObject = snapshot && snapshot.val();
        if (postsObject) {
          const postsList = Object.keys(postsObject).map((key) => ({
            ...postsObject[key],
            uid: key,
          }));

          this.setState({
            posts: postsList,
          });
          // set posts
          this.props.onGetAllPostsValues({
            allPosts: postsList,
          });
        }
      },
      (error) => {
        this.setState({
          isLoading: false,
          error: true,
          errorCode: error.code,
        });
      }
    );
    this.setState({ isLoading: false });
  };

  componentDidMount() {
    if (!this.props.posts.allPosts.length) {
      this.setState({ isLoading: true });
      this.fetchPostsFromDb();
    }
  }

  componentWillUnmount() {
    this.props.firebase.posts().off();
  }
  render() {
    const { isLoading, error, errorCode } = this.state;
    const { allPosts } = this.props.posts;
    console.log(allPosts, "allPosts");
    return isLoading && !error ? (
      <Segment className="loader-admin">
        <Dimmer active>
          <Loader size="massive">Loading </Loader>
        </Dimmer>
      </Segment>
    ) : error && !isLoading ? (
      <Message className="error-message" size="massive" negative>
        <Message.Header>Oops! something went wrong...</Message.Header>
        <p>{errorCode}</p>
      </Message>
    ) : !!allPosts.length ? (
      <Grid>
        <Grid.Row columns={2} className="lesson-list-header-row">
          <Grid.Column>
            <Header className="topics-header" as="h1">
              Lessons
            </Header>
          </Grid.Column>
          <Grid.Column className="topics-column-search">
            <Input
              className="topics-input-search"
              size="large"
              icon="search"
              placeholder="Search lessons..."
              onChange={this.handleSearchChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>SubCategory</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Edit</Table.HeaderCell>
                  <Table.HeaderCell>Remove</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {allPosts.map((lesson, key) => {
                  return (
                    <Table.Row key={lesson.title}>
                      <Table.Cell>{lesson.title}</Table.Cell>
                      <Table.Cell>{lesson.category}</Table.Cell>
                      <Table.Cell>{lesson.subCategory}</Table.Cell>
                      <Table.Cell>12 April</Table.Cell>
                      <Table.Cell textAlign="center">
                        <Button
                          className="lesson-list-edit"
                          onClick={() => console.log("EDIT PAZANA")}
                        >
                          <Icon name="edit" color="yellow" />
                        </Button>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Button
                          className="lesson-list-remove"
                          onClick={() => console.log("remove PAZANA")}
                        >
                          <Icon name="remove" color="red" />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : (
      <Message className="error-message" size="massive" negative>
        <Message.Header>Sorry! No lessons found!</Message.Header>
      </Message>
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
    // onSetPostNewValues: (values) => dispatch(setNewValues(values)),
  };
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebase
)(LessonsList);
