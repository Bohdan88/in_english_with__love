import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { getAllPostsValues, setNewValues } from "../../redux/actions";
import { withFirebase } from "../Firebase";
import { Editor } from "react-draft-wysiwyg";
import { MatchExerciseView, CompleteSentence, SideBarMenu } from "./Components";
import { CHAPTERS_ICONS, CHAPTERS_SEQUENCE } from "../../constants/shared";

import "./style.scss";
import {
  Grid,
  Divider,
  Step,
  Icon,
  Segment,
  Item,
  Container,
  Button,
  Progress,
} from "semantic-ui-react";

const fullLeson = {
  category: "Read",
  focus: "Conversation",
  iconPath: "",
  subCategory: "Music",
  title: "SKY DANCING",
  uid: "-M8GqOv-xGV_9WuQZ5t1",
  newPostExercisesValues: {
    0: {
      description: "Match the following sentences to their meanings below.",
      id: 0,
      name: "Matching",
      type: "From the video",
      content: [
        {
          contentId: "It is death-defying",
          contentLetter: "It’s very dangerous.",
          id: 0,
          letter: "C",
        },
        {
          contentId: "What we do is life-affirming",
          contentLetter:
            "What we do shows that we support and believe strongly in life.",
          id: 1,
          letter: "E",
        },
        {
          contentId: "The dance activates those spaces",
          contentLetter: "The dance makes those places alive and active.",
          id: 2,
          letter: "D",
        },
        {
          contentId: "It made sense to me.",
          contentLetter: "It felt right to me.",
          id: 3,
          letter: "A",
        },
        {
          contentId: "My goal is to achieve the state of non-thinking",
          contentLetter: "I want to feel completely present and in the moment.",
          id: 4,
          letter: "B",
        },
      ],
    },

    1: {
      description:
        "Match the words on the left to their synonyms or meanings on the right.",
      id: 1,
      name: "Complete The Sentences",
      type: "Vocabulary",
      content: [
        {
          answer: "merge",
          contentId: "",
          contentLetter: "",
          id: 0,
          letter: "",
          sentence:
            "We can {merge} our two small businesses into a bigger one.",
        },
        {
          answer: "overlook",
          id: 1,
          sentence: "It’s easy to {overlook} a small detail like this one.",
        },
        {
          answer: "makessence",
          id: 2,
          sentence: "It  {makes sence} to leave early to avoid traffic.",
        },
        {
          answer: "daredevil",
          id: 3,
          sentence:
            "She’s a bit of a {daredevil}. She loves climbing buildings and mountains.",
        },
        {
          answer: "defy",
          id: 4,
          sentence: "Importing food that we can grow here {defy} common sense.",
        },
        {
          answer: "antsy",
          id: 5,
          sentence: "I feel {antsy} today, I don’t know why.",
        },
        {
          answer: "tenacity",
          id: 6,
          sentence:
            "We’ve always admired him for his {tenacity} and dedication.",
        },
      ],
    },
  },
  post: {
    about:
      "<p></p> <p></p> <h1>About the Video&nbsp;</h1> <p>For the past 25 years, the dance company BANDALOOP has been merging rock climbing with dancing.</p>  <p>Founded by Amelia Rudolph, the goal of the dance company is to give life to natural and artifcial vertical</p><p>spaces with amazing performances.&nbsp;</p> <p></p> <p></p> <h1>Before Watching&nbsp;</h1> <ul> <li>&nbsp;Do you enjoy dancing? Have you ever taken dance lessons? Are there any traditional dances in your country? How important is dance in your culture?</li> <li>Have you ever tried rock-climbing? If not, would you like to one day? Why or why not?</li> <li>Describe an activity that you like doing (or one that you used to do or would like to try in the future). How did you get into it? Why do you like it?&nbsp;</li> </ul> ",
    content: `<p></p>
  <iframe width="auto" height="auto" src="https://www.youtube.com/embed/BYujQ4MinDE" frameBorder="0"></iframe>
  <h2>Transcript&nbsp;</h2>
  <p></p>
  <p>“People often say, <strong>‘BANDALOOP is death-defying!’</strong></p>
  <p>No, we're not. What we do is life-affirming. It celebrates the human spirit, and grace and beauty and</p>
  <p>courage. I'm not a dafedevil. I am a dance-maker.</p>
  <p>BANDALOOP is a dance company that, for 25 years now, has been irmefging the worlds of rock-climbing</p>
  <p>mountaineering with concert-stage dance. And bringing these worlds together, we're able to dance in the</p>
  <p>mountains or on buildings, but in ways that activate those spaces in unusual and wonderful ways.</p>
  <p>It takes a lot of work to make a dream into reality. Doing the hard work, fnding the right people, practicing,</p>
  <p>failing, failing, failing, succeeding. Having the tenacity to keep going and trying to make something that's</p>
  <p>sort of an idea, real.</p>
  <p>The newest member of the company is a young woman named Virginia Broyles.”</p>
  <p>“Since I was a kid I was always interested in how people moved and how to move my own body.</p>
  <p>The more I learned about BANDALOOP, the more it irmade sense to irme, because I'm not losing any of the</p>
  <p>dance that I love so much, I'm just getting to do it in this other relationship to gfavity.”</p>
  <p>“I picked her because she has a really high capacity to learn fast, take movement into her body, which is</p>
  <p>sort of like what I call a physical intelligence.</p>
  <p>“The rotation and the loft and jumping and all these things were really exciting and fun, and then the next</p>
  <p>step is like going on a building and, I was like, oh yeah, I really wanna do this, and then the voice is like,</p>
  <p>okay, but is being on a building gonna just be way too much?</p>
  <p>I defnitely feel adrenaline. Walking up to the wall before performances, I get like really antsy and excited</p>
  <p>and nervous.</p>
  <p>But once something's been feheafsed and you get that practice time in, I guess irmy goal is to achieve the</p>
  <p>state of non-thinking. That's the ideal and that's the most exciting because it just feels like pure</p>
  <p>enjoyment.</p>
  <p>“There you are, hanging off the skyscraper, and people look up and suddenly there's a stage, there's art,</p>
  <p>there's beauty, there's grace, there's power in this site that you oveflook every day.”&nbsp;</p>
  `,

    conclusion:
      "<h2>After watching&nbsp;</h2> <ul> <li>What did you think of the video? Did you know about sky dancing before watching this video?</li> </ul><p>•   What’s another way to say “mix”? What are the things that sky dancing mixes?</p> <p>•   Who’s the newest member of the company and why did the owner pick her?</p><p>•.  What’s another way to say “risk-taker”? Are you a risk-taker? Do you think it’s a good quality?.</p>  <p>• What does tenacity mean? Can you give an example of a situation that requires tenacity?</p><p>• What’s another way to say restless? When do you feel that way?</p> <p>• Are you afraid of heights? Do you have any fears that you’d like to overcome?</p> <p>• Some people believe that we’re born with certain talents, for instance for music and sport. But</p> <p>other people feel that anyone can be taught to become a good sports person, musician, etc. What’s</p><p>your opinion and why?&nbsp;</p> ",
  },
};

