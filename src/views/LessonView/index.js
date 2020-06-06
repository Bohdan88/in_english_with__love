import React, { Component, createRef } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { getAllPostsValues, setNewValues } from "../../redux/actions";
import { withFirebase } from "../Firebase";
import {
  MatchExerciseView,
  CompleteSentence,
  SideBarMenu,
  AnotherWay,
} from "./Components";
import {
  CHAPTERS_ICONS,
  CHAPTERS_SEQUENCE,
  COMPLETE_THE_SENTENCES,
  MATCHING,
  ANOTHER_WAY_TO_SAY,
} from "../../constants/shared";

import "./style.scss";
import {
  Grid,
  Step,
  Icon,
  Segment,
  Container,
  Button,
  Progress,
  Label,
  Message,
  Dimmer,
  Loader,
  Ref,
} from "semantic-ui-react";

class LessonView extends Component {
  contextRef = createRef();
  state = {
    currentTopic: window.location.href.slice(
      window.location.href.lastIndexOf("/") + 1
    ),
    currentTopicValues: "",
    isLoadingLesson: false,
    currentStep: 1,
    // fullLeson: fullLeson,
    fullLeson: [],
    isMenuOpen: false,
    currentChapter: "",
    isPreviousDisabled: true,
    isNextDisabled: false,
    error: false,
  };

  componentDidMount() {
    const { allPosts } = this.props.posts;
    this.setState({ isLoadingLesson: true });

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

            this.identifySelectedLesson(postsList);
          }
        },
        (errorObject) => {
          this.setState({
            isLoadingLesson: false,
            errorText: errorObject.code,
            error: true,
          });
        }
      );
    } else {
      this.identifySelectedLesson(allPosts);
    }
  }

  identifySelectedLesson = (postsList) => {
    const { currentTopic } = this.state;
    let selectedLesson = postsList.filter(
      (post) => post.title.toLowerCase().split(" ").join("-") === currentTopic
    );

    if (!!selectedLesson.length) {
      Object.values(selectedLesson[0].newPostExercisesValues).map((obj) => {
        selectedLesson[0].post[obj.type] = obj;
      });

      const filteredLessonItems = Object.keys(selectedLesson[0].post).filter(
        (item) => item !== "content" && item !== "after"
      );

      // push conclusion in the end
      filteredLessonItems.push("after");

      this.setState({
        filteredLessonItems,
        fullLeson: selectedLesson[0],
        currentChapter: Object.keys(selectedLesson[0].post)[0],
        isLoadingLesson: false,
      });
    }
  };

  setCurrentChapter = (chapter) => {
    const { filteredLessonItems } = this.state;
    const findCurrentChapterIndex = filteredLessonItems.findIndex(
      (name) => name === chapter
    );

    this.setState({
      currentChapter: chapter,
      currentStep: findCurrentChapterIndex + 1,
      isNextDisabled:
        findCurrentChapterIndex === filteredLessonItems.length - 1,
      isPreviousDisabled: findCurrentChapterIndex === 0,
    });
  };

  visualizeChapterContent = (currentChapter) => {
    const { fullLeson } = this.state;
    // console.log(currentChapter,'currentChapter')
    const lessonChapter = fullLeson.post[currentChapter];
    // const lessonChapter = fullLeson.post["Vocabulary Practise"];
    // return <CompleteSentence lessonValues={lessonChapter} />;
    // console.log(lessonChapter,'lessonChapter')
    // check if it's json string
    if (typeof lessonChapter === "string") {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: JSON.parse(lessonChapter),
          }}
        />
      );
    }

    if (lessonChapter.name) {
      if (lessonChapter.name.includes(COMPLETE_THE_SENTENCES)) {
        if (lessonChapter.type.includes(ANOTHER_WAY_TO_SAY)) {
          return <AnotherWay lessonValues={lessonChapter} />;
        }
        return <CompleteSentence lessonValues={lessonChapter} />;
      }

      if (lessonChapter.name.includes(MATCHING)) {
        return <MatchExerciseView lessonValues={lessonChapter} />;
      }
    }
    return null;
  };
  componentWillMount() {
    // this.props.firebase.posts().off();
  }

  checkMenu = (menu) => this.setState({ isMenuOpen: menu });

  onNextChapter = () => {
    const { filteredLessonItems, currentChapter } = this.state;
    // find index and set  current step
    const findCurrentChapterIndex = filteredLessonItems.findIndex(
      (chapter) => chapter === currentChapter
    );

    const nextChapterIndex =
      findCurrentChapterIndex === filteredLessonItems.length - 1
        ? filteredLessonItems.length - 1
        : findCurrentChapterIndex + 1;

    this.setState({
      currentStep: nextChapterIndex + 1,
      isPreviousDisabled: nextChapterIndex === 0,
      isNextDisabled: nextChapterIndex === filteredLessonItems.length - 1,
      currentChapter: filteredLessonItems[nextChapterIndex],
    });
  };

  onPreviousChapter = () => {
    const { filteredLessonItems, currentChapter } = this.state;
    // find index and set current step
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
      currentStep,
      currentTopic,
      fullLeson,
      isMenuOpen,
      currentChapter,
      filteredLessonItems,
      isNextDisabled,
      isPreviousDisabled,
      isLoadingLesson,
      error,
      errorText,
    } = this.state;

    // console.log(this.state, "STATE");
    const menu = isMenuOpen ? "menu-open" : "";

    return (
      <div>
        {isLoadingLesson && !error ? (
          <Segment className="loader-admin">
            <Dimmer active>
              <Loader size="massive">Loading</Loader>
            </Dimmer>
          </Segment>
        ) : error && !isLoadingLesson ? (
          <Message className="error-message" size="massive" negative>
            <Message.Header>Oops! something went wrong...</Message.Header>
            <Message.Content>{errorText}</Message.Content>
          </Message>
        ) : !Object.entries(fullLeson).length ? (
          <Message className="error-message" size="massive" negative>
            <Message.Header>Oops! something went wrong...</Message.Header>
            <Message.Content>
              Unfortunately {currentTopic} can't be loaded =(
            </Message.Content>
          </Message>
        ) : (
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
                    <Label size="big" className="lesson-view-label capitalize">
                      {currentChapter}
                    </Label>
                    <div className="chapter-block">
                      {this.visualizeChapterContent(currentChapter)}
                    </div>
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
                        __html: JSON.parse(fullLeson.post.content),
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
                </Segment>
              </Grid.Column>
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
    onSetNewUserValues: (values) => dispatch(setNewValues(values)),
  };
};
export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(LessonView);
