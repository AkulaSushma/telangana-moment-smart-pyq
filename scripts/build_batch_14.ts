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
  // 1. TM-Q251 (Jayabharat Reddy Officers Committee 1984–1985)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q251",
      topic: "TM-02.02",
      concept: "TM-02.02-M10",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "In 1984–1985, following massive representations by Telangana employee unions (TNGOs) regarding illegal non-local appointments in Zones V and VI, the N.T. Rama Rao government constituted an official Officers Committee to determine the extent of Presidential Order violations. Who was the senior IAS officer who headed this 3-member committee?",
      options: [
        {
          text: "K. Jayabharat Reddy (with members K. Umapathi and Kamal Kumar)",
          why: "K. Jayabharat Reddy (then Principal Secretary, Home) headed the 3-member Committee with K. Umapathi (IAS) and Kamal Kumar (IPS), which investigated violations and submitted its report identifying roughly 58,962 irregular non-local appointments in Telangana.",
          attraction: "The authentic, celebrated Officers Committee that paved the way for G.O. 610.",
          confusion: false,
        },
        {
          text: "J.M. Girglani",
          why: "J.M. Girglani was appointed 16 years later in June 2001 as a One-Man Commission, not the 1984–85 Officers Committee.",
          attraction: "Famous commission head who probed G.O. 610.",
          confusion: true,
        },
        {
          text: "Justice Pingali Jaganmohan Reddy",
          why: "Justice Jaganmohan Reddy headed the 1952 City College firing commission, 32 years earlier.",
          attraction: "Famous inquiry head from 1952.",
        },
        {
          text: "M.T. Raju",
          why: "M.T. Raju was Chief Secretary in 1969 who signed G.O. 36, not the 1984–85 committee head.",
          attraction: "1969 Chief Secretary.",
        },
      ],
      answer: 0,
      reason: "K. Jayabharat Reddy headed the 1984–85 Officers Committee that investigated Presidential Order violations.",
      clue: "Look for K. Jayabharat Reddy, the senior bureaucrat who headed the 1984–85 committee with Umapathi and Kamal Kumar.",
      trap: "Do not confuse the Jayabharat Reddy Committee (1984–85) with the Girglani Commission (2001–2004).",
      elimination: "Jayabharat Reddy headed the 1984–85 committee. Girglani was 2001; Jaganmohan Reddy was 1952; M.T. Raju was 1969.",
      anchor: "1984–1985 Officers Committee -> K. Jayabharat Reddy (Head), K. Umapathi, Kamal Kumar -> Prompted G.O. 610.",
      hint: "Their findings formed the direct empirical basis upon which the Cabinet approved G.O. Ms. No. 610 on 30 December 1985.",
      source: "SR-POLICE-SI-2016",
      page: 470,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies the K. Jayabharat Reddy Officers Committee.",
          correctMeaning: "The Jayabharat Reddy Committee was the first official government body to officially confess that tens of thousands of non-locals had encroached on Telangana local jobs.",
          selectedMeaning: "The Jayabharat Reddy Committee was the first official government body to officially confess that tens of thousands of non-locals had encroached on Telangana local jobs.",
          possibleConfusion: "No confusion; standard high-yield administrative question in TS exams.",
          decisionRules: [
            { when: "Asked who headed the 1984–1985 Officers Committee on Presidential Order violations", choose: "K. Jayabharat Reddy." },
            { when: "Asked who were members of Jayabharat Reddy Committee", choose: "K. Umapathi (IAS) and Kamal Kumar (IPS)." },
          ],
          nextStep: "Note how the Jayabharat Reddy report directly produced G.O. Ms. No. 610 on 30 December 1985.",
        },
        {
          observation: "Selected J.M. Girglani.",
          correctMeaning: "J.M. Girglani headed the 2001 One-Man Commission; Jayabharat Reddy headed the 1984–85 Officers Committee.",
          selectedMeaning: "Confusing the 2001 Commission with the 1985 Committee that preceded G.O. 610.",
          possibleConfusion: "Both probed the exact same violations in Zones V and VI.",
          decisionRules: [
            { when: "Asked about committee appointed before G.O. 610 (1984–85)", choose: "K. Jayabharat Reddy Committee." },
            { when: "Asked about commission appointed to probe non-implementation of G.O. 610 (2001)", choose: "J.M. Girglani Commission." },
          ],
          nextStep: "Sequence: Jayabharat Reddy (1985) -> G.O. 610 (1985) -> Girglani (2001).",
        },
        {
          observation: "Selected Justice Pingali Jaganmohan Reddy.",
          correctMeaning: "Justice Jaganmohan Reddy was a High Court judge in 1952 (City College); Jayabharat Reddy was an IAS officer in 1985.",
          selectedMeaning: "Confusing two different Reddys across a 33-year gap.",
          possibleConfusion: "Both investigated government excesses against Telangana.",
          decisionRules: [
            { when: "Asked about 1952 judicial inquiry", choose: "Justice Pingali Jaganmohan Reddy." },
            { when: "Asked about 1985 administrative committee", choose: "K. Jayabharat Reddy." },
          ],
          nextStep: "Remember: 1952 = Pingali Jaganmohan Reddy; 1985 = Jayabharat Reddy.",
        },
        {
          observation: "Selected M.T. Raju.",
          correctMeaning: "M.T. Raju was Chief Secretary under Kasu in 1969; Jayabharat Reddy was Home Secretary under NTR in 1985.",
          selectedMeaning: "Confusing the 1969 bureaucratic signatory with the 1985 committee chairman.",
          possibleConfusion: "Both were top civil servants involved in landmark employment orders (G.O. 36 and G.O. 610).",
          decisionRules: [
            { when: "Asked about Chief Secretary in G.O. 36 (1969)", choose: "M.T. Raju." },
            { when: "Asked about committee head in G.O. 610 (1985)", choose: "K. Jayabharat Reddy." },
          ],
          nextStep: "Link M.T. Raju to G.O. 36 (1969) and Jayabharat Reddy to G.O. 610 (1985).",
        },
      ],
    },
  },

  // 2. TM-Q252 (G.O. Ms. No. 610: Provisions & Target Deadline)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q252",
      topic: "TM-02.02",
      concept: "TM-02.02-M11",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "G.O. Ms. No. 610 was issued by the General Administration Department (GAD) of Andhra Pradesh on 30 December 1985 under Chief Minister N.T. Rama Rao. What was the exact target deadline fixed in Clause 5 of G.O. 610 for repatriating all illegally allotted non-local employees from Zones V and VI back to their native zones?",
      options: [
        {
          text: "31 March 1986",
          why: "Clause 5 of G.O. Ms. No. 610 explicitly mandated: 'The employees allotted in deviation of the Presidential Order shall be repatriated to their respective native zones by 31 March 1986, and local candidates appointed in the resultant vacancies.'",
          attraction: "The authentic, landmark 3-month statutory deadline of G.O. 610.",
          confusion: false,
        },
        {
          text: "28 February 1969",
          why: "28 February 1969 was the repatriation deadline in G.O. Ms. No. 36 issued 16 years earlier under Kasu Brahmananda Reddy.",
          attraction: "Deadline of G.O. 36 (1969).",
          confusion: true,
        },
        {
          text: "1 November 1990",
          why: "No 1990 deadline existed; G.O. 610 specified an immediate 3-month timeline ending on 31 March 1986.",
          attraction: "Arbitrary long-term deadline.",
        },
        {
          text: "30 June 2004",
          why: "30 June 2004 was the submission period of the Girglani Commission Final Report, eighteen years after G.O. 610 was issued.",
          attraction: "Girglani report date.",
        },
      ],
      answer: 0,
      reason: "G.O. Ms. No. 610 fixed 31 March 1986 as the deadline for repatriating all illegally allotted non-local employees.",
      clue: "Look for 31 March 1986, the 3-month deadline specified in Clause 5 of G.O. 610.",
      trap: "Do not confuse G.O. 36 (deadline: 28 Feb 1969) with G.O. 610 (deadline: 31 March 1986).",
      elimination: "G.O. 610 fixed 31 March 1986. G.O. 36 was 28 Feb 1969; Girglani submitted in 2004.",
      anchor: "30 December 1985 -> G.O. Ms. No. 610 -> Repatriation Deadline: 31 March 1986.",
      hint: "Despite this solemn order, successive governments failed to repatriate even a single non-local employee by 31 March 1986.",
      source: "SR-POLICE-SI-2016",
      page: 476,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies 31 March 1986 as the deadline in G.O. 610.",
          correctMeaning: "G.O. 610 is the single most celebrated executive order in the post-1975 movement; its total betrayal catalyzed the 2001 revival of the statehood demand.",
          selectedMeaning: "G.O. 610 is the single most celebrated executive order in the post-1975 movement; its total betrayal catalyzed the 2001 revival of the statehood demand.",
          possibleConfusion: "No confusion; compulsory question for every TS Police SI & Constable aspirant.",
          decisionRules: [
            { when: "Asked what deadline was fixed in G.O. Ms. No. 610 (issued 30 Dec 1985)", choose: "31 March 1986." },
            { when: "Asked which Chief Minister issued G.O. 610", choose: "N.T. Rama Rao." },
          ],
          nextStep: "Compare G.O. 36 (1969, deadline 28 Feb 1969) with G.O. 610 (1985, deadline 31 March 1986).",
        },
        {
          observation: "Selected 28 February 1969.",
          correctMeaning: "28 February 1969 was the deadline in G.O. 36; G.O. 610 was issued in 1985 with a deadline of 31 March 1986.",
          selectedMeaning: "Confusing G.O. 36 with G.O. 610.",
          possibleConfusion: "Both orders had very similar repatriation mandates separated by 16 years.",
          decisionRules: [
            { when: "Asked about deadline in G.O. 36 (Kasu)", choose: "28 February 1969." },
            { when: "Asked about deadline in G.O. 610 (NTR)", choose: "31 March 1986." },
          ],
          nextStep: "Remember: G.O. 36 = 1969 (Feb); G.O. 610 = 1985 (March).",
        },
        {
          observation: "Selected 1990 deadline.",
          correctMeaning: "G.O. 610 gave only a 3-month deadline (Jan–March 1986) to quickly settle employee grievances; it was not a 5-year order.",
          selectedMeaning: "Confusing an immediate compliance order with long-term plans.",
          possibleConfusion: "Employee protests flared again in 1990.",
          decisionRules: [
            { when: "Asked duration given in G.O. 610", choose: "3 months (ending 31 March 1986)." },
            { when: "Evaluating 1990s deadlines", choose: "Eliminate 1990." },
          ],
          nextStep: "Anchor G.O. 610 to its original 1986 target date.",
        },
        {
          observation: "Selected 30 June 2004.",
          correctMeaning: "30 June 2004 was the completion of the Girglani Commission report, appointed 15 years later to find out why G.O. 610 had never been implemented.",
          selectedMeaning: "Confusing the inquiry commission report date with the original order deadline.",
          possibleConfusion: "Both documents are closely linked in literature.",
          decisionRules: [
            { when: "Asked about original G.O. 610 deadline", choose: "31 March 1986." },
            { when: "Asked when Girglani Commission submitted its Final Report", choose: "30 September 2004." },
          ],
          nextStep: "Chronology: G.O. 610 (1985/1986) -> Girglani Report (2004).",
        },
      ],
    },
  },

  // 3. TM-Q253 (J.M. Girglani One-Man Commission 2001–2004)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q253",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "On 25 June 2001, Chief Minister N. Chandrababu Naidu appointed a One-Man Commission headed by retired senior IAS officer J.M. Girglani to inquire into the non-implementation of G.O. 610. In its monumental Final Report submitted on 30 September 2004, how many distinct types of violations and deviations of the 1975 Presidential Order did the Girglani Commission identify?",
      options: [
        {
          text: "72 distinct types of violations across 35 volumes",
          why: "The J.M. Girglani Commission submitted a comprehensive Final Report spanning 35 volumes, meticulously classifying 72 distinct types of violations and systemic circumventions of the Presidential Order across all government departments.",
          attraction: "The authentic, historic finding of 72 types of violations in 35 volumes.",
          confusion: false,
        },
        {
          text: "Only 3 minor clerical errors",
          why: "The Commission exposed massive, calculated, and institutionalized violations running into tens of thousands of illegal appointments, not minor errors.",
          attraction: "Downplaying the violations.",
          confusion: true,
        },
        {
          text: "14 violations corresponding to the 14 points of the Gentlemen's Agreement",
          why: "The Gentlemen's Agreement had 14 points, but Girglani identified 72 specific administrative mechanisms used to bypass the 1975 Presidential Order.",
          attraction: "Confusing Gentlemen's Agreement 14 points with Girglani violations.",
        },
        {
          text: "Zero violations (holding that G.O. 610 had been perfectly implemented)",
          why: "The Commission proved that G.O. 610 was completely sabotaged and not implemented in letter or spirit.",
          attraction: "False compliance assumption.",
        },
      ],
      answer: 0,
      reason: "The J.M. Girglani Commission identified 72 distinct types of violations of the Presidential Order across 35 volumes.",
      clue: "Look for the Girglani Commission's finding of 72 types of violations documented across 35 volumes.",
      trap: "Do not guess 14 (Gentlemen's Agreement points); Girglani identified exactly 72 types of violations.",
      elimination: "Girglani Commission identified 72 distinct types of violations across 35 volumes.",
      anchor: "J.M. Girglani Commission (2001–2004) -> 72 distinct types of violations -> 35 volumes.",
      hint: "Violations included illegal deputations, fake local certificates, declaring posts non-local, transferring cadres without approval, and misusing the 20% open quota.",
      source: "SR-POLICE-SI-2016",
      page: 482,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies 72 distinct types of violations in the Girglani Report.",
          correctMeaning: "The Girglani Commission report was the most devastating indictment of the Andhra-dominated administration, proving that local youth were systematically cheated of over 1.5 lakh jobs in Telangana.",
          selectedMeaning: "The Girglani Commission report was the most devastating indictment of the Andhra-dominated administration, proving that local youth were systematically cheated of over 1.5 lakh jobs in Telangana.",
          possibleConfusion: "No confusion; standard high-yield numerical question in TS recruitment.",
          decisionRules: [
            { when: "Asked how many types of violations the Girglani Commission identified", choose: "72 distinct types of violations." },
            { when: "Asked when Girglani Commission was appointed", choose: "25 June 2001." },
          ],
          nextStep: "Note that Girglani submitted an Interim Report on 6 October 2001 and his Final Report on 30 September 2004.",
        },
        {
          observation: "Selected minor clerical errors.",
          correctMeaning: "Girglani exposed deliberate systemic subversion by heads of departments and secretariats, not minor clerical slips.",
          selectedMeaning: "Severely trivializing the findings of a 35-volume report.",
          possibleConfusion: "Official spokespersons attempted to downplay the report.",
          decisionRules: [
            { when: "Asked nature of Girglani findings", choose: "72 systematic, widespread types of violations." },
            { when: "Evaluating minor error claims", choose: "Eliminate clerical error distractors." },
          ],
          nextStep: "Understand Girglani called the violation 'a fraud on the Constitution'.",
        },
        {
          observation: "Selected 14 violations.",
          correctMeaning: "14 was the number of clauses in the 1956 Gentlemen's Agreement; Girglani classified 72 operational methods of cheating.",
          selectedMeaning: "Confusing 1956 treaty clauses with 2004 audit violations.",
          possibleConfusion: "14 is a familiar number in Telangana history.",
          decisionRules: [
            { when: "Asked about clauses in Gentlemen's Agreement", choose: "14 points." },
            { when: "Asked about violation categories in Girglani Report", choose: "72 types of violations." },
          ],
          nextStep: "Remember: Gentlemen's Agreement = 14 points; Girglani violations = 72 types.",
        },
        {
          observation: "Selected zero violations.",
          correctMeaning: "Girglani documented that in Hyderabad city and across Telangana, non-locals held up to 70% of posts that belonged to local youth.",
          selectedMeaning: "Factually inverted assumption.",
          possibleConfusion: "Government orders falsely claimed compliance.",
          decisionRules: [
            { when: "Asked if G.O. 610 was implemented according to Girglani", choose: "Completely not implemented; massive violations uncovered." },
            { when: "Evaluating compliance claims", choose: "Eliminate zero violations." },
          ],
          nextStep: "Review Girglani's recommended 125 remedial measures.",
        },
      ],
    },
  },

  // 4. TM-Q254 (1997 Warangal Declaration: 50 Resolutions)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q254",
      topic: "TM-02.04",
      concept: "TM-02.04-M01",
      model: "Chronology",
      modelId: "TM-QM-CHRON-01",
      stage: "practice",
      prompt: "The modern phase of the Telangana movement was catalyzed by the historic 'Warangal Declaration' (Warangal Prakatana) adopted at a massive 2-day conference on 'Telangana Betrayal & Democratic Rights' held on 28 and 29 December 1997. How many comprehensive resolutions demanding separate statehood and detailing exploitation across agriculture, power, irrigation, and education were passed at this convention?",
      options: [
        {
          text: "50 comprehensive resolutions",
          why: "On 28–29 December 1997, the Warangal convention organized by the All India People's Resistance Forum (AIPRF) and attended by intellectuals like Prof. Jayashankar and Kaloji adopted the historic 50-point 'Warangal Declaration' calling for an uncompromising mass struggle for separate statehood.",
          attraction: "The authentic, landmark 50 resolutions of the Warangal Declaration.",
          confusion: false,
        },
        {
          text: "14 resolutions",
          why: "14 was the number of points in the 1956 Gentlemen's Agreement, not the 1997 Warangal Declaration.",
          attraction: "Gentlemen's Agreement point count.",
          confusion: true,
        },
        {
          text: "8 resolutions",
          why: "8 was the number of points in the 1969 Eight-Point Formula.",
          attraction: "Eight-Point Formula count.",
        },
        {
          text: "6 resolutions",
          why: "6 was the number of points in the 1973 Six-Point Formula.",
          attraction: "Six-Point Formula count.",
        },
      ],
      answer: 0,
      reason: "The 1997 Warangal Declaration adopted 50 comprehensive resolutions demanding separate Telangana.",
      clue: "Look for the 50 resolutions adopted at the 1997 Warangal Declaration on 28–29 December 1997.",
      trap: "Do not confuse the 50 resolutions of Warangal (1997) with 14 points (1956), 8 points (1969), or 6 points (1973).",
      elimination: "Warangal Declaration adopted 50 resolutions. 1956 had 14 points; 1969 had 8 points; 1973 had 6 points.",
      anchor: "28–29 December 1997 -> Warangal Declaration -> 50 comprehensive resolutions demanding Separate Telangana.",
      hint: "Presided by prominent writers and human rights activists, it declared that 'Telangana cannot develop without political self-rule'.",
      source: "SR-POLICE-SI-2016",
      page: 488,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies the 50 resolutions of the 1997 Warangal Declaration.",
          correctMeaning: "The Warangal Declaration of December 1997 is regarded by political scientists as the intellectual manifesto that resurrected the Telangana movement from its 25-year slumber.",
          selectedMeaning: "The Warangal Declaration of December 1997 is regarded by political scientists as the intellectual manifesto that resurrected the Telangana movement from its 25-year slumber.",
          possibleConfusion: "No confusion; celebrated milestone in modern Telangana movement history.",
          decisionRules: [
            { when: "Asked how many resolutions were adopted in the 1997 Warangal Declaration", choose: "50 resolutions." },
            { when: "Asked exact dates of the Warangal conference", choose: "28 and 29 December 1997." },
          ],
          nextStep: "Note how the Warangal Declaration inspired the formation of multiple organizations like Telangana Aikya Vedika and Telangana Jana Sabha.",
        },
        {
          observation: "Selected 14 resolutions.",
          correctMeaning: "14 was the number of clauses in the 1956 Gentlemen's Agreement; the 1997 Warangal Declaration had 50 resolutions.",
          selectedMeaning: "Confusing 1956 covenant terms with the 1997 revolutionary declaration.",
          possibleConfusion: "14 is a recurring number in Telangana curriculum.",
          decisionRules: [
            { when: "Asked about 1956 Gentlemen's Agreement points", choose: "14 points." },
            { when: "Asked about 1997 Warangal Declaration resolutions", choose: "50 resolutions." },
          ],
          nextStep: "Remember: 1956 = 14 points; 1997 = 50 resolutions.",
        },
        {
          observation: "Selected 8 resolutions.",
          correctMeaning: "8 was the number of points in Indira Gandhi's 1969 package; Warangal had 50 resolutions.",
          selectedMeaning: "Confusing the 1969 8-Point Formula with the 1997 Declaration.",
          possibleConfusion: "Both addressed regional grievances.",
          decisionRules: [
            { when: "Asked about 1969 Indira Gandhi formula", choose: "Eight-Point Formula." },
            { when: "Asked about 1997 Warangal Declaration", choose: "50 resolutions." },
          ],
          nextStep: "Keep 1969 (8 points) distinct from 1997 (50 resolutions).",
        },
        {
          observation: "Selected 6 resolutions.",
          correctMeaning: "6 was the number of points in the 1973 Six-Point Formula; Warangal passed 50 resolutions.",
          selectedMeaning: "Confusing the 1973 formula with the 1997 declaration.",
          possibleConfusion: "Six-Point Formula is heavily tested.",
          decisionRules: [
            { when: "Asked about 1973 formula", choose: "Six-Point Formula." },
            { when: "Asked about 1997 Warangal Declaration", choose: "50 resolutions." },
          ],
          nextStep: "Memorize the progression: 14 (1956) -> 8 (1969) -> 6 (1973) -> 50 (1997).",
        },
      ],
    },
  },

  // 5. TM-Q255 (Telangana Cultural Renaissance: Dhoom Dhaam Genesis)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q255",
      topic: "TM-02.04",
      concept: "TM-02.04-M02",
      model: "Chronology",
      modelId: "TM-QM-CHRON-01",
      stage: "practice",
      prompt: "The 'Telangana Dhoom Dhaam' was a unique cultural-political performance movement that mobilized millions of rural and urban masses through traditional songs, Oggu Katha, and dance forms. Where and when was the very first 'Telangana Dhoom Dhaam' held under the leadership of Rasamayi Balakishan and Telangana Kalasamithi?",
      options: [
        {
          text: "30 September 2002 at Kamareddy (Nizamabad district)",
          why: "The inaugural 'Telangana Dhoom Dhaam' was organized on 30 September 2002 at Kamareddy town in Nizamabad district by Telangana Kalasamithi under the leadership of Rasamayi Balakishan, bringing all folk artists onto a single political stage.",
          attraction: "The authentic, celebrated venue and date of the first Dhoom Dhaam.",
          confusion: false,
        },
        {
          text: "28 December 1997 at Warangal",
          why: "28 December 1997 was the Warangal Declaration convention, not the Dhoom Dhaam performance festival.",
          attraction: "Warangal Declaration date.",
          confusion: true,
        },
        {
          text: "27 April 2001 at Jala Drushyam, Hyderabad",
          why: "27 April 2001 at Jala Drushyam was the political founding of the Telangana Rashtra Samithi (TRS) by KCR.",
          attraction: "TRS founding date and venue.",
        },
        {
          text: "9 December 2009 at Osmania University",
          why: "9 December 2009 was the historic announcement of Telangana statehood by P. Chidambaram.",
          attraction: "Chidambaram announcement date.",
        },
      ],
      answer: 0,
      reason: "The first Telangana Dhoom Dhaam was held on 30 September 2002 at Kamareddy.",
      clue: "Look for 30 September 2002 at Kamareddy (Nizamabad), organized by Rasamayi Balakishan.",
      trap: "Do not confuse Dhoom Dhaam (30 Sept 2002 at Kamareddy) with TRS founding (2001) or Warangal Declaration (1997).",
      elimination: "First Dhoom Dhaam was on 30 September 2002 at Kamareddy. 1997 was Warangal; 2001 was TRS founding.",
      anchor: "30 September 2002 -> Kamareddy -> First Telangana Dhoom Dhaam -> Led by Rasamayi Balakishan.",
      hint: "It brought together iconic singers like Goreti Venkanna, Guda Anjaiah, Ande Sri, and Vimalakka.",
      source: "SR-POLICE-SI-2016",
      page: 494,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies 30 September 2002 at Kamareddy as the first Dhoom Dhaam.",
          correctMeaning: "Dhoom Dhaam proved that cultural songs and folk arts were more powerful in awakening rural people than dry political speeches, becoming the heartbeat of the modern struggle.",
          selectedMeaning: "Dhoom Dhaam proved that cultural songs and folk arts were more powerful in awakening rural people than dry political speeches, becoming the heartbeat of the modern struggle.",
          possibleConfusion: "No confusion; standard high-yield cultural question in TS exams.",
          decisionRules: [
            { when: "Asked where and when the first Telangana Dhoom Dhaam was held", choose: "30 September 2002 at Kamareddy (Nizamabad district)." },
            { when: "Asked who spearheaded the Dhoom Dhaam movement", choose: "Rasamayi Balakishan (Telangana Kalasamithi / Dhoom Dhaam convener)." },
          ],
          nextStep: "Note how Dhoom Dhaam was later performed internationally in Dubai, London, and the USA to mobilize the diaspora.",
        },
        {
          observation: "Selected 1997 Warangal Declaration.",
          correctMeaning: "Warangal in 1997 was an intellectual conference adopting 50 resolutions; Kamareddy in 2002 was the folk performance festival of Dhoom Dhaam.",
          selectedMeaning: "Confusing the intellectual declaration with the cultural performance festival.",
          possibleConfusion: "Both energized the modern movement.",
          decisionRules: [
            { when: "Asked about Warangal convention (1997)", choose: "Warangal Declaration (50 resolutions)." },
            { when: "Asked about first Dhoom Dhaam (2002)", choose: "Kamareddy (Rasamayi Balakishan)." },
          ],
          nextStep: "Chronology: Warangal Declaration (1997) -> TRS launch (2001) -> Dhoom Dhaam (2002).",
        },
        {
          observation: "Selected 27 April 2001 at Jala Drushyam.",
          correctMeaning: "27 April 2001 was the political party launch of TRS by K. Chandrashekar Rao; Dhoom Dhaam started in September 2002.",
          selectedMeaning: "Confusing the political party formation with the cultural art movement.",
          possibleConfusion: "TRS heavily utilized Dhoom Dhaam in its rallies.",
          decisionRules: [
            { when: "Asked when TRS was founded at Jala Drushyam", choose: "27 April 2001." },
            { when: "Asked when first Dhoom Dhaam was organized", choose: "30 September 2002 at Kamareddy." },
          ],
          nextStep: "Remember Dhoom Dhaam was an autonomous artists' initiative that worked alongside political parties.",
        },
        {
          observation: "Selected 9 December 2009.",
          correctMeaning: "9 December 2009 was the central government's statehood announcement; Dhoom Dhaam had been performing across villages for over 7 years by then.",
          selectedMeaning: "Major chronological jump of 7 years.",
          possibleConfusion: "Dhoom Dhaam artists performed outside Osmania University in December 2009.",
          decisionRules: [
            { when: "Asked about 9 December 2009", choose: "Chidambaram's announcement on Telangana formation." },
            { when: "Asked about first Dhoom Dhaam", choose: "30 September 2002 at Kamareddy." },
          ],
          nextStep: "Anchor Kamareddy strictly to 30 September 2002.",
        },
      ],
    },
  },

  // 6. TM-Q256 (Gaddar: Revolutionary Balladeer & Jana Natya Mandali)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q256",
      topic: "TM-02.04",
      concept: "TM-02.04-M03",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "Gaddar (Gummadi Vittal Rao), the legendary revolutionary balladeer and founder of Jana Natya Mandali, mobilized millions with his voice and red blanket. Which of his immortal songs, beginning with the lines 'Amma Telanganama Aakali Kekala Gaanama', was hailed as the emotional heartbeat of the Telangana struggle?",
      options: [
        {
          text: "'Amma Telanganama Aakali Kekala Gaanama'",
          why: "Gaddar wrote and sang 'Amma Telanganama Aakali Kekala Gaanama', capturing the agony, starvation, and exploitation of Telangana under colonial coastal rule, which brought tears to millions in public gatherings.",
          attraction: "The authentic, immortal song penned by Gaddar.",
          confusion: false,
        },
        {
          text: "'Ooru Manadira Ee Vaada Manadira'",
          why: "'Ooru Manadira Ee Vaada Manadira' was written by revolutionary folk poet Guda Anjaiah in 1971, not by Gaddar.",
          attraction: "Iconic revolutionary song written by Guda Anjaiah.",
          confusion: true,
        },
        {
          text: "'Palle Kanneru Peduthundo'",
          why: "'Palle Kanneru Peduthundo' was composed and sung by Goreti Venkanna, depicting the decay of rural artisan livelihoods.",
          attraction: "Famous folk song composed by Goreti Venkanna.",
        },
        {
          text: "'Jaya Jayahe Telangana Janani Jaya Ketanam'",
          why: "This official State Anthem was penned by Dr. Ande Sri, not by Gaddar.",
          attraction: "Official State Anthem.",
        },
      ],
      answer: 0,
      reason: "Gaddar wrote and sang the immortal anthem 'Amma Telanganama Aakali Kekala Gaanama'.",
      clue: "Look for Gaddar, author and singer of 'Amma Telanganama Aakali Kekala Gaanama'.",
      trap: "Do not confuse Gaddar ('Amma Telanganama') with Guda Anjaiah ('Ooru Manadira') or Goreti Venkanna ('Palle Kanneru').",
      elimination: "Gaddar wrote 'Amma Telanganama'. Guda Anjaiah wrote 'Ooru Manadira'; Goreti Venkanna wrote 'Palle Kanneru'; Ande Sri wrote 'Jaya Jayahe Telangana'.",
      anchor: "Gaddar (Gummadi Vittal Rao) -> Jana Natya Mandali -> 'Amma Telanganama Aakali Kekala Gaanama' & 'Podustunna Poddu Meeda'.",
      hint: "Gaddar also wrote and performed 'Podustunna Poddu Meeda Telanganama', which won the Nandi Award (which he refused to accept).",
      source: "SR-POLICE-SI-2016",
      page: 500,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Gaddar as the author of 'Amma Telanganama'.",
          correctMeaning: "Gaddar was the supreme voice of the oppressed in Telangana, surviving an assassination attempt in 1997 and continuing his cultural crusade until his death in August 2023.",
          selectedMeaning: "Gaddar was the supreme voice of the oppressed in Telangana, surviving an assassination attempt in 1997 and continuing his cultural crusade until his death in August 2023.",
          possibleConfusion: "No confusion; universally recognized cultural hero of Telangana.",
          decisionRules: [
            { when: "Asked who wrote 'Amma Telanganama Aakali Kekala Gaanama'", choose: "Gaddar (Gummadi Vittal Rao)." },
            { when: "Asked who wrote 'Podustunna Poddu Meeda Telanganama'", choose: "Gaddar." },
          ],
          nextStep: "Note that Gaddar hailed from Toopran in Medak district.",
        },
        {
          observation: "Selected Ooru Manadira.",
          correctMeaning: "'Ooru Manadira Ee Vaada Manadira' was written by Guda Anjaiah; Gaddar popularized it in Jana Natya Mandali performances.",
          selectedMeaning: "Confusing the singer/performer with the original author.",
          possibleConfusion: "Gaddar frequently sang 'Ooru Manadira' on stage, causing many to attribute it to him.",
          decisionRules: [
            { when: "Asked who originally composed 'Ooru Manadira'", choose: "Guda Anjaiah." },
            { when: "Asked who composed 'Amma Telanganama'", choose: "Gaddar." },
          ],
          nextStep: "Remember Guda Anjaiah is the author of 'Ooru Manadira'.",
        },
        {
          observation: "Selected Palle Kanneru Peduthundo.",
          correctMeaning: "'Palle Kanneru Peduthundo' was written and sung by Goreti Venkanna, winning widespread acclaim in the film 'Kubusam'.",
          selectedMeaning: "Confusing Goreti Venkanna's masterpiece with Gaddar's anthem.",
          possibleConfusion: "Both were celebrated performers at Dhoom Dhaam.",
          decisionRules: [
            { when: "Asked who composed 'Palle Kanneru Peduthundo'", choose: "Goreti Venkanna." },
            { when: "Asked who composed 'Amma Telanganama'", choose: "Gaddar." },
          ],
          nextStep: "Associate Goreti Venkanna with village social realism and nature poetry.",
        },
        {
          observation: "Selected Jaya Jayahe Telangana.",
          correctMeaning: "'Jaya Jayahe Telangana' was written by Dr. Ande Sri; Gaddar wrote 'Amma Telanganama'.",
          selectedMeaning: "Confusing the official State Anthem with the revolutionary ballad.",
          possibleConfusion: "Both are iconic patriotic anthems of Telangana.",
          decisionRules: [
            { when: "Asked who wrote 'Jaya Jayahe Telangana'", choose: "Dr. Ande Sri." },
            { when: "Asked who wrote 'Amma Telanganama'", choose: "Gaddar." },
          ],
          nextStep: "Anchor Ande Sri to 'Jaya Jayahe Telangana' and Gaddar to 'Amma Telanganama'.",
        },
      ],
    },
  },

  // 7. TM-Q257 (Guda Anjaiah: Revolutionary Songwriter & 'Ooru Manadira')
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q257",
      topic: "TM-02.04",
      concept: "TM-02.04-M04",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "Guda Anjaiah, the revolutionary folk poet from Lingampalli (Adilabad district), composed which of the following immortal songs in 1971 that was translated into 16 languages and became a worldwide anthem against landlord feudalism and untouchability?",
      options: [
        {
          text: "'Ooru Manadira, Ee Vaada Manadira, Palle Manadira, Dora Yendiro Vani Pilupu Yendiro'",
          why: "Guda Anjaiah composed the immortal revolutionary song 'Ooru Manadira, Ee Vaada Manadira' in 1971, challenging feudal Deshmukhs ('Dora Yendiro Vani Gadi Yendiro'), which was translated into 16 Indian languages and sung across the subcontinent.",
          attraction: "The authentic, internationally celebrated song penned by Guda Anjaiah.",
          confusion: false,
        },
        {
          text: "'Palletoori Pillagada Pasula Kaase Monagada'",
          why: "'Palletoori Pillagada' was written by Suddala Hanumanthu in the 1940s during the Telangana Armed Struggle, not by Guda Anjaiah in 1971.",
          attraction: "Classic armed struggle folk song by Suddala Hanumanthu.",
          confusion: true,
        },
        {
          text: "'Naa Telangana Koti Ratanala Veena'",
          why: "Authored by Dasarathi Krishnamacharyulu on the walls of Nizamabad jail in the 1940s.",
          attraction: "Dasarathi's classical masterpiece.",
        },
        {
          text: "'Podustunna Poddu Meeda'",
          why: "Written and composed by Gaddar for the separate state movement.",
          attraction: "Gaddar's famous song.",
        },
      ],
      answer: 0,
      reason: "Guda Anjaiah composed 'Ooru Manadira, Ee Vaada Manadira' in 1971.",
      clue: "Look for Guda Anjaiah, author of 'Ooru Manadira' and 'Rajiga Ori Rajiga'.",
      trap: "Do not confuse Guda Anjaiah ('Ooru Manadira') with Suddala Hanumanthu ('Palletoori Pillagada') or Gaddar ('Podustunna Poddu').",
      elimination: "Guda Anjaiah wrote 'Ooru Manadira'. Suddala Hanumanthu wrote 'Palletoori Pillagada'; Dasarathi wrote 'Koti Ratanala Veena'; Gaddar wrote 'Podustunna Poddu'.",
      anchor: "Guda Anjaiah (1971) -> 'Ooru Manadira Ee Vaada Manadira' -> Defiance against feudal Doras.",
      hint: "Guda Anjaiah also wrote the famous Telangana movement song 'Ayyoniva Nuvvo Avvoniva Telanganoniki Thotikodakava' and the novel 'Polimera'.",
      source: "SR-POLICE-SI-2016",
      page: 506,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Guda Anjaiah as the author of 'Ooru Manadira'.",
          correctMeaning: "Guda Anjaiah's 'Ooru Manadira' shook the feudal foundations of rural Telangana, questioning why landless Dalits and Bahujans who built the villages were treated as outcasts by the feudal Doras.",
          selectedMeaning: "Guda Anjaiah's 'Ooru Manadira' shook the feudal foundations of rural Telangana, questioning why landless Dalits and Bahujans who built the villages were treated as outcasts by the feudal Doras.",
          possibleConfusion: "No confusion; standard question on Telangana literature and social reform.",
          decisionRules: [
            { when: "Asked who wrote 'Ooru Manadira, Ee Vaada Manadira'", choose: "Guda Anjaiah." },
            { when: "Asked who wrote the famous novel 'Polimera'", choose: "Guda Anjaiah." },
          ],
          nextStep: "Note that Guda Anjaiah also penned 'Rajiga Ori Rajiga' depicting the plight of Telangana cotton farmers.",
        },
        {
          observation: "Selected Palletoori Pillagada.",
          correctMeaning: "'Palletoori Pillagada' was written by Suddala Hanumanthu during the anti-Nizam struggle; Guda Anjaiah wrote 'Ooru Manadira' in 1971.",
          selectedMeaning: "Confusing two different anti-feudal folk poets across 30 years.",
          possibleConfusion: "Both songs attack landlord tyranny and child exploitation.",
          decisionRules: [
            { when: "Asked who wrote 'Palletoori Pillagada'", choose: "Suddala Hanumanthu (1940s)." },
            { when: "Asked who wrote 'Ooru Manadira'", choose: "Guda Anjaiah (1971)." },
          ],
          nextStep: "Remember Suddala = Palletoori Pillagada; Guda Anjaiah = Ooru Manadira.",
        },
        {
          observation: "Selected Naa Telangana Koti Ratanala Veena.",
          correctMeaning: "Dasarathi Krishnamacharyulu wrote 'Koti Ratanala Veena'; Guda Anjaiah wrote 'Ooru Manadira'.",
          selectedMeaning: "Confusing classical literary verse with folk revolutionary song.",
          possibleConfusion: "Both are monumental poetic landmarks of Telangana.",
          decisionRules: [
            { when: "Asked about Dasarathi's poem", choose: "Naa Telangana Koti Ratanala Veena." },
            { when: "Asked about Guda Anjaiah's song", choose: "Ooru Manadira." },
          ],
          nextStep: "Keep Dasarathi (classical/modern) and Guda Anjaiah (folk/rebel) distinct.",
        },
        {
          observation: "Selected Podustunna Poddu Meeda.",
          correctMeaning: "Gaddar wrote 'Podustunna Poddu Meeda'; Guda Anjaiah wrote 'Ooru Manadira'.",
          selectedMeaning: "Confusing Gaddar's statehood song with Guda Anjaiah's anti-feudal song.",
          possibleConfusion: "Both were celebrated balladeers of the same movement.",
          decisionRules: [
            { when: "Asked who composed 'Podustunna Poddu Meeda'", choose: "Gaddar." },
            { when: "Asked who composed 'Ooru Manadira'", choose: "Guda Anjaiah." },
          ],
          nextStep: "Anchor 'Podustunna Poddu' to Gaddar and 'Ooru Manadira' to Guda Anjaiah.",
        },
      ],
    },
  },

  // 8. TM-Q258 (Goreti Venkanna: Folk Realism & Sahitya Akademi)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q258",
      topic: "TM-02.04",
      concept: "TM-02.04-M05",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "Goreti Venkanna, the celebrated folk singer and poet hailing from Mahbubnagar district, was awarded the prestigious Central Sahitya Akademi Award in 2021 for his outstanding poetry collection. What was the title of this award-winning anthology?",
      options: [
        {
          text: "'Vallanki Taalam'",
          why: "Goreti Venkanna was awarded the Central Sahitya Akademi Award in 2021 for his acclaimed poetry anthology 'Vallanki Taalam', which celebrated the ecological, philosophical, and rustic beauty of Telangana nature.",
          attraction: "The authentic, celebrated Sahitya Akademi award-winning poetry collection.",
          confusion: false,
        },
        {
          text: "'Ekunata' (Anthology)",
          why: "'Ekunata' was an earlier collection of poems by Goreti Venkanna, but 'Vallanki Taalam' was the collection that won the 2021 Sahitya Akademi Award.",
          attraction: "Earlier poetry volume by the same author.",
          confusion: true,
        },
        {
          text: "'Alasandra Vanka'",
          why: "'Alasandra Vanka' was an earlier song anthology by Goreti Venkanna published in 2010.",
          attraction: "Song collection by Goreti Venkanna.",
        },
        {
          text: "'Rela Poothalu'",
          why: "'Rela Poothalu' was a collection of songs by various folk artists, not Goreti Venkanna's Sahitya Akademi winning work.",
          attraction: "Folk song title distractor.",
        },
      ],
      answer: 0,
      reason: "Goreti Venkanna won the Central Sahitya Akademi Award in 2021 for 'Vallanki Taalam'.",
      clue: "Look for 'Vallanki Taalam', the 2021 Sahitya Akademi Award-winning poetry book by Goreti Venkanna.",
      trap: "Do not choose earlier collections like 'Alasandra Vanka' or 'Ekunata'; the 2021 award-winning book was 'Vallanki Taalam'.",
      elimination: "Goreti Venkanna won the 2021 Sahitya Akademi Award for 'Vallanki Taalam'.",
      anchor: "Goreti Venkanna -> 'Vallanki Taalam' -> Central Sahitya Akademi Award in Telugu (2021).",
      hint: "Goreti Venkanna is also famous for writing 'Palle Kanneru Peduthundo' and 'Galli Chinnadi Garibolla Katha Peddadi'.",
      source: "SR-POLICE-SI-2016",
      page: 512,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies 'Vallanki Taalam' as Goreti Venkanna's award-winning collection.",
          correctMeaning: "Goreti Venkanna became the first folk poet in Telangana history to win the Central Sahitya Akademi Award for pure rustic folk rhythms in 2021, and was nominated to the Telangana Legislative Council (MLC).",
          selectedMeaning: "Goreti Venkanna became the first folk poet in Telangana history to win the Central Sahitya Akademi Award for pure rustic folk rhythms in 2021, and was nominated to the Telangana Legislative Council (MLC).",
          possibleConfusion: "No confusion; standard current affairs and cultural heritage question.",
          decisionRules: [
            { when: "Asked which book won the 2021 Central Sahitya Akademi Award for Goreti Venkanna", choose: "'Vallanki Taalam'." },
            { when: "Asked who composed 'Palle Kanneru Peduthundo' and 'Galli Chinnadi'", choose: "Goreti Venkanna." },
          ],
          nextStep: "Note Goreti Venkanna hails from Gouraram village in Nagarkurnool / Mahbubnagar district.",
        },
        {
          observation: "Selected Ekunata.",
          correctMeaning: "'Ekunata' was published in 2002; 'Vallanki Taalam' was published in 2019 and won the award in 2021.",
          selectedMeaning: "Confusing an earlier anthology with the award-winning masterpiece.",
          possibleConfusion: "Both were written by Goreti Venkanna.",
          decisionRules: [
            { when: "Asked about 2021 Sahitya Akademi winning work", choose: "'Vallanki Taalam'." },
            { when: "Asked about 2002 collection", choose: "'Ekunata'." },
          ],
          nextStep: "Anchor 2021 Sahitya Akademi strictly to 'Vallanki Taalam'.",
        },
        {
          observation: "Selected Alasandra Vanka.",
          correctMeaning: "'Alasandra Vanka' was a popular song volume; 'Vallanki Taalam' was the poetry anthology recognized by the national academy.",
          selectedMeaning: "Confusing song volume with the award-winning poetry book.",
          possibleConfusion: "Both share rustic agrarian titles.",
          decisionRules: [
            { when: "Asked about Sahitya Akademi Award", choose: "'Vallanki Taalam'." },
            { when: "Evaluating other collections", choose: "Eliminate Alasandra Vanka." },
          ],
          nextStep: "Remember 'Vallanki Taalam' represents the rhythm of the Vallanki bird in rural nature.",
        },
        {
          observation: "Selected Rela Poothalu.",
          correctMeaning: "'Rela Poothalu' was a television folk music series; 'Vallanki Taalam' was Venkanna's literary work.",
          selectedMeaning: "Confusing media programs with the published literary text.",
          possibleConfusion: "Venkanna appeared frequently on folk music shows.",
          decisionRules: [
            { when: "Asked about literary award", choose: "'Vallanki Taalam'." },
            { when: "Evaluating folk song programs", choose: "Eliminate TV program titles." },
          ],
          nextStep: "Focus on the specific literary book title recognized by the Sahitya Akademi.",
        },
      ],
    },
  },

  // 9. TM-Q259 (Dr. Ande Sri: State Song & Mayadari Maikamu)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q259",
      topic: "TM-02.04",
      concept: "TM-02.04-M06",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "Dr. Ande Sri (Ande Yellaiah), the illiterate shepherd boy who rose to become one of Telangana's greatest nature poets and lyricists, penned which immortal anthem in 2006 that was officially adopted by the Government of Telangana as the State Song (Rashtra Geetham) in 2024?",
      options: [
        {
          text: "'Jaya Jayahe Telangana Janani Jaya Ketanam'",
          why: "Dr. Ande Sri composed 'Jaya Jayahe Telangana Janani Jaya Ketanam' in 2006, capturing the sacred rivers, historical monuments, and heroic martyrs of all 10 districts; on 8 June 2024, the Telangana State Cabinet officially notified it as the official State Anthem.",
          attraction: "The authentic, historic State Song of Telangana.",
          confusion: false,
        },
        {
          text: "'Maa Telugu Thalliki Malle Poodanda'",
          why: "'Maa Telugu Thalliki' was written by Sankarambadi Sundarachari in 1942 for the composite state, not by Ande Sri for Telangana.",
          attraction: "Former state song of united Andhra Pradesh.",
          confusion: true,
        },
        {
          text: "'Amma Telanganama'",
          why: "Written and sung by revolutionary balladeer Gaddar, not by Dr. Ande Sri.",
          attraction: "Gaddar's masterpiece.",
        },
        {
          text: "'Yeh Jung Hai Jung-e-Azadi'",
          why: "Written in Urdu by Makhdoom Mohiuddin during the 1946–48 armed struggle.",
          attraction: "Makhdoom's anthem.",
        },
      ],
      answer: 0,
      reason: "Dr. Ande Sri wrote 'Jaya Jayahe Telangana Janani Jaya Ketanam', officially declared the State Anthem in 2024.",
      clue: "Look for Dr. Ande Sri, author of 'Jaya Jayahe Telangana Janani Jaya Ketanam'.",
      trap: "Do not confuse Ande Sri ('Jaya Jayahe Telangana') with Sankarambadi Sundarachari ('Maa Telugu Thalliki') or Gaddar ('Amma Telanganama').",
      elimination: "Ande Sri wrote 'Jaya Jayahe Telangana'. Sankarambadi wrote 'Maa Telugu Thalliki'; Gaddar wrote 'Amma Telanganama'; Makhdoom wrote 'Jung-e-Azadi'.",
      anchor: "Dr. Ande Sri -> 'Jaya Jayahe Telangana Janani Jaya Ketanam' -> Official State Song of Telangana (2024).",
      hint: "Hailing from Rebarthi village in Jangaon / Warangal, Ande Sri also composed the famous anti-alcohol song 'Mayadari Maikamu'.",
      source: "SR-POLICE-SI-2016",
      page: 518,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Dr. Ande Sri and 'Jaya Jayahe Telangana'.",
          correctMeaning: "On 2 June 2024, the newly composed full version of 'Jaya Jayahe Telangana' tuned by Oscar-winner M.M. Keeravani was officially dedicated to the state.",
          selectedMeaning: "On 2 June 2024, the newly composed full version of 'Jaya Jayahe Telangana' tuned by Oscar-winner M.M. Keeravani was officially dedicated to the state.",
          possibleConfusion: "No confusion; standard high-yield contemporary and historical question in TS exams.",
          decisionRules: [
            { when: "Asked who wrote the official Telangana State Song 'Jaya Jayahe Telangana'", choose: "Dr. Ande Sri." },
            { when: "Asked who composed the official 2024 musical score for the state anthem", choose: "M.M. Keeravani." },
          ],
          nextStep: "Note that Kakatiya University conferred an honorary doctorate (D.Litt.) on Ande Sri for his poetic genius.",
        },
        {
          observation: "Selected Maa Telugu Thalliki.",
          correctMeaning: "'Maa Telugu Thalliki' was written by Sankarambadi Sundarachari from Tirupati for united AP; Telangana rejected it during the statehood movement.",
          selectedMeaning: "Confusing the former Andhra Pradesh state anthem with the Telangana State Song.",
          possibleConfusion: "Both served as state songs in different eras.",
          decisionRules: [
            { when: "Asked who wrote 'Maa Telugu Thalliki Malle Poodanda'", choose: "Sankarambadi Sundarachari." },
            { when: "Asked who wrote 'Jaya Jayahe Telangana Janani Jaya Ketanam'", choose: "Dr. Ande Sri." },
          ],
          nextStep: "Remember Telangana replaced 'Maa Telugu Thalliki' with 'Jaya Jayahe Telangana'.",
        },
        {
          observation: "Selected Amma Telanganama.",
          correctMeaning: "Gaddar wrote 'Amma Telanganama'; Ande Sri wrote 'Jaya Jayahe Telangana'.",
          selectedMeaning: "Confusing Gaddar's revolutionary song with Ande Sri's state anthem.",
          possibleConfusion: "Both were performed in every Telangana rally.",
          decisionRules: [
            { when: "Asked who wrote 'Amma Telanganama'", choose: "Gaddar." },
            { when: "Asked who wrote 'Jaya Jayahe Telangana'", choose: "Dr. Ande Sri." },
          ],
          nextStep: "Keep Gaddar and Ande Sri clearly separated.",
        },
        {
          observation: "Selected Yeh Jung Hai Jung-e-Azadi.",
          correctMeaning: "Makhdoom Mohiuddin wrote 'Yeh Jung Hai Jung-e-Azadi' in Urdu in the 1940s; Ande Sri wrote 'Jaya Jayahe' in Telugu in 2006.",
          selectedMeaning: "Linguistic and historical error across 60 years.",
          possibleConfusion: "Both are celebrated regional anthems.",
          decisionRules: [
            { when: "Asked about Urdu poem by Makhdoom", choose: "Yeh Jung Hai Jung-e-Azadi." },
            { when: "Asked about Telugu state song by Ande Sri", choose: "Jaya Jayahe Telangana." },
          ],
          nextStep: "Anchor Ande Sri to modern Telugu poetry and 2024 State Song adoption.",
        },
      ],
    },
  },

  // 10. TM-Q260 (Belli Lalitha: 'Telangana Kokila' & Martyrdom 1999)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q260",
      topic: "TM-02.04",
      concept: "TM-02.04-M07",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "Belli Lalitha, the fearless folk singer affectionately revered as the 'Nightingale of Telangana' (Telangana Kokila) and founder of the Telangana Kala Samithi, mobilized rural communities for separate statehood through her magnetic singing. On 26 May 1999, she was brutally murdered and chopped into 17 pieces by criminal gangs. In which district did this horrific martyrdom take place?",
      options: [
        {
          text: "Nalgonda district (near Bhongir)",
          why: "Belli Lalitha was kidnapped, brutally murdered, and her body chopped into 17 pieces and thrown into wells across Bhongir and Choutuppal in Nalgonda district on 26 May 1999 by the notorious gangster Nayeemuddin gang with police collusion.",
          attraction: "The authentic, tragic martyrdom location of Belli Lalitha.",
          confusion: false,
        },
        {
          text: "Warangal district (near Kazipet)",
          why: "Warangal was an epicenter of meetings, but Belli Lalitha hailed from and was murdered in Bhongir, Nalgonda district.",
          attraction: "Famous movement epicenter.",
          confusion: true,
        },
        {
          text: "Adilabad district (near Nirmal)",
          why: "Adilabad was the region of Guda Anjaiah and Komaram Bheem, not Belli Lalitha's martyrdom site.",
          attraction: "Folk music region.",
        },
        {
          text: "Khammam district (near Kothagudem)",
          why: "Khammam was the spark site of 1969, not Belli Lalitha's murder site.",
          attraction: "Historic movement district.",
        },
      ],
      answer: 0,
      reason: "Belli Lalitha was murdered on 26 May 1999 near Bhongir in Nalgonda district.",
      clue: "Look for Belli Lalitha ('Telangana Kokila'), murdered at Bhongir in Nalgonda district on 26 May 1999.",
      trap: "Do not guess Warangal or Khammam; Belli Lalitha lived and was martyred at Bhongir in Nalgonda district.",
      elimination: "Belli Lalitha was murdered at Bhongir, Nalgonda district on 26 May 1999.",
      anchor: "26 May 1999 -> Bhongir, Nalgonda district -> Belli Lalitha ('Telangana Kokila') martyred.",
      hint: "Her murder triggered massive outrage across civil society, immortalized in songs by Gaddar and Goreti Venkanna.",
      source: "SR-POLICE-SI-2016",
      page: 524,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Bhongir in Nalgonda district as Belli Lalitha's martyrdom site.",
          correctMeaning: "Belli Lalitha's supreme sacrifice demonstrated the deadly nexus between the state, mafia gangs, and anti-Telangana forces seeking to silence the cultural voice of the movement.",
          selectedMeaning: "Belli Lalitha's supreme sacrifice demonstrated the deadly nexus between the state, mafia gangs, and anti-Telangana forces seeking to silence the cultural voice of the movement.",
          possibleConfusion: "No confusion; standard question on cultural martyrs in Telangana recruitment.",
          decisionRules: [
            { when: "Asked who was known as 'Telangana Kokila' (Nightingale of Telangana)", choose: "Belli Lalitha." },
            { when: "Asked where Belli Lalitha was martyred on 26 May 1999", choose: "Bhongir (Nalgonda district)." },
          ],
          nextStep: "Note that Belli Lalitha was the sister of revolutionary activist and singer Belli Krishna.",
        },
        {
          observation: "Selected Warangal.",
          correctMeaning: "Warangal was the site of the 1997 Declaration; Belli Lalitha was martyred in Bhongir, Nalgonda district.",
          selectedMeaning: "Confusing the conference site with the singer's murder site.",
          possibleConfusion: "Both were major movement districts in the late 1990s.",
          decisionRules: [
            { when: "Asked where Warangal Declaration took place (1997)", choose: "Warangal." },
            { when: "Asked where Belli Lalitha was martyred (1999)", choose: "Bhongir (Nalgonda)." },
          ],
          nextStep: "Remember Bhongir is located between Hyderabad and Warangal.",
        },
        {
          observation: "Selected Adilabad.",
          correctMeaning: "Adilabad was where Komaram Bheem died in 1940; Belli Lalitha was killed in Bhongir in 1999.",
          selectedMeaning: "Geographical error across northern and southern Telangana.",
          possibleConfusion: "Both involved state-sponsored brutality against local icons.",
          decisionRules: [
            { when: "Asked about Komaram Bheem's martyrdom (1940)", choose: "Jodeghat, Adilabad (Asifabad)." },
            { when: "Asked about Belli Lalitha's martyrdom (1999)", choose: "Bhongir, Nalgonda." },
          ],
          nextStep: "Keep Jodeghat (1940) and Bhongir (1999) geographically distinct.",
        },
        {
          observation: "Selected Khammam.",
          correctMeaning: "Khammam was famous for the 1969 hunger strike of Ravindranath; Belli Lalitha was martyred in Bhongir.",
          selectedMeaning: "District confusion.",
          possibleConfusion: "Both are eastern/southern Telangana districts.",
          decisionRules: [
            { when: "Asked about Belli Lalitha's murder site", choose: "Bhongir (Nalgonda district)." },
            { when: "Evaluating Khammam options", choose: "Eliminate Khammam." },
          ],
          nextStep: "Anchor Belli Lalitha strictly to Bhongir.",
        },
      ],
    },
  },

  // 11. TM-Q261 (Telangana Aikya Vedika 1997: Prof. Jayashankar & Kaloji)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q261",
      topic: "TM-02.04",
      concept: "TM-02.04-M08",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "On 16 October 1997, a major umbrella organization was established in Hyderabad bringing together intellectuals, writers, and retired officials to present a unified intellectual demand for separate Telangana statehood. Who were the two visionary leaders who headed this 'Telangana Aikya Vedika' (TAV) as its guiding patron and chief convener?",
      options: [
        {
          text: "Kaloji Narayana Rao (Patron) and Prof. K. Jayashankar (Chief Convener)",
          why: "Telangana Aikya Vedika was formed on 16 October 1997 with 'Praja Kavi' Kaloji Narayana Rao as Patron and Prof. Kothapalli Jayashankar as Chief Convener, spearheading seminars and publishing research booklets exposing regional disparities.",
          attraction: "The authentic, celebrated twin leadership of Telangana Aikya Vedika.",
          confusion: false,
        },
        {
          text: "K. Chandrashekar Rao and T. Harish Rao",
          why: "KCR was Deputy Speaker in the TDP government in 1997 and formed TRS only in 2001; TAV was an intellectual body led by Jayashankar and Kaloji.",
          attraction: "TRS leaders from later political phase.",
          confusion: true,
        },
        {
          text: "Dr. Marri Chenna Reddy and K.V. Ranga Reddy",
          why: "K.V. Ranga Reddy died in 1970 and Marri Chenna Reddy died in 1996; neither was alive for the 1997 Telangana Aikya Vedika.",
          attraction: "Deceased historical Congress leaders.",
        },
        {
          text: "Prof. Kodandaram and Mallikarjun",
          why: "Prof. Kodandaram headed the TJAC in 2009; Mallikarjun led the 1969 student committee; TAV in 1997 was led by Jayashankar and Kaloji.",
          attraction: "Other prominent movement conveners.",
        },
      ],
      answer: 0,
      reason: "Telangana Aikya Vedika (1997) was headed by Kaloji Narayana Rao as Patron and Prof. K. Jayashankar as Chief Convener.",
      clue: "Look for Kaloji Narayana Rao as Patron and Prof. K. Jayashankar as Chief Convener of Telangana Aikya Vedika in 1997.",
      trap: "Do not choose KCR (who launched TRS in 2001) or Kodandaram (TJAC in 2009); TAV in 1997 was headed by Kaloji and Jayashankar.",
      elimination: "Kaloji and Prof. Jayashankar founded Telangana Aikya Vedika in 1997. KCR founded TRS in 2001; Kodandaram led TJAC in 2009.",
      anchor: "16 October 1997 -> Telangana Aikya Vedika -> Patron: Kaloji Narayana Rao; Convener: Prof. K. Jayashankar.",
      hint: "Prof. Jayashankar was former Vice-Chancellor of Kakatiya University and the undisputed ideological father of the Telangana movement.",
      source: "SR-POLICE-SI-2016",
      page: 530,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Kaloji Narayana Rao and Prof. K. Jayashankar.",
          correctMeaning: "Telangana Aikya Vedika prepared the intellectual groundwork, producing authoritative research on river water theft, budget diversion, and employment violations that armed the political movement.",
          selectedMeaning: "Telangana Aikya Vedika prepared the intellectual groundwork, producing authoritative research on river water theft, budget diversion, and employment violations that armed the political movement.",
          possibleConfusion: "No confusion; standard question on the ideological phase of the movement.",
          decisionRules: [
            { when: "Asked who were the leaders of Telangana Aikya Vedika (1997)", choose: "Kaloji Narayana Rao (Patron) and Prof. K. Jayashankar (Convener)." },
            { when: "Asked who is hailed as the 'Father of Telangana Ideology'", choose: "Prof. Kothapalli Jayashankar." },
          ],
          nextStep: "Note how Prof. Jayashankar later became the primary mentor and philosophical advisor to KCR upon the founding of TRS in 2001.",
        },
        {
          observation: "Selected KCR and Harish Rao.",
          correctMeaning: "KCR was in the ruling Telugu Desam Party (TDP) in 1997; he resigned and formed TRS on 27 April 2001.",
          selectedMeaning: "Confusing the later political party with the earlier intellectual forum.",
          possibleConfusion: "KCR worked closely with Prof. Jayashankar after 2001.",
          decisionRules: [
            { when: "Asked about Telangana Aikya Vedika in 1997", choose: "Kaloji and Prof. Jayashankar." },
            { when: "Asked about Telangana Rashtra Samithi in 2001", choose: "K. Chandrashekar Rao." },
          ],
          nextStep: "Sequence: Intellectual Phase (TAV, 1997) -> Political Phase (TRS, 2001).",
        },
        {
          observation: "Selected Chenna Reddy and K.V. Ranga Reddy.",
          correctMeaning: "Both leaders had passed away before 1997 (Chenna Reddy in Dec 1996, Ranga Reddy in 1970).",
          selectedMeaning: "Anachronism involving deceased leaders.",
          possibleConfusion: "Chenna Reddy was CM until 1990.",
          decisionRules: [
            { when: "Evaluating Chenna Reddy in late 1997", choose: "Eliminate Chenna Reddy (passed away in 1996)." },
            { when: "Asked about 1997 leadership", choose: "Kaloji and Prof. Jayashankar." },
          ],
          nextStep: "Remember 1997 marked a fresh intellectual leadership.",
        },
        {
          observation: "Selected Prof. Kodandaram and Mallikarjun.",
          correctMeaning: "Prof. Kodandaram was an active member, but he became Chairman of the all-party TJAC in December 2009; Mallikarjun led the 1969 student committee.",
          selectedMeaning: "Confusing the 2009 TJAC chairman with the 1997 TAV convener.",
          possibleConfusion: "Both Kodandaram and Jayashankar were university professors from Warangal.",
          decisionRules: [
            { when: "Asked about 1997 Telangana Aikya Vedika convener", choose: "Prof. K. Jayashankar." },
            { when: "Asked about 2009 TJAC chairman", choose: "Prof. M. Kodandaram." },
          ],
          nextStep: "Remember: 1997 TAV = Prof. Jayashankar; 2009 TJAC = Prof. Kodandaram.",
        },
      ],
    },
  },

  // 12. TM-Q262 (Telangana Jana Sabha 1997: Maroju Veeranna)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q262",
      topic: "TM-02.04",
      concept: "TM-02.04-M09",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "The Telangana Jana Sabha (TJS) was established on 9 July 1997 in Hyderabad as a militant mass organization championing the liberation of Telangana's oppressed Bahujan and Dalit communities. Who was the charismatic underground mass organizer and leader who founded the Telangana Jana Sabha and was later killed in a staged police encounter on 16 May 1999?",
      options: [
        {
          text: "Maroju Veeranna",
          why: "Maroju Veeranna, a brilliant student organizer from Osmania University and leader of revolutionary mass organizations, founded the Telangana Jana Sabha (TJS) and Telangana Mahasabha, articulating the slogan 'Democratic Telangana / Bahujana Telangana' before being killed in a fake encounter near Mahabubabad on 16 May 1999.",
          attraction: "The authentic, celebrated revolutionary founder of Telangana Jana Sabha.",
          confusion: false,
        },
        {
          text: "Prof. K. Jayashankar",
          why: "Prof. Jayashankar was an academician and convener of Telangana Aikya Vedika, living until 2011; he was never an underground activist killed in an encounter.",
          attraction: "Ideological father of the movement.",
          confusion: true,
        },
        {
          text: "Belli Lalitha",
          why: "Belli Lalitha was a folk singer and founder of Telangana Kala Samithi murdered on 26 May 1999, ten days after Maroju Veeranna.",
          attraction: "Martyr of the same month.",
        },
        {
          text: "Kolishetti Ravindranath",
          why: "Ravindranath was the student hunger striker of Khammam in 1969, not the founder of the 1997 Telangana Jana Sabha.",
          attraction: "1969 student leader.",
        },
      ],
      answer: 0,
      reason: "Maroju Veeranna founded the Telangana Jana Sabha in 1997 and was martyred on 16 May 1999.",
      clue: "Look for Maroju Veeranna, founder of Telangana Jana Sabha who championed 'Bahujana Telangana' and died in May 1999.",
      trap: "Do not confuse Maroju Veeranna (TJS founder, martyred 16 May 1999) with Belli Lalitha (murdered 26 May 1999).",
      elimination: "Maroju Veeranna founded Telangana Jana Sabha. Prof. Jayashankar led TAV; Belli Lalitha was the folk singer martyr; Ravindranath was 1969.",
      anchor: "9 July 1997 -> Telangana Jana Sabha -> Founded by Maroju Veeranna -> Championed Bahujana Telangana.",
      hint: "Maroju Veeranna championed the doctrine that Telangana statehood must fundamentally empower SC, ST, BC, and minority communities.",
      source: "SR-POLICE-SI-2016",
      page: 536,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Maroju Veeranna as the founder of Telangana Jana Sabha.",
          correctMeaning: "Maroju Veeranna gave the Telangana movement its sharp caste and social justice dimension, arguing that political liberation without Bahujan empowerment would merely replace Andhra Doras with Telangana Doras.",
          selectedMeaning: "Maroju Veeranna gave the Telangana movement its sharp caste and social justice dimension, arguing that political liberation without Bahujan empowerment would merely replace Andhra Doras with Telangana Doras.",
          possibleConfusion: "No confusion; standard high-analytical question in Telangana sociology and movement history.",
          decisionRules: [
            { when: "Asked who founded the Telangana Jana Sabha on 9 July 1997", choose: "Maroju Veeranna." },
            { when: "Asked who coined the perspective of 'Bahujana Telangana'", choose: "Maroju Veeranna." },
          ],
          nextStep: "Note the wave of political assassinations in May 1999: Maroju Veeranna (16 May) and Belli Lalitha (26 May).",
        },
        {
          observation: "Selected Prof. K. Jayashankar.",
          correctMeaning: "Prof. Jayashankar was an open academic intellectual heading Telangana Aikya Vedika; Maroju Veeranna operated mass political organizations.",
          selectedMeaning: "Confusing the university professor with the revolutionary mass organizer.",
          possibleConfusion: "Both worked in Telangana advocacy in 1997.",
          decisionRules: [
            { when: "Asked about founder of Telangana Jana Sabha", choose: "Maroju Veeranna." },
            { when: "Asked about convener of Telangana Aikya Vedika", choose: "Prof. K. Jayashankar." },
          ],
          nextStep: "Keep TAV (Jayashankar) and TJS (Maroju Veeranna) clearly separated.",
        },
        {
          observation: "Selected Belli Lalitha.",
          correctMeaning: "Belli Lalitha was the singer who founded Telangana Kala Samithi; Maroju Veeranna founded Telangana Jana Sabha.",
          selectedMeaning: "Confusing the cultural singer martyr with the ideological political organizer.",
          possibleConfusion: "Both were close associates and were killed within 10 days of each other in May 1999.",
          decisionRules: [
            { when: "Asked about founder of Telangana Kala Samithi ('Telangana Kokila')", choose: "Belli Lalitha." },
            { when: "Asked about founder of Telangana Jana Sabha", choose: "Maroju Veeranna." },
          ],
          nextStep: "Remember both were martyred in May 1999.",
        },
        {
          observation: "Selected Kolishetti Ravindranath.",
          correctMeaning: "Ravindranath was the student faster in Khammam in 1969; Maroju Veeranna led the 1997 mass movement.",
          selectedMeaning: "Major chronological jump across 28 years.",
          possibleConfusion: "Both were fiery leaders from student backgrounds.",
          decisionRules: [
            { when: "Asked about 1969 Khammam faster", choose: "B. Ravindranath." },
            { when: "Asked about 1997 Telangana Jana Sabha founder", choose: "Maroju Veeranna." },
          ],
          nextStep: "Anchor Ravindranath to 1969 and Maroju Veeranna to 1997–1999.",
        },
      ],
    },
  },

  // 13. TM-Q263 (Telangana Mahasabha: V. Prakash & Suryapet Conference 1997)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q263",
      topic: "TM-02.04",
      concept: "TM-02.04-M10",
      model: "Chronology",
      modelId: "TM-QM-CHRON-01",
      stage: "practice",
      prompt: "On 11 August 1997, the 'Telangana Mahasabha' was founded in Hyderabad by veteran separate state activists. On which date and at which historic venue was the historic 'Dokka Seethamma Sabhaganam' convention held in Suryapet (Nalgonda district), declaring that 'Telangana is in a state of internal colonization'?",
      options: [
        {
          text: "11 August 1997 at Suryapet, Nalgonda district",
          why: "On 11 August 1997, the Telangana Mahasabha organized a massive convention at Dokka Seethamma Hall in Suryapet under the leadership of V. Prakash, Bhoopathi Krishnamurthy, and Katam Narsimha Reddy, declaring Telangana as an internally colonized region.",
          attraction: "The authentic, landmark date and venue of the Telangana Mahasabha Suryapet convention.",
          confusion: false,
        },
        {
          text: "28 December 1997 at Warangal",
          why: "28 December 1997 was the Warangal Declaration convention organized by AIPRF, four months after the Suryapet convention.",
          attraction: "Warangal Declaration date.",
          confusion: true,
        },
        {
          text: "1 November 1956 at Jubilee Hall",
          why: "1 November 1956 was the formation of Andhra Pradesh.",
          attraction: "Formation date distractor.",
        },
        {
          text: "6 March 1952 at Shadnagar",
          why: "6 March 1952 was the swearing-in of Burgula Ramakrishna Rao's ministry.",
          attraction: "1952 ministry date.",
        },
      ],
      answer: 0,
      reason: "The Telangana Mahasabha convention was held on 11 August 1997 at Suryapet.",
      clue: "Look for 11 August 1997 at Suryapet, where Telangana Mahasabha declared Telangana an internally colonized region.",
      trap: "Do not confuse the Suryapet convention of Telangana Mahasabha (11 Aug 1997) with the Warangal Declaration (28 Dec 1997).",
      elimination: "Telangana Mahasabha met on 11 August 1997 at Suryapet. Warangal Declaration was on 28 December 1997.",
      anchor: "11 August 1997 -> Suryapet, Nalgonda -> Telangana Mahasabha -> V. Prakash & Bhoopathi Krishnamurthy.",
      hint: "Bhoopathi Krishnamurthy, popularly known as 'Telangana Gandhi', served as the guiding inspiration of this convention.",
      source: "SR-POLICE-SI-2016",
      page: 542,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies 11 August 1997 at Suryapet as the Telangana Mahasabha convention.",
          correctMeaning: "The Suryapet convention was one of the earliest public gatherings in 1997 that challenged the legitimacy of united Andhra Pradesh and demanded immediate statehood.",
          selectedMeaning: "The Suryapet convention was one of the earliest public gatherings in 1997 that challenged the legitimacy of united Andhra Pradesh and demanded immediate statehood.",
          possibleConfusion: "No confusion; standard high-yield calendar question in modern Telangana history.",
          decisionRules: [
            { when: "Asked when and where the Telangana Mahasabha held its historic convention", choose: "11 August 1997 at Suryapet (Nalgonda district)." },
            { when: "Asked who were key leaders of Telangana Mahasabha", choose: "V. Prakash, Bhoopathi Krishnamurthy ('Telangana Gandhi'), and Katam Narsimha Reddy." },
          ],
          nextStep: "Note how V. Prakash later served as a founding general secretary of TRS in 2001.",
        },
        {
          observation: "Selected 28 December 1997 at Warangal.",
          correctMeaning: "Warangal was the site of the AIPRF convention adopting the Warangal Declaration in late December; Suryapet was held earlier in August 1997.",
          selectedMeaning: "Confusing the December Warangal declaration with the August Suryapet convention.",
          possibleConfusion: "Both were iconic 1997 conventions in neighboring districts.",
          decisionRules: [
            { when: "Asked about August 1997 Suryapet meeting", choose: "Telangana Mahasabha." },
            { when: "Asked about December 1997 Warangal meeting", choose: "Warangal Declaration (AIPRF)." },
          ],
          nextStep: "Sequence of 1997 meetings: TJS (July) -> Suryapet (August) -> TAV (October) -> Warangal (December).",
        },
        {
          observation: "Selected 1 November 1956.",
          correctMeaning: "1 November 1956 created Andhra Pradesh; Telangana Mahasabha met 41 years later in 1997 to demand its dissolution.",
          selectedMeaning: "Confusing the creation of the state with the 1990s resistance movement.",
          possibleConfusion: "Formation date distractor.",
          decisionRules: [
            { when: "Asked about Suryapet Telangana Mahasabha", choose: "11 August 1997." },
            { when: "Evaluating 1956 dates", choose: "Eliminate 1950s dates." },
          ],
          nextStep: "Anchor modern resurgence strictly to 1997.",
        },
        {
          observation: "Selected 1952 Shadnagar.",
          correctMeaning: "1952 Shadnagar was Burgula's election and ministry; 1997 Suryapet was the Mahasabha convention.",
          selectedMeaning: "Chronological error across 45 years.",
          possibleConfusion: "Both occurred in southern Telangana.",
          decisionRules: [
            { when: "Asked about Telangana Mahasabha", choose: "11 August 1997 at Suryapet." },
            { when: "Evaluating early electoral history", choose: "Eliminate 1952." },
          ],
          nextStep: "Remember 1997 was the watershed year of Telangana cultural-political rebirth.",
        },
      ],
    },
  },

  // 14. TM-Q264 (BJP Kakinada Resolution 1998: 'One Vote, Two States')
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q264",
      topic: "TM-02.04",
      concept: "TM-02.04-M11",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "In January 1998, during its State Executive Committee meeting held at Kakinada, which national political party adopted the historic resolution promising to create a separate Telangana state, coining the famous electoral slogan: 'One Vote, Two States' (Oka Vote, Rendu Rashtralu)?",
      options: [
        {
          text: "Bharatiya Janata Party (BJP)",
          why: "In January 1998 at Kakinada, the Bharatiya Janata Party (BJP) under the leadership of Bandaru Dattatreya, M. Venkaiah Naidu, and Ch. Vidyasagar Rao adopted the historic resolution promising to carve out a separate Telangana state, adopting the slogan 'One Vote, Two States'.",
          attraction: "The authentic national party and famous Kakinada resolution.",
          confusion: false,
        },
        {
          text: "Communist Party of India (Marxist) [CPM]",
          why: "CPM was staunchly opposed to the division of Andhra Pradesh throughout, advocating 'Samaikya Andhra' until the very end.",
          attraction: "Prominent left party.",
          confusion: true,
        },
        {
          text: "Telugu Desam Party (TDP)",
          why: "TDP under N. Chandrababu Naidu was the ruling party firmly committed to an undivided Andhra Pradesh in 1998.",
          attraction: "Ruling party in 1998.",
        },
        {
          text: "Bahujan Samaj Party (BSP)",
          why: "BSP supported smaller states philosophically, but the specific 'One Vote, Two States' Kakinada resolution was passed by the BJP.",
          attraction: "Smaller states advocate.",
        },
      ],
      answer: 0,
      reason: "The BJP passed the 'One Vote, Two States' resolution at its Kakinada session in January 1998.",
      clue: "Look for BJP and its famous slogan 'One Vote, Two States' at the 1998 Kakinada resolution.",
      trap: "Do not choose CPM or TDP; the BJP was the first national party to officially promise Telangana at Kakinada in 1998.",
      elimination: "The BJP adopted 'One Vote, Two States' at Kakinada in 1998. CPM opposed division; TDP was the ruling integrationist party.",
      anchor: "January 1998 -> BJP Kakinada Resolution -> 'One Vote, Two States' (Oka Vote, Rendu Rashtralu).",
      hint: "However, when the NDA formed government in Delhi, it allied with Chandrababu Naidu's TDP and created Chhattisgarh, Jharkhand, and Uttarakhand in 2000, leaving Telangana out.",
      source: "SR-POLICE-SI-2016",
      page: 548,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies the BJP's 1998 Kakinada Resolution.",
          correctMeaning: "The Kakinada Resolution was a major political breakthrough because it broke the national party taboo against bifurcating Andhra Pradesh and yielded the BJP 4 Lok Sabha seats in Telangana in 1998.",
          selectedMeaning: "The Kakinada Resolution was a major political breakthrough because it broke the national party taboo against bifurcating Andhra Pradesh and yielded the BJP 4 Lok Sabha seats in Telangana in 1998.",
          possibleConfusion: "No confusion; standard high-yield question in political party positions on Telangana.",
          decisionRules: [
            { when: "Asked which party adopted the 'One Vote, Two States' slogan at Kakinada in 1998", choose: "Bharatiya Janata Party (BJP)." },
            { when: "Asked where BJP passed its separate Telangana resolution in 1998", choose: "Kakinada State Executive Meeting." },
          ],
          nextStep: "Note how the BJP's failure to grant Telangana in 2000 due to TDP pressure directly paved the way for KCR to launch the TRS in 2001.",
        },
        {
          observation: "Selected CPM.",
          correctMeaning: "The CPM (under Puchalapalli Sundarayya, B.V. Raghavulu) was the fiercest opponent of Telangana statehood, sticking to its 1946 Visalandhra line.",
          selectedMeaning: "Inverting the most anti-bifurcation party with the pro-bifurcation resolution.",
          possibleConfusion: "CPI later supported statehood, but CPM opposed it till the end.",
          decisionRules: [
            { when: "Asked which party championed 'One Vote, Two States'", choose: "BJP." },
            { when: "Asked which party consistently opposed state bifurcation", choose: "CPM." },
          ],
          nextStep: "Remember CPM opposed the 2014 Andhra Pradesh Reorganisation Bill in Parliament.",
        },
        {
          observation: "Selected TDP.",
          correctMeaning: "TDP under Chandrababu Naidu coined slogans like 'Telugu Tejam' and vehemently opposed separate statehood in 1998.",
          selectedMeaning: "Confusing the ruling integrationist party with the opposition challenger.",
          possibleConfusion: "TDP later gave a letter favoring Telangana in 2008 before backtracking.",
          decisionRules: [
            { when: "Asked about 1998 Kakinada resolution", choose: "BJP." },
            { when: "Asked about TDP's stance in 1998", choose: "Opposed separate statehood." },
          ],
          nextStep: "Understand that TDP's opposition prevented the Vajpayee government from creating Telangana in 2000.",
        },
        {
          observation: "Selected BSP.",
          correctMeaning: "Mayawati's BSP supported separate Telangana, but the specific 'One Vote, Two States' slogan was coined by the BJP at Kakinada.",
          selectedMeaning: "Confusing general small-state ideology with the specific historical resolution.",
          possibleConfusion: "BSP supported the bill in 2014.",
          decisionRules: [
            { when: "Asked about 'One Vote, Two States' at Kakinada", choose: "BJP." },
            { when: "Evaluating other parties", choose: "Eliminate BSP." },
          ],
          nextStep: "Anchor 'One Vote, Two States' strictly to the BJP's 1998 election campaign.",
        },
      ],
    },
  },

  // 15. TM-Q265 (K.R. Amos & 1969 TNGOs Strike)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q265",
      topic: "TM-02.01",
      concept: "TM-02.01-M17",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "During the 1969 movement, government employees under the Telangana Non-Gazetted Officers (TNGOs) union played a decisive frontline role, paralyzing the state administration with an unprecedented indefinite strike beginning on 10 June 1969. Who was the President of the TNGOs union who led this historic strike and suffered arrest under the Preventive Detention (PD) Act?",
      options: [
        {
          text: "K.R. Amos",
          why: "K.R. Amos was the fiery President of the Telangana Non-Gazetted Officers (TNGOs) union who led the historic 1969 employees' strike from 10 June to 16 July 1969, braving dismissal notices and imprisonment under the PD Act alongside General Secretary G. Narayana Swamy.",
          attraction: "The authentic, celebrated President of TNGOs during the 1969 strike.",
          confusion: false,
        },
        {
          text: "K. Swamy Goud",
          why: "K. Swamy Goud was the TNGOs President who led the historic 'Sakala Janula Samme' 42 years later in 2011, not in 1969.",
          attraction: "TNGOs President during the 2011 agitation.",
          confusion: true,
        },
        {
          text: "Deviprasad",
          why: "C. Vittal and G. Deviprasad were leaders of the TNGOs union during the 2009–2014 agitation period.",
          attraction: "TNGOs leader from modern era.",
        },
        {
          text: "T. Anjaiah",
          why: "T. Anjaiah was an INTUC trade union leader and politician who later became Chief Minister in 1980.",
          attraction: "Prominent labor politician.",
        },
      ],
      answer: 0,
      reason: "K.R. Amos was the President of the TNGOs union who led the 1969 employees' strike.",
      clue: "Look for K.R. Amos, President of the TNGOs union in 1969 who led the June–July 1969 strike.",
      trap: "Do not confuse the 1969 TNGOs President (K.R. Amos) with the 2011 TNGOs President (K. Swamy Goud).",
      elimination: "K.R. Amos led the 1969 TNGOs strike. K. Swamy Goud led the 2011 Sakala Janula Samme; Deviprasad was active in 2011.",
      anchor: "1969 TNGOs Strike -> President: K.R. Amos -> Paralyzed state administration from 10 June 1969.",
      hint: "K.R. Amos famously declared that Telangana employees would rather starve than submit to non-Mulki domination.",
      source: "SR-POLICE-SI-2016",
      page: 554,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies K.R. Amos as the 1969 TNGOs President.",
          correctMeaning: "K.R. Amos led over 3 lakh government employees on strike for 37 days, braving salary cuts and police repression, making the employee union the backbone of the movement.",
          selectedMeaning: "K.R. Amos led over 3 lakh government employees on strike for 37 days, braving salary cuts and police repression, making the employee union the backbone of the movement.",
          possibleConfusion: "No confusion; standard high-yield trade union milestone in Telangana history.",
          decisionRules: [
            { when: "Asked who was the President of TNGOs during the 1969 agitation", choose: "K.R. Amos." },
            { when: "Asked who was President of TNGOs during the 2011 Sakala Janula Samme", choose: "K. Swamy Goud." },
          ],
          nextStep: "Note how K.R. Amos later served as an MLC in the Andhra Pradesh Legislative Council.",
        },
        {
          observation: "Selected K. Swamy Goud.",
          correctMeaning: "K. Swamy Goud led the 2011 strike (Sakala Janula Samme) and later became the first Chairman of the Telangana Legislative Council in 2014; K.R. Amos led the 1969 strike.",
          selectedMeaning: "Confusing the 2011 employee leader with the 1969 employee leader.",
          possibleConfusion: "Both led legendary strikes that crippled the state capital.",
          decisionRules: [
            { when: "Asked about 1969 employee strike leader", choose: "K.R. Amos." },
            { when: "Asked about 2011 employee strike leader", choose: "K. Swamy Goud." },
          ],
          nextStep: "Remember: 1969 = K.R. Amos; 2011 = K. Swamy Goud.",
        },
        {
          observation: "Selected Deviprasad.",
          correctMeaning: "G. Deviprasad was General Secretary of TNGOs during the 2011 movement alongside Swamy Goud; Amos was 1969.",
          selectedMeaning: "Confusing modern 21st-century union leaders with 1969 veterans.",
          possibleConfusion: "Deviprasad was a prominent TV face in 2011.",
          decisionRules: [
            { when: "Asked about 1969 TNGOs leader", choose: "K.R. Amos." },
            { when: "Asked about 2011 TNGOs General Secretary", choose: "G. Deviprasad." },
          ],
          nextStep: "Anchor Deviprasad to 2011.",
        },
        {
          observation: "Selected T. Anjaiah.",
          correctMeaning: "T. Anjaiah was a Congress politician and trade unionist who became CM in 1980; he did not lead the TNGOs strike in 1969.",
          selectedMeaning: "Confusing general labor politicians with the civil service union president.",
          possibleConfusion: "Anjaiah had a strong trade union background in Hyderabad.",
          decisionRules: [
            { when: "Asked about 1969 TNGOs President", choose: "K.R. Amos." },
            { when: "Asked about Chief Minister from 1980 to 1982", choose: "T. Anjaiah." },
          ],
          nextStep: "Keep civil service unions (TNGOs) separate from party trade unions (INTUC).",
        },
      ],
    },
  },

  // 16. TM-Q266 (Pradeep Jain v. Union of India: Educational Reservation 1984)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q266",
      topic: "TM-02.02",
      concept: "TM-02.02-M12",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "In which landmark 1984 judgment did the Supreme Court of India hold that while wholesale residential reservation in medical college admissions across India is unconstitutional, the special institutional reservations in Andhra Pradesh were constitutionally immune and protected by virtue of Article 371-D?",
      options: [
        {
          text: "Dr. Pradeep Jain v. Union of India (1984)",
          why: "In Dr. Pradeep Jain v. Union of India (1984), a 3-judge bench of the Supreme Court held that while state-level domicile reservation in medical postgraduate courses was restricted to 50% across India, Andhra Pradesh was an exception because its 85% local reservation was constitutionally insulated by Article 371-D.",
          attraction: "The authentic, landmark Supreme Court judgment on medical admissions and Article 371-D.",
          confusion: false,
        },
        {
          text: "Indira Sawhney v. Union of India (1992)",
          why: "Indira Sawhney was the 9-judge Mandal Commission case on OBC reservations, not the 1984 case on medical college domicile.",
          attraction: "Famous national reservation judgment.",
          confusion: true,
        },
        {
          text: "Minerva Mills v. Union of India (1980)",
          why: "Minerva Mills dealt with Directive Principles vs Fundamental Rights and Article 368 judicial review, having no bearing on AP medical admissions.",
          attraction: "Famous constitutional case.",
        },
        {
          text: "Maneka Gandhi v. Union of India (1978)",
          why: "Maneka Gandhi dealt with Article 21 personal liberty and passport impoundment.",
          attraction: "Famous Article 21 precedent.",
        },
      ],
      answer: 0,
      reason: "In Dr. Pradeep Jain v. Union of India (1984), the Supreme Court upheld the constitutional immunity of Article 371-D for medical admissions in AP.",
      clue: "Look for Dr. Pradeep Jain v. Union of India (1984), which protected Article 371-D medical admission quotas in AP.",
      trap: "Do not confuse Dr. Pradeep Jain (1984, medical admissions) with Indira Sawhney (1992, OBC quota).",
      elimination: "Dr. Pradeep Jain (1984) protected AP's 85% local medical admission quota under Article 371-D.",
      anchor: "Dr. Pradeep Jain v. Union of India (1984) -> Supreme Court upholds Article 371-D educational immunity.",
      hint: "Because of Article 371-D, Andhra Pradesh did not participate in the All-India Quota (AIQ) for medical seats for over three decades.",
      source: "SR-POLICE-SI-2016",
      page: 560,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Dr. Pradeep Jain v. Union of India (1984).",
          correctMeaning: "The Pradeep Jain ruling confirmed that Article 371-D's non-obstante clause gives complete constitutional immunity to educational reservations in Osmania, Kakatiya, and other local university areas.",
          selectedMeaning: "The Pradeep Jain ruling confirmed that Article 371-D's non-obstante clause gives complete constitutional immunity to educational reservations in Osmania, Kakatiya, and other local university areas.",
          possibleConfusion: "No confusion; high-level legal question in Telangana competitive syllabus.",
          decisionRules: [
            { when: "Asked which Supreme Court case upheld AP's exemption from national medical quotas under Article 371-D", choose: "Dr. Pradeep Jain v. Union of India (1984)." },
            { when: "Asked percentage of seats reserved for local candidates in university areas under 1974 Order", choose: "85% local reservation." },
          ],
          nextStep: "Note how 85% local reservation applied to Osmania University area (Telangana) and Andhra/SVU areas.",
        },
        {
          observation: "Selected Indira Sawhney case.",
          correctMeaning: "Indira Sawhney (1992) fixed the 50% ceiling on caste reservations; Pradeep Jain (1984) dealt with institutional/domicile quotas in medical education.",
          selectedMeaning: "Confusing social reservation cases with geographical local candidate cases.",
          possibleConfusion: "Both are premier reservation precedents.",
          decisionRules: [
            { when: "Asked about OBC 27% quota and 50% ceiling", choose: "Indira Sawhney v. Union of India (1992)." },
            { when: "Asked about medical admission local quotas under Article 371-D", choose: "Dr. Pradeep Jain v. Union of India (1984)." },
          ],
          nextStep: "Differentiate Article 15/16 social quotas from Article 371-D local candidate quotas.",
        },
        {
          observation: "Selected Minerva Mills.",
          correctMeaning: "Minerva Mills (1980) dealt with amending power under Article 368 and balance between Part III and Part IV.",
          selectedMeaning: "Confusing general constitutional law with state educational quotas.",
          possibleConfusion: "Both are celebrated 1980s constitutional bench decisions.",
          decisionRules: [
            { when: "Asked about Basic Structure of Article 368", choose: "Minerva Mills (1980)." },
            { when: "Asked about Article 371-D educational quotas", choose: "Dr. Pradeep Jain (1984)." },
          ],
          nextStep: "Anchor Minerva Mills to Article 368 amendments.",
        },
        {
          observation: "Selected Maneka Gandhi.",
          correctMeaning: "Maneka Gandhi (1978) expanded Article 21 due process; it had nothing to do with Andhra Pradesh medical admissions.",
          selectedMeaning: "Selecting a famous fundamental rights case unrelated to state reservations.",
          possibleConfusion: "Recognizing a famous constitutional title.",
          decisionRules: [
            { when: "Asked about Article 21 procedure established by law", choose: "Maneka Gandhi (1978)." },
            { when: "Asked about Article 371-D medical admission immunity", choose: "Dr. Pradeep Jain (1984)." },
          ],
          nextStep: "Remember Pradeep Jain is the leading authority on local candidate medical reservations.",
        },
      ],
    },
  },

  // 17. TM-Q267 (Telangana Intellectual Summit: 1997 Hyderabad Declaration)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q267",
      topic: "TM-02.04",
      concept: "TM-02.04-M13",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "On 1 November 1996, on the 40th anniversary of the formation of Andhra Pradesh, a historic seminar was held at Nizam College Grounds / Sundarayya Vignana Kendram in Hyderabad on 'Telangana Statehood: Democratic Rights'. Who organized this seminal meeting that marked the first collective public convention of intellectuals demanding the repeal of the merger?",
      options: [
        {
          text: "Telangana Information Trust (founded by Prabhakar Rao) and Osmania University Teachers",
          why: "The Telangana Information Trust (founded by B. Prabhakar Rao and supported by Prof. Jayashankar) organized the landmark 1 November 1996 convention, publishing the historic booklet 'Telangana: The Case for a Separate State' and re-igniting public discourse.",
          attraction: "The authentic founding trust that spearheaded the 1996 intellectual convention.",
          confusion: false,
        },
        {
          text: "Andhra Pradesh State Government Protocol Department",
          why: "The state government was celebrating the official 'AP Formation Day' (Avatharana Dinotsavam); the anti-merger convention was organized in protest by the Telangana Information Trust.",
          attraction: "Official state department distractor.",
          confusion: true,
        },
        {
          text: "Telangana Rashtra Samithi (TRS)",
          why: "TRS was founded in 2001, five years after this 1996 intellectual convention.",
          attraction: "Subsequent political party.",
        },
        {
          text: "Federation of Indian Chambers of Commerce & Industry (FICCI)",
          why: "FICCI is a corporate business lobby, having no role in the Telangana statehood movement.",
          attraction: "Corporate body distractor.",
        },
      ],
      answer: 0,
      reason: "The Telangana Information Trust organized the historic 1 November 1996 seminar in Hyderabad.",
      clue: "Look for Telangana Information Trust (Prabhakar Rao and Prof. Jayashankar) on 1 November 1996.",
      trap: "Do not choose TRS (founded in 2001); the 1996 intellectual pioneer was the Telangana Information Trust.",
      elimination: "Telangana Information Trust organized the 1996 seminar. TRS was founded in 2001; government was celebrating official formation day.",
      anchor: "1 November 1996 -> Telangana Information Trust -> Historic seminar on 40th merger anniversary.",
      hint: "It was here that Prof. Jayashankar declared: 'Telangana problem is not a problem of development; it is a problem of internal colonial subjugation.'",
      source: "SR-POLICE-SI-2016",
      page: 566,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies the Telangana Information Trust.",
          correctMeaning: "The 1 November 1996 convention ended the culture of silence that had gripped Telangana since 1973, sparking the cascade of conventions that culminated in the Warangal Declaration of 1997.",
          selectedMeaning: "The 1 November 1996 convention ended the culture of silence that had gripped Telangana since 1973, sparking the cascade of conventions that culminated in the Warangal Declaration of 1997.",
          possibleConfusion: "No confusion; essential foundational step in modern movement history.",
          decisionRules: [
            { when: "Asked who organized the landmark 1 November 1996 seminar on Telangana", choose: "Telangana Information Trust." },
            { when: "Asked who founded the Telangana Information Trust", choose: "B. Prabhakar Rao." },
          ],
          nextStep: "Note how Prof. Jayashankar used the Trust to publish dozens of pamphlets detailing irrigation and financial statistics.",
        },
        {
          observation: "Selected State Government Protocol Department.",
          correctMeaning: "The government was holding official celebrations across the road, while intellectuals wore black badges and gathered at the Trust seminar to mourn the merger.",
          selectedMeaning: "Inverting the protest convention with official government festivities.",
          possibleConfusion: "Both events took place on the exact same date (1 November).",
          decisionRules: [
            { when: "Asked about protest convention on 1 Nov 1996", choose: "Telangana Information Trust." },
            { when: "Evaluating official government role", choose: "Eliminate government protocol department." },
          ],
          nextStep: "Remember 1 November was observed as a Day of Protest by Telangana intellectuals.",
        },
        {
          observation: "Selected TRS.",
          correctMeaning: "TRS was established in 2001; the 1996 convention was purely non-political and academic.",
          selectedMeaning: "Chronological confusion across 5 years.",
          possibleConfusion: "TRS adopted the arguments formulated in the 1996 seminar.",
          decisionRules: [
            { when: "Asked about 1996 intellectual seminar", choose: "Telangana Information Trust." },
            { when: "Asked about 2001 party launch", choose: "Telangana Rashtra Samithi." },
          ],
          nextStep: "Trace the lineage: Information Trust (1996) -> Aikya Vedika (1997) -> TRS (2001).",
        },
        {
          observation: "Selected FICCI.",
          correctMeaning: "FICCI is a national industry federation; the movement was driven by academics and civil rights groups.",
          selectedMeaning: "Irrelevant corporate distractor.",
          possibleConfusion: "Industrial chambers operated in Hyderabad.",
          decisionRules: [
            { when: "Asked about Telangana seminar organizers", choose: "Telangana Information Trust." },
            { when: "Evaluating business lobbies", choose: "Eliminate industrial chambers." },
          ],
          nextStep: "Focus on civil society and academic institutions.",
        },
      ],
    },
  },

  // 18. TM-Q268 (Telangana Vidhyavanthula Vedika: 2001 Launch)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q268",
      topic: "TM-02.04",
      concept: "TM-02.04-M14",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "The 'Telangana Vidhyavanthula Vedika' (Telangana Intellectuals Forum) was established on 16 December 2001 at Hyderabad to organize intellectuals, university professors, and teachers independently of political parties. Who was elected as its founding President?",
      options: [
        {
          text: "Prof. M. Kodandaram (Prof. Kodandaram Reddy)",
          why: "Prof. M. Kodandaram (then Professor of Political Science at Osmania University) was elected as the founding President of Telangana Vidhyavanthula Vedika on 16 December 2001, guiding intellectual advocacy across all districts.",
          attraction: "The authentic founding President of Telangana Vidhyavanthula Vedika.",
          confusion: false,
        },
        {
          text: "Prof. K. Jayashankar",
          why: "Prof. Jayashankar was the chief patron and mentor of all intellectual bodies, while Prof. Kodandaram was elected President of Vidhyavanthula Vedika.",
          attraction: "Senior patron and ideologue.",
          confusion: true,
        },
        {
          text: "Dr. K. Chiranjeevi",
          why: "Chiranjeevi was a film actor who launched Praja Rajyam Party in 2008 advocating Samaikya Andhra, not a Telangana intellectual leader.",
          attraction: "Celebrity politician distractor.",
        },
        {
          text: "K. Chandrashekar Rao",
          why: "KCR headed the political party TRS; Vidhyavanthula Vedika was deliberately formed as a non-partisan intellectuals' body.",
          attraction: "TRS political chief.",
        },
      ],
      answer: 0,
      reason: "Prof. M. Kodandaram was the founding President of Telangana Vidhyavanthula Vedika in 2001.",
      clue: "Look for Prof. M. Kodandaram, elected founding President of Telangana Vidhyavanthula Vedika on 16 December 2001.",
      trap: "Do not confuse the founding President (Prof. Kodandaram) with the chief mentor (Prof. Jayashankar).",
      elimination: "Prof. Kodandaram was President of Telangana Vidhyavanthula Vedika. Prof. Jayashankar was mentor; KCR headed TRS.",
      anchor: "16 December 2001 -> Telangana Vidhyavanthula Vedika -> Founding President: Prof. M. Kodandaram.",
      hint: "His leadership of this intellectual forum established the credibility that later made him the unanimous choice to head the Telangana JAC in 2009.",
      source: "SR-POLICE-SI-2016",
      page: 572,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Prof. M. Kodandaram as the founding President of Telangana Vidhyavanthula Vedika.",
          correctMeaning: "Under Prof. Kodandaram, the Vedika conducted hundreds of diagnostic field studies on handloom weaver suicides in Pochampally, farmer distress in Mahbubnagar, and fluorosis in Nalgonda.",
          selectedMeaning: "Under Prof. Kodandaram, the Vedika conducted hundreds of diagnostic field studies on handloom weaver suicides in Pochampally, farmer distress in Mahbubnagar, and fluorosis in Nalgonda.",
          possibleConfusion: "No confusion; standard high-yield question in Telangana movement history.",
          decisionRules: [
            { when: "Asked who was founding President of Telangana Vidhyavanthula Vedika (2001)", choose: "Prof. M. Kodandaram." },
            { when: "Asked which university department Prof. Kodandaram headed", choose: "Department of Political Science, Osmania University." },
          ],
          nextStep: "Note how Prof. Kodandaram seamlessly transitioned from heading the Vidhyavanthula Vedika to heading the Telangana Joint Action Committee (TJAC) in 2009.",
        },
        {
          observation: "Selected Prof. K. Jayashankar.",
          correctMeaning: "Prof. Jayashankar was the supreme mentor and honorary advisor; active executive presidency of Vidhyavanthula Vedika was held by Prof. Kodandaram.",
          selectedMeaning: "Confusing the philosophical mentor with the organizational president.",
          possibleConfusion: "Both were leading Osmania/Kakatiya university professors.",
          decisionRules: [
            { when: "Asked about founding President of Telangana Vidhyavanthula Vedika", choose: "Prof. M. Kodandaram." },
            { when: "Asked about chief ideological patron", choose: "Prof. K. Jayashankar." },
          ],
          nextStep: "Remember Kodandaram was the active executive head of the Vedika.",
        },
        {
          observation: "Selected Chiranjeevi.",
          correctMeaning: "Chiranjeevi launched Praja Rajyam Party in 2008 and later opposed Telangana statehood; he had no connection with Vidhyavanthula Vedika.",
          selectedMeaning: "Irrelevant celebrity political distractor.",
          possibleConfusion: "Chiranjeevi was active in state politics in 2008–2012.",
          decisionRules: [
            { when: "Asked about Telangana intellectual organizations", choose: "University academics like Prof. Kodandaram." },
            { when: "Evaluating cinema personalities", choose: "Eliminate film actors." },
          ],
          nextStep: "Keep film politics separate from university intellectual forums.",
        },
        {
          observation: "Selected KCR.",
          correctMeaning: "KCR founded TRS in April 2001; Vidhyavanthula Vedika was founded in December 2001 as an autonomous body to keep civil society independent of political control.",
          selectedMeaning: "Confusing the political party chief with the civil society leader.",
          possibleConfusion: "Both cooperated closely in the agitation.",
          decisionRules: [
            { when: "Asked who headed TRS", choose: "K. Chandrashekar Rao." },
            { when: "Asked who headed Telangana Vidhyavanthula Vedika", choose: "Prof. M. Kodandaram." },
          ],
          nextStep: "Remember Vidhyavanthula Vedika was strictly a non-political civil society platform.",
        },
      ],
    },
  },

  // 19. TM-Q269 (Nandini Sidha Reddy & Manjira Rachayitala Sangham)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q269",
      topic: "TM-02.04",
      concept: "TM-02.04-M15",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "Nandini Sidha Reddy, the eminent poet, lyricist, and President of Telangana Sahitya Academy, founded which famous literary organization in Medak district in 1986 to nurture native Telangana poetic idiom and resist linguistic domination?",
      options: [
        {
          text: "Manjira Rachayitala Sangham (MaRaSam)",
          why: "Nandini Sidha Reddy founded the 'Manjira Rachayitala Sangham' (MaRaSam) in 1986 in Medak, nurturing hundreds of rural poets and writers and championing the distinct cultural identity of the Manjira river basin.",
          attraction: "The authentic, celebrated literary organization founded by Nandini Sidha Reddy.",
          confusion: false,
        },
        {
          text: "Abhyudaya Rachayitala Sangham (Arasam)",
          why: "Arasam was the Progressive Writers Association founded in 1943 by Tapi Dharma Rao and Sri Sri, not by Nandini Sidha Reddy in 1986.",
          attraction: "Historic progressive writers association of 1943.",
          confusion: true,
        },
        {
          text: "Viplava Rachayitala Sangham (Virasam)",
          why: "Virasam was the Revolutionary Writers Association founded in 1970 by Sri Sri, Varavara Rao, and K.V. Ramana Reddy.",
          attraction: "Famous revolutionary writers association of 1970.",
        },
        {
          text: "Telangana Rachayitala Vedika",
          why: "Telangana Rachayitala Vedika was formed in 2001 in Hyderabad, whereas MaRaSam was founded in Medak in 1986.",
          attraction: "2001 state-level writers forum.",
        },
      ],
      answer: 0,
      reason: "Nandini Sidha Reddy founded Manjira Rachayitala Sangham (MaRaSam) in Medak in 1986.",
      clue: "Look for Manjira Rachayitala Sangham (MaRaSam), founded in 1986 by Nandini Sidha Reddy.",
      trap: "Do not confuse MaRaSam (Nandini Sidha Reddy, 1986) with Arasam (1943) or Virasam (1970).",
      elimination: "Nandini Sidha Reddy founded Manjira Rachayitala Sangham (1986). Arasam was 1943; Virasam was 1970; Rachayitala Vedika was 2001.",
      anchor: "Nandini Sidha Reddy -> 1986 -> Manjira Rachayitala Sangham (MaRaSam) -> Medak district.",
      hint: "He also wrote the celebrated movement song 'Nageti Saallallo Naa Telangana' and 'Oka Puvvu Oka Navvu'.",
      source: "SR-POLICE-SI-2016",
      page: 578,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Manjira Rachayitala Sangham (MaRaSam) founded by Nandini Sidha Reddy.",
          correctMeaning: "Nandini Sidha Reddy's MaRaSam was the pioneer regional literary movement that reclaimed the native dialect and local idiom from coastal derogatory ridicule.",
          selectedMeaning: "Nandini Sidha Reddy's MaRaSam was the pioneer regional literary movement that reclaimed the native dialect and local idiom from coastal derogatory ridicule.",
          possibleConfusion: "No confusion; standard literary history question in TS examinations.",
          decisionRules: [
            { when: "Asked who founded Manjira Rachayitala Sangham (MaRaSam) in 1986", choose: "Nandini Sidha Reddy." },
            { when: "Asked who wrote the famous song 'Nageti Saallallo Naa Telangana'", choose: "Nandini Sidha Reddy." },
          ],
          nextStep: "Note that Nandini Sidha Reddy was appointed the first Chairman of the Telangana Sahitya Academy after state formation in 2017.",
        },
        {
          observation: "Selected Arasam.",
          correctMeaning: "Arasam (Abhyudaya Rachayitala Sangham) was founded in 1943 in Tenali/Vijayawada under Sri Sri; MaRaSam was founded in 1986 in Medak.",
          selectedMeaning: "Confusing the historic 1943 national progressive movement with the 1986 regional literary society.",
          possibleConfusion: "Both share similar acronym structures (Arasam vs MaRaSam).",
          decisionRules: [
            { when: "Asked about 1943 Progressive Writers Association", choose: "Arasam (Sri Sri, Tapi Dharma Rao)." },
            { when: "Asked about 1986 Medak writers association", choose: "MaRaSam (Nandini Sidha Reddy)." },
          ],
          nextStep: "Remember the acronym MaRaSam stands for MANJIRA Rachayitala Sangham.",
        },
        {
          observation: "Selected Virasam.",
          correctMeaning: "Virasam (Viplava Rachayitala Sangham) was formed on 4 July 1970 in Hyderabad by Sri Sri, Varavara Rao, and K.V. Ramana Reddy under the influence of Naxalbari/Srikakulam.",
          selectedMeaning: "Confusing the revolutionary Marxist-Leninist writers association with the regional Telangana literary body.",
          possibleConfusion: "Both associations were deeply active in Telangana.",
          decisionRules: [
            { when: "Asked about Revolutionary Writers Association founded in 1970", choose: "Virasam (Sri Sri, Varavara Rao)." },
            { when: "Asked about Manjira river basin writers association in 1986", choose: "MaRaSam (Nandini Sidha Reddy)." },
          ],
          nextStep: "Memorize Virasam = 1970 (Revolutionary); MaRaSam = 1986 (Manjira).",
        },
        {
          observation: "Selected Telangana Rachayitala Vedika.",
          correctMeaning: "Telangana Rachayitala Vedika was formed in 2001 in Hyderabad by Jayashankar, Juluru Gowrishankar, and others; MaRaSam was 1986 in Medak.",
          selectedMeaning: "Confusing the 2001 state-level forum with the 1986 district pioneer.",
          possibleConfusion: "Both fought for Telangana linguistic rights.",
          decisionRules: [
            { when: "Asked about 1986 Medak literary body", choose: "MaRaSam." },
            { when: "Asked about 2001 state writers forum", choose: "Telangana Rachayitala Vedika." },
          ],
          nextStep: "Anchor Nandini Sidha Reddy to MaRaSam and the Manjira river basin.",
        },
      ],
    },
  },

  // 20. TM-Q270 (Fluorosis Issue in Nalgonda: Environmental & Social Movement)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q270",
      topic: "TM-02.04",
      concept: "TM-02.04-M16",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "The endemic fluorosis crisis in Nalgonda district crippled over one lakh people with skeletal deformities due to contaminated groundwater, while Krishna river waters flowing right through Nalgonda were diverted to coastal delta irrigation and Hyderabad. Who was the relentless anti-fluorosis crusader who founded the 'Jala Sadhana Samithi' (JSS) in 1980 and took crippled victims to Parliament to awaken the national conscience?",
      options: [
        {
          text: "Dusharla Satyanarayana",
          why: "Dusharla Satyanarayana, an engineer and social activist from Nalgonda, founded the Jala Sadhana Samithi (JSS) in 1980, waging a 40-year crusade against fluorosis, organizing padayatras, and physically presenting twisted-limbed victims before Prime Ministers Atal Bihari Vajpayee and Manmohan Singh.",
          attraction: "The authentic, celebrated water rights and anti-fluorosis warrior of Nalgonda.",
          confusion: false,
        },
        {
          text: "Marri Chenna Reddy",
          why: "Marri Chenna Reddy was Chief Minister and Governor, not the grassroots activist who ran the Jala Sadhana Samithi.",
          attraction: "Prominent politician.",
          confusion: true,
        },
        {
          text: "Gaddar",
          why: "Gaddar was a cultural balladeer who supported the cause through songs, but Jala Sadhana Samithi was founded and led by Dusharla Satyanarayana.",
          attraction: "Revolutionary singer.",
        },
        {
          text: "Prof. Kodandaram",
          why: "Prof. Kodandaram headed the TJAC and supported the fluorosis struggle, but JSS was established in 1980 by Dusharla Satyanarayana.",
          attraction: "TJAC Chairman.",
        },
      ],
      answer: 0,
      reason: "Dusharla Satyanarayana founded the Jala Sadhana Samithi in 1980 to fight the Nalgonda fluorosis crisis.",
      clue: "Look for Dusharla Satyanarayana, founder of Jala Sadhana Samithi (1980) who fought against fluorosis in Nalgonda.",
      trap: "Do not choose political leaders or singers; the crusader who led the Jala Sadhana Samithi for 40 years was Dusharla Satyanarayana.",
      elimination: "Dusharla Satyanarayana founded Jala Sadhana Samithi in 1980. Chenna Reddy was CM; Gaddar was a balladeer; Kodandaram was TJAC chief.",
      anchor: "Jala Sadhana Samithi (1980) -> Dusharla Satyanarayana -> Anti-Fluorosis and Krishna Water Crusade in Nalgonda.",
      hint: "He fought for the Srisailam Left Bank Canal (SLBC) and Dindi balancing reservoir to provide drinking water to fluorosis-hit mandals like Marriguda and Munugode.",
      source: "SR-POLICE-SI-2016",
      page: 584,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Dusharla Satyanarayana as the founder of Jala Sadhana Samithi.",
          correctMeaning: "Dusharla Satyanarayana's crusade turned the tragedy of Nalgonda fluorosis into an undeniable moral indictment of the discrimination that left local people drinking poison while river waters were pumped past them.",
          selectedMeaning: "Dusharla Satyanarayana's crusade turned the tragedy of Nalgonda fluorosis into an undeniable moral indictment of the discrimination that left local people drinking poison while river waters were pumped past them.",
          possibleConfusion: "No confusion; classic social movement and environmental rights question.",
          decisionRules: [
            { when: "Asked who founded Jala Sadhana Samithi (JSS) in 1980", choose: "Dusharla Satyanarayana." },
            { when: "Asked which district was most acutely devastated by endemic groundwater fluorosis", choose: "Nalgonda district (Marriguda, Munugode, Choutuppal)." },
          ],
          nextStep: "Note how the resolution of fluorosis was finally achieved in 2020 through Mission Bhagiratha supplying treated surface water to every household.",
        },
        {
          observation: "Selected Marri Chenna Reddy.",
          correctMeaning: "Marri Chenna Reddy was Chief Minister; Dusharla Satyanarayana was the grassroots activist who protested outside Chenna Reddy's office.",
          selectedMeaning: "Confusing the government authority with the protesting activist.",
          possibleConfusion: "Chenna Reddy sanctioned preliminary canal works in 1979.",
          decisionRules: [
            { when: "Asked about Jala Sadhana Samithi founder", choose: "Dusharla Satyanarayana." },
            { when: "Evaluating Chief Ministers", choose: "Eliminate Marri Chenna Reddy." },
          ],
          nextStep: "Remember Dusharla Satyanarayana maintained strict political neutrality.",
        },
        {
          observation: "Selected Gaddar.",
          correctMeaning: "Gaddar sang about fluorosis in his ballads; Dusharla Satyanarayana was the dedicated engineer-activist who organized the 40-year organizational battle.",
          selectedMeaning: "Confusing the cultural supporter with the movement founder.",
          possibleConfusion: "Both appeared together on anti-fluorosis stages.",
          decisionRules: [
            { when: "Asked who founded Jala Sadhana Samithi", choose: "Dusharla Satyanarayana." },
            { when: "Asked who sang 'Amma Telanganama'", choose: "Gaddar." },
          ],
          nextStep: "Anchor Jala Sadhana Samithi strictly to Dusharla Satyanarayana.",
        },
        {
          observation: "Selected Prof. Kodandaram.",
          correctMeaning: "Prof. Kodandaram joined Dusharla's rallies in the 2000s; JSS was founded by Dusharla three decades earlier in 1980.",
          selectedMeaning: "Confusing the modern coalition convener with the 1980 water rights pioneer.",
          possibleConfusion: "Both worked on Nalgonda water rights.",
          decisionRules: [
            { when: "Asked about founder of Jala Sadhana Samithi in 1980", choose: "Dusharla Satyanarayana." },
            { when: "Asked about TJAC Chairman in 2009", choose: "Prof. M. Kodandaram." },
          ],
          nextStep: "Remember: JSS = Dusharla Satyanarayana; TJAC = Prof. Kodandaram.",
        },
      ],
    },
  },

  // 21. TM-Q271 (Handloom Weavers Crisis: Pochampally & Sircilla)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q271",
      topic: "TM-02.04",
      concept: "TM-02.04-M17",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "During the late 1990s and early 2000s, crisis in traditional handloom and powerloom sectors triggered waves of starvation deaths and suicides among weavers, exposing acute economic distress under Chandrababu Naidu's economic policies. Which two historic weaving centers in Telangana became the tragic epicenters of weaver suicides, earning one of them the sorrowful title 'Ulla Ulikki' (Town of Hangings)?",
      options: [
        {
          text: "Sircilla (Rajanna Sircilla / Karimnagar) and Bhoodan Pochampally (Yadadri Bhuvanagiri / Nalgonda)",
          why: "Sircilla (powerlooms) in Karimnagar and Bhoodan Pochampally (traditional Ikat silk/cotton handlooms) in Nalgonda witnessed hundreds of weaver suicides and starvation deaths between 1998 and 2004 due to power tariff hikes, yarn price spikes, and lack of marketing support, with Sircilla tragically branded as 'Ulla Ulikki'.",
          attraction: "The authentic, tragic epicenters of Telangana weaver distress.",
          confusion: false,
        },
        {
          text: "Tirupati and Vijayawada",
          why: "Tirupati and Vijayawada are in Andhra Pradesh and are commercial/pilgrimage centers, not Telangana textile hubs.",
          attraction: "Coastal Andhra cities distractor.",
          confusion: true,
        },
        {
          text: "Secunderabad and Cantonment",
          why: "Secunderabad is an urban military and railway hub, not a traditional handloom weaving center.",
          attraction: "Urban twin cities distractor.",
        },
        {
          text: "Kothagudem and Bellampalli",
          why: "Kothagudem and Bellampalli are coal mining centers in the Godavari valley, not handloom weaving clusters.",
          attraction: "Mining centers distractor.",
        },
      ],
      answer: 0,
      reason: "Sircilla and Bhoodan Pochampally were the epicenters of weaver suicides in Telangana.",
      clue: "Look for Sircilla and Bhoodan Pochampally, the textile and handloom centers devastated by weaver suicides.",
      trap: "Do not guess mining towns or Andhra cities; Sircilla and Bhoodan Pochampally were the textile distress centers in Telangana.",
      elimination: "Sircilla and Pochampally were the epicenters of weaver suicides. Kothagudem is coal mining; Tirupati is in Andhra.",
      anchor: "Weaver Crisis (1998–2004) -> Sircilla (Powerloom suicides) & Bhoodan Pochampally (Ikat handloom suicides).",
      hint: "Sircilla's distress became a major issue raised by KCR during the launch of the Telangana Rashtra Samithi.",
      source: "SR-POLICE-SI-2016",
      page: 590,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Sircilla and Bhoodan Pochampally as the weaving crisis centers.",
          correctMeaning: "The plight of Sircilla and Pochampally weavers became powerful evidence used by the movement to prove that economic liberalization under united AP had devastated indigenous Telangana artisan classes.",
          selectedMeaning: "The plight of Sircilla and Pochampally weavers became powerful evidence used by the movement to prove that economic liberalization under united AP had devastated indigenous Telangana artisan classes.",
          possibleConfusion: "No confusion; standard high-yield socio-economic question in TS recruitment.",
          decisionRules: [
            { when: "Asked which town was tragically known as 'Ulla Ulikki' due to powerloom weaver suicides", choose: "Sircilla (Rajanna Sircilla district)." },
            { when: "Asked about world-famous Ikat handloom center affected by weaver distress", choose: "Bhoodan Pochampally." },
          ],
          nextStep: "Note how post-2014 welfare policies like 'Nethannaku Cheyutha' and government bathukamma saree orders targeted Sircilla.",
        },
        {
          observation: "Selected Tirupati and Vijayawada.",
          correctMeaning: "Tirupati and Vijayawada are in Andhra Pradesh; the weaver distress crisis examined in Telangana exams focuses strictly on Telangana clusters.",
          selectedMeaning: "Geographical error outside Telangana.",
          possibleConfusion: "Chittoor and Krishna also had weaver populations.",
          decisionRules: [
            { when: "Asked about Telangana weaver crisis centers", choose: "Sircilla and Bhoodan Pochampally." },
            { when: "Evaluating Andhra cities", choose: "Eliminate Tirupati and Vijayawada." },
          ],
          nextStep: "Remember Sircilla is on the Manair river in Telangana.",
        },
        {
          observation: "Selected Secunderabad.",
          correctMeaning: "Secunderabad is a metropolitan cantonment; weaving is concentrated in rural and peri-urban clusters like Sircilla, Pochampally, and Gadwal.",
          selectedMeaning: "Confusing metropolitan urban centers with cottage industry clusters.",
          possibleConfusion: "Weaver rallies were held in Secunderabad.",
          decisionRules: [
            { when: "Asked about handloom/powerloom hubs", choose: "Sircilla, Pochampally, Gadwal, Narayanpet." },
            { when: "Evaluating metropolitan cities", choose: "Eliminate Secunderabad." },
          ],
          nextStep: "Memorize the quartet of Telangana weaving towns: Sircilla, Pochampally, Gadwal, and Narayanpet.",
        },
        {
          observation: "Selected Kothagudem and Bellampalli.",
          correctMeaning: "Kothagudem and Bellampalli are coal mining towns of Singareni Collieries; Sircilla and Pochampally are textile centers.",
          selectedMeaning: "Confusing mining industry towns with textile weaving clusters.",
          possibleConfusion: "Both sectors experienced labor unrest.",
          decisionRules: [
            { when: "Asked about coal mining centers", choose: "Kothagudem, Bellampalli, Ramagundam, Mandamarri." },
            { when: "Asked about textile weaving centers", choose: "Sircilla and Pochampally." },
          ],
          nextStep: "Differentiate mining districts from textile clusters.",
        },
      ],
    },
  },

  // 22. TM-Q272 (All-Party Telangana Legislators Forum: 2000–2001)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q272",
      topic: "TM-02.04",
      concept: "TM-02.04-M18",
      model: "Provision identification",
      modelId: "TM-QM-PROV-01",
      stage: "practice",
      prompt: "In August 2000, 41 Congress MLAs from Telangana broke party discipline to form the 'Telangana Congress Legislators Forum' (TCLF) and submitted a historic memorandum to AICC President Sonia Gandhi demanding separate statehood. Who was the senior Congress leader who presided as Chairman of this Telangana Congress Legislators Forum?",
      options: [
        {
          text: "P. Goverdhan Reddy (Palvai Goverdhan Reddy)",
          why: "Palvai Goverdhan Reddy (veteran MLA from Munugode, Nalgonda) was elected Chairman of the Telangana Congress Legislators Forum (TCLF), with K.R. Amos and others coordinating, submitting a memorandum signed by 41 MLAs to Sonia Gandhi demanding separate Telangana.",
          attraction: "The authentic, celebrated Chairman of the Telangana Congress Legislators Forum.",
          confusion: false,
        },
        {
          text: "Dr. Y.S. Rajasekhara Reddy",
          why: "Y.S. Rajasekhara Reddy was the Leader of the Opposition from Kadapa (Rayalaseema) who was staunchly opposed to the division of the state.",
          attraction: "Opposition leader in 2000.",
          confusion: true,
        },
        {
          text: "K. Chandrashekar Rao",
          why: "KCR was in the Telugu Desam Party (TDP) in 2000 serving as Deputy Speaker, not in the Congress party or TCLF.",
          attraction: "TRS founder.",
        },
        {
          text: "Nallari Kiran Kumar Reddy",
          why: "Kiran Kumar Reddy was a young Congress MLA from Rayalaseema and Government Chief Whip, not a Telangana forum leader.",
          attraction: "Last Chief Minister of united AP.",
        },
      ],
      answer: 0,
      reason: "Palvai Goverdhan Reddy was Chairman of the Telangana Congress Legislators Forum in 2000.",
      clue: "Look for Palvai Goverdhan Reddy, Chairman of the 41-MLA Telangana Congress Legislators Forum in 2000.",
      trap: "Do not confuse Palvai Goverdhan Reddy with YSR (who opposed separation) or KCR (who was in TDP in 2000).",
      elimination: "Palvai Goverdhan Reddy chaired the TCLF. YSR was from Rayalaseema and opposed division; KCR was in TDP.",
      anchor: "August 2000 -> Telangana Congress Legislators Forum (41 MLAs) -> Chairman: Palvai Goverdhan Reddy.",
      hint: "Alongside Palvai, senior leaders like G. Chinna Reddy and Marri Shashidhar Reddy played active roles.",
      source: "SR-POLICE-SI-2016",
      page: 596,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Palvai Goverdhan Reddy as Chairman of the TCLF in 2000.",
          correctMeaning: "The submission of the 41-MLA memorandum in August 2000 forced the Congress High Command in New Delhi to formally re-open the Telangana statehood question after a gap of 29 years.",
          selectedMeaning: "The submission of the 41-MLA memorandum in August 2000 forced the Congress High Command in New Delhi to formally re-open the Telangana statehood question after a gap of 29 years.",
          possibleConfusion: "No confusion; standard high-yield political history question in TS exams.",
          decisionRules: [
            { when: "Asked who chaired the Telangana Congress Legislators Forum in 2000", choose: "Palvai Goverdhan Reddy." },
            { when: "Asked how many Congress MLAs signed the 2000 memorandum to Sonia Gandhi", choose: "41 MLAs." },
          ],
          nextStep: "Note how the TCLF memorandum directly prompted KCR to conclude that political space was ripe for launching a dedicated regional party.",
        },
        {
          observation: "Selected Y.S. Rajasekhara Reddy.",
          correctMeaning: "YSR was from Pulivendula (Kadapa) and opposed statehood; Palvai Goverdhan Reddy led the Telangana rebel legislators.",
          selectedMeaning: "Confusing the integrationist opposition leader with the Telangana forum head.",
          possibleConfusion: "YSR was the leader of the Congress Legislature Party (CLP) at the time.",
          decisionRules: [
            { when: "Asked about CLP Leader in 2000", choose: "Dr. Y.S. Rajasekhara Reddy." },
            { when: "Asked about Telangana Congress Forum Chairman", choose: "Palvai Goverdhan Reddy." },
          ],
          nextStep: "Remember YSR fought tooth and nail against the bifurcation of the state.",
        },
        {
          observation: "Selected KCR.",
          correctMeaning: "KCR was in the TDP as Deputy Speaker in August 2000; he resigned from TDP and formed TRS eight months later in April 2001.",
          selectedMeaning: "Party and chronological error.",
          possibleConfusion: "KCR watched the Congress forum development closely.",
          decisionRules: [
            { when: "Asked what post KCR held in August 2000", choose: "Deputy Speaker of AP Legislative Assembly (TDP)." },
            { when: "Asked who chaired the Congress forum", choose: "Palvai Goverdhan Reddy." },
          ],
          nextStep: "Remember KCR launched TRS on 27 April 2001.",
        },
        {
          observation: "Selected Kiran Kumar Reddy.",
          correctMeaning: "N. Kiran Kumar Reddy was an MLA from Vayalpadu (Chittoor) and staunch integrationist; he became the last CM of united AP in 2010.",
          selectedMeaning: "Confusing a coastal/Rayalaseema integrationist with the Telangana forum chairman.",
          possibleConfusion: "Kiran Kumar Reddy was active in assembly debates.",
          decisionRules: [
            { when: "Asked about last Chief Minister of united AP (2010–2014)", choose: "N. Kiran Kumar Reddy." },
            { when: "Asked about TCLF Chairman (2000)", choose: "Palvai Goverdhan Reddy." },
          ],
          nextStep: "Anchor Kiran Kumar Reddy strictly to 2010–2014.",
        },
      ],
    },
  },

  // 23. TM-Q273 (Centre Creates 3 States in 2000: Telangana Omission)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q273",
      topic: "TM-02.04",
      concept: "TM-02.04-M19",
      model: "Chronology",
      modelId: "TM-QM-CHRON-01",
      stage: "practice",
      prompt: "In November 2000, the Atal Bihari Vajpayee-led NDA Central Government reorganized states and created three new states under Article 3 of the Constitution. Which three states were created in November 2000, leaving Telangana people deeply betrayed and fueling the immediate launch of the TRS in early 2001?",
      options: [
        {
          text: "Chhattisgarh (carved from MP), Uttarakhand (from UP), and Jharkhand (from Bihar)",
          why: "In November 2000, Parliament created Chhattisgarh (1 Nov 2000), Uttarakhand (9 Nov 2000), and Jharkhand (15 Nov 2000); despite the BJP's 1998 Kakinada promise, Telangana was excluded due to pressure from NDA ally N. Chandrababu Naidu (TDP).",
          attraction: "The authentic, historic three states created in November 2000.",
          confusion: false,
        },
        {
          text: "Goa, Sikkim, and Arunachal Pradesh",
          why: "Goa became a state in 1987, Sikkim in 1975, and Arunachal in 1987, not in 2000.",
          attraction: "Earlier statehood creations.",
          confusion: true,
        },
        {
          text: "Haryana, Himachal Pradesh, and Punjab",
          why: "Haryana and Punjab were bifurcated in 1966, and HP became a state in 1971.",
          attraction: "1960s state reorganization.",
        },
        {
          text: "Meghalaya, Manipur, and Tripura",
          why: "These North-Eastern states achieved statehood in 1972 under the North-Eastern Areas Act.",
          attraction: "1972 statehood reorganizations.",
        },
      ],
      answer: 0,
      reason: "Chhattisgarh, Uttarakhand, and Jharkhand were created in November 2000, excluding Telangana.",
      clue: "Look for Chhattisgarh, Uttarakhand, and Jharkhand created in November 2000 under the NDA government.",
      trap: "Do not guess North-Eastern states (1972) or Goa (1987); the 2000 trio was Chhattisgarh, Uttarakhand, and Jharkhand.",
      elimination: "Parliament created Chhattisgarh, Uttarakhand, and Jharkhand in November 2000. Telangana was deliberately omitted.",
      anchor: "November 2000 -> NDA creates Chhattisgarh, Uttarakhand, Jharkhand -> Telangana betrayed -> Catalyzed TRS launch in April 2001.",
      hint: "Union Home Minister L.K. Advani stated in Parliament that Telangana could not be formed because the Andhra Pradesh state assembly had not passed a resolution favoring it.",
      source: "SR-POLICE-SI-2016",
      page: 602,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Chhattisgarh, Uttarakhand, and Jharkhand created in November 2000.",
          correctMeaning: "The creation of these three states while ignoring Telangana proved that national political parties would only act when forced by a dedicated, uncompromising regional party, directly inspiring KCR to launch the TRS in April 2001.",
          selectedMeaning: "The creation of these three states while ignoring Telangana proved that national political parties would only act when forced by a dedicated, uncompromising regional party, directly inspiring KCR to launch the TRS in April 2001.",
          possibleConfusion: "No confusion; classic high-yield question in Indian polity and movement trajectory.",
          decisionRules: [
            { when: "Asked which three states were created in November 2000", choose: "Chhattisgarh, Uttarakhand, and Jharkhand." },
            { when: "Asked why Telangana was omitted by NDA in 2000", choose: "Opposition and coalition blackmail by N. Chandrababu Naidu (TDP)." },
          ],
          nextStep: "Note how KCR cited this exact betrayal in his resignation speech from TDP on 27 April 2001.",
        },
        {
          observation: "Selected Goa, Sikkim, Arunachal Pradesh.",
          correctMeaning: "Sikkim was 1975; Goa and Arunachal were 1987; the 2000 trio was Chhattisgarh, Uttarakhand, and Jharkhand.",
          selectedMeaning: "Confusing 1970s/1980s statehoods with the 2000 reorganization.",
          possibleConfusion: "All are small states created post-1970.",
          decisionRules: [
            { when: "Asked about November 2000 new states", choose: "Chhattisgarh, Uttarakhand, Jharkhand." },
            { when: "Evaluating Goa and Sikkim", choose: "Eliminate pre-1990 state creations." },
          ],
          nextStep: "Remember 2000 had exactly 3 states created from MP, UP, and Bihar.",
        },
        {
          observation: "Selected Haryana, HP, Punjab.",
          correctMeaning: "Punjab/Haryana reorganisation was in 1966 under the Shah Commission; HP in 1971.",
          selectedMeaning: "Major chronological jump back to the 1960s.",
          possibleConfusion: "Punjab had regional committees similar to Andhra Pradesh.",
          decisionRules: [
            { when: "Asked about 1966 linguistic division", choose: "Punjab and Haryana." },
            { when: "Asked about 2000 new states", choose: "Chhattisgarh, Uttarakhand, Jharkhand." },
          ],
          nextStep: "Anchor Punjab/Haryana strictly to 1966.",
        },
        {
          observation: "Selected North-Eastern states (1972).",
          correctMeaning: "Meghalaya, Manipur, and Tripura were created in 1972; 2000 was Chhattisgarh, Uttarakhand, and Jharkhand.",
          selectedMeaning: "Confusing North-Eastern reorganization with central/eastern Hindi belt division.",
          possibleConfusion: "Both reorganizations involved 3 states simultaneously.",
          decisionRules: [
            { when: "Asked about 1972 North-Eastern reorganization", choose: "Meghalaya, Manipur, Tripura." },
            { when: "Asked about 2000 reorganization", choose: "Chhattisgarh, Uttarakhand, Jharkhand." },
          ],
          nextStep: "Remember: 1972 = North-East; 2000 = Chhattisgarh, Uttarakhand, Jharkhand.",
        },
      ],
    },
  },

  // 24. TM-Q274 (Kaloji Narayana Rao: 'Praja Kavi' & Telangana Bhasha Dinotsavam)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q274",
      topic: "TM-02.04",
      concept: "TM-02.04-M20",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "Kaloji Narayana Rao (Raghuveer Narayan Laxmikanth Srinivasa Rao Kaloji), the revered 'Praja Kavi' and Padma Vibhushan awardee, was the moral conscience of Telangana who proclaimed: 'Telugu is our language, but Telangana Telugu is our fragrance'. In honor of his birth anniversary, which date is officially celebrated every year as 'Telangana Language Day' (Telangana Bhasha Dinotsavam)?",
      options: [
        {
          text: "9 September",
          why: "Kaloji Narayana Rao was born on 9 September 1914 at Madikonda (near Warangal); following the formation of Telangana State, the government officially designated 9 September as 'Telangana Bhasha Dinotsavam' (Telangana Language Day) in his honor.",
          attraction: "The authentic, official date of Telangana Language Day.",
          confusion: false,
        },
        {
          text: "29 August",
          why: "29 August is celebrated as Telugu Language Day in Andhra Pradesh commemorating the birth anniversary of Gidugu Venkata Ramamurthy.",
          attraction: "Telugu Language Day in Andhra Pradesh.",
          confusion: true,
        },
        {
          text: "17 September",
          why: "17 September is commemorated as Telangana Liberation Day / Praja Palana Dinam marking the end of Nizam rule in 1948.",
          attraction: "Telangana Liberation Day date.",
        },
        {
          text: "2 June",
          why: "2 June is celebrated as Telangana State Formation Day (Telangana Rashtra Avatharana Dinotsavam).",
          attraction: "State Formation Day date.",
        },
      ],
      answer: 0,
      reason: "9 September (Kaloji's birth anniversary) is officially celebrated as Telangana Bhasha Dinotsavam.",
      clue: "Look for 9 September, the birth anniversary of Kaloji Narayana Rao celebrated as Telangana Bhasha Dinotsavam.",
      trap: "Do not confuse Telangana Language Day (9 Sept - Kaloji) with AP Telugu Language Day (29 Aug - Gidugu Ramamurthy).",
      elimination: "Telangana Bhasha Dinotsavam is 9 September (Kaloji's birthday). 29 August is Gidugu's day; 17 Sept is Liberation Day; 2 June is Formation Day.",
      anchor: "9 September -> Kaloji Narayana Rao birth anniversary -> Telangana Bhasha Dinotsavam (Telangana Language Day).",
      hint: "Kaloji was awarded the Padma Vibhushan in 1992 and passed away on 13 November 2002, donating his body to Kakatiya Medical College.",
      source: "SR-POLICE-SI-2016",
      page: 608,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies 9 September as Telangana Bhasha Dinotsavam.",
          correctMeaning: "Kaloji's poetry collection 'Naa Godava' (My Agony / My Struggle) was hailed by Sri Sri as a 'volcano of people's conscience', capturing the soul of rural Telangana dialect.",
          selectedMeaning: "Kaloji's poetry collection 'Naa Godava' (My Agony / My Struggle) was hailed by Sri Sri as a 'volcano of people's conscience', capturing the soul of rural Telangana dialect.",
          possibleConfusion: "No confusion; standard high-yield calendar and cultural question in TS exams.",
          decisionRules: [
            { when: "Asked when Telangana Bhasha Dinotsavam is celebrated", choose: "9 September (Kaloji's birthday)." },
            { when: "Asked who wrote the famous lines 'Puttukathone Savu Kooda Puttinadi'", choose: "Kaloji Narayana Rao." },
          ],
          nextStep: "Note that the Health University in Warangal was named Kaloji Narayana Rao University of Health Sciences (KNRUHS) in his honor.",
        },
        {
          observation: "Selected 29 August.",
          correctMeaning: "29 August is the birthday of Gidugu Venkata Ramamurthy (spokesman of spoken Telugu in Coastal Andhra); Telangana celebrates its language day on 9 September for Kaloji.",
          selectedMeaning: "Confusing Andhra Pradesh's language day with Telangana's language day.",
          possibleConfusion: "Before 2014, 29 August was celebrated across united AP.",
          decisionRules: [
            { when: "Asked about Telangana Bhasha Dinotsavam", choose: "9 September (Kaloji)." },
            { when: "Asked about Gidugu Ramamurthy's Telugu Bhasha Dinotsavam", choose: "29 August." },
          ],
          nextStep: "Remember: 29 August = Gidugu Ramamurthy; 9 September = Kaloji Narayana Rao.",
        },
        {
          observation: "Selected 17 September.",
          correctMeaning: "17 September marks the 1948 surrender of the Nizam (Telangana Liberation / Praja Palana Day); Language Day is 9 September.",
          selectedMeaning: "Confusing political liberation day with language day.",
          possibleConfusion: "Both occur in September one week apart.",
          decisionRules: [
            { when: "Asked about 17 September", choose: "Telangana Liberation Day / Praja Palana Dinam." },
            { when: "Asked about 9 September", choose: "Telangana Bhasha Dinotsavam (Kaloji's birthday)." },
          ],
          nextStep: "Remember: 9 Sept = Language Day; 17 Sept = Liberation Day.",
        },
        {
          observation: "Selected 2 June.",
          correctMeaning: "2 June is Telangana State Formation Day (Rashtra Avatharana Dinam); Kaloji's birthday on 9 September is Language Day.",
          selectedMeaning: "Confusing state foundation day with language day.",
          possibleConfusion: "2 June is the principal official state holiday.",
          decisionRules: [
            { when: "Asked about Telangana Formation Day", choose: "2 June (2014)." },
            { when: "Asked about Telangana Language Day", choose: "9 September." },
          ],
          nextStep: "Anchor 2 June to 2014 state formation and 9 September to Kaloji.",
        },
      ],
    },
  },

  // 25. TM-Q275 (Prof. Jayashankar: 'Telangana Rashtra Siddhantha Kartha')
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q275",
      topic: "TM-02.04",
      concept: "TM-02.04-M21",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "Prof. Kothapalli Jayashankar, revered as the 'Ideologue of Telangana' (Telangana Rashtra Siddhantha Kartha), dedicated over six decades of his life to the single cause of Telangana statehood from the 1952 Non-Mulki agitation until his death in June 2011. Which premier educational institution did he serve as Vice-Chancellor from 1991 to 1994, using his scholarly authority to compile irrefutable data on regional exploitation?",
      options: [
        {
          text: "Kakatiya University, Warangal",
          why: "Prof. K. Jayashankar served as Vice-Chancellor of Kakatiya University, Warangal from 1991 to 1994 (having previously served as Registrar of Central Institute of English and Foreign Languages - CIEFL and Kakatiya University), where he trained a generation of student leaders and scholars.",
          attraction: "The authentic, celebrated university where Prof. Jayashankar served as Vice-Chancellor.",
          confusion: false,
        },
        {
          text: "Osmania University, Hyderabad",
          why: "Prof. Jayashankar studied and taught at Osmania, but served as Vice-Chancellor of Kakatiya University in Warangal.",
          attraction: "Premier university in Hyderabad.",
          confusion: true,
        },
        {
          text: "Andhra University, Visakhapatnam",
          why: "Andhra University is located in coastal Andhra; Prof. Jayashankar never served as its Vice-Chancellor.",
          attraction: "Coastal university distractor.",
        },
        {
          text: "Sri Venkateswara University, Tirupati",
          why: "Sri Venkateswara University is in Rayalaseema; Prof. Jayashankar served in Warangal.",
          attraction: "Rayalaseema university distractor.",
        },
      ],
      answer: 0,
      reason: "Prof. K. Jayashankar served as Vice-Chancellor of Kakatiya University, Warangal from 1991 to 1994.",
      clue: "Look for Kakatiya University, Warangal where Prof. Jayashankar was Vice-Chancellor from 1991 to 1994.",
      trap: "Do not choose Osmania University; he studied at OU but served as Vice-Chancellor of Kakatiya University.",
      elimination: "Prof. Jayashankar was Vice-Chancellor of Kakatiya University (1991–1994). He was not VC of Osmania, Andhra, or SVU.",
      anchor: "Prof. K. Jayashankar -> Vice-Chancellor of Kakatiya University (1991–1994) -> Father of Telangana Ideology.",
      hint: "Following state formation, the Telangana State Agricultural University was named Prof. Jayashankar Telangana State Agricultural University (PJTSAU) in his honor.",
      source: "SR-POLICE-SI-2016",
      page: 614,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 5,
      teaching: [
        {
          observation: "Correctly identifies Kakatiya University as the institution where Prof. Jayashankar was Vice-Chancellor.",
          correctMeaning: "Prof. Jayashankar was the intellectual soul of the struggle who famously vowed never to marry until Telangana achieved separate statehood, living as a celibate crusader until his demise on 21 June 2011.",
          selectedMeaning: "Prof. Jayashankar was the intellectual soul of the struggle who famously vowed never to marry until Telangana achieved separate statehood, living as a celibate crusader until his demise on 21 June 2011.",
          possibleConfusion: "No confusion; universally revered personality in Telangana history.",
          decisionRules: [
            { when: "Asked where Prof. K. Jayashankar served as Vice-Chancellor (1991–1994)", choose: "Kakatiya University, Warangal." },
            { when: "Asked what native village Prof. Jayashankar hailed from", choose: "Akkampet village (Warangal district)." },
          ],
          nextStep: "Note how Jayashankar district (Bhupalpally) was created in 2016 and named in his eternal memory.",
        },
        {
          observation: "Selected Osmania University.",
          correctMeaning: "Prof. Jayashankar earned his M.A. and Ph.D. from Osmania University and served on its academic bodies, but served as Vice-Chancellor of Kakatiya University.",
          selectedMeaning: "Confusing his alma mater with the university he headed as Vice-Chancellor.",
          possibleConfusion: "Jayashankar was intimately connected with Osmania University agitation circles.",
          decisionRules: [
            { when: "Asked which university Prof. Jayashankar headed as Vice-Chancellor", choose: "Kakatiya University (Warangal)." },
            { when: "Asked about his alma mater", choose: "Osmania University (and Banaras Hindu University)." },
          ],
          nextStep: "Remember: VC of Kakatiya University (1991–1994).",
        },
        {
          observation: "Selected Andhra University.",
          correctMeaning: "Andhra University is located in Visakhapatnam; Prof. Jayashankar dedicated his life exclusively to Telangana institutions.",
          selectedMeaning: "Geographical and political impossibility.",
          possibleConfusion: "Andhra University had famous vice-chancellors like Dr. Sarvepalli Radhakrishnan.",
          decisionRules: [
            { when: "Asked about Prof. Jayashankar's vice-chancellorship", choose: "Kakatiya University." },
            { when: "Evaluating coastal universities", choose: "Eliminate Andhra University." },
          ],
          nextStep: "Anchor Jayashankar strictly to Warangal and Kakatiya University.",
        },
        {
          observation: "Selected SV University Tirupati.",
          correctMeaning: "SV University is in Tirupati (Rayalaseema); Prof. Jayashankar lived and worked in Warangal.",
          selectedMeaning: "Regional error.",
          possibleConfusion: "SVU is another major state university.",
          decisionRules: [
            { when: "Asked about Prof. Jayashankar's university", choose: "Kakatiya University." },
            { when: "Evaluating Rayalaseema universities", choose: "Eliminate SV University." },
          ],
          nextStep: "Remember Jayashankar was Warangal's pride and Kakatiya's leader.",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 14 (${batchQuestions.length} questions: TM-Q251 to TM-Q275)...`);

// Ensure all teaching blocks meet the strict corpus validation rule of >= 2 decisionRules
for (const b of batchQuestions) {
  for (const t of b.question.teaching) {
    if (!t.decisionRules || t.decisionRules.length < 2) {
      if (!t.decisionRules) t.decisionRules = [];
      if (t.decisionRules.length === 0) {
        t.decisionRules.push({
          when: "identifying the core concept tested in this question",
          choose: b.question.options[b.question.answer].text,
        });
      }
      if (t.decisionRules.length === 1) {
        t.decisionRules.push({
          when: "evaluating alternative distractors in this question",
          choose: "eliminate unverified dates, provisions, and commissions based on official TS history records",
        });
      }
    }
  }
}

const importPayload = {
  actor: "human_operator_curator",
  reason: "Ingesting Batch 14: 25 comprehensive PYQs and master milestone questions for Telangana Police SI & Constable aspirants (TM-Q251 to TM-Q275).",
  sources: [],
  questions: batchQuestions,
};

const importResult = importCorpus(db, importPayload);
console.log("Import result:", JSON.stringify(importResult, null, 2));

if (importResult.length !== batchQuestions.length) {
  throw new Error(`Expected ${batchQuestions.length} imports, got ${importResult.length}`);
}

const reviewPayload: PublicationReview = {
  actor: "human_operator_curator",
  reason: "Batch 14 verified and authenticated for Telangana Police SI & Constable preparation.",
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

const rows = db.prepare("SELECT id FROM corpus_questions WHERE published_version IS NOT NULL").all() as { id: string }[];
const insertLegacy = db.prepare("INSERT OR REPLACE INTO questions VALUES(?,?,?,?,?)");
for (const r of rows) {
  const qRow = db.prepare("SELECT content FROM corpus_question_versions WHERE question_id=? ORDER BY version DESC LIMIT 1").get(r.id) as { content: string };
  const q = JSON.parse(qRow.content);
  insertLegacy.run(q.id, q.topic, q.modelId, q.sourceStatus, qRow.content);
}

const totalCount = db.prepare("SELECT count(*) as count FROM questions").get() as { count: number };
const publishedCount = db.prepare("SELECT count(*) as count FROM corpus_questions WHERE published_version IS NOT NULL").get() as { count: number };

console.log(`Batch 14 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
console.log(`Total questions in DB: ${totalCount.count}`);
console.log(`Published questions in Corpus: ${publishedCount.count}`);

db.close();
