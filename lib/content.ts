export type Model =
  | "Recognition"
  | "Provision identification"
  | "Chronology"
  | "Statements"
  | "Negative wording"
  | "Changed wording";
export type Option = {
  text: string;
  why: string;
  attraction: string;
  confusion?: boolean;
};
export type Question = {
  id: string;
  topic: string;
  concept: string;
  model: Model;
  modelId: string;
  stage: "recognition" | "practice" | "rewording" | "recall";
  prompt: string;
  options: Option[];
  answer: number;
  reason: string;
  clue: string;
  trap: string;
  elimination: string;
  anchor: string;
  hint: string;
  source: string;
  page: number;
  sourceStatus:
    | "GENERATED PRACTICE QUESTION"
    | "VERIFIED PYQ"
    | "VERIFIED QUESTION TEXT — KEY UNVERIFIED"
    | "PARTIALLY VERIFIED QUESTION"
    | "MEMORY-BASED QUESTION"
    | "EXPECTED PRACTICE QUESTION";
  teaching?: import("./teaching").TeachingLesson[];
  difficulty: number;
  relevance: number;
};
export const sourceUrl =
  "https://www.mha.gov.in/sites/default/files/CCSAP-REPORT-060111.pdf";
export const syllabusUrl =
  "https://tslprbpartone.s3.ap-south-1.amazonaws.com/SI%28Civil%292022_Notification_25-4-2022.pdf";
