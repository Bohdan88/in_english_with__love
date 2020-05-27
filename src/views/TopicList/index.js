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
  Button,
  Transition,
  Divider,
} from "semantic-ui-react";
import {
  TOPICS_BUCKET_NAME,
  DEFAULT_TOPIC_IMAGE,
  POSTS_BUCKET_NAME,
} from "../../constants/shared";
import { LESSON_TOPIC_LIST, LESSON_TOPIC } from "../../constants/routes";
import { Link } from "react-router-dom";
// style
import "./style.scss";

const postsByTopic = [
  {
    assets: "",
    category: "Read",
    focus: "Grammar",
    iconPath: "posts/1590279183391-default.png",
    post: { about: "", conclusion: "", content: "" },
    subCategory: "Culture",
    title: "Opera Singer by Day, Janitor by Night",
    uid: "-M82hXciwXZh9tLQw5PO",
    date: 1590363174598,
  },
  {
    assets: "",
    category: "Read",
    focus: "Grammar",
    iconPath: "posts/1590279183391-default.png",
    post: { about: "", conclusion: "", content: "" },
    subCategory: "Culture",
    title: "Opera Singer by Day, Janitor by Night",
    uid: "-M82hXciwXZh9tLQw5PO",
    date: 1590163174198,
  },
  {
    assets: "",
    category: "Read",
    focus: "Grammar",
    iconPath: "posts/1590279183391-default.png",
    post: { about: "", conclusion: "", content: "" },
    subCategory: "Culture",
    title: "Opera Singer by Day, Janitor by Night",
    uid: "-M82hXciwXZh9tLQw5PO",
    date: 1590113174198,
  },
  {
    assets: "",
    category: "Read",
    focus: "Grammar",
    iconPath: "posts/1590279183391-default.png",
    post: { about: "", conclusion: "", content: "" },
    subCategory: "Culture",
    title: "Opera Singer by Day, Janitor by Night",
    uid: "-M82hXciwXZh9tLQw5PO",
    date: 1520113174198,
  },
  {
    assets: "",
    category: "Read",
    focus: "Grammar",
    iconPath: "posts/1590279183391-default.png",
    post: { about: "", conclusion: "", content: "" },
    subCategory: "Culture",
    title: "Singer by Day, Janitor by Night",
    uid: "-M82hXciwXZh9tLQw5PO",
    date: 1520713174198,
  },
  {
    assets: "",
    category: "Read",
    focus: "Grammar",
    iconPath: "posts/1590279183391-default.png",
    post: { about: "", conclusion: "", content: "" },
    subCategory: "Culture",
    title: "Opera Singer by Day, Janitor by Night",
    uid: "-M82hXciwXZh9tLQw5PO",
    date: 1520413174198,
  },
];

class TopicList extends Component {
  state = {
    currentTopic: window.location.href.slice(
      window.location.href.lastIndexOf("=") + 1
    ),
    isLoading: false,
    currentTopicPosts: postsByTopic,
  };

