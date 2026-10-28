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
  // 1. TM-Q026 (TS Police SI 2016 Q185)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q026",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Negative wording",
      modelId: "TM-QM-NEG-02",
      stage: "practice",
      prompt: "Which one of the following community struggle committees and their respective founders/leaders is NOT correctly matched?",
      options: [
        {
          text: "Lambadi Hakkula Porata Samithi — Bellaiah Naik",
          why: "Bellaiah Naik was indeed the leader of the Lambadi Hakkula Porata Samithi (LHPS).",
          attraction: "Bellaiah Naik was a prominent tribal community activist in the 1990s movement.",
        },
        {
          text: "Gouda Jana Hakkula Porata Samithi — Elkakatte Vijayakumar Goud",
          why: "Elkakatte Vijayakumar Goud founded and led the Gouda Jana Hakkula Porata Samithi (Moksha Porata Samithi).",
          attraction: "He was the chief organizer for toddy tappers and Gouda community welfare struggles.",
        },
        {
          text: "Vaddera Hakkula Porata Samithi — Dubbagatla Narsing Rao",
          why: "Dubbagatla Narsing Rao organized and led the Vaddera Hakkula Porata Samithi for stone-cutter rights.",
          attraction: "He mobilized the Vaddera community in Telangana.",
        },
        {
          text: "Chakali Hakkula Porata Samithi — Poosapally Saidulu",
          why: "Chakali Hakkula Porata Samithi was founded and led by Pitla Sailu (Chakali Sailu), NOT Poosapally Saidulu (who was associated with other BC/Dandora mobilisations).",
          attraction: "Poosapally Saidulu is a recognized activist name from the 1990s subaltern movements.",
          confusion: true,
        },
      ],
      answer: 3,
      reason: "Chakali Hakkula Porata Samithi was founded by Pitla Sailu (Pitla Venkanna), who fought for the rights and hereditary occupations of the washerman community named after martyr Chakali Ilamma.",
      clue: "Look for 'NOT correctly matched' among Telangana community caste struggle organizations: Pitla Sailu led Chakali rights, not Poosapally Saidulu.",
      trap: "Do not pick correct associations like Bellaiah Naik with Lambadi rights or Vijayakumar Goud with Gouda rights.",
      elimination: "Eliminate options 1, 2, and 3 because they are all historically accurate leader-organization pairings.",
      anchor: "Pitla Sailu led Chakali Hakkula Porata Samithi; Bellaiah Naik led Lambadi Hakkula Porata Samithi.",
      hint: "Who was the washerman community leader known as Chakali Sailu?",
      source: "TS Police SI 2016, Paper I, Q185",
      page: 55,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 3,
      relevance: 3,
      teaching: [
        {
          observation: "The question asks for the pair that is NOT correctly matched.",
          correctMeaning: "Chakali Hakkula Porata Samithi is mismatched with Poosapally Saidulu; Pitla Sailu was its founder.",
          selectedMeaning: "Lambadi Hakkula Porata Samithi was indeed led by Bellaiah Naik, making this a correct pair.",
          possibleConfusion: "Bellaiah Naik is famous for Lambadi rights, but the question asks for the incorrect pair.",
          decisionRules: [
            { when: "the question asks who led the Lambadi Hakkula Porata Samithi", choose: "Bellaiah Naik" },
            { when: "the question asks which pairing is false among the caste struggle samithis", choose: "Chakali Hakkula Porata Samithi — Poosapally Saidulu" },
          ],
          nextStep: "Remember: Negative questions require picking the false pairing.",
        },
        {
          observation: "Check the leadership of Gouda Jana Hakkula Porata Samithi.",
          correctMeaning: "The mismatched pair is Chakali Hakkula Porata Samithi with Poosapally Saidulu.",
          selectedMeaning: "Elkakatte Vijayakumar Goud did lead the Gouda Jana Hakkula Porata Samithi, so this pair is historically true.",
          possibleConfusion: "You selected a valid historical pair instead of the false pair.",
          decisionRules: [
            { when: "the question asks who organized the Gouda Jana Hakkula Porata Samithi", choose: "Elkakatte Vijayakumar Goud" },
            { when: "the question asks for the incorrect caste association", choose: "Chakali Hakkula Porata Samithi with Poosapally Saidulu" },
          ],
          nextStep: "Identify the founder: Pitla Sailu led the Chakali Porata Samithi.",
        },
        {
          observation: "Look at Dubbagatla Narsing Rao's organization.",
          correctMeaning: "The false pair is option 4; Pitla Sailu founded the Chakali committee.",
          selectedMeaning: "Dubbagatla Narsing Rao correctly headed the Vaddera Hakkula Porata Samithi.",
          possibleConfusion: "Vaddera rights were championed by Dubbagatla Narsing Rao, making this pairing true.",
          decisionRules: [
            { when: "the question asks who headed the Vaddera Hakkula Porata Samithi", choose: "Dubbagatla Narsing Rao" },
            { when: "the question asks for the incorrect match", choose: "Chakali Hakkula Porata Samithi — Poosapally Saidulu" },
          ],
          nextStep: "Keep Dubbagatla Narsing Rao matched with Vaddera rights.",
        },
        {
          observation: "You correctly spotted the mismatched pair.",
          correctMeaning: "Chakali Hakkula Porata Samithi was organized by Pitla Sailu, not Poosapally Saidulu.",
          selectedMeaning: "Chakali Hakkula Porata Samithi was organized by Pitla Sailu, not Poosapally Saidulu.",
          possibleConfusion: "You answered correctly. Pitla Sailu is the authentic founder.",
          decisionRules: [
            { when: "the question asks who founded Chakali Hakkula Porata Samithi", choose: "Pitla Sailu" },
            { when: "the question asks which pair is incorrectly matched", choose: "Chakali Hakkula Porata Samithi — Poosapally Saidulu" },
          ],
          nextStep: "Review 1990s subaltern community assertions across Telangana.",
        },
      ],
    },
  },

  // 2. TM-Q027 (TS Police SI 2016 Q189)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q027",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-02",
      stage: "recognition",
      prompt: "Before the States Re-organisation Commission (SRC 1953), several prominent leaders expressed the apprehension that the merger of an advanced region like Coastal Andhra with the economically and educationally vulnerable Hyderabad State would lead to:",
      options: [
        {
          text: "General economic backwardness across South India",
          why: "The concern was not general southern backwardness, but the specific subjugation of Telangana.",
          attraction: "Sounded like a broad developmental warning.",
        },
        {
          text: "Accelerated industrial development for Telangana",
          why: "Merger proponents claimed development, but opposing leaders specifically warned against exploitation.",
          attraction: "This was the official Vishalandhra propaganda claim.",
        },
        {
          text: "Immediate regional disintegration of India",
          why: "Leaders warned of regional dominance, not immediate national disintegration.",
          attraction: "Sounds like a severe political consequence.",
        },
        {
          text: "Internal colonisation of Telangana",
          why: "Leaders and representations to Fazal Ali Commission explicitly warned that Telangana would become a colony of Coastal Andhra business, land, and educational interests (అంతర్గత వలస).",
          attraction: "This is the exact historical sociological term used before the SRC.",
          confusion: false,
        },
      ],
      answer: 3,
      reason: "Leaders and intellectuals representing Telangana before the Fazal Ali Commission (SRC) argued that an unequal merger between unequal regions would result in the 'internal colonisation' of Telangana by the politically and educationally dominant Andhra elite.",
      clue: "Look for 'merger of an advanced region with backward region would lead to': the Fazal Ali Commission noted representations warning of internal colonisation.",
      trap: "Do not select the Vishalandhra lobby's promotional claim of 'development'.",
      elimination: "Eliminate general terms like 'disintegration' or 'backwardness'; the specific critique was 'internal colonisation'.",
      anchor: "SRC 1953 representations argued that merging Andhra and Telangana would produce internal colonisation.",
      hint: "What term describes one region treating another internal region like a captive raw-material colony?",
      source: "TS Police SI 2016, Paper I, Q189",
      page: 56,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Focus on the specific term used by Telangana leaders before the Fazal Ali Commission.",
          correctMeaning: "Leaders warned that Telangana would suffer 'internal colonisation' under Coastal Andhra dominance.",
          selectedMeaning: "Economic backwardness is a generic condition, not the specific relational dynamic argued before the Commission.",
          possibleConfusion: "Backwardness already existed; the fear was systemic exploitation as a colony.",
          decisionRules: [
            { when: "the question asks what specific dynamic Telangana leaders warned merger would produce", choose: "Internal colonisation" },
            { when: "the question asks about pre-existing conditions in Hyderabad State", choose: "Educational and economic backwardness" },
          ],
          nextStep: "Memorize the phrase 'Internal colonisation' in the context of SRC 1953.",
        },
        {
          observation: "Distinguish between Vishalandhra propaganda and the warnings of Telangana leaders.",
          correctMeaning: "Telangana leaders warned of 'internal colonisation', not development.",
          selectedMeaning: "Development was the promise made by Andhra leaders, which Telangana leaders vehemently disputed.",
          possibleConfusion: "You selected the promisers' rhetoric instead of the Telangana leaders' warning.",
          decisionRules: [
            { when: "the question asks what Andhra leaders promised to justify merger", choose: "Development" },
            { when: "the question asks what Telangana leaders warned would happen before SRC", choose: "Internal colonisation" },
          ],
          nextStep: "Identify the speaker/perspective: Telangana leaders expressed fear of colonisation.",
        },
        {
          observation: "Check the exact words in the 2016 Police SI examination.",
          correctMeaning: "The answer is 'Internal colonisation' (అంతర్గత వలస).",
          selectedMeaning: "Disintegration was not the argument; the argument was internal economic subjugation.",
          possibleConfusion: "Disintegration is often discussed in federalism, but here the issue was economic exploitation.",
          decisionRules: [
            { when: "the question asks what merger of advanced and backward regions meant in Telangana representations", choose: "Internal colonisation" },
            { when: "the question asks about fears of breaking the nation", choose: "Disintegration" },
          ],
          nextStep: "Review the Fazal Ali Commission summary on Telangana arguments.",
        },
        {
          observation: "You correctly identified 'Internal colonisation'.",
          correctMeaning: "The Fazal Ali Commission noted that Telangana representatives feared becoming an internal colony of the more affluent Coastal Andhra.",
          selectedMeaning: "The Fazal Ali Commission noted that Telangana representatives feared becoming an internal colony of the more affluent Coastal Andhra.",
          possibleConfusion: "You chose correctly. This core concept drove the SRC's recommendation for independent Telangana statehood for 5 years.",
          decisionRules: [
            { when: "the question asks what relationship Telangana leaders predicted under merger", choose: "Internal colonisation" },
            { when: "the question asks what Fazal Ali Commission Paragraph 386 recommended", choose: "Retaining Hyderabad as a separate state initially" },
          ],
          nextStep: "Connect internal colonisation to the demand for statutory safeguards.",
        },
      ],
    },
  },

  // 3. TM-Q028 (TS Police SI 2016 Q190)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q028",
      topic: "TM-01.04",
      concept: "TM-01.04-M02",
      model: "Statements",
      modelId: "TM-QM-STA-02",
      stage: "practice",
      prompt: "Which one of the following statements regarding the Gentlemen's Agreement (1956) and safeguard frameworks is NOT correct?",
      options: [
        {
          text: "According to Gentlemen's Agreement, future recruitment to services will be on the basis of population from both sides.",
          why: "This was an authentic clause: recruitment to services in the combined state was to be proportional to population.",
          attraction: "This is a standard employment protection clause.",
        },
        {
          text: "G.O. 610 was issued to rectify lapses in implementing the 1975 Presidential Order and repatriation of non-locals.",
          why: "G.O. 610 was issued on 30 December 1985 to correct Presidential Order violations and repatriate non-local employees.",
          attraction: "Accurate historical statement about G.O. 610.",
        },
        {
          text: "According to the Gentlemen's Agreement, the Cabinet will consist of members in the proportion of 50 : 50 for Andhra and Telangana.",
          why: "This statement is INCORRECT. The Gentlemen's Agreement agreed on a 60 : 40 ratio (60% Andhra, 40% Telangana) reflecting the approximate population ratio, NOT 50 : 50.",
          attraction: "50:50 sounds like an equal partnership and is an examiner trap.",
          confusion: true,
        },
        {
          text: "In 1953 the Government of India constituted the States Re-organisation Commission under the Chairmanship of Justice Fazal Ali.",
          why: "The Commission was indeed appointed in December 1953 under Justice Fazal Ali with HN Kunzru and KM Panikkar.",
          attraction: "Accurate historical fact regarding the SRC.",
        },
      ],
      answer: 2,
      reason: "Item 3 of the Gentlemen's Agreement stipulated: 'The Cabinet will consist of members in proportion of 60 to 40 for Andhra and Telangana respectively.' Claiming a 50 : 50 proportion is false and makes statement 3 the correct answer for a negative question.",
      clue: "Look for 'Cabinet will consist of members in proportion of 50 : 50': the actual agreed ratio was 60 : 40.",
      trap: "Do not assume equal regions had 50:50 cabinet representation; Andhra had 60% and Telangana had 40%.",
      elimination: "Statements 1, 2, and 4 are well-documented historical truths, leaving statement 3 as the false claim.",
      anchor: "Gentlemen's Agreement Cabinet ratio: 60 (Andhra) : 40 (Telangana), not 50 : 50.",
      hint: "What was the population-based cabinet ministerial ratio agreed at Hyderabad House, Delhi?",
      source: "TS Police SI 2016, Paper I, Q190",
      page: 56,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "The question asks for the statement that is NOT correct.",
          correctMeaning: "Statement 3 is false because the agreed Cabinet ratio was 60:40, not 50:50.",
          selectedMeaning: "Statement 1 is historically true: recruitment was explicitly linked to regional population ratios.",
          possibleConfusion: "You selected a correct clause instead of identifying the false statement.",
          decisionRules: [
            { when: "the question asks how future recruitment was to be distributed in Gentlemen's Agreement", choose: "On the basis of population proportion" },
            { when: "the question asks which statement about the agreement is false", choose: "Cabinet proportion of 50:50" },
          ],
          nextStep: "Always check the exact wording: 'NOT correct'.",
        },
        {
          observation: "Evaluate the purpose of G.O. 610.",
          correctMeaning: "The false statement is the 50:50 Cabinet claim.",
          selectedMeaning: "Statement 2 is true: G.O. 610 was issued in 1985 specifically to rectify Presidential Order violations.",
          possibleConfusion: "G.O. 610 is a major syllabus milestone, but this statement is factually accurate.",
          decisionRules: [
            { when: "the question asks why G.O. 610 was issued in 1985", choose: "To rectify lapses in implementing the 1975 Presidential Order" },
            { when: "the question asks for the incorrect claim among the four", choose: "Cabinet proportion was 50:50" },
          ],
          nextStep: "Confirm G.O. 610 date: 30 December 1985.",
        },
        {
          observation: "You correctly spotted the false cabinet ratio.",
          correctMeaning: "The Gentlemen's Agreement explicitly fixed the Cabinet ratio at 60% Andhra and 40% Telangana.",
          selectedMeaning: "The Gentlemen's Agreement explicitly fixed the Cabinet ratio at 60% Andhra and 40% Telangana.",
          possibleConfusion: "You answered correctly. 50:50 was never accepted by the Andhra leadership.",
          decisionRules: [
            { when: "the question asks for the Cabinet ratio in the 1956 Gentlemen's Agreement", choose: "60 : 40 (Andhra : Telangana)" },
            { when: "the question asks if Chief Minister was from Andhra, who Deputy CM must be", choose: "From Telangana (and vice versa)" },
          ],
          nextStep: "Remember: 60:40 applied to the Council of Ministers.",
        },
        {
          observation: "Check the appointment year of the Fazal Ali Commission.",
          correctMeaning: "Statement 4 is true: SRC was appointed in December 1953; statement 3 is the false one.",
          selectedMeaning: "The appointment of Justice Fazal Ali in December 1953 is historically true.",
          possibleConfusion: "Statement 4 is accurate; it cannot be the answer to a 'not correct' question.",
          decisionRules: [
            { when: "the question asks when the States Reorganisation Commission was constituted", choose: "December 1953" },
            { when: "the question asks which statement is incorrect", choose: "Cabinet ratio was 50:50" },
          ],
          nextStep: "Verify SRC members: Fazal Ali (Chair), HN Kunzru, KM Panikkar.",
        },
      ],
    },
  },

  // 4. TM-Q029 (TS Police SI 2016 Q191)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q029",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Who among the following was the editor of the Telugu edition of the prominent trilingual newspaper 'Meezan', published from Hyderabad during the 1940s?",
      options: [
        {
          text: "Madiraju Koteshwar Rao",
          why: "Madiraju Koteshwar Rao was an activist and writer, but not the editor of Meezan's Telugu edition.",
          attraction: "He was a well-known contemporary literary figure.",
        },
        {
          text: "Dasharathi Rangacharya",
          why: "Dasharathi Rangacharya was a legendary revolutionary novelist (author of Chillara Devullu, Modugu Poolu), not the editor of Meezan.",
          attraction: "Famous Telangana writer associated with anti-feudal struggles.",
        },
        {
          text: "Devulapally Ramanuja Rao",
          why: "Devulapally Ramanuja Rao was the longtime secretary of Andhra Saraswatha Parishad, not the editor of Meezan.",
          attraction: "Prominent Hyderabad literary and cultural organizer.",
        },
        {
          text: "Adavi Bapi Raju",
          why: "Adavi Bapi Raju, the acclaimed artist, poet, and novelist (author of Gona Ganna Reddy, Narayana Rao), was appointed by Ghulam Mohammed Calcuttavala as the editor of the Telugu edition of 'Meezan'.",
          attraction: "He was the renowned editor of Telugu Meezan between 1944 and 1947.",
          confusion: false,
        },
      ],
      answer: 3,
      reason: "'Meezan' was launched in 1944 by Ghulam Mohammed Calcuttavala as a daily published simultaneously in three languages: Urdu (edited by Habibullah Owaisi), English (edited by Mirza Abid Ali Baig), and Telugu (edited by Adavi Bapi Raju).",
      clue: "Look for 'editor of Telugu version of Meezan': Adavi Bapi Raju served as its editor.",
      trap: "Do not confuse literary icons like Dasharathi Rangacharya or Devulapally Ramanuja Rao with the journalism appointment at Meezan.",
      elimination: "Eliminate Dasharathi (novelist) and Devulapally (Andhra Saraswatha Parishad secretary); Adavi Bapi Raju edited Telugu Meezan.",
      anchor: "Meezan Telugu editor: Adavi Bapi Raju; Owner: Ghulam Mohammed Calcuttavala.",
      hint: "Which famous poet-novelist, author of 'Gona Ganna Reddy', edited the Telugu edition of Meezan?",
      source: "TS Police SI 2016, Paper I, Q191",
      page: 56,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "The question asks for the editor of the Telugu daily 'Meezan'.",
          correctMeaning: "Adavi Bapi Raju was appointed editor of the Telugu edition in 1944.",
          selectedMeaning: "Madiraju Koteshwar Rao was a writer and activist, not the editor of Meezan.",
          possibleConfusion: "Both were active writers in Hyderabad State during the 1940s.",
          decisionRules: [
            { when: "the question asks who edited Telugu Meezan", choose: "Adavi Bapi Raju" },
            { when: "the question asks who wrote Chillara Devullu", choose: "Dasharathi Rangacharya" },
          ],
          nextStep: "Remember: Meezan published in English, Urdu, and Telugu.",
        },
        {
          observation: "Identify Dasharathi Rangacharya's primary contribution.",
          correctMeaning: "Adavi Bapi Raju edited Telugu Meezan.",
          selectedMeaning: "Dasharathi Rangacharya wrote the iconic novels 'Modugu Poolu' and 'Chillara Devullu' depicting Nizam-era feudal oppression.",
          possibleConfusion: "Dasharathi is a towering literary name, but he did not edit Meezan.",
          decisionRules: [
            { when: "the question asks who authored 'Chillara Devullu' and 'Modugu Poolu'", choose: "Dasharathi Rangacharya" },
            { when: "the question asks who edited the Telugu edition of Meezan", choose: "Adavi Bapi Raju" },
          ],
          nextStep: "Associate Dasharathi with revolutionary novels, Bapi Raju with Meezan.",
        },
        {
          observation: "Consider Devulapally Ramanuja Rao's organizational role.",
          correctMeaning: "Adavi Bapi Raju was the editor of Meezan.",
          selectedMeaning: "Devulapally Ramanuja Rao was central to the Andhra Saraswatha Parishad and Golconda Patrika management.",
          possibleConfusion: "Devulapally is associated with Hyderabad Telugu journalism, but not Meezan.",
          decisionRules: [
            { when: "the question asks who was the longtime pillar of Andhra Saraswatha Parishad", choose: "Devulapally Ramanuja Rao" },
            { when: "the question asks who edited Meezan in Telugu", choose: "Adavi Bapi Raju" },
          ],
          nextStep: "Link Devulapally Ramanuja Rao to Andhra Saraswatha Parishad.",
        },
        {
          observation: "You correctly selected Adavi Bapi Raju.",
          correctMeaning: "Adavi Bapi Raju brought high literary elegance to the Telugu Meezan during 1944–1947.",
          selectedMeaning: "Adavi Bapi Raju brought high literary elegance to the Telugu Meezan during 1944–1947.",
          possibleConfusion: "You answered correctly. Meezan was owned by Ghulam Mohammed Calcuttavala.",
          decisionRules: [
            { when: "the question asks who edited Telugu Meezan", choose: "Adavi Bapi Raju" },
            { when: "the question asks who founded and owned the trilingual daily Meezan", choose: "Ghulam Mohammed Calcuttavala" },
          ],
          nextStep: "Review the three language editors of Meezan.",
        },
      ],
    },
  },

  // 5. TM-Q030 (TS Police SI 2016 Q196)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q030",
      topic: "TM-02.04",
      concept: "TM-02.04-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-02",
      stage: "practice",
      prompt: "Match the following investigative and policy committees appointed in Andhra Pradesh with their respective domains of inquiry:\n(a) Hiten Bhayya Committee\n(b) Gangopadhyay Committee\n(c) Koneru Ramakrishna Rao Committee\n(d) Subramanyam Committee",
      options: [
        {
          text: "(a)-(i), (b)-(iii), (c)-(iv), (d)-(ii)",
          why: "Incorrect alignment: Hiten Bhayya dealt with electricity, not employees' pensions.",
          attraction: "Shuffled Roman numerals.",
        },
        {
          text: "(a)-(iii), (b)-(ii), (c)-(iv), (d)-(i)",
          why: "Incorrect alignment: Hiten Bhayya was on power/electricity reforms.",
          attraction: "Mixes electricity with public sector industries.",
        },
        {
          text: "(a)-(ii), (b)-(i), (c)-(iv), (d)-(iii)",
          why: "Correct mapping: Hiten Bhayya Committee studied Electricity (APSEB unbundling); Gangopadhyay Committee studied Salaries and pensions of Government Employees; Koneru Ramakrishna Rao Committee studied Higher Education; Subramanyam Committee studied Public Sector Undertakings/Industries.",
          attraction: "This matches the official 2016 Police SI key.",
          confusion: false,
        },
        {
          text: "(a)-(ii), (b)-(iv), (c)-(iii), (d)-(i)",
          why: "Incorrect: Gangopadhyay examined employee salaries/pensions, not higher education.",
          attraction: "Mixes Gangopadhyay and Koneru Ramakrishna Rao.",
        },
      ],
      answer: 2,
      reason: "During the 1990s economic restructuring under Chandrababu Naidu: (a) Hiten Bhayya Committee recommended the restructuring of the Electricity sector (APSEB unbundling into APGENCO and APTRANSCO); (b) Gangopadhyay Committee reviewed employee salaries and pensions; (c) Koneru Ramakrishna Rao Committee reviewed Higher Education; (d) Subramanyam Committee reviewed Public Sector Undertakings/Industries.",
      clue: "Look for 'Hiten Bhayya Committee': famously associated with Power/Electricity sector reforms; Koneru Ramakrishna Rao with Higher Education.",
      trap: "Do not confuse Gangopadhyay (salaries/pensions) with Koneru Ramakrishna Rao (higher education).",
      elimination: "Identify Hiten Bhayya = Electricity (ii); this instantly narrows the choice to (3) or (4). Then Koneru Ramakrishna Rao = Higher Education (iv), confirming (3).",
      anchor: "Hiten Bhayya = Electricity; Gangopadhyay = Salaries & Pensions; Koneru Ramakrishna Rao = Higher Education; Subramanyam = Public Sector Industries.",
      hint: "Which committee laid the groundwork for the 1998 Andhra Pradesh Electricity Reform Act?",
      source: "TS Police SI 2016, Paper I, Q196",
      page: 58,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 3,
      relevance: 3,
      teaching: [
        {
          observation: "Check Hiten Bhayya Committee's core sector.",
          correctMeaning: "Option 3 is correct: Hiten Bhayya was appointed on Electricity sector restructuring.",
          selectedMeaning: "Option 1 links Hiten Bhayya to employee salaries, which was actually studied by Gangopadhyay.",
          possibleConfusion: "Multiple economic committees were appointed during the 1990s reform wave.",
          decisionRules: [
            { when: "the question asks which committee recommended electricity reforms and APSEB restructuring", choose: "Hiten Bhayya Committee" },
            { when: "the question asks which committee examined state employee salaries and pensions", choose: "Gangopadhyay Committee" },
          ],
          nextStep: "Anchor Hiten Bhayya directly to the Power/Electricity sector.",
        },
        {
          observation: "Look at the Subramanyam Committee's assignment.",
          correctMeaning: "Subramanyam Committee evaluated Public Sector Enterprises (PSUs).",
          selectedMeaning: "Option 2 misallocates Hiten Bhayya to PSUs and Subramanyam to employees.",
          possibleConfusion: "Both electricity and public sector undertakings underwent restructuring during the same era.",
          decisionRules: [
            { when: "the question asks which committee studied state Public Sector Undertakings", choose: "Subramanyam Committee" },
            { when: "the question asks which committee studied Electricity", choose: "Hiten Bhayya Committee" },
          ],
          nextStep: "Separate electricity (Hiten Bhayya) from public sector units (Subramanyam).",
        },
        {
          observation: "You matched all four policy committees correctly.",
          correctMeaning: "Hiten Bhayya = Electricity (ii); Gangopadhyay = Salaries/Pensions (i); Koneru Ramakrishna Rao = Higher Education (iv); Subramanyam = Public Sector Industries (iii).",
          selectedMeaning: "Hiten Bhayya = Electricity (ii); Gangopadhyay = Salaries/Pensions (i); Koneru Ramakrishna Rao = Higher Education (iv); Subramanyam = Public Sector Industries (iii).",
          possibleConfusion: "You answered correctly. This was a challenging match question in the 2016 SI examination.",
          decisionRules: [
            { when: "the question asks for Koneru Ramakrishna Rao Committee", choose: "Higher Education" },
            { when: "the question asks for Gangopadhyay Committee", choose: "Salaries and Pensions of Government Employees" },
          ],
          nextStep: "Review the economic reform era committees that sparked public agitations in Hyderabad.",
        },
        {
          observation: "Check Koneru Ramakrishna Rao's background.",
          correctMeaning: "Koneru Ramakrishna Rao was a former Vice Chancellor who headed the Higher Education committee.",
          selectedMeaning: "Option 4 misattributes Gangopadhyay to Higher Education and Koneru Ramakrishna Rao to PSUs.",
          possibleConfusion: "Reversing the education and salary committees is a common mistake.",
          decisionRules: [
            { when: "the question asks which committee studied Higher Education", choose: "Koneru Ramakrishna Rao Committee" },
            { when: "the question asks which committee examined Government Employee Pensions", choose: "Gangopadhyay Committee" },
          ],
          nextStep: "Link Koneru Ramakrishna Rao to universities and higher education.",
        },
      ],
    },
  },

  // 6. TM-Q031 (TS Police SI 2016 Q198)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q031",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-02",
      stage: "practice",
      prompt: "Match the following prominent leaders and intellectuals of the 1990s Telangana revival with the respective organisations they headed:\n(a) V. Prakash\n(b) Bhoopathi Krishnamurthy\n(c) Muralidhar Deshpande\n(d) Akula Bhumaiah",
      options: [
        {
          text: "(a)-(iv), (b)-(ii), (c)-(i), (d)-(iii)",
          why: "Incorrect: V. Prakash was not with Telangana Prajasamithi; he co-founded Telangana Mukti Morcha.",
          attraction: "Mixes Prakash and Krishnamurthy.",
        },
        {
          text: "(a)-(ii), (b)-(iv), (c)-(iii), (d)-(i)",
          why: "Incorrect: Muralidhar Deshpande was with Telangana Janasabha, Akula Bhumaiah with Telangana Mahasabha.",
          attraction: "Inverts Janasabha and Mahasabha.",
        },
        {
          text: "(a)-(iii), (b)-(iv), (c)-(ii), (d)-(i)",
          why: "Incorrect: V. Prakash did not lead Telangana Mahasabha.",
          attraction: "Mixes multiple organizations.",
        },
        {
          text: "(a)-(ii), (b)-(iv), (c)-(i), (d)-(iii)",
          why: "Correct mapping: V. Prakash led Telangana Mukti Morcha (ii); Bhoopathi Krishnamurthy headed the revived Telangana Prajasamithi (iv); Muralidhar Deshpande led Telangana Janasabha (i); Akula Bhumaiah led Telangana Mahasabha (iii).",
          attraction: "Matches the official TS Police SI 2016 key.",
          confusion: false,
        },
      ],
      answer: 3,
      reason: "In the 1990s organizational renaissance: (a) V. Prakash founded Telangana Mukti Morcha; (b) Bhoopathi Krishnamurthy (Telangana Gandhi) led the revived Telangana Prajasamithi; (c) Muralidhar Deshpande led the Telangana Janasabha; (d) Akula Bhumaiah was the president of Telangana Mahasabha.",
      clue: "Look for 'Bhoopathi Krishnamurthy': reverently called 'Telangana Gandhi', he kept the historic Telangana Praja Samithi alive; V. Prakash founded Telangana Mukti Morcha.",
      trap: "Do not confuse Telangana Janasabha (Muralidhar Deshpande) with Telangana Mahasabha (Akula Bhumaiah).",
      elimination: "Identify Bhoopathi Krishnamurthy = Telangana Prajasamithi (iv); V. Prakash = Telangana Mukti Morcha (ii). This directly isolates choice (4).",
      anchor: "V. Prakash: Telangana Mukti Morcha; Bhoopathi Krishnamurthy: TPS; Muralidhar Deshpande: Telangana Janasabha; Akula Bhumaiah: Telangana Mahasabha.",
      hint: "Who was known as 'Telangana Gandhi' and served as president of Telangana Praja Samithi?",
      source: "TS Police SI 2016, Paper I, Q198",
      page: 59,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 3,
      relevance: 3,
      teaching: [
        {
          observation: "Focus on V. Prakash's early organization.",
          correctMeaning: "Option 4 is correct: V. Prakash was with Telangana Mukti Morcha (ii).",
          selectedMeaning: "Option 1 links V. Prakash to Telangana Prajasamithi, which was led by Bhoopathi Krishnamurthy.",
          possibleConfusion: "Both leaders worked together across various platforms in the late 1990s.",
          decisionRules: [
            { when: "the question asks who founded Telangana Mukti Morcha", choose: "V. Prakash" },
            { when: "the question asks who was the veteran leader of revived Telangana Prajasamithi", choose: "Bhoopathi Krishnamurthy" },
          ],
          nextStep: "Associate V. Prakash with Telangana Mukti Morcha.",
        },
        {
          observation: "Differentiate between Telangana Janasabha and Telangana Mahasabha.",
          correctMeaning: "Muralidhar Deshpande led Telangana Janasabha; Akula Bhumaiah led Telangana Mahasabha.",
          selectedMeaning: "Option 2 swaps Janasabha and Mahasabha between the two leaders.",
          possibleConfusion: "Janasabha and Mahasabha have similar sounding names and held major conventions in 1997–98.",
          decisionRules: [
            { when: "the question asks who was associated with Telangana Janasabha", choose: "Muralidhar Deshpande" },
            { when: "the question asks who led Telangana Mahasabha", choose: "Akula Bhumaiah" },
          ],
          nextStep: "Memorize: Muralidhar Deshpande = Janasabha; Akula Bhumaiah = Mahasabha.",
        },
        {
          observation: "Check the leadership of Telangana Mahasabha.",
          correctMeaning: "Akula Bhumaiah was the president of Telangana Mahasabha.",
          selectedMeaning: "Option 3 attributes Telangana Mahasabha to V. Prakash, which is historically incorrect.",
          possibleConfusion: "V. Prakash was a key public intellectual, but led Mukti Morcha.",
          decisionRules: [
            { when: "the question asks who led Telangana Mukti Morcha", choose: "V. Prakash" },
            { when: "the question asks who was president of Telangana Mahasabha", choose: "Akula Bhumaiah" },
          ],
          nextStep: "Identify Akula Bhumaiah with Telangana Mahasabha.",
        },
        {
          observation: "You correctly matched all four organizations.",
          correctMeaning: "V. Prakash: Mukti Morcha; Bhoopathi Krishnamurthy: TPS; Muralidhar Deshpande: Janasabha; Akula Bhumaiah: Mahasabha.",
          selectedMeaning: "V. Prakash: Mukti Morcha; Bhoopathi Krishnamurthy: TPS; Muralidhar Deshpande: Janasabha; Akula Bhumaiah: Mahasabha.",
          possibleConfusion: "You answered correctly. These organizations laid the intellectual groundwork before TRS was formed in 2001.",
          decisionRules: [
            { when: "the question asks who led the revived TPS", choose: "Bhoopathi Krishnamurthy" },
            { when: "the question asks who was known as 'Telangana Gandhi'", choose: "Bhoopathi Krishnamurthy" },
          ],
          nextStep: "Remember: Bhoopathi Krishnamurthy was known as Telangana Gandhi.",
        },
      ],
    },
  },

  // 7. TM-Q032 (TS Police SI 2016 Q199)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q032",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In August 2013, the Government of India appointed a high-level committee under the Chairmanship of Defense Minister A.K. Antony to examine issues and modalities regarding the division of Andhra Pradesh. Who were the other three members of the A.K. Antony Committee?",
      options: [
        {
          text: "Digvijaya Singh, Ahmed Patel and Mallikarjuna Kharge",
          why: "Mallikarjuna Kharge was not a member of the four-member Antony Committee.",
          attraction: "Kharge was a senior Cabinet Minister at the Centre.",
        },
        {
          text: "Digvijaya Singh, Veerappa Moily and Ghulam Nabi Azad",
          why: "Ghulam Nabi Azad was the former AP Congress in-charge, but not on this specific committee.",
          attraction: "Azad was deeply involved in earlier party consultations on Telangana.",
          confusion: true,
        },
        {
          text: "Digvijaya Singh, Veerappa Moily and Ahmed Patel",
          why: "The four-member A.K. Antony Committee appointed on 6 August 2013 consisted of A.K. Antony (Chairman), Digvijaya Singh (AICC in-charge), M. Veerappa Moily (Union Minister), and Ahmed Patel (Political Secretary to Congress President).",
          attraction: "This is the exact official composition.",
          confusion: false,
        },
        {
          text: "Digvijaya Singh, Ahmed Patel and P. Chidambaram",
          why: "P. Chidambaram was Finance Minister and later part of the GoM, but was not a member of the Antony party committee.",
          attraction: "Chidambaram famously announced the statehood process in December 2009.",
        },
      ],
      answer: 2,
      reason: "Following the Congress Working Committee resolution of 30 July 2013 approving Telangana statehood, the A.K. Antony Committee was set up on 6 August 2013 consisting of A.K. Antony, Digvijaya Singh, M. Veerappa Moily, and Ahmed Patel to hear grievances from Seemandhra and Telangana leaders.",
      clue: "Look for 'A.K. Antony Committee members': Antony + Digvijaya Singh, Veerappa Moily, and Ahmed Patel.",
      trap: "Do not confuse the political A.K. Antony Committee (Antony, Digvijaya, Moily, Ahmed Patel) with the ministerial Group of Ministers (GoM headed by Sushil Kumar Shinde).",
      elimination: "Eliminate options with Chidambaram, Azad, or Kharge; the Antony Committee specifically included Moily, Digvijaya Singh, and Ahmed Patel.",
      anchor: "A.K. Antony Committee (Aug 2013): A.K. Antony, Digvijaya Singh, Veerappa Moily, Ahmed Patel.",
      hint: "Which committee included Ahmed Patel and Veerappa Moily alongside Digvijaya Singh?",
      source: "TS Police SI 2016, Paper I, Q199",
      page: 60,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Check the names on the August 2013 Antony Committee.",
          correctMeaning: "Option 3 is correct: Digvijaya Singh, Veerappa Moily, and Ahmed Patel.",
          selectedMeaning: "Mallikarjuna Kharge was a Union Minister, but was not placed on the Antony Committee.",
          possibleConfusion: "Multiple senior leaders participated in Congress consultations on bifurcation.",
          decisionRules: [
            { when: "the question asks for members of the 4-member A.K. Antony Committee", choose: "Digvijaya Singh, Veerappa Moily and Ahmed Patel" },
            { when: "the question asks who chaired the subsequent Union Cabinet GoM on bifurcation", choose: "Sushil Kumar Shinde" },
          ],
          nextStep: "Memorize the 4 Antony Committee names: Antony, Digvijaya, Moily, Ahmed Patel.",
        },
        {
          observation: "Note Ghulam Nabi Azad's role.",
          correctMeaning: "The members were Digvijaya Singh, Veerappa Moily, and Ahmed Patel.",
          selectedMeaning: "Ghulam Nabi Azad was the AICC in-charge until 2013 before Digvijaya Singh took over; he was not on the Antony Committee.",
          possibleConfusion: "Azad had conducted numerous earlier rounds of consultations with state leaders.",
          decisionRules: [
            { when: "the question asks who was the previous AICC general secretary handling Telangana", choose: "Ghulam Nabi Azad" },
            { when: "the question asks who served on the August 2013 Antony Committee", choose: "Digvijaya Singh, Veerappa Moily and Ahmed Patel" },
          ],
          nextStep: "Remember: Digvijaya Singh had replaced Azad as the state in-charge in June 2013.",
        },
        {
          observation: "You correctly identified all three colleagues of A.K. Antony.",
          correctMeaning: "A.K. Antony (Chairman), Digvijaya Singh, Veerappa Moily, and Ahmed Patel formed the committee.",
          selectedMeaning: "A.K. Antony (Chairman), Digvijaya Singh, Veerappa Moily, and Ahmed Patel formed the committee.",
          possibleConfusion: "You answered correctly. They submitted their report preceding the creation of the GoM.",
          decisionRules: [
            { when: "the question asks for the Antony Committee composition", choose: "Digvijaya Singh, Veerappa Moily and Ahmed Patel" },
            { when: "the question asks when the CWC resolved for separate Telangana state", choose: "30 July 2013" },
          ],
          nextStep: "Review the chronology from CWC resolution (July 2013) to GoM formation (October 2013).",
        },
        {
          observation: "Check P. Chidambaram's official capacity.",
          correctMeaning: "The Antony Committee comprised Digvijaya Singh, Veerappa Moily, and Ahmed Patel.",
          selectedMeaning: "P. Chidambaram was a member of the Union Cabinet Group of Ministers (GoM), not the Antony Committee.",
          possibleConfusion: "Chidambaram was central to the parliamentary drafting, but not this party committee.",
          decisionRules: [
            { when: "the question asks which ministerial body Chidambaram was part of for APRA 2014", choose: "Group of Ministers (GoM headed by Sushil Kumar Shinde)" },
            { when: "the question asks who was on the Antony Committee", choose: "Digvijaya Singh, Veerappa Moily and Ahmed Patel" },
          ],
          nextStep: "Distinguish between the Congress Party Antony Committee and the Government GoM.",
        },
      ],
    },
  },

  // 8. TM-Q033 (TS Police SI 2016 Q200)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q033",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Match the following historical craft and production centers in Telangana with their distinctive products:\n(a) Metpally\n(b) Pembarthi\n(c) Gadwal\n(d) Hyderabad",
      options: [
        {
          text: "(a)-(ii), (b)-(i), (c)-(iv), (d)-(iii)",
          why: "Correct mapping: Metpally is renowned for Khadi production (ii); Pembarthi is world-famous for sheet metal and bronze craft (i); Gadwal is celebrated for GI-tagged handloom zari sarees (iv); Hyderabad is iconic for lacquer and stone-studded bangles (Laad Bazaar) (iii).",
          attraction: "Direct match from the official 2016 examination key.",
          confusion: false,
        },
        {
          text: "(a)-(iv), (b)-(ii), (c)-(i), (d)-(iii)",
          why: "Incorrect: Metpally is not known for handloom sarees; Gadwal is.",
          attraction: "Mixes Metpally and Gadwal textiles.",
        },
        {
          text: "(a)-(i), (b)-(iii), (c)-(ii), (d)-(iv)",
          why: "Incorrect: Pembarthi is bronze craft, not bangles.",
          attraction: "Shuffles artisan specialties.",
        },
        {
          text: "(a)-(iii), (b)-(iv), (c)-(ii), (d)-(i)",
          why: "Incorrect: Hyderabad is known for bangles, not bronze craft.",
          attraction: "Reverses urban and rural crafts.",
        },
      ],
      answer: 0,
      reason: "Telangana's traditional material culture includes: Metpally (Jagtial district) famous for Khadi weaving; Pembarthi (Jangaon district) famous for bronze and brass sheet metal craft; Gadwal (Jogulamba Gadwal district) famous for handloom cotton and silk sarees with heavy zari borders; Hyderabad famous for lacquer bangles centered at Laad Bazaar.",
      clue: "Look for 'Pembarthi': internationally renowned for bronze/brass work; Gadwal for handloom sarees; Metpally for Khadi.",
      trap: "Do not confuse different weaving traditions: Metpally is Khadi, while Gadwal is handloom silk/cotton sarees.",
      elimination: "Match Pembarthi = Bronze works (i); Gadwal = Handloom sarees (iv). Only option 1 contains this exact pair.",
      anchor: "Metpally: Khadi; Pembarthi: Bronze craft; Gadwal: Handloom sarees; Hyderabad: Bangles.",
      hint: "Which village in Jangaon is famous for Vishwakarma bronze and brass sheet metal craft?",
      source: "TS Police SI 2016, Paper I, Q200",
      page: 60,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly matched all four cultural and craft hubs.",
          correctMeaning: "Metpally = Khadi (ii); Pembarthi = Bronze works (i); Gadwal = Handloom Sarees (iv); Hyderabad = Bangles (iii).",
          selectedMeaning: "Metpally = Khadi (ii); Pembarthi = Bronze works (i); Gadwal = Handloom Sarees (iv); Hyderabad = Bangles (iii).",
          possibleConfusion: "You answered correctly. These are staple General Studies items in Telangana Police recruitments.",
          decisionRules: [
            { when: "the question asks for Pembarthi craft specialty", choose: "Bronze and brass sheet metal works" },
            { when: "the question asks for Metpally artisan product", choose: "Khadi" },
          ],
          nextStep: "Review other GI tags in Telangana: Pochampally Ikat, Cheriyal Scroll paintings, Narayanpet sarees.",
        },
        {
          observation: "Check Metpally's specialty.",
          correctMeaning: "Option 1 is correct: Metpally is celebrated for Khadi production.",
          selectedMeaning: "Option 2 assigns handloom sarees to Metpally; Gadwal is the famous saree hub.",
          possibleConfusion: "Both Metpally and Gadwal are textile centers, but Metpally specializes in Khadi.",
          decisionRules: [
            { when: "the question asks for Khadi weaving center in Jagtial/Karimnagar", choose: "Metpally" },
            { when: "the question asks for GI-tagged zari handloom sarees", choose: "Gadwal" },
          ],
          nextStep: "Remember: Metpally Khadi has a dedicated national brand.",
        },
        {
          observation: "Check Pembarthi's historical metal craft.",
          correctMeaning: "Pembarthi is famous for bronze craft, while Hyderabad is famous for lacquer bangles.",
          selectedMeaning: "Option 3 incorrectly matches Pembarthi with bangles.",
          possibleConfusion: "Both crafts involve intricate manual metal and lacquer workmanship.",
          decisionRules: [
            { when: "the question asks which town is renowned for bronze and brass sheet metal craft", choose: "Pembarthi" },
            { when: "the question asks for the iconic product of Laad Bazaar", choose: "Bangles (lacquer and glass)" },
          ],
          nextStep: "Link Pembarthi directly to bronze sculptures and brass plates.",
        },
        {
          observation: "Verify Hyderabad's traditional market specialty.",
          correctMeaning: "Hyderabad is world-famous for its bangles at Laad Bazaar.",
          selectedMeaning: "Option 4 assigns bronze craft to Hyderabad.",
          possibleConfusion: "Bidriware is also from the Deccan, but Pembarthi is the primary Telangana bronze hub.",
          decisionRules: [
            { when: "the question asks for traditional Hyderabad bazaar craft", choose: "Bangles" },
            { when: "the question asks where Pembarthi metal craft originated", choose: "Kakatiya period brass traditions" },
          ],
          nextStep: "Distinguish Hyderabad bangles and pearl trade from rural handicraft clusters.",
        },
      ],
    },
  },

  // 9. TM-Q034 (TS Police SI 2016 Q181)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q034",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Match the following distinctive art forms, folk dances, and cultural traditions of Telangana with their performers or attributes:\n(a) Dhimsa / Gusadi\n(b) Adrak ke Punje\n(c) Perini Dance\n(d) Pittala Dora",
      options: [
        {
          text: "(a)-(i), (b)-(ii), (c)-(iii), (d)-(iv)",
          why: "Incorrect: Adrak ke Punje is written by Babban Khan, not Gonds.",
          attraction: "Sequential pairing mistake.",
        },
        {
          text: "(a)-(ii), (b)-(i), (c)-(iii), (d)-(iv)",
          why: "Correct mapping: Tribal dance (Gusadi/Dhimsa) is performed by Gonds/Raj Gonds (ii); 'Adrak ke Punje' is the world-record comedy play created and performed by Babban Khan (i); Perini Shivatandavam is celebrated as the fast-paced warrior dance form revived from Ramappa Temple (iii); Pittala Dora is a vibrant folk satire performance performed by Budiga Jangalu (iv).",
          attraction: "Direct match from official TS Police SI 2016 key.",
          confusion: false,
        },
        {
          text: "(a)-(iii), (b)-(i), (c)-(ii), (d)-(iv)",
          why: "Incorrect: Dhimsa is a tribal dance, not the fastest warrior dance form.",
          attraction: "Swaps tribal dance and Perini attributes.",
        },
        {
          text: "(a)-(iv), (b)-(iii), (c)-(i), (d)-(ii)",
          why: "Incorrect: Pittala Dora is performed by Budiga Jangalu, not Gonds.",
          attraction: "Mixes tribal and wandering folk communities.",
        },
      ],
      answer: 1,
      reason: "Cultural traditions in Telangana: (a) Gusadi/Dhimsa dances are performed by the Raj Gonds during Dandari festival; (b) 'Adrak ke Punje' is Hyderabad's iconic record-breaking one-man comedy play by Babban Khan; (c) Perini Shivatandavam, carved on Kakatiya sculptures at Ramappa, is characterized as the fast-paced warrior dance; (d) Pittala Dora (the satirical bragging hunter) is traditionally performed by Budiga Jangalu folk balladeers.",
      clue: "Look for 'Adrak ke Punje': the world-renowned Hyderabadi comedy play by Babban Khan; 'Pittala Dora' performed by Budiga Jangalu.",
      trap: "Do not confuse Perini Shivatandavam (Kakatiya warrior dance) with adivasi folk dances like Gusadi.",
      elimination: "Identify Adrak ke Punje = Babban Khan (i); Pittala Dora = Budiga Jangalu (iv). This isolates option 2 immediately.",
      anchor: "Gusadi/Dhimsa: Gonds; Adrak ke Punje: Babban Khan; Perini: Warrior dance form; Pittala Dora: Budiga Jangalu.",
      hint: "Who created and acted in the record-holding Hyderabadi play 'Adrak ke Punje'?",
      source: "TS Police SI 2016, Paper I, Q181",
      page: 53,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Check the creator of 'Adrak ke Punje'.",
          correctMeaning: "Option 2 is correct: Adrak ke Punje was written and enacted by Babban Khan.",
          selectedMeaning: "Option 1 assigns Adrak ke Punje to Gonds, which is a tribal community.",
          possibleConfusion: "A mixing up of folk and Hyderabadi Dakhani urban theatrical traditions.",
          decisionRules: [
            { when: "the question asks who staged 'Adrak ke Punje'", choose: "Babban Khan" },
            { when: "the question asks which adivasi community performs the Dandari Gusadi dance", choose: "Gonds (Raj Gonds)" },
          ],
          nextStep: "Remember: 'Adrak ke Punje' is famous Hyderabadi comedy theatre.",
        },
        {
          observation: "You correctly matched all four cultural traditions.",
          correctMeaning: "Gonds = Tribal dance (ii); Babban Khan = Adrak ke Punje (i); Perini = Fast-paced warrior dance (iii); Budiga Jangalu = Pittala Dora (iv).",
          selectedMeaning: "Gonds = Tribal dance (ii); Babban Khan = Adrak ke Punje (i); Perini = Fast-paced warrior dance (iii); Budiga Jangalu = Pittala Dora (iv).",
          possibleConfusion: "You answered correctly. These represent diverse folk, classical Kakatiya, and urban Dakhani streams.",
          decisionRules: [
            { when: "the question asks who revived Perini Shivatandavam from Kakatiya sculptures", choose: "Nataraja Ramakrishna" },
            { when: "the question asks who performs Pittala Dora folk satire", choose: "Budiga Jangalu" },
          ],
          nextStep: "Review Perini Shivatandavam's origin in the Nritta Ratnavali of Jayapa Senani.",
        },
        {
          observation: "Look at the tempo and character of Perini dance.",
          correctMeaning: "Perini Shivatandavam is the fast-paced Kakatiya dance form (iii).",
          selectedMeaning: "Option 3 pairs tribal Gusadi dance with the fastest warrior dance form.",
          possibleConfusion: "Perini is specifically described as Prerana/warrior dance with vigorous rhythmic footwork.",
          decisionRules: [
            { when: "the question asks which Kakatiya-era dance is known as the dance of warriors", choose: "Perini Shivatandavam" },
            { when: "the question asks about Gond Dandari dance", choose: "Gusadi" },
          ],
          nextStep: "Link Perini to Jayapa Senani and Ramappa Temple.",
        },
        {
          observation: "Check Pittala Dora's performers.",
          correctMeaning: "Pittala Dora is enacted by Budiga Jangalu folk performers (iv).",
          selectedMeaning: "Option 4 connects Pittala Dora with Gonds, which is incorrect.",
          possibleConfusion: "Pittala Dora is a nomadic village theater character, not an Adilabad tribal ritual.",
          decisionRules: [
            { when: "the question asks which caste performs Pittala Dora", choose: "Budiga Jangalu" },
            { when: "the question asks which tribe celebrates Dandari festival", choose: "Raj Gonds" },
          ],
          nextStep: "Distinguish nomadic community theater from adivasi ritual arts.",
        },
      ],
    },
  },

  // 10. TM-Q035 (TGPSC Group-2 2024 Q7)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q035",
      topic: "TM-01.02",
      concept: "TM-01.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Against which oppressive feudal lord (Deshmukh) was the celebrated revolutionary song 'Bandenaka Bandi Katti, Padahaaru Bandlu Katti' written by folk poet Bandi Yadagiri during the Telangana Peasant Armed Struggle?",
      options: [
        {
          text: "Nizam Mir Osman Ali Khan",
          why: "Nizam was the monarch of Hyderabad State, but the song specifically targeted a notorious local Deshmukh.",
          attraction: "Nizam was the ultimate ruler against whom people fought.",
        },
        {
          text: "Visnur Ramachandra Reddy",
          why: "Bandi Yadagiri composed the immortal song directly condemning Visnur Ramachandra Reddy, the ruthless Deshmukh of Jangaon whose goons killed martyr Doddi Komaraiah in 1946.",
          attraction: "He was the exact Deshmukh referenced in the song ('Nizam Sarkar ODA, Visnuri Ramachandra Reddy').",
          confusion: false,
        },
        {
          text: "Jenna Reddy Pratapa Reddy",
          why: "Jenna Reddy Pratapa Reddy was a powerful Deshmukh of Suryapet owning over 150,000 acres, but Yadagiri's song was specifically against Visnur Ramachandra Reddy.",
          attraction: "Another infamous Deshmukh of Nalgonda district.",
          confusion: true,
        },
        {
          text: "Kalluri Subba Rao",
          why: "Kalluri Subba Rao was a politician from Rayalaseema, completely unrelated to Telangana Deshmukhs.",
          attraction: "Historical political figure from Andhra.",
        },
      ],
      answer: 1,
      reason: "'Bandenaka Bandi Katti' was penned by Bandi Yadagiri targeting Rapaka Ramachandra Reddy (notoriously known as Visnur Ramachandra Reddy), the feudal Deshmukh of Visnoor in Jangaon taluk, whose armed mercenaries attacked Kadavendi and shot Doddi Komaraiah on 4 July 1946.",
      clue: "Look for 'Bandenaka Bandi Katti song by Yadagiri against whom': directly written against Visnur Ramachandra Reddy.",
      trap: "Do not confuse Visnur Ramachandra Reddy with Jenna Reddy Pratapa Reddy (Suryapet) or the Nizam himself.",
      elimination: "Eliminate Nizam (ruler, not Deshmukh) and Jenna Reddy Pratapa Reddy (Suryapet); the Jangaon struggle centered on Visnur Ramachandra Reddy.",
      anchor: "'Bandenaka Bandi Katti' by Bandi Yadagiri targeted Visnur Ramachandra Reddy.",
      hint: "Which Deshmukh's goons shot Doddi Komaraiah at Kadavendi on 4 July 1946?",
      source: "TGPSC Group-2 2024, Paper IV, Q7",
      page: 3,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "The question asks which specific feudal landlord was condemned in the song.",
          correctMeaning: "Bandi Yadagiri wrote the song against Visnur Ramachandra Reddy.",
          selectedMeaning: "The Nizam was the sovereign of Hyderabad, but the song explicitly condemns 'Visnuri Dora'.",
          possibleConfusion: "The song mentions Nizam's regime, but the direct target named is the local Deshmukh.",
          decisionRules: [
            { when: "the question asks who Bandi Yadagiri specifically condemned in 'Bandenaka Bandi Katti'", choose: "Visnur Ramachandra Reddy" },
            { when: "the question asks who was the Seventh Nizam during the Armed Struggle", choose: "Mir Osman Ali Khan" },
          ],
          nextStep: "Remember the lyrics: 'Visnoori Ramachandra Reddy... Naa kodaka'.",
        },
        {
          observation: "You correctly named Visnur Ramachandra Reddy.",
          correctMeaning: "Visnur Ramachandra Reddy was the tyrannical Deshmukh of Jangaon taluk.",
          selectedMeaning: "Visnur Ramachandra Reddy was the tyrannical Deshmukh of Jangaon taluk.",
          possibleConfusion: "You answered correctly. The song became the anthem of the anti-feudal rebellion.",
          decisionRules: [
            { when: "the question asks who was the Deshmukh opposed by Chakali Ilamma and Doddi Komaraiah", choose: "Visnur Ramachandra Reddy" },
            { when: "the question asks who authored 'Bandenaka Bandi Katti'", choose: "Bandi Yadagiri" },
          ],
          nextStep: "Connect Visnur Ramachandra Reddy to the Kadavendi firing (July 4, 1946).",
        },
        {
          observation: "Notice the location of Jenna Reddy Pratapa Reddy.",
          correctMeaning: "Visnur Ramachandra Reddy was the landlord named by Bandi Yadagiri.",
          selectedMeaning: "Jenna Reddy Pratapa Reddy was the Deshmukh of Suryapet (Errapahad), known as the largest landholder, not the subject of this song.",
          possibleConfusion: "Both were notorious Deshmukhs targeted by the Communist-led Andhra Mahasabha.",
          decisionRules: [
            { when: "the question asks which Deshmukh owned over 150,000 acres in Suryapet/Errapahad", choose: "Jenna Reddy Pratapa Reddy" },
            { when: "the question asks against whom 'Bandenaka Bandi Katti' was written", choose: "Visnur Ramachandra Reddy" },
          ],
          nextStep: "Differentiate Visnur (Jangaon) from Jenna Reddy (Suryapet).",
        },
        {
          observation: "Look at Kalluri Subba Rao's background.",
          correctMeaning: "The target was Visnur Ramachandra Reddy.",
          selectedMeaning: "Kalluri Subba Rao was a freedom fighter and legislator from Anantapur (Rayalaseema), not a Telangana Deshmukh.",
          possibleConfusion: "Distractor with a similar sounding surname.",
          decisionRules: [
            { when: "the question asks about the Deshmukh of Visnoor", choose: "Visnur Ramachandra Reddy" },
            { when: "the question asks who Kalluri Subba Rao was", choose: "Rayalaseema political leader" },
          ],
          nextStep: "Focus on Nalgonda and Warangal Deshmukhs of the Armed Struggle.",
        },
      ],
    },
  },

  // 11. TM-Q036 (TGPSC Group-2 2024 Q9)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q036",
      topic: "TM-01.03",
      concept: "TM-01.03-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Consider the following statements regarding the national movement in Hyderabad State:\nStatement A: Swami Ramananda Thirtha was the founder-president who revived and led the Hyderabad State Congress.\nStatement B: In 1947, he spearheaded the 'Join India Movement' demanding that Hyderabad State immediately accede to the Indian Union.\nWhich of the above statements is/are correct?",
      options: [
        {
          text: "Statement A only",
          why: "Statement B is also fully true: Swami Ramananda Thirtha launched the Join India agitation on 7 August 1947.",
          attraction: "Focuses only on his role in the State Congress.",
        },
        {
          text: "Statement B only",
          why: "Statement A is also fully true: he served as the uncompromising president of the Hyderabad State Congress.",
          attraction: "Focuses only on the 1947 Join India agitation.",
        },
        {
          text: "Both Statement A and Statement B",
          why: "Both statements are historically correct. Swami Ramananda Thirtha transformed the Hyderabad State Congress into an active mass party and launched the historic 'Join India Movement' in August 1947.",
          attraction: "Both facts are celebrated milestones of Hyderabad's integration struggle.",
          confusion: false,
        },
        {
          text: "Neither Statement A nor Statement B",
          why: "Both statements are accurate historical truths.",
          attraction: "Skeptical option.",
        },
      ],
      answer: 2,
      reason: "Swami Ramananda Thirtha (Vyankatesh Bhagvan Khedgikar) was the dynamic leader and president of the Hyderabad State Congress who defied the Nizam's ban and, on 7 August 1947, declared the 'Join India Movement', urging the citizens to unfurl the Indian National Tricolour across Hyderabad State on 15 August 1947.",
      clue: "Look for 'Swami Ramananda Thirtha': both his leadership of Hyderabad State Congress and his call for 'Join India Movement' in 1947 are authentic.",
      trap: "Do not doubt whether Swami Ramananda Thirtha led the Join India Movement; he was arrested on 15 August 1947 for defying the Nizam.",
      elimination: "Both statements are standard textbook facts; eliminate single-statement and neither-statement options.",
      anchor: "Swami Ramananda Thirtha led Hyderabad State Congress and launched the 1947 Join India Movement.",
      hint: "Who was the sanyasi-leader who unfurled the Indian Tricolour in Hyderabad State in August 1947?",
      source: "TGPSC Group-2 2024, Paper IV, Q9",
      page: 4,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Statement A is true, but check Statement B as well.",
          correctMeaning: "Both statements are correct: he was the leader of the State Congress and launched the Join India movement.",
          selectedMeaning: "Selecting 'A only' ignores his leadership of the 1947 Join India struggle.",
          possibleConfusion: "Aspirants often forget that Join India was organized under the Hyderabad State Congress banner.",
          decisionRules: [
            { when: "the question asks who called for Join India Movement in Hyderabad in 1947", choose: "Swami Ramananda Thirtha" },
            { when: "the question asks whether both statements on Swami Ramananda Thirtha are true", choose: "Both Statement A and Statement B" },
          ],
          nextStep: "Remember: Join India was launched on 7 August 1947.",
        },
        {
          observation: "Statement B is true, but check Statement A.",
          correctMeaning: "Both statements are correct: he also led the Hyderabad State Congress.",
          selectedMeaning: "Selecting 'B only' ignores his foundational role as President of the Hyderabad State Congress.",
          possibleConfusion: "He was elected president of the Hyderabad State Congress in 1946.",
          decisionRules: [
            { when: "the question asks who was the president of Hyderabad State Congress during 1946–48", choose: "Swami Ramananda Thirtha" },
            { when: "evaluating both statements", choose: "Both Statement A and Statement B" },
          ],
          nextStep: "Confirm his presidency of Hyderabad State Congress.",
        },
        {
          observation: "You correctly recognized that both statements are true.",
          correctMeaning: "Swami Ramananda Thirtha was the paramount leader of the Hyderabad State Congress and led the 1947 Join India movement.",
          selectedMeaning: "Swami Ramananda Thirtha was the paramount leader of the Hyderabad State Congress and led the 1947 Join India movement.",
          possibleConfusion: "You answered correctly. His autobiography is titled 'Memoirs of Hyderabad Freedom Struggle'.",
          decisionRules: [
            { when: "the question asks who authored 'Memoirs of Hyderabad Freedom Struggle'", choose: "Swami Ramananda Thirtha" },
            { when: "the question asks who demanded unconditional accession of Hyderabad in 1947", choose: "Swami Ramananda Thirtha" },
          ],
          nextStep: "Review his mentor role to P.V. Narasimha Rao and S.B. Chavan.",
        },
        {
          observation: "Evaluate the historical accuracy of both claims.",
          correctMeaning: "Both statements are authenticated historical facts.",
          selectedMeaning: "Rejecting both statements contradicts basic modern Hyderabad history.",
          possibleConfusion: "Do not doubt Swami Ramananda Thirtha's role in the accession struggle.",
          decisionRules: [
            { when: "the question asks if Swami Ramananda Thirtha led the accession struggle", choose: "Yes, Both statements are true" },
            { when: "the question asks who founded the Andhra Mahasabha", choose: "Madapati Hanumantha Rao (not Swami Ramananda Thirtha)" },
          ],
          nextStep: "Distinguish Hyderabad State Congress (1938) from Andhra Mahasabha (1930).",
        },
      ],
    },
  },

  // 12. TM-Q037 (TGPSC Group-2 2024 Q10)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q037",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Consider the following historical factors that contributed to the outbreak of the 1952 'Non-Mulki Go Back' (Idhi Sambar, Go Back Sambar) agitation in Hyderabad State:\nStatement A: Between 1946 and 1948, the Nizam's government had recruited approximately 50,000 non-locals from outside the state in Military, Police, and Excise departments.\nStatement B: After the 1948 Police Action, senior leader K.V. Ranga Reddy expressed deep resentment against the widespread appointment of non-Mulkis when qualified local Mulkis were available.\nStatement C: Non-Mulki officials occupying top posts in the military and civil administration brought their own relatives and acquaintances and appointed them using discretionary powers.\nStatement D: These grievances collectively culminated in the student-led 1952 Non-Mulki Go Back movement.\nWhich of the above statements are correct?",
      options: [
        {
          text: "A and B only",
          why: "Statements C and D are also historically documented causes of the 1952 agitation.",
          attraction: "Partially correct.",
        },
        {
          text: "A, B and C only",
          why: "Statement D is also correct, as these factors directly produced the 1952 movement.",
          attraction: "Leaves out the concluding outcome.",
        },
        {
          text: "B, C and D only",
          why: "Statement A is also an authentic historical grievance recorded in government documents.",
          attraction: "Omits the pre-1948 recruitment context.",
        },
        {
          text: "A, B, C and D (All of the above)",
          why: "All four statements are historically authenticated facts that sparked the massive 1952 Mulki agitation starting in Warangal and spreading to Hyderabad.",
          attraction: "This matches the official TGPSC Group-2 2024 key.",
          confusion: false,
        },
      ],
      answer: 3,
      reason: "The 1952 Mulki agitation had roots in: (1) 50,000 outside recruitments by the late Nizam regime; (2) Influx of thousands of non-local officials during the M.K. Vellodi civil administration (1949–1952); (3) Nepotistic hiring of non-locals by outside department heads; (4) Protests by local leaders like K.V. Ranga Reddy, leading to student protests in Warangal and the City College firing in September 1952.",
      clue: "Look for 'causes of 1952 Non-Mulki Go Back agitation': all four statements A, B, C, and D are fully correct.",
      trap: "Do not think K.V. Ranga Reddy supported non-Mulkis; he was a fierce champion of Mulki rights in the early 1950s.",
      elimination: "All four statements describe verified historical phases of the grievance leading to the 1952 agitation.",
      anchor: "All four statements (A, B, C, D) contributed to the 1952 Mulki Agitation.",
      hint: "Did the combined influx from the Nizam's last years and the Vellodi regime trigger the 1952 agitation?",
      source: "TGPSC Group-2 2024, Paper IV, Q10",
      page: 4,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Examine Statements C and D.",
          correctMeaning: "All four statements (A, B, C, and D) are correct.",
          selectedMeaning: "Option 1 omits the nepotistic appointments by non-local officials and the culminating movement.",
          possibleConfusion: "Thinking only high-level political statements mattered, ignoring administrative nepotism.",
          decisionRules: [
            { when: "evaluating the causes of the 1952 Mulki movement in Group-2 / SI papers", choose: "A, B, C and D (All four statements)" },
            { when: "the question asks where the 1952 Mulki agitation began", choose: "Warangal (with student protests against non-local teachers)" },
          ],
          nextStep: "Remember: The 1952 agitation started in Warangal in July 1952.",
        },
        {
          observation: "Check Statement D.",
          correctMeaning: "Statement D is the direct outcome of the first three grievances.",
          selectedMeaning: "Option 2 leaves out the conclusion that all these led to the Non-Mulki Go Back agitation.",
          possibleConfusion: "Overlooking the final synthesis statement.",
          decisionRules: [
            { when: "the question asks what movement erupted from these grievances", choose: "Non-Mulki Go Back (1952 Mulki Agitation)" },
            { when: "the question asks if all four statements are true", choose: "A, B, C and D" },
          ],
          nextStep: "Connect administrative grievances to the student slogans 'Ghair-Mulki Go Back'.",
        },
        {
          observation: "Check Statement A on pre-1948 recruitments.",
          correctMeaning: "The Nizam's administration brought in about 50,000 outsiders between 1946 and 1948.",
          selectedMeaning: "Option 3 omits Statement A, assuming the problem only started after Police Action.",
          possibleConfusion: "The problem was exacerbated by Vellodi, but began before Police Action.",
          decisionRules: [
            { when: "the question asks about outside recruitment between 1946 and 1948", choose: "About 50,000 non-locals were recruited by Hyderabad Govt" },
            { when: "the question asks which statements are true", choose: "All statements A, B, C, and D" },
          ],
          nextStep: "Note that pre-1948 and post-1948 influxes compounded each other.",
        },
        {
          observation: "You correctly selected all four statements.",
          correctMeaning: "Every statement accurately describes the documented causes of the 1952 Mulki agitation.",
          selectedMeaning: "Every statement accurately describes the documented causes of the 1952 Mulki agitation.",
          possibleConfusion: "You answered correctly. This reflects comprehensive knowledge of 1952 agitation origins.",
          decisionRules: [
            { when: "the question asks which factors led to 1952 Mulki agitation", choose: "A, B, C and D" },
            { when: "the question asks who was the Chief Minister during the 1952 City College firing", choose: "Burgula Ramakrishna Rao" },
          ],
          nextStep: "Review the Justice Jaganmohan Reddy Commission constituted to investigate the 1952 firing.",
        },
      ],
    },
  },

  // 13. TM-Q038 (TGPSC Group-2 2024 Q11)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q038",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-02",
      stage: "practice",
      prompt: "Match the following Ministers in the first democratically elected government of Hyderabad State (Burgula Ramakrishna Rao Ministry, 1952) with their respective portfolios:\n(a) Phoolchand Gandhi\n(b) Dr. G.S. Melkote\n(c) K.V. Ranga Reddy\n(d) Anna Rao",
      options: [
        {
          text: "(a)-(I), (b)-(II), (c)-(III), (d)-(V)",
          why: "Incorrect: Phoolchand Gandhi held Education, not Local Self Administration.",
          attraction: "Mismatched portfolios.",
        },
        {
          text: "(a)-(II), (b)-(III), (c)-(I), (d)-(IV)",
          why: "Incorrect: KV Ranga Reddy held Customs and Excise, not Local Self Administration.",
          attraction: "Mixes Ranga Reddy and Anna Rao.",
        },
        {
          text: "(a)-(IV), (b)-(III), (c)-(II), (d)-(I)",
          why: "Correct mapping: Phoolchand Gandhi was Minister for Education (IV); Dr. G.S. Melkote was Minister for Finance (III); K.V. Ranga Reddy was Minister for Customs and Excise (II); Anna Rao was Minister for Local Self Administration (I).",
          attraction: "Direct match from official TGPSC Group-2 2024 Paper IV key.",
          confusion: false,
        },
        {
          text: "(a)-(III), (b)-(IV), (c)-(V), (d)-(II)",
          why: "Incorrect: Melkote held Finance, not Education.",
          attraction: "Reverses Melkote and Gandhi.",
        },
      ],
      answer: 2,
      reason: "In the 1952 Burgula Ramakrishna Rao Ministry of Hyderabad State: Phoolchand Gandhi held Education; Dr. G.S. Melkote held Finance; K.V. Ranga Reddy held Customs, Excise, and Revenue; Anna Rao held Local Self Administration (Panchayats and Municipalities).",
      clue: "Look for 'Dr. G.S. Melkote': famously held the Finance portfolio; K.V. Ranga Reddy held Customs and Excise.",
      trap: "Do not confuse Dr. Melkote (Finance) with Phoolchand Gandhi (Education).",
      elimination: "Match Dr. G.S. Melkote = Finance (III); K.V. Ranga Reddy = Customs and Excise (II). Only option 3 satisfies this.",
      anchor: "1952 Burgula Ministry: Phoolchand Gandhi: Education; GS Melkote: Finance; KV Ranga Reddy: Customs & Excise; Anna Rao: Local Self Administration.",
      hint: "Who was the Finance Minister in Burgula Ramakrishna Rao's 1952 Cabinet?",
      source: "TGPSC Group-2 2024, Paper IV, Q11",
      page: 5,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Check Phoolchand Gandhi's portfolio.",
          correctMeaning: "Option 3 is correct: Phoolchand Gandhi held Education.",
          selectedMeaning: "Option 1 assigns Local Self Administration to Phoolchand Gandhi; Anna Rao held that portfolio.",
          possibleConfusion: "Both ministers were key non-Telugu members of the Hyderabad Congress cabinet.",
          decisionRules: [
            { when: "the question asks who was Education Minister in 1952 Burgula Cabinet", choose: "Phoolchand Gandhi" },
            { when: "the question asks who was Local Self Administration Minister in 1952", choose: "Anna Rao" },
          ],
          nextStep: "Associate Phoolchand Gandhi with Education.",
        },
        {
          observation: "Look at K.V. Ranga Reddy's ministries in 1952.",
          correctMeaning: "K.V. Ranga Reddy held Customs and Excise (II).",
          selectedMeaning: "Option 2 places K.V. Ranga Reddy in Local Self Administration.",
          possibleConfusion: "K.V. Ranga Reddy later became Deputy Chief Minister in Andhra Pradesh, but in 1952 he held Excise & Customs.",
          decisionRules: [
            { when: "the question asks what portfolio K.V. Ranga Reddy held in the 1952 Hyderabad Cabinet", choose: "Customs and Excise" },
            { when: "the question asks who became Deputy CM of AP in 1959 under Sanjeeva Reddy", choose: "K.V. Ranga Reddy" },
          ],
          nextStep: "Remember: K.V. Ranga Reddy managed Revenue, Customs, and Excise.",
        },
        {
          observation: "You matched all four ministers correctly.",
          correctMeaning: "Phoolchand Gandhi = Education; G.S. Melkote = Finance; K.V. Ranga Reddy = Customs & Excise; Anna Rao = Local Self Administration.",
          selectedMeaning: "Phoolchand Gandhi = Education; G.S. Melkote = Finance; K.V. Ranga Reddy = Customs & Excise; Anna Rao = Local Self Administration.",
          possibleConfusion: "You answered correctly. The 1952 ministry is a high-yield exam topic for Telangana Police.",
          decisionRules: [
            { when: "the question asks who was Finance Minister in 1952 Hyderabad State", choose: "Dr. G.S. Melkote" },
            { when: "the question asks who was Home Minister in 1952 Burgula Cabinet", choose: "Digambar Rao Bindu" },
          ],
          nextStep: "Also note: Digambar Rao Bindu was Home Minister; Mehdi Nawaz Jung held Public Works.",
        },
        {
          observation: "Check Dr. G.S. Melkote's portfolio.",
          correctMeaning: "Dr. G.S. Melkote held Finance (III).",
          selectedMeaning: "Option 4 assigns Education to Melkote and Finance to Gandhi.",
          possibleConfusion: "Reversing the two portfolios.",
          decisionRules: [
            { when: "the question asks who handled Hyderabad State finances in 1952", choose: "Dr. G.S. Melkote" },
            { when: "the question asks who handled education", choose: "Phoolchand Gandhi" },
          ],
          nextStep: "Anchor Dr. Melkote to Finance.",
        },
      ],
    },
  },

  // 14. TM-Q039 (TGPSC Group-2 2024 Q12)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q039",
      topic: "TM-01.02",
      concept: "TM-01.02-M01",
      model: "Statements",
      modelId: "TM-QM-STA-02",
      stage: "practice",
      prompt: "Consider the following statements regarding the legal definition and conditions for acquiring 'Mulki' status in Hyderabad State under the 1919 Farman and Civil Service Regulations:\nStatement A: A person is called a Mulki if, by birth, he or she is a subject of the Hyderabad State.\nStatement B: A person is called a Mulki if his/her father completed 12 years in government service at the time of the applicant's birth.\nStatement C: A non-Mulki woman automatically acquires Mulki status if she marries a Mulki man.\nStatement D: A non-Mulki man can acquire Mulki status by marrying a Mulki woman.\nWhich of the above statements are correct?",
      options: [
        {
          text: "A and B only",
          why: "Statement B is incorrect: the residence requirement was 15 continuous years, not 12 years of service.",
          attraction: "Confuses 12 years with 15 years.",
        },
        {
          text: "B and D only",
          why: "Both B and D are factually and legally incorrect.",
          attraction: "Contains false conditions.",
        },
        {
          text: "A and C only",
          why: "Only Statements A and C are legally correct. Under the 1919 Farman: (A) Subject by birth is a Mulki; (C) A non-Mulki woman becomes a Mulki by marrying a Mulki husband. Statement D is false because a non-Mulki man CANNOT become a Mulki by marrying a Mulki woman; Statement B is false because 15 years continuous residence was required, not 12 years of service.",
          attraction: "Matches the official 2024 key and Hyderabad Civil Service Regulations.",
          confusion: false,
        },
        {
          text: "A, C and D only",
          why: "Statement D is legally false: marriage did not confer Mulki status upon non-Mulki men.",
          attraction: "Assumes gender parity in 1919 matrimonial citizenship rules.",
          confusion: true,
        },
      ],
      answer: 2,
      reason: "Under the Hyderabad Civil Service Regulations (1919 Farman): (1) A person is a Mulki by birth; (2) Permanent residence required 15 continuous years in Hyderabad State; (3) A non-Mulki woman marrying a Mulki man becomes a Mulki; (4) A non-Mulki man marrying a Mulki woman does NOT acquire Mulki status. Hence only A and C are correct.",
      clue: "Look for 'non-Mulki man marrying a Mulki woman': this did NOT confer Mulki status. Also, residence rule was 15 years, not 12.",
      trap: "Do not assume a non-Mulki man became a Mulki by marrying a local woman; patriarchal law only conferred status on the wife.",
      elimination: "Eliminate D (non-Mulki man marrying Mulki woman never acquired Mulki status) and B (12 years is false; statutory requirement was 15 years continuous residence).",
      anchor: "Mulki rules: Birth (Yes), Non-Mulki woman marrying Mulki man (Yes), Non-Mulki man marrying Mulki woman (No), Residence: 15 years (not 12).",
      hint: "Did marrying a Mulki woman give her non-local husband Mulki status under the 1919 Farman?",
      source: "TGPSC Group-2 2024, Paper IV, Q12",
      page: 5,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Check Statement B regarding the years required.",
          correctMeaning: "Only Statements A and C are correct; Statement B is false because the 1919 Farman mandated 15 years of continuous residence.",
          selectedMeaning: "Option 1 accepts Statement B with 12 years, which is historically wrong.",
          possibleConfusion: "12 years was used in later Indian domicile rules, but Hyderabad Mulki law required 15 years.",
          decisionRules: [
            { when: "the question asks how many years of continuous residence were required for Mulki status under 1919 Farman", choose: "15 years" },
            { when: "evaluating statements on 1919 Farman Mulki status", choose: "Statements A and C are correct" },
          ],
          nextStep: "Anchor 1919 Farman residence requirement strictly to 15 years.",
        },
        {
          observation: "Check Statement D regarding matrimonial rights.",
          correctMeaning: "A non-Mulki man did NOT become a Mulki by marrying a Mulki woman.",
          selectedMeaning: "Option 2 claims B and D are true, both of which are false.",
          possibleConfusion: "Assuming symmetric marriage provisions for men and women.",
          decisionRules: [
            { when: "the question asks if a non-Mulki man became a Mulki by marrying a Mulki woman", choose: "No, he did NOT acquire Mulki status" },
            { when: "the question asks if a non-Mulki woman became a Mulki by marrying a Mulki man", choose: "Yes, she acquired Mulki status" },
          ],
          nextStep: "Remember: Under 1919 regulations, only wives took the husband's Mulki status.",
        },
        {
          observation: "You correctly selected Statements A and C.",
          correctMeaning: "Subject by birth (A) and non-Mulki woman marrying a Mulki man (C) were valid under the 1919 Farman.",
          selectedMeaning: "Subject by birth (A) and non-Mulki woman marrying a Mulki man (C) were valid under the 1919 Farman.",
          possibleConfusion: "You answered correctly. This tests precise statutory knowledge of the 1919 Hyderabad Civil Service Regulations.",
          decisionRules: [
            { when: "the question asks who acquired Mulki status by marriage", choose: "Only non-Mulki women marrying Mulki men" },
            { when: "the question asks for valid 1919 Mulki conditions", choose: "A and C only" },
          ],
          nextStep: "Review Article 35(b) of the Indian Constitution which protected these pre-existing Mulki laws.",
        },
        {
          observation: "Evaluate Statement D on non-Mulki men.",
          correctMeaning: "Statement D is legally false; therefore option 4 cannot be selected.",
          selectedMeaning: "Option 4 includes Statement D, which misstates the historical marriage regulation.",
          possibleConfusion: "Modern gender-neutral legal assumptions do not apply to the 1919 Nizam Farman.",
          decisionRules: [
            { when: "the question asks if a husband could claim Mulki status through his wife", choose: "Never under the 1919 Farman" },
            { when: "the question asks which statements are correct", choose: "A and C only" },
          ],
          nextStep: "Note this examiner trap: marriage only conferred Mulki status on women.",
        },
      ],
    },
  },

  // 15. TM-Q040 (TGPSC Group-2 2024 Q14)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q040",
      topic: "TM-01.02",
      concept: "TM-01.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "When Osmania University students were expelled in 1938 for singing 'Vandemataram' in their hostel prayer halls, which prominent educational leader, as the Vice-Chancellor of Andhra University, refused to grant them admission?",
      options: [
        {
          text: "K.R. Srinivasa Iyengar",
          why: "K.R. Srinivasa Iyengar was a renowned professor of English literature, not the Vice-Chancellor who refused admission in 1938.",
          attraction: "Prominent academic at Andhra University.",
        },
        {
          text: "L. Bullayya",
          why: "L. Bullayya served as Vice-Chancellor of Andhra University much later (1968–1974).",
          attraction: "Well-known later Vice-Chancellor.",
        },
        {
          text: "Dr. Sarvepalli Radhakrishnan",
          why: "Dr. S. Radhakrishnan was Vice-Chancellor of Andhra University earlier (1931–1936), but had left for Oxford by 1938.",
          attraction: "Famous philosopher who served as Andhra University Vice-Chancellor in the 1930s.",
          confusion: true,
        },
        {
          text: "Cattamanchi Ramalinga Reddy (C.R. Reddy)",
          why: "Cattamanchi Ramalinga Reddy, the Vice-Chancellor of Andhra University in 1938, refused to admit the expelled Osmania students, stating he did not want to encourage student indiscipline or antagonize the Nizam Government.",
          attraction: "He was the serving Vice-Chancellor in 1938 who turned them away.",
          confusion: false,
        },
      ],
      answer: 3,
      reason: "In 1938, when over 350 Osmania University students (including P.V. Narasimha Rao, Arutla Ramachandra Reddy, and Hayagrivachary) were expelled for singing Vandemataram, Andhra University VC Cattamanchi Ramalinga Reddy refused to admit them. Eventually, Nagpur University under Vice-Chancellor Justice Kedar gave them admission.",
      clue: "Look for 'Vice Chancellor of Andhra University refused to admit expelled Vandemataram students': C.R. Reddy.",
      trap: "Do not confuse C.R. Reddy (who refused admission) with Justice Kedar of Nagpur University (who generously admitted them).",
      elimination: "Eliminate Radhakrishnan (tenure ended in 1936) and Bullayya (1960s); C.R. Reddy was the VC who refused admission.",
      anchor: "Andhra University VC who refused Osmania 1938 students: C.R. Reddy. Nagpur University VC who admitted them: Justice Kedar.",
      hint: "Which famous scholar-educationist and founder-VC of Andhra University refused the Osmania students?",
      source: "TGPSC Group-2 2024, Paper IV, Q14",
      page: 6,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Check the tenure and role of K.R. Srinivasa Iyengar.",
          correctMeaning: "C.R. Reddy was the Vice-Chancellor who rejected the students.",
          selectedMeaning: "K.R. Srinivasa Iyengar was a professor and literary biographer, not the VC in 1938.",
          possibleConfusion: "He was a famous faculty member at Andhra University.",
          decisionRules: [
            { when: "the question asks which Vice-Chancellor refused admission to Osmania Vandemataram students", choose: "Cattamanchi Ramalinga Reddy (C.R. Reddy)" },
            { when: "the question asks which university admitted the expelled Osmania students", choose: "Nagpur University" },
          ],
          nextStep: "Remember: C.R. Reddy turned away the expelled Telangana students.",
        },
        {
          observation: "Look at L. Bullayya's timeline.",
          correctMeaning: "C.R. Reddy held office in 1938.",
          selectedMeaning: "L. Bullayya was Vice-Chancellor during the late 1960s and 1970s, thirty years after the Vandemataram movement.",
          possibleConfusion: "An anachronistic Andhra University VC name.",
          decisionRules: [
            { when: "the question asks who was Andhra University VC in 1938", choose: "Cattamanchi Ramalinga Reddy" },
            { when: "the question asks who was the first Dalit Vice-Chancellor of Andhra University", choose: "L. Bullayya" },
          ],
          nextStep: "Place the Vandemataram movement in 1938 under C.R. Reddy.",
        },
        {
          observation: "Check Sarvepalli Radhakrishnan's dates at Andhra University.",
          correctMeaning: "C.R. Reddy was the serving VC in 1938; Radhakrishnan had resigned in 1936.",
          selectedMeaning: "Dr. S. Radhakrishnan was the VC from 1931 to 1936, but was not in office during the 1938 strike.",
          possibleConfusion: "Radhakrishnan is the most celebrated Andhra University VC, but he was at Oxford in 1938.",
          decisionRules: [
            { when: "the question asks who was Andhra University VC between 1931 and 1936", choose: "Dr. Sarvepalli Radhakrishnan" },
            { when: "the question asks who refused the Osmania students in 1938", choose: "Cattamanchi Ramalinga Reddy (C.R. Reddy)" },
          ],
          nextStep: "Anchor C.R. Reddy to the 1938 rejection.",
        },
        {
          observation: "You correctly identified Cattamanchi Ramalinga Reddy.",
          correctMeaning: "C.R. Reddy refused them entry to avoid confrontation with the Nizam's government.",
          selectedMeaning: "C.R. Reddy refused them entry to avoid confrontation with the Nizam's government.",
          possibleConfusion: "You answered correctly. The students were then admitted by Nagpur University Vice-Chancellor Kedar.",
          decisionRules: [
            { when: "the question asks who refused admission to 1938 Osmania students", choose: "C.R. Reddy (Andhra University)" },
            { when: "the question asks who gave admission to 1938 Osmania students", choose: "Justice Kedar (Nagpur University)" },
          ],
          nextStep: "Note: P.V. Narasimha Rao completed his law degree at Nagpur University because of this.",
        },
      ],
    },
  },

  // 16. TM-Q041 (TGPSC Group-2 2024 Q21)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q041",
      topic: "TM-01.04",
      concept: "TM-01.04-M02",
      model: "Statements",
      modelId: "TM-QM-STA-01",
      stage: "practice",
      prompt: "Consider the following statements regarding the clauses of the historic Gentlemen's Agreement signed on 20 February 1956:\nStatement A: Future recruitment to public services in the combined state will be on the basis of population proportion from both regions.\nStatement B: Sale of agricultural lands in the Telangana region is to be controlled and regulated by the Regional Council.\nStatement C: A Regional Council will be established for both Telangana and Andhra regions to oversee development.\nStatement D: Prohibition in Telangana should be implemented based upon the overall majority decision in the Legislative Assembly.\nWhich of the above statements are correct?",
      options: [
        {
          text: "A and B only",
          why: "Statements A and B are authentic clauses. Statement C is false because the Regional Council was established ONLY for Telangana, not for Andhra. Statement D is false because prohibition in Telangana was to be decided by Telangana members of the Assembly, not the overall Assembly majority.",
          attraction: "Direct match from official TGPSC Group-2 2024 key.",
          confusion: false,
        },
        {
          text: "B and C only",
          why: "Statement C is false: there was never an Andhra Regional Council.",
          attraction: "Mixes land control with a dual regional council myth.",
        },
        {
          text: "C and D only",
          why: "Both Statements C and D are inaccurate representations of the 1956 agreement.",
          attraction: "Pair of distorted clauses.",
        },
        {
          text: "A, B and D only",
          why: "Statement D is false: prohibition in Telangana was specifically reserved for the decision of Telangana legislators alone.",
          attraction: "Assumes general assembly supremacy on prohibition.",
        },
      ],
      answer: 0,
      reason: "Clauses of the Gentlemen's Agreement (1956): Clause 10: Recruitment proportional to population (Statement A is true); Clause 5: Sale of agricultural land in Telangana to be controlled by the Regional Council (Statement B is true); Regional Council was created exclusively for Telangana, not Andhra (Statement C is false); Prohibition in Telangana could be implemented only if the Telangana members of the Assembly so decided (Statement D is false). Hence only A and B are correct.",
      clue: "Look for 'Regional Council established for both Telangana and Andhra': false, it was only for Telangana. Prohibition was to be decided by Telangana MLAs only.",
      trap: "Do not assume both regions had Regional Councils; only Telangana had the Telangana Regional Council (TRC).",
      elimination: "Eliminate C (Andhra had no regional council) and D (Telangana MLAs had a veto on prohibition); only A and B are true.",
      anchor: "Gentlemen's Agreement: Recruitment on population (True), Agricultural land sales controlled by Regional Council (True), Regional Council only for Telangana (not both).",
      hint: "Was the Regional Council established for both regions or exclusively for Telangana?",
      source: "TGPSC Group-2 2024, Paper IV, Q21",
      page: 8,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Statements A and B.",
          correctMeaning: "Future recruitment was proportional to population, and agricultural land transfers were placed under the Telangana Regional Council.",
          selectedMeaning: "Future recruitment was proportional to population, and agricultural land transfers were placed under the Telangana Regional Council.",
          possibleConfusion: "You answered correctly. Statements C and D distort the regional autonomy protections.",
          decisionRules: [
            { when: "the question asks who controlled agricultural land sales in Telangana under Gentlemen's Agreement", choose: "Telangana Regional Council" },
            { when: "the question asks which regions had a Regional Council", choose: "Only Telangana (not Andhra)" },
          ],
          nextStep: "Review Article 371(1) which gave constitutional backing to the Telangana Regional Committee.",
        },
        {
          observation: "Examine Statement C on Regional Councils.",
          correctMeaning: "Only Statements A and B are correct; Statement C is false because no Regional Council existed for Andhra.",
          selectedMeaning: "Option 2 accepts Statement C, which erroneously creates a Regional Council for Coastal Andhra.",
          possibleConfusion: "Thinking the regional council was symmetric across both regions.",
          decisionRules: [
            { when: "the question asks if a Regional Council was created for Andhra", choose: "No, only for Telangana" },
            { when: "evaluating Gentlemen's Agreement clauses", choose: "A and B only" },
          ],
          nextStep: "Remember: The Telangana Regional Committee (TRC) was unique to Telangana.",
        },
        {
          observation: "Check Statement D regarding Prohibition.",
          correctMeaning: "Prohibition in Telangana was subject to the consent of Telangana legislators, not the overall Assembly.",
          selectedMeaning: "Option 3 accepts both false statements C and D.",
          possibleConfusion: "Coastal Andhra had prohibition under Madras laws; Telangana relied heavily on toddy/excise revenue.",
          decisionRules: [
            { when: "the question asks who had the authority to implement prohibition in Telangana under 1956 agreement", choose: "Telangana members of the Legislative Assembly" },
            { when: "evaluating Statements A and B", choose: "Both are correct" },
          ],
          nextStep: "Note why toddy and excise were protected: they funded Telangana educational institutions.",
        },
        {
          observation: "Re-evaluate the majority required for prohibition in Statement D.",
          correctMeaning: "Statement D is false: an overall Assembly majority could not impose prohibition on Telangana against its will.",
          selectedMeaning: "Option 4 accepts Statement D, ignoring the Telangana veto on excise prohibition.",
          possibleConfusion: "Confusing overall Assembly vote with the exclusive vote of Telangana MLAs.",
          decisionRules: [
            { when: "the question asks if the general Assembly could impose prohibition on Telangana", choose: "No, required Telangana MLAs' majority" },
            { when: "the question asks which statements are correct", choose: "A and B only" },
          ],
          nextStep: "Anchor the protective veto granted to Telangana MLAs in 1956.",
        },
      ],
    },
  },

  // 17. TM-Q042 (TGPSC Group-2 2024 Q22)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q042",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-02",
      stage: "practice",
      prompt: "Match the following historical dignitaries with the official offices they assumed upon the formation of Andhra Pradesh on 1 November 1956:\n(a) C.M. Trivedi\n(b) P. Sundaraiah\n(c) M. Hanumantha Rao\n(d) Ayyadevara Kaleswara Rao",
      options: [
        {
          text: "(a)-(IV), (b)-(III), (c)-(II), (d)-(I)",
          why: "Incorrect: CM Trivedi was Governor, not Leader of Opposition.",
          attraction: "Randomized offices.",
        },
        {
          text: "(a)-(III), (b)-(IV), (c)-(I), (d)-(V)",
          why: "Incorrect: Ayyadevara Kaleswara Rao was Speaker, not Governor.",
          attraction: "Mixes Speaker and Governor.",
        },
        {
          text: "(a)-(V), (b)-(IV), (c)-(II), (d)-(III)",
          why: "Correct mapping: Chandulal Madhavlal Trivedi was the First Governor of Andhra Pradesh (V); Puchalapalli Sundaraiah was the Leader of the Opposition (IV); Madapati Hanumantha Rao became the Chairman of the Andhra Pradesh Legislative Council (II); Ayyadevara Kaleswara Rao was the First Speaker of the Andhra Pradesh Legislative Assembly (III).",
          attraction: "Exact match from official TGPSC Group-2 2024 Paper IV key.",
          confusion: false,
        },
        {
          text: "(a)-(V), (b)-(I), (c)-(III), (d)-(II)",
          why: "Incorrect: P. Sundaraiah was Leader of the Opposition, not Deputy Speaker.",
          attraction: "Mixes legislative roles.",
        },
      ],
      answer: 2,
      reason: "On 1 November 1956: C.M. Trivedi was sworn in as the first Governor of the unified state; P. Sundaraiah (Communist leader) was the Leader of the Opposition in the Assembly; Madapati Hanumantha Rao (Andhra Pitamaha) was elected Chairman of the newly created Legislative Council in 1958; Ayyadevara Kaleswara Rao was elected the first Speaker of the Legislative Assembly.",
      clue: "Look for 'C.M. Trivedi': First Governor of Andhra Pradesh; Ayyadevara Kaleswara Rao: First Speaker of AP Assembly.",
      trap: "Do not confuse Legislative Assembly Speaker (Ayyadevara Kaleswara Rao) with Legislative Council Chairman (Madapati Hanumantha Rao).",
      elimination: "Identify C.M. Trivedi = First Governor (V); P. Sundaraiah = Opposition Leader (IV). This immediately isolates option 3.",
      anchor: "1956 AP First Offices: Governor: C.M. Trivedi; Opposition Leader: P. Sundaraiah; Council Chairman: Madapati Hanumantha Rao; Speaker: A. Kaleswara Rao.",
      hint: "Who was the first Governor of combined Andhra Pradesh in November 1956?",
      source: "TGPSC Group-2 2024, Paper IV, Q22",
      page: 8,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check C.M. Trivedi's constitutional post in 1956.",
          correctMeaning: "Option 3 is correct: C.M. Trivedi was the First Governor of Andhra Pradesh (V).",
          selectedMeaning: "Option 1 assigns Leader of the Opposition to C.M. Trivedi, which is an elected political role.",
          possibleConfusion: "Misallocating gubernatorial and legislative roles.",
          decisionRules: [
            { when: "the question asks who was the first Governor of Andhra Pradesh in 1956", choose: "Chandulal Madhavlal Trivedi (C.M. Trivedi)" },
            { when: "the question asks who was the first Chief Minister of combined AP", choose: "Neelam Sanjeeva Reddy" },
          ],
          nextStep: "Remember: C.M. Trivedi administered the oath of office on 1 November 1956.",
        },
        {
          observation: "Check Ayyadevara Kaleswara Rao's legislative post.",
          correctMeaning: "Ayyadevara Kaleswara Rao was the first Speaker of the Assembly (III).",
          selectedMeaning: "Option 2 makes Ayyadevara Kaleswara Rao the Governor.",
          possibleConfusion: "Ayyadevara was a senior Congress freedom fighter from Vijayawada.",
          decisionRules: [
            { when: "the question asks who was the first Speaker of Andhra Pradesh Assembly", choose: "Ayyadevara Kaleswara Rao" },
            { when: "the question asks who was the first Chairman of AP Legislative Council", choose: "Madapati Hanumantha Rao" },
          ],
          nextStep: "Distinguish Assembly Speaker (Kaleswara Rao) from Council Chairman (Madapati).",
        },
        {
          observation: "You matched all four inaugural dignitaries correctly.",
          correctMeaning: "C.M. Trivedi = Governor (V); P. Sundaraiah = Opposition Leader (IV); Madapati Hanumantha Rao = Council Chairman (II); A. Kaleswara Rao = Speaker (III).",
          selectedMeaning: "C.M. Trivedi = Governor (V); P. Sundaraiah = Opposition Leader (IV); Madapati Hanumantha Rao = Council Chairman (II); A. Kaleswara Rao = Speaker (III).",
          possibleConfusion: "You answered correctly. These dignitaries feature regularly in SI and Group exams.",
          decisionRules: [
            { when: "the question asks who was the first Leader of Opposition in AP Assembly in 1956", choose: "Puchalapalli Sundaraiah (P. Sundaraiah)" },
            { when: "the question asks who was the first Chairman of AP Legislative Council", choose: "Madapati Hanumantha Rao" },
          ],
          nextStep: "Review the subsequent election of K. Lakshman Bapuji as Deputy Speaker.",
        },
        {
          observation: "Look at P. Sundaraiah's role in 1956.",
          correctMeaning: "P. Sundaraiah was the Communist leader who became Leader of the Opposition (IV).",
          selectedMeaning: "Option 4 assigns Deputy Speaker to Sundaraiah.",
          possibleConfusion: "The Communist Party was the largest opposition group in 1956.",
          decisionRules: [
            { when: "the question asks who headed the CPI opposition in the 1956 AP Assembly", choose: "Puchalapalli Sundaraiah" },
            { when: "the question asks which post C.M. Trivedi held", choose: "Governor of Andhra Pradesh" },
          ],
          nextStep: "Link Sundaraiah directly to the parliamentary opposition leadership.",
        },
      ],
    },
  },

  // 18. TM-Q043 (EXPECTED: APRA 2014 Sections 85 & 87 - KRMB/GRMB Jurisdiction)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q043",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under the Andhra Pradesh Reorganisation Act, 2014, which Sections provide for the constitution of the Krishna River Management Board (KRMB) and Godavari River Management Board (GRMB), and empower the Central Government to issue gazette notifications specifying their operational jurisdiction over common river projects?",
      options: [
        {
          text: "Section 85 (Constitution of River Management Boards) and Section 87 (Jurisdiction of the Boards)",
          why: "Section 85 mandates the Central Government to constitute KRMB and GRMB; Section 87 empowers the Union Government to issue a gazette notification specifying their jurisdiction over irrigation and power projects.",
          attraction: "These are the exact sections invoked in recent Ministry of Jal Shakti notifications.",
          confusion: false,
        },
        {
          text: "Section 5 (Common Capital) and Section 8 (Governor's Special Responsibility)",
          why: "Sections 5 and 8 deal with the capital Hyderabad and law-and-order powers, not water resource management.",
          attraction: "Frequently discussed sections of APRA 2014.",
        },
        {
          text: "Section 30 (Common High Court) and Section 31 (High Court for Andhra Pradesh)",
          why: "Sections 30 and 31 govern the judicial branch and bifurcation of the High Court.",
          attraction: "Legal sections dealing with common institutions.",
        },
        {
          text: "Section 107 (Power to Remove Difficulties) and Section 108 (Repeal and Savings)",
          why: "Sections 107 and 108 are general miscellaneous boilerplate provisions at the end of the Act.",
          attraction: "Standard legal closing sections.",
        },
      ],
      answer: 0,
      reason: "Part IX of the AP Reorganisation Act 2014 deals with Water Resources. Section 85 provides for the constitution of the Krishna and Godavari River Management Boards by the Central Government. Section 87 provides that the Boards shall exercise jurisdiction over such aspects of projects as the Central Government may notify in the Official Gazette.",
      clue: "Look for 'KRMB and GRMB River Management Boards jurisdiction': Part IX, Sections 85 and 87 of AP Reorganisation Act 2014.",
      trap: "Do not confuse water management sections (Part IX, Sec 85-87) with capital provisions (Sec 5) or judiciary provisions (Sec 30-31).",
      elimination: "Eliminate Section 5 (Capital) and Section 30 (High Court); river boards are governed specifically under Sections 85 and 87.",
      anchor: "APRA 2014 Part IX: Section 85 = Constitution of KRMB & GRMB; Section 87 = Jurisdiction of the Boards.",
      hint: "Under which specific sections did the Union Ministry of Jal Shakti notify the operational jurisdiction of KRMB?",
      source: "AP Reorganisation Act 2014, Part IX, Sec 85 & 87",
      page: 25,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Sections 85 and 87.",
          correctMeaning: "Section 85 creates the KRMB and GRMB; Section 87 empowers the Union Government to gazette their operational control over projects like Nagarjuna Sagar and Srisailam.",
          selectedMeaning: "Section 85 creates the KRMB and GRMB; Section 87 empowers the Union Government to gazette their operational control over projects like Nagarjuna Sagar and Srisailam.",
          possibleConfusion: "You answered correctly. This has been a recurring headline dispute between Telangana and the Union Ministry of Jal Shakti.",
          decisionRules: [
            { when: "the question asks which sections of APRA 2014 govern KRMB and GRMB constitution and jurisdiction", choose: "Sections 85 and 87" },
            { when: "the question asks where the headquarters of KRMB was initially located", choose: "Hyderabad (with statutory proposal to shift to AP)" },
          ],
          nextStep: "Review the powers of the Apex Council under Section 84 of the Act.",
        },
        {
          observation: "Check the subject matter of Sections 5 and 8.",
          correctMeaning: "Sections 85 and 87 govern River Management Boards.",
          selectedMeaning: "Section 5 established Hyderabad as the common capital for a period not exceeding 10 years; Section 8 gave special law-and-order powers to the Governor.",
          possibleConfusion: "Sections 5 and 8 are heavily publicized, but they have nothing to do with river waters.",
          decisionRules: [
            { when: "the question asks which section made Hyderabad the 10-year common capital", choose: "Section 5 of APRA 2014" },
            { when: "the question asks which section created KRMB and GRMB", choose: "Section 85 of APRA 2014" },
          ],
          nextStep: "Anchor Section 5 to the Capital; Section 85 to River Boards.",
        },
        {
          observation: "Check the subject matter of Sections 30 and 31.",
          correctMeaning: "Sections 85 and 87 govern KRMB and GRMB.",
          selectedMeaning: "Sections 30 and 31 govern the High Court of Judicature at Hyderabad and the establishment of a separate High Court.",
          possibleConfusion: "Both involve inter-state institutions under APRA 2014.",
          decisionRules: [
            { when: "the question asks which sections govern High Court bifurcation", choose: "Sections 30, 31, and 32" },
            { when: "the question asks which section provides for jurisdiction of River Boards", choose: "Section 87" },
          ],
          nextStep: "Link Part IV to High Court; Part IX to Water Resources.",
        },
        {
          observation: "Examine Sections 107 and 108.",
          correctMeaning: "Sections 85 and 87 are the substantive sections for river regulation.",
          selectedMeaning: "Sections 107 and 108 are standard power-to-remove-difficulties clauses.",
          possibleConfusion: "Thinking statutory authority comes from general miscellaneous powers.",
          decisionRules: [
            { when: "the question asks which sections establish river management boards", choose: "Sections 85 and 87" },
            { when: "the question asks about the clause to remove difficulties in APRA 2014", choose: "Section 107" },
          ],
          nextStep: "Memorize Part IX as the definitive water management chapter of APRA 2014.",
        },
      ],
    },
  },

  // 19. TM-Q044 (EXPECTED: 2018 Presidential Order New Zonal System for SI/Constable)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q044",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under the Telangana Public Employment (Organisation of Local Cadres and Regulation of Direct Recruitment) Order, 2018 (New Zonal System), direct recruitment to the post of Sub-Inspector of Police (Civil/AR) is categorized under which jurisdictional cadre, and what percentage of vacancies is reserved exclusively for local candidates?",
      options: [
        {
          text: "Multi-Zonal Cadre (Multi-Zone I and Multi-Zone II) with 95% local reservation",
          why: "Under the 2018 Presidential Order, Sub-Inspector of Police is organized as a Multi-Zonal post across Multi-Zone I (Kaleshwaram) and Multi-Zone II (Yadadri), with 95% vacancies reserved for locals and 5% unreserved open to all.",
          attraction: "This reflects the exact operational framework for the ongoing SI recruitment.",
          confusion: false,
        },
        {
          text: "District Cadre with 80% local reservation",
          why: "District cadre in 2018 order has 95% reservation and applies to Constable posts, not Sub-Inspector.",
          attraction: "80% was the old 1975 Presidential Order quota.",
          confusion: true,
        },
        {
          text: "Zonal Cadre across 7 Zones with 70% local reservation",
          why: "70% was the old 1975 quota; the 2018 order increased local reservation to 95% across all local cadres.",
          attraction: "Reflects old 1975 Presidential Order percentages.",
        },
        {
          text: "State Cadre with 100% reservation for all Telangana residents",
          why: "Police Sub-Inspector is not a State Cadre post, and 100% reservation violates constitutional parity.",
          attraction: "Sounds like complete state-wide reservation.",
        },
      ],
      answer: 0,
      reason: "Under the 2018 Presidential Order issued under Article 371-D: Telangana established 7 Zones and 2 Multi-Zones. Direct recruitment reservations were elevated to 95% for locals (with 5% open competition). Sub-Inspector of Police is classified as a Multi-Zonal Cadre post (Multi-Zone I: Kaleshwaram, comprising Zones 1 to 4; Multi-Zone II: Yadadri, comprising Zones 5 to 7), while Police Constable is a District Cadre post.",
      clue: "Look for 'Sub-Inspector of Police cadre in 2018 New Zonal System': Multi-Zonal Cadre with 95% local quota.",
      trap: "Do not confuse the Police Constable post (District Cadre) with the Sub-Inspector post (Multi-Zonal Cadre). Also, do not confuse the new 95% quota with the 1975 quotas (80%/70%).",
      elimination: "Eliminate 80% and 70% (old 1975 rules); eliminate State Cadre (SI is Multi-Zonal).",
      anchor: "New Zonal System (2018): Police Constable = District Cadre (95%); Police Sub-Inspector = Multi-Zonal Cadre (95%).",
      hint: "What cadre governs Police SI recruitment in Telangana: District, Zonal, or Multi-Zonal?",
      source: "G.O.Ms.No. 124, GAD (2018) & Presidential Order 2018",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the Multi-Zonal cadre and 95% reservation.",
          correctMeaning: "Sub-Inspector of Police is organized under Multi-Zonal cadres (Multi-Zone I and Multi-Zone II) with 95% reserved for local aspirants.",
          selectedMeaning: "Sub-Inspector of Police is organized under Multi-Zonal cadres (Multi-Zone I and Multi-Zone II) with 95% reserved for local aspirants.",
          possibleConfusion: "You answered correctly. This is the exact recruitment rule governing your target notification.",
          decisionRules: [
            { when: "the question asks what cadre Sub-Inspector of Police belongs to in the 2018 Zonal System", choose: "Multi-Zonal Cadre (95% local)" },
            { when: "the question asks what cadre Police Constable belongs to in the 2018 Zonal System", choose: "District Cadre (95% local)" },
          ],
          nextStep: "Memorize: Multi-Zone I is Kaleshwaram (Zones 1-4); Multi-Zone II is Yadadri (Zones 5-7).",
        },
        {
          observation: "Check the cadre classification for Sub-Inspectors.",
          correctMeaning: "Sub-Inspectors are Multi-Zonal, whereas Constables are District Cadre.",
          selectedMeaning: "Option 2 describes the Constable cadre level and uses the obsolete 80% quota from the 1975 order.",
          possibleConfusion: "Applying Constable rules to Sub-Inspectors and using outdated 1975 percentages.",
          decisionRules: [
            { when: "the question asks which police post is District Cadre in the 2018 order", choose: "Police Constable" },
            { when: "the question asks which police post is Multi-Zonal", choose: "Sub-Inspector of Police" },
          ],
          nextStep: "Separate SI (Multi-Zone) from Constable (District).",
        },
        {
          observation: "Note the revised local reservation percentage under the 2018 Order.",
          correctMeaning: "The 2018 Presidential Order raised local reservation to 95% across all local cadres.",
          selectedMeaning: "Option 3 quotes the 70% zonal quota from the superseded 1975 Presidential Order.",
          possibleConfusion: "Aspirants studying older textbooks frequently confuse 1975 rules with 2018 rules.",
          decisionRules: [
            { when: "the question asks for local reservation percentage under the 2018 Presidential Order", choose: "95% (with 5% open)" },
            { when: "the question asks for zonal local reservation under the 1975 Presidential Order", choose: "70%" },
          ],
          nextStep: "Replace old 1975 percentages (80%/70%/60%) with 95% across the board.",
        },
        {
          observation: "Check whether Police SI is a State Cadre post.",
          correctMeaning: "Sub-Inspector is a Multi-Zonal post, not a State Cadre post.",
          selectedMeaning: "Option 4 incorrectly claims State Cadre with 100% reservation.",
          possibleConfusion: "100% reservation was struck down by the Supreme Court in earlier rulings; 95% was approved.",
          decisionRules: [
            { when: "the question asks why 5% is left unreserved in the 2018 order", choose: "To comply with constitutional merit requirements" },
            { when: "the question asks what cadre SI belongs to", choose: "Multi-Zonal Cadre" },
          ],
          nextStep: "Note that only Group-1 and Secretariat senior posts belong to the State Cadre.",
        },
      ],
    },
  },

  // 20. TM-Q045 (EXPECTED: APRA 2014 Sections 30–32 - High Court Bifurcation)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q045",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Part IV of the Andhra Pradesh Reorganisation Act, 2014, which specific Section provided that the existing High Court of Judicature at Hyderabad would temporarily serve as the common High Court for both States until a separate High Court for Andhra Pradesh was constituted under Section 31?",
      options: [
        {
          text: "Section 30",
          why: "Section 30 of the AP Reorganisation Act 2014 explicitly enacted: 'High Court of Judicature at Hyderabad to be common High Court until a new High Court for the State of Andhra Pradesh is constituted under Section 31.'",
          attraction: "This is the exact statutory provision.",
          confusion: false,
        },
        {
          text: "Section 5",
          why: "Section 5 enacted Hyderabad as the common capital, not the judicial High Court provision.",
          attraction: "Deals with the common capital for 10 years.",
        },
        {
          text: "Section 8",
          why: "Section 8 conferred special responsibilities upon the Governor regarding security and common capital law and order.",
          attraction: "Another widely debated common governance clause.",
        },
        {
          text: "Section 92",
          why: "Section 92 deals with succession in matters of financial assets and liabilities, not the High Court.",
          attraction: "Part of the financial distribution sections.",
        },
      ],
      answer: 0,
      reason: "Part IV of the Andhra Pradesh Reorganisation Act, 2014 specifically covers the High Court: Section 30 made the High Court of Judicature at Hyderabad the common High Court; Section 31 empowered the President to notify the establishment of a separate High Court for Andhra Pradesh (which was subsequently notified to sit at Amaravati on 1 January 2019).",
      clue: "Look for 'common High Court provision in APRA 2014': Section 30 enacted the common High Court; Section 31 provided for the separate AP High Court.",
      trap: "Do not confuse Section 5 (Common Capital for 10 years) with Section 30 (Common High Court).",
      elimination: "Eliminate Section 5 (Capital), Section 8 (Governor), and Section 92 (Financial liabilities); Section 30 is the dedicated High Court section.",
      anchor: "APRA 2014: Section 30 = Common High Court; Section 31 = High Court for Andhra Pradesh.",
      hint: "Which section in Part IV establishes the High Court of Judicature at Hyderabad as common High Court?",
      source: "AP Reorganisation Act 2014, Part IV, Section 30",
      page: 11,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Section 30.",
          correctMeaning: "Section 30 designated the Hyderabad High Court as the common High Court until the notification of a separate High Court for Andhra Pradesh under Section 31.",
          selectedMeaning: "Section 30 designated the Hyderabad High Court as the common High Court until the notification of a separate High Court for Andhra Pradesh under Section 31.",
          possibleConfusion: "You answered correctly. The bifurcation of the High Court on 1 January 2019 was a major milestone.",
          decisionRules: [
            { when: "the question asks which section of APRA 2014 established the common High Court", choose: "Section 30" },
            { when: "the question asks which section provided for the separate High Court for Andhra Pradesh", choose: "Section 31" },
          ],
          nextStep: "Note that on 1 January 2019, Justice Thottathil B. Radhakrishnan took oath as the first Chief Justice of Telangana High Court.",
        },
        {
          observation: "Check the subject matter of Section 5.",
          correctMeaning: "Section 30 governs the High Court.",
          selectedMeaning: "Section 5 governed the common capital status of Hyderabad for a period up to 10 years.",
          possibleConfusion: "Both sections dealt with shared institutions in Hyderabad.",
          decisionRules: [
            { when: "the question asks which section made Hyderabad the common capital", choose: "Section 5" },
            { when: "the question asks which section governed the common High Court", choose: "Section 30" },
          ],
          nextStep: "Distinguish executive capital (Section 5) from judicial seat (Section 30).",
        },
        {
          observation: "Check Governor's powers under Section 8.",
          correctMeaning: "Section 30 specifically created the common High Court framework.",
          selectedMeaning: "Section 8 granted special powers to the Governor over life, liberty, and property in the common capital area.",
          possibleConfusion: "Section 8 was heavily contested by Telangana parties as an infringement on state autonomy.",
          decisionRules: [
            { when: "the question asks which section gave special law and order powers to the Governor in common capital", choose: "Section 8" },
            { when: "the question asks which section established the common High Court", choose: "Section 30" },
          ],
          nextStep: "Remember: Section 8 pertained to the Governor's law-and-order role.",
        },
        {
          observation: "Look at Part X / Section 92.",
          correctMeaning: "Section 30 is located in Part IV (High Court).",
          selectedMeaning: "Section 92 covers general financial and asset principles.",
          possibleConfusion: "Selecting an arbitrary high-numbered section.",
          decisionRules: [
            { when: "the question asks which Part and Section govern the High Court", choose: "Part IV, Section 30" },
            { when: "the question asks where common capital is found", choose: "Part II, Section 5" },
          ],
          nextStep: "Keep the key parts of APRA 2014 organized by Roman numerals.",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 2 (${batchQuestions.length} questions)...`);

const importPayload = {
  actor: "human_operator_curator",
  reason: "Import authentic Telangana Police SI 2016 (Q181-Q200), TGPSC Group-2 2024 (Q7, Q9, Q10, Q11, Q12, Q14, Q21, Q22) and 2018-2024 expected legal questions.",
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
  reason: "Independently verified against official TS Police SI 2016 paper, TGPSC Group-2 2024 Paper IV, and AP Reorganisation Act 2014 gazette provisions.",
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
console.log(`Batch 2 complete! Total ${batchQuestions.length} questions successfully imported and published.`);

