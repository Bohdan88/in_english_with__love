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
} from "semantic-ui-react";
import { TOPICS_BUCKET_NAME, DEFAULT_TOPIC_IMAGE } from "../../constants";
import { LESSON_TOPIC_LIST } from "../../constants/routes";
import { Link } from "react-router-dom";
// style
import "./style.scss";

const arrTop = [
  { name: "Culture", lessons: "" },
  { name: "History", lessons: [""] },
  { name: "Sport", lessons: "" },
  { name: "Math", lessons: "" },
  { name: "Psychology", lessons: "" },
  { name: "Philosophy", lessons: "" },
  { name: "Music", lessons: "" },
  { name: "Biology", lessons: "" },
  { name: "Opera", lessons: "" },
];

class ListenTopics extends Component {
  state = {
    searchedTopic: "",
    loading: false,
    stateTopics: arrTop,
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ loading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) {
        this.setState({
          stateTopics: arrTop,
          loading: false,
        });
      }

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.name);

      this.setState({
        loading: false,
        stateTopics: _.filter(this.state.stateTopics, isMatch),
      });
    }, 300);
  };

  componentDidMount() {
    this.props.firebase.posts().on("value", (snapshot) => {
      const postsObject = snapshot && snapshot.val();
      if (postsObject) {
        const postsList = Object.keys(postsObject).map((key) => ({
          ...postsObject[key],
          uid: key,
        }));

        const setAllListentopics = [
          ...new Set(
            postsList.map((obj) => ({
              name: obj.subCategory,
              lessons: postsList.filter(
                (el) =>
                  el.category.toLowerCase() ===
                    this.props.location.pathname.slice(1) &&
                  el.subCategory === obj.subCategory
              ),
            }))
          ),
        ];

        console.log(setAllListentopics, "setAllListentopics");
        // set posts
        this.props.onGetAllPostsValues({
          allPosts: postsList,
          allListenTopics: setAllListentopics,
        });

        // this.setState({
        //   stateTopics: setAlltopics,
        // });
        // setTimeout(() => this.setState({ loading: false }), 2000);
      }
    });

    if (!this.props.posts.allTopicsImages.length) {
      this.fetchTopicImage();
    }
  }

  fetchTopicImage = () => {
    this.props.firebase.storage
      .ref()
      .child(`${TOPICS_BUCKET_NAME}/`)
      .listAll()
      .then((res) =>
        res.items.forEach((item) =>
          item.getDownloadURL().then((url) =>
            this.props.onGetAllPostsValues({
              allTopicsImages: this.props.posts.allTopicsImages.concat(url),
            })
          )
        )
      );
  };

  componentWillUnmount() {
    // this.props.firebase.posts().off();
  }

  render() {
    const { loading, stateTopics } = this.state;
    const { allListenTopics, allTopicsImages } = this.props.posts;

    return (
      <div>
        {!allTopicsImages.length || !allListenTopics.length ? (
          <Segment className="loader-segment">
            <Dimmer active>
              <Loader size="massive">Loading </Loader>
            </Dimmer>
          </Segment>
        ) : (
          <Grid className="topics-container">
            <Grid.Row columns={2} className="topics-header-row">
              <Grid.Column>
                <Header className="topics-header" as="h1">
                  Topics
                </Header>
              </Grid.Column>
              <Grid.Column className="topics-column-search">
                <Input
                  className="topics-input-search"
                  size="large"
                  icon="search"
                  placeholder="Search topics..."
                  onChange={this.handleSearchChange}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="topics-cards-row">
              {loading ? (
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
                stateTopics.map((topic) => {
                  const imgSrc = allTopicsImages.filter((imgUrl) =>
                    imgUrl.includes(`${topic.name.toLowerCase()}.`)
                  );

                  const defaultImage = allTopicsImages.filter((imgUrl) =>
                    imgUrl.includes(DEFAULT_TOPIC_IMAGE)
                  );
                  return (
                    <Transition
                      visible={true}
                      animation="fade"
                      duration={2000}
                      transitionOnMount={false}
                      unmountOnHide={true}
                      key={topic.name}
                    >
                      <Grid.Column
                        widescreen={3}
                        largeScreen={4}
                        className="topics-column"
                      >
                        <Link
                          className="card-topic-link"
                          to={`${LESSON_TOPIC_LIST}?topic=${topic.name.toLowerCase()}`}
                        >
                          <Card fluid className="card-topic-container">
                            <Icon
                              className="card-topic-arrow"
                              name="arrow right"
                            />
                            <Card.Content className="card-content-topic">
                              <Card.Content className="card-content-image">
                                <Image
                                  className="card-topic-image"
                                  src={!!imgSrc.length ? imgSrc : defaultImage}
                                  alt={topic.name}
                                  floated="left"
                                  size="mini"
                                />
                              </Card.Content>
                              <Card.Content className="card-content-topic-text">
                                <Card.Header
                                  as="h2"
                                  className="card-topic-header"
                                >
                                  {topic.name}
                                </Card.Header>
                                <Card.Meta className="card-topic-meta">
                                  <div>
                                    <Icon name="pencil alternate" />{" "}
                                    <span className="card-lessons-length">
                                      {topic.lessons ? topic.lessons.length : 0}
                                      {topic.lessons &&
                                      topic.lessons.length === 1
                                        ? " Lesson"
                                        : " Lessons"}
                                    </span>
                                  </div>
                                  <div className="card-meta-time">
                                    <Icon name="eye" />{" "}
                                    <span className="card-lessons-length">
                                      55 mintues
                                    </span>
                                  </div>
                                </Card.Meta>
                              </Card.Content>
                            </Card.Content>
                          </Card>
                        </Link>
                      </Grid.Column>
                    </Transition>
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
)(ListenTopics);
