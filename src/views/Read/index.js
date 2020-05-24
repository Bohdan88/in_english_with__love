import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { getAllPostsValues, setNewPostValues } from "../../redux/actions";
import {
  Grid,
  Card,
  Image,
  Button,
  Icon,
  Loader,
  Segment,
  Dimmer,
} from "semantic-ui-react";
import {
  POSTS_BUCKET_NAME,
  TOPICS_BUCKET_NAME,
  DEFAULT_TOPIC_IMAGE,
} from "../../constants/shared";
import { LESSON_TOPIC_LIST } from "../../constants/routes";
import { Link } from "react-router-dom";
// style
import "./style.scss";

class Read extends Component {
  cardRef = React.createRef();
  componentDidMount() {
    this.props.firebase.posts().on("value", (snapshot) => {
      const postsObject = snapshot && snapshot.val();
      if (postsObject) {
        const postsList = Object.keys(postsObject).map((key) => ({
          ...postsObject[key],
          uid: key,
        }));

        const setAlltopics = [
          ...new Set(
            postsList.map((obj) => ({
              name: obj.subCategory,
              lessons: postsList.filter(
                (el) => el.subCategory === obj.subCategory
              ),
            }))
          ),
        ];

        // set posts
        this.props.onGetAllPostsValues({
          allPosts: postsList,
          allTopics: setAlltopics,
        });
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
    this.props.firebase.posts().off();
  }

  filterValue = (arr, value) =>
    arr.filter((element) => element.includes(value));
  render() {
    const { allTopics, allTopicsImages } = this.props.posts;
    // console.log(allTopics, "allTopics");

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

    // console.log(this.cardRef.current, "THIS");
    return (
      <div>
        {!allTopicsImages.length || !allTopics.length ? (
          <Segment className="loader-admin">
            <Dimmer active>
              <Loader size="massive">Loading </Loader>
            </Dimmer>
          </Segment>
        ) : (
          <Grid className="topics-container">
            <Grid.Row columns={2}>
              <Grid.Column>TOPICS</Grid.Column>
              <Grid.Column>SEARCH </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              {arrTop.map((topic, key) => {
                const imgSrc = allTopicsImages.filter((imgUrl) =>
                  imgUrl.includes(`${topic.name.toLowerCase()}.`)
                );

                const defaultImage = allTopicsImages.filter((imgUrl) =>
                  imgUrl.includes(DEFAULT_TOPIC_IMAGE)
                );
                return (
                  <Grid.Column
                    widescreen={3}
                    largeScreen={4}
                    className="topics-column"
                    key={key}
                  >
                    <Link
                      ref={this.cardRef}
                      className="card-topic-link"
                      to={LESSON_TOPIC_LIST}
                    >
                      <Card
                        centered
                        fluid
                        className="card-topic-container"
                        key={key}
                      >
                        <Icon className="card-topic-arrow" name="arrow right" />
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
                            <Card.Header as="h2" className="card-topic-header">
                              {topic.name}
                            </Card.Header>
                            <Card.Meta className="card-topic-meta">
                              <div>
                                <Icon name="pencil alternate" />{" "}
                                <span className="card-lessons-length">
                                  {topic.lessons ? topic.lessons.length : 0}
                                  {topic.lessons && topic.lessons.length === 1
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

                            {/* <Card.Description>
                            Steve wants to add you to the group{" "}
                            <strong>best friends</strong>
                          </Card.Description> */}
                          </Card.Content>
                        </Card.Content>
                        {/* <Card.Content extra>
                      <div className="ui two buttons">
                        <Button basic color="green">
                          Approve
                        </Button>
                        <Button basic color="red">
                          Decline
                        </Button>
                      </div>
                    </Card.Content> */}
                      </Card>
                    </Link>
                  </Grid.Column>
                );
              })}
              {/* </Card.Group> */}
              {/* </Card.Group> */}
            </Grid.Row>
          </Grid>
        )}
      </div>
    );
  }
}

// export default Read;

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
export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Read);
