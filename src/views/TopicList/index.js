import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import _ from "lodash";
import { withFirebase } from "../Firebase";
import { getAllPostsValues } from "../../redux/actions";
import {
  Grid,
  Card,
  Image,
  Icon,
  Loader,
  Segment,
  Dimmer,
  Header,
  Transition,
  Message,
  Form,
} from "semantic-ui-react";
import { LESSON_TOPIC } from "../../constants/routes";
import { convertMillisecondsToDate } from "../../utils";
import defaultImage from "../../assets/images/default.png";
import { Link } from "react-router-dom";
// style
import "./style.scss";
import { CATEGORY_ID } from "../../constants";

class TopicList extends Component {
  state = {
    currentTopic: window.location.href.slice(
      window.location.href.lastIndexOf("=") + 1
    ),
    currentCategory: window.location.href.slice(
      window.location.href.indexOf("=") + 1,
      window.location.href.indexOf("&")
    ),

    // currentTopicPosts: postsByTopic,
    currentTopicPosts: [],
    isLoadingLessons: false,
    isSearchingPost: false,
    error: false,
    errorText: "",
  };

  filterPostsList = (postsList) => {
    const { currentTopic, currentCategory } = this.state;
    return (
      postsList &&
      postsList.filter((obj) => {
        return (
          obj.category.toLowerCase() === currentCategory &&
          obj.subCategory.toLowerCase() === currentTopic
        );
      })
    );
  };

