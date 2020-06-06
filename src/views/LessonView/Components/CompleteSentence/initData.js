export const content = [
  {
    answer: "merge",
    id: 0,
    sentence: "We can {merge} our two small businesses into a bigger one.",
  },
  {
    answer: "overlook",
    id: 1,
    sentence: "It’s easy to {overlook} a small detail like this one.",
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
    sentence: "We’ve always admired him for his {tenacity} and dedication.",
  },
];

export const initData = {
  tasks: {
    merge: {
      answer: "merge",
      id: 0,
      sentence: "We can {merge} our two small businesses into a bigger one.",
    },
    overlook: {
      answer: "overlook",
      id: 1,
      sentence: "It’s easy to {overlook} a small detail like this one.",
    },

    daredevil: {
      answer: "daredevil",
      id: 3,
      sentence:
        "She’s a bit of a {daredevil}. She loves climbing buildings and mountains.",
    },
    defy: {
      answer: "defy",
      id: 4,
      sentence: "Importing food that we can grow here {defy} common sense.",
    },
    antsy: {
      answer: "antsy",
      id: 5,
      sentence: "I feel {antsy} today, I don’t know why.",
    },
    tenacity: {
      answer: "tenacity",
      id: 6,
      sentence: "We’ve always admired him for his {tenacity} and dedication.",
    },

    "set out": {
      answer: "set out",
      id: 7,
      id2: "71",
      sentence: "{Set} me {out}",
    },

    car: {
      answer: "car",
      id: 8,
      sentence: "She loves the best {car} ever.",
    },
    // answer: " set   off "
    // answer: " set  out "
    // sentence: "we  {set} bomb {off}"
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Sentences",
      taskIds: [
        "merge",
        "overlook",
        "daredevil",
        "defy",
        "antsy",
        "tenacity",
        "set out",
        //  "out",
        "car",
      ],
    },

    "answer-1": {
      id: "answer-1",
      taskIds: [],
      isCorrect: false,
    },
    "answer-2": {
      id: "answer-2",
      taskIds: [],
      isCorrect: false,
    },
    "answer-3": {
      id: "answer-3",
      taskIds: [],
      isCorrect: false,
    },
    "answer-4": {
      id: "answer-4",
      taskIds: [],
      isCorrect: false,
    },
    "answer-5": {
      id: "answer-5",
      taskIds: [],
      isCorrect: false,
    },
    "answer-6": {
      id: "answer-6",
      taskIds: [],
      isCorrect: false,
    },
    "answer-7": {
      id: "answer-7",
      taskIds: [],
      isCorrect: false,
    },
    // "answer-71": {
    //   id: "answer-71",
    //   taskIds: [],
    //   isCorrect: false,
    // },
    "answer-8": {
      id: "answer-8",
      taskIds: [],
      isCorrect: false,
    },
  },
  // columnOrder: ["column-1", "column-2"],
};

export const initColumns = {
  "answer-1": {
    id: "answer-1",
    taskIds: [],
    isCorrect: false,
  },
  "answer-2": {
    id: "answer-2",
    taskIds: [],
    isCorrect: false,
  },
  "answer-3": {
    id: "answer-3",
    taskIds: [],
    isCorrect: false,
  },
  "answer-4": {
    id: "answer-4",
    taskIds: [],
    isCorrect: false,
  },
  "answer-5": {
    id: "answer-5",
    taskIds: [],
    isCorrect: false,
  },
  "answer-6": {
    id: "answer-6",
    taskIds: [],
    isCorrect: false,
  },
  "answer-7": {
    id: "answer-7",
    taskIds: [],
    isCorrect: false,
  },
  "answer-8": {
    id: "answer-8",
    taskIds: [],
    isCorrect: false,
  },
};

export const correctValues = [
  "merge",
  "overlook",
  "daredevil",
  "defy",
  "antsy",
  "tenacity",
  "set out",
  "car",
];
