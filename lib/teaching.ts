import type { Question } from "./content";

/** Displayable coaching text. It describes the answer, never the learner's mind. */
export type TeachingLesson = {
  observation: string;
  correctMeaning: string;
  selectedMeaning: string;
  possibleConfusion: string;
  decisionRules: { when: string; choose: string }[];
  nextStep: string;
};

type ChoiceTeaching = Pick<
  TeachingLesson,
  "selectedMeaning" | "possibleConfusion"
> & { decisionRules?: TeachingLesson["decisionRules"] };

type AuthoredTeaching = Omit<
  TeachingLesson,
  "selectedMeaning" | "possibleConfusion"
> & {
  prompt: string;
  options: string[];
  answer: number;
  wrong: Record<number, ChoiceTeaching>;
};

const mulkiMeaning =
  "Mulki Rules were the older Hyderabad rules for eligibility in government jobs. The 1919 rules included a residence route of at least 15 years, with other conditions. Residence was one route; it was not the only way to qualify as a Mulki.";
const formulaMeaning =
  "The Six-Point Formula of 1973 was a wider arrangement. It covered regional development, education, local recruitment and local cadres, an Administrative Tribunal, and constitutional support. Its sixth point said the new approach would make the old Mulki Rules and Regional Committee unnecessary.";
const agreementMeaning =
  "The Gentlemen’s Agreement of 1956 set out Telangana safeguards at the time of the merger. It also dealt with education and employment, so the exact provision in the question matters.";
const commissionMeaning =
  "The States Reorganisation Commission studied how states should be reorganised. Its work belongs to the reorganisation discussion before the 1956 merger.";

/**
 * Authored against Srikrishna report chapter 1 §1.2.27 (PDF p.77), chapter 5
 * §5.2.01–03 (PDF p.289), and chapter 1's 1956 agreement / SRC account.
 * The 2014 formation date follows the existing separately sourced question.
 * Exact wording checks stop an edited/imported question inheriting an old lesson.
 */
