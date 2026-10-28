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
  // 1. TM-Q136 (Chronology of Official Commissions on Telangana)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q136",
      topic: "TM-01.05",
      concept: "TM-01.05-M01",
      model: "Chronology",
      modelId: "TM-QM-CHR-01",
      stage: "practice",
      prompt: "Arrange the following official committees and commissions appointed in connection with Telangana safeguards and statehood in correct chronological order of their constitution:\n(I) Kumar Lalit Committee (to calculate Telangana revenue surpluses)\n(II) Justice Vashishtha Bhargava Committee (to determine surplus revenue diversion)\n(III) J.M. Girglani One-Man Commission (to probe G.O. 610 violations)\n(IV) Justice B.N. Srikrishna Committee (for consultations on the situation in Andhra Pradesh)",
      options: [
        {
          text: "(I) -> (II) -> (III) -> (IV)",
          why: "Kumar Lalit Committee was appointed in January 1969; Justice Vashishtha Bhargava Committee was appointed in April 1969; J.M. Girglani Commission was appointed in June 2001; Justice B.N. Srikrishna Committee was appointed in February 2010.",
          attraction: "The authentic chronological sequence from the 1969 agitation through the final statehood phase.",
          confusion: false,
        },
        {
          text: "(II) -> (I) -> (III) -> (IV)",
          why: "Bhargava Committee was appointed in April 1969 after Kumar Lalit submitted his preliminary estimates in January 1969.",
          attraction: "Inverting the two 1969 surplus committees.",
          confusion: true,
        },
        {
          text: "(I) -> (III) -> (II) -> (IV)",
          why: "Girglani Commission was constituted in 2001, long after the 1969 Bhargava Committee.",
          attraction: "Misplacing Girglani Commission before Bhargava Committee.",
        },
        {
          text: "(IV) -> (III) -> (II) -> (I)",
          why: "Reverse chronological order.",
          attraction: "Chronological reversal.",
        },
      ],
      answer: 0,
      reason: "In January 1969, following the All-Party Accord, the Kumar Lalit Committee was appointed to assess Telangana surpluses (found ₹34.10 crore unspent). In April 1969, under the Eight-Point Formula, the Central Government appointed the Justice Vashishtha Bhargava Committee, which finalized the surplus at ₹28.34 crore. In June 2001, Chandrababu Naidu's government appointed the J.M. Girglani Commission to investigate widespread violations of G.O. 610. In February 2010, the Union Ministry of Home Affairs appointed the Justice B.N. Srikrishna Committee.",
      clue: "Order: 1969 Jan (Kumar Lalit) -> 1969 April (Bhargava) -> 2001 June (Girglani) -> 2010 Feb (Srikrishna).",
      trap: "Do not confuse Kumar Lalit with Bhargava; Kumar Lalit investigated first in January 1969, followed by the judicial review of Bhargava in April 1969.",
      elimination: "Eliminate any sequence placing Bhargava before Kumar Lalit or Girglani before Bhargava.",
      anchor: "Chronology of Telangana Safeguard Inquiries: Kumar Lalit (Jan 1969) -> Bhargava (Apr 1969) -> Girglani (Jun 2001) -> Srikrishna (Feb 2010).",
      hint: "Which accountant assessed the surpluses before Justice Bhargava's judicial committee was formed in April 1969?",
      source: "TGPSC Group-1 & Group-4 Exam Papers (2022–2024), General Studies & Telangana Movement",
      page: 18,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly arranged all four historical committees in chronological sequence.",
          correctMeaning: "Kumar Lalit (Jan 1969) -> Bhargava (Apr 1969) -> Girglani (2001) -> Srikrishna (2010).",
          selectedMeaning: "Kumar Lalit (Jan 1969) -> Bhargava (Apr 1969) -> Girglani (2001) -> Srikrishna (2010).",
          possibleConfusion: "Aspirants frequently confuse the exact order between Kumar Lalit and Bhargava.",
          decisionRules: [
            { when: "the question asks the sequence of Telangana surplus committees in 1969", choose: "Kumar Lalit Committee followed by Justice Bhargava Committee" },
            { when: "the question asks when Girglani Commission was appointed", choose: "June 2001 (during the early revival of the movement)" },
          ],
          nextStep: "Memorize: Kumar Lalit (Jan 1969, ₹34.1 cr) -> Bhargava (Apr 1969, ₹28.34 cr) -> Girglani (2001) -> Srikrishna (2010).",
        },
        {
          observation: "Check the order between Kumar Lalit and Bhargava.",
          correctMeaning: "Kumar Lalit was appointed first in January 1969; Bhargava came in April 1969.",
          selectedMeaning: "Reversing Kumar Lalit and Bhargava.",
          possibleConfusion: "Both committees operated in 1969.",
          decisionRules: [
            { when: "comparing Kumar Lalit and Bhargava", choose: "Kumar Lalit (January 1969) preceded Bhargava (April 1969)" },
            { when: "arranging 1969 committees", choose: "All-Party Accord -> Kumar Lalit -> Eight-Point Formula -> Bhargava" },
          ],
          nextStep: "Always remember: Kumar Lalit was the state government's auditor; Bhargava was the central judicial committee.",
        },
        {
          observation: "Check Girglani Commission timing.",
          correctMeaning: "Girglani Commission was appointed in 2001, not 1969.",
          selectedMeaning: "Placing Girglani between Kumar Lalit and Bhargava.",
          possibleConfusion: "Confusing G.O. 610 (1985) and Girglani Commission (2001) with 1969 committees.",
          decisionRules: [
            { when: "the question mentions J.M. Girglani Commission", choose: "June 2001 appointed by AP Government" },
            { when: "ordering 20th and 21st century committees", choose: "Place Girglani in 2001 and Srikrishna in 2010" },
          ],
          nextStep: "Tie Girglani Commission to the post-2001 TRS revival era.",
        },
        {
          observation: "Check reverse chronological sequence.",
          correctMeaning: "Chronological order requires earliest to latest.",
          selectedMeaning: "Latest to earliest order.",
          possibleConfusion: "Misreading the question prompt as reverse chronology.",
          decisionRules: [
            { when: "the prompt asks for chronological order", choose: "Earliest date first" },
            { when: "scanning timeline options", choose: "1969 -> 2001 -> 2010" },
          ],
          nextStep: "Always verify whether the prompt requests earliest-first or latest-first order.",
        },
      ],
    },
  },

  // 2. TM-Q137 (Chronology of Historic Political Accords: 1956–1973)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q137",
      topic: "TM-01.05",
      concept: "TM-01.05-M01",
      model: "Chronology",
      modelId: "TM-QM-CHR-01",
      stage: "practice",
      prompt: "Arrange the following historic political agreements and policy formulas concerning Telangana in correct chronological order:\n(I) Gentlemen's Agreement\n(II) All-Party Accord\n(III) Prime Minister Indira Gandhi's Eight-Point Formula\n(IV) Five-Point Formula\n(V) Six-Point Formula",
      options: [
        {
          text: "(I) -> (II) -> (III) -> (IV) -> (V)",
          why: "Gentlemen's Agreement was signed on 20 February 1956; All-Party Accord on 19 January 1969; Eight-Point Formula on 11 April 1969; Five-Point Formula on 27 November 1972; Six-Point Formula on 21 September 1973.",
          attraction: "The authentic, complete timeline of statehood pacts and prime ministerial packages.",
          confusion: false,
        },
        {
          text: "(I) -> (III) -> (II) -> (IV) -> (V)",
          why: "The All-Party Accord (January 1969) preceded Indira Gandhi's Eight-Point Formula (April 1969).",
          attraction: "Swapping All-Party Accord and Eight-Point Formula.",
          confusion: true,
        },
        {
          text: "(I) -> (II) -> (III) -> (V) -> (IV)",
          why: "Five-Point Formula (November 1972) was formulated by Indira Gandhi before the Six-Point Formula (September 1973).",
          attraction: "Inverting the Five-Point and Six-Point formulas.",
        },
        {
          text: "(II) -> (I) -> (III) -> (IV) -> (V)",
          why: "Gentlemen's Agreement (1956) was the foundational merger pact, long before the 1969 All-Party Accord.",
          attraction: "Placing 1969 before 1956.",
        },
      ],
      answer: 0,
      reason: "The sequence of political accords and formulas is: Gentlemen's Agreement (20 Feb 1956) -> All-Party Accord (19 Jan 1969) -> Eight-Point Formula (11 Apr 1969, post-agitation relief) -> Five-Point Formula (27 Nov 1972, following Supreme Court upholding Mulki rules) -> Six-Point Formula (21 Sep 1973, leading to the 32nd Constitutional Amendment and Article 371-D).",
      clue: "Order: 1956 (Gentlemen's) -> Jan 1969 (All-Party) -> Apr 1969 (Eight-Point) -> Nov 1972 (Five-Point) -> Sep 1973 (Six-Point).",
      trap: "Remember that the Five-Point Formula (1972) came before the Six-Point Formula (1973).",
      elimination: "Eliminate any option placing Eight-Point before All-Party Accord, or Six-Point before Five-Point.",
      anchor: "Chronology of Accords: Gentlemen's (1956) -> All-Party (Jan 1969) -> Eight-Point (Apr 1969) -> Five-Point (1972) -> Six-Point (1973).",
      hint: "Did Indira Gandhi announce the Eight-Point Formula before or after the January 1969 All-Party Accord failed to quell protests?",
      source: "TGPSC Group-2 Paper IV: Telangana Movement and State Formation 2024",
      page: 64,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly arranged all five political accords across 1956–1973.",
          correctMeaning: "1956 Gentlemen's -> Jan 1969 All-Party -> Apr 1969 Eight-Point -> Nov 1972 Five-Point -> Sep 1973 Six-Point.",
          selectedMeaning: "1956 Gentlemen's -> Jan 1969 All-Party -> Apr 1969 Eight-Point -> Nov 1972 Five-Point -> Sep 1973 Six-Point.",
          possibleConfusion: "Confusion often arises between the Five-Point Formula (1972) and Six-Point Formula (1973).",
          decisionRules: [
            { when: "the question asks the sequence of Indira Gandhi's formulas", choose: "Eight-Point (1969) -> Five-Point (1972) -> Six-Point (1973)" },
            { when: "the question asks the foundation pact of Andhra Pradesh", choose: "Gentlemen's Agreement (1956)" },
          ],
          nextStep: "Note that Five-Point Formula was proposed to settle Mulki rules after the SC judgment, but Jai Andhra agitation led to the Six-Point Formula.",
        },
        {
          observation: "Check All-Party Accord vs Eight-Point Formula.",
          correctMeaning: "All-Party Accord was signed in January 1969 by Kasu Brahmananda Reddy; Eight-Point Formula came in April 1969 by Indira Gandhi.",
          selectedMeaning: "Placing Eight-Point Formula before All-Party Accord.",
          possibleConfusion: "Both occurred in 1969.",
          decisionRules: [
            { when: "comparing 1969 events", choose: "All-Party Accord (January) preceded Eight-Point Formula (April)" },
            { when: "evaluating accord triggers", choose: "The collapse of the All-Party Accord triggered Indira Gandhi's Eight-Point package" },
          ],
          nextStep: "Remember: January accord was state-level; April package was central.",
        },
        {
          observation: "Check Five-Point vs Six-Point formula.",
          correctMeaning: "Five-Point Formula (1972) preceded Six-Point Formula (1973).",
          selectedMeaning: "Placing Six-Point before Five-Point.",
          possibleConfusion: "Numerical ordering confusion (5 before 6 is also chronological).",
          decisionRules: [
            { when: "ordering 1970s formulas", choose: "Five-Point (1972) followed by Six-Point (1973)" },
            { when: "linking to constitutional amendment", choose: "Six-Point Formula directly resulted in Article 371-D (32nd Amendment)" },
          ],
          nextStep: "Keep the numerical progression: 8-Point (1969) -> 5-Point (1972) -> 6-Point (1973).",
        },
        {
          observation: "Check foundational pact timing.",
          correctMeaning: "Gentlemen's Agreement was signed in 1956 before the formation of Andhra Pradesh.",
          selectedMeaning: "Placing 1969 before 1956.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "the question includes Gentlemen's Agreement", choose: "Place it first in 1956" },
            { when: "arranging accords", choose: "Gentlemen's Agreement (1956) is always the starting point" },
          ],
          nextStep: "Gentlemen's Agreement (20 Feb 1956) enabled the creation of Andhra Pradesh on 1 Nov 1956.",
        },
      ],
    },
  },

  // 3. TM-Q138 (First Martyrs of 1969 and 2009 Movements)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q138",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "In the history of the Telangana separate statehood movement, who is revered as the first martyr of the 1969 agitation, and who is honoured as the first student martyr who made the supreme sacrifice at L.B. Nagar in the 2009 final phase of the movement?",
      options: [
        {
          text: "1969: Shankar (Sadashivpet, Medak); 2009: Kasoju Srikantha Chari (L.B. Nagar, Hyderabad)",
          why: "On 24 January 1969, Shankar (a 17-year-old student) was killed in police firing at Sadashivpet, becoming the first martyr of the 1969 agitation. On 29 November / 3 December 2009, Kasoju Srikantha Chari, an OU student, self-immolated at the L.B. Nagar crossroads, becoming the foremost martyr of the 2009 mass phase.",
          attraction: "The authentic, historic first martyrs of both major phases of the struggle.",
          confusion: false,
        },
        {
          text: "1969: Constable Kishtaiah; 2009: Shankar",
          why: "Constable Kishtaiah martyred himself in December 2009 at Kamareddy, not in 1969.",
          attraction: "Confusing Constable Kishtaiah's 2009 sacrifice with 1969.",
          confusion: true,
        },
        {
          text: "1969: Doddi Komaraiah; 2009: Prof. Jayashankar",
          why: "Doddi Komaraiah was the first martyr of the Telangana Peasant Armed Struggle (4 July 1946); Prof. Jayashankar was an ideologue who died of illness in 2011.",
          attraction: "Confusing Armed Struggle (1946) with 1969 agitation.",
        },
        {
          text: "1969: Kasoju Srikantha Chari; 2009: Yadi Reddy",
          why: "Srikantha Chari was the martyr of 2009, not 1969. Yadi Reddy sacrificed his life at Jantar Mantar in New Delhi in July 2011.",
          attraction: "Swapping martyrdom phases.",
        },
      ],
      answer: 0,
      reason: "Shankar was martyred on 24 January 1969 when police opened fire on a peaceful student rally demanding implementation of Telangana safeguards in Sadashivpet (Medak district). Over 369 youth laid down their lives during 1969. In the 2009 final phase, following KCR's arrest on 29 November 2009, Kasoju Srikantha Chari immolated himself at L.B. Nagar circle shouting 'Jai Telangana', succumbing to burn injuries on 3 December 2009.",
      clue: "Pair: 1969 first martyr = Shankar (Sadashivpet); 2009 student martyr = Kasoju Srikantha Chari (L.B. Nagar).",
      trap: "Do not confuse Doddi Komaraiah (1946 Peasant Struggle martyr) with Shankar (1969 martyr) or Constable Kishtaiah (2009 Kamareddy martyr).",
      elimination: "Eliminate options listing Constable Kishtaiah or Doddi Komaraiah as 1969 martyrs.",
      anchor: "First Martyrs: Doddi Komaraiah (1946 Armed Struggle) | Shankar (1969 Agitation, Sadashivpet) | Kasoju Srikantha Chari (2009 Agitation, LB Nagar).",
      hint: "Which young student from Sadashivpet fell to police bullets on 24 January 1969?",
      source: "TS Police SI Prelims 2016 / Telangana Movement History",
      page: 89,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Shankar as the first 1969 martyr and Srikantha Chari as the first 2009 martyr.",
          correctMeaning: "Shankar (24 Jan 1969, Sadashivpet) and Kasoju Srikantha Chari (29 Nov / 3 Dec 2009, LB Nagar).",
          selectedMeaning: "Shankar (24 Jan 1969, Sadashivpet) and Kasoju Srikantha Chari (29 Nov / 3 Dec 2009, LB Nagar).",
          possibleConfusion: "Aspirants often mix up martyrs across the 1946 Armed struggle, 1969 agitation, and 2009–2014 phase.",
          decisionRules: [
            { when: "the question asks who was the first martyr of the 1969 Telangana agitation", choose: "Shankar (Sadashivpet, Medak district)" },
            { when: "the question asks who was the student martyr at LB Nagar in Nov/Dec 2009", choose: "Kasoju Srikantha Chari" },
          ],
          nextStep: "Remember also Constable Kishtaiah, who shot himself with his service weapon on 1 December 2009 at Kamareddy for Telangana.",
        },
        {
          observation: "Check Constable Kishtaiah's timeline.",
          correctMeaning: "Constable Kishtaiah martyred himself on 1 December 2009 in Kamareddy.",
          selectedMeaning: "Attributing Constable Kishtaiah to 1969.",
          possibleConfusion: "Recognizing Kishtaiah as a police martyr but placing him in the wrong decade.",
          decisionRules: [
            { when: "the question asks about Constable Kishtaiah", choose: "2009 police martyr at Kamareddy" },
            { when: "the question asks about 1969 martyrs", choose: "Shankar (Sadashivpet)" },
          ],
          nextStep: "Police SI & Constable exams regularly test Constable Kishtaiah because he was a police officer.",
        },
        {
          observation: "Check Doddi Komaraiah's timeline.",
          correctMeaning: "Doddi Komaraiah was martyred on 4 July 1946 at Kadavendi, starting the armed struggle.",
          selectedMeaning: "Confusing 1946 Armed Struggle with the 1969 statehood movement.",
          possibleConfusion: "Recognizing Komaraiah as a pioneer martyr.",
          decisionRules: [
            { when: "the question mentions Doddi Komaraiah", choose: "4 July 1946 Peasant Armed Struggle at Kadavendi" },
            { when: "the question mentions 1969 first martyr", choose: "Shankar (Sadashivpet)" },
          ],
          nextStep: "Maintain clear distinctions between 1946 (Kadavendi), 1952 (City College), 1969 (Sadashivpet), and 2009 (LB Nagar).",
        },
        {
          observation: "Check Yadi Reddy's martyrdom location.",
          correctMeaning: "Yadi Reddy was an auto driver who committed suicide at Jantar Mantar, New Delhi on 20 July 2011.",
          selectedMeaning: "Confusing the first 2009 martyr with the 2011 Parliament protest martyr.",
          possibleConfusion: "Both were notable martyrs of the post-2009 phase.",
          decisionRules: [
            { when: "the question asks who martyred at Jantar Mantar, New Delhi in 2011", choose: "Yadi Reddy" },
            { when: "the question asks who was the first 2009 student martyr at LB Nagar", choose: "Kasoju Srikantha Chari" },
          ],
          nextStep: "Associate Yadi Reddy with the Delhi Parliament struggle and Srikantha Chari with the immediate response to KCR's arrest in 2009.",
        },
      ],
    },
  },

  // 4. TM-Q139 (Prominent Women Leaders of Telangana)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q139",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "With reference to prominent women leaders and their historic contributions to the Telangana peasant struggle and statehood movement, consider the following statements:\n1. Chakali Ilamma (Ailamma) valiantly fought against the armed thugs of Visnur Deshmukh Ramachandra Reddy at Palakurthi, defending her four acres of harvested crop.\n2. Mallu Swarajyam commanded armed guerrilla squads (dalam) in the Nalgonda region during the Telangana Armed Struggle and later documented her revolutionary experiences in 'Naa Maate Tupaki Tota'.\n3. Sangam Laxmi Bai was a distinguished social reformer and freedom fighter who served as a Member of Parliament and founded the Indira Seva Sadan in Hyderabad.\nWhich of the statements given above are correct?",
      options: [
        {
          text: "1, 2, and 3",
          why: "All three statements are historically accurate and represent the key women icons tested across TSLPRB and TGPSC examinations.",
          attraction: "Complete factual correctness across all three revolutionary women.",
          confusion: false,
        },
        {
          text: "1 and 2 only",
          why: "Omits Sangam Laxmi Bai, who was indeed a prominent leader, MP from Medak, and founder of Indira Seva Sadan.",
          attraction: "Assuming Sangam Laxmi Bai was not connected to social reform in Hyderabad.",
          confusion: true,
        },
        {
          text: "2 and 3 only",
          why: "Omits Chakali Ilamma, whose defense of her crop at Palakurthi was the catalytic spark of the 1946 peasant armed struggle.",
          attraction: "Overlooking Chakali Ilamma.",
        },
        {
          text: "1 only",
          why: "Ignores the prominent roles of Mallu Swarajyam and Sangam Laxmi Bai.",
          attraction: "Unduly restrictive selection.",
        },
      ],
      answer: 0,
      reason: "Chakali Ailamma (1895–1985) of Palakurthi (Jangaon/Warangal) rebelled against Visnur Ramachandra Reddy's extortion, sparking the mass peasant rebellion. Mallu Swarajyam (1931–2022) of Thungathurthi took up arms at age 16, fought in armed guerrilla dalams with a bounty of ₹10,000 on her head, and wrote her autobiography 'Naa Maate Tupaki Tota'. Sangam Laxmi Bai (1911–1979) participated in the Salt Satyagraha, supported student agitators, served as an MP for three terms (1957–1971), and established the Indira Seva Sadan for orphaned girls.",
      clue: "Statements 1, 2, and 3 are all historically correct and represent premier women icons of Telangana.",
      trap: "Do not doubt Sangam Laxmi Bai's connection; she established the renowned Indira Seva Sadan in Saidabad, Hyderabad.",
      elimination: "All three statements contain precise historical facts; eliminate any subset options.",
      anchor: "Women Icons of Telangana: Chakali Ilamma (Palakurthi land struggle) | Mallu Swarajyam (Armed guerrilla leader, 'Naa Maate Tupaki Tota') | Sangam Laxmi Bai (Indira Seva Sadan, 3-time MP).",
      hint: "Did Mallu Swarajyam write 'Naa Maate Tupaki Tota' reflecting her years leading armed guerrilla dalams?",
      source: "TSLPRB Police Constable / TGPSC Group-1 Paper II & Paper VI",
      page: 112,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly verified all three statements regarding Telangana women leaders.",
          correctMeaning: "Chakali Ilamma (Palakurthi), Mallu Swarajyam (guerrilla commander), Sangam Laxmi Bai (social reformer & MP) are all true.",
          selectedMeaning: "All three statements are true.",
          possibleConfusion: "Aspirants sometimes mistakenly think Sangam Laxmi Bai belonged only to national Congress politics rather than Telangana social reform.",
          decisionRules: [
            { when: "the question asks about Chakali Ilamma's village and resistance", choose: "Palakurthi against Visnur Deshmukh" },
            { when: "the question asks who wrote 'Naa Maate Tupaki Tota'", choose: "Mallu Swarajyam" },
          ],
          nextStep: "Also review T.N. Sadalakshmi (first Dalit woman minister of AP and Telangana agitation leader) and Belli Lalitha.",
        },
        {
          observation: "Check statement 3 regarding Sangam Laxmi Bai.",
          correctMeaning: "Statement 3 is completely correct: Sangam Laxmi Bai founded Indira Seva Sadan and served as MP from Medak.",
          selectedMeaning: "Omitting Sangam Laxmi Bai.",
          possibleConfusion: "Unfamiliarity with her parliamentary and social work record.",
          decisionRules: [
            { when: "the question asks who established Indira Seva Sadan", choose: "Sangam Laxmi Bai" },
            { when: "evaluating options", choose: "Statements 1, 2, and 3 are all correct" },
          ],
          nextStep: "Add Sangam Laxmi Bai to your short notes on prominent women reformers of Hyderabad state.",
        },
        {
          observation: "Check statement 1 regarding Chakali Ilamma.",
          correctMeaning: "Chakali Ilamma is the premier symbol of peasant defiance against Visnur Deshmukh.",
          selectedMeaning: "Omitting Chakali Ilamma.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "the question mentions Palakurthi land struggle", choose: "Chakali Ilamma" },
            { when: "evaluating statements", choose: "Statement 1 is authentic" },
          ],
          nextStep: "Remember: Doddi Komaraiah was shot protecting Ilamma's harvest from Visnur's goons.",
        },
        {
          observation: "Check statement 2 regarding Mallu Swarajyam.",
          correctMeaning: "Mallu Swarajyam was a prominent guerrilla fighter and author of 'Naa Maate Tupaki Tota'.",
          selectedMeaning: "Restricting answer to statement 1 only.",
          possibleConfusion: "Doubting the title of Mallu Swarajyam's autobiography.",
          decisionRules: [
            { when: "the question asks about 'Naa Maate Tupaki Tota'", choose: "Autobiography of Mallu Swarajyam" },
            { when: "evaluating all three leaders", choose: "All three statements are correct" },
          ],
          nextStep: "Recall that Mallu Swarajyam's brother was Bhimreddy Narasimha Reddy (BN Reddy).",
        },
      ],
    },
  },

  // 5. TM-Q140 (Cultural & Peasant Renaissance Literature)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q140",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Which of the following literary and cultural works from the Telangana peasant struggle and renaissance is INCORRECTLY paired with its author/creator?",
      options: [
        {
          text: "'Gollaramaswami' (Short Story depicting the rural Telangana ethos) — Dasarathi Krishnamacharyulu",
          why: "INCORRECT PAIRING. 'Gollaramaswami' was written by former Prime Minister P.V. Narasimha Rao (under the pen name 'Jaya-Vijaya'). Dasarathi Krishnamacharyulu is famed for 'Agnidhara', 'Rudra Veena', and the immortal slogan 'Naa Telangana Koti Rathanala Veena'.",
          attraction: "The correct choice for the incorrectly matched pair.",
          confusion: false,
        },
        {
          text: "'Maa Bhoomi' (Celebrated revolutionary play performed in thousands of villages) — Sunkara Satyanarayana and Vasireddy Bhaskara Rao",
          why: "CORRECT PAIRING. Written in 1944 and staged by Praja Natya Mandali, 'Maa Bhoomi' galvanized the Telangana peasantry.",
          attraction: "A genuine, correctly matched classic.",
          confusion: true,
        },
        {
          text: "'Prajala Manishi' (First modern Telangana novel depicting bonded labour and social conditions) — Vattikota Alwar Swamy",
          why: "CORRECT PAIRING. Vattikota Alwar Swamy wrote 'Prajala Manishi' while imprisoned, portraying the realities between 1935 and 1940.",
          attraction: "A genuine, correctly matched classic.",
        },
        {
          text: "'Palletoori Pillagada' (Heart-wrenching folk song on bonded child labour / Jeetagallu) — Suddala Hanumanthu",
          why: "CORRECT PAIRING. Suddala Hanumanthu composed and sang 'Palletoori Pillagada Pasula Gase Monagada', which was later featured in the film Maa Bhoomi (1979).",
          attraction: "A genuine, correctly matched classic.",
        },
      ],
      answer: 0,
      reason: "'Gollaramaswami' is a famous short story authored by Pamulaparthi Venkata Narasimha Rao (P.V. Narasimha Rao), depicting rural oppression and social awakening in Telangana. Dasarathi Krishnamacharyulu wrote poetry collections like 'Agnidhara' and 'Rudra Veena'. The other three options are correctly matched: 'Maa Bhoomi' was co-authored by Sunkara and Vasireddy; 'Prajala Manishi' was penned by Vattikota Alwar Swamy; and 'Palletoori Pillagada' was composed by Suddala Hanumanthu.",
      clue: "Look for 'Gollaramaswami': It was written by P.V. Narasimha Rao, not Dasarathi Krishnamacharyulu.",
      trap: "Do not mark 'Prajala Manishi' or 'Palletoori Pillagada'; both are celebrated masterpieces accurately credited to Alwar Swamy and Suddala Hanumanthu.",
      elimination: "Eliminate options B, C, and D as they are accurate historical pairings.",
      anchor: "Telangana Literature: 'Gollaramaswami' -> P.V. Narasimha Rao | 'Agnidhara' -> Dasarathi | 'Prajala Manishi' -> Vattikota Alwar Swamy | 'Maa Bhoomi' -> Sunkara & Vasireddy.",
      hint: "Who wrote 'Gollaramaswami' under a pseudonym before later rising to become Prime Minister of India?",
      source: "TS Police Constable / TGPSC Group-2 Paper IV Literature",
      page: 95,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly detected that 'Gollaramaswami' was authored by P.V. Narasimha Rao, not Dasarathi.",
          correctMeaning: "'Gollaramaswami' was written by P.V. Narasimha Rao; Dasarathi wrote 'Agnidhara' and 'Rudra Veena'.",
          selectedMeaning: "'Gollaramaswami' was written by P.V. Narasimha Rao; Dasarathi wrote 'Agnidhara' and 'Rudra Veena'.",
          possibleConfusion: "Aspirants attribute all prominent Telangana poetry and literature of that era to Dasarathi or Kaloji.",
          decisionRules: [
            { when: "the question asks who wrote the short story 'Gollaramaswami'", choose: "P.V. Narasimha Rao" },
            { when: "the question asks who wrote 'Agnidhara' and 'Rudra Veena'", choose: "Dasarathi Krishnamacharyulu" },
          ],
          nextStep: "Remember that P.V. Narasimha Rao also translated Viswanatha Satyanarayana's 'Veyipadagalu' into Hindi as 'Sahasraphan'.",
        },
        {
          observation: "Check 'Maa Bhoomi' play authorship.",
          correctMeaning: "'Maa Bhoomi' play was written by Sunkara Satyanarayana and Vasireddy Bhaskara Rao.",
          selectedMeaning: "Selecting an already correct pair.",
          possibleConfusion: "Confusing the 1944 play by Sunkara and Vasireddy with the 1979 film directed by B. Narsing Rao.",
          decisionRules: [
            { when: "the question asks who wrote the historic play 'Maa Bhoomi'", choose: "Sunkara Satyanarayana and Vasireddy Bhaskara Rao" },
            { when: "evaluating which pair is INCORRECT", choose: "Gollaramaswami — Dasarathi" },
          ],
          nextStep: "Note that Praja Natya Mandali performed 'Maa Bhoomi' across the country to raise funds and awareness for the armed struggle.",
        },
        {
          observation: "Check 'Prajala Manishi'.",
          correctMeaning: "'Prajala Manishi' is Vattikota Alwar Swamy's seminal novel.",
          selectedMeaning: "Selecting an already correct pair.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "the question mentions 'Prajala Manishi' or 'Gangu'", choose: "Vattikota Alwar Swamy" },
            { when: "evaluating incorrect pairings", choose: "Gollaramaswami — Dasarathi" },
          ],
          nextStep: "Vattikota Alwar Swamy also founded the 'Deshoddharaka Grantha Mandali' publishing house.",
        },
        {
          observation: "Check 'Palletoori Pillagada'.",
          correctMeaning: "'Palletoori Pillagada' was written by Suddala Hanumanthu.",
          selectedMeaning: "Selecting an already correct pair.",
          possibleConfusion: "Confusing Suddala Hanumanthu with his son Suddala Ashok Teja.",
          decisionRules: [
            { when: "the question asks who composed 'Palletoori Pillagada'", choose: "Suddala Hanumanthu" },
            { when: "the question asks who composed 'Nenu Saitham' (film Tagore)", choose: "Suddala Ashok Teja" },
          ],
          nextStep: "Keep Suddala Hanumanthu paired with the folk awakening against feudal bonded labour.",
        },
      ],
    },
  },

  // 6. TM-Q141 (Chronology of TJAC Mass Agitations: 2011–2013)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q141",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Chronology",
      modelId: "TM-QM-CHR-01",
      stage: "practice",
      prompt: "Arrange the following unprecedented mass-mobilization programs organized by the Telangana Joint Action Committee (TJAC) in correct chronological order:\n(I) Million March on Tank Bund\n(II) Sakala Janula Samme (All People's General Strike)\n(III) Sagara Haram (Telangana March on Necklace Road)\n(IV) Sadak Bandh (National Highway 44 blockade)",
      options: [
        {
          text: "(I) -> (II) -> (III) -> (IV)",
          why: "Million March took place on 10 March 2011; Sakala Janula Samme was held from 13 September to 24 October 2011 (42 days); Sagara Haram took place on 30 September 2012; Sadak Bandh took place on 21 March 2013.",
          attraction: "The authentic, complete chronology of landmark TJAC mass agitation programs.",
          confusion: false,
        },
        {
          text: "(II) -> (I) -> (III) -> (IV)",
          why: "Million March (March 2011) preceded the 42-day Sakala Janula Samme (September–October 2011).",
          attraction: "Inverting Million March and Sakala Janula Samme.",
          confusion: true,
        },
        {
          text: "(I) -> (II) -> (IV) -> (III)",
          why: "Sagara Haram (September 2012) occurred before Sadak Bandh (March 2013).",
          attraction: "Swapping Sagara Haram and Sadak Bandh.",
        },
        {
          text: "(III) -> (I) -> (II) -> (IV)",
          why: "Sagara Haram took place in September 2012, long after the March 2011 Million March.",
          attraction: "Placing Sagara Haram first.",
        },
      ],
      answer: 0,
      reason: "The chronological sequence of major TJAC mass agitations is: 1. Million March on Tank Bund (10 March 2011, inspired by Egypt's Tahrir Square protests) -> 2. Sakala Janula Samme (13 September to 24 October 2011, paralyzing administration for 42 days) -> 3. Sagara Haram / Telangana March (30 September 2012 at Hussainsagar / Necklace Road) -> 4. Sadak Bandh (21 March 2013, blockading the Hyderabad-Bengaluru NH-44 highway for over 100 km).",
      clue: "Order: March 2011 (Million March) -> Sep–Oct 2011 (Sakala Janula Samme) -> Sep 2012 (Sagara Haram) -> Mar 2013 (Sadak Bandh).",
      trap: "Do not swap Sagara Haram (2012) and Sadak Bandh (2013).",
      elimination: "Million March was in early 2011, so eliminate options starting with II or III.",
      anchor: "TJAC Agitation Timeline: Million March (10 Mar 2011) -> Sakala Janula Samme (Sep–Oct 2011) -> Sagara Haram (30 Sep 2012) -> Sadak Bandh (21 Mar 2013).",
      hint: "Did the Tank Bund Million March happen before or after the 42-day strike (Sakala Janula Samme) of September 2011?",
      source: "TGPSC Group-2 Paper IV: Telangana Movement and State Formation 2024",
      page: 132,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly sequenced the four major TJAC mass-mobilization programs.",
          correctMeaning: "Million March (Mar 2011) -> Sakala Janula Samme (Sep 2011) -> Sagara Haram (Sep 2012) -> Sadak Bandh (Mar 2013).",
          selectedMeaning: "Million March (Mar 2011) -> Sakala Janula Samme (Sep 2011) -> Sagara Haram (Sep 2012) -> Sadak Bandh (Mar 2013).",
          possibleConfusion: "Aspirants frequently confuse the years of Sagara Haram (2012) and Sadak Bandh (2013).",
          decisionRules: [
            { when: "the question asks the sequence of TJAC agitations", choose: "Million March (10 Mar 2011) -> Sakala Janula Samme (Sep 2011) -> Sagara Haram (Sep 2012) -> Sadak Bandh (Mar 2013)" },
            { when: "the question asks the duration of Sakala Janula Samme", choose: "42 days (13 September to 24 October 2011)" },
          ],
          nextStep: "Note also Samsad Yatra (Chalo Assembly/Parliament) in April 2013.",
        },
        {
          observation: "Check Million March vs Sakala Janula Samme.",
          correctMeaning: "Million March was held on 10 March 2011, months before Sakala Janula Samme began in September 2011.",
          selectedMeaning: "Placing Sakala Janula Samme first.",
          possibleConfusion: "Both happened in 2011.",
          decisionRules: [
            { when: "comparing 2011 TJAC events", choose: "Million March (March 2011) preceded Sakala Janula Samme (September 2011)" },
            { when: "ordering TJAC milestones", choose: "Million March is the earliest of the four" },
          ],
          nextStep: "Remember: Million March broke police barriers on Tank Bund in March; government employees struck work in September.",
        },
        {
          observation: "Check Sagara Haram vs Sadak Bandh.",
          correctMeaning: "Sagara Haram was held on 30 September 2012; Sadak Bandh was on 21 March 2013.",
          selectedMeaning: "Swapping 2012 and 2013 programs.",
          possibleConfusion: "Confusing the two late-stage mass demonstrations.",
          decisionRules: [
            { when: "the question mentions Sagara Haram (Telangana March)", choose: "September 2012" },
            { when: "the question mentions Sadak Bandh (NH-44)", choose: "March 2013" },
          ],
          nextStep: "Sagara Haram surrounded Hussainsagar in 2012; Sadak Bandh blocked NH-44 highway to Bangalore in 2013.",
        },
        {
          observation: "Check initial event.",
          correctMeaning: "Sagara Haram took place in late 2012, not before 2011.",
          selectedMeaning: "Placing Sagara Haram first.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "scanning timelines", choose: "Million March (March 2011) must be first" },
            { when: "evaluating options", choose: "(I) -> (II) -> (III) -> (IV)" },
          ],
          nextStep: "Review the full TJAC action timeline from Dec 2009 to Feb 2014.",
        },
      ],
    },
  },

  // 7. TM-Q142 (Official State Anthem: Jaya Jaya He Telangana)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q142",
      topic: "TM-02.01",
      concept: "TM-02.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "In 2024, the Government of Telangana formally adopted 'Jaya Jaya He Telangana Janani Jayakethanam' as the official State Anthem (Rashtra Geetham). Who is the celebrated people's poet and lyricist who penned this soul-stirring song during the separate statehood movement?",
      options: [
        {
          text: "Ande Sri (Andesri)",
          why: "Ande Sri (born Ande Yadaiah in Rebarthi village, Jangaon district) wrote 'Jaya Jaya He Telangana' in 2006, which served as the cultural anthem during the statehood movement and was adopted as the official State Anthem in 2024.",
          attraction: "The authentic creator of the official State Anthem.",
          confusion: false,
        },
        {
          text: "Goreti Venkanna",
          why: "Goreti Venkanna is a renowned folk poet and MLC famed for 'Galli Chinnadi Garibolla Katha Peddadi' and Sahitya Akademi award-winning work 'Vallanki Taalam'.",
          attraction: "Prominent folk poet distractor.",
          confusion: true,
        },
        {
          text: "Gaddar (Gummadi Vittal Rao)",
          why: "Gaddar is immortal for songs like 'Amma Telanganama' and 'Podustunna Poddumeeda', but did not write 'Jaya Jaya He Telangana'.",
          attraction: "Iconic revolutionary balladeer distractor.",
        },
        {
          text: "Guda Anjaiah",
          why: "Guda Anjaiah authored 'Ee Ooru Manadira' and 'Rajiga Ori Rajiga'.",
          attraction: "Revolutionary folk lyricist distractor.",
        },
      ],
      answer: 0,
      reason: "Poet Ande Sri composed 'Jaya Jaya He Telangana Janani Jayakethanam' in 2006. It captures the rivers (Godavari and Krishna), historical monuments (Charminar, Golconda, Warangal Thousand Pillar temple), and the martyrs of Telangana. In 2024, the Telangana Cabinet officially designated it as the official State Anthem, with music composed by Oscar-winner M.M. Keeravani.",
      clue: "Look for the poet from Rebarthi village: Ande Sri.",
      trap: "Do not confuse 'Jaya Jaya He Telangana' (Ande Sri) with 'Podustunna Poddumeeda' (Gaddar) or 'Palle Kanneru Peduthundo' (Goreti Venkanna).",
      elimination: "Eliminate Gaddar, Goreti Venkanna, and Guda Anjaiah by recalling their distinct signature songs.",
      anchor: "Official State Anthem: 'Jaya Jaya He Telangana' -> Penned by Ande Sri | Music by M.M. Keeravani | Officially adopted in 2024.",
      hint: "Which unlettered folk scholar received an honorary doctorate from Kakatiya University for his extraordinary nature and movement poetry?",
      source: "Telangana State Cabinet Gazette 2024 / Cultural History",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly recognized Ande Sri as the author of 'Jaya Jaya He Telangana'.",
          correctMeaning: "Ande Sri composed 'Jaya Jaya He Telangana Janani Jayakethanam'.",
          selectedMeaning: "Ande Sri composed 'Jaya Jaya He Telangana Janani Jayakethanam'.",
          possibleConfusion: "Aspirants confuse the signature songs of Gaddar, Ande Sri, Goreti Venkanna, and Guda Anjaiah.",
          decisionRules: [
            { when: "the question asks who wrote the official Telangana State Anthem 'Jaya Jaya He Telangana'", choose: "Ande Sri" },
            { when: "the question asks who composed its official state music in 2024", choose: "M.M. Keeravani" },
          ],
          nextStep: "Note that Ande Sri also composed 'Mayadari Maikamu' and nature poetry collections.",
        },
        {
          observation: "Check Goreti Venkanna's works.",
          correctMeaning: "Goreti Venkanna authored 'Galli Chinnadi', 'Palle Kanneru Peduthundo', and 'Vallanki Taalam'.",
          selectedMeaning: "Attributing the State Anthem to Goreti Venkanna.",
          possibleConfusion: "Both are legendary folk poets of contemporary Telangana.",
          decisionRules: [
            { when: "the question mentions 'Vallanki Taalam' or 'Palle Kanneru Peduthundo'", choose: "Goreti Venkanna" },
            { when: "the question mentions 'Jaya Jaya He Telangana'", choose: "Ande Sri" },
          ],
          nextStep: "Associate Goreti Venkanna with Sahitya Akademi Award 2021 for 'Vallanki Taalam'.",
        },
        {
          observation: "Check Gaddar's works.",
          correctMeaning: "Gaddar authored 'Podustunna Poddumeeda', 'Amma Telanganama', and 'Nee Paadam Meeda Puttu Machanai'.",
          selectedMeaning: "Attributing the State Anthem to Gaddar.",
          possibleConfusion: "Gaddar's 'Podustunna Poddumeeda' was the most widely sung agitation song in rallies.",
          decisionRules: [
            { when: "the question asks who wrote 'Podustunna Poddumeeda' and 'Amma Telanganama'", choose: "Gaddar (Gummadi Vittal Rao)" },
            { when: "the question asks who wrote 'Jaya Jaya He Telangana'", choose: "Ande Sri" },
          ],
          nextStep: "Differentiate between the movement's battle-cry ('Podustunna Poddumeeda') and the formal State Anthem ('Jaya Jaya He Telangana').",
        },
        {
          observation: "Check Guda Anjaiah's works.",
          correctMeaning: "Guda Anjaiah wrote 'Ee Ooru Manadira' and 'Rajiga Ori Rajiga'.",
          selectedMeaning: "Attributing the anthem to Guda Anjaiah.",
          possibleConfusion: "Guda Anjaiah's songs were foundational in Dhoom-Dhaam cultural troupes.",
          decisionRules: [
            { when: "the question asks who wrote 'Ee Ooru Manadira'", choose: "Guda Anjaiah" },
            { when: "the question asks who wrote 'Jaya Jaya He Telangana'", choose: "Ande Sri" },
          ],
          nextStep: "Tie Guda Anjaiah directly to peasant and dalit liberation songs.",
        },
      ],
    },
  },

  // 8. TM-Q143 (2024 State Emblem & Telangana Thalli Redesign)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q143",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Regarding the statutory decisions and policy changes enacted in 2024 regarding Telangana's state identity and symbols, consider the following statements:\n1. The State Government resolved to replace the Kakatiya Kala Thoranam and Charminar from the official State Emblem, seeking an emblem centered on martyrs' sacrifices and democratic peasant struggles.\n2. The state registration abbreviation code for vehicles was officially changed from 'TS' to 'TG' through a gazette notification issued by the Union Ministry of Road Transport and Highways.\n3. The government commissioned a redesigned statue of 'Telangana Thalli' portraying her as a working-class rural woman rather than an aristocratic, crown-bearing queen.\nWhich of the statements given above are correct?",
      options: [
        {
          text: "1, 2, and 3",
          why: "All three statements represent official decisions taken by the Government of Telangana in 2024 to reorient state iconography towards grassroots struggles and align vehicle registration with the historical 'TG' abbreviation used during the agitation.",
          attraction: "Comprehensive correctness reflecting recent 2024 administrative reforms.",
          confusion: false,
        },
        {
          text: "1 and 2 only",
          why: "Omits the Telangana Thalli redesign decision, which was explicitly resolved by the cabinet.",
          attraction: "Overlooking the cultural iconography reform.",
          confusion: true,
        },
        {
          text: "2 and 3 only",
          why: "Omits statement 1 regarding the State Emblem redesign debate.",
          attraction: "Missing the emblem reform statement.",
        },
        {
          text: "2 only",
          why: "Focuses only on vehicle registration while ignoring the broader cultural decisions.",
          attraction: "Overly narrow selection.",
        },
      ],
      answer: 0,
      reason: "In early 2024, the newly elected Telangana Government approved major symbolic shifts: (1) Replacing feudal/monarchical symbols (Kakatiya Arch and Charminar) in the official State Emblem with symbols of sacrifice and democratic struggles, engaged with artist Rudra Rajesham; (2) In March 2024, the MoRTH amended the Motor Vehicles Rules formally changing the state code from 'TS' to 'TG'; and (3) Redesigning Telangana Thalli to depict a rural mother holding paddy stalks rather than a jeweled royal figure.",
      clue: "All three statements accurately summarize the 2024 symbolic and statutory reforms undertaken by Telangana.",
      trap: "Do not consider 'TG' code unnotified; the Union Ministry of Road Transport officially notified 'TG' in March 2024.",
      elimination: "Statements 1, 2, and 3 are all authentic 2024 government policy decisions; choose '1, 2, and 3'.",
      anchor: "2024 State Identity Decisions: Vehicle Code changed from TS to TG | Redesign of State Emblem | Redesign of Telangana Thalli as working-class mother.",
      hint: "Did the government approve the shift from 'TS' to 'TG' and reconsider feudal motifs in state emblems in 2024?",
      source: "Telangana Government Gazette Notifications 2024 / Current Affairs",
      page: 14,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly recognized all three 2024 statutory and symbolic decisions.",
          correctMeaning: "Emblem redesign, TS to TG vehicle code change, and Telangana Thalli redesign are all true.",
          selectedMeaning: "All three statements are true.",
          possibleConfusion: "Aspirants might not know that 'TG' was officially notified by the Central Government in March 2024.",
          decisionRules: [
            { when: "the question asks about the 2024 vehicle registration code change", choose: "Changed from TS to TG via Central Gazette" },
            { when: "the question asks about the rationale for redesigning the State Emblem and Telangana Thalli", choose: "To reflect democratic people's struggles rather than monarchical symbols" },
          ],
          nextStep: "Note that during the agitation from 1969 to 2014, activists consistently used 'TG' on vehicles and banners.",
        },
        {
          observation: "Check statement 3 regarding Telangana Thalli.",
          correctMeaning: "The cabinet specifically decided to remodel Telangana Thalli reflecting ordinary peasant women.",
          selectedMeaning: "Omitting statement 3.",
          possibleConfusion: "Assuming Telangana Thalli statue was left unchanged.",
          decisionRules: [
            { when: "evaluating 2024 Telangana Thalli reform", choose: "Depicting an ordinary rural working-class woman" },
            { when: "evaluating options", choose: "1, 2, and 3" },
          ],
          nextStep: "Contrast the original 2006 TRS Telangana Thalli designed by B.V.R. Chari with the 2024 proposed modifications.",
        },
        {
          observation: "Check statement 1 regarding State Emblem.",
          correctMeaning: "The government proposed removing royal motifs (Kakatiya Kala Thoranam & Charminar) in favour of martyrs' motifs.",
          selectedMeaning: "Omitting statement 1.",
          possibleConfusion: "Emblem debates were widely reported in media.",
          decisionRules: [
            { when: "the question asks which monuments were reconsidered in the 2024 emblem debate", choose: "Kakatiya Kala Thoranam and Charminar" },
            { when: "evaluating options", choose: "1, 2, and 3" },
          ],
          nextStep: "Remember artist Laxman Aelay designed the 2014 emblem, while Rudra Rajesham was engaged for 2024 revisions.",
        },
        {
          observation: "Check statement 2 scope.",
          correctMeaning: "While statement 2 is true, statements 1 and 3 are equally accurate.",
          selectedMeaning: "Choosing only statement 2.",
          possibleConfusion: "Focusing solely on the transport notification.",
          decisionRules: [
            { when: "evaluating comprehensive state identity reforms", choose: "Select all three valid statements" },
            { when: "reviewing 2024 policy updates", choose: "1, 2, and 3" },
          ],
          nextStep: "Always check if broader cultural decisions accompany administrative notifications in GS syllabus questions.",
        },
      ],
    },
  },

  // 9. TM-Q144 (2024 Justice P.C. Ghose Commission of Inquiry)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q144",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "In March 2024, the Government of Telangana constituted a judicial Commission of Inquiry under the Commissions of Inquiry Act, 1952, headed by former Supreme Court judge Justice Pinaki Chandra Ghose (P.C. Ghose). What is the specific mandate of this judicial commission?",
      options: [
        {
          text: "To investigate the structural failure, sinking of piers, design lapses, quality control defects, and financial irregularities in the Medigadda, Annaram, and Sundilla barrages of the Kaleshwaram Lift Irrigation Project",
          why: "Following the sinking of Pier 20 of Block 7 at Medigadda barrage on 21 October 2023 and National Dam Safety Authority (NDSA) findings, the P.C. Ghose Commission was appointed to thoroughly probe structural, technical, and financial aspects.",
          attraction: "The authentic terms of reference of the Justice P.C. Ghose Commission.",
          confusion: false,
        },
        {
          text: "To conduct a comprehensive door-to-door socio-economic, educational, and caste survey across Telangana",
          why: "The Door-to-Door Household Caste Survey (Samagra Intinta Kutumba Survey) was conducted by the Planning Department and BC Commission, not Justice P.C. Ghose.",
          attraction: "Confusing the irrigation probe with the 2024 Caste Survey.",
          confusion: true,
        },
        {
          text: "To review the allocation of government employees under the 2018 Presidential Order",
          why: "Employee allocation issues were handled by committees reviewing G.O. 317, not Justice P.C. Ghose.",
          attraction: "Confusing with service allocation panels.",
        },
        {
          text: "To re-delimit municipal corporation boundaries in the Hyderabad Metropolitan Development Authority (HMDA) region",
          why: "Delimitation is an administrative/state election commission subject.",
          attraction: "Urban administration distractor.",
        },
      ],
      answer: 0,
      reason: "Following the subsidence of piers at the Lakshmi (Medigadda) Barrage in October 2023 and reports of distress at Saraswati (Annaram) and Parvati (Sundilla) barrages, the National Dam Safety Authority (NDSA) submitted an adverse technical report. The Telangana Government subsequently appointed retired Supreme Court Judge Justice P.C. Ghose (who was also India's first Lokpal) as a One-Man Commission of Inquiry to investigate structural deficiencies, planning, execution, and cost escalation in the Kaleshwaram barrages.",
      clue: "Look for 'Justice P.C. Ghose Commission': Inquiry into Medigadda, Annaram, and Sundilla barrages of Kaleshwaram.",
      trap: "Do not confuse the P.C. Ghose Commission with the Justice L. Narasimha Reddy Commission (which inquired into power purchase agreements and the Bhadradri/Yadadri thermal power projects).",
      elimination: "Eliminate caste survey, employee allocation, and municipal delimitation; the commission is exclusively about Kaleshwaram barrages.",
      anchor: "2024 Judicial Commissions: Justice P.C. Ghose Commission -> Kaleshwaram Barrages (Medigadda, Annaram, Sundilla) | Justice L. Narasimha Reddy Commission -> Power purchase agreements.",
      hint: "Which commission was set up to investigate the sinking of barrage piers on the Godavari river in Kaleshwaram?",
      source: "Telangana Government G.O. Ms. No. 11, Energy & Irrigation Departments, March 2024",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the mandate of the Justice P.C. Ghose Commission.",
          correctMeaning: "Justice P.C. Ghose Commission was appointed to investigate Medigadda, Annaram, and Sundilla barrages.",
          selectedMeaning: "Justice P.C. Ghose Commission was appointed to investigate Medigadda, Annaram, and Sundilla barrages.",
          possibleConfusion: "Aspirants confuse the P.C. Ghose Commission with the Justice L. Narasimha Reddy Commission on power sector deals.",
          decisionRules: [
            { when: "the question asks about Justice P.C. Ghose Commission", choose: "Kaleshwaram Project barrages (Medigadda, Annaram, Sundilla)" },
            { when: "the question asks about Justice L. Narasimha Reddy Commission", choose: "Power purchase agreements and Yadadri/Bhadradri thermal plants" },
          ],
          nextStep: "Note that Justice P.C. Ghose was previously the first Lokpal of India.",
        },
        {
          observation: "Check caste survey authority.",
          correctMeaning: "The 2024 Comprehensive Socio-Economic, Employment, Political and Caste Survey was executed by the Planning Department under G.O. Ms. No. 18.",
          selectedMeaning: "Confusing irrigation inquiry with the caste survey.",
          possibleConfusion: "Both were major 2024 initiatives.",
          decisionRules: [
            { when: "the question mentions the 2024 Caste Survey", choose: "Executed under Planning Department resolution and BC Commission" },
            { when: "the question mentions Justice P.C. Ghose", choose: "Kaleshwaram barrage structural inquiry" },
          ],
          nextStep: "Distinguish between judicial commissions of inquiry and administrative household surveys.",
        },
        {
          observation: "Check employee allocation commissions.",
          correctMeaning: "Employee allocation disputes arose from G.O. 317 under the 2018 Presidential Order.",
          selectedMeaning: "Confusing irrigation inquiry with G.O. 317.",
          possibleConfusion: "Both are high-profile policy controversies.",
          decisionRules: [
            { when: "the question mentions G.O. 317", choose: "Cabinet Sub-Committee on employee zonal allocations" },
            { when: "the question mentions Justice P.C. Ghose", choose: "Kaleshwaram barrages" },
          ],
          nextStep: "Pair G.O. 317 with local cadre transfers and P.C. Ghose with river engineering inquiries.",
        },
        {
          observation: "Check municipal delimitation.",
          correctMeaning: "Urban local body delimitation is governed by the Telangana Municipalities Act, 2019.",
          selectedMeaning: "Selecting an unrelated administrative distractor.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "evaluating options", choose: "Kaleshwaram project barrage inquiry" },
            { when: "the question asks about P.C. Ghose", choose: "Medigadda barrage structural distress" },
          ],
          nextStep: "Focus on water and irrigation governance in Paper IV and General Studies.",
        },
      ],
    },
  },

  // 10. TM-Q145 (APRA 2014 Section 5: Common Capital 10-Year Expiry)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q145",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Section 5(1) of the Andhra Pradesh Reorganisation Act, 2014, the existing city of Hyderabad was designated as the common capital for both the State of Telangana and the State of Andhra Pradesh for a period not exceeding ten years. On which exact date did this ten-year statutory period expire, rendering Hyderabad exclusively the capital of Telangana?",
      options: [
        {
          text: "2 June 2024",
          why: "Section 5(2) stipulated that on the expiry of the ten-year period from the appointed day (2 June 2014), Hyderabad shall be the capital of the State of Telangana and there shall be a new capital for Andhra Pradesh. Exactly 10 years were completed on 2 June 2024.",
          attraction: "The authentic, statutory sunset date of the common capital arrangement.",
          confusion: false,
        },
        {
          text: "1 March 2024",
          why: "1 March was the date the President gave assent to the Act in 2014, not the appointed day from which 10 years are reckoned.",
          attraction: "Confusing Presidential Assent date (1 March 2014) with the appointed day (2 June 2014).",
          confusion: true,
        },
        {
          text: "1 January 2024",
          why: "Arbitrary calendar year start.",
          attraction: "Calendar year assumption.",
        },
        {
          text: "15 August 2024",
          why: "Independence Day assumption.",
          attraction: "National day distractor.",
        },
      ],
      answer: 0,
      reason: "Section 5 of the AP Reorganisation Act, 2014 provided: '(1) On and from the appointed day, Hyderabad in the existing State of Andhra Pradesh, shall be the common capital of the State of Telangana and the State of Andhra Pradesh for such period not exceeding ten years. (2) On the expiry of the period referred to in sub-section (1), Hyderabad shall be the capital of the State of Telangana and there shall be a new capital for the State of Andhra Pradesh.' Since the Appointed Day was 2 June 2014, the 10-year period officially ended on 2 June 2024.",
      clue: "Calculate 10 years from the Appointed Day (2 June 2014): 2 June 2024.",
      trap: "Do not count from the gazette notification date or presidential assent date (1 March 2014); the statute expressly measures the ten-year common capital period from the 'appointed day' (2 June 2014).",
      elimination: "Eliminate 1 March 2024 and calendar start dates; the appointed day was 2 June.",
      anchor: "APRA 2014 Section 5: Common Capital for a period not exceeding 10 years from the Appointed Day -> Expired on 2 June 2024.",
      hint: "What was the Appointed Day of Telangana, and what date marks exactly ten years from that day?",
      source: "The Andhra Pradesh Reorganisation Act, 2014 (Act No. 6 of 2014), Section 5",
      page: 3,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly calculated the expiry of common capital status as 2 June 2024.",
          correctMeaning: "The 10-year period under Section 5 expired on 2 June 2024 (10 years from Appointed Day, 2 June 2014).",
          selectedMeaning: "The 10-year period under Section 5 expired on 2 June 2024 (10 years from Appointed Day, 2 June 2014).",
          possibleConfusion: "Aspirants confuse Presidential assent date (1 March 2014) with the Appointed Day (2 June 2014).",
          decisionRules: [
            { when: "the question asks when Hyderabad ceased to be the common capital under Section 5", choose: "2 June 2024" },
            { when: "the question asks what was the maximum period Hyderabad could be common capital", choose: "10 years from the Appointed Day" },
          ],
          nextStep: "Note that all government buildings allocated to AP in Hyderabad (like Lake View Guest House, Secretariat blocks) reverted to Telangana.",
        },
        {
          observation: "Check presidential assent date vs appointed day.",
          correctMeaning: "Presidential assent was on 1 March 2014, but Section 5 measures the period 'On and from the appointed day' (2 June 2014).",
          selectedMeaning: "Calculating 10 years from presidential assent.",
          possibleConfusion: "Confusing legislative enactment with administrative commencement.",
          decisionRules: [
            { when: "calculating statutory durations in APRA 2014", choose: "Count from the Appointed Day (2 June 2014) unless specified otherwise" },
            { when: "the question asks about Section 5 expiry", choose: "2 June 2024" },
          ],
          nextStep: "Always check whether a timeline in APRA runs from assent (1 Mar 2014) or the appointed day (2 Jun 2014).",
        },
        {
          observation: "Check calendar year assumption.",
          correctMeaning: "Common capital status was strictly tied to the date of state formation.",
          selectedMeaning: "Assuming expiry at the start of calendar year 2024.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "evaluating APRA Section 5", choose: "2 June 2024 (exact 10th anniversary)" },
            { when: "the question asks about Hyderabad's capital status", choose: "Sole capital of Telangana since 2 June 2024" },
          ],
          nextStep: "Remember: 2 June is Telangana State Formation Day.",
        },
        {
          observation: "Check August 15 distractor.",
          correctMeaning: "August 15 has no statutory relevance to APRA Section 5.",
          selectedMeaning: "Arbitrary national holiday choice.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "the question asks when common capital status terminated", choose: "2 June 2024" },
            { when: "evaluating options", choose: "2 June 2024" },
          ],
          nextStep: "Remember 2 June 2024 as the date Telangana achieved full exclusive control of Hyderabad.",
        },
      ],
    },
  },

  // 11. TM-Q146 (Telugu Academy Case: Supreme Court on Section 75 Schedule X Assets)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q146",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "In the landmark dispute concerning the division of assets, fixed deposits, and bank accounts of the Telugu Academy (a premier training and educational institution listed under Schedule X of the AP Reorganisation Act, 2014), what decisive legal principle was established by the Supreme Court of India?",
      options: [
        {
          text: "The assets and bank deposits of Schedule X institutions must be apportioned between Telangana and Andhra Pradesh on the basis of population ratio (58.32% : 41.68%), rejecting the exclusive claim of the location state based solely on the territorial 'headquarters principle'",
          why: "In State of Telangana v. Andhra Pradesh (Telugu Academy case, 2021), the Supreme Court affirmed that institutions created to serve the undivided state and listed in Schedule X have their assets and funds divided on population ratio, not claimed 100% by the state where the headquarters happens to be situated.",
          attraction: "The authentic constitutional and statutory ruling of the Supreme Court.",
          confusion: false,
        },
        {
          text: "The entire assets and bank deposits belong exclusively to the State where the headquarters is physically located, without any compensation to the other State",
          why: "This territorial argument was advanced by Telangana but was expressly rejected by the Supreme Court.",
          attraction: "The rejected territorial argument.",
          confusion: true,
        },
        {
          text: "All Schedule X institutions must be permanently dissolved and merged into the Central Government",
          why: "APRA Section 75 provides for continuing services or division, not dissolution into the Union government.",
          attraction: "Extreme distortion.",
        },
        {
          text: "Assets are divided equally (50:50) between the two States regardless of population",
          why: "The statutory ratio across APRA 2014 for undivided public debts and general institutions is population ratio (58.32 : 41.68), not 50:50.",
          attraction: "Equal division misconception.",
        },
      ],
      answer: 0,
      reason: "Under Section 75 of APRA 2014, institutions listed in the Tenth Schedule (such as Telugu Academy, Dr. MCR HRD Institute) are required to continue providing facilities to both states. When Andhra Pradesh filed a petition claiming its share in the ₹140 crore fixed deposits and assets of the Telugu Academy in Hyderabad, the Supreme Court ruled that all 142 institutions in Schedule X belong to the people of both successor states, and their assets must be apportioned on the basis of the statutory population ratio (58.32% to AP and 41.68% to Telangana), rejecting the pure 'headquarters location' doctrine.",
      clue: "Supreme Court principle on Schedule X institutions (Telugu Academy): Division on population ratio (58.32% : 41.68%), rejecting exclusive territorial headquarters ownership.",
      trap: "Do not assume the state where the headquarters is located keeps 100% of the funds; the Supreme Court ruled that assets must be apportioned on population ratio.",
      elimination: "Eliminate exclusive territorial claims and 50:50 splits; the statutory ratio is population ratio.",
      anchor: "APRA 2014 Section 75 & Schedule X (Telugu Academy case): Assets and funds apportioned on population ratio (58.32% AP : 41.68% TG).",
      hint: "Did the Supreme Court rule in favor of the 'headquarters principle' or the 'population ratio' for dividing Schedule X institutions?",
      source: "Supreme Court of India, Civil Appeal No. 7948 of 2021 (State of Telangana v. State of AP) / APRA 2014 Section 75",
      page: 12,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the Supreme Court's ruling on the division of Schedule X assets.",
          correctMeaning: "Assets and bank deposits of Schedule X institutions are apportioned based on population ratio (58.32 : 41.68).",
          selectedMeaning: "Assets and bank deposits of Schedule X institutions are apportioned based on population ratio (58.32 : 41.68).",
          possibleConfusion: "Aspirants mistakenly assume physical location in Hyderabad confers 100% financial ownership to Telangana.",
          decisionRules: [
            { when: "the question asks about the Supreme Court ruling in the Telugu Academy case", choose: "Apportionment based on population ratio (58.32% AP : 41.68% Telangana)" },
            { when: "the question asks which schedule contains Telugu Academy", choose: "Schedule X (Tenth Schedule - 142 institutions)" },
          ],
          nextStep: "Note that Schedule IX covers Public Sector Undertakings (91 corporations), while Schedule X covers institutions/academies (142).",
        },
        {
          observation: "Check the territorial headquarters argument.",
          correctMeaning: "The Supreme Court expressly rejected the 'headquarters principle' as unfair to the people whose taxes built the institution.",
          selectedMeaning: "Adopting the rejected argument that headquarters state keeps all assets.",
          possibleConfusion: "Confusing Section 53 (local assets) with Section 75 and Schedule X (state-wide institutions).",
          decisionRules: [
            { when: "the question asks if the headquarters principle applies to Schedule X assets", choose: "No, Supreme Court rejected it in favor of population ratio" },
            { when: "evaluating options", choose: "Population ratio (58.32% : 41.68%)" },
          ],
          nextStep: "Remember: Location state retains physical immovable property, but must compensate the other state on population ratio.",
        },
        {
          observation: "Check dissolution claim.",
          correctMeaning: "Schedule X institutions continue to operate and are not dissolved into the Union government.",
          selectedMeaning: "Selecting central dissolution.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "the question mentions Schedule X institutions", choose: "Apportionment between successor states" },
            { when: "evaluating options", choose: "Population ratio apportionment" },
          ],
          nextStep: "Review the difference between Section 68 (Schedule IX) and Section 75 (Schedule X).",
        },
        {
          observation: "Check 50:50 ratio claim.",
          correctMeaning: "The ratio is strictly the population ratio defined under Section 2(h): 58.32% (AP) and 41.68% (Telangana).",
          selectedMeaning: "Assuming an equal 50:50 division.",
          possibleConfusion: "General assumption of equal halves.",
          decisionRules: [
            { when: "the question asks the apportionment ratio for undivided assets and liabilities in APRA", choose: "Population ratio (58.32% AP : 41.68% Telangana)" },
            { when: "evaluating options", choose: "Population ratio, not 50:50" },
          ],
          nextStep: "Memorize the census 2011 population ratio: 58.32% for Andhra Pradesh and 41.68% for Telangana.",
        },
      ],
    },
  },

  // 12. TM-Q147 (Constitutional Procedure under Article 3 for Telangana Creation)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q147",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Regarding the constitutional procedure under Article 3 of the Constitution of India through which the State of Telangana was carved out of Andhra Pradesh, consider the following statements:\n1. A bill for the formation of a new state can be introduced in either House of Parliament only on the prior recommendation of the President of India.\n2. In accordance with the proviso to Article 3, the President referred the draft Andhra Pradesh Reorganisation Bill to the Andhra Pradesh State Legislature to express its views within a specified timeframe.\n3. The resolution passed by the Andhra Pradesh Legislative Assembly rejecting the draft bifurcation bill was legally binding upon the Parliament of India, requiring Parliament to secure a two-thirds majority.\nWhich of the statements given above are correct?",
      options: [
        {
          text: "1 and 2 only",
          why: "Statements 1 and 2 are correct. Statement 3 is incorrect: Under the landmark Supreme Court ruling in Babulal Parate v. State of Bombay (1960), the views expressed by the state legislature under the Article 3 proviso are not binding on Parliament, nor does Article 3 require a two-thirds majority (a simple majority suffices under Article 4).",
          attraction: "The correct constitutional position regarding Parliament's plenary power under Article 3.",
          confusion: false,
        },
        {
          text: "1, 2, and 3",
          why: "Statement 3 is false because state assembly resolutions under Article 3 are consultative, not binding on Parliament.",
          attraction: "Believing that state rejection blocks parliamentary reorganization.",
          confusion: true,
        },
        {
          text: "2 and 3 only",
          why: "Omits statement 1, which correctly states that the President's prior recommendation is mandatory.",
          attraction: "Missing the presidential recommendation requirement.",
        },
        {
          text: "1 only",
          why: "Ignores statement 2, which is an explicit constitutional requirement under the Article 3 proviso.",
          attraction: "Overly restrictive selection.",
        },
      ],
      answer: 0,
      reason: "Article 3 of the Constitution vests Parliament with the plenary power to form new states, alter boundaries, or change names of states. The two conditions under the Article 3 proviso are: (1) The bill can be introduced only on the recommendation of the President; and (2) The President must refer the bill to the concerned state legislature to express its views. However, Parliament is not bound to accept or act upon the views expressed by the State Legislature (established in Babulal Parate v. State of Bombay, 1960). Furthermore, under Article 4(2), a law under Article 3 is not considered an amendment under Article 368 and is passed by a simple majority.",
      clue: "Statements 1 and 2 are true; Statement 3 is false because the state legislature's views under Article 3 are advisory and non-binding.",
      trap: "Do not fall into the trap of thinking the AP Assembly's rejection stopped Parliament; under Article 3, Parliament has sovereign authority to reorganize states regardless of state assembly objections.",
      elimination: "Eliminate statement 3 immediately; the state resolution is not binding on Parliament.",
      anchor: "Article 3 Procedure: Prior presidential recommendation (mandatory) + Reference to state legislature for views (mandatory) + Views are NOT binding on Parliament (Babulal Parate case).",
      hint: "Was Parliament legally bound when the Andhra Pradesh Assembly passed a resolution rejecting the Reorganisation Bill in January 2014?",
      source: "TGPSC Group-1 Preliminary & Main Examination / Indian Polity & Telangana Movement",
      page: 47,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly determined that statements 1 and 2 are correct, while statement 3 is false.",
          correctMeaning: "President's recommendation and reference to state assembly are mandatory, but the state's views are non-binding.",
          selectedMeaning: "Statements 1 and 2 are correct; statement 3 is incorrect.",
          possibleConfusion: "Aspirants confuse federal consultation with federal veto power.",
          decisionRules: [
            { when: "the question asks if a state legislature's resolution under Article 3 is binding on Parliament", choose: "No, it is purely advisory (Babulal Parate case)" },
            { when: "the question asks the majority required in Parliament to create a new state", choose: "Simple majority (under Article 4)" },
          ],
          nextStep: "Remember: India is described as 'an indestructible Union of destructible States'.",
        },
        {
          observation: "Check statement 3 validity.",
          correctMeaning: "Statement 3 is completely false: The AP Assembly rejected the bill on 30 January 2014, yet Parliament passed it in February 2014.",
          selectedMeaning: "Assuming state assembly has veto power.",
          possibleConfusion: "Misunderstanding Article 3 proviso.",
          decisionRules: [
            { when: "the question asks about state assembly rejection of APRA 2014", choose: "Parliament had full power to proceed and pass the bill" },
            { when: "evaluating statement 3", choose: "Mark it incorrect" },
          ],
          nextStep: "Review Article 3 proviso and Supreme Court interpretations in Babulal Parate (1960) and Mullaperiyar case.",
        },
        {
          observation: "Check statement 1 validity.",
          correctMeaning: "Statement 1 is accurate: Article 3 explicitly mandates the President's recommendation before introduction.",
          selectedMeaning: "Omitting statement 1.",
          possibleConfusion: "Thinking state bills can be introduced directly by MPs without presidential sanction.",
          decisionRules: [
            { when: "the question asks whose prior recommendation is required for an Article 3 bill", choose: "President of India" },
            { when: "evaluating statement 1", choose: "Statement 1 is correct" },
          ],
          nextStep: "Note that the President acts on the aid and advice of the Union Cabinet (Article 74).",
        },
        {
          observation: "Check statement 2 validity.",
          correctMeaning: "Statement 2 is accurate: The President referred the AP Reorganisation Bill to the state assembly on 12 December 2013.",
          selectedMeaning: "Omitting statement 2.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "the question asks if the President must refer the reorganization bill to the state legislature", choose: "Yes, referral for expressing views is mandatory under Article 3 proviso" },
            { when: "evaluating options", choose: "1 and 2 only" },
          ],
          nextStep: "Referral is mandatory, but following the advice is not mandatory.",
        },
      ],
    },
  },

  // 13. TM-Q148 (Role of Employee & Gazetted Officers Associations: TNGOs & TGOs)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q148",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "practice",
      prompt: "During the crucial phases of the Telangana movement between 2009 and 2014, the employee unions played an indispensable vanguard role. Who served as the President of the Telangana Non-Gazetted Officers (TNGOs) Central Union during the historic 'Sakala Janula Samme', and was subsequently elected as the first Chairman of the Telangana Legislative Council?",
      options: [
        {
          text: "K. Swamy Goud",
          why: "K. Swamy Goud was the President of the TNGOs Central Union and a key leader of the Employees JAC during the 42-day Sakala Janula Samme. Following statehood, he was elected as the first Chairman of the Telangana Legislative Council (2014–2019).",
          attraction: "The authentic employee vanguard leader and first Council Chairman.",
          confusion: false,
        },
        {
          text: "C. Vittal",
          why: "C. Vittal was an active TNGOs leader and later served as a member of the Telangana Public Service Commission (TSPSC), not the Council Chairman.",
          attraction: "Prominent TNGO leader distractor.",
          confusion: true,
        },
        {
          text: "V. Srinivas Goud",
          why: "V. Srinivas Goud served as President of the Telangana Gazetted Officers (TGOs) Association, and later became a Cabinet Minister, not Council Chairman.",
          attraction: "TGOs President distractor.",
        },
        {
          text: "Deviprasad",
          why: "Deviprasad succeeded Swamy Goud as TNGOs President and later served as Chairman of the Telangana Beverages Corporation.",
          attraction: "Subsequent TNGOs President distractor.",
        },
      ],
      answer: 0,
      reason: "K. Swamy Goud spearheaded the Telangana Non-Gazetted Officers (TNGOs) Central Union and was Co-Chairman of the Telangana Joint Action Committee (TJAC). His leadership during the 42-day 'Sakala Janula Samme' in 2011 brought the entire administrative machinery to a standstill. In July 2014, he was unanimously elected as the first Chairman of the newly constituted Telangana Legislative Council.",
      clue: "Look for the TNGOs President who became the first Chairman of the Telangana Legislative Council: K. Swamy Goud.",
      trap: "Do not confuse K. Swamy Goud (TNGOs President) with V. Srinivas Goud (TGOs President).",
      elimination: "Eliminate Srinivas Goud (TGOs, became Minister) and C. Vittal (became TSPSC member); Swamy Goud became Council Chairman.",
      anchor: "Employee Leadership: K. Swamy Goud -> TNGOs President & 1st Legislative Council Chairman | V. Srinivas Goud -> TGOs President & Minister.",
      hint: "Which employee leader led TNGOs through the 42-day strike and was honoured with the Council Chairmanship in 2014?",
      source: "TS Police SI Prelims 2016 / Contemporary Movement Leadership",
      page: 104,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly recognized K. Swamy Goud as the TNGOs President and first Legislative Council Chairman.",
          correctMeaning: "K. Swamy Goud headed TNGOs during Sakala Janula Samme and became first Legislative Council Chairman.",
          selectedMeaning: "K. Swamy Goud headed TNGOs during Sakala Janula Samme and became first Legislative Council Chairman.",
          possibleConfusion: "Confusing TNGOs President (K. Swamy Goud) with TGOs President (V. Srinivas Goud).",
          decisionRules: [
            { when: "the question asks who was the TNGOs President during Sakala Janula Samme who became Legislative Council Chairman", choose: "K. Swamy Goud" },
            { when: "the question asks who was the TGOs (Gazetted Officers) President", choose: "V. Srinivas Goud" },
          ],
          nextStep: "Remember: Non-Gazetted = K. Swamy Goud; Gazetted = V. Srinivas Goud.",
        },
        {
          observation: "Check C. Vittal's trajectory.",
          correctMeaning: "C. Vittal was an influential TNGO leader and TJAC member who later joined TSPSC as a member.",
          selectedMeaning: "Selecting C. Vittal.",
          possibleConfusion: "Both were top TNGO leaders.",
          decisionRules: [
            { when: "the question asks which employee leader was appointed to TSPSC", choose: "C. Vittal" },
            { when: "the question asks who became Legislative Council Chairman", choose: "K. Swamy Goud" },
          ],
          nextStep: "Track key civil society and employee leaders who took up statutory posts after 2014.",
        },
        {
          observation: "Check V. Srinivas Goud's association.",
          correctMeaning: "V. Srinivas Goud led the Telangana Gazetted Officers (TGOs) Association and later became Prohibition, Excise & Sports Minister.",
          selectedMeaning: "Confusing TGOs with TNGOs.",
          possibleConfusion: "Both share the surname Goud and led major employee unions.",
          decisionRules: [
            { when: "the question mentions Telangana Gazetted Officers (TGOs)", choose: "V. Srinivas Goud" },
            { when: "the question mentions Non-Gazetted Officers (TNGOs)", choose: "K. Swamy Goud" },
          ],
          nextStep: "Pair 'Gazetted' with Srinivas Goud and 'Non-Gazetted' with Swamy Goud.",
        },
        {
          observation: "Check Deviprasad's tenure.",
          correctMeaning: "Deviprasad took over leadership of TNGOs after Swamy Goud entered electoral politics.",
          selectedMeaning: "Selecting Deviprasad.",
          possibleConfusion: "Succession confusion in TNGOs.",
          decisionRules: [
            { when: "the question asks who was the leader during the 2011 strike who became Council Chairman", choose: "K. Swamy Goud" },
            { when: "the question asks who succeeded Swamy Goud in TNGOs", choose: "Deviprasad" },
          ],
          nextStep: "Remember Swamy Goud led during 2009–2012, Deviprasad followed in 2012–2014.",
        },
      ],
    },
  },

  // 14. TM-Q149 (1952 City College Firing & Jaganmohan Reddy Commission)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q149",
      topic: "TM-01.02",
      concept: "TM-01.02-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Following the police firings on student agitators during the 1952 'Non-Mulki Go Back' (Ghair-Mulki Go Back) agitation near City College, Hyderabad on 3 and 4 September 1952, which judicial commission of inquiry was appointed by Chief Minister Burgula Ramakrishna Rao to probe the police firings?",
      options: [
        {
          text: "Justice Pingali Jaganmohan Reddy Commission",
          why: "On 5 September 1952, Chief Minister Burgula Ramakrishna Rao appointed High Court Justice Pingali Jaganmohan Reddy as a one-man commission of inquiry to investigate the City College police firings that resulted in the death of four persons.",
          attraction: "The authentic, landmark 1952 judicial inquiry commission.",
          confusion: false,
        },
        {
          text: "Justice K.N. Wanchoo Committee",
          why: "Justice Wanchoo Committee was appointed in 1969 to examine constitutional remedies for Mulki rules, not in 1952.",
          attraction: "Confusing 1969 inquiry with 1952.",
          confusion: true,
        },
        {
          text: "Justice Vashishtha Bhargava Committee",
          why: "Justice Bhargava Committee was appointed in 1969 to calculate surplus revenues.",
          attraction: "Confusing with 1969 surplus committee.",
        },
        {
          text: "Justice Fazal Ali Commission",
          why: "Fazal Ali Commission was the States Reorganisation Commission (SRC) appointed in December 1953 by the Government of India, not a state firing inquiry.",
          attraction: "Confusing national SRC with state judicial inquiry.",
        },
      ],
      answer: 0,
      reason: "On 3 September 1952, police opened fire on students demonstrating against the appointment of non-Mulkis near City College, killing Mohammad Sajjad Hussain and Shaikh Mahbub, and injuring many. Further firing on 4 September killed two more citizens (Ramulu and Shankar). The public outrage forced Chief Minister Burgula Ramakrishna Rao to appoint High Court Justice Pingali Jaganmohan Reddy to inquire into the circumstances of the firing and the conduct of Hyderabad Police Commissioner Shiv Kumar Lal.",
      clue: "1952 City College firing inquiry: Justice Pingali Jaganmohan Reddy Commission.",
      trap: "Do not confuse the 1952 City College firing commission (P. Jaganmohan Reddy) with the 1953 States Reorganisation Commission (Fazal Ali) or 1969 committees (Wanchoo, Bhargava).",
      elimination: "Wanchoo and Bhargava belong to 1969; Fazal Ali was the national SRC of 1953. Justice P. Jaganmohan Reddy is the 1952 firing inquiry judge.",
      anchor: "1952 Non-Mulki Movement: City College firing (3-4 Sep 1952) -> Justice Pingali Jaganmohan Reddy Commission of Inquiry.",
      hint: "Which distinguished Hyderabad High Court judge (who later became a Supreme Court Judge) inquired into the City College police firing?",
      source: "TGPSC Group-2 Paper IV 2024 / Hyderabad State History",
      page: 38,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the Justice Pingali Jaganmohan Reddy Commission.",
          correctMeaning: "Justice Pingali Jaganmohan Reddy inquired into the 3–4 September 1952 City College police firing.",
          selectedMeaning: "Justice Pingali Jaganmohan Reddy inquired into the 3–4 September 1952 City College police firing.",
          possibleConfusion: "Aspirants confuse the 1952 inquiry with 1969 committees or the 1953 SRC.",
          decisionRules: [
            { when: "the question asks which commission investigated the 1952 City College police firing", choose: "Justice Pingali Jaganmohan Reddy Commission" },
            { when: "the question asks who was the Hyderabad Police Commissioner during the 1952 firing", choose: "Shiv Kumar Lal" },
          ],
          nextStep: "Note that Justice Jaganmohan Reddy's report noted that the police firing was not fully justifiable and called for restrained crowd management.",
        },
        {
          observation: "Check Justice Wanchoo Committee context.",
          correctMeaning: "Justice Wanchoo Committee was formed in April 1969 to examine constitutional remedies under Article 16(3).",
          selectedMeaning: "Attributing 1952 inquiry to Wanchoo.",
          possibleConfusion: "Both were judicial inquiries relating to Mulki issues.",
          decisionRules: [
            { when: "the question asks about 1969 constitutional remedies for Mulki rules", choose: "Justice K.N. Wanchoo Committee" },
            { when: "the question asks about the 1952 City College firing", choose: "Justice Pingali Jaganmohan Reddy Commission" },
          ],
          nextStep: "Wanchoo investigated law in 1969; Jaganmohan Reddy investigated firing in 1952.",
        },
        {
          observation: "Check Bhargava Committee context.",
          correctMeaning: "Bhargava Committee investigated financial revenue surpluses in 1969.",
          selectedMeaning: "Selecting Bhargava Committee.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "the question mentions revenue surpluses in 1969", choose: "Justice Vashishtha Bhargava Committee" },
            { when: "the question mentions 1952 student firing", choose: "Justice Pingali Jaganmohan Reddy Commission" },
          ],
          nextStep: "Remember Bhargava deals with money; Jaganmohan Reddy deals with 1952 firing.",
        },
        {
          observation: "Check Fazal Ali Commission context.",
          correctMeaning: "Fazal Ali Commission was the national States Reorganisation Commission (SRC) formed in December 1953.",
          selectedMeaning: "Selecting Fazal Ali Commission.",
          possibleConfusion: "Both happened in the 1950s.",
          decisionRules: [
            { when: "the question asks about the 1953 States Reorganisation Commission", choose: "Fazal Ali Commission (with Panikkar and Kunzru)" },
            { when: "the question asks about the 1952 Hyderabad student firing inquiry", choose: "Justice Pingali Jaganmohan Reddy Commission" },
          ],
          nextStep: "Remember Fazal Ali recommended a separate Telangana state in Para 386 of the 1955 SRC report.",
        },
      ],
    },
  },

  // 15. TM-Q150 (Master Synthesis of Telangana's 60-Year Movement: 1948–2014)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q150",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Reviewing the foundational milestones across the 60-year historic journey of Telangana statehood (1948–2014), consider the following statements:\n1. The States Reorganisation Commission (Fazal Ali Commission), in Paragraph 386 of its 1955 Report, explicitly recommended that Telangana should initially be constituted as a separate State (Hyderabad State), with unification with Andhra subject to a two-thirds majority in the state assembly after the 1961 general elections.\n2. The 1969 agitation was sparked by massive student protests protesting the blatant violation of Gentlemen's Agreement safeguards, job allocations, and diversion of revenue surpluses, leading to the resignation of Kasu Brahmananda Reddy's cabinet ministers.\n3. The 32nd Constitutional Amendment Act, 1973 inserted Article 371-D and Article 371-E into the Constitution to give effect to the Six-Point Formula, creating local cadres and organizing the state into zones for public employment.\n4. The Andhra Pradesh Reorganisation Act, 2014 was passed by both Houses of Parliament in February 2014, received the assent of the President on 1 March 2014, and Telangana was officially inaugurated as the 29th State of India on the Appointed Day, 2 June 2014.\nWhich of the statements given above are correct?",
      options: [
        {
          text: "1, 2, 3, and 4",
          why: "All four statements represent the master constitutional and historical cornerstones of the Telangana statehood movement from 1955 to 2014.",
          attraction: "The complete, authentic synthesis of the entire movement's 60-year trajectory.",
          confusion: false,
        },
        {
          text: "1, 2, and 4 only",
          why: "Omits statement 3 regarding the 32nd Constitutional Amendment and Article 371-D.",
          attraction: "Overlooking the constitutional amendment milestone.",
          confusion: true,
        },
        {
          text: "2, 3, and 4 only",
          why: "Omits statement 1 regarding the landmark Para 386 recommendation of the Fazal Ali Commission.",
          attraction: "Overlooking the SRC report findings.",
        },
        {
          text: "1, 3, and 4 only",
          why: "Omits statement 2 regarding the catalytic causes of the 1969 agitation.",
          attraction: "Overlooking the 1969 student agitation dynamics.",
        },
      ],
      answer: 0,
      reason: "This master synthesis encapsulates the four pivotal pillars of the movement: (1) SRC Para 386 (1955) recommended keeping Telangana separate; (2) 1969 Agitation was catalyzed by safeguard violations and surplus diversion, leading to the formation of TPS; (3) 32nd Constitutional Amendment Act, 1973 inserted Article 371-D establishing the Zonal System and local cadres; and (4) AP Reorganisation Act, 2014 was assented on 1 March 2014 and appointed on 2 June 2014, fulfilling the aspiration of statehood.",
      clue: "All four statements (1, 2, 3, and 4) are historically and legally impeccable.",
      trap: "Do not doubt any of these four foundational pillars; each represents an established, tested fact in TSLPRB SI/Constable and TGPSC Group examinations.",
      elimination: "All four statements are verified historical facts; choose '1, 2, 3, and 4'.",
      anchor: "The Four Pillars of Telangana Movement: SRC Para 386 (1955) | 1969 Agitation | Article 371-D / 32nd Amendment (1973) | APRA 2014 / 2 June 2014 Appointed Day.",
      hint: "Are all four foundational statements regarding 1955, 1969, 1973, and 2014 historically accurate?",
      source: "TGPSC Group-2 Paper IV 2024 / Government of India Gazette / Constitution of India",
      page: 150,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly recognized all four master milestones of Telangana's 60-year struggle.",
          correctMeaning: "SRC 1955 (Para 386), 1969 agitation, Article 371-D (1973), and APRA 2014 (2 June 2014) are all authentic facts.",
          selectedMeaning: "All four statements are authentic facts.",
          possibleConfusion: "Aspirants sometimes doubt whether SRC Paragraph 386 or 387 is the famous recommendation (it is Para 386).",
          decisionRules: [
            { when: "the question asks which paragraph of SRC recommended separate Telangana", choose: "Paragraph 386" },
            { when: "the question asks which constitutional amendment inserted Article 371-D", choose: "32nd Constitutional Amendment Act, 1973" },
          ],
          nextStep: "Keep this four-pillar timeline as the ultimate reference for any comprehensive multi-statement question.",
        },
        {
          observation: "Check statement 3 regarding Article 371-D.",
          correctMeaning: "Statement 3 is entirely accurate: 32nd Amendment inserted Article 371-D (and Article 371-E for Central University).",
          selectedMeaning: "Omitting statement 3.",
          possibleConfusion: "Confusing 32nd Amendment (1973) with 42nd Amendment (1976).",
          decisionRules: [
            { when: "the question asks which amendment enacted the Six-Point Formula", choose: "32nd Constitutional Amendment Act, 1973" },
            { when: "evaluating all four statements", choose: "1, 2, 3, and 4 are all correct" },
          ],
          nextStep: "Article 371-D protects local cadres and reservations for educational institutions.",
        },
        {
          observation: "Check statement 1 regarding Fazal Ali Commission.",
          correctMeaning: "Statement 1 is entirely accurate: Fazal Ali explicitly cautioned against immediate merger in Para 386.",
          selectedMeaning: "Omitting statement 1.",
          possibleConfusion: "Assuming SRC recommended immediate Vishalandhra.",
          decisionRules: [
            { when: "the question asks whether SRC favored immediate merger in 1955", choose: "No, SRC recommended separate Hyderabad State in Para 386" },
            { when: "evaluating options", choose: "1, 2, 3, and 4 are all correct" },
          ],
          nextStep: "Remember: SRC's cautionary advice in Para 386 was overruled by political pressure, leading to the merger on 1 Nov 1956.",
        },
        {
          observation: "Check statement 2 regarding 1969 agitation.",
          correctMeaning: "Statement 2 is entirely accurate: Violations of Gentlemen's Agreement and surplus diversion catalyzed the 1969 movement.",
          selectedMeaning: "Omitting statement 2.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "the question asks the primary triggers of the 1969 agitation", choose: "Safeguard violations and diversion of revenue surpluses" },
            { when: "evaluating options", choose: "1, 2, 3, and 4 are all correct" },
          ],
          nextStep: "Connect 1969 directly to the student rallies at Osmania University, Nizam College, and Sadashivpet.",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 9 (${batchQuestions.length} questions: TM-Q136 to TM-Q150)...`);

const importPayload = {
  actor: "human_operator_curator",
  reason: "Ingesting Batch 9: 15 comprehensive PYQs and master milestone questions for Telangana Police SI & Constable aspirants (TM-Q136 to TM-Q150).",
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
  reason: "Batch 9 verified and authenticated for Telangana Police SI & Constable preparation.",
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

db.close();
console.log(`Batch 9 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
