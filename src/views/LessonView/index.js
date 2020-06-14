import React, { Component, createRef } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { getAllPostsValues, setSessionValues } from "../../redux/actions";
import { withFirebase } from "../Firebase";
import draftToHtml from "draftjs-to-html";
import { convertToRaw, EditorState, convertFromRaw } from "draft-js";
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
  LESSON_COMPLETE_CONFIRMATION,
  USERS_BUCKET_NAME,
  ANOTHER_WAY,
} from "../../constants/shared";
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
import fireAlert from "../../utils/fireAlert";

// style
import "./style.scss";
import { HOME } from "../../constants/routes";

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
    const { mode, newPostState } = this.props;
    const { allPosts } = this.props.posts;
    this.setState({ isLoadingLesson: true });

    if (mode && mode === CREATE_LESSON_STAGES.preview) {
      const clonedNewPostState = Object.assign({}, newPostState, {
        post: Object.assign({}, newPostState.post),
      });
      this.setSelectedLesson([clonedNewPostState]);
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
    if (selectedLesson[0].newPostExercisesValues) {
      Object.values(selectedLesson[0].newPostExercisesValues).map((obj) => {
        return (selectedLesson[0].post[obj.type] = obj);
      });

      const filteredLessonItems = Object.keys(selectedLesson[0].post).filter(
        (item) =>
          item !== CREATE_LESSON_STAGES.content.key &&
          item !== CREATE_LESSON_STAGES.after.key
      );

      // push conclusion in the end
      filteredLessonItems.push(CREATE_LESSON_STAGES.after.key);

      this.setState({
        // lessonId: selectedLesson[0]
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

  transformJsonText = (state) => {
    return EditorState.createWithContent(convertFromRaw(JSON.parse(state)));
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
      if (lessonChapter._immutable) {
        console.log(lessonChapter, "lessonChapter._immutable");
        console.log(lessonChapter._immutable, "._immutable");
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
        if (lessonChapter.name.includes(ANOTHER_WAY)) {
          return <AnotherWay lessonValues={lessonChapter} />;
        }
        if (lessonChapter.name.includes(COMPLETE_THE_SENTENCES)) {
          return <CompleteSentence lessonValues={lessonChapter} />;
        }

        if (lessonChapter.name.includes(MATCHING)) {
          // console.log('MATCH HERE')
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
    const { fullLeson } = this.state;
    const { sessionState } = this.props;

    this.props.firebase.db
      .ref(`${USERS_BUCKET_NAME}/${sessionState.authUser.uid}`)
      .update({
        ...sessionState.authUser,
        // email: sessionState.authUser.email
        // uid: sessionState.authUser.uid,
        // username: sessionState.authUser.username,
        // roles: sessionState.authUser.roles,
        lessonsCompleted: {
          ...sessionState.authUser.lessonsCompleted,
          [fullLeson.uid]: new Date().getTime(),
        },
      })
      .then(() => {
        this.props.onSetLessonComplete({
          authUser: {
            ...sessionState.authUser,
            lessonsCompleted: {
              ...sessionState.lessonsCompleted,

              [fullLeson.uid]: new Date().getTime(),
            },
          },
        });
        fireAlert({
          state: true,
          values: LESSON_COMPLETE_CONFIRMATION,
        }).then(() => {
          // once a lesson completed, a user will be taken to home page
          window.location.pathname = HOME;
        });
      })
      .catch((error) => {
        let values = LESSON_COMPLETE_CONFIRMATION;
        values.text.error = error.text;
        fireAlert({ state: false, values });
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

    console.log(this.state, "this.state");
    return (
      <div>
        {isLoadingLesson && !error ? (
          <Segment className="loader-admin">
            <Dimmer active>
              <Loader size="massive">Loading</Loader>
            </Dimmer>
          </Segment>
        ) : error && !isLoadingLesson ? (
          <Message
            className="lesson-view-error-message"
            size="massive"
            negative
          >
            <Message.Header>Oops! something went wrong...</Message.Header>
            <Message.Content>{errorText}</Message.Content>
          </Message>
        ) : !Object.entries(fullLeson).length ? (
          <Message
            className="lesson-view-error-message"
            size="massive"
            negative
          >
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
                          className="lesson-view-error-message"
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
                    {console.log(
                      fullLeson.post[CREATE_LESSON_STAGES.content.key]
                    )}
                    {/* check whether it's editor state or stringified json */}
                    {fullLeson.post[CREATE_LESSON_STAGES.content.key] && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: fullLeson.post[
                            CREATE_LESSON_STAGES.content.key
                          ]._immutable
                            ? draftToHtml(
                                convertToRaw(
                                  fullLeson.post[
                                    CREATE_LESSON_STAGES.content.key
                                  ].getCurrentContent()
                                )
                              )
                            : JSON.parse(
                                fullLeson.post[CREATE_LESSON_STAGES.content.key]
                              ),
                        }}
                      />
                    )}
                    {!fullLeson.post[CREATE_LESSON_STAGES.content.key] && (
                      <Message
                        className="lesson-view-error-message"
                        size="massive"
                        negative
                      >
                        <Message.Header>
                          Oops! something went wrong...
                        </Message.Header>
                        <Message.Content>
                          {currentTopic === "admin"
                            ? "You have nothing to preview."
                            : `Unfortunately  "Content" can't be
              loaded =(`}
                        </Message.Content>
                      </Message>
                    )}
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
                          : mode !== CREATE_LESSON_STAGES.preview &&
                            this.sendCompletedLessonToDb()
                      }
                      disabled={
                        mode === CREATE_LESSON_STAGES.preview && isNextDisabled
                      }
                    >
                      {isNextDisabled ? "Finish Up" : "Next"}
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
    // onSetNewUserValues: (values) => dispatch(setNewValues(values)),
    onSetLessonComplete: (values) => dispatch(setSessionValues(values)),
  };
};
export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(LessonView);
