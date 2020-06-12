import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { LESSON_TOPIC } from "../../../../constants/routes";
import { connect } from "react-redux";
import { compose } from "recompose";
import _ from "lodash";
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
import { getAllPostsValues, setNewValues } from "../../../../redux/actions";
import { withFirebase } from "../../../Firebase";

// styles
import "./style.scss";
import {
  EDIT_CREATE_POST_TAB_INDEX,
  POST_MODE,
} from "../../../../constants/shared";

class LessonsList extends PureComponent {
  state = {
    isLoading: false,
    error: false,
    errorCode: null,
    searchTitle: "",
    searchLoading: false,
    searchedValue: "",
    postsList: [],
    column: null,
    direction: null,
  };

  handleSort = (clickedColumn) => () => {
    const { column, postsList, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        postsList: _.sortBy(postsList, [clickedColumn]),
        direction: "ascending",
      });
      return;
    }

    this.setState({
      postsList: postsList.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  handleSearchChange = (e, { value }) => {
    const { allPosts } = this.props.posts;
    this.setState({ searchLoading: true, searchedValue: value.toLowerCase() });

    setTimeout(() => {
      if (this.state.searchedValue.length < 1) {
        this.setState({
          postsList: allPosts,
          searchLoading: false,
        });
      }

      this.setState({
        searchLoading: false,
        postsList: _.filter(
          allPosts,
          (item) =>
            item && item.title.toLowerCase().includes(value.toLowerCase())
        ),
      });
    }, 300);
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

          this.setState({ postsList });
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
    const { allPosts } = this.props.posts;
    if (!allPosts.length) {
      this.setState({ isLoading: true });
      this.fetchPostsFromDb();
    } else {
      this.setState({
        postsList: allPosts,
      });
    }
  }

  componentWillUnmount() {
    this.props.firebase.posts().off();
  }

  editPostFromDb = (post, firebase) => {
    // firebase.db.ref(`posts/${post.uid}`).remove()
    // console.log(firebase.db.ref(`posts/${post.uid}`))
    // firebase.db.ref(`posts/${post.uid}`).update({
    //   post: "UPDATED",
    // });
  };
  render() {
    const {
      isLoading,
      error,
      errorCode,
      postsList,
      direction,
      column,
    } = this.state;

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
    ) : (
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
            {!!postsList.length ? (
              <Table sortable celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell
                      sorted={column === "title" ? direction : null}
                      onClick={this.handleSort("title")}
                    >
                      Title
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === "category" ? direction : null}
                      onClick={this.handleSort("category")}
                    >
                      Category
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === "subCategory" ? direction : null}
                      onClick={this.handleSort("subCategory")}
                    >
                      SubCategory
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === "date" ? direction : null}
                      onClick={this.handleSort("date")}
                    >
                      Date
                    </Table.HeaderCell>
                    <Table.HeaderCell>Edit</Table.HeaderCell>
                    <Table.HeaderCell>Remove</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {postsList.map((lesson, key) => {
                    console.log(lesson, "lesson");
                    return (
                      <Table.Row key={lesson.title}>
                        <Table.Cell width="6">
                          <Link
                            className="topics-lesson-link"
                            to={`${LESSON_TOPIC}/${lesson.title
                              .toLowerCase()
                              .split(" ")
                              .join("-")}`}
                            target="_blank"
                          >
                            {lesson.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell width="3">{lesson.category}</Table.Cell>
                        <Table.Cell width="3">{lesson.subCategory}</Table.Cell>
                        <Table.Cell width="3">12 April</Table.Cell>
                        <Table.Cell width="1" textAlign="center">
                          <Button
                            className="lesson-list-edit"
                            onClick={() => {
                              this.props.setEditPostTabIndex();
                              this.props.onSetPostNewValues({
                                postMode: POST_MODE.EDIT,
                                ...lesson,
                              });
                            }}
                          >
                            <Icon name="edit" color="yellow" />
                          </Button>
                        </Table.Cell>
                        <Table.Cell width="1" textAlign="center">
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
            ) : (
              <Message className="error-message" size="massive" negative>
                <Message.Header>Sorry! No lessons found!</Message.Header>
              </Message>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebase
)(LessonsList);
