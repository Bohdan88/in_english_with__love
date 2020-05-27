import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { getAllPostsValues } from "../../redux/actions";
import { withFirebase } from "../Firebase";
import { Editor } from "react-draft-wysiwyg";
import { MatchExerciseView } from "./Components";

import "./style.scss";
import {
  Grid,
  Divider,
  Step,
  Icon,
  Segment,
  Item,
  Container,
} from "semantic-ui-react";

class LessonView extends Component {
  state = {
    currentTopic: window.location.href.slice(
      window.location.href.lastIndexOf("/") + 1
    ),
    currentTopicValues: "",
    isLoading: false,
    currentStep: 0,
  };
  ƒ;
  componentDidMount() {
    // const { currentTopic } = this.state;
    // console.log(currentTopic, "thisProps");
    // console.log(this.props.posts.allPosts);
    // const { allPosts } = this.props.posts;
    //   // this.setState({ isLoading: true });
    //   if (!allPosts.length) {
    //     this.props.firebase.posts().on("value", (snapshot) => {
    //       const postsObject = snapshot && snapshot.val();
    //       if (postsObject) {
    //         const postsList = Object.keys(postsObject).map((key) => ({
    //           ...postsObject[key],
    //           uid: key,
    //         }));
    //         //   // set posts
    //         //   this.props.onGetAllPostsValues({
    //         //     // allPosts: postsList,
    //         //   });
    //         this.setState({
    //           currentTopicValues: postsList.filter(
    //             (post) => post.title === "SKY DANCING"
    //             // post.title.toLowerCase().split(" ").join("-") ===
    //             // this.state.currentTopic
    //           ),
    //         });
    //       }
    //     });
    //   }
    // }
  }
  componentWillMount() {
    // this.props.firebase.posts().off();
  }
  render() {
    const { currentTopicValues, currentStep } = this.state;

    return (
      <div>
        {/* View <MatchExerciseView /> */}
        <Grid className="lesson-view-grid">
          <Grid.Row columns={2}>
            <Grid.Column
              width={8}
              style={{ borderRight: "1px solid transparent" }}
            >
              <Container className="lesson-view-steps-container" fluid>
                <Step.Group
                  attached="top"
                  widths={4}
                  fluid
                  stackable="tablet"
                  size="mini"
                >
                  <Step active={0} key={1}>
                    <Icon name="info" />
                    <Step.Content>
                      <Step.Title>Before Watching</Step.Title>
                      {/* <Step.Description>
                      Do you enjoy dancing? Have you ever taken dance lessons?
                      Are there any traditional dances in your country? How
                      important is dance in your culture?
                    </Step.Description> */}
                    </Step.Content>
                  </Step>
                  <Step link>
                    <Icon name="edit" />
                    <Step.Content>
                      <Step.Title>Exercises</Step.Title>
                      <Step.Description>
                        {/* <MatchExerciseView /> */}
                      </Step.Description>
                    </Step.Content>
                  </Step>
                  <Step link>
                    <Icon name="child" />
                    <Step.Content>
                      <Step.Title>After watching</Step.Title>
                      {/* <Step.Description>
                      • What did you think of the video? Did you know about sky
                      dancing before watching this video? • What’s another way
                      to say “mix”? What are the things that sky dancing mixes?
                      • Who’s the newest member of the company and why did the
                      owner pick her? • What’s another way to say “risk-taker”?
                      Are you a risk-taker? Do you think it’s a good quality?
                      Explain. • What does tenacity mean? Can you give an
                      example of a situation that requires tenacity? • What’s
                      another way to say restless? When do you feel that way? •
                      Are you afraid of heights? Do you have any fears that
                      you’d like to overcome? • Some people believe that we’re
                      born with certain talents, for instance for music and
                      sport. But other people feel that anyone can be taught to
                      become a good sports person, musician, etc. What’s your
                      opinion and why?
                    </Step.Description> */}
                    </Step.Content>
                  </Step>
                </Step.Group>
                <Segment attached>
                  <MatchExerciseView />
                </Segment>
              </Container>
            </Grid.Column>
            <Grid.Column width={8}>
              <Container>
                <Step.Group
                  attached="top"
                  widths={1}
                  stackable={"tablet"}
                  size="tiny"
                  fluid
                >
                  <Step>
                    <Icon name="picture" />
                    <Step.Content>
                      <Step.Title>Content</Step.Title>
                      {/* <Step.Description>
                      Do you enjoy dancing? Have you ever taken dance lessons?
                      Are there any traditional dances in your country? How
                      important is dance in your culture?
                    </Step.Description> */}
                    </Step.Content>
                  </Step>
                </Step.Group>
                <Segment attached>Segment</Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/* <Divider vertical/> */}
      </div>
    );
  }
}
// console.log(currentTopicValues[0] && currentTopicValues[0].post.about.slice(currentTopicValues[0].post.about))
//     return (
//       currentTopicValues &&
//       !!currentTopicValues.length && (
//         <div>
//           LessonView
//           {/* {console.log(
//             EditorState.createWithContent(
//               ContentState.createFromBlockArray(
//                 currentTopicValues[0].post.about.blocks
//               )
//             )
//           )} */}
//           {/* {console.log(
//             ContentStat.createFromBlockArray(
//               currentTopicValues[0].post.about.blocks
//             )
//           )} */}
//           {console.log(currentTopicValues[0].post.about)}
//           {/* {console.log(
//             convertFromRaw(JSON.parse(currentTopicValues[0].post.about))
//           )}
//           {EditorState.createWithContentconvertFromRaw(JSON.parse(JSON.stringify(currentTopicValues[0].post.about.blocks)))} */}
//           {/* {console.log(ContentState.createFromBlockArray(currentTopicValues[0].post.content.blocks).addEntity())} */}
//           <div
//             dangerouslySetInnerHTML={{
//               __html: currentTopicValues[0].post.about,
//             }}
//           />
//           <textarea
//             style={{ height: "300px", width: "300px" }}
//             disabled
//             /* value={draftToHtml(currentTopicValues[0].post.about)} */
//           />
//           {/* <Editor
//             editorState={EditorState.createWithContent(
//               convertFromRaw(
//                 JSON.parse(
//                   JSON.stringify(currentTopicValues[0].post.about.blocks)
//                 )
//               )
//             )}
//           /> */}
//         </div>
//       )
//     );
//   }
// }

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
)(LessonView);
