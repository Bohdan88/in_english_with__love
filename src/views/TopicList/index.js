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
  Input,
  Transition,
  Message,
} from "semantic-ui-react";
import { LESSON_TOPIC } from "../../constants/routes";
import { convertMillisecondsToDate } from "../../utils";
import defaultImage from "../../assets/images/default.png";
import { Link } from "react-router-dom";
// style
import "./style.scss";

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
            .catch((error) => console.log(error.text, "error"));
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

            this.setState({ transitionDuration: 3000 });

            this.getAllPostsByTopicName(postsList);
          }
        },
        (errorObject) => {
          console.log("ERROR");
          this.setState({
            error: true,
            errorText: errorObject.code,
            isLoadingLessons: false,
          });
        }
      );
    } else {
      this.setState({ transitionDuration: 300 });

      this.getAllPostsByTopicName(allPosts);
    }
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
    } = this.state;
    const { allIconImagesByTopic, allPosts } = this.props.posts;
    console.log(this.props.posts, "this.props.posts");
    console.log(this.state, "this.state");
    return (
      <div>
        <Grid className="topics-container">
          <Grid.Row centered className="selected-topic-header-row">
            <Grid.Column floated="left">
              <Header className="topics-header capitalize" as="h1">
                {currentTopic}
              </Header>
            </Grid.Column>
            <Grid.Column floated="right" className="topics-column-search">
              <Input
                className="topics-input-search"
                size="large"
                icon="search"
                placeholder="Search topics..."
                onChange={this.handleSearchChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered columns={2}>
            {error && !isLoadingLessons ? (
              <Message className="error-message" size="massive" negative>
                <Message.Header>Oops! something went wrong...</Message.Header>
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
            ) : !currentTopicPosts.length ? (
              <Message
                className="error-message topic-list-error-message"
                size="massive"
                negative
              >
                <Message.Header>Sorry! No data found!</Message.Header>
                <Message.Content>
                  <span className="capitalize">{`${currentTopic}  `}</span>
                  doesn't have {` ${value || "lessons"} `}
                </Message.Content>
                {/* !!allIconImagesByTopic[DEFAULT_TOPIC_IMAGE] && */}
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
                          <Icon
                            className="card-topic-arrow"
                            name="arrow right"
                          />
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { posts } = state;
  return { posts };
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
