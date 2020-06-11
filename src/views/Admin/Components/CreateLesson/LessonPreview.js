import React, { useState } from "react";
import {
  Popup,
  Button,
  Segment,
  Header,
  Transition,
  Card,
  Icon,
  Image,
} from "semantic-ui-react";
import LessonView from "../../../LessonView";
import { CREATE_LESSON_STAGES } from "../../../../constants/shared";

import defaultPicture from "../../../../assets/images/default.png";
import { convertMillisecondsToDate } from "../../../../utils";

const PreviewComponentBuilder = ({
  title,
  viewState,
  toggleView,
  component,
}) => {
  return (
    <Segment className={`container-exercises-builders`} secondary>
      <div className="container-exercise-builder">
        <div className="container-exercise-top">
          <Header className="header-init-exercises" as="h2">
            {title}
          </Header>
          <div className="button-group-exercise-top">
            <Popup
              inverted
              className="popup-init-exercises"
              position="top center"
              content={viewState ? "Hide content." : "Show content."}
              trigger={
                <Button
                  color="brown"
                  className="button-toggle-exercise-view"
                  icon={viewState ? "eye slash" : "eye"}
                  onClick={() => toggleView(!viewState)}
                />
              }
            />
            <Popup
              basic
              inverted
              className="popup-init-exercises"
              content="Please note you're able just to preview your current progress."
              trigger={<Button icon="circle question" />}
            />
          </div>
        </div>
        <Transition
          visible={viewState}
          animation="fade"
          duration={500}
          transitionOnMount={true}
          unmountOnHide={true}
        >
          {component}
        </Transition>
      </div>
    </Segment>
  );
};

const LessonPreview = ({ sectionKey, iconSrc, title, focus }) => {
  const [cardView, toggleCardView] = useState(true);
  const [lessonView, toggleLessonView] = useState(true);
  console.log(iconSrc, "iconSrc");
  return (
    <div>
      <PreviewComponentBuilder
        title={"Card View"}
        viewState={cardView}
        toggleView={toggleCardView}
        component={
          <Card  className="card-preview-container">
            <Icon className="card-topic-arrow" name="arrow right" />
            <Card.Content className="card-content-topic">
              <Card.Content className="card-content-image">
                <Image
                  className="card-topic-image"
                  src={iconSrc !== "" ? iconSrc : defaultPicture}
                  alt={"Card Preview"}
                  floated="left"
                  size="mini"
                />
              </Card.Content>
              <Card.Content className="topic-list-card-container">
                <Card.Header as="h3" className="topic-list-card-header">
                  {title}
                </Card.Header>

                <Card.Description
                  className="card-selected-topic-description"
                  textAlign="right"
                >
                  <span className="selected-topic-focus">{focus}</span>
                </Card.Description>

                <Card.Meta textAlign="left" className="card-topic-meta">
                  <div>
                    <span className="card-lessons-length">
                      {convertMillisecondsToDate(new Date().getTime())}
                    </span>
                  </div>
                  <div className="card-meta-time">
                    <Icon className="topic-list-icon-circle" name="circle" />
                    <span className="card-lessons-length">10 mintues</span>
                    <Icon
                      className="topic-list-icon-start"
                      name="star"
                      size="small"
                      fitted
                    />
                  </div>
                </Card.Meta>
              </Card.Content>
            </Card.Content>
          </Card>
        }
      />
      <PreviewComponentBuilder
        title={"Lesson View"}
        viewState={lessonView}
        toggleView={toggleLessonView}
        component={
          <LessonView
            mode={CREATE_LESSON_STAGES.preview}
            sectionKey={sectionKey}
          />
        }
      />
    </div>
  );
};

export default LessonPreview;
