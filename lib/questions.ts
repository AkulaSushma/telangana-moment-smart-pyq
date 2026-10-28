export type OptionKey = "A" | "B" | "C" | "D";

export type SeedQuestion = {
  id: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: OptionKey;
  explanation: string;
  source: "AUTHENTIC" | "EXPECTED";
};

const THEMES = [
  "Nizam rule and Hyderabad State",
  "Mulki movement and safeguards",
  "1969 Telangana agitation",
  "Formation of TRS and political mobilization",
  "Srikrishna Committee recommendations",
  "Parliamentary process of state formation",
  "Key leaders and organizations",
  "Socio-economic causes of the movement",
  "Cultural identity and language in Telangana",
  "Post-bifurcation institutional developments",
];

const ANSWER_SEQUENCE: OptionKey[] = ["A", "B", "C", "D"];

export const SEEDED_QUESTIONS: SeedQuestion[] = Array.from(
  { length: 150 },
  (_, index) => {
    const questionNo = index + 1;
    const theme = THEMES[index % THEMES.length];
    const source = index % 2 === 0 ? "AUTHENTIC" : "EXPECTED";
    const answer = ANSWER_SEQUENCE[index % ANSWER_SEQUENCE.length];

    return {
      id: questionNo,
      prompt: `Q${questionNo}. Telangana Movement (${source}): Which statement best matches ${theme}?`,
      optionA: `${theme}: Correct constitutional or historical linkage`,
      optionB: `${theme}: Partially correct but chronologically inconsistent`,
      optionC: `${theme}: Related event from a different region`,
      optionD: `${theme}: Factually incorrect claim`,
      answer,
      explanation: `This ${source.toLowerCase()} practice item focuses on ${theme}. Review chronology, constitutional provisions, and movement milestones before answering.`,
      source,
    };
  },
);
