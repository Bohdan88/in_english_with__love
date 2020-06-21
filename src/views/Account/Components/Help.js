import React, { useState } from "react";
import { Segment, Accordion, Icon, Header } from "semantic-ui-react";

const HELP_ACCORDION = [
  {
    title: " What is a dog?",
    description:
      " A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.",
  },
  {
    title: " What is a dog?",
    description:
      " A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.",
  },
  {
    title: " What is a dog?",
    description:
      " A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.",
  },
];

const Help = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <Segment>
      <Header as="h3" textAlign="center">
        Help topics
      </Header>
      <Accordion>
        {HELP_ACCORDION.map((obj, key) => {
          return (
            <React.Fragment key={key}>
              <Accordion.Title
                active={activeIndex === key}
                index={key}
                onClick={() => setActiveIndex(key === activeIndex ? -1 : key)}
              >
                <Icon name="dropdown" />
                {obj.title}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === key}>
                <p>{obj.description}</p>
              </Accordion.Content>
            </React.Fragment>
          );
        })}
      </Accordion>
    </Segment>
  );
};

export default Help;