  getAllPostsByTopicName = (postsList) => {
    this.setState({
      currentTopicPosts: postsList.filter(
        (obj) => obj.subCategory.toLowerCase() === this.state.currentTopic
      ),
      isLoading: false,
    });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ loading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) {
        this.setState({
          currentTopicPosts: postsByTopic,
          loading: false,
        });
      }

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.title);

      this.setState({
        loading: false,
        currentTopicPosts: _.filter(this.state.currentTopicPosts, isMatch),
      });
    }, 300);
  };

  componentDidMount() {
    // const { allPosts } = this.props.posts;
    // this.setState({ isLoading: true });
    // if (!allPosts.length) {
    //   this.props.firebase.posts().on("value", (snapshot) => {
    //     const postsObject = snapshot && snapshot.val();
    //     if (postsObject) {
    //       const postsList = Object.keys(postsObject).map((key) => ({
    //         ...postsObject[key],
    //         uid: key,
    //       }));
    //       // set posts
    //       this.props.onGetAllPostsValues({
    //         allPosts: postsList,
    //       });
    //       this.getAllPostsByTopicName(postsList);
    //     }
    //   });
    // } else {
    //   this.getAllPostsByTopicName(allPosts);
    // }
    const { currentTopic } = this.state;
    const { allIconImagesByTopic } = this.props.posts;
    if (!allIconImagesByTopic[currentTopic] && !allIconImagesByTopic.length) {
      this.fetchAllIconImagesByTopic(currentTopic);
    }
  }

  fetchAllIconImagesByTopic = (currentTopic) => {
    const { currentTopicPosts } = this.state;

    currentTopicPosts.forEach((topic) => {
      this.props.firebase.storage
        .ref()
        .child(topic.iconPath)
        .getDownloadURL()
        .then((url) => {
          this.props.onGetAllPostsValues({
            allIconImagesByTopic: {
              ...this.props.posts.allIconImagesByTopic,
              // ...this.props.posts.allIconImagesByTopic[currentTopic]
              [currentTopic]: {
                ...this.props.posts.allIconImagesByTopic[currentTopic],
                [topic.title]: url,
              },
            },
            // (
            //   (this.props.posts.allIconImagesByTopic[currentTopic][
            //     topic.title
            //   ] = url)
            // ),
          });
        });
    });
    // this.props.firebase.storage
    //   .ref()
    //   .child(`${TOPICS_BUCKET_NAME}/`)
    //   .listAll()
    //   .then((res) =>
    //     res.items.forEach((item) =>
    //       item.getDownloadURL().then((url) =>
    //         this.props.onGetAllPostsValues({
    //           allTopicsImages: this.props.posts.allTopicsImages.concat(url),
    //         })
    //       )
    //     )
    //   );
  };

  convertMillisecondsToDate = (milliseconds) => {
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.toString().slice(4, 7);
    const year = date.getFullYear();

    return `${month} ${day}, ${year} `;
  };
  render() {
    // console.log(this.props.posts.allPosts, "allPosts");
    const { currentTopic, isLoading, currentTopicPosts } = this.state;
    const { allIconImagesByTopic } = this.props.posts;

    return (
      <div>
        {!currentTopicPosts ? (
          <Segment className="loader-admin">
            <Dimmer active>
              <Loader size="massive">Loading </Loader>
            </Dimmer>
          </Segment>
        ) : (
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
              {isLoading || !allIconImagesByTopic[currentTopic] ? (
                <Segment inverted className="loader-topics">
                  <Dimmer
                    className="dimmer-topics"
                    style={{ color: "black" }}
                    inverted
                    active
                  >
                    <Loader style={{ color: "black" }} size="big">
                      Loading
                    </Loader>
                  </Dimmer>
                </Segment>
              ) : (
                currentTopicPosts.map((topic) => {
                  return (
                    <Grid.Column
                      widescreen={5}
                      largeScreen={7}
                      className="topics-column"
                      key={topic.date}
                    >
                      <Transition
                        visible={true}
                        animation="fade"
                        duration={2500}
                        transitionOnMount={true}
                      >
                        {/* <Transition
                      visible={true}
                      animation="fade"
                      duration={1500}
                      transitionOnMount={true}
                      key={topic.title}
                    > */}
                        {/* 
                      <Link
                        className="card-topic-link"
                        to={`${LESSON_TOPIC_LIST}?topic=${topic.name.toLowerCase()}`}
                      > */}
                        <Link
                          className="card-topic-link"
                          to={`${LESSON_TOPIC}/${topic.title
                            .toLowerCase()
                            .split(" ")
                            .join("-")}`}
                        >
                          <Card
                            centered
                            fluid
                            className="card-selected-topic-container"
                          >
                            <Icon
                              className="card-topic-arrow"
                              name="arrow right"
                            />
                            <Card.Content className="card-content-topic">
                              <Card.Content className="card-content-image">
                                <Image
                                  className="card-topic-image"
                                  src={
                                    allIconImagesByTopic[currentTopic][
                                      topic.title
                                    ]
                                  }
                                  alt={topic.title}
                                  floated="left"
                                  size="mini"
                                />
                              </Card.Content>
                              <Card.Content className="card-content-topic-text">
                                <Card.Header
                                  as="h3"
                                  className="card-topic-header"
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
                                      {this.convertMillisecondsToDate(
                                        topic.date
                                      )}
                                    </span>
                                  </div>
                                  <div className="card-meta-time">
                                    <Icon
                                      className="card-icon-circle"
                                      name="circle"
                                    />
                                    <span className="card-lessons-length">
                                      10 mintues
                                    </span>
                                    <Icon
                                      className="card-icon-star"
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
        )}
      </div>
    );
  }
}
// posts/1590279183391-default.png
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
