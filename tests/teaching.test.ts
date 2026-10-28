import { test } from "node:test";
import assert from "node:assert/strict";
import { questions } from "../lib/content";
import { getTeaching, hasAuthoredTeaching } from "../lib/teaching";

const getQuestion = (id: string) => questions.find((q) => q.id === id)!;

test("every published starter question has authored guidance for every wrong choice", () => {
  let wrongChoices = 0;
  for (const question of questions) {
    assert.ok(
      hasAuthoredTeaching(question),
      `${question.id} lacks authored teaching`,
    );
    const choiceExplanations = new Set<string>();
    for (let selected = 0; selected < question.options.length; selected++) {
      if (selected === question.answer) continue;
      const lesson = getTeaching(question, selected);
      wrongChoices++;
      for (const key of [
        "observation",
        "correctMeaning",
        "selectedMeaning",
        "possibleConfusion",
        "nextStep",
      ] as const) {
        assert.ok(
          lesson[key].length > 35,
          `${question.id}/${selected} lacks ${key}`,
        );
      }
      assert.ok(
        lesson.decisionRules.length >= 2,
        `${question.id}/${selected} lacks question-pattern contrasts`,
      );
      assert.match(lesson.possibleConfusion, /may|might|possible/i);
      assert.doesNotMatch(
        lesson.possibleConfusion,
        /you (?:were careless|are confused|did not understand|were not concentrating)/i,
      );
      choiceExplanations.add(lesson.selectedMeaning);
      assert.deepEqual(JSON.parse(JSON.stringify(lesson)), lesson);
    }
    assert.equal(
      choiceExplanations.size,
      question.options.length - 1,
      `${question.id} repeats a generic explanation`,
    );
  }
  assert.equal(wrongChoices, 30);
});

test("university versus Mulki teaches the precise provision and the two different question cues", () => {
  const lesson = getTeaching(getQuestion("TM-Q002"), 0);
  assert.match(lesson.observation, /new Central University at Hyderabad/);
  assert.match(lesson.correctMeaning, /Six-Point Formula of 1973/);
  assert.match(lesson.correctMeaning, /Point two/);
  assert.match(lesson.selectedMeaning, /1919/);
  assert.match(lesson.selectedMeaning, /government jobs/);
  assert.match(lesson.selectedMeaning, /15 years/);
  assert.match(lesson.selectedMeaning, /one route/);
  assert.match(lesson.selectedMeaning, /Mulki Rules is wrong/);
  assert.equal(lesson.decisionRules[0].choose, "Six-Point Formula — point two");
  assert.equal(lesson.decisionRules[1].choose, "Mulki Rules");
});

test("statement choices explain individual truth values, rather than inventing concepts", () => {
  const q = getQuestion("TM-Q006");
  assert.match(getTeaching(q, 1).selectedMeaning, /I is true and II is false/);
  assert.match(getTeaching(q, 2).selectedMeaning, /gets statement I right/);
  assert.match(getTeaching(q, 3).selectedMeaning, /correctly rejects II/);
  assert.match(
    getTeaching(q, 3).correctMeaning,
    /True \+ false means “I only”/,
  );
});

test("chronology repair distinguishes the actual wrong pair from a fully reversed order", () => {
  const q = getQuestion("TM-Q005");
  assert.match(getTeaching(q, 0).selectedMeaning, /first pair is reversed/);
  assert.match(getTeaching(q, 0).selectedMeaning, /formation last correctly/);
  assert.match(getTeaching(q, 2).selectedMeaning, /2014 → 1973 → 1956/);
  assert.match(
    getTeaching(q, 3).selectedMeaning,
    /correctly placed the 1956 agreement first/,
  );
});

test("negative wording preserves the historical truth of a selected true provision", () => {
  const q = getQuestion("TM-Q007");
  const planning = getTeaching(q, 0);
  const employment = getTeaching(q, 1);
  const constitution = getTeaching(q, 3);
  assert.match(planning.selectedMeaning, /WERE included in point one/);
  assert.match(employment.selectedMeaning, /WAS included in point three/);
  assert.match(constitution.selectedMeaning, /WERE part of point five/);
  assert.match(planning.correctMeaning, /Permanent retention/);
  assert.match(employment.observation, /NOT/);
});

test("correct choices receive reinforcement, not an incorrect-answer diagnosis", () => {
  for (const q of questions) {
    const lesson = getTeaching(q, q.answer);
    assert.match(lesson.selectedMeaning, /You chose the correct option/);
    assert.match(lesson.possibleConfusion, /Your answer is correct here/);
  }
});

test("an edited or reordered question cannot silently inherit the old authored lesson", () => {
  const q = getQuestion("TM-Q002");
  const changed = {
    ...q,
    prompt: "A different question",
    clue: "New exact clue",
    reason: "New reviewed reason",
  };
  assert.equal(hasAuthoredTeaching(changed), false);
  assert.equal(getTeaching(changed, 0).observation, changed.clue);
  assert.equal(getTeaching(changed, 0).correctMeaning, changed.reason);
  const reordered = {
    ...q,
    options: [q.options[1], q.options[0], ...q.options.slice(2)],
    answer: 0,
  };
  assert.equal(hasAuthoredTeaching(reordered), false);
  assert.equal(
    getTeaching(reordered, 1).decisionRules[0].choose,
    "Six-Point Formula",
  );
});

test("invalid selections are rejected and one caller cannot mutate another lesson", () => {
  const q = getQuestion("TM-Q002");
  for (const value of [-1, 4, 0.5, Number.NaN]) {
    assert.throws(() => getTeaching(q, value), RangeError);
  }
  const first = getTeaching(q, 0);
  first.decisionRules[0].choose = "Changed by caller";
  assert.equal(
    getTeaching(q, 0).decisionRules[0].choose,
    "Six-Point Formula — point two",
  );
});
