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
import { TOPICS_BUCKET_NAME, CATEGORY_TOPICS } from "../../constants";
import { LESSON_TOPIC_LIST } from "../../constants/routes";
import { Link } from "react-router-dom";
import defaultImage from "../../assets/images/default.png";

// style
import "./style.scss";

class CategoryTopics extends Component {
  state = {
    searchedTopic: "",
    dbValuesLoading: false,
    searchTopicLoading: false,
    // stateTopics: arrTop,
  };

  handleSearchChange = (e, { value }) => {
    const { categoryType } = this.state;
    this.setState({ searchTopicLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) {
        this.setState({
          [categoryType]: this.props.posts[categoryType],
          searchTopicLoading: false,
        });
      }

      this.setState({
        searchTopicLoading: false,
        [categoryType]: {
          ...this.state[categoryType],
          names: _.filter(
            this.props.posts[categoryType].names,
            (item) => item && item.toLowerCase().includes(value.toLowerCase())
          ),
        },
      });
    }, 300);
  };

  componentDidMount() {
    const { posts } = this.props;
    // category can by either read or listen
    const categoryType = this.props.location.pathname.slice(1);

    this.setState({
      categoryType: CATEGORY_TOPICS[categoryType],
      dbValuesLoading: true,
    });

    if (!this.state[[CATEGORY_TOPICS[categoryType]]]) {
      if (!posts[CATEGORY_TOPICS[categoryType]].names.length) {
        this.props.firebase.posts().on(
          "value",
          (snapshot) => {
            const postsObject = snapshot && snapshot.val();

            if (postsObject) {
              const postsList = Object.keys(postsObject).map((key) => ({
                ...postsObject[key],
                uid: key,
              }));

              const uniqueTopics = [
                ...new Set(
                  postsList
                    .filter(
                      (obj) => obj.category.toLowerCase() === categoryType
                    )
                    .map((obj) => obj.subCategory)
                ),
              ];

              // set unique topics
              this.props.onGetAllPostsValues({
                allPosts: !posts.allPosts.length ? postsList : posts.allPosts,
                [CATEGORY_TOPICS[categoryType]]: {
                  ...this.props.posts[CATEGORY_TOPICS[categoryType]],
                  names: uniqueTopics,
                },
              });

              this.setState({
                dbValuesLoading: false,
                [CATEGORY_TOPICS[categoryType]]: {
                  ...this.props.posts[CATEGORY_TOPICS[categoryType]],
                  names: uniqueTopics,
                },
                transitionDuration: 5000,
              });
            }
          },
          (errorObject) => {
            this.setState({
              error: true,
              errorText: errorObject.code,
              dbValuesLoading: false,
            });
          }
        );
      } else {
        this.setState({
          dbValuesLoading: false,
          [CATEGORY_TOPICS[categoryType]]: this.props.posts[
            CATEGORY_TOPICS[categoryType]
          ],
          transitionDuration: 300,
        });
      }
    }

    if (!this.props.posts[CATEGORY_TOPICS[categoryType]].images.length) {
      this.fetchTopicImage(CATEGORY_TOPICS[categoryType]);
    }
  }

  fetchTopicImage = (categoryType) => {
    this.props.firebase.storage
      .ref()
      .child(`${TOPICS_BUCKET_NAME}/`)
      .listAll()
      .then((res) =>
        res.items.forEach((item) =>
          item.getDownloadURL().then((url) => {
            this.props.onGetAllPostsValues({
              [categoryType]: {
                ...this.props.posts[categoryType],
                images: this.props.posts[categoryType].images.concat(url),
              },
            });
            this.setState({
              [categoryType]: {
                ...this.props.posts[categoryType],
                images: this.props.posts[categoryType].images.concat(url),
              },
            });
          })
        )
      );
  };

  componentWillUnmount() {
    this.props.firebase.posts().off();
  }

  componentWillMount() {
    this.props.firebase.posts().off();
  }

  render() {
    const {
      searchTopicLoading,
      dbValuesLoading,
      categoryType,
      error,
      errorText,
      transitionDuration,
    } = this.state;
    const { posts } = this.props;
    const { allPosts } = posts;

    // console.log(categoryType,'categoryType')
    return categoryType ? (
      dbValuesLoading && !error ? (
        <Segment className="loader-admin">
          <Dimmer active>
            <Loader size="massive">Loading </Loader>
          </Dimmer>
        </Segment>
      ) : error && !dbValuesLoading ? (
        <Message className="error-message" size="massive" negative>
          <Message.Header>Oops! Something went wrong...</Message.Header>
          <p>{errorText}</p>
        </Message>
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
                disabled={!posts[categoryType].names[0]}
                onChange={this.handleSearchChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="categories-cards-row">
            {searchTopicLoading ? (
              <Segment inverted className="segment-loading-topics">
                <Dimmer className="dimmer-topics" inverted active>
                  <Loader className="loader-topics" size="big">
                    Loading
                  </Loader>
                </Dimmer>
              </Segment>
            ) : this.state[categoryType].names[0] ? (
              this.state[categoryType].names.map((topic) => {
                const imgSrc = posts[categoryType].images.filter((imgUrl) =>
                  imgUrl.includes(`${topic.toLowerCase()}.`)
                );
                const filteredLessons = allPosts.filter(
                  (obj) => obj.subCategory === topic
                );
                return (
                  <Transition
                    visible={true}
                    animation="fade"
                    duration={transitionDuration}
                    transitionOnMount={true}
                    unmountOnHide={true}
                    key={topic}
                  >
                    <Grid.Column
                      widescreen={3}
                      largeScreen={5}
                      tablet={8}
                      className="categories-column"
                    >
                      <Link
                        className="card-topic-link"
                        to={`${LESSON_TOPIC_LIST}?category=${this.props.location.pathname.slice(
                          1
                        )}&topic=${topic && topic.toLowerCase()}`}
                      >
                        <Card className="card-topic-container">
                          <Icon
                            className="card-topic-arrow"
                            name="arrow right"
                          />
                          <Card.Content className="card-content-category">
                            <Card.Content className="card-content-image">
                              <Image
                                className="card-topic-image"
                                src={!!imgSrc.length ? imgSrc : defaultImage}
                                alt={topic}
                                floated="left"
                                size="mini"
                              />
                            </Card.Content>
                            <Card.Content className="card-content-topic-text">
                              <Card.Header
                                as="h2"
                                className="card-topic-header"
                              >
                                {topic}
                              </Card.Header>
                              <Card.Meta className="card-topic-meta">
                                <div>
                                  <Icon name="pencil alternate" />{" "}
                                  <span className="card-lessons-length">
                                    {filteredLessons.length || 0}
                                    {filteredLessons.length &&
                                    filteredLessons.length === 1
                                      ? " Lesson "
                                      : " Lessons "}
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
            ) : (
              <Message className="error-message" size="massive" negative>
                <Message.Header>Sorry! No data found!</Message.Header>
                <p>
                  <span className="capitalize">
                    {`${this.props.location.pathname.slice(1)} Category `}
                  </span>
                  doesn't have <b>{`'${this.state.value || `lessons`}' `}</b> =(
                </p>
              </Message>
            )}
          </Grid.Row>
        </Grid>
      )
    ) : (
      <Message className="error-message" size="massive" negative>
        <Message.Header>Sorry! No data found!</Message.Header>
        <p>No location found. (Read or Listening) =( </p>
      </Message>
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
)(CategoryTopics);