const opt = (
  text: string,
  why: string,
  attraction: string,
  confusion = false,
): Option => ({ text, why, attraction, confusion });
const base = {
  topic: "TM-02.01",
  concept: "TM-02.01-M01",
  source: "Srikrishna Committee report (2010), chapter 1, §1.2.27",
  page: 77,
  sourceStatus: "GENERATED PRACTICE QUESTION" as const,
  difficulty: 1,
  relevance: 1,
};
export const questions: Question[] = [
  {
    ...base,
    id: "TM-Q001",
    model: "Recognition",
    modelId: "TM-QM-REC-01",
    stage: "recognition",
    prompt:
      "Which arrangement proposed that the continuation of the Mulki Rules and the Telangana Regional Committee would become unnecessary?",
    options: [
      opt(
        "Gentlemen’s Agreement",
        "The 1956 agreement concerned safeguards at the time of merger; it was not the 1973 replacement framework.",
        "It also concerns Telangana safeguards.",
      ),
      opt(
        "Six-Point Formula",
        "Its sixth point said the new approach would make the old rules and committee unnecessary.",
        "This is the later replacement framework.",
      ),
      opt(
        "Mulki Rules",
        "These were the earlier rules being replaced, not the arrangement proposing their replacement.",
        "Both deal with local employment, making the older rules a tempting choice.",
        true,
      ),
      opt(
        "States Reorganisation Commission",
        "The commission considered territorial reorganisation; this provision belongs to the later formula.",
        "Reorganisation and safeguards are often studied together.",
      ),
    ],
    answer: 1,
    reason:
      "Point six of the 1973 formula proposed replacing the older safeguards with the new approach.",
    clue: "Look for “continuation … unnecessary”: the question asks for the replacement framework.",
    trap: "Shared subject, different role. Local employment is relevant to both, but only one is the later settlement.",
    elimination:
      "Separate an existing safeguard from the policy that proposed replacing it.",
    anchor: "Mulki = earlier safeguard. Six points = later framework.",
    hint: "Which option is the later political settlement, rather than the earlier residence rules?",
  },
  {
    ...base,
    id: "TM-Q002",
    model: "Recognition",
    modelId: "TM-QM-REC-01",
    stage: "recognition",
    prompt:
      "The proposal for a new Central University at Hyderabad belongs to which framework?",
    options: [
      opt(
        "Mulki Rules",
        "The old residence rules did not propose this university.",
        "Both are linked to regional opportunity.",
        true,
      ),
      opt(
        "Six-Point Formula",
        "Educational opportunity, including a new Central University at Hyderabad, appears in point two.",
        "Education is one of the formula’s distinct provisions.",
      ),
      opt(
        "States Reorganisation Commission",
        "This educational provision belongs to the Six-Point Formula.",
        "The commission also dealt with regional concerns.",
      ),
      opt(
        "Gentlemen’s Agreement",
        "The specific university proposal is in the later formula.",
        "The agreement included educational safeguards, which can distract you.",
      ),
    ],
    answer: 1,
    reason:
      "The formula’s second point combined local educational preference with a new Central University at Hyderabad.",
    clue: "The university proposal identifies the education provision.",
    trap: "Do not attach every education safeguard to the 1956 agreement.",
    elimination:
      "Match the specific proposal, not the broad theme of regional welfare.",
    anchor:
      "Six points: development, education, jobs, tribunal, constitutional support, replacement.",
    hint: "Look for the framework that combines development, education and employment.",
  },
  {
    ...base,
    id: "TM-Q003",
    model: "Recognition",
    modelId: "TM-QM-REC-01",
    stage: "recognition",
    prompt:
      "In the historical employment safeguards, a residence qualification of at least 15 years is associated with which rules?",
    options: [
      opt(
        "Six-Point Formula",
        "The formula organised a different local-preference framework; do not transfer the old 15-year rule to it.",
        "Both concern local candidates.",
        true,
      ),
      opt(
        "Mulki Rules",
        "The report describes 15 years’ residence as a historical qualifying route under the Mulki rules.",
        "The residence duration is the identifying clue.",
      ),
      opt(
        "Andhra Pradesh Reorganisation Act, 2014",
        "This later Act reorganised the state, not the historical residence qualification.",
        "It also concerns Telangana.",
      ),
      opt(
        "Srikrishna Committee’s terms of reference",
        "The committee examined the statehood issue much later.",
        "Its report describes these rules, but did not create them.",
      ),
    ],
    answer: 1,
    source: "Srikrishna Committee report (2010), chapter 5, §5.2.01–5.2.03",
    page: 289,
    reason:
      "The report associates the 15-year residence qualification with the historical Mulki rules. It was a qualifying route, not a complete definition of every category of Mulki status.",
    clue: "A specific historical residence duration points to Mulki eligibility.",
    trap: "A source describing a rule is not the authority that originally created it.",
    elimination:
      "Distinguish residence-based eligibility from the later local-cadre framework.",
    anchor: "15-year residence route → historical Mulki rules.",
    hint: "Think of the earlier residence-based rules, not the later settlement.",
  },
  {
    ...base,
    id: "TM-Q004",
    model: "Provision identification",
    modelId: "TM-QM-PROV-01",
    stage: "practice",
    prompt: "Which of the following was included in the Six-Point Formula?",
    options: [
      opt(
        "Abolition of every form of local preference",
        "The formula itself proposed local preference.",
        "Replacement of Mulki rules can be mistaken for removal of all safeguards.",
      ),
      opt(
        "An Administrative Tribunal for service grievances",
        "The formula proposed a tribunal; this is its fourth point.",
        "It is a specific provision of the framework.",
      ),
      opt(
        "Permanent continuation of the Regional Committee",
        "The sixth point contemplated making its continuation unnecessary.",
        "The committee was an earlier safeguard.",
      ),
      opt(
        "Restoration of the old Mulki system without change",
        "The formula proposed a new framework.",
        "It is easy to confuse preserving opportunity with preserving the same rules.",
        true,
      ),
    ],
    answer: 1,
    reason:
      "An Administrative Tribunal was one of the mechanisms proposed in the Six-Point Formula.",
    clue: "Identify a concrete institution, rather than a sweeping claim.",
    trap: "Words such as “every”, “permanent” and “without change” overstate the settlement.",
    elimination:
      "Reject options that reverse the sixth point or deny local preference.",
    anchor: "Service grievances → tribunal → Six-Point Formula.",
    hint: "Which institution was intended to deal with service grievances?",
  },
  {
    ...base,
    id: "TM-Q005",
    model: "Chronology",
    modelId: "TM-QM-CHRON-01",
    stage: "practice",
    prompt: "Which sequence correctly places these arrangements in time?",
    options: [
      opt(
        "Six-Point Formula → Gentlemen’s Agreement → Telangana state formation",
        "The formula came after the agreement.",
        "Both safeguards may feel like one period.",
      ),
      opt(
        "Gentlemen’s Agreement → Six-Point Formula → Telangana state formation",
        "The sequence is 1956, 1973, then 2014.",
        "The dates establish the order.",
      ),
      opt(
        "Telangana state formation → Six-Point Formula → Gentlemen’s Agreement",
        "This reverses the sequence.",
        "Remembering events without dates can reverse the order.",
      ),
      opt(
        "Gentlemen’s Agreement → Telangana state formation → Six-Point Formula",
        "The formula preceded state formation by decades.",
        "A safeguard change is not the same as state formation.",
      ),
    ],
    answer: 1,
    source:
      "Srikrishna Committee report, chapter 1; Telangana State Portal, state profile",
    page: 77,
    reason:
      "The 1956 agreement preceded the 1973 formula; Telangana was formed on 2 June 2014.",
    clue: "Anchor each arrangement to its historical phase before ordering.",
    trap: "Knowing names without placing them in time.",
    elimination:
      "The 2014 formation must come last; the merger agreement is earlier than the formula.",
    anchor: "1956 → 1973 → 2014.",
    hint: "Start with the merger period and end with state formation.",
  },
  {
    ...base,
    id: "TM-Q006",
    model: "Statements",
    modelId: "TM-QM-STMT-01",
    stage: "practice",
    prompt:
      "Consider two statements about the Six-Point Formula. I. It proposed preference for local candidates in education. II. It proposed keeping the Mulki Rules permanently unchanged. Which is correct?",
    options: [
      opt(
        "I only",
        "Local educational preference was proposed; permanently preserving Mulki rules was not.",
        "Read each statement independently.",
      ),
      opt(
        "II only",
        "Statement II reverses the sixth point.",
        "Both frameworks protect local opportunity, but differently.",
        true,
      ),
      opt(
        "Both I and II",
        "Statement I is true, but II is false.",
        "A familiar first statement can cause you to accept the second.",
      ),
      opt(
        "Neither I nor II",
        "Statement I is supported by point two.",
        "An incorrect second statement does not invalidate the first.",
      ),
    ],
    answer: 0,
    reason:
      "The formula included local educational preference and contemplated replacing the older safeguards.",
    clue: "Evaluate “permanently unchanged” separately from educational preference.",
    trap: "Accepting both statements because the first sounds familiar.",
    elimination:
      "Once II is false, eliminate “II only” and “Both”. Then check I.",
    anchor: "A true first statement does not rescue a false second one.",
    hint: "Compare statement II with the sixth point of the formula.",
  },
  {
    ...base,
    id: "TM-Q007",
    model: "Negative wording",
    modelId: "TM-QM-NEG-01",
    stage: "practice",
    prompt: "Which was NOT a proposal of the Six-Point Formula?",
    options: [
      opt(
        "A Planning Board and subcommittees for backward areas",
        "This was included in point one, so it does not answer NOT.",
        "A real provision can distract when the stem is negative.",
      ),
      opt(
        "Preference for local candidates in direct recruitment",
        "This was included in point three.",
        "This is true, but the question asks for an exception.",
      ),
      opt(
        "Permanent retention of the Mulki Rules",
        "The sixth point envisaged their continuation becoming unnecessary.",
        "This is the exception being asked for.",
        true,
      ),
      opt(
        "Constitutional changes to support the arrangement",
        "This was part of the formula’s enabling approach.",
        "It sounds broad but is supported.",
      ),
    ],
    answer: 2,
    reason: "Permanent retention contradicts the formula’s sixth point.",
    clue: "Mark the word NOT before evaluating options.",
    trap: "Choosing a true provision in an exception question.",
    elimination:
      "Cross out the three supported provisions; select the contradiction.",
    anchor: "NOT changes the task: find the exception.",
    hint: "Which option contradicts the formula’s proposed replacement of earlier safeguards?",
  },
  {
    ...base,
    id: "TM-Q008",
    model: "Provision identification",
    modelId: "TM-QM-PROV-01",
    stage: "practice",
    prompt:
      "A question mentions local cadres, regional development and an Administrative Tribunal together. Which framework best fits these clues?",
    options: [
      opt(
        "Mulki Rules",
        "Residence-based rules alone do not account for the full set of clues.",
        "Employment is a shared theme.",
        true,
      ),
      opt(
        "Six-Point Formula",
        "The clues span its development, employment and tribunal provisions.",
        "Several independent provisions point to the same framework.",
      ),
      opt(
        "States Reorganisation Commission",
        "Territorial reorganisation does not match this bundle of provisions.",
        "Regional development may sound related.",
      ),
      opt(
        "Gentlemen’s Agreement",
        "This bundle specifically identifies the 1973 formula.",
        "Both were regional settlements.",
      ),
    ],
    answer: 1,
    reason:
      "The combination identifies the broader 1973 framework rather than a single residence rule.",
    clue: "Use all the clues together; employment alone is not enough.",
    trap: "Matching on a single familiar keyword.",
    elimination:
      "Require the answer to explain every clue, including the tribunal.",
    anchor: "Development + local cadres + tribunal → Six points.",
    hint: "Use the tribunal clue to distinguish the two employment frameworks.",
  },
  {
    ...base,
    id: "TM-Q009",
    model: "Changed wording",
    modelId: "TM-QM-REWORD-01",
    stage: "rewording",
    prompt:
      "An arrangement sought to protect regional opportunity through a new framework, making older residence rules and a regional committee redundant. What is being described?",
    options: [
      opt(
        "Continuation of the original Mulki Rules",
        "The stem describes replacement, not continuation.",
        "The reference to residence rules draws attention to Mulki.",
        true,
      ),
      opt(
        "The Six-Point Formula",
        "This rephrases its sixth point in the context of the broader framework.",
        "The direction of change identifies it.",
      ),
      opt(
        "Creation of the States Reorganisation Commission",
        "The clue concerns replacement of safeguards, not a commission’s formation.",
        "Regional matters are common to both.",
      ),
      opt(
        "Formation of Telangana in 2014",
        "The statement describes a 1973 policy arrangement.",
        "A major change is not always state formation.",
      ),
    ],
    answer: 1,
    reason:
      "The wording describes the Six-Point Formula without naming its provisions directly.",
    clue: "“Making older … redundant” means a replacement framework.",
    trap: "Recognising a word without recognising what happened to it.",
    elimination:
      "Ask which arrangement is acting and which safeguards are being replaced.",
    anchor: "Read the relationship, not just the names.",
    hint: "The old rules are the object of the change, not the answer.",
  },
  {
    ...base,
    id: "TM-Q010",
    model: "Statements",
    modelId: "TM-QM-STMT-01",
    stage: "recall",
    prompt:
      "After a break, recall the key distinction. Which statement correctly compares the Mulki Rules and the Six-Point Formula?",
    options: [
      opt(
        "They are two names for exactly the same rules",
        "They belong to different arrangements.",
        "The shared local-employment theme encourages conflation.",
        true,
      ),
      opt(
        "The earlier Mulki safeguards and the later Six-Point Formula used different frameworks for regional opportunity",
        "This distinguishes the older rules from the later settlement.",
        "It describes the relationship without collapsing the two.",
      ),
      opt(
        "The Six-Point Formula introduced the original Mulki Rules",
        "The formula came later and contemplated their replacement.",
        "The direction of the relationship is reversed.",
        true,
      ),
      opt(
        "The Six-Point Formula concerned education only",
        "It also covered development, recruitment, a tribunal and constitutional support.",
        "One memorable provision can obscure the whole framework.",
      ),
    ],
    answer: 1,
    reason:
      "The later formula proposed a broader framework and contemplated replacing the old safeguards.",
    clue: "Recall the direction of change, then check the scope.",
    trap: "Treating shared purpose as identical provisions.",
    elimination: "Reject “exactly the same”, reversed chronology and “only”.",
    anchor: "Same broad concern, different framework.",
    hint: "Which option distinguishes the two without overstating either?",
  },
];
export const topics = [
  {
    id: "TM-01",
    title: "The idea of Telangana",
    period: "1948–1970",
    children: [
      ["TM-01.01", "Hyderabad State & integration"],
      ["TM-01.02", "1952 agitation & Mulki safeguards"],
      ["TM-01.03", "States Reorganisation & the 1956 merger"],
      ["TM-01.04", "Gentlemen’s Agreement & Regional Committee"],
      ["TM-01.05", "1969 agitation & Telangana Praja Samithi"],
    ],
  },
  {
    id: "TM-02",
    title: "The mobilisation phase",
    period: "1971–1990",
    children: [
      ["TM-02.01", "Mulki Rules & Six-Point Formula"],
      ["TM-02.02", "Jai Andhra & the 1972 developments"],
      ["TM-02.03", "Article 371-D & Presidential Orders"],
      ["TM-02.04", "GO 610 & regional development"],
    ],
  },
  {
    id: "TM-03",
    title: "Towards state formation",
    period: "1991–2014",
    children: [
      ["TM-03.01", "Civil society, organisations & cultural revival"],
      ["TM-03.02", "TRS & the movement, 2001–2009"],
      ["TM-03.03", "2009 developments & Srikrishna Committee"],
      ["TM-03.04", "Students, employees & joint action committees"],
      ["TM-03.05", "Parliamentary process & Reorganisation Act"],
      ["TM-03.06", "Telangana state formation"],
    ],
  },
];
export const comparison = [
  [
    "Core idea",
    "Historical residence-based employment safeguards",
    "A broader regional development and local-opportunity framework",
  ],
  [
    "Recognition clue",
    "15-year residence qualifying route",
    "Local cadres, education, development and a tribunal",
  ],
  [
    "Relationship",
    "The older rules",
    "Point six contemplated replacing the older rules and Regional Committee",
  ],
  [
    "Avoid this trap",
    "Do not transfer its residence rule to the later formula",
    "Do not mistake replacement for ending all local preference",
  ],
];
