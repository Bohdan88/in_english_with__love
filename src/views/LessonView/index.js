import React, { Component, createRef } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { getAllPostsValues, setNewValues } from "../../redux/actions";
import { withFirebase } from "../Firebase";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import Swal from "sweetalert2";
import {
  MatchExerciseView,
  CompleteSentence,
  SideBarMenu,
  AnotherWay,
} from "./Components";
import {
  COMPLETE_THE_SENTENCES,
  MATCHING,
  ANOTHER_WAY_TO_SAY,
  CREATE_LESSON_STAGES,
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
    stepsVisited: {},
  };

  addVisitedStep = (payload) =>
    this.setState({ stepsVisited: { ...this.state.stepsVisited, ...payload } });

  componentDidMount() {
    const { currentTopic } = this.state;
    const { mode } = this.props;
    const { allPosts } = this.props.posts;
    this.setState({ isLoadingLesson: true });

    if (mode && mode === CREATE_LESSON_STAGES.preview) {
      this.setSelectedLesson([this.props.newPostState]);
    } else if (!allPosts.length) {
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

            this.setSelectedLesson(
              postsList.filter(
                (post) =>
                  post.title.toLowerCase().split(" ").join("-") === currentTopic
              )
            );
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
      // find selected lesson
      this.setSelectedLesson(
        allPosts.filter(
          (post) =>
            post.title.toLowerCase().split(" ").join("-") === currentTopic
        )
      );
    }
  }

  setSelectedLesson = (selectedLesson) => {
    if (!!selectedLesson.length) {
      Object.values(selectedLesson[0].newPostExercisesValues).map((obj) => {
        return (selectedLesson[0].post[obj.type] = obj);
      });

      const filteredLessonItems = Object.keys(selectedLesson[0].post).filter(
        (item) => item !== "content" && !item.toLowerCase().includes("after")
      );

      // push conclusion in the end
      filteredLessonItems.push("After Watching");

      this.setState({
        filteredLessonItems,
        fullLeson: selectedLesson[0],
        currentChapter: Object.keys(selectedLesson[0].post)[0],
        isLoadingLesson: false,
      });
    } else {
      this.setState({
        fullLeson: {},
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
    const { mode } = this.props;

    const lessonChapter = fullLeson.post[currentChapter];
    // const lessonChapter = fullLeson.post["Vocabulary Practise"];
    // return <CompleteSentence lessonValues={lessonChapter} />;
    // console.log(lessonChapter,'lessonChapter')

    // check if it's json string  or editor state
    if (lessonChapter) {
      if (typeof lessonChapter === "string" || lessonChapter._immutable) {
        // check if mode is preview, if so do not parse it because we don't stringify it yet
        return (
          <div
            dangerouslySetInnerHTML={{
              __html:
                mode === CREATE_LESSON_STAGES.preview
                  ? lessonChapter === ""
                    ? ""
                    : draftToHtml(
                        convertToRaw(lessonChapter.getCurrentContent())
                      )
                  : JSON.parse(lessonChapter),
            }}
          />
        );
      }

      if (lessonChapter && lessonChapter.name) {
        if (lessonChapter.name.includes(ANOTHER_WAY_TO_SAY)) {
          return <AnotherWay lessonValues={lessonChapter} />;
        }
        if (lessonChapter.name.includes(COMPLETE_THE_SENTENCES)) {
          return <CompleteSentence lessonValues={lessonChapter} />;
        }

        if (lessonChapter.name.includes(MATCHING)) {
          return <MatchExerciseView lessonValues={lessonChapter} />;
        }
      }
    }
    return null;
  };
  componentWillMount() {
    // this.props.firebase.posts().off();
  }

  checkMenu = (menu) => this.setState({ isMenuOpen: menu });

  onNextChapter = () => {
    const { filteredLessonItems, currentChapter, stepsVisited } = this.state;
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
      stepsVisited: { ...stepsVisited, [nextChapterIndex]: true },
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

  sendCompletedLessonToDb = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      position: "top-end",
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
      stepsVisited,
    } = this.state;
    const { mode } = this.props;

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
              {currentTopic === "admin"
                ? "You have nothing to preview."
                : `Unfortunately  ${currentTopic} can't be
              loaded =(`}
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
                      {this.visualizeChapterContent(currentChapter) || (
                        <Message
                          className="error-message"
                          size="massive"
                          negative
                        >
                          <Message.Header>
                            Oops! something went wrong...
                          </Message.Header>
                          <Message.Content>
                            {currentTopic === "admin"
                              ? "You have nothing to preview."
                              : `Unfortunately  "${currentChapter}" can't be
              loaded =(`}
                          </Message.Content>
                        </Message>
                      )}
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
                    {/* check if mode is preview. because in preview we do not stringify values yet */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          mode === CREATE_LESSON_STAGES.preview
                            ? fullLeson.post[
                                CREATE_LESSON_STAGES.content.key
                              ] &&
                              draftToHtml(
                                convertToRaw(
                                  fullLeson.post[
                                    CREATE_LESSON_STAGES.content.key
                                  ].getCurrentContent()
                                )
                              )
                            : JSON.parse(fullLeson.post.content),
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
                    stepsVisited={stepsVisited}
                    currentStep={currentStep}
                    mode={mode}
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
                      onClick={() =>
                        !isNextDisabled
                          ? this.onNextChapter()
                          : this.sendCompletedLessonToDb()
                      }
                    >
                      {isNextDisabled ? "Up Next" : "Next"}
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
  const { posts, newPostState, sessionState } = state;
  return { posts, newPostState, sessionState };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAllPostsValues: (database) => dispatch(getAllPostsValues(database)),
    onSetNewUserValues: (values) => dispatch(setNewValues(values)),
    onSetLessonComplete: (values) => dispatch(setNewValues(values)),
  };
};
export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(LessonView);