  getAllPostsByTopicName = (postsList) => {
    const { currentTopic } = this.state;
    const { allIconImagesByTopic } = this.props.posts;
    this.setState({
      currentTopicPosts: this.filterPostsList(postsList),
      isLoadingLessons: false,
    });

    if (!allIconImagesByTopic[currentTopic] && !allIconImagesByTopic.length) {
      this.filterPostsList(postsList).forEach((topic) => {
        if (topic.iconPath) {
          this.props.firebase.storage
            .ref()
            .child(topic.iconPath)
            .getDownloadURL()
            .then((url) => {
              this.props.onGetAllPostsValues({
                allIconImagesByTopic: {
                  ...this.props.posts.allIconImagesByTopic,
                  [currentTopic]: {
                    ...this.props.posts.allIconImagesByTopic[currentTopic],
                    [topic.title]: url,
                  },
                },
              });
            })
            .catch((error) => error.code);
        }
      });
    }

    // if (!allIconImagesByTopic[DEFAULT_TOPIC_IMAGE]) {
    //   this.props.firebase.storage
    //     .ref()
    //     .child(`${POSTS_BUCKET_NAME}/`)
    //     .listAll()
    //     .then((res) =>
    //       res.items.forEach((item) =>
    //         item.getDownloadURL().then((url) => {
    //           if (url.includes(DEFAULT_TOPIC_IMAGE)) {
    //             this.props.onGetAllPostsValues({
    //               allIconImagesByTopic: {
    //                 ...this.props.posts.allIconImagesByTopic,
    //                 default: url,
    //               },
    //             });
    //           }
    //         })
    //       )
    //     )
    //     .catch((error) => console.log(error, "error"));
    // }
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isSearchingPost: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) {
        this.setState({
          currentTopicPosts: this.filterPostsList(this.props.posts.allPosts),
          isSearchingPost: false,
        });
      }

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.title);

      this.setState({
        isSearchingPost: false,
        currentTopicPosts: _.filter(this.state.currentTopicPosts, isMatch),
      });
    }, 300);
  };

  onClickCheckBox = (event, data) => {
    const { currentTopicPosts } = this.state;
    const { authUser } = this.props.sessionState;

    if (
      data.checked &&
      !!currentTopicPosts.length &&
      authUser.lessonsCompleted
    ) {
      /* use Category id to remove -category- from  completed 
        lesson id which we added when user completed his/her lesson
      */
      this.setState({
        checkedCompleted: true,
        currentTopicPosts: currentTopicPosts.filter((topic) =>
          Object.keys(authUser.lessonsCompleted).findIndex(
            (keyId) => keyId.slice(0, keyId.indexOf(CATEGORY_ID)) === topic.uid
          )
        ),
      });
    } else {
      this.setState({
        checkedCompleted: false,
        currentTopicPosts: this.filterPostsList(this.props.posts.allPosts),
      });
    }
  };

  componentDidMount() {
    const { allPosts } = this.props.posts;

    this.setState({ isLoadingLessons: true });

    if (!allPosts.length) {
      this.props.firebase.posts().on(
        "value",
        (snapshot) => {
          const postsObject = snapshot && snapshot.val();
          if (postsObject) {
            const postsList = Object.keys(postsObject).map((key) => ({
              ...postsObject[key],
              uid: key,
            }));

            // set posts
            this.props.onGetAllPostsValues({
              allPosts: postsList,
            });

            // make transition a bit long to give time to fetch needed data from db
            this.setState({ transitionDuration: 3000 });

            this.getAllPostsByTopicName(postsList);
          }
        },
        (errorObject) => {
          this.setState({
            error: true,
            errorText: errorObject.code,
            isLoadingLessons: false,
          });
        }
      );
    } else {
      // if data is already in redux, we make transitionDuration quick
      this.setState({ transitionDuration: 300 });

      this.getAllPostsByTopicName(allPosts);
    }
  }

  componentWillUnmount() {
    this.props.firebase.posts().off();
  }

  render() {
    const {
      currentTopic,
      currentTopicPosts,
      isLoadingLessons,
      isSearchingPost,
      error,
      errorText,
      value,
      transitionDuration,
      checkedCompleted,
    } = this.state;
    const { authUser } = this.props.sessionState;
    const { allIconImagesByTopic } = this.props.posts;

    return (
      <Grid className="topics-container">
        <Grid.Row centered className="selected-topic-header-row">
          <Grid.Column computer="8" floated="left">
            <Header className="topics-header capitalize" as="h1">
              {currentTopic}
            </Header>
          </Grid.Column>
          <Grid.Column computer="8" className="topics-list-column-search">
            <Form>
              <Form.Group>
                {authUser && (
                  <Form.Field className="topics-checkbox-field">
                    <Form.Checkbox
                      label="Uncompleted Lessons"
                      onClick={this.onClickCheckBox}
                    />
                  </Form.Field>
                )}
                <Form.Field>
                  <Form.Input
                    className="topics-input-search"
                    size="large"
                    icon="search"
                    placeholder="Search topics..."
                    onChange={this.handleSearchChange}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={2}>
          {error && !isLoadingLessons ? (
            <Message className="error-message" size="massive" negative>
              <Message.Header>Oops! Something went wrong...</Message.Header>
              <p>{errorText}</p>
            </Message>
          ) : isSearchingPost ? (
            <Segment inverted className="segment-loading-topics">
              <Dimmer className="dimmer-topics" inverted active>
                <Loader className="loader-topics" size="big">
                  Loading
                </Loader>
              </Dimmer>
            </Segment>
          ) : isLoadingLessons ? (
            <Segment className="loader-admin">
              <Dimmer active>
                <Loader size="massive">Loading </Loader>
              </Dimmer>
            </Segment>
          ) : !currentTopicPosts.length && !checkedCompleted ? (
            <Message
              className="error-message topic-list-error-message"
              size="massive"
              negative
            >
              <Message.Header>Sorry! No data found!</Message.Header>
              <Message.Content>
                <span className="capitalize">{`${currentTopic}  `}</span>
                doesn't have <b>{` '${value}'. `}</b>
              </Message.Content>
            </Message>
          ) : !currentTopicPosts.length && checkedCompleted ? (
            <Message
              className="error-message topic-list-completed-lessons-message"
              size="massive"
              success
            >
              <Message.Header>Uncompleted lessons not found!</Message.Header>
              <Message.Content>
                <span>You finished all lessons in current category.</span>
              </Message.Content>
            </Message>
          ) : (
            currentTopicPosts.map((topic) => {
              return (
                <Grid.Column
                  widescreen={4}
                  tablet={7}
                  className="topics-column"
                  key={topic.title}
                >
                  <Transition
                    visible={true}
                    animation="fade"
                    duration={transitionDuration}
                    transitionOnMount={true}
                  >
                    <Link
                      className="card-topic-link"
                      to={`${LESSON_TOPIC}/${topic.title
                        .toLowerCase()
                        .split(" ")
                        .join("-")}`}
                    >
                      <Card fluid className="card-selected-topic-container">
                        <Icon className="card-topic-arrow" name="arrow right" />

                        <Card.Content className="card-content-topic">
                          <Card.Content className="card-content-image">
                            <Image
                              className="card-topic-image"
                              src={
                                (allIconImagesByTopic[currentTopic] &&
                                  allIconImagesByTopic[currentTopic][
                                    topic.title
                                  ]) ||
                                defaultImage
                              }
                              alt={topic.title}
                              floated="left"
                              size="mini"
                            />
                          </Card.Content>
                          <Card.Content className="topic-list-card-container">
                            <Card.Header
                              as="h3"
                              className="topic-list-card-header"
                            >
                              {topic.title}
                            </Card.Header>

                            <Card.Description
                              className="card-selected-topic-description"
                              textAlign="right"
                            >
                              <span className="selected-topic-focus">
                                {topic.focus}
                              </span>
                            </Card.Description>

                            <Card.Meta
                              textAlign="left"
                              className="card-topic-meta"
                            >
                              <div>
                                <span className="card-lessons-length">
                                  {topic.date
                                    ? convertMillisecondsToDate(topic.date)
                                    : convertMillisecondsToDate(
                                        new Date().getTime()
                                      )}
                                </span>
                              </div>
                              <div className="card-meta-time">
                                <Icon
                                  className="topic-list-icon-circle"
                                  name="circle"
                                />
                                <span className="card-lessons-length">
                                  10 mintues
                                </span>
                                <Icon
                                  className="topic-list-icon-start"
                                  name="star"
                                  size="small"
                                  fitted
                                />
                              </div>
                              {authUser &&
                                authUser.lessonsCompleted &&
                                Object.keys(
                                  authUser.lessonsCompleted
                                ).some((completedLessonId) =>
                                  completedLessonId.includes(topic.uid)
                                ) && (
                                  <span className="card-topic-completed">
                                    <span className="card-topic-completed-span">
                                      Completed
                                    </span>
                                    <Icon name="check" />
                                  </span>
                                )}
                            </Card.Meta>
                          </Card.Content>
                        </Card.Content>
                      </Card>
                    </Link>
                  </Transition>
                </Grid.Column>
              );
            })
          )}
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  const { posts, sessionState } = state;
  return { posts, sessionState };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAllPostsValues: (database) => dispatch(getAllPostsValues(database)),
  };
};

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(TopicList);
