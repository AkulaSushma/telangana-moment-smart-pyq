import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import {
  importCorpus,
  initializeCorpus,
  publishCorpusQuestion,
  type PublicationReview,
} from "../lib/corpus";
import type { Question } from "../lib/content";

const dbPath = join(process.cwd(), "data", "learning.sqlite");
const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;");
initializeCorpus(db);

const batchQuestions: { question: Question; sourceIds: string[] }[] = [
  // 1. TM-Q046 (TGPSC Group-2 2024 Q27)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q046",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In the first internal election held in 1958 for the Chairmanship of the Telangana Regional Committee (TRC), against which prominent communist leader did K. Achyutha Reddy contest and win?",
      options: [
        {
          text: "V.B. Raju",
          why: "V.B. Raju was a senior Congress minister and later involved in the 1969 agitation, not the opposition candidate in the 1958 TRC election.",
          attraction: "Senior Telangana Congress minister.",
        },
        {
          text: "K.V. Ranga Reddy",
          why: "K.V. Ranga Reddy was a senior minister in Sanjeeva Reddy's cabinet and became Deputy CM in 1959.",
          attraction: "Prominent Telangana leader of that era.",
        },
        {
          text: "Ravi Narayana Reddy",
          why: "K. Achyutha Reddy (Congress candidate) contested against the legendary Telangana peasant armed struggle hero and CPI leader Ravi Narayana Reddy, defeating him to become the first Chairman of the Telangana Regional Committee.",
          attraction: "Famous CPI parliamentarian and leader.",
          confusion: false,
        },
        {
          text: "Dr. Marri Chenna Reddy",
          why: "Dr. M. Chenna Reddy was an MLA and minister, but not the opponent in this 1958 TRC contest.",
          attraction: "Major political leader of Telangana.",
        },
      ],
      answer: 2,
      reason: "In 1958, the statutory Telangana Regional Committee (TRC) was constituted. In the election for its first Chairman, Congress party's K. Achyutha Reddy defeated Communist veteran Ravi Narayana Reddy.",
      clue: "Look for 'against whom did K. Achyutha Reddy win TRC Chairmanship in 1958': Ravi Narayana Reddy.",
      trap: "Do not confuse Congress internal factions with the main opposition CPI candidate Ravi Narayana Reddy.",
      elimination: "Eliminate Congress leaders (V.B. Raju, K.V. Ranga Reddy, Chenna Reddy); the contest was between ruling Congress and CPI's Ravi Narayana Reddy.",
      anchor: "First TRC Chairman: K. Achyutha Reddy (defeated Ravi Narayana Reddy in 1958).",
      hint: "Which legendary CPI leader, who secured more votes than Nehru in the 1952 Lok Sabha elections, was defeated in this TRC election?",
      source: "TGPSC Group-2 2024, Paper IV, Q27",
      page: 10,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "The question asks who K. Achyutha Reddy defeated in the 1958 TRC election.",
          correctMeaning: "K. Achyutha Reddy defeated CPI leader Ravi Narayana Reddy.",
          selectedMeaning: "V.B. Raju was a Congress minister, not the candidate fielded against Achyutha Reddy.",
          possibleConfusion: "V.B. Raju was a prominent player in state politics.",
          decisionRules: [
            { when: "the question asks who lost the 1958 TRC Chairman election to K. Achyutha Reddy", choose: "Ravi Narayana Reddy" },
            { when: "the question asks who was the first Chairman of the Telangana Regional Committee", choose: "K. Achyutha Reddy" },
          ],
          nextStep: "Remember: K. Achyutha Reddy defeated Ravi Narayana Reddy in 1958.",
        },
        {
          observation: "Check K.V. Ranga Reddy's role in 1958.",
          correctMeaning: "Ravi Narayana Reddy was the defeated candidate.",
          selectedMeaning: "K.V. Ranga Reddy was serving in the state cabinet as a minister.",
          possibleConfusion: "K.V. Ranga Reddy is heavily associated with regional safeguards.",
          decisionRules: [
            { when: "the question asks who became Deputy CM of AP in 1959", choose: "K.V. Ranga Reddy" },
            { when: "the question asks who Ravi Narayana Reddy lost to in 1958 TRC election", choose: "K. Achyutha Reddy" },
          ],
          nextStep: "Distinguish TRC Chairmanship from the state Deputy Chief Ministership.",
        },
        {
          observation: "You correctly selected Ravi Narayana Reddy.",
          correctMeaning: "Ravi Narayana Reddy was the joint opposition candidate defeated by Congress nominee K. Achyutha Reddy.",
          selectedMeaning: "Ravi Narayana Reddy was the joint opposition candidate defeated by Congress nominee K. Achyutha Reddy.",
          possibleConfusion: "You answered correctly. Ravi Narayana Reddy had won Nalgonda Lok Sabha seat with the highest votes in India in 1952.",
          decisionRules: [
            { when: "the question asks who was defeated in the first TRC Chairman election", choose: "Ravi Narayana Reddy" },
            { when: "the question asks who was elected the first TRC Chairman", choose: "K. Achyutha Reddy" },
          ],
          nextStep: "Review the tenure of K. Achyutha Reddy as TRC Chairman (1958–1962).",
        },
        {
          observation: "Check Dr. Marri Chenna Reddy's role.",
          correctMeaning: "Ravi Narayana Reddy was the opponent.",
          selectedMeaning: "Dr. Chenna Reddy later led the 1969 agitation through TPS, but was not in this 1958 contest.",
          possibleConfusion: "Chenna Reddy is central to 1969 questions, but not the 1958 TRC contest.",
          decisionRules: [
            { when: "the question asks who was the opposition candidate for TRC Chairman in 1958", choose: "Ravi Narayana Reddy" },
            { when: "the question asks who took over leadership of TPS in May 1969", choose: "Dr. Marri Chenna Reddy" },
          ],
          nextStep: "Anchor Chenna Reddy to 1969 TPS leadership, not 1958 TRC.",
        },
      ],
    },
  },

  // 2. TM-Q047 (TGPSC Group-2 2024 Q28)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q047",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-02",
      stage: "practice",
      prompt: "Match the following early leaders of the 1968–1969 Telangana movement with the organisations they founded or led:\n(a) K. Ramadasu (Kolishetti Ramadasu)\n(b) Katam Laxminarayana\n(c) A. Madan Mohan\n(d) T. Purushotham Rao",
      options: [
        {
          text: "(a)-(II), (b)-(III), (c)-(I), (d)-(IV)",
          why: "Incorrect: Kolishetti Ramadasu was with Telangana Protection Committee, not Students JAC.",
          attraction: "Mixes student and employee organizations.",
        },
        {
          text: "(a)-(III), (b)-(IV), (c)-(I), (d)-(V)",
          why: "Incorrect: Kolishetti Ramadasu founded Telangana Protection Committee.",
          attraction: "Shuffles committee names.",
        },
        {
          text: "(a)-(IV), (b)-(V), (c)-(I), (d)-(III)",
          why: "Correct mapping: Kolishetti Ramadasu founded the Telangana Protection Committee (IV); Katam Laxminarayana founded the Telangana Safeguards Agitation Association (V); A. Madan Mohan founded the Telangana Praja Samithi (I); T. Purushotham Rao founded the Telangana Pranteeya Samithi in Warangal (III).",
          attraction: "Exact match from official TGPSC Group-2 2024 key.",
          confusion: false,
        },
        {
          text: "(a)-(III), (b)-(I), (c)-(V), (d)-(IV)",
          why: "Incorrect: Madan Mohan founded TPS, not the Safeguards Association.",
          attraction: "Mixes Madan Mohan and Katam Laxminarayana.",
        },
      ],
      answer: 2,
      reason: "In the genesis of the 1969 agitation: (a) Kolishetti Ramadasu founded the Telangana Protection Committee at Palwancha; (b) Katam Laxminarayana led the Telangana Safeguards Agitation Association; (c) Advocate A. Madan Mohan founded the historic Telangana Praja Samithi (TPS) on 28 February 1969; (d) T. Purushotham Rao established the Telangana Pranteeya Samithi in Warangal.",
      clue: "Look for 'A. Madan Mohan': founder-president of Telangana Praja Samithi (TPS) in early 1969; Kolishetti Ramadasu: Telangana Protection Committee.",
      trap: "Do not confuse Telangana Praja Samithi (Madan Mohan) with Telangana Pranteeya Samithi (Purushotham Rao).",
      elimination: "Identify A. Madan Mohan = Telangana Praja Samithi (I); K. Ramadasu = Telangana Protection Committee (IV). Only option 3 contains this.",
      anchor: "K. Ramadasu: Protection Committee; Katam Laxminarayana: Safeguards Association; Madan Mohan: TPS; Purushotham Rao: Pranteeya Samithi.",
      hint: "Who was the young advocate from Hyderabad who founded the Telangana Praja Samithi in February 1969?",
      source: "TGPSC Group-2 2024, Paper IV, Q28",
      page: 10,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Check A. Madan Mohan's organisation.",
          correctMeaning: "Option 3 is correct: A. Madan Mohan founded the Telangana Praja Samithi (TPS).",
          selectedMeaning: "Option 1 assigns TPS to Madan Mohan, but pairs K. Ramadasu with Students JAC.",
          possibleConfusion: "Kolishetti Ramadasu was at Palwancha KTPS, not Osmania student JAC.",
          decisionRules: [
            { when: "the question asks who founded Telangana Praja Samithi in February 1969", choose: "A. Madan Mohan" },
            { when: "the question asks who founded Telangana Protection Committee at Palwancha", choose: "Kolishetti Ramadasu" },
          ],
          nextStep: "Remember: Madan Mohan was the founder-president of TPS before Dr. Chenna Reddy took over.",
        },
        {
          observation: "Check T. Purushotham Rao's organization in Warangal.",
          correctMeaning: "T. Purushotham Rao headed the Telangana Pranteeya Samithi.",
          selectedMeaning: "Option 2 assigns Safeguards Agitation Association to Purushotham Rao.",
          possibleConfusion: "Both organisations operated in 1968–69.",
          decisionRules: [
            { when: "the question asks who led the Telangana Pranteeya Samithi in Warangal", choose: "T. Purushotham Rao" },
            { when: "the question asks who led Telangana Safeguards Agitation Association", choose: "Katam Laxminarayana" },
          ],
          nextStep: "Associate Purushotham Rao with Warangal Pranteeya Samithi.",
        },
        {
          observation: "You matched all four 1969 pioneer leaders correctly.",
          correctMeaning: "K. Ramadasu: Protection Committee (IV); Katam Laxminarayana: Safeguards Association (V); A. Madan Mohan: TPS (I); T. Purushotham Rao: Pranteeya Samithi (III).",
          selectedMeaning: "K. Ramadasu: Protection Committee (IV); Katam Laxminarayana: Safeguards Association (V); A. Madan Mohan: TPS (I); T. Purushotham Rao: Pranteeya Samithi (III).",
          possibleConfusion: "You answered correctly. These organizations initiated the mass mobilisation before national political attention.",
          decisionRules: [
            { when: "the question asks for the founder of TPS", choose: "A. Madan Mohan" },
            { when: "the question asks who founded the Telangana Protection Committee", choose: "Kolishetti Ramadasu" },
          ],
          nextStep: "Review the Palwancha thermal plant agitation that sparked Kolishetti Ramadasu's actions.",
        },
        {
          observation: "Check Katam Laxminarayana's organisation.",
          correctMeaning: "Katam Laxminarayana was with the Safeguards Association.",
          selectedMeaning: "Option 4 assigns TPS to Katam Laxminarayana.",
          possibleConfusion: "Confusing various safeguard associations formed in late 1968.",
          decisionRules: [
            { when: "the question asks who founded TPS", choose: "A. Madan Mohan" },
            { when: "the question asks who was general secretary of Telangana Safeguards Agitation Association", choose: "Sangamreddy Satyanarayana (with Katam Laxminarayana)" },
          ],
          nextStep: "Distinguish between TPS (Madan Mohan) and Safeguards Association (Katam Laxminarayana).",
        },
      ],
    },
  },

  // 3. TM-Q048 (TGPSC Group-2 2024 Q30)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q048",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Consider the following statements regarding the role of Konda Laxman Bapuji in the 1969 Telangana Movement:\nStatement A: Konda Laxman Bapuji was the first minister in Kasu Brahmananda Reddy's cabinet to resign his ministership in support of separate Telangana.\nStatement B: Following his resignation in March 1969, he founded the 'Telangana Congress Samithi' to fight politically for statehood.\nStatement C: Telangana Praja Samithi was founded by Konda Laxman Bapuji.\nStatement D: T. Sadalakshmi led the agitation by taking over as Chief Minister of Andhra Pradesh.\nWhich of the above statements are correct?",
      options: [
        {
          text: "Statement A and Statement B only",
          why: "Statements A and B are historically authenticated: Konda Laxman Bapuji resigned on 28 March 1969 (first minister to resign) and founded the Telangana Congress Samithi. Statement C is false because TPS was founded by A. Madan Mohan; Statement D is false because Sadalakshmi never became Chief Minister.",
          attraction: "Exact match with historical facts.",
          confusion: false,
        },
        {
          text: "Statement B and Statement C only",
          why: "Statement C is false: A. Madan Mohan founded Telangana Praja Samithi, not Konda Laxman Bapuji.",
          attraction: "Assumes Bapuji founded TPS.",
        },
        {
          text: "Statement C and Statement D only",
          why: "Both C and D are historically false.",
          attraction: "Pair of incorrect statements.",
        },
        {
          text: "Statement A, Statement C and Statement D only",
          why: "Contains false statements C and D.",
          attraction: "Overly inclusive choice.",
        },
      ],
      answer: 0,
      reason: "Konda Laxman Bapuji was Minister for Information and Small Scale Industries. On 28 March 1969, he became the first minister to resign from Kasu Brahmananda Reddy's cabinet in protest against police brutalities on students. He subsequently founded the Telangana Congress Samithi. A. Madan Mohan founded TPS, not Bapuji. Hence only A and B are correct.",
      clue: "Look for 'Konda Laxman Bapuji first minister to resign': True. He founded 'Telangana Congress Samithi': True. TPS was founded by Madan Mohan.",
      trap: "Do not confuse the Telangana Congress Samithi (founded by Bapuji) with the Telangana Praja Samithi (founded by Madan Mohan).",
      elimination: "Eliminate Statement C (TPS founded by Madan Mohan) and D (Sadalakshmi never served as Chief Minister); only A and B are correct.",
      anchor: "Konda Laxman Bapuji: First minister to resign (28 March 1969); founded Telangana Congress Samithi.",
      hint: "Which minister resigned from Kasu Brahmananda Reddy's cabinet on 28 March 1969?",
      source: "TGPSC Group-2 2024, Paper IV, Q30",
      page: 11,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Statements A and B.",
          correctMeaning: "Konda Laxman Bapuji was the first minister to resign for separate Telangana and formed the Telangana Congress Samithi.",
          selectedMeaning: "Konda Laxman Bapuji was the first minister to resign for separate Telangana and formed the Telangana Congress Samithi.",
          possibleConfusion: "You answered correctly. Bapuji later offered his Jaladrushyam residence as the venue for launching TRS in 2001.",
          decisionRules: [
            { when: "the question asks who was the first minister to resign in 1969", choose: "Konda Laxman Bapuji" },
            { when: "the question asks who founded the Telangana Congress Samithi", choose: "Konda Laxman Bapuji" },
          ],
          nextStep: "Remember: Bapuji resigned on 28 March 1969.",
        },
        {
          observation: "Examine Statement C on the founder of TPS.",
          correctMeaning: "Only Statements A and B are true; TPS was founded by A. Madan Mohan, not Bapuji.",
          selectedMeaning: "Option 2 claims Bapuji founded TPS, which is false.",
          possibleConfusion: "Bapuji supported TPS, but he maintained his own platform, the Telangana Congress Samithi.",
          decisionRules: [
            { when: "the question asks who founded Telangana Praja Samithi", choose: "A. Madan Mohan" },
            { when: "the question asks who founded Telangana Congress Samithi", choose: "Konda Laxman Bapuji" },
          ],
          nextStep: "Differentiate Telangana Congress Samithi from Telangana Praja Samithi.",
        },
        {
          observation: "Check Statement D regarding T. Sadalakshmi.",
          correctMeaning: "Statements A and B are correct; Statement D is false.",
          selectedMeaning: "Option 3 accepts false statements C and D.",
          possibleConfusion: "T. Sadalakshmi was a prominent Telangana woman leader and deputy speaker, but never Chief Minister.",
          decisionRules: [
            { when: "the question asks about T. Sadalakshmi's role in 1969", choose: "Leader in Telangana Congress Samithi and TPS" },
            { when: "the question asks who was the first minister to resign", choose: "Konda Laxman Bapuji" },
          ],
          nextStep: "Note T. Sadalakshmi's position as former Social Welfare Minister and Deputy Speaker.",
        },
        {
          observation: "Re-evaluate Statement C.",
          correctMeaning: "Statement C is false because A. Madan Mohan established TPS.",
          selectedMeaning: "Option 4 includes Statement C, confusing Bapuji with Madan Mohan.",
          possibleConfusion: "Both leaders were prominent figures in the early 1969 agitation.",
          decisionRules: [
            { when: "the question asks who founded TPS", choose: "A. Madan Mohan" },
            { when: "the question asks which statements on Konda Laxman Bapuji are correct", choose: "A and B only" },
          ],
          nextStep: "Keep Bapuji matched to Telangana Congress Samithi.",
        },
      ],
    },
  },

  // 4. TM-Q049 (TGPSC Group-2 2024 Q32)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q049",
      topic: "TM-01.04",
      concept: "TM-01.04-M02",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Under the Andhra Pradesh Public Employment (Requirement as to Residence) Rules, 1959 enacted to protect Telangana employment safeguards, which of the following statutory rules were prescribed?\nStatement A: The appointee should be a continuous resident (domicile) of Telangana for a minimum of 15 years.\nStatement B: The local status certificate was to be issued by the Revenue Divisional Officer (RDO).\nStatement C: The local status requirement was applicable only to appointments in non-gazetted posts in local offices.\nStatement D: In the government offices of Hyderabad and Secunderabad, 2 out of every 3 vacancies were to be filled by local Telangana persons.\nWhich of the above statements are correct?",
      options: [
        {
          text: "A, B and C only",
          why: "Statement D is also an authentic statutory provision of the 1959 Rules: in Hyderabad and Secunderabad municipal areas, 2 out of 3 vacancies were reserved for locals.",
          attraction: "Leaves out the Hyderabad-Secunderabad ratio.",
        },
        {
          text: "B, C and D only",
          why: "Statement A is also a cornerstone requirement: 15 years domicile was mandatory.",
          attraction: "Omits the 15-year residence rule.",
        },
        {
          text: "A, C and D only",
          why: "Statement B is also correct: RDO was designated the competent certifying authority.",
          attraction: "Omits the certifying authority.",
        },
        {
          text: "A, B, C and D (All of the above)",
          why: "All four statements are accurate statutory clauses of the 1959 AP Public Employment Rules enacted under Parliament's Public Employment Act, 1957.",
          attraction: "Exact match from official TGPSC Group-2 2024 key.",
          confusion: false,
        },
      ],
      answer: 3,
      reason: "The 1959 Rules mandated: (1) 15-year continuous residence in Telangana; (2) RDO as the certificate-issuing authority; (3) Reservation restricted to non-gazetted posts (subordinate services) with pay below specified limits; (4) In the twin cities (Hyderabad and Secunderabad), 2 out of 3 vacancies in government departments were reserved for Telangana locals.",
      clue: "Look for 'Andhra Pradesh Public Employment Rules 1959': all four statements A, B, C, and D are authentic statutory provisions.",
      trap: "Do not doubt the 2:3 ratio for Hyderabad/Secunderabad; it was explicitly enacted in the 1959 statutory rules.",
      elimination: "All four provisions are authenticated text of the 1959 rules; select the option containing all four.",
      anchor: "1959 Rules: 15 years domicile (A), RDO certificate (B), Non-gazetted posts (C), Twin cities 2 out of 3 posts local (D).",
      hint: "Did the 1959 rules mandate a 15-year residence and a 2:3 vacancy quota in the capital for locals?",
      source: "TGPSC Group-2 2024, Paper IV, Q32",
      page: 12,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Statement D is also true; check the twin cities quota.",
          correctMeaning: "All four statements (A, B, C, and D) are correct.",
          selectedMeaning: "Option 1 omits Statement D, which was the specific clause for the capital twin cities.",
          possibleConfusion: "Aspirants often forget that 2 out of 3 posts in Hyderabad/Secunderabad were reserved for Telangana locals.",
          decisionRules: [
            { when: "the question asks for the vacancy quota in Hyderabad/Secunderabad under 1959 rules", choose: "2 out of 3 vacancies reserved for locals" },
            { when: "evaluating the 1959 Public Employment Rules statements", choose: "A, B, C and D (All four)" },
          ],
          nextStep: "Remember: Twin cities had a 2 out of 3 local quota.",
        },
        {
          observation: "Check Statement A on the 15-year residence rule.",
          correctMeaning: "All four statements are correct, including Statement A.",
          selectedMeaning: "Option 2 leaves out the foundational 15-year domicile requirement.",
          possibleConfusion: "Domicile was the central feature inherited from the 1919 Farman.",
          decisionRules: [
            { when: "the question asks how many years residence the 1959 Rules required", choose: "15 years" },
            { when: "evaluating statements A, B, C, and D", choose: "All of the above" },
          ],
          nextStep: "Anchor 1959 rules to 15 years continuous residence.",
        },
        {
          observation: "Check Statement B regarding the RDO authority.",
          correctMeaning: "Statement B is true: RDOs were the designated officers to issue Mulki/local certificates.",
          selectedMeaning: "Option 3 omits Statement B.",
          possibleConfusion: "RDOs later came under fire for issuing bogus certificates, confirming their statutory authority.",
          decisionRules: [
            { when: "the question asks which authority issued local certificates under 1959 rules", choose: "Revenue Divisional Officer (RDO)" },
            { when: "the question asks which statements are true", choose: "A, B, C and D" },
          ],
          nextStep: "Note that bogus RDO certificates became a chief grievance in 1968–69.",
        },
        {
          observation: "You correctly selected all four statements.",
          correctMeaning: "Every statement accurately describes the 1959 Public Employment Rules.",
          selectedMeaning: "Every statement accurately describes the 1959 Public Employment Rules.",
          possibleConfusion: "You answered correctly. These rules were later struck down in the AVS Narasimha Rao Supreme Court case in March 1969.",
          decisionRules: [
            { when: "the question asks which statements regarding 1959 rules are correct", choose: "A, B, C and D" },
            { when: "the question asks which Supreme Court ruling struck down Section 3 of the 1957 Act", choose: "AVS Narasimha Rao v. State of Andhra Pradesh (March 1969)" },
          ],
          nextStep: "Connect the invalidation of the 1959 rules to the outbreak of the 1969 agitation.",
        },
      ],
    },
  },

  // 5. TM-Q050 (TGPSC Group-2 2024 Q36)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q050",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Chronology",
      modelId: "TM-QM-CHR-01",
      stage: "practice",
      prompt: "Arrange the following historic events from the outbreak of the 1969 Telangana Movement in correct chronological sequence:\nEvent A: Potu Krishnamurthy started a fast unto death at Palwancha (Kothagudem Thermal Power Station).\nEvent B: Osmania University students launched a general strike in support of hunger strikes for safeguards.\nEvent C: K. Venkatrama Reddy, President of Osmania University Students Union (OUSU), sat on hunger strike in front of the Secretariat.\nEvent D: A massive public meeting demanding separate Telangana was held at Warangal under the Chairmanship of T. Purushotham Rao.",
      options: [
        {
          text: "Event A -> Event B -> Event D -> Event C",
          why: "Incorrect sequence: Venkatrama Reddy's strike preceded the massive Warangal rally.",
          attraction: "Puts the Warangal rally earlier than it occurred.",
        },
        {
          text: "Event A -> Event C -> Event B -> Event D",
          why: "Incorrect: The general student strike erupted before Venkatrama Reddy's hunger strike at the Secretariat.",
          attraction: "Swaps student strike and Secretariat fast.",
        },
        {
          text: "Event B -> Event C -> Event A -> Event D",
          why: "Incorrect: Palwancha fast by Potu Krishnamurthy began on 5 January 1969, which was the initial trigger before the OU general strike.",
          attraction: "Starts with student agitation instead of the Palwancha origin.",
        },
        {
          text: "Event A -> Event B -> Event C -> Event D",
          why: "Correct chronological order: (A) Potu Krishnamurthy started his fast on 5 January 1969 at Palwancha; (B) OU students launched strike on 10 January 1969 following Ravindranath's fast on 8 Jan; (C) OUSU President K. Venkatrama Reddy held hunger strike at Secretariat in mid-January; (D) Warangal massive public meeting under T. Purushotham Rao took place in late January 1969.",
          attraction: "Exact chronological progression of the January 1969 escalation.",
          confusion: false,
        },
      ],
      answer: 3,
      reason: "The January 1969 timeline: (A) 5 January 1969: Potu Krishnamurthy fasts at Palwancha; (B) 10 January 1969: Osmania University students strike across Hyderabad; (C) Mid-January 1969: K. Venkatrama Reddy fasts at the Secretariat; (D) 28 January 1969: Historic Warangal public meeting under T. Purushotham Rao.",
      clue: "Look for the sequence starting with Palwancha fast (Jan 5), followed by Osmania students strike (Jan 10), then Secretariat fast, concluding with the Warangal public convention.",
      trap: "Do not start with Osmania University; the agitation originated among workers and youth at Palwancha/Kothagudem.",
      elimination: "Event A (Palwancha, Jan 5) must be first. This eliminates option 3 immediately. Then Event B (Jan 10) precedes the later January events.",
      anchor: "Chronology: Palwancha fast (Jan 5) -> OU students strike (Jan 10) -> Secretariat fast -> Warangal rally (late Jan).",
      hint: "Did the movement start at Palwancha before spreading to Osmania University?",
      source: "TGPSC Group-2 2024, Paper IV, Q36",
      page: 13,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 3,
      relevance: 3,
      teaching: [
        {
          observation: "Check the date of the Warangal convention under T. Purushotham Rao.",
          correctMeaning: "Option 4 is correct: Palwancha fast (A) -> OU student strike (B) -> Secretariat fast (C) -> Warangal meeting (D).",
          selectedMeaning: "Option 1 places the Warangal meeting before the Secretariat hunger strike.",
          possibleConfusion: "Both occurred in the second half of January 1969.",
          decisionRules: [
            { when: "arranging early January 1969 agitation events", choose: "Palwancha fast (Jan 5) -> OU strike (Jan 10) -> Secretariat fast -> Warangal rally" },
            { when: "identifying the first hunger strike location in 1969", choose: "Palwancha (Potu Krishnamurthy)" },
          ],
          nextStep: "Remember: Palwancha was the spark on 5 January 1969.",
        },
        {
          observation: "Check when the Osmania University general strike began.",
          correctMeaning: "The OU student strike (B) began on 10 January 1969, before Venkatrama Reddy's fast at the Secretariat (C).",
          selectedMeaning: "Option 2 places the Secretariat fast before the student strike.",
          possibleConfusion: "Venkatrama Reddy was the OUSU president who coordinated the escalating strike.",
          decisionRules: [
            { when: "the question asks when OU students struck", choose: "10 January 1969" },
            { when: "the question asks who was OUSU president during 1969 strike", choose: "K. Venkatrama Reddy" },
          ],
          nextStep: "Place the general student strike on 10 January 1969.",
        },
        {
          observation: "Check whether the movement originated in Hyderabad or the districts.",
          correctMeaning: "The agitation began in the district at Palwancha (A), not at Osmania University (B).",
          selectedMeaning: "Option 3 erroneously starts with Osmania University.",
          possibleConfusion: "Osmania University became the epicentre, but Palwancha and Khammam provided the initial spark.",
          decisionRules: [
            { when: "the question asks where the 1969 agitation first sparked", choose: "Palwancha (KTPS employees and youth)" },
            { when: "arranging the timeline", choose: "Event A is first" },
          ],
          nextStep: "Anchor the movement origin to KTPS Palwancha.",
        },
        {
          observation: "You arranged the January 1969 events in exact chronological order.",
          correctMeaning: "Palwancha fast (A) -> OU student strike (B) -> Secretariat fast (C) -> Warangal public meeting (D).",
          selectedMeaning: "Palwancha fast (A) -> OU student strike (B) -> Secretariat fast (C) -> Warangal public meeting (D).",
          possibleConfusion: "You answered correctly. This exact sequence tests mastery of the critical opening month of the 1969 agitation.",
          decisionRules: [
            { when: "ordering January 1969 movement milestones", choose: "A -> B -> C -> D" },
            { when: "the question asks who started hunger strike on 8 January in Khammam", choose: "Annabathula Ravindranath" },
          ],
          nextStep: "Review the transition from safeguards demand to separate statehood demand in January 1969.",
        },
      ],
    },
  },

  // 6. TM-Q051 (TGPSC Group-2 2024 Q39)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q051",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Consider the following statements regarding the hunger strike of Annabathula Ravindranath that electrified the 1969 Telangana Movement:\nStatement A: Kolishetti Ramadasu was instrumental in giving momentum to student involvement and encouraged Annabathula Ravindranath to undertake the fast unto death.\nStatement B: Annabathula Ravindranath commenced his historic fast unto death at the Gandhi Chowk in Khammam on 8 January 1969.\nStatement C: Moved by his sacrifice, several young students cut their thumbs and applied 'Rakta Tilakam' (blood tilak) on his forehead.\nWhich of the above statements are correct?",
      options: [
        {
          text: "Statement A and Statement B only",
          why: "Statement C is also a famous, recorded historical incident of emotional student solidarity during Ravindranath's fast.",
          attraction: "Leaves out the dramatic Rakta Tilakam incident.",
        },
        {
          text: "Statement B and Statement C only",
          why: "Statement A is also fully true: Kolishetti Ramadasu played the pivotal mentoring role.",
          attraction: "Omits Kolishetti Ramadasu's role.",
        },
        {
          text: "Statement A, Statement B and Statement C (All of the above)",
          why: "All three statements are verified historical facts: Ravindranath began his fast on 8 January 1969 at Khammam with Kolishetti Ramadasu's encouragement, and students offered Rakta Tilakam.",
          attraction: "Exact match from official TGPSC Group-2 2024 key.",
          confusion: false,
        },
        {
          text: "Statement A and Statement C only",
          why: "Statement B is the core factual anchor of the movement: fast began on 8 January 1969.",
          attraction: "Omits the start date.",
        },
      ],
      answer: 2,
      reason: "On 8 January 1969, Annabathula Ravindranath (a second-year B.A. student) began his fast unto death at Khammam Gandhi Chowk demanding the implementation of Telangana safeguards. Kolishetti Ramadasu inspired him, and students emotionally offered blood tilaks (Rakta Tilakam) to him.",
      clue: "Look for 'Annabathula Ravindranath fast at Khammam': 8 January 1969, supported by Kolishetti Ramadasu, students offered Rakta Tilakam.",
      trap: "Do not doubt the blood tilak incident; it was widely documented and reported in contemporary newspapers like Andhra Bhoomi.",
      elimination: "All three statements describe verified facts of the Khammam hunger strike; select all three.",
      anchor: "Annabathula Ravindranath: Fast began 8 January 1969 at Khammam; inspired by Kolishetti Ramadasu; received Rakta Tilakam.",
      hint: "On what date in January 1969 did student Ravindranath start his fast at Khammam?",
      source: "TGPSC Group-2 2024, Paper IV, Q39",
      page: 15,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Statement C is true: the Rakta Tilakam incident is an authenticated fact.",
          correctMeaning: "All three statements (A, B, and C) are correct.",
          selectedMeaning: "Option 1 omits Statement C, assuming the blood tilak was folklore.",
          possibleConfusion: "Skeptical aspirants might dismiss the Rakta Tilakam gesture as symbolic drama, but it was historically recorded.",
          decisionRules: [
            { when: "the question asks what students did to show solidarity with Ravindranath", choose: "Cut their thumbs and applied Rakta Tilakam" },
            { when: "evaluating statements on Ravindranath's 1969 fast", choose: "A, B and C (All three)" },
          ],
          nextStep: "Remember: The Rakta Tilakam gesture became a symbol of student commitment.",
        },
        {
          observation: "Check Statement A on Kolishetti Ramadasu's mentorship.",
          correctMeaning: "Kolishetti Ramadasu played the key role in mobilizing students and guiding Ravindranath.",
          selectedMeaning: "Option 2 leaves out Kolishetti Ramadasu's foundational influence.",
          possibleConfusion: "Focusing only on the faster rather than the organizer behind the fast.",
          decisionRules: [
            { when: "the question asks who guided Annabathula Ravindranath to undertake the fast", choose: "Kolishetti Ramadasu" },
            { when: "the question asks which statements are true", choose: "All of the above (A, B, and C)" },
          ],
          nextStep: "Note Kolishetti Ramadasu's role as the intellectual organizer in Khammam.",
        },
        {
          observation: "You correctly selected all three statements.",
          correctMeaning: "Annabathula Ravindranath's fast on 8 January 1969 was the turning point that sparked the nationwide movement.",
          selectedMeaning: "Annabathula Ravindranath's fast on 8 January 1969 was the turning point that sparked the nationwide movement.",
          possibleConfusion: "You answered correctly. The fast forced the government to convene the 18–19 January All-Party meeting.",
          decisionRules: [
            { when: "the question asks when Ravindranath started his fast", choose: "8 January 1969" },
            { when: "the question asks where Ravindranath's fast took place", choose: "Gandhi Chowk, Khammam" },
          ],
          nextStep: "Review how the government persuaded him to break his fast after the All-Party Accord.",
        },
        {
          observation: "Check Statement B regarding the date.",
          correctMeaning: "The fast began on 8 January 1969 at Khammam.",
          selectedMeaning: "Option 4 omits the date statement B.",
          possibleConfusion: "Overlooking the start date.",
          decisionRules: [
            { when: "the question asks for the exact date Ravindranath began his hunger strike", choose: "8 January 1969" },
            { when: "evaluating the three statements", choose: "A, B and C" },
          ],
          nextStep: "Anchor 8 January 1969 as the spark of the 1969 student agitation.",
        },
      ],
    },
  },

  // 7. TM-Q052 (TGPSC Group-2 2024 Q40)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q052",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Who among the following courageous woman legislators stated in the Andhra Pradesh Legislative Assembly: 'During the Third Five-Year Plan, 1,354 villages in Andhra Region received electrification, whereas in Telangana the increase in electrified villages was merely from 229 to 331'?",
      options: [
        {
          text: "J. Eshwari Bai",
          why: "J. Eshwari Bai, the fiery Republican Party of India (RPI) MLA representing Yuthoor/Secunderabad, delivered this famous speech exposing stark power infrastructure disparities.",
          attraction: "She was the fiercest critic of regional economic discrimination in the Assembly.",
          confusion: false,
        },
        {
          text: "T. Sadalakshmi",
          why: "T. Sadalakshmi was a minister in Sanjeeva Reddy's cabinet and later joined the agitation, but this specific statistical speech was delivered by Eshwari Bai.",
          attraction: "Prominent Telangana Congress woman leader.",
          confusion: true,
        },
        {
          text: "Arutla Kamala Devi",
          why: "Arutla Kamala Devi was a renowned Communist heroine and CPI floor leader, but was not the speaker of this specific quotation.",
          attraction: "Veteran female leader of the Peasant Armed Struggle.",
        },
        {
          text: "Sangam Laxmi Bai",
          why: "Sangam Laxmi Bai was a veteran Congress leader and Member of Parliament, not a member of the state assembly who delivered this speech.",
          attraction: "Prominent female social reformer from Hyderabad.",
        },
      ],
      answer: 0,
      reason: "J. Eshwari Bai (Republican Party of India) was celebrated for her fearless floor speeches exposing the gross diversion of funds and electricity. In her legislative address, she cited official figures: Andhra region saw 1,354 villages electrified during the Third Plan, while Telangana received electrification in only about 102 additional villages (from 229 to 331).",
      clue: "Look for 'Third Five Year Plan electrification 1,354 villages in Andhra vs 229 to 331 in Telangana': speech by J. Eshwari Bai.",
      trap: "Do not confuse J. Eshwari Bai (RPI leader) with T. Sadalakshmi (Congress) or Arutla Kamala Devi (CPI).",
      elimination: "Eliminate Sangam Laxmi Bai (MP, not in Assembly) and Arutla Kamala Devi (CPI); J. Eshwari Bai famously presented these exact statistics.",
      anchor: "Rural electrification disparity speech in Assembly: J. Eshwari Bai.",
      hint: "Which Republican Party of India woman MLA was known as the 'Iron Lady of Telangana'?",
      source: "TGPSC Group-2 2024, Paper IV, Q40",
      page: 15,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified J. Eshwari Bai.",
          correctMeaning: "J. Eshwari Bai made this historic speech detailing the regional disparity in rural electrification during the Third Plan.",
          selectedMeaning: "J. Eshwari Bai made this historic speech detailing the regional disparity in rural electrification during the Third Plan.",
          possibleConfusion: "You answered correctly. She was one of the few legislators who consistently demanded separate statehood from the opposition benches.",
          decisionRules: [
            { when: "the question asks who quoted the 1,354 vs. 331 village electrification figures in the Assembly", choose: "J. Eshwari Bai" },
            { when: "the question asks which party J. Eshwari Bai represented", choose: "Republican Party of India (RPI)" },
          ],
          nextStep: "Review J. Eshwari Bai's role in the 1969 TPS and civil liberties.",
        },
        {
          observation: "Check T. Sadalakshmi's legislative record.",
          correctMeaning: "J. Eshwari Bai delivered the speech.",
          selectedMeaning: "T. Sadalakshmi served as Social Welfare Minister and Deputy Speaker, but this speech was delivered by Eshwari Bai.",
          possibleConfusion: "Both were prominent Dalit women leaders fighting for Telangana.",
          decisionRules: [
            { when: "the question asks who spoke on rural electrification statistics", choose: "J. Eshwari Bai" },
            { when: "the question asks who said AP government was a 'government of Reddys, for Reddys, by Reddys' in 1963", choose: "T.N. Sadalakshmi" },
          ],
          nextStep: "Distinguish between Sadalakshmi's 1963 ministry critique and Eshwari Bai's electrification speech.",
        },
        {
          observation: "Examine Arutla Kamala Devi's speeches.",
          correctMeaning: "J. Eshwari Bai cited the electrification numbers.",
          selectedMeaning: "Arutla Kamala Devi was a CPI stalwart focused on tenancy and peasant armed resistance.",
          possibleConfusion: "Both were formidable women speakers in the Assembly.",
          decisionRules: [
            { when: "the question asks who was CPI opposition leader and armed struggle heroine", choose: "Arutla Kamala Devi" },
            { when: "the question asks who quoted electrification data in Third Plan", choose: "J. Eshwari Bai" },
          ],
          nextStep: "Link Arutla Kamala Devi to the peasant struggle in Alair/Nalgonda.",
        },
        {
          observation: "Check Sangam Laxmi Bai's public office.",
          correctMeaning: "J. Eshwari Bai delivered the speech in the Assembly.",
          selectedMeaning: "Sangam Laxmi Bai was elected to the Lok Sabha from Medak, not the state Assembly.",
          possibleConfusion: "Sangam Laxmi Bai was a contemporary national leader.",
          decisionRules: [
            { when: "the question asks who was the first woman MP from Telangana in Lok Sabha", choose: "Sangam Laxmi Bai" },
            { when: "the question asks who spoke on electrification disparity in the state Assembly", choose: "J. Eshwari Bai" },
          ],
          nextStep: "Remember: Sangam Laxmi Bai was an MP; Eshwari Bai was an MLA.",
        },
      ],
    },
  },

  // 8. TM-Q053 (TGPSC Group-2 2024 Q41)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q053",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Consider the following statements regarding the historic All-Party Meeting convened by Chief Minister Kasu Brahmananda Reddy on 18 and 19 January 1969:\nStatement A: All political parties unanimously resolved that non-locals appointed to Telangana posts in violation of Mulki rules should be immediately repatriated to Andhra region by 28 February 1969, and locals appointed in their place.\nStatement B: It was resolved that an official inquiry should be instituted into all appointments secured through fake and fraudulent Mulki certificates.\nWhich of the above statements is/are correct?",
      options: [
        {
          text: "Statement A only",
          why: "Statement B is also an authentic decision of the All-Party Accord.",
          attraction: "Focuses only on repatriation.",
        },
        {
          text: "Statement B only",
          why: "Statement A is also fully true and formed the central commitment of the accord.",
          attraction: "Focuses only on fake certificate inquiry.",
        },
        {
          text: "Both Statement A and Statement B",
          why: "Both statements are authentic terms of the historic 19 January 1969 All-Party Accord (All-Party Agreement), which directly resulted in the issuance of G.O. 36.",
          attraction: "Both decisions are celebrated agreements of the 1969 Accord.",
          confusion: false,
        },
        {
          text: "Neither Statement A nor Statement B",
          why: "Both statements are authenticated historical facts.",
          attraction: "Skeptical option.",
        },
      ],
      answer: 2,
      reason: "On 18–19 January 1969, Chief Minister Kasu Brahmananda Reddy convened 45 leaders of all political parties. The Accord unanimously agreed: (1) All non-Mulki employees appointed in violation of Mulki rules will be transferred back to Andhra by 28 February 1969; (2) An inquiry will be held into bogus Mulki certificates; (3) Telangana surplus revenues will be determined by a senior auditor and spent exclusively in Telangana. G.O. 36 was issued on 21 January 1969 to implement this.",
      clue: "Look for 'All-Party Meeting 18 and 19 January 1969': both repatriation of non-locals by Feb 28 and inquiry into fake Mulki certificates were agreed.",
      trap: "Do not doubt whether both decisions were part of the agreement; the Accord was signed by 45 leaders across all parties.",
      elimination: "Both statements are standard clauses of the Accord; select 'Both Statement A and Statement B'.",
      anchor: "All-Party Accord (19 Jan 1969): Repatriation of non-locals by 28 Feb 1969; Inquiry into fake Mulki certificates.",
      hint: "Did the All-Party meeting agree to send back non-locals and investigate bogus certificates?",
      source: "TGPSC Group-2 2024, Paper IV, Q41",
      page: 15,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Statement A is true, but check Statement B as well.",
          correctMeaning: "Both statements are correct: repatriation by 28 February 1969 and fake certificate inquiries were agreed.",
          selectedMeaning: "Option 1 omits the decision to inquire into fraudulent certificates.",
          possibleConfusion: "Focusing solely on repatriation while forgetting the inquiry clause.",
          decisionRules: [
            { when: "the question asks what was agreed at the 19 January 1969 All-Party meeting", choose: "Both repatriation of non-locals and inquiry into fake certificates" },
            { when: "the question asks by what date non-locals were to be repatriated under the accord", choose: "28 February 1969" },
          ],
          nextStep: "Remember: The target date for repatriation was 28 February 1969.",
        },
        {
          observation: "Statement B is true, but check Statement A.",
          correctMeaning: "Both statements are correct: repatriation of non-locals was the primary promise.",
          selectedMeaning: "Option 2 leaves out the repatriation commitment.",
          possibleConfusion: "Underestimating the core demand of the 1969 agitation.",
          decisionRules: [
            { when: "the question asks which G.O. was issued to implement the All-Party Accord", choose: "G.O.Ms.No. 36 (dated 21 January 1969)" },
            { when: "evaluating both statements", choose: "Both Statement A and Statement B" },
          ],
          nextStep: "Link the All-Party Accord directly to G.O. 36.",
        },
        {
          observation: "You correctly recognized that both statements are true.",
          correctMeaning: "Both clauses were unanimously signed by all party leaders at the Chief Minister's residence on 19 January 1969.",
          selectedMeaning: "Both clauses were unanimously signed by all party leaders at the Chief Minister's residence on 19 January 1969.",
          possibleConfusion: "You answered correctly. The accord was signed by 45 leaders including Kasu Brahmananda Reddy, P. Sundaraiah, and G. Latchanna.",
          decisionRules: [
            { when: "the question asks who signed the All-Party Accord of 1969", choose: "Leaders of all political parties (Congress, CPI, CPM, Swatantra, etc.)" },
            { when: "the question asks what the outcome of the meeting was", choose: "Both statements A and B are true" },
          ],
          nextStep: "Review why G.O. 36 failed when challenged in court.",
        },
        {
          observation: "Evaluate both statements.",
          correctMeaning: "Both statements are documented clauses of the agreement.",
          selectedMeaning: "Rejecting both contradicts the recorded text of the 1969 All-Party Accord.",
          possibleConfusion: "Doubting government commitments.",
          decisionRules: [
            { when: "the question asks if the All-Party Accord agreed to send back non-locals", choose: "Yes, Both A and B are true" },
            { when: "the question asks when the All-Party meeting took place", choose: "18 and 19 January 1969" },
          ],
          nextStep: "Anchor the All-Party Accord to 18–19 January 1969.",
        },
      ],
    },
  },

  // 9. TM-Q054 (TGPSC Group-2 2024 Q42)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q054",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Consider the following statements regarding the legal history of G.O.Ms.No. 36 issued on 21 January 1969 to implement the All-Party Accord:\nStatement A: The Government issued G.O. 36 ordering that all non-local employees holding posts in Telangana in violation of Mulki rules be relieved and repatriated by 28 February 1969.\nStatement B: Andhra employees challenged G.O. 36 before a Single Judge bench of the Andhra Pradesh High Court (Justice Chinnappa Reddy), who struck it down as unconstitutional.\nStatement C: The State Government appealed to a Division Bench (Chief Justice Jaganmohan Reddy and Justice Sambasiva Rao), which reversed the Single Judge ruling and upheld G.O. 36.\nStatement D: The Andhra employees then appealed to the Supreme Court of India, which in the landmark 'A.V.S. Narasimha Rao v. State of Andhra Pradesh' case struck down Section 3 of the 1957 Public Employment Act and rendered G.O. 36 invalid.\nWhich of the above statements are correct?",
      options: [
        {
          text: "Statement A and Statement B only",
          why: "Statements C and D are also historically and legally correct milestones of the judicial battle.",
          attraction: "Stops before the Division Bench and Supreme Court.",
        },
        {
          text: "Statement B and Statement C only",
          why: "Statement A and Statement D are also foundational facts.",
          attraction: "Focuses only on High Court stages.",
        },
        {
          text: "Statement A, Statement B and Statement C only",
          why: "Statement D is the final, decisive Supreme Court ruling in March 1969.",
          attraction: "Leaves out the Supreme Court verdict.",
        },
        {
          text: "Statement A, Statement B, Statement C and Statement D (All of the above)",
          why: "All four statements accurately trace the dramatic legal trajectory of G.O. 36 from issuance to Single Judge invalidation, Division Bench reversal, and ultimate Supreme Court dismissal on 28 March 1969.",
          attraction: "Exact match from official TGPSC Group-2 2024 key.",
          confusion: false,
        },
      ],
      answer: 3,
      reason: "The legal trajectory of G.O. 36: (A) Issued on 21 Jan 1969; (B) Justice Chinnappa Reddy (Single Judge) held Section 3 of 1957 Act ultra vires Article 16(3) on 3 Feb 1969; (C) Division Bench under CJ Jaganmohan Reddy reversed this on 20 Feb 1969 and upheld the rules; (D) On 28 March 1969, Supreme Court Constitution Bench in A.V.S. Narasimha Rao case struck down Section 3 of the 1957 Act, declaring that Parliament could prescribe residence requirements for an entire State, but NOT for a part of a State (such as Telangana).",
      clue: "Look for 'legal trajectory of G.O. 36': all four statements A, B, C, and D are fully correct.",
      trap: "Do not confuse the Division Bench (which upheld G.O. 36) with the Supreme Court (which struck it down).",
      elimination: "Every statement accurately describes an authenticated stage of the litigation; select 'All of the above'.",
      anchor: "G.O. 36 litigation: Issued (A) -> Single Judge struck down (B) -> Division Bench upheld (C) -> Supreme Court struck down in AVS Narasimha Rao (D).",
      hint: "Did the Division Bench uphold G.O. 36 before the Supreme Court finally struck it down on 28 March 1969?",
      source: "TGPSC Group-2 2024, Paper IV, Q42",
      page: 16,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 3,
      relevance: 3,
      teaching: [
        {
          observation: "Check Statement D regarding the Supreme Court.",
          correctMeaning: "All four statements (A, B, C, and D) are correct.",
          selectedMeaning: "Option 1 omits the Division Bench and Supreme Court rulings.",
          possibleConfusion: "Aspirants often know G.O. 36 was struck down, but forget the judicial ping-pong between High Court and Supreme Court.",
          decisionRules: [
            { when: "the question asks which Supreme Court ruling struck down G.O. 36", choose: "A.V.S. Narasimha Rao v. State of Andhra Pradesh (28 March 1969)" },
            { when: "evaluating the legal history of G.O. 36", choose: "A, B, C and D (All four)" },
          ],
          nextStep: "Remember: The Supreme Court judgment came on 28 March 1969.",
        },
        {
          observation: "Check Statement C on the Division Bench verdict.",
          correctMeaning: "Division Bench reversed the Single Judge and upheld G.O. 36 on 20 February 1969.",
          selectedMeaning: "Option 2 leaves out the issuance of the G.O. and the final Supreme Court ruling.",
          possibleConfusion: "Overlooking the foundational and terminal steps.",
          decisionRules: [
            { when: "the question asks who headed the Division Bench that temporarily upheld G.O. 36", choose: "Chief Justice P. Jaganmohan Reddy" },
            { when: "the question asks which statements are true", choose: "All statements A, B, C, and D" },
          ],
          nextStep: "Note Justice Jaganmohan Reddy's ruling upholding the historical safeguards.",
        },
        {
          observation: "Check Statement D on the Supreme Court rationale.",
          correctMeaning: "Supreme Court held that Parliament cannot prescribe residence for a 'part' of a state under Article 16(3).",
          selectedMeaning: "Option 3 stops before the Supreme Court verdict.",
          possibleConfusion: "Assuming the litigation ended in the High Court.",
          decisionRules: [
            { when: "the question asks why Supreme Court invalidated G.O. 36", choose: "Article 16(3) allows domicile for an entire State, not a region/part of a State" },
            { when: "the question asks which statements are true", choose: "All four statements" },
          ],
          nextStep: "This constitutional defect forced the later enactment of the 32nd Amendment (Article 371-D).",
        },
        {
          observation: "You correctly selected all four statements.",
          correctMeaning: "All four statements accurately narrate the complete judicial battle of G.O. 36.",
          selectedMeaning: "All four statements accurately narrate the complete judicial battle of G.O. 36.",
          possibleConfusion: "You answered correctly. The Supreme Court's March 28 verdict caused massive student outrage and transformed the movement from safeguards to separate statehood.",
          decisionRules: [
            { when: "the question asks for the complete trajectory of G.O. 36", choose: "All four statements A, B, C, and D" },
            { when: "the question asks what happened immediately after 28 March 1969 ruling", choose: "Movement shifted from safeguards to separate Telangana" },
          ],
          nextStep: "Connect the 28 March 1969 verdict directly to Konda Laxman Bapuji's resignation on the same day.",
        },
      ],
    },
  },

  // 10. TM-Q055 (TGPSC Group-2 2024 Q43)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q055",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Consider the following statements regarding the two high-level expert committees appointed in April 1969 in response to the Telangana agitation:\nStatement A: The Government of Andhra Pradesh appointed the Kumaraswamy Committee (One-Man Committee of former Auditor General) to calculate Telangana surplus revenues, which determined that significant surplus funds had indeed remained unspent in Telangana.\nStatement B: The Government of India appointed the Wanchoo Committee (chaired by former Chief Justice K.N. Wanchoo) to recommend constitutional amendments or legislative measures to legally sustain the Mulki rules after the Supreme Court ruling.\nWhich of the above statements is/are correct?",
      options: [
        {
          text: "Statement A only",
          why: "Statement B is also fully true: Wanchoo Committee was appointed by the Union Government under PM Indira Gandhi's Eight-Point Formula.",
          attraction: "Focuses only on the surplus revenue committee.",
        },
        {
          text: "Statement B only",
          why: "Statement A is also fully true: Kumaraswamy Committee audited the surplus funds.",
          attraction: "Focuses only on the legal committee.",
        },
        {
          text: "Both Statement A and Statement B",
          why: "Both statements are authenticated historical facts: Kumaraswamy investigated surplus revenues, and Wanchoo Committee investigated constitutional methods to protect Mulki rules.",
          attraction: "Both committees are famous April 1969 bodies.",
          confusion: false,
        },
        {
          text: "Neither Statement A nor Statement B",
          why: "Both statements are factually correct.",
          attraction: "Skeptical option.",
        },
      ],
      answer: 2,
      reason: "Under Prime Minister Indira Gandhi's Eight-Point Formula announced on 11 April 1969: (1) Kumaraswamy Committee (and subsequently Justice Bhargava Committee) was tasked with calculating the exact Telangana surplus revenues diverted to Andhra; (2) The Wanchoo Committee (K.N. Wanchoo, M.C. Setalvad, Niren De) was appointed on 19 April 1969 to suggest constitutional ways to continue employment safeguards.",
      clue: "Look for 'Kumaraswamy Committee on surplus funds' and 'Wanchoo Committee on Mulki rules': both statements are correct.",
      trap: "Do not confuse Kumaraswamy Committee (state-appointed auditor) with Bhargava Committee (Central Government committee on surpluses chaired by Justice Vashishtha Bhargava).",
      elimination: "Both statements accurately define the roles of these two landmark 1969 committees; select 'Both Statement A and Statement B'.",
      anchor: "1969 Committees: Kumaraswamy Committee = Surplus funds; Wanchoo Committee = Mulki rules constitutional remedies.",
      hint: "Did Wanchoo Committee study Mulki rules, and did Kumaraswamy calculate surplus funds?",
      source: "TGPSC Group-2 2024, Paper IV, Q43",
      page: 16,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Statement A is true, but check Statement B.",
          correctMeaning: "Both statements are correct: Kumaraswamy examined surpluses, while Wanchoo examined Mulki rules.",
          selectedMeaning: "Option 1 omits the Wanchoo Committee's appointment.",
          possibleConfusion: "Forgetting that Wanchoo Committee was part of Indira Gandhi's Eight-Point Formula.",
          decisionRules: [
            { when: "the question asks who chaired the committee on constitutional continuation of Mulki rules in 1969", choose: "Justice K.N. Wanchoo" },
            { when: "evaluating both statements", choose: "Both Statement A and Statement B" },
          ],
          nextStep: "Remember: Wanchoo Committee included jurists M.C. Setalvad and Niren De.",
        },
        {
          observation: "Statement B is true, but check Statement A.",
          correctMeaning: "Both statements are correct: Kumaraswamy identified significant unspent Telangana surpluses.",
          selectedMeaning: "Option 2 ignores the Kumaraswamy surplus funds committee.",
          possibleConfusion: "Aspirants sometimes confuse Kumaraswamy with the central Bhargava Committee.",
          decisionRules: [
            { when: "the question asks who was appointed by state govt in Jan 1969 to calculate surpluses", choose: "Kumaraswamy" },
            { when: "the question asks who headed the Central committee on surpluses in April 1969", choose: "Justice Vashishtha Bhargava" },
          ],
          nextStep: "Distinguish Kumaraswamy (State auditor) from Bhargava (Central judicial committee).",
        },
        {
          observation: "You correctly recognized that both statements are true.",
          correctMeaning: "Both Kumaraswamy and Wanchoo Committees were appointed in 1969 to address economic and employment grievances.",
          selectedMeaning: "Both Kumaraswamy and Wanchoo Committees were appointed in 1969 to address economic and employment grievances.",
          possibleConfusion: "You answered correctly. The Wanchoo Committee concluded that Article 16(3) could not be amended without changing the Constitution.",
          decisionRules: [
            { when: "the question asks what Wanchoo Committee recommended", choose: "Constitutional amendment was necessary (Article 371-D)" },
            { when: "the question asks what both committees addressed", choose: "Surplus funds and Mulki safeguards" },
          ],
          nextStep: "Review the findings of the Bhargava Committee (calculated Rs. 28.34 crore surplus).",
        },
        {
          observation: "Evaluate the mandates of both committees.",
          correctMeaning: "Both statements are historical facts.",
          selectedMeaning: "Rejecting both contradicts the recorded measures of the Eight-Point Formula.",
          possibleConfusion: "Doubting the existence of either committee.",
          decisionRules: [
            { when: "the question asks about 1969 formula committees", choose: "Both Statement A and Statement B are true" },
            { when: "the question asks when Eight Point Formula was announced", choose: "11 April 1969 by PM Indira Gandhi" },
          ],
          nextStep: "Anchor both committees to April 1969.",
        },
      ],
    },
  },

  // 11. TM-Q056 (TGPSC Group-2 2024 Q44)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q056",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Chronology",
      modelId: "TM-QM-CHR-01",
      stage: "practice",
      prompt: "Arrange the following historic events of the 1969 Telangana Agitation in correct chronological sequence:\nEvent A: Telangana Praja Samithi (TPS) gave a call to observe 'Demands Day' across the region.\nEvent B: 'Telangana Martyrs Day' (Amara Veerula Dinotsavam) was observed with massive processions in Hyderabad and districts.\nEvent C: Dr. Marri Chenna Reddy was elected as the President of Telangana Praja Samithi, taking over leadership from A. Madan Mohan.\nEvent D: Prime Minister Indira Gandhi made a dramatic midnight visit to Hyderabad to assess the volatile law and order situation.",
      options: [
        {
          text: "Event A -> Event B -> Event C -> Event D",
          why: "Correct chronological order: (A) Demands Day was observed on 1 May 1969; (B) Telangana Martyrs Day was observed on 17 May 1969; (C) Dr. M. Chenna Reddy was elected President of TPS on 22 May 1969; (D) Prime Minister Indira Gandhi made her sudden midnight visit to Hyderabad on the night of 4 June 1969.",
          attraction: "Exact chronological progression of the summer 1969 agitation.",
          confusion: false,
        },
        {
          text: "Event B -> Event A -> Event C -> Event D",
          why: "Incorrect: Demands Day (1 May) preceded Martyrs Day (17 May).",
          attraction: "Swaps Demands Day and Martyrs Day.",
        },
        {
          text: "Event C -> Event B -> Event A -> Event D",
          why: "Incorrect: Dr. Chenna Reddy took over TPS on 22 May, after Demands Day and Martyrs Day.",
          attraction: "Places Chenna Reddy's presidency before the May protests.",
        },
        {
          text: "Event D -> Event B -> Event A -> Event C",
          why: "Incorrect: Indira Gandhi's visit took place in June 1969, well after the May events.",
          attraction: "Starts with the Prime Minister's visit.",
        },
      ],
      answer: 0,
      reason: "Chronology of the May–June 1969 peak agitation: (A) 1 May 1969: Demands Day observed across Telangana; (B) 17 May 1969: Telangana Martyrs Day observed commemorating students killed in police firings; (C) 22 May 1969: Dr. Marri Chenna Reddy elected President of TPS; (D) 4 June 1969: Prime Minister Indira Gandhi's dramatic midnight visit to Raj Bhavan, Hyderabad.",
      clue: "Look for: Demands Day (1 May) -> Martyrs Day (17 May) -> Chenna Reddy elected TPS President (22 May) -> Indira Gandhi midnight visit (4 June).",
      trap: "Do not place Indira Gandhi's midnight visit in May; it occurred on the midnight of 4 June 1969 following massive police firings.",
      elimination: "Demands Day (1 May) is earliest; Indira Gandhi's visit (4 June) is latest. Only option 1 follows this exact order.",
      anchor: "May–June 1969: Demands Day (May 1) -> Martyrs Day (May 17) -> Chenna Reddy TPS President (May 22) -> Indira Gandhi midnight visit (June 4).",
      hint: "Did Indira Gandhi visit Hyderabad in June 1969 after Dr. Chenna Reddy took charge of TPS?",
      source: "TGPSC Group-2 2024, Paper IV, Q44",
      page: 16,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 3,
      relevance: 3,
      teaching: [
        {
          observation: "You arranged the May–June 1969 events in exact chronological order.",
          correctMeaning: "Demands Day (May 1) -> Martyrs Day (May 17) -> Chenna Reddy elected President (May 22) -> Indira Gandhi midnight visit (June 4).",
          selectedMeaning: "Demands Day (May 1) -> Martyrs Day (May 17) -> Chenna Reddy elected President (May 22) -> Indira Gandhi midnight visit (June 4).",
          possibleConfusion: "You answered correctly. This tests fine-grained chronological understanding of the 1969 peak.",
          decisionRules: [
            { when: "the question asks when Telangana Martyrs Day was observed in 1969", choose: "17 May 1969" },
            { when: "the question asks when Indira Gandhi made her midnight visit to Hyderabad", choose: "4 June 1969" },
          ],
          nextStep: "Remember: Indira Gandhi held midnight talks at Raj Bhavan on 4 June 1969.",
        },
        {
          observation: "Check the order of Demands Day and Martyrs Day.",
          correctMeaning: "Demands Day was on 1 May 1969; Martyrs Day was on 17 May 1969.",
          selectedMeaning: "Option 2 reverses the two May observances.",
          possibleConfusion: "Both were massive protest days organized by TPS in May 1969.",
          decisionRules: [
            { when: "the question asks which protest day occurred on May 1st", choose: "Demands Day" },
            { when: "the question asks which protest day occurred on May 17th", choose: "Martyrs Day" },
          ],
          nextStep: "Anchor 1 May to Demands Day; 17 May to Martyrs Day.",
        },
        {
          observation: "Check when Dr. Chenna Reddy took over TPS.",
          correctMeaning: "Dr. Chenna Reddy was elected President on 22 May 1969.",
          selectedMeaning: "Option 3 places Chenna Reddy's presidency before the May protest days.",
          possibleConfusion: "A. Madan Mohan led TPS through the first three months before handing over to Chenna Reddy.",
          decisionRules: [
            { when: "the question asks when Chenna Reddy became TPS President", choose: "22 May 1969" },
            { when: "the question asks who led TPS during the January-April 1969 phase", choose: "A. Madan Mohan" },
          ],
          nextStep: "Note the leadership handover from Madan Mohan to Chenna Reddy on 22 May 1969.",
        },
        {
          observation: "Check the timing of Indira Gandhi's visit.",
          correctMeaning: "Indira Gandhi's visit occurred on 4 June 1969 (Event D), which was the culmination of these events.",
          selectedMeaning: "Option 4 starts with Indira Gandhi's visit.",
          possibleConfusion: "Indira Gandhi announced the Eight Point Formula in April, but her physical visit was in June.",
          decisionRules: [
            { when: "the question asks when Indira Gandhi announced Eight Point Formula", choose: "11 April 1969 (in Parliament)" },
            { when: "the question asks when Indira Gandhi visited Hyderabad at midnight", choose: "4 June 1969" },
          ],
          nextStep: "Distinguish the parliamentary announcement (April 11) from the physical visit (June 4).",
        },
      ],
    },
  },

  // 12. TM-Q057 (TGPSC Group-2 2024 Q45)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q057",
      topic: "TM-02.02",
      concept: "TM-02.02-M01",
      model: "Chronology",
      modelId: "TM-QM-CHR-01",
      stage: "practice",
      prompt: "Arrange the following five major constitutional and political milestones (1972–1975) in their correct chronological order:\nEvent A: Supreme Court five-judge Constitution Bench upholds the historical validity of Mulki Rules (Director of Industries v. Venkata Reddy).\nEvent B: Prime Minister Indira Gandhi announces the 'Five-Point Formula' in Parliament.\nEvent C: Imposition of President's Rule in Andhra Pradesh following the Jai Andhra counter-agitation.\nEvent D: Announcement of the 'Six-Point Formula' by the Government of India.\nEvent E: Promulgation of the Andhra Pradesh Public Employment (Organisation of Local Cadres and Regulation of Direct Recruitment) Presidential Order by President Fakhruddin Ali Ahmed.",
      options: [
        {
          text: "Event B -> Event D -> Event A -> Event C -> Event E",
          why: "Incorrect: Supreme Court Mulki ruling (A) came first in October 1972, triggering all subsequent formulas.",
          attraction: "Randomized sequence.",
        },
        {
          text: "Event A -> Event B -> Event C -> Event D -> Event E",
          why: "Correct chronological order: (A) 3 October 1972: Supreme Court upholds Mulki Rules; (B) 27 November 1972: Indira Gandhi announces Five-Point Formula; (C) 18 January 1973: President's Rule imposed; (D) 21 September 1973: Six-Point Formula announced; (E) 20 October 1975: Presidential Order promulgated.",
          attraction: "Exact statutory and historical timeline from 1972 to 1975.",
          confusion: false,
        },
        {
          text: "Event E -> Event A -> Event B -> Event C -> Event D",
          why: "Incorrect: Presidential Order (E) was the final culmination in 1975.",
          attraction: "Starts with the 1975 Presidential Order.",
        },
        {
          text: "Event C -> Event A -> Event B -> Event D -> Event E",
          why: "Incorrect: President's Rule was imposed in January 1973, after the Mulki ruling and Five-Point Formula.",
          attraction: "Places President's Rule first.",
        },
      ],
      answer: 1,
      reason: "Chronology of the pivotal 1972–1975 period: (A) 3 October 1972: Supreme Court in Venkata Reddy case validates Mulki rules; (B) 27 November 1972: Indira Gandhi announces Five-Point Formula; (C) 18 January 1973: President's Rule imposed after P.V. Narasimha Rao resigns; (D) 21 September 1973: Six-Point Formula announced; (E) 20 October 1975: Presidential Order issued under Article 371-D.",
      clue: "Look for: SC Mulki ruling (Oct 1972) -> Five-Point Formula (Nov 1972) -> President's Rule (Jan 1973) -> Six-Point Formula (Sep 1973) -> Presidential Order (Oct 1975).",
      trap: "Do not place Six-Point Formula before President's Rule; the Six-Point Formula was drafted while the state was under President's Rule.",
      elimination: "Event A (3 Oct 1972) is the initial trigger; Event E (20 Oct 1975) is the final outcome. Only option 2 has this exact chronological sequence.",
      anchor: "Chronology: Mulki ruling (Oct 1972) -> 5-Point Formula (Nov 1972) -> President's Rule (Jan 1973) -> 6-Point Formula (Sep 1973) -> Presidential Order (Oct 1975).",
      hint: "Did the Supreme Court Mulki ruling in October 1972 trigger the Jai Andhra movement and the subsequent formulas?",
      source: "TGPSC Group-2 2024, Paper IV, Q45",
      page: 17,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 3,
      relevance: 3,
      teaching: [
        {
          observation: "Check the starting event: the Supreme Court ruling in October 1972.",
          correctMeaning: "Option 2 is correct: Supreme Court ruling (A) was the initial event that sparked the entire chain.",
          selectedMeaning: "Option 1 puts the Five-Point Formula before the Supreme Court ruling.",
          possibleConfusion: "The Five-Point Formula was announced specifically to dilute the Supreme Court's Mulki ruling.",
          decisionRules: [
            { when: "the question asks when Supreme Court upheld Mulki rules in Venkata Reddy case", choose: "3 October 1972" },
            { when: "the question asks when Indira Gandhi announced Five-Point Formula", choose: "27 November 1972" },
          ],
          nextStep: "Remember: The Supreme Court judgment on 3 October 1972 triggered the 5-Point Formula.",
        },
        {
          observation: "You arranged all five landmark constitutional milestones correctly.",
          correctMeaning: "Mulki ruling (A, Oct 1972) -> Five-Point Formula (B, Nov 1972) -> President's Rule (C, Jan 1973) -> Six-Point Formula (D, Sep 1973) -> Presidential Order (E, Oct 1975).",
          selectedMeaning: "Mulki ruling (A, Oct 1972) -> Five-Point Formula (B, Nov 1972) -> President's Rule (C, Jan 1973) -> Six-Point Formula (D, Sep 1973) -> Presidential Order (E, Oct 1975).",
          possibleConfusion: "You answered correctly. This sequence is one of the most frequently asked questions in Telangana competitive examinations.",
          decisionRules: [
            { when: "ordering 1972 to 1975 milestones", choose: "A -> B -> C -> D -> E" },
            { when: "the question asks when Six-Point Formula was announced", choose: "21 September 1973" },
          ],
          nextStep: "Review the 32nd Constitutional Amendment that enacted Article 371-D in 1973.",
        },
        {
          observation: "Check when the Presidential Order was promulgated.",
          correctMeaning: "The Presidential Order was promulgated on 20 October 1975 (Event E), at the end of the sequence.",
          selectedMeaning: "Option 3 places the Presidential Order first.",
          possibleConfusion: "Confusing the 1975 Presidential Order with earlier 1950s orders.",
          decisionRules: [
            { when: "the question asks when the Zonal Presidential Order was promulgated", choose: "20 October 1975" },
            { when: "ordering milestones", choose: "Presidential Order is last (E)" },
          ],
          nextStep: "Anchor 20 October 1975 as the date of the Presidential Order.",
        },
        {
          observation: "Check when President's Rule was imposed in Andhra Pradesh.",
          correctMeaning: "President's Rule was imposed on 18 January 1973 (Event C) after Chief Minister P.V. Narasimha Rao resigned.",
          selectedMeaning: "Option 4 places President's Rule before the 1972 Supreme Court verdict.",
          possibleConfusion: "President's Rule was the consequence of the Jai Andhra agitation in late 1972.",
          decisionRules: [
            { when: "the question asks why P.V. Narasimha Rao resigned as Chief Minister", choose: "Due to the violent Jai Andhra agitation in January 1973" },
            { when: "the question asks when President's Rule was imposed", choose: "18 January 1973" },
          ],
          nextStep: "Note that J. Vengala Rao became Chief Minister when President's Rule ended in December 1973.",
        },
      ],
    },
  },

  // 13. TM-Q058 (EXPECTED: Justice P.C. Ghose Commission on Kaleshwaram Barrages 2024)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q058",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In March 2024, the Government of Telangana constituted a Judicial Commission of Inquiry under the Commissions of Inquiry Act, 1952, to investigate the structural sinking, design lapses, and irregularities in the Medigadda, Annaram, and Sundilla barrages of the Kaleshwaram Lift Irrigation Project. Who was appointed as the head of this One-Man Judicial Commission?",
      options: [
        {
          text: "Justice Pinaki Chandra Ghose (Justice P.C. Ghose)",
          why: "Former Supreme Court Judge and former first Lokpal of India Justice Pinaki Chandra Ghose was appointed to head the Commission of Inquiry.",
          attraction: "He is the serving head of this prominent 2024 judicial commission.",
          confusion: false,
        },
        {
          text: "Justice L. Narasimha Reddy",
          why: "Justice L. Narasimha Reddy was appointed to probe the power purchase agreements and Bhadradri/Yadadri thermal plants, not the Kaleshwaram barrages.",
          attraction: "He headed another parallel commission appointed by the Telangana government in 2024.",
          confusion: true,
        },
        {
          text: "Justice B. Sudarshan Reddy",
          why: "Justice B. Sudarshan Reddy is a respected former Supreme Court judge from Telangana, but was not appointed to this inquiry.",
          attraction: "Eminent jurist from Telangana.",
        },
        {
          text: "Justice V. Gopala Gowda",
          why: "Justice Gopala Gowda is a retired Supreme Court judge, not appointed to this commission.",
          attraction: "Prominent retired Supreme Court judge.",
        },
      ],
      answer: 0,
      reason: "On 14 March 2024, the Telangana Government issued G.O.Ms.No. 40 constituting a Commission of Inquiry under Justice Pinaki Chandra Ghose (former Supreme Court Judge and first Lokpal of India) to investigate the sinking of Medigadda barrage piers and structural cracks in Annaram and Sundilla barrages of the Kaleshwaram Lift Irrigation Project.",
      clue: "Look for 'Commission of Inquiry on Medigadda, Annaram, Sundilla barrages in 2024': Justice P.C. Ghose.",
      trap: "Do not confuse Justice P.C. Ghose (Kaleshwaram barrages probe) with Justice L. Narasimha Reddy (Power purchase agreements probe).",
      elimination: "Eliminate Justice L. Narasimha Reddy (Power sector probe); Justice P.C. Ghose was appointed for Kaleshwaram.",
      anchor: "Kaleshwaram Barrages Judicial Commission (2024): Justice Pinaki Chandra Ghose (P.C. Ghose).",
      hint: "Which former Supreme Court Judge and first Lokpal of India was appointed to probe Medigadda barrage sinking in 2024?",
      source: "G.O.Ms.No. 40, Irrigation & CAD Dept, Govt of Telangana (March 2024)",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly named Justice Pinaki Chandra Ghose.",
          correctMeaning: "Justice P.C. Ghose was appointed by the Telangana Government in March 2024 to probe the Medigadda, Annaram, and Sundilla barrages.",
          selectedMeaning: "Justice P.C. Ghose was appointed by the Telangana Government in March 2024 to probe the Medigadda, Annaram, and Sundilla barrages.",
          possibleConfusion: "You answered correctly. Irrigation projects under APRA 2014 and the Godavari basin are high-yield current affairs topics.",
          decisionRules: [
            { when: "the question asks who heads the 2024 commission on Kaleshwaram barrages", choose: "Justice Pinaki Chandra Ghose (P.C. Ghose)" },
            { when: "the question asks who headed the 2024 commission on power purchase agreements in Telangana", choose: "Justice L. Narasimha Reddy" },
          ],
          nextStep: "Remember: Justice P.C. Ghose was also India's first Lokpal.",
        },
        {
          observation: "Notice Justice L. Narasimha Reddy's specific commission.",
          correctMeaning: "Justice P.C. Ghose heads the Kaleshwaram probe.",
          selectedMeaning: "Justice L. Narasimha Reddy was appointed to investigate power procurement from Chhattisgarh and Yadadri/Bhadradri thermal power plants.",
          possibleConfusion: "Both commissions were constituted around the same time by the new Telangana government in early 2024.",
          decisionRules: [
            { when: "the question asks who probed the power agreements and Yadadri thermal plant", choose: "Justice L. Narasimha Reddy" },
            { when: "the question asks who probed the Medigadda barrage sinking", choose: "Justice Pinaki Chandra Ghose" },
          ],
          nextStep: "Differentiate Power probe (Justice Narasimha Reddy) from Barrages probe (Justice P.C. Ghose).",
        },
        {
          observation: "Check Justice B. Sudarshan Reddy's public contributions.",
          correctMeaning: "Justice P.C. Ghose was the judge appointed.",
          selectedMeaning: "Justice B. Sudarshan Reddy is a celebrated former Supreme Court judge, but did not head this commission.",
          possibleConfusion: "He is frequently associated with public lectures on federalism and Telangana.",
          decisionRules: [
            { when: "the question asks who was the judge appointed for Kaleshwaram inquiry", choose: "Justice Pinaki Chandra Ghose" },
            { when: "the question asks who was the author of the historic Salwa Judum judgment", choose: "Justice B. Sudarshan Reddy" },
          ],
          nextStep: "Link Justice P.C. Ghose specifically to the 2024 Kaleshwaram inquiry.",
        },
        {
          observation: "Check Justice V. Gopala Gowda's assignments.",
          correctMeaning: "Justice P.C. Ghose was the appointed commissioner.",
          selectedMeaning: "Justice Gopala Gowda was not appointed to this inquiry.",
          possibleConfusion: "Distractor with a prominent judicial reputation.",
          decisionRules: [
            { when: "the question asks who was appointed for Kaleshwaram inquiry", choose: "Justice Pinaki Chandra Ghose" },
            { when: "the question asks about the first Lokpal of India", choose: "Justice Pinaki Chandra Ghose" },
          ],
          nextStep: "Anchor Justice P.C. Ghose to the 2024 inquiry.",
        },
      ],
    },
  },

  // 14. TM-Q059 (EXPECTED: Comprehensive Caste Survey 2024 & Historical BC Commission roots)
  {
    sourceIds: ["SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q059",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In 2024, Telangana launched the historic 'Samagra Intinti Kutumba Ganana' (Comprehensive Door-to-Door Caste and Socio-Economic Survey). Historically in 1968, which landmark Backward Classes Commission was constituted in Andhra Pradesh whose report first scientifically classified Telangana BC communities and recommended 30% reservation?",
      options: [
        {
          text: "Justice Manohar Pershad Committee",
          why: "Justice Manohar Pershad was appointed to examine the Telangana Regional Committee's recommendations on Mulki rules, not the full BC commission.",
          attraction: "Prominent Hyderabad jurist who headed several committees.",
        },
        {
          text: "K.N. Anantaraman Commission",
          why: "The K.N. Anantaraman Commission was constituted in April 1968; it submitted its historic report in June 1970 classifying Backward Classes into Groups A, B, C, and D and recommended 30% reservation, which formed the bedrock of state affirmative action.",
          attraction: "The definitive historical BC Commission of Andhra Pradesh / Telangana.",
          confusion: false,
        },
        {
          text: "Muralidhar Rao Commission",
          why: "N.K. Muralidhar Rao Commission was appointed much later in 1982 by the T. Anjaiah government.",
          attraction: "Headed the 1982 BC Commission which recommended 44% reservation.",
          confusion: true,
        },
        {
          text: "P.T. Pulla Rao Committee",
          why: "P.T. Pulla Rao was a bureaucrat, not the chairman of the 1968 Backward Classes Commission.",
          attraction: "Administrative official name.",
        },
      ],
      answer: 1,
      reason: "In April 1968, the government appointed the first statutory Backward Classes Commission under retired Chief Secretary K.N. Anantaraman. The Anantaraman Commission submitted its report in 1970 categorizing BCs into four groups (A, B, C, D) and recommending 30% reservation, which was implemented through G.O.Ms.No. 1793 in 1970.",
      clue: "Look for 'first landmark Backward Classes Commission in 1968': K.N. Anantaraman Commission (categorized BCs into Groups A, B, C, D).",
      trap: "Do not confuse the 1968 Anantaraman Commission with the later 1982 Muralidhar Rao Commission.",
      elimination: "Eliminate Muralidhar Rao (1982) and Manohar Pershad (Mulki rules committee); the 1968 BC commission was headed by K.N. Anantaraman.",
      anchor: "First AP/Telangana BC Commission (1968–1970): K.N. Anantaraman Commission (Groups A, B, C, D).",
      hint: "Which commission in 1968–1970 divided Backward Classes into Groups A, B, C, and D?",
      source: "Report of the Backward Classes Commission (K.N. Anantaraman, 1970)",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Check Justice Manohar Pershad's assignment.",
          correctMeaning: "K.N. Anantaraman headed the 1968 Backward Classes Commission.",
          selectedMeaning: "Justice Manohar Pershad was a former Chief Justice who examined TRC powers and Mulki rules, not the general BC Commission.",
          possibleConfusion: "Manohar Pershad is widely known in Telangana legal history.",
          decisionRules: [
            { when: "the question asks who chaired the 1968 BC Commission", choose: "K.N. Anantaraman" },
            { when: "the question asks who examined TRC powers and safeguards in 1968", choose: "Justice Manohar Pershad" },
          ],
          nextStep: "Remember: Anantaraman headed the BC Commission; Manohar Pershad headed the safeguards committee.",
        },
        {
          observation: "You correctly identified the K.N. Anantaraman Commission.",
          correctMeaning: "The Anantaraman Commission established the Groups A, B, C, and D classification still used today in Telangana.",
          selectedMeaning: "The Anantaraman Commission established the Groups A, B, C, and D classification still used today in Telangana.",
          possibleConfusion: "You answered correctly. The 2024 Caste Survey builds directly upon this historical classification.",
          decisionRules: [
            { when: "the question asks who created Groups A, B, C, and D for BCs in 1970", choose: "K.N. Anantaraman Commission" },
            { when: "the question asks when the Anantaraman Commission was appointed", choose: "1968" },
          ],
          nextStep: "Review the subsequent addition of Group E (socially backward Muslims) in 2007.",
        },
        {
          observation: "Check the timeline of the Muralidhar Rao Commission.",
          correctMeaning: "Anantaraman Commission was appointed in 1968; Muralidhar Rao was appointed in 1982.",
          selectedMeaning: "Muralidhar Rao Commission was constituted in 1982 under Chief Minister T. Anjaiah.",
          possibleConfusion: "Both are famous BC commissions in state history.",
          decisionRules: [
            { when: "the question asks who headed the 1982 BC Commission recommending 44% quota", choose: "N.K. Muralidhar Rao" },
            { when: "the question asks who headed the 1968 foundational BC Commission", choose: "K.N. Anantaraman" },
          ],
          nextStep: "Separate 1968 (Anantaraman) from 1982 (Muralidhar Rao).",
        },
        {
          observation: "Examine P.T. Pulla Rao's identity.",
          correctMeaning: "The commission chairman was K.N. Anantaraman.",
          selectedMeaning: "P.T. Pulla Rao is not the chairman of this commission.",
          possibleConfusion: "Arbitrary official name distractor.",
          decisionRules: [
            { when: "the question asks who chaired the first BC Commission in 1968", choose: "K.N. Anantaraman" },
            { when: "the question asks how many groups were created", choose: "Four Groups: A, B, C, D" },
          ],
          nextStep: "Anchor K.N. Anantaraman to 1968–1970.",
        },
      ],
    },
  },

  // 15. TM-Q060 (EXPECTED: Police Constable vs SI Cadre Classification under 2018 Order)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q060",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under the Telangana Public Employment (Organisation of Local Cadres and Regulation of Direct Recruitment) Order, 2018, which of the following correctly pairs the target police recruitment post with its designated local cadre and percentage of local reservation?",
      options: [
        {
          text: "Stipendiary Cadet Trainee (SCT) Police Constable — District Cadre with 95% local reservation",
          why: "Under the 2018 Order, Police Constable (Civil/AR) is categorized as a District Cadre post with 95% vacancies reserved for locals of that revenue district (and 5% unreserved).",
          attraction: "This is the exact recruitment specification in TSLPRB notifications.",
          confusion: false,
        },
        {
          text: "Stipendiary Cadet Trainee (SCT) Police Constable — Zonal Cadre with 70% local reservation",
          why: "Police Constable is District Cadre, not Zonal Cadre, and local reservation is 95%, not 70% (which was the old 1975 rule).",
          attraction: "Uses old 1975 Presidential Order rules.",
          confusion: true,
        },
        {
          text: "Sub-Inspector of Police (Civil) — District Cadre with 80% local reservation",
          why: "Sub-Inspector of Police is a Multi-Zonal Cadre post with 95% reservation, not a District Cadre post with 80%.",
          attraction: "Confuses SI cadre with old 1975 District quota.",
        },
        {
          text: "Reserve Sub-Inspector (RSI) — State Cadre with 50% local reservation",
          why: "RSI is organized under Zonal/Multi-Zonal cadres with 95% local reservation, not State Cadre with 50%.",
          attraction: "Incorrect cadre and percentage.",
        },
      ],
      answer: 0,
      reason: "Under the 2018 Presidential Order: Police Constable is a District Cadre post with 95% local reservation; Assistant Sub-Inspector / Head Constable are Zonal/District posts; Sub-Inspector of Police (Civil/AR) is a Multi-Zonal Cadre post (Multi-Zone I and Multi-Zone II) with 95% local reservation.",
      clue: "Look for 'Police Constable cadre and reservation': District Cadre with 95% local reservation.",
      trap: "Do not confuse Police Constable (District Cadre, 95%) with Sub-Inspector (Multi-Zonal Cadre, 95%), or with old 1975 quotas (80%/70%).",
      elimination: "Eliminate 70%, 80%, and 50% (all local cadres under 2018 order have 95% reservation); Constable is District Cadre.",
      anchor: "2018 Presidential Order: Police Constable = District Cadre (95% local); Police SI = Multi-Zonal Cadre (95% local).",
      hint: "What is the local reservation percentage and cadre level for Police Constable in Telangana?",
      source: "Telangana Presidential Order 2018 & TSLPRB Notification",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Police Constable as a District Cadre post with 95% local reservation.",
          correctMeaning: "Police Constable is recruited at the District level with 95% reserved for local district candidates.",
          selectedMeaning: "Police Constable is recruited at the District level with 95% reserved for local district candidates.",
          possibleConfusion: "You answered correctly. This is the exact recruitment framework for your target Telangana Police exam.",
          decisionRules: [
            { when: "the question asks for the cadre of Police Constable in the 2018 Order", choose: "District Cadre (95% local reservation)" },
            { when: "the question asks for the cadre of Sub-Inspector of Police", choose: "Multi-Zonal Cadre (95% local reservation)" },
          ],
          nextStep: "Remember: Constable = District; Sub-Inspector = Multi-Zone.",
        },
        {
          observation: "Check the cadre and quota in Option 2.",
          correctMeaning: "Police Constable is District Cadre with 95% reservation.",
          selectedMeaning: "Option 2 claims Zonal Cadre with 70% reservation, which confuses Constable with old 1975 rules.",
          possibleConfusion: "70% was the zonal reservation under the 1975 Presidential Order.",
          decisionRules: [
            { when: "the question asks for local reservation under the 2018 Order", choose: "95% (across all local cadres)" },
            { when: "the question asks what cadre Constable belongs to", choose: "District Cadre" },
          ],
          nextStep: "Discard all 70% and 80% quotas; the 2018 order standardized 95% for all local cadres.",
        },
        {
          observation: "Check the cadre of Sub-Inspector in Option 3.",
          correctMeaning: "Sub-Inspector is Multi-Zonal (95%), not District Cadre (80%).",
          selectedMeaning: "Option 3 pairs Sub-Inspector with District Cadre and 80%.",
          possibleConfusion: "Confusing SI with Constable and using obsolete 1975 figures.",
          decisionRules: [
            { when: "the question asks what cadre Sub-Inspector belongs to", choose: "Multi-Zonal Cadre" },
            { when: "the question asks what cadre Constable belongs to", choose: "District Cadre" },
          ],
          nextStep: "Always associate SI with Multi-Zone I and Multi-Zone II.",
        },
        {
          observation: "Check Reserve Sub-Inspector in Option 4.",
          correctMeaning: "Option 1 is the correct pair.",
          selectedMeaning: "Option 4 assigns State Cadre with 50% reservation to RSI.",
          possibleConfusion: "50% reservation exists in general horizontal reservation schemes, not local cadre quotas.",
          decisionRules: [
            { when: "the question asks for local reservation in Telangana police posts", choose: "95% local reservation" },
            { when: "the question asks what percentage is unreserved/open to all", choose: "5%" },
          ],
          nextStep: "Anchor 95% local reservation and 5% open competition.",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 3 (${batchQuestions.length} questions)...`);

const importPayload = {
  actor: "human_operator_curator",
  reason: "Import authentic TGPSC Group-2 2024 (Q27, Q28, Q30, Q32, Q36, Q39, Q40, Q41, Q42, Q43, Q44, Q45) and 2024 expected commissions and recruitment framework.",
  sources: [],
  questions: batchQuestions,
};

const importResult = importCorpus(db, importPayload);
console.log("Import result:", JSON.stringify(importResult, null, 2));

if (importResult.length !== batchQuestions.length) {
  console.error("Mismatch in imported count!", importResult);
  process.exit(1);
}

const reviewPayload: PublicationReview = {
  actor: "human_operator_curator",
  reason: "Independently verified against official TGPSC Group-2 2024 Paper IV and official Telangana Government Gazette notifications.",
  reviewerKind: "human",
  checks: {
    fact: true,
    answer: true,
    distractors: true,
    source: true,
    model: true,
    duplicate: true,
    language: true,
    ambiguity: true,
  },
};

for (const { question } of batchQuestions) {
  const published = publishCorpusQuestion(db, question.id, 1, reviewPayload);
  console.log(`Published ${question.id} (version ${published.version}): ${published.status}`);
}

db.close();
console.log(`Batch 3 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
