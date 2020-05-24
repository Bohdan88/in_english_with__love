import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { getAllPostsValues, setNewPostValues } from "../../redux/actions";
import { Grid, Card, Image, Button, Icon } from "semantic-ui-react";

// style
import "./style.scss";

class Read extends Component {
  componentDidMount() {
    this.props.firebase.posts().on("value", (snapshot) => {
      const postsObject = snapshot && snapshot.val();
      if (postsObject) {
        const postsList = Object.keys(postsObject).map((key) => ({
          ...postsObject[key],
          uid: key,
        }));

        this.setState({
          posts: postsList,
        });

        const setSubCategories = [
          ...new Set(
            postsList.map((obj, key) => ({
              name: obj.subCategory,
              lessons: postsList.filter(
                (el) => el.subCategory === obj.subCategory
              ),
            }))
          ),
        ];

        // const setFocuses = [...new Set(postsList.map((obj, key) => obj.focus))];

        // set posts
        this.props.onGetAllPostsValues({
          allPosts: postsList,
          subCategories: setSubCategories,
          //   focuses: setFocuses,
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.posts().off();
  }
  render() {
    const { subCategories } = this.props.posts;
    console.log(subCategories, "subCategories");
    return (
      <Grid className="topics-container">
        <Grid.Row columns={2}>
          <Grid.Column>TOPICS</Grid.Column>
          <Grid.Column>SEARCH </Grid.Column>
        </Grid.Row>
        <Grid.Row centered columns={2}>
          {/* <Card.Group centered fluid itemsPerRow={2}> */}
          {subCategories &&
            !!subCategories.length &&
            subCategories.map((topic, key) => {
              return (
                <Grid.Column width={7} className="topics-column" key={key}>
                  <Card centered fluid key={key}>
                    {/* <Grid.Column className="topics-column" key={key}> */}

                    <Card.Content className="card-content-topic">
                      <Card.Content className="card-content-image">
                        <Image floated="left" size="mini" alt={topic.name} />
                      </Card.Content>
                      <Card.Content>
                        <Card.Header as="h2">{topic.name}</Card.Header>
                        <Card.Meta>
                          <Icon name="pencil alternate" />{" "}
                          <span className="card-lessons-length">
                            {topic.lessons ? topic.lessons.length : 0}
                            {topic.lessons && topic.lessons.length === 1
                              ? " Lesson"
                              : " Lessons"}
                          </span>
                        </Card.Meta>
                        <Card.Description>
                          Steve wants to add you to the group{" "}
                          <strong>best friends</strong>
                        </Card.Description>
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
                </Grid.Column>
              );
            })}
          {/* </Card.Group> */}
          {/* </Card.Group> */}
        </Grid.Row>
      </Grid>
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