const authored: Record<string, AuthoredTeaching> = {
  "TM-Q001": {
    prompt:
      "Which arrangement proposed that the continuation of the Mulki Rules and the Telangana Regional Committee would become unnecessary?",
    options: [
      "Gentlemen’s Agreement",
      "Six-Point Formula",
      "Mulki Rules",
      "States Reorganisation Commission",
    ],
    answer: 1,
    observation:
      "Notice “continuation ... unnecessary”. The question asks which NEW arrangement would make the OLD rules and committee unnecessary.",
    correctMeaning:
      "The answer is the Six-Point Formula. Its sixth point said that the new approach would make continuing the Mulki Rules and Regional Committee unnecessary. Here, the formula is the arrangement making the change.",
    wrong: {
      0: {
        selectedMeaning: `${agreementMeaning} This question asks about the later 1973 change, not the 1956 safeguards.`,
        possibleConfusion:
          "Both arrangements discuss Telangana safeguards. You may have matched that common topic and missed the words “continuation ... unnecessary”. One answer alone cannot tell us your exact reason.",
      },
      2: {
        selectedMeaning: `${mulkiMeaning} In this question, Mulki Rules are the old rules being changed. They are not the new arrangement making that change.`,
        possibleConfusion:
          "You may have noticed the name “Mulki Rules” and selected it quickly. But the question asks what happens TO those rules. The name in the question is not always the answer.",
      },
      3: {
        selectedMeaning: `${commissionMeaning} The proposal to make these older safeguards unnecessary belongs to the later Six-Point Formula.`,
        possibleConfusion:
          "Reorganisation and safeguards are studied together, so the commission may look related. Here, the action “make the old safeguards unnecessary” gives the more specific clue.",
      },
    },
    decisionRules: [
      {
        when: "Which arrangement made continuation of Mulki Rules and the Regional Committee unnecessary?",
        choose: "Six-Point Formula — point six",
      },
      {
        when: "Which older rules used the historical 15-year residence qualifying route?",
        choose: "Mulki Rules",
      },
      {
        when: "Which agreement gave Telangana safeguards at the 1956 merger?",
        choose: "Gentlemen’s Agreement",
      },
    ],
    nextStep:
      "Say this once: “Mulki Rules are the old rules; the Six-Point Formula is the later arrangement.” Then read who is making the change in the next question.",
  },
  "TM-Q002": {
    prompt:
      "The proposal for a new Central University at Hyderabad belongs to which framework?",
    options: [
      "Mulki Rules",
      "Six-Point Formula",
      "States Reorganisation Commission",
      "Gentlemen’s Agreement",
    ],
    answer: 1,
    observation:
      "Underline “new Central University at Hyderabad”. This is a specific education proposal. “Hyderabad” by itself is not enough to choose the answer.",
    correctMeaning:
      "The correct answer is the Six-Point Formula of 1973. Point two proposed preference for local candidates in education and a new Central University at Hyderabad. The university proposal is the deciding clue here.",
    wrong: {
      0: {
        selectedMeaning: `${mulkiMeaning} They did not contain this new Central University proposal. So Mulki Rules is wrong for this question.`,
        possibleConfusion:
          "You may have connected “Hyderabad” and “local opportunity” with Mulki Rules. Both topics are linked to local opportunity, but their provisions are different. Here, observe “Central University”, not only the place name.",
        decisionRules: [
          {
            when: "A new Central University at Hyderabad was proposed under which formula?",
            choose: "Six-Point Formula — point two",
          },
          {
            when: "Which historical employment rules had a 15-year residence qualifying route?",
            choose: "Mulki Rules",
          },
        ],
      },
      2: {
        selectedMeaning: `${commissionMeaning} It is not the framework containing this specific university proposal.`,
        possibleConfusion:
          "You may have connected the commission with Hyderabad and regional development. Those are broad links. The full phrase “new Central University” identifies point two of the Six-Point Formula.",
        decisionRules: [
          {
            when: "New Central University at Hyderabad: which framework proposed it?",
            choose: "Six-Point Formula",
          },
          {
            when: "Which commission studied the reorganisation of states before the 1956 merger?",
            choose: "States Reorganisation Commission",
          },
        ],
      },
      3: {
        selectedMeaning: `${agreementMeaning} Its education safeguards should not be confused with the specific Central University proposal in the 1973 formula.`,
        possibleConfusion:
          "You may remember that the 1956 agreement also discussed education. That link is reasonable, but “education” is too broad. Read the exact proposal: a NEW Central University at Hyderabad.",
        decisionRules: [
          {
            when: "Which framework proposed a new Central University at Hyderabad?",
            choose: "Six-Point Formula — 1973",
          },
          {
            when: "Which agreement set out Telangana safeguards at the time of the merger?",
            choose: "Gentlemen’s Agreement — 1956",
          },
        ],
      },
    },
    decisionRules: [
      {
        when: "New Central University at Hyderabad proposal",
        choose: "Six-Point Formula — point two",
      },
      {
        when: "Historical 15-year residence route for Mulki eligibility",
        choose: "Mulki Rules",
      },
    ],
    nextStep:
      "Before moving ahead, recall this pair without looking: “Central University proposal → Six-Point Formula; 15-year residence route → Mulki Rules.” Read the whole clue each time.",
  },
  "TM-Q003": {
    prompt:
      "In the historical employment safeguards, a residence qualification of at least 15 years is associated with which rules?",
    options: [
      "Six-Point Formula",
      "Mulki Rules",
      "Andhra Pradesh Reorganisation Act, 2014",
      "Srikrishna Committee’s terms of reference",
    ],
    answer: 1,
    observation:
      "The deciding words are “residence qualification of at least 15 years”. The question asks for the older eligibility rules, not just any arrangement about Telangana.",
    correctMeaning: `${mulkiMeaning} That is why the answer here is Mulki Rules.`,
    wrong: {
      0: {
        selectedMeaning: `${formulaMeaning} Do not attach the older 15-year Mulki residence route to this later formula.`,
        possibleConfusion:
          "Both topics include local employment, so you may have treated their qualifying rules as the same. The exact number “15 years” points to the historical Mulki residence route.",
      },
      2: {
        selectedMeaning:
          "The Andhra Pradesh Reorganisation Act, 2014 concerns the reorganisation of Andhra Pradesh and the formation of Telangana. It is much later than the historical Mulki residence rules asked about here.",
        possibleConfusion:
          "The Telangana connection may have drawn you to the 2014 Act. But this question is about an older employment qualification. First identify the period and the rule being asked.",
      },
      3: {
        selectedMeaning:
          "The Srikrishna Committee’s terms of reference defined what the committee had to examine. Its report explains the older Mulki Rules; the committee did not create that historical residence qualification.",
        possibleConfusion:
          "You may have remembered reading the rule in the Srikrishna report. A report can describe an older rule without being the arrangement that created it.",
      },
    },
    decisionRules: [
      {
        when: "Historical 15-year residence qualifying route for government employment",
        choose: "Mulki Rules",
      },
      {
        when: "1973 local cadres, education, development and tribunal framework",
        choose: "Six-Point Formula",
      },
    ],
    nextStep:
      "Remember “15-year residence route → Mulki”. Also remember that residence was one route with conditions, not the full definition of every Mulki category.",
  },
  "TM-Q004": {
    prompt: "Which of the following was included in the Six-Point Formula?",
    options: [
      "Abolition of every form of local preference",
      "An Administrative Tribunal for service grievances",
      "Permanent continuation of the Regional Committee",
      "Restoration of the old Mulki system without change",
    ],
    answer: 1,
    observation:
      "The question asks what WAS included. Check each claim against a point of the formula. Here, “Administrative Tribunal” matches point four.",
    correctMeaning:
      "The formula proposed an Administrative Tribunal for service grievances, meaning employment-related complaints. It also kept local preference through the new arrangements; changing the old rules did not mean removing every safeguard.",
    wrong: {
      0: {
        selectedMeaning:
          "Your option says ALL local preference was abolished. That is false: the formula included local preference in education and specified direct recruitment. Replacing Mulki Rules did not remove every form of local preference.",
        possibleConfusion:
          "You may have read “old rules replaced” as “all local protection removed”. Those are different claims. Check the word “every” against the formula’s actual provisions.",
      },
      2: {
        selectedMeaning:
          "Your option says the Regional Committee would continue permanently. Point six says the new approach would make continuing the old committee unnecessary. The option reverses that direction.",
        possibleConfusion:
          "The committee was an earlier safeguard, so it may have seemed natural that a later settlement would keep it. Here, check whether the formula says “continue” or “become unnecessary”.",
      },
      3: {
        selectedMeaning:
          "Your option says the old Mulki system would return without any change. The formula proposed a different arrangement and said the old rules would become unnecessary. So this claim is wrong.",
        possibleConfusion:
          "You may have connected protecting local people with restoring the exact old rules. A similar purpose does not mean the same rules continued unchanged.",
      },
    },
    decisionRules: [
      {
        when: "Which formula proposed an Administrative Tribunal for service grievances?",
        choose: "Six-Point Formula — point four",
      },
      {
        when: "Did the formula keep the old Mulki Rules and Regional Committee permanently?",
        choose:
          "No — point six said the new approach would make them unnecessary",
      },
    ],
    nextStep:
      "Name one real provision before choosing: “Administrative Tribunal — point four.” Treat words like “every” and “permanent” as claims to verify, not automatic reasons to reject an option.",
  },
  "TM-Q005": {
    prompt: "Which sequence correctly places these arrangements in time?",
    options: [
      "Six-Point Formula → Gentlemen’s Agreement → Telangana state formation",
      "Gentlemen’s Agreement → Six-Point Formula → Telangana state formation",
      "Telangana state formation → Six-Point Formula → Gentlemen’s Agreement",
      "Gentlemen’s Agreement → Telangana state formation → Six-Point Formula",
    ],
    answer: 1,
    observation:
      "This is an order question. Put a year beside each event before comparing the options: agreement 1956, formula 1973, Telangana formation 2014.",
    correctMeaning:
      "The correct order is Gentlemen’s Agreement (1956) → Six-Point Formula (1973) → Telangana state formation (2 June 2014). The merger safeguards came first, the later formula next, and state formation last.",
    wrong: {
      0: {
        selectedMeaning:
          "Your sequence puts the Six-Point Formula before the Gentlemen’s Agreement. Only that first pair is reversed: 1956 comes before 1973. You placed Telangana formation last correctly.",
        possibleConfusion:
          "Both are safeguards, so their names may be familiar even if their years are mixed up. Check the 1956-versus-1973 pair rather than relearning the whole sequence.",
      },
      2: {
        selectedMeaning:
          "Your sequence runs backwards: 2014 → 1973 → 1956. All three events are relevant, but the question needs the earliest event first.",
        possibleConfusion:
          "You may have started with the most recent event you remember. Check the required direction: here the intended timeline runs from earlier to later.",
      },
      3: {
        selectedMeaning:
          "You correctly placed the 1956 agreement first, but put Telangana formation before the formula. The formula was in 1973; Telangana state formation was in 2014.",
        possibleConfusion:
          "The formula may sound like an arrangement made after Telangana became a state. It belongs to 1973, during the earlier united Andhra Pradesh period.",
      },
    },
    decisionRules: [
      {
        when: "Earliest to latest among these three events",
        choose: "1956 agreement → 1973 formula → 2014 formation",
      },
      {
        when: "Latest to earliest among these same events",
        choose: "2014 formation → 1973 formula → 1956 agreement",
      },
    ],
    nextStep:
      "Write or say “1956, 1973, 2014” once. Then attach the three event names to those years without looking at the options.",
  },
  "TM-Q006": {
    prompt:
      "Consider two statements about the Six-Point Formula. I. It proposed preference for local candidates in education. II. It proposed keeping the Mulki Rules permanently unchanged. Which is correct?",
    options: ["I only", "II only", "Both I and II", "Neither I nor II"],
    answer: 0,
    observation:
      "Read the two statements separately. I says “local preference in education”. II says “Mulki Rules permanently unchanged”. They make different claims.",
    correctMeaning:
      "I is true because point two included local educational preference. II is false because point six said the new approach would make continuing Mulki Rules unnecessary. True + false means “I only”.",
    wrong: {
      1: {
        selectedMeaning:
          "“II only” means you accept permanent continuation of Mulki Rules and reject local educational preference. Both parts of that choice go against the formula: I is true and II is false.",
        possibleConfusion:
          "You may have linked all local safeguards to the old Mulki system and missed the separate education provision. Check point two for I and point six for II.",
      },
      2: {
        selectedMeaning:
          "“Both I and II” gets statement I right but also accepts statement II. II is false. The formula supported local opportunity through new arrangements; it did not keep the old Mulki Rules permanently unchanged.",
        possibleConfusion:
          "A familiar first statement may have made the whole option look correct. After confirming I, pause and test “permanently unchanged” in II on its own.",
      },
      3: {
        selectedMeaning:
          "“Neither I nor II” correctly rejects II, but also rejects I. I is supported by point two. One false statement does not make the other statement false.",
        possibleConfusion:
          "You may have spotted the false Mulki claim and rejected the pair together. Keep two separate decisions: I true; II false.",
      },
    },
    decisionRules: [
      { when: "I is true and II is false", choose: "I only" },
      { when: "I is false and II is true", choose: "II only" },
      {
        when: "Both statements are individually true",
        choose: "Both I and II",
      },
      {
        when: "Both statements are individually false",
        choose: "Neither I nor II",
      },
    ],
    nextStep:
      "Before selecting a combined option, mark I as true or false, then mark II. For this question say: “Education preference — true; Mulki permanently unchanged — false.”",
  },
  "TM-Q007": {
    prompt: "Which was NOT a proposal of the Six-Point Formula?",
    options: [
      "A Planning Board and subcommittees for backward areas",
      "Preference for local candidates in direct recruitment",
      "Permanent retention of the Mulki Rules",
      "Constitutional changes to support the arrangement",
    ],
    answer: 2,
    observation:
      "First notice “NOT”. You need the statement that was NOT in the formula. A true provision is a wrong answer to this particular question.",
    correctMeaning:
      "Choose “Permanent retention of the Mulki Rules”. Point six said the new approach would make continuing those rules unnecessary. Permanent retention contradicts the formula, so it answers NOT.",
    wrong: {
      0: {
        selectedMeaning:
          "A Planning Board and subcommittees for backward areas WERE included in point one. You picked a real provision, but this question asks for the exception.",
        possibleConfusion:
          "You may have recognised a correct fact and selected it before checking “NOT”. The fact is right; it does not fit the task in this question.",
        decisionRules: [
          {
            when: "Which proposal belongs to point one?",
            choose: "Planning Board and subcommittees for backward areas",
          },
          {
            when: "Which of these four proposals was NOT included?",
            choose: "Permanent retention of the Mulki Rules",
          },
        ],
      },
      1: {
        selectedMeaning:
          "Specified local preference in direct recruitment WAS included in point three. It therefore cannot be the exception asked for here.",
        possibleConfusion:
          "You may have thought replacing Mulki Rules meant ending local recruitment preference. The formula changed the arrangement and still included local preference. Also check the word “NOT”.",
        decisionRules: [
          {
            when: "Which point covered local preference in specified direct recruitment and local cadres?",
            choose: "Point three of the Six-Point Formula",
          },
          {
            when: "Which of these four proposals was NOT included?",
            choose: "Permanent retention of the Mulki Rules",
          },
        ],
      },
      3: {
        selectedMeaning:
          "Constitutional changes to support the arrangement WERE part of point five. This is a real provision, so it is not the answer to NOT.",
        possibleConfusion:
          "Constitutional changes may have sounded separate from the formula. But point five specifically provided for constitutional support. Check each point before choosing the exception.",
        decisionRules: [
          {
            when: "Which point sought constitutional support for the arrangement?",
            choose: "Point five of the Six-Point Formula",
          },
          {
            when: "Which of these four proposals was NOT included?",
            choose: "Permanent retention of the Mulki Rules",
          },
        ],
      },
    },
    decisionRules: [
      {
        when: "Which was NOT a proposal, among these options?",
        choose: "Permanent retention of the Mulki Rules",
      },
      {
        when: "What did point six say about continuing the old rules?",
        choose: "The new approach would make their continuation unnecessary",
      },
    ],
    nextStep:
      "Before your next question, read the task word first: included, NOT, correct, or incorrect. Then check the facts. Do not rely on the task word alone.",
  },
  "TM-Q008": {
    prompt:
      "A question mentions local cadres, regional development and an Administrative Tribunal together. Which framework best fits these clues?",
    options: [
      "Mulki Rules",
      "Six-Point Formula",
      "States Reorganisation Commission",
      "Gentlemen’s Agreement",
    ],
    answer: 1,
    observation:
      "Use ALL three clues: “local cadres”, “regional development”, and “Administrative Tribunal”. Do not stop after seeing the employment clue.",
    correctMeaning:
      "The Six-Point Formula fits the whole group: development in point one, local recruitment and cadres in point three, and an Administrative Tribunal in point four.",
    wrong: {
      0: {
        selectedMeaning: `${mulkiMeaning} That employment link alone does not explain the development-and-tribunal combination here.`,
        possibleConfusion:
          "“Local” and “employment” may have reminded you of Mulki Rules. Now check the remaining clue: an Administrative Tribunal. The answer must fit every clue, not just one.",
      },
      2: {
        selectedMeaning: `${commissionMeaning} It does not match this group of provisions from the 1973 formula.`,
        possibleConfusion:
          "“Regional development” may have drawn you towards state reorganisation. Add the other two clues before deciding; the tribunal and local-cadre provisions narrow the answer.",
      },
      3: {
        selectedMeaning: `${agreementMeaning} This particular combination of local cadres, development and a tribunal identifies the later Six-Point Formula.`,
        possibleConfusion:
          "Both settlements deal with regional opportunity, so the general theme may have looked enough. Here, the specific set of provisions is needed, especially the tribunal.",
      },
    },
    decisionRules: [
      {
        when: "Local cadres + regional development + Administrative Tribunal",
        choose: "Six-Point Formula",
      },
      {
        when: "Historical 15-year residence route for local employment eligibility",
        choose: "Mulki Rules",
      },
      {
        when: "Telangana safeguards agreed at the 1956 merger",
        choose: "Gentlemen’s Agreement",
      },
    ],
    nextStep:
      "Check your chosen answer against each clue one by one. If it explains only employment but not the tribunal, check the other options.",
  },
  "TM-Q009": {
    prompt:
      "An arrangement sought to protect regional opportunity through a new framework, making older residence rules and a regional committee redundant. What is being described?",
    options: [
      "Continuation of the original Mulki Rules",
      "The Six-Point Formula",
      "Creation of the States Reorganisation Commission",
      "Formation of Telangana in 2014",
    ],
    answer: 1,
    observation:
      "Read “new framework” and “making older ... redundant” together. Redundant here means no longer needed. The question describes a later arrangement replacing the role of older safeguards.",
    correctMeaning:
      "This describes the Six-Point Formula of 1973. Its sixth point said that the new approach would make continuing the Mulki Rules and Regional Committee unnecessary. The wording changed, but the relationship is the same.",
    wrong: {
      0: {
        selectedMeaning:
          "“Continuation of the original Mulki Rules” means the old rules stay in use. The question says the new arrangement makes them unnecessary. Your option gives the opposite relationship.",
        possibleConfusion:
          "“Older residence rules” may have helped you recognise Mulki Rules. That recognition is useful, but those rules are what the question says will become unnecessary. They are not the new arrangement being asked for.",
      },
      2: {
        selectedMeaning: `${commissionMeaning} The question does not describe setting up that commission. It describes the later replacement of older safeguards.`,
        possibleConfusion:
          "You may have connected “regional” and “new framework” with reorganisation. The deciding part is what happens to the residence rules and Regional Committee.",
      },
      3: {
        selectedMeaning:
          "Telangana state formation took place in 2014. This description is about the Six-Point Formula of 1973, not the creation of Telangana as a separate state.",
        possibleConfusion:
          "“New framework” may have sounded like a new state. But the question names older rules and a committee becoming unnecessary; it does not describe state formation.",
      },
    },
    decisionRules: [
      {
        when: "A new approach makes Mulki Rules and the Regional Committee unnecessary",
        choose: "Six-Point Formula — 1973",
      },
      {
        when: "When did Telangana become a separate state?",
        choose: "2 June 2014",
      },
    ],
    nextStep:
      "Replace unfamiliar wording with simple words first: “redundant” means “no longer needed”. Then ask which arrangement brought that change.",
  },
  "TM-Q010": {
    prompt:
      "After a break, recall the key distinction. Which statement correctly compares the Mulki Rules and the Six-Point Formula?",
    options: [
      "They are two names for exactly the same rules",
      "The earlier Mulki safeguards and the later Six-Point Formula used different frameworks for regional opportunity",
      "The Six-Point Formula introduced the original Mulki Rules",
      "The Six-Point Formula concerned education only",
    ],
    answer: 1,
    observation:
      "Check two things: which arrangement came earlier, and how wide each arrangement was. A shared concern for local opportunity does not make them the same rules.",
    correctMeaning:
      "Mulki Rules were the earlier employment eligibility safeguards. The Six-Point Formula came later, in 1973, and covered development, education, recruitment, a tribunal and constitutional support. It proposed a different approach that would make the old rules unnecessary.",
    wrong: {
      0: {
        selectedMeaning:
          "“Exactly the same rules” treats two different arrangements as identical. Mulki Rules concern the older employment eligibility system. The later formula has several provisions and a different approach.",
        possibleConfusion:
          "Both are linked to local opportunity, so the common purpose may have hidden their differences. Compare their provisions and periods, not only their broad aim.",
      },
      2: {
        selectedMeaning:
          "This claim reverses the order. Mulki Rules existed much earlier, including the 1919 rules described in the report. The 1973 formula did not introduce the original Mulki Rules; it proposed an approach that would make continuing them unnecessary.",
        possibleConfusion:
          "You may remember the names together but have reversed who came first. Fix the direction: older Mulki Rules → later Six-Point Formula.",
      },
      3: {
        selectedMeaning:
          "Education was one part of the formula, including the Central University proposal. “Education only” is wrong because the formula also dealt with development, local recruitment, a tribunal and constitutional support.",
        possibleConfusion:
          "The university example may be easier to remember than the other points. A memorable example is one part of the framework, not its full scope.",
      },
    },
    decisionRules: [
      {
        when: "Older rules with a historical residence route for employment eligibility",
        choose: "Mulki Rules",
      },
      {
        when: "Later framework covering development, education, local cadres and tribunal",
        choose: "Six-Point Formula",
      },
      {
        when: "Are these two names for exactly the same arrangement?",
        choose:
          "No — they have different provisions and belong to different periods",
      },
    ],
    nextStep:
      "Close the explanation and recall one clue for each: Mulki → older residence eligibility; Six-Point Formula → wider 1973 arrangement. Try again after a break.",
  },
};

