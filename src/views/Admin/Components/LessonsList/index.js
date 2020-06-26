import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { LESSON_TOPIC } from "../../../../constants/routes";
import {
  ONE_PAGE_LESSONS,
  POSTS_BUCKET_NAME,
} from "../../../../constants";
import {
  POST_REMOVED_STATUS,
  CONFIRMATION_ALERT,
  REMOVE_POST_CONFIRMATION,
} from "../../../../constants/alertContent";
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
  Pagination,
} from "semantic-ui-react";
import { getAllPostsValues, setPostValues } from "../../../../redux/actions";
import { withFirebase } from "../../../Firebase";

// styles
import "./style.scss";
import { POST_MODE } from "../../../../constants";
import { fireAlert } from "../../../../utils";

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
    activePage: 1,
    startIndex: 0,
    endIndex: ONE_PAGE_LESSONS,
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

          this.setState({
            isLoading: false,
            postsList,
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
  };

  componentDidMount() {
    const { allPosts } = this.props.posts;
    this.setState({ isLoading: true });

    if (!allPosts.length) {
      this.fetchPostsFromDb();
    } else {
      this.setState({
        postsList: allPosts,
        isLoading: false,
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

  removePostFromDb = (post) => {
    const { firebase } = this.props;
    let userResponse = "";
    fireAlert({
      state: true,
      type: CONFIRMATION_ALERT,
      values: REMOVE_POST_CONFIRMATION,
    })
      .then((val) => {
        userResponse = val;
        return (
          !val.dismiss &&
          firebase.db.ref(`${POSTS_BUCKET_NAME}/${post.uid}`).remove()
        );
      })
      .then(() => {
        if (!userResponse.dismiss) {
          let values = POST_REMOVED_STATUS;
          values.text.success = `${post.title} has been deleted successfully.`;

          fireAlert({ state: true, values });
        }
      })
      .catch((error) => {
        let values = POST_REMOVED_STATUS;
        values.text.error = `${error.text}.`;
        fireAlert({ state: true, values });
      });
  };

  onPagination = (data) => {
    // an example =>  page number (2 * 10) - 10 == start index is 10
    const startIndex = data.activePage * ONE_PAGE_LESSONS - 10;

    this.setState({
      activePage: data.activePage,
      startIndex,
      endIndex: startIndex + ONE_PAGE_LESSONS,
    });
  };

  render() {
    const {
      isLoading,
      error,
      errorCode,
      postsList,
      direction,
      column,
      activePage,
      startIndex,
      endIndex,
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
              <>
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
                    {postsList
                      .slice(startIndex, endIndex)
                      .map((lesson, key) => {
                        return (
                          <Table.Row key={lesson.title + key}>
                            <Table.Cell width="6">
                              <Link
                                className="topics-lesson-link"
                                to={`${LESSON_TOPIC}/${lesson.title
                                  .toLowerCase()
                                  .split(" ")
                                  .join("-")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {lesson.title}
                              </Link>
                            </Table.Cell>
                            <Table.Cell width="3">{lesson.category}</Table.Cell>
                            <Table.Cell width="3">
                              {lesson.subCategory}
                            </Table.Cell>
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
                                onClick={() => this.removePostFromDb(lesson)}
                              >
                                <Icon name="remove" color="red" />
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                  </Table.Body>
                </Table>
                <Pagination
                  className="lessons-list-pagination"
                  totalPages={Math.ceil(postsList.length / ONE_PAGE_LESSONS)}
                  activePage={activePage}
                  onPageChange={(e, data) => this.onPagination(data)}
                />
              </>
            ) : (
              <Message className="error-message" size="massive" negative>
                <Message.Header>Oops...</Message.Header>
                <Message.Content>No lessons found =(</Message.Content>
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
    onSetPostNewValues: (values) => dispatch(setPostValues(values)),
  };
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebase
)(LessonsList);
