export const matchExercise = {
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
};

export const initData = {
  tasks: {
    c: {
      contentId: "It is death-defying",
      contentLetter: "c) It’s very dangerous.",
      id: "c",
      answer: "0",
    },
    e: {
      contentId: "What we do is life-affirming",
      contentLetter:
        "e) What we do shows that we support and believe strongly in life.",
      id: "e",
      answer: "1",
    },
    d: {
      contentId: "The dance activates those spaces",
      contentLetter: "d) The dance makes those places alive and active.",
      id: "d",
      answer: "2",
    },
    a: {
      contentId: "It made sense to me.",
      contentLetter: "a) It felt right to me.",
      id: "a",
      answer: "3",
    },
    b: {
      contentId: "5. My goal is to achieve the state of non-thinking",
      contentLetter: "b) I want to feel completely present and in the moment.",
      id: "b",
      answer: "4",
    },
  },
  column: {
    id: "column",
    title: "Sentences",
    taskIds: ["a", "b", "c", "d", "e"],
  },
};