function matchesAuthored(
  question: Question,
  lesson: AuthoredTeaching,
): boolean {
  return (
    lesson.prompt === question.prompt &&
    lesson.answer === question.answer &&
    lesson.options.length === question.options.length &&
    lesson.options.every((text, i) => question.options[i].text === text)
  );
}

/** Import/review workflows can reject content that only has a fallback lesson. */
export function hasAuthoredTeaching(question: Question): boolean {
  const lesson = authored[question.id];
  return !!lesson && matchesAuthored(question, lesson);
}

export function getTeaching(
  question: Question,
  selected: number,
): TeachingLesson {
  if (
    !Number.isInteger(selected) ||
    selected < 0 ||
    selected >= question.options.length ||
    !Number.isInteger(question.answer) ||
    !question.options[question.answer]
  ) {
    throw new RangeError(
      "Teaching needs a valid selected option and answer key.",
    );
  }

  const correct = selected === question.answer;
  const authoredLesson = authored[question.id];
  if (authoredLesson && matchesAuthored(question, authoredLesson)) {
    const choice = authoredLesson.wrong[selected];
    return {
      observation: authoredLesson.observation,
      correctMeaning: authoredLesson.correctMeaning,
      selectedMeaning: correct
        ? `You chose the correct option. ${question.options[selected].why}`
        : choice.selectedMeaning,
      possibleConfusion: correct
        ? "Your answer is correct here. One correct answer does not tell us whether the distinction will stay clear after a break; use the two question patterns below to check it."
        : choice.possibleConfusion,
      decisionRules: (
        choice?.decisionRules ?? authoredLesson.decisionRules
      ).map((rule) => ({ ...rule })),
      nextStep: authoredLesson.nextStep,
    };
  }

  // Unreviewed future content gets only information present in that question.
  // This is a safe display fallback, not an authored-publication approval.
  const selectedOption = question.options[selected];
  return {
    observation: question.clue,
    correctMeaning: question.reason,
    selectedMeaning: correct
      ? `You chose the correct option. ${selectedOption.why}`
      : selectedOption.why,
    possibleConfusion: correct
      ? "This answer is correct. Check the clue once more before moving ahead."
      : `One possible reason this option looked suitable: ${selectedOption.attraction} This is a possibility, not a conclusion about your thinking.`,
    decisionRules: [
      { when: question.prompt, choose: question.options[question.answer].text },
    ],
    nextStep: `Read the clue again, then explain the difference in your own words. ${question.anchor}`,
  };
}