class LessonView extends Component {
  state = {
    currentTopic: window.location.href.slice(
      window.location.href.lastIndexOf("/") + 1
    ),
    currentTopicValues: "",
    isLoading: false,
    currentStep: 1,
    fullLeson: fullLeson,
    isMenuOpen: false,
    currentChapter: "",
    isPreviousDisabled: true,
    isNextDisabled: false,
  };

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
    let fullLeson = Object.assign({}, this.state.fullLeson);
    Object.values(fullLeson.newPostExercisesValues).map((obj) => {
      fullLeson.post[obj.type] = obj;
    });

    const filteredLessonItems = Object.keys(fullLeson.post).filter(
      (item) => item !== "content" && item !== "conclusion"
    );
    // push conclusion in the end
    filteredLessonItems.push("conclusion");

    this.setState({
      filteredLessonItems,
      fullLeson,
      currentChapter: Object.keys(fullLeson.post)[0],
    });
  }

  setCurrentChapter = (chapter) => {
    const { filteredLessonItems } = this.state;
    const findCurrentChapterIndex = filteredLessonItems.findIndex(
      (name) => name === chapter
    );

    this.setState({
      currentChapter: chapter,
      // currentStep: findCurrentChapterIndex,
      isNextDisabled:
        findCurrentChapterIndex === filteredLessonItems.length - 1,
      isPreviousDisabled: findCurrentChapterIndex === 0,
    });
  };

  visualizeChapterContent = (currentChapter) => {
    const lessonChapter = fullLeson.post[currentChapter];

    // check if it's json string
    if (typeof lessonChapter === "string") {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: lessonChapter,
          }}
        />
      );
    }

    if (lessonChapter.name) {
      if (lessonChapter.name.includes("Complete")) {
        return <CompleteSentence />;
      }

      if (lessonChapter.name.includes("Match")) {
        return <MatchExerciseView />;
      }
    }
    return null;
  };
  componentWillMount() {
    // this.props.firebase.posts().off();
  }

  checkMenu = (menu) => this.setState({ isMenuOpen: menu });

  onNextChapter = () => {
    const { currentStep, filteredLessonItems, currentChapter } = this.state;
    // find index and set  current step
    const findCurrentChapterIndex = filteredLessonItems.findIndex(
      (chapter) => chapter === currentChapter
    );

    const nextChapterIndex =
      findCurrentChapterIndex === filteredLessonItems.length - 1
        ? filteredLessonItems.length - 1
        : findCurrentChapterIndex + 1;

    console.log(nextChapterIndex, "findCurrentChapterIndex");
    console.log(filteredLessonItems, "filteredLessonItems");
    this.setState({
      currentStep: nextChapterIndex + 1,
      isPreviousDisabled: nextChapterIndex === 0,
      isNextDisabled: nextChapterIndex === filteredLessonItems.length - 1,
      currentChapter: filteredLessonItems[nextChapterIndex],
    });
  };

  onPreviousChapter = () => {
    const { currentStep, filteredLessonItems, currentChapter } = this.state;
    // find index and set  current step
    const findCurrentChapterIndex = filteredLessonItems.findIndex(
      (chapter) => chapter === currentChapter
    );

    const previousChapterIndex =
      findCurrentChapterIndex > 0 ? findCurrentChapterIndex - 1 : 0;

    this.setState({
      currentStep: previousChapterIndex === 0 ? 1 : previousChapterIndex + 1,
      isNextDisabled: false,
      isPreviousDisabled: previousChapterIndex === 0,
      currentChapter: filteredLessonItems[previousChapterIndex],
    });
  };
  render() {
    const {
      currentTopicValues,
      currentStep,
      fullLeson,
      isMenuOpen,
      currentChapter,
      filteredLessonItems,
      isNextDisabled,
      isPreviousDisabled,
    } = this.state;
    // console.log(currentChapter, "fullLesonfullLesonfullLeson");
    // console.log(fullLeson.post, "fullLeson");
    // console.log(this.state, "THIS_STATE");
    // const hamburgerClass = isMenuOpen ? "open" : "";
    // const menuClass = isMenuOpen ? "mobile-open-menu" : "mobile-close-menu";
    const menu = isMenuOpen ? "menu-open" : "";
    // console.log(currentStep, "currentStep");
    // const filteredLessonItems = Object.keys(fullLeson.post).filter(
    //   (item) => item !== "content" && item !== "conclusion"
    // );
    // // push conclusion in the end
    // filteredLessonItems.push("conclusion");

    // console.log(filteredLessonItems, "filteredLessonItems");
    return (
      currentChapter &&
      filteredLessonItems && (
        <div>
          <Grid className={`lesson-view-grid lesson-view-${menu}`}>
            <Grid.Row stretched columns={2}>
              <Grid.Column width={8}>
                <Container fluid>
                  <Step.Group
                    attached="top"
                    widths={1}
                    fluid
                    stackable="tablet"
                  >
                    <Step>
                      <Icon className="lesson-view-icon" name="book" />
                      <Step.Content>
                        <Step.Title>Learn</Step.Title>
                      </Step.Content>
                    </Step>
                  </Step.Group>
                  <Segment
                    attached
                    className={`lesson-view-chapter-container lesson-view-${menu}`}
                  >
                    {this.visualizeChapterContent(currentChapter)}
                  </Segment>
                </Container>
              </Grid.Column>
              <Grid.Column width={8}>
                <Container fluid>
                  <Step.Group
                    attached="top"
                    widths={1}
                    fluid
                    stackable="tablet"
                  >
                    <Step>
                      <Icon
                        className="lesson-view-icon"
                        size="mini"
                        name="picture"
                      />
                      <Step.Content>
                        <Step.Title>Content</Step.Title>
                      </Step.Content>
                    </Step>
                  </Step.Group>
                  <Segment
                    attached
                    className="lesson-view-chapter-container chapter-content"
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: fullLeson.post.content,
                      }}
                    />
                  </Segment>
                </Container>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="lesson-view-fixed-container">
              <Grid.Column>
                <Segment className="lesson-view-footer-menu">
                  <SideBarMenu
                    filteredLessonItems={filteredLessonItems}
                    currentChapter={currentChapter}
                    checkMenu={this.checkMenu}
                    setCurrentChapter={this.setCurrentChapter}
                  />

                  <div className="lesson-view-footer-buttons">
                    <Button
                      icon
                      basic
                      color="grey"
                      labelPosition="left"
                      disabled={isPreviousDisabled}
                      onClick={() => this.onPreviousChapter()}
                    >
                      <Icon name="left arrow" />
                      Back
                    </Button>
                    <Progress
                      className={"lesson-view-footer-progress"}
                      value={currentStep}
                      total={filteredLessonItems.length}
                      progress="ratio"
                      color={isNextDisabled ? "green" : "grey"}
                    />

                    <Button
                      basic
                      color="teal"
                      icon
                      labelPosition="right"
                      disabled={isNextDisabled}
                      onClick={() => this.onNextChapter()}
                    >
                      Next
                      <Icon name="right arrow" />
                    </Button>
                  </div>
                  {/* <Progress percent={20} indicating></Progress> */}
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )
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
    onSetNewUserValues: (values) => dispatch(setNewValues(values)),
  };
};
export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(LessonView);
