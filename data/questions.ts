export type Choice = {
  label: string;
  detail: string;
  symbol: string;
};

export type Question = {
  prompt: string;
  choices: [Choice, Choice];
  normalChoice: 0 | 1;
  agreement: number;
};

export const questions: Question[] = [
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Pineapple on pizza", detail: "Sweet, salty, controversial.", symbol: "🍍" },
      { label: "Ketchup on pizza", detail: "One sauce was not enough.", symbol: "🍅" },
    ],
    normalChoice: 0,
    agreement: 68,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Showering in the morning", detail: "A fresh start to the day.", symbol: "☀️" },
      { label: "Showering at night", detail: "Going to bed freshly clean.", symbol: "🌙" },
    ],
    normalChoice: 1,
    agreement: 56,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Dark mode everywhere", detail: "Easy on the eyes.", symbol: "🌚" },
      { label: "Light mode at midnight", detail: "Maximum brightness, naturally.", symbol: "💡" },
    ],
    normalChoice: 0,
    agreement: 79,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Sleeping with socks", detail: "Toasty feet all night.", symbol: "🧦" },
      { label: "Sleeping in jeans", detail: "Ready for anything.", symbol: "👖" },
    ],
    normalChoice: 0,
    agreement: 71,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "100 browser tabs", detail: "Every one has a purpose.", symbol: "🗂️" },
      { label: "One browser tab", detail: "A startling level of focus.", symbol: "🧘" },
    ],
    normalChoice: 0,
    agreement: 63,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Making the bed daily", detail: "A small win before breakfast.", symbol: "🛏️" },
      { label: "Leaving it as it is", detail: "You will be back there later.", symbol: "😴" },
    ],
    normalChoice: 0,
    agreement: 54,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Eating pizza with your hands", detail: "The classic approach.", symbol: "🍕" },
      { label: "Eating pizza with knife and fork", detail: "Precision pizza handling.", symbol: "🍴" },
    ],
    normalChoice: 0,
    agreement: 83,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Phone on 1% battery", detail: "There is still time.", symbol: "🔋" },
      { label: "Charging at 50%", detail: "Prepared, not worried.", symbol: "⚡" },
    ],
    normalChoice: 0,
    agreement: 58,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Replying instantly", detail: "You saw it. You answered it.", symbol: "💬" },
      { label: "Replying three days later", detail: "You were crafting the perfect reply.", symbol: "📅" },
    ],
    normalChoice: 0,
    agreement: 66,
  },
  {
    prompt: "Which is more normal?",
    choices: [
      { label: "Files named final_final_v2", detail: "This one is definitely final.", symbol: "📁" },
      { label: "Files named by date", detail: "A surprisingly organised person.", symbol: "🗓️" },
    ],
    normalChoice: 0,
    agreement: 76,
  },
];
