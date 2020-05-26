import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { getAllPostsValues } from "../../redux/actions";
import { withFirebase } from "../Firebase";
import draftToHtml from "draftjs-to-html";
import {
  convertToRaw,
  EditorState,
  convertFromRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
class LessonContent extends Component {
  state = {
    currentTopic: window.location.href.slice(
      window.location.href.lastIndexOf("/") + 1
    ),
    currentTopicValues: "",
    isLoading: false,
  };
  ƒ;
  componentDidMount() {
    const { currentTopic } = this.state;
    // console.log(currentTopic, "thisProps");
    // console.log(this.props.posts.allPosts);
    const { allPosts } = this.props.posts;
    // this.setState({ isLoading: true });
    if (!allPosts.length) {
      this.props.firebase.posts().on("value", (snapshot) => {
        const postsObject = snapshot && snapshot.val();
        if (postsObject) {
          const postsList = Object.keys(postsObject).map((key) => ({
            ...postsObject[key],
            uid: key,
          }));
          //   // set posts
          //   this.props.onGetAllPostsValues({
          //     // allPosts: postsList,
          //   });
          this.setState({
            currentTopicValues: postsList.filter(
              (post) => post.title === "jivot"
              // post.title.toLowerCase().split(" ").join("-") ===
              // this.state.currentTopic
            ),
          });
        }
      });
    }
  }
  render() {
    const { currentTopicValues } = this.state;
    if (currentTopicValues && currentTopicValues[0]) {
      //   currentTopicValues[0].post.about.forEach((element) =>
      //     console.log(element, "eelement")
      //   );
    //   console.log(currentTopicValues[0].assets.about[0],'all');
    let str = 'a958204e-03b6-4547-8723-82ec4cfad6ce'
      console.log(typeof currentTopicValues[0].post.about);
    }
    // console.log(currentTopicValues[0] && currentTopicValues[0].post.about.slice(currentTopicValues[0].post.about))
    return (
      currentTopicValues &&
      !!currentTopicValues.length && (
        <div>
          LessonContent
          {/* {console.log(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(
                currentTopicValues[0].post.about.blocks
              )
            )
          )} */}
          {/* {console.log(
            ContentStat.createFromBlockArray(
              currentTopicValues[0].post.about.blocks
            )
          )} */}
          {console.log(currentTopicValues[0].post.about)}
          {/* {console.log(
            convertFromRaw(JSON.parse(currentTopicValues[0].post.about))
          )}
          {EditorState.createWithContentconvertFromRaw(JSON.parse(JSON.stringify(currentTopicValues[0].post.about.blocks)))} */}
          {/* {console.log(ContentState.createFromBlockArray(currentTopicValues[0].post.content.blocks).addEntity())} */}
          <div
            dangerouslySetInnerHTML={{
              __html: currentTopicValues[0].post.about,
            }}
          />
          <textarea
            style={{ height: "300px", width: "300px" }}
            disabled
            /* value={draftToHtml(currentTopicValues[0].post.about)} */
          />
          {/* <Editor
            editorState={EditorState.createWithContent(
              convertFromRaw(
                JSON.parse(
                  JSON.stringify(currentTopicValues[0].post.about.blocks)
                )
              )
            )}
          /> */}
        </div>
      )
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
)(LessonContent);
