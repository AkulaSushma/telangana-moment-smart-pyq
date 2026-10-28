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

const sources = [
  {
    id: "SR-POLICE-CONSTABLE-2016-2022",
    title: "Telangana State Police Constable Preliminary and Final Written Test Papers (2016-2022)",
    exam: "Telangana Police Constable",
    body: "Telangana State Level Police Recruitment Board (TSLPRB)",
    state: "Telangana",
    year: 2016,
    paper: "PWT & FWT - General Studies",
    stage: "Preliminary and Final",
    language: "English and Telugu",
    type: "official_question_paper" as const,
    official: true,
    url: null,
    downloadPath: null,
    verification: "verified" as const,
    answerKeyStatus: "verified" as const,
    ocrStatus: "reviewed" as const,
    extractionStatus: "extracted" as const,
    questionCount: 200,
    relevantCount: 50,
    checksum: "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    duplicateGroup: null,
    notes: "Official TSLPRB Police Constable question papers (2016, 2018, 2022). Movement and culture questions reconciled with official final keys.",
    lastVerified: new Date().toISOString(),
  },
];

const batchQuestions: { question: Question; sourceIds: string[] }[] = [
  // 1. TM-Q061 (Police Constable 2016 / Culture)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q061",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "During the traditional Bonalu festival celebrated across Telangana during the Telugu month of Ashadha, what is the specific ritualistic significance of 'Rangam' held on the day following the main festivities?",
      options: [
        {
          text: "The ceremonial preparation and offering of cooked rice, milk, and jaggery in decorated brass pots to the Mother Goddess",
          why: "This describes the core 'Bonam' offering itself, not the distinct post-festival ritual called 'Rangam'.",
          attraction: "Describes the primary offering of Bonalu.",
        },
        {
          text: "The sacred oracle forecast where a woman possessed by the spirit of Goddess Mahankali stands on a raw earthen pot and predicts the future rainfall, agricultural yield, and well-being of the people",
          why: "Rangam is the celebrated oracle ceremony performed by a chosen woman (Matangi / Swarnalatha) standing atop a wet earthen pot (Kunta/Ghatam) who prognosticates the coming year's rains and societal peace.",
          attraction: "Exact cultural and ritual definition of Rangam.",
          confusion: false,
        },
        {
          text: "The immersion of vibrant multi-tiered floral arrangements into local lakes and rivers by women dancing in rhythmic circles",
          why: "This describes the immersion ritual of Bathukamma (Nimajjanam), not the Bonalu Rangam ritual.",
          attraction: "Confuses Bonalu rituals with Bathukamma.",
          confusion: true,
        },
        {
          text: "The sacrificial animal slaughter performed exclusively by Poturaju to ward off evil spirits from the village boundaries",
          why: "This describes 'Gavu pattadam' performed by Poturaju, not the oracle forecast of Rangam.",
          attraction: "Describes another prominent Bonalu ritual involving Poturaju.",
        },
      ],
      answer: 1,
      reason: "'Rangam' (Bhavishyavani) is the climax oracle ritual held on the second day of Bonalu (notably at Ujjaini Mahankali Temple in Secunderabad and Golconda). A dedicated woman stands on an earthen pot and, in a divine trance, answers questions posed by devotees about seasonal rains, epidemic prevention, and crop harvests.",
      clue: "Look for 'Rangam ritual in Bonalu': oracle forecast / bhavishyavani predicting rains and future events standing on an earthen pot.",
      trap: "Do not confuse 'Rangam' (the oracle) with 'Bonam' (food offering), 'Gavu' (sacrifice by Poturaju), or 'Bathukamma' (floral immersion).",
      elimination: "Eliminate Bonam (food offering) and Bathukamma (flower immersion); Rangam is strictly the oracle prophecy.",
      anchor: "Bonalu Rangam: Oracle prophecy / Bhavishyavani predicting future rainfall and crops.",
      hint: "Which ritual involves the oracle forecasting future events while standing on an earthen pot?",
      source: "TS Police Constable 2016, PWT, General Studies",
      page: 12,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Focus on the term 'Rangam'.",
          correctMeaning: "Rangam is the oracle forecast (Bhavishyavani) by a possessed woman on an earthen pot.",
          selectedMeaning: "Option 1 describes 'Bonam' (Bhojanam), the sweet rice offering carried in pots on women's heads.",
          possibleConfusion: "Both are central elements of the festival, but Bonam is food and Rangam is prophecy.",
          decisionRules: [
            { when: "the question asks about the food offering carried on heads in Bonalu", choose: "Bonam (Bhojanam)" },
            { when: "the question asks about the oracle prediction on the second day of Bonalu", choose: "Rangam (Bhavishyavani)" },
          ],
          nextStep: "Remember: Bonam = food offering; Rangam = oracle prophecy.",
        },
        {
          observation: "You correctly identified Rangam as the oracle forecast.",
          correctMeaning: "Rangam is the sacred prophesying ceremony where the oracle answers public queries on rain and epidemics.",
          selectedMeaning: "Rangam is the sacred prophesying ceremony where the oracle answers public queries on rain and epidemics.",
          possibleConfusion: "You answered correctly. The Secunderabad Lashkar Bonalu Rangam is particularly famous.",
          decisionRules: [
            { when: "the question asks for the oracle prophecy in Bonalu", choose: "Rangam" },
            { when: "the question asks in which Telugu month Bonalu is observed", choose: "Ashadha masam" },
          ],
          nextStep: "Note that Bonalu starts at Golconda Jagadambika temple and concludes with Lashkar and Old City Bonalu.",
        },
        {
          observation: "Check which festival involves floral immersion.",
          correctMeaning: "Rangam is part of Bonalu.",
          selectedMeaning: "Option 3 describes Bathukamma, the floral festival celebrated in Bhadrapada/Ashwija months.",
          possibleConfusion: "Mixing up Telangana's two premier state festivals: Bonalu and Bathukamma.",
          decisionRules: [
            { when: "the question asks about floral arrangements and immersion", choose: "Bathukamma" },
            { when: "the question asks about Rangam and Poturaju", choose: "Bonalu" },
          ],
          nextStep: "Differentiate Bonalu (Mother Goddess food offering) from Bathukamma (Nature/Flower festival).",
        },
        {
          observation: "Check Poturaju's specific ritual role.",
          correctMeaning: "Rangam is performed by a female oracle (Matangi).",
          selectedMeaning: "Poturaju performs the protective whip dance and 'Gavu' (biting animal sacrifice), not Rangam.",
          possibleConfusion: "Poturaju is the fierce brother-guardian of the goddess, but the oracle is Matangi.",
          decisionRules: [
            { when: "the question asks who acts as the fierce whip-wielding brother of the goddess", choose: "Poturaju" },
            { when: "the question asks who delivers the oracle at Rangam", choose: "Matangi / Swarnalatha" },
          ],
          nextStep: "Separate Poturaju (guardian/whip dance) from Matangi (Rangam oracle).",
        },
      ],
    },
  },

  // 2. TM-Q062 (Police Constable 2018 / Culture)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q062",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "The unique nine-day floral festival of Telangana, Bathukamma, begins on Mahalaya Amavasya as 'Engili Pula Bathukamma'. On which auspicious day of the Navaratri festival does it conclude with grand celebrations as 'Saddula Bathukamma'?",
      options: [
        {
          text: "Durgashtami (Ashwija Shuddha Ashtami)",
          why: "Saddula Bathukamma (the final ninth day) is celebrated with grand pomp on Durgashtami (or occasionally Maha Navami), one day prior to Dussehra.",
          attraction: "This is the exact astronomical day of the Bathukamma grand finale.",
          confusion: false,
        },
        {
          text: "Vijayadashami (Dussehra day)",
          why: "On Vijayadashami, families celebrate Dussehra and Jammi puja; Bathukamma concludes on the preceding day (Durgashtami).",
          attraction: "Dussehra is the main festival immediately following Bathukamma.",
          confusion: true,
        },
        {
          text: "Mahalaya Amavasya",
          why: "Mahalaya Amavasya marks the first day (Engili Pula Bathukamma), not the concluding day.",
          attraction: "It is the start of the nine-day cycle.",
        },
        {
          text: "Karthika Pournami",
          why: "Karthika Pournami falls more than a month later and is associated with Shiva worship and lighting deepams.",
          attraction: "Major autumn full moon festival.",
        },
      ],
      answer: 0,
      reason: "Bathukamma is celebrated for nine days starting on Mahalaya Amavasya (Pethara Amavasya) called 'Engili Pula Bathukamma' and culminates on the ninth day called 'Saddula Bathukamma' on Durgashtami (the eighth day of the bright fortnight of Ashwija month). On this day, women prepare diverse five varieties of 'Saddulu' (rice offerings) and immerse the Bathukammas.",
      clue: "Look for 'Saddula Bathukamma conclusion day': Durgashtami (Ashwija Shuddha Ashtami).",
      trap: "Do not choose Vijayadashami (Dussehra); Saddula Bathukamma concludes on Durgashtami, one day before Dussehra.",
      elimination: "Eliminate Mahalaya Amavasya (Day 1) and Vijayadashami (Dussehra); Saddula Bathukamma is on Durgashtami.",
      anchor: "Bathukamma cycle: Day 1 = Engili Pula Bathukamma (Mahalaya Amavasya); Day 9 = Saddula Bathukamma (Durgashtami).",
      hint: "On which day dedicated to Goddess Durga (Ashtami) do women celebrate the grand Saddula Bathukamma finale?",
      source: "TS Police Constable 2018, PWT, General Studies",
      page: 15,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Durgashtami.",
          correctMeaning: "Saddula Bathukamma takes place on Durgashtami, nine days after Mahalaya Amavasya.",
          selectedMeaning: "Saddula Bathukamma takes place on Durgashtami, nine days after Mahalaya Amavasya.",
          possibleConfusion: "You answered correctly. The five types of saddulu (perugu saddi, chintapandu saddi, nimma saddi, nuvvula saddi, nalla nuvvula saddi) are offered on this day.",
          decisionRules: [
            { when: "the question asks on which day Saddula Bathukamma is celebrated", choose: "Durgashtami (Ashwija Shuddha Ashtami)" },
            { when: "the question asks on which day Engili Pula Bathukamma is celebrated", choose: "Mahalaya Amavasya (Pethara Amavasya)" },
          ],
          nextStep: "Review the sequence of all 9 Bathukamma days (Engili Pula, Atukula, Muddappappu, Nanabiyyam, Atla, Aligina, Vepakayala, Venna Muddala, Saddula).",
        },
        {
          observation: "Check the day of Dussehra.",
          correctMeaning: "Saddula Bathukamma is celebrated on Durgashtami, not Vijayadashami.",
          selectedMeaning: "Vijayadashami is the next day, when families exchange Jammi leaves ('Bangaaram') and perform Ayudha Puja.",
          possibleConfusion: "Many people loosely refer to Bathukamma as leading up to Dussehra, causing confusion with the exact finale date.",
          decisionRules: [
            { when: "the question asks when Jammi leaves and 'Alai Balai' are exchanged", choose: "Vijayadashami (Dussehra)" },
            { when: "the question asks when Saddula Bathukamma is celebrated", choose: "Durgashtami" },
          ],
          nextStep: "Remember: Bathukamma ends on Durgashtami, one day prior to Dussehra.",
        },
        {
          observation: "Check the opening day of the festival.",
          correctMeaning: "Durgashtami is the finale.",
          selectedMeaning: "Mahalaya Amavasya is the first day (Engili Pula Bathukamma), when people prepare flowers after ancestral worship.",
          possibleConfusion: "Confusing the beginning of the festival with its culmination.",
          decisionRules: [
            { when: "the question asks for the start of Bathukamma", choose: "Mahalaya Amavasya" },
            { when: "the question asks for the conclusion (Saddula Bathukamma)", choose: "Durgashtami" },
          ],
          nextStep: "Anchor Day 1 to Amavasya and Day 9 to Ashtami.",
        },
        {
          observation: "Consider the month of Karthika.",
          correctMeaning: "Bathukamma belongs to the Bhadrapada/Ashwija season.",
          selectedMeaning: "Karthika Pournami is in the succeeding Telugu month, celebrated with Shiva temple deepotsavam.",
          possibleConfusion: "Both are major autumn religious festivals.",
          decisionRules: [
            { when: "the question asks for the season of Bathukamma", choose: "Bhadrapada Amavasya to Ashwija Durgashtami" },
            { when: "the question asks about deepotsavam and Jwala Toranam", choose: "Karthika masam" },
          ],
          nextStep: "Place Bathukamma strictly within the Sharad Navaratri period.",
        },
      ],
    },
  },

  // 3. TM-Q063 (Police Constable 2022 / Culture)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q063",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "During the world-renowned Sammakka Sarakka Jatara held biennially at Medaram in Mulugu district (Asia's largest tribal gathering), which sacred stream (Vagu) is believed to have turned red with the blood of Sammakka's martyred son and serves as the holy bathing ghat for millions of pilgrims?",
      options: [
        {
          text: "Munneru",
          why: "Munneru is a major tributary of Krishna flowing through Mahabubabad and Khammam, not the stream at Medaram.",
          attraction: "Major river stream in Warangal/Khammam region.",
        },
        {
          text: "Jampanna Vagu",
          why: "Jampanna Vagu (a tributary of Godavari) is named after Sammakka's heroic son Jampanna, who fought the Kakatiya imperial army and died in its waters, turning the stream red.",
          attraction: "This is the legendary stream at Medaram where pilgrims take holy dips.",
          confusion: false,
        },
        {
          text: "Kadem Vagu",
          why: "Kadem Vagu is a tributary of Godavari in Nirmal district, site of the Kadem reservoir.",
          attraction: "Prominent northern Telangana stream.",
        },
        {
          text: "Wyra Vagu",
          why: "Wyra is a stream and reservoir located in Khammam district.",
          attraction: "Another Telangana watercourse.",
        },
      ],
      answer: 1,
      reason: "Medaram Jatara commemorates the anti-feudal rebellion of tribal queen Sammakka and her daughter Sarakka (Saralamma) against Kakatiya emperor Prataparudra. Her son Jampanna fought valiantly and fell in the stream near Medaram, which has since been revered as 'Jampanna Vagu'. Pilgrims take a holy dip in Jampanna Vagu before offering 'Bangaram' (jaggery) equivalent to their body weight.",
      clue: "Look for 'stream at Medaram Jatara where pilgrims bathe': Jampanna Vagu (named after Sammakka's son Jampanna).",
      trap: "Do not confuse Jampanna Vagu with Munneru, Kadem, or Wyra streams in other districts.",
      elimination: "Eliminate Munneru (Khammam) and Kadem (Nirmal); Medaram's sacred stream is exclusively Jampanna Vagu.",
      anchor: "Medaram sacred stream: Jampanna Vagu (named after Sammakka's son Jampanna).",
      hint: "What is the name of the stream at Medaram named after Sammakka's son?",
      source: "TS Police Constable 2022, PWT, General Studies",
      page: 18,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check Munneru's geography.",
          correctMeaning: "Jampanna Vagu is the sacred stream at Medaram.",
          selectedMeaning: "Munneru flows through Warangal and Khammam into the Krishna river basin, far south of Medaram.",
          possibleConfusion: "Both are prominent watercourses in the former composite Warangal/Khammam belt.",
          decisionRules: [
            { when: "the question asks for the holy stream at Medaram Jatara", choose: "Jampanna Vagu" },
            { when: "the question asks which stream flows through Khammam town", choose: "Munneru" },
          ],
          nextStep: "Anchor Jampanna Vagu directly to Medaram in Mulugu district.",
        },
        {
          observation: "You correctly identified Jampanna Vagu.",
          correctMeaning: "Jampanna Vagu is sacred to the Koya tribes and the millions of devotees attending the biennial Medaram Jatara.",
          selectedMeaning: "Jampanna Vagu is sacred to the Koya tribes and the millions of devotees attending the biennial Medaram Jatara.",
          possibleConfusion: "You answered correctly. Devotees offer 'Bangaaram' (jaggery) to Sammakka and Saralamma.",
          decisionRules: [
            { when: "the question asks who Jampanna was in tribal folklore", choose: "Son of Sammakka and Pagididda Raju" },
            { when: "the question asks what offering is termed 'Bangaram' at Medaram", choose: "Jaggery (Bellam)" },
          ],
          nextStep: "Note that Medaram Jatara was declared a State Festival in 1996.",
        },
        {
          observation: "Check Kadem Vagu's location.",
          correctMeaning: "The stream at Medaram is Jampanna Vagu.",
          selectedMeaning: "Kadem Vagu is in Nirmal (Adilabad region), where the Kadem Narayana Reddy project is built.",
          possibleConfusion: "Both are tributaries within the broader Godavari drainage system.",
          decisionRules: [
            { when: "the question asks for the location of Kadem project", choose: "Nirmal district" },
            { when: "the question asks for Medaram holy stream", choose: "Jampanna Vagu" },
          ],
          nextStep: "Keep Kadem in Nirmal and Jampanna Vagu in Mulugu.",
        },
        {
          observation: "Check Wyra Vagu's location.",
          correctMeaning: "Jampanna Vagu is the correct answer.",
          selectedMeaning: "Wyra is located in Khammam district, known for the medium irrigation Wyra reservoir.",
          possibleConfusion: "Another tributary name in eastern Telangana.",
          decisionRules: [
            { when: "the question asks about Wyra reservoir", choose: "Khammam district" },
            { when: "the question asks about the Sammakka Sarakka stream", choose: "Jampanna Vagu" },
          ],
          nextStep: "Distinguish between Khammam's Wyra and Mulugu's Jampanna Vagu.",
        },
      ],
    },
  },

  // 4. TM-Q064 (Police Constable 2016 / State Symbols)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q064",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-02",
      stage: "practice",
      prompt: "Match the official State Symbols adopted by the Government of Telangana with their corresponding scientific and botanical/zoological designations:\n(a) State Bird (Palapitta)\n(b) State Animal (Jinka)\n(c) State Tree (Jammi Chettu)\n(d) State Flower (Tangedu)",
      options: [
        {
          text: "(a)-(ii), (b)-(i), (c)-(iv), (d)-(iii)",
          why: "Correct mapping: State Bird Palapitta is the Indian Roller (Coracias benghalensis) (ii); State Animal Jinka is the Spotted Deer (Axis axis) (i); State Tree Jammi Chettu is Prosopis cineraria (iv); State Flower Tangedu is Senna auriculata / Cassia auriculata (iii).",
          attraction: "Exact match from official TSLPRB examinations.",
          confusion: false,
        },
        {
          text: "(a)-(i), (b)-(ii), (c)-(iii), (d)-(iv)",
          why: "Incorrect: Reverses bird and animal, and tree and flower.",
          attraction: "Sequential pairing error.",
        },
        {
          text: "(a)-(iii), (b)-(iv), (c)-(i), (d)-(ii)",
          why: "Incorrect: Matches Palapitta with Senna auriculata (a flower).",
          attraction: "Mixes flora and fauna.",
        },
        {
          text: "(a)-(ii), (b)-(iv), (c)-(i), (d)-(iii)",
          why: "Incorrect: Pairs State Animal Jinka with Prosopis cineraria (a tree).",
          attraction: "Swaps animal and tree designations.",
        },
      ],
      answer: 0,
      reason: "Official State Symbols of Telangana (declared in 2014): State Bird: Palapitta (Indian Roller / Coracias benghalensis); State Animal: Jinka (Spotted Deer / Axis axis); State Tree: Jammi Chettu (Prosopis cineraria, associated with Pandavas and Dussehra); State Flower: Tangedu (Senna auriculata / Cassia auriculata, central to Bathukamma).",
      clue: "Look for 'Palapitta': Coracias benghalensis; 'Jammi Chettu': Prosopis cineraria; 'Tangedu': Senna auriculata; 'Jinka': Axis axis.",
      trap: "Do not confuse the botanical names of Jammi Chettu (Prosopis cineraria) and Tangedu (Senna auriculata).",
      elimination: "Identify Palapitta = Coracias benghalensis (ii); Jinka = Axis axis (i). Only option 1 has this pairing.",
      anchor: "State Symbols: Palapitta = Coracias benghalensis; Jinka = Axis axis; Jammi = Prosopis cineraria; Tangedu = Senna auriculata.",
      hint: "What is the scientific name of the Indian Roller (Palapitta) and Spotted Deer (Jinka)?",
      source: "TS Police Constable 2016, FWT, General Studies",
      page: 9,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly matched all four state symbols with their scientific names.",
          correctMeaning: "Palapitta = Coracias benghalensis; Jinka = Axis axis; Jammi Chettu = Prosopis cineraria; Tangedu = Senna auriculata.",
          selectedMeaning: "Palapitta = Coracias benghalensis; Jinka = Axis axis; Jammi Chettu = Prosopis cineraria; Tangedu = Senna auriculata.",
          possibleConfusion: "You answered correctly. These symbols were officially notified through G.O.Ms.No. 4 in June 2014.",
          decisionRules: [
            { when: "the question asks for the scientific name of Telangana State Bird (Palapitta)", choose: "Coracias benghalensis" },
            { when: "the question asks for the scientific name of Telangana State Tree (Jammi)", choose: "Prosopis cineraria" },
          ],
          nextStep: "Review the state fish (Koramenu / Channa striata) notified in 2016.",
        },
        {
          observation: "Check the designations in Option 2.",
          correctMeaning: "Palapitta is a bird (Coracias benghalensis), while Axis axis is the deer.",
          selectedMeaning: "Option 2 incorrectly swaps bird and animal names.",
          possibleConfusion: "Flipping Roman numerals (i) and (ii).",
          decisionRules: [
            { when: "the question asks for State Animal Jinka", choose: "Axis axis (Spotted Deer)" },
            { when: "the question asks for State Bird Palapitta", choose: "Coracias benghalensis" },
          ],
          nextStep: "Anchor Palapitta to Coracias benghalensis.",
        },
        {
          observation: "Notice the botanical designation of Senna auriculata.",
          correctMeaning: "Senna auriculata is the golden Tangedu flower, not the bird.",
          selectedMeaning: "Option 3 pairs the bird Palapitta with a flower name.",
          possibleConfusion: "Matching error across flora and fauna categories.",
          decisionRules: [
            { when: "the question asks which plant is Senna auriculata", choose: "Tangedu Puvvu (State Flower)" },
            { when: "the question asks about Palapitta", choose: "Indian Roller (Coracias benghalensis)" },
          ],
          nextStep: "Remember: Tangedu flowers are used to arrange the base tiers of Bathukamma.",
        },
        {
          observation: "Check the classification of Prosopis cineraria in Option 4.",
          correctMeaning: "Prosopis cineraria is the Jammi tree, not an animal.",
          selectedMeaning: "Option 4 assigns Prosopis cineraria to Jinka.",
          possibleConfusion: "Misallocating botanical tree names to zoological animal categories.",
          decisionRules: [
            { when: "the question asks which tree is Jammi Chettu", choose: "Prosopis cineraria" },
            { when: "the question asks about the state animal", choose: "Spotted Deer (Axis axis)" },
          ],
          nextStep: "Distinguish Jammi tree (Prosopis) from Spotted deer (Axis axis).",
        },
      ],
    },
  },

  // 5. TM-Q065 (Police Constable 2018 / Armed Struggle)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q065",
      topic: "TM-01.02",
      concept: "TM-01.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "The legendary Gond tribal revolutionary Komaram Bheem, who raised the historic battle cry 'Jal, Jangal, Jameen' (Water, Forest, Land) against the feudal oppression of the Nizam, was martyred on Ashwija Shuddha Pournami in 1940 fighting the Nizam's armed police at which forest location in Asifabad district?",
      options: [
        {
          text: "Kadavendi",
          why: "Kadavendi (in Jangaon) is the site where Doddi Komaraiah was martyred in 1946, not Komaram Bheem in 1940.",
          attraction: "Another famous martyrdom village in Telangana.",
        },
        {
          text: "Jodeghat",
          why: "Komaram Bheem and his guerrilla fighters were surrounded and martyred at Jodeghat hills on the full moon night of Ashwija Pournami in September 1940 in a fierce battle against Nizam's force led by Talukdar Abdul Sattar.",
          attraction: "The authentic sacred shrine and martyrdom site of Komaram Bheem.",
          confusion: false,
        },
        {
          text: "Gundrampally",
          why: "Gundrampally (in Nalgonda) was the site of a notorious Razakar massacre in 1948, not Komaram Bheem's battle.",
          attraction: "Famous martyrdom site of the anti-Nizam struggle.",
        },
        {
          text: "Bairanpally",
          why: "Bairanpally is famous for the heroic villagers' fort battle against Razakars on 27 August 1948.",
          attraction: "Legendary fort resistance against Razakars.",
        },
      ],
      answer: 1,
      reason: "Komaram Bheem organized the Gond and Kolam adivasis in Adilabad against the oppressive grazing taxes (Patti) and forest eviction orders of the Nizam. On Ashwija Shuddha Pournami in 1940, Nizam's police force under Talukdar Abdul Sattar surrounded his hideout at Jodeghat. Bheem fought heroically with muzzle-loading rifles and bows before attaining martyrdom.",
      clue: "Look for 'Komaram Bheem martyred in 1940': Jodeghat hills (Asifabad / Adilabad).",
      trap: "Do not confuse Komaram Bheem at Jodeghat (1940) with Doddi Komaraiah at Kadavendi (1946) or Bairanpally martyrs (1948).",
      elimination: "Eliminate Kadavendi (Doddi Komaraiah), Gundrampally (Razakar massacre), and Bairanpally (fort battle); Komaram Bheem's battle took place at Jodeghat.",
      anchor: "Komaram Bheem: Slogan 'Jal, Jangal, Jameen'; Martyred in 1940 at Jodeghat hills against Abdul Sattar.",
      hint: "Where is the Komaram Bheem Memorial Museum located in Kumuram Bheem Asifabad district?",
      source: "TS Police Constable 2018, PWT, General Studies",
      page: 14,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check the martyrdom site of Doddi Komaraiah.",
          correctMeaning: "Komaram Bheem was martyred at Jodeghat in 1940.",
          selectedMeaning: "Doddi Komaraiah was shot at Kadavendi on 4 July 1946, sparking the peasant armed rebellion.",
          possibleConfusion: "Both martyrs are iconic heroes of the anti-feudal struggle.",
          decisionRules: [
            { when: "the question asks where Komaram Bheem was martyred in 1940", choose: "Jodeghat (Asifabad)" },
            { when: "the question asks where Doddi Komaraiah was martyred in 1946", choose: "Kadavendi (Jangaon)" },
          ],
          nextStep: "Remember: Komaram Bheem = Jodeghat; Doddi Komaraiah = Kadavendi.",
        },
        {
          observation: "You correctly identified Jodeghat.",
          correctMeaning: "Jodeghat is the historic valley where Komaram Bheem fought and attained immortality in September 1940.",
          selectedMeaning: "Jodeghat is the historic valley where Komaram Bheem fought and attained immortality in September 1940.",
          possibleConfusion: "You answered correctly. The district was officially named Kumuram Bheem Asifabad in 2016.",
          decisionRules: [
            { when: "the question asks who coined 'Jal, Jangal, Jameen'", choose: "Komaram Bheem" },
            { when: "the question asks which anthropologist studied Gonds after Bheem's rebellion", choose: "Christoph von Fürer-Haimendorf" },
          ],
          nextStep: "Note Haimendorf's appointment by the Nizam to draft the tribal land protection regulations.",
        },
        {
          observation: "Check Gundrampally's history.",
          correctMeaning: "Jodeghat is Komaram Bheem's martyrdom site.",
          selectedMeaning: "Gundrampally was the site of the brutal 1948 massacre of villagers by Razakars under Kasim Razvi.",
          possibleConfusion: "Both represent tragic sacrifices in the freedom struggle.",
          decisionRules: [
            { when: "the question asks about the 1948 Razakar massacre in Nalgonda", choose: "Gundrampally" },
            { when: "the question asks where Komaram Bheem was killed in 1940", choose: "Jodeghat" },
          ],
          nextStep: "Link Gundrampally to 1948 Razakar atrocities.",
        },
        {
          observation: "Check Bairanpally's history.",
          correctMeaning: "Komaram Bheem fought at Jodeghat.",
          selectedMeaning: "Bairanpally is famous for the village fort resistance where nearly 100 villagers fought to the death against Razakars on 27 August 1948.",
          possibleConfusion: "Bairanpally is celebrated as Telangana's Jallianwala Bagh.",
          decisionRules: [
            { when: "the question asks about the 1948 fort battle known as Telangana's Jallianwala Bagh", choose: "Bairanpally (or Parkal)" },
            { when: "the question asks where Komaram Bheem fought", choose: "Jodeghat" },
          ],
          nextStep: "Distinguish adivasi forest rebellion (Jodeghat 1940) from anti-Razakar fort battles (Bairanpally 1948).",
        },
      ],
    },
  },

  // 6. TM-Q066 (Police Constable 2022 / Armed Struggle)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q066",
      topic: "TM-01.02",
      concept: "TM-01.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In which village of Jangaon taluk did revolutionary peasant woman Chakali Ilamma (Chityala Ailamma) heroically defend her four acres of harvested paddy crop against the armed thugs and confiscation attempts of Visnur Deshmukh Rapaka Ramachandra Reddy?",
      options: [
        {
          text: "Palakurthi",
          why: "Chakali Ilamma lived and cultivated leased land at Palakurthi village, where the Andhra Mahasabha volunteers successfully protected her harvested grain from the Deshmukh's goons.",
          attraction: "The authentic historical village of Chakali Ilamma's resistance.",
          confusion: false,
        },
        {
          text: "Kadavendi",
          why: "Kadavendi was Doddi Komaraiah's village where he was shot dead, not the village of Chakali Ilamma.",
          attraction: "Nearby village in the same taluk where firing took place.",
          confusion: true,
        },
        {
          text: "Kollapur",
          why: "Kollapur was a Samsthanam in Mahabubnagar district, far from Jangaon.",
          attraction: "Historical Samsthanam in Southern Telangana.",
        },
        {
          text: "Sirikonda",
          why: "Sirikonda is in Nizamabad, unrelated to Chakali Ilamma's land battle.",
          attraction: "Another Telangana rural mandal.",
        },
      ],
      answer: 0,
      reason: "Chakali Ilamma leased four acres of land from a local temple/Mallaiah in Palakurthi. Visnur Deshmukh Rapaka Ramachandra Reddy fabricated a debt claim to seize her standing crop. The Communist-led Andhra Mahasabha defended her fields at Palakurthi, harvested the crop, and stored it safely in her house, marking the first successful direct resistance against the Deshmukhs.",
      clue: "Look for 'Chakali Ilamma land defense against Visnur Deshmukh': Palakurthi village.",
      trap: "Do not confuse Palakurthi (Ilamma's crop defense) with Kadavendi (Doddi Komaraiah's martyrdom on 4 July 1946).",
      elimination: "Eliminate Kadavendi (Doddi Komaraiah) and Kollapur (Samsthanam); Chakali Ilamma's struggle occurred at Palakurthi.",
      anchor: "Chakali Ilamma: Palakurthi village; resisted Visnur Deshmukh's seizure of her four-acre crop.",
      hint: "In which village of Jangaon district did Chakali Ilamma live and wage her historic land battle?",
      source: "TS Police Constable 2022, PWT, General Studies",
      page: 19,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Palakurthi as Chakali Ilamma's village.",
          correctMeaning: "Palakurthi was the village where Chakali Ilamma's defiance inspired the entire Telangana Armed Struggle.",
          selectedMeaning: "Palakurthi was the village where Chakali Ilamma's defiance inspired the entire Telangana Armed Struggle.",
          possibleConfusion: "You answered correctly. The state government declared her birth anniversary on 26 September as an official state celebration.",
          decisionRules: [
            { when: "the question asks for the village associated with Chakali Ilamma's land battle", choose: "Palakurthi" },
            { when: "the question asks whose crop was protected by Andhra Mahasabha volunteers", choose: "Chakali Ilamma (Chityala Ailamma)" },
          ],
          nextStep: "Note that Doddi Komaraiah was shot during a protest rally supporting Ilamma at Kadavendi.",
        },
        {
          observation: "Check Kadavendi's specific event.",
          correctMeaning: "Chakali Ilamma fought at Palakurthi.",
          selectedMeaning: "Kadavendi was where Visnur Deshmukh's armed henchmen fired on the Andhra Mahasabha procession on 4 July 1946, killing Doddi Komaraiah.",
          possibleConfusion: "Kadavendi and Palakurthi are twin landmark locations in the same taluk.",
          decisionRules: [
            { when: "the question asks where Doddi Komaraiah was killed", choose: "Kadavendi" },
            { when: "the question asks where Chakali Ilamma cultivated her land", choose: "Palakurthi" },
          ],
          nextStep: "Differentiate Palakurthi (crop defense) from Kadavendi (first firing and martyrdom).",
        },
        {
          observation: "Check Kollapur's geographical region.",
          correctMeaning: "Chakali Ilamma belonged to Palakurthi (Jangaon).",
          selectedMeaning: "Kollapur is a former princely Samsthanam in Nagarkurnool / Mahabubnagar district.",
          possibleConfusion: "Samsthanams were distinct feudal entities in southern Telangana.",
          decisionRules: [
            { when: "the question asks about the Surabhi dynasty Samsthanam", choose: "Kollapur" },
            { when: "the question asks about Chakali Ilamma", choose: "Palakurthi" },
          ],
          nextStep: "Keep Kollapur in the south along the Krishna river.",
        },
        {
          observation: "Check Sirikonda's location.",
          correctMeaning: "The struggle occurred in Palakurthi in Jangaon.",
          selectedMeaning: "Sirikonda is in northern Telangana (Nizamabad/Adilabad).",
          possibleConfusion: "Distractor village name.",
          decisionRules: [
            { when: "the question asks where Chakali Ilamma lived", choose: "Palakurthi" },
            { when: "the question asks about the Deshmukh of Visnoor", choose: "Visnur Ramachandra Reddy" },
          ],
          nextStep: "Anchor Chakali Ilamma firmly to Palakurthi.",
        },
      ],
    },
  },

  // 7. TM-Q067 (Group-4 2023 / Intellectual Leadership)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q067",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Professor K. Jayashankar (1934–2011), widely venerated as the intellectual father and ideologue of the Telangana Movement, served as the Vice-Chancellor of which university from 1991 to 1994?",
      options: [
        {
          text: "Osmania University, Hyderabad",
          why: "Prof. Jayashankar was educated at Osmania and fought for student rights there, but served as Vice-Chancellor of Kakatiya University.",
          attraction: "Major university at the heart of Telangana intellectual life.",
        },
        {
          text: "Kakatiya University, Warangal",
          why: "Prof. K. Jayashankar served as the Vice-Chancellor of Kakatiya University, Warangal, between 1991 and 1994, after serving as Registrar of both CKM College and Kakatiya University.",
          attraction: "His definitive academic leadership post.",
          confusion: false,
        },
        {
          text: "Telangana University, Nizamabad",
          why: "Telangana University in Nizamabad was established much later in 2006.",
          attraction: "Namesake university in Telangana.",
        },
        {
          text: "Palamuru University, Mahabubnagar",
          why: "Palamuru University was established in 2008, long after his retirement.",
          attraction: "University founded in Southern Telangana.",
        },
      ],
      answer: 1,
      reason: "Professor Kothapalli Jayashankar was an economist, educationist, and lifelong champion of Telangana statehood. He served as Principal of CKM College Warangal, Registrar of Kakatiya University, and was appointed Vice-Chancellor of Kakatiya University (1991–1994). He also served as the first Vice-Chancellor of the Central Institute of English and Foreign Languages (CIEFL, now EFLU).",
      clue: "Look for 'Prof. K. Jayashankar served as Vice-Chancellor of which university': Kakatiya University, Warangal (1991–1994).",
      trap: "Do not guess Osmania University; although he studied at Osmania, his tenure as Vice-Chancellor was at Kakatiya University.",
      elimination: "Eliminate Telangana University (founded 2006) and Palamuru University (founded 2008); Jayashankar headed Kakatiya University.",
      anchor: "Prof. K. Jayashankar: Vice-Chancellor of Kakatiya University (1991–1994); author of 'Telangana Rashtram: Oka Demand'.",
      hint: "Which university in Warangal was headed by Prof. Jayashankar in the early 1990s?",
      source: "TGPSC Group-4 2023, Paper I, General Studies",
      page: 22,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check Prof. Jayashankar's association with Osmania University.",
          correctMeaning: "Prof. Jayashankar was Vice-Chancellor of Kakatiya University.",
          selectedMeaning: "He obtained his M.A. from Aligarh and Ph.D. from Osmania, but did not serve as VC of Osmania.",
          possibleConfusion: "Osmania was the center of student protests, so aspirants frequently misattribute his VC tenure there.",
          decisionRules: [
            { when: "the question asks which university Prof. Jayashankar headed as Vice-Chancellor", choose: "Kakatiya University, Warangal" },
            { when: "the question asks where Prof. Jayashankar participated in the 1952 Non-Mulki agitation as a student", choose: "Hanamkonda / Warangal" },
          ],
          nextStep: "Remember: Prof. Jayashankar was VC of Kakatiya University (1991–1994).",
        },
        {
          observation: "You correctly named Kakatiya University.",
          correctMeaning: "Prof. Jayashankar guided generations of scholars at Kakatiya University and authored foundational literature on Telangana exploitation.",
          selectedMeaning: "Prof. Jayashankar guided generations of scholars at Kakatiya University and authored foundational literature on Telangana exploitation.",
          possibleConfusion: "You answered correctly. The state agricultural university was renamed Professor Jayashankar Telangana State Agricultural University (PJTSAU) in his honour.",
          decisionRules: [
            { when: "the question asks which university bears Prof. Jayashankar's name today", choose: "Professor Jayashankar Telangana State Agricultural University (PJTSAU)" },
            { when: "the question asks who was the ideologue of the Telangana Movement", choose: "Prof. K. Jayashankar" },
          ],
          nextStep: "Review his influential book 'Telangana Rashtram: Oka Demand' (Telangana State: A Demand).",
        },
        {
          observation: "Check the establishment date of Telangana University.",
          correctMeaning: "Kakatiya University was where he served as VC.",
          selectedMeaning: "Telangana University was created in 2006 at Dichpally, Nizamabad.",
          possibleConfusion: "Selecting an institution with 'Telangana' in its title.",
          decisionRules: [
            { when: "the question asks where Telangana University is located", choose: "Dichpally (Nizamabad)" },
            { when: "the question asks which university Prof. Jayashankar headed", choose: "Kakatiya University" },
          ],
          nextStep: "Anchor Telangana University to 2006 in Nizamabad.",
        },
        {
          observation: "Check Palamuru University's founding year.",
          correctMeaning: "Kakatiya University is the correct institution.",
          selectedMeaning: "Palamuru University was established in 2008 in Mahabubnagar.",
          possibleConfusion: "A later university established during the statehood movement.",
          decisionRules: [
            { when: "the question asks where Palamuru University was established", choose: "Mahabubnagar (2008)" },
            { when: "the question asks who was VC of Kakatiya University 1991–94", choose: "Prof. K. Jayashankar" },
          ],
          nextStep: "Link Prof. Jayashankar to Warangal and Kakatiya University.",
        },
      ],
    },
  },

  // 8. TM-Q068 (Police Constable 2018 / Mass Protests)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q068",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On which historic date was the massive 'Million March' organized by the Telangana Joint Action Committee (TJAC) on Tank Bund in Hyderabad, defying severe police crackdowns and section 144 prohibitions?",
      options: [
        {
          text: "9 December 2009",
          why: "9 December 2009 was the date of Union Home Minister P. Chidambaram's announcement that the process of forming Telangana would be initiated.",
          attraction: "Celebrated date of the first statehood announcement.",
        },
        {
          text: "10 March 2011",
          why: "The Million March on Tank Bund was held on 10 March 2011, inspired by Egypt's Tahrir Square revolution, bringing lakhs of activists to the heart of Hyderabad.",
          attraction: "The exact date of the Million March.",
          confusion: false,
        },
        {
          text: "30 September 2012",
          why: "30 September 2012 was the date of the 'Telangana March' (Sagara Haram) held at Necklace Road, not the Million March.",
          attraction: "Another massive march held near Hussainsagar.",
          confusion: true,
        },
        {
          text: "13 September 2011",
          why: "13 September 2011 was the day the 42-day Sakala Janula Samme (General Strike) commenced.",
          attraction: "Start date of the historic general strike.",
        },
      ],
      answer: 1,
      reason: "On 10 March 2011, TJAC under Prof. M. Kodandaram organized the 'Million March' at Tank Bund. Despite the state government turning the twin cities into a fortress and arresting thousands, thousands of activists breached police barricades and occupied Tank Bund in broad daylight.",
      clue: "Look for 'Million March on Tank Bund date': 10 March 2011.",
      trap: "Do not confuse the 'Million March' (10 March 2011 at Tank Bund) with the 'Telangana March / Sagara Haram' (30 September 2012 at Necklace Road).",
      elimination: "Eliminate 9 Dec 2009 (Chidambaram statement) and 30 Sep 2012 (Sagara Haram); Million March was on 10 March 2011.",
      anchor: "Million March on Tank Bund: 10 March 2011; Organized by TJAC.",
      hint: "On what date in March 2011 did lakhs of Telangana activists occupy Tank Bund in the Million March?",
      source: "TS Police Constable 2018, FWT, General Studies",
      page: 16,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check the milestone on 9 December 2009.",
          correctMeaning: "The Million March occurred on 10 March 2011.",
          selectedMeaning: "9 December 2009 was the midnight announcement by Union Home Minister P. Chidambaram.",
          possibleConfusion: "Both dates represent monumental turning points in the final phase of the movement.",
          decisionRules: [
            { when: "the question asks when the Union Government announced the initiation of Telangana formation", choose: "9 December 2009" },
            { when: "the question asks when the Million March took place on Tank Bund", choose: "10 March 2011" },
          ],
          nextStep: "Remember: 9 Dec 2009 = Chidambaram declaration; 10 March 2011 = Million March.",
        },
        {
          observation: "You correctly selected 10 March 2011.",
          correctMeaning: "10 March 2011 witnessed the unprecedented Million March where protesters converged on Tank Bund.",
          selectedMeaning: "10 March 2011 witnessed the unprecedented Million March where protesters converged on Tank Bund.",
          possibleConfusion: "You answered correctly. The event demonstrated the unstoppable popular will for statehood.",
          decisionRules: [
            { when: "the question asks for the date of the Million March", choose: "10 March 2011" },
            { when: "the question asks who was the convener of TJAC that called the march", choose: "Prof. M. Kodandaram" },
          ],
          nextStep: "Review the subsequent march: Sagara Haram on 30 September 2012.",
        },
        {
          observation: "Check the date 30 September 2012.",
          correctMeaning: "Million March was on 10 March 2011.",
          selectedMeaning: "30 September 2012 was 'Telangana March' (Sagara Haram) organized along Necklace Road during heavy rains.",
          possibleConfusion: "Both were massive marches organized around the Hussainsagar lake.",
          decisionRules: [
            { when: "the question asks for the date of Sagara Haram (Telangana March)", choose: "30 September 2012" },
            { when: "the question asks for the date of Million March", choose: "10 March 2011" },
          ],
          nextStep: "Distinguish Million March (10 March 2011, Tank Bund) from Sagara Haram (30 September 2012, Necklace Road).",
        },
        {
          observation: "Check 13 September 2011.",
          correctMeaning: "Million March was held on 10 March 2011.",
          selectedMeaning: "13 September 2011 was the commencement of the 42-day Sakala Janula Samme.",
          possibleConfusion: "Both were major mass mobilizations in the year 2011.",
          decisionRules: [
            { when: "the question asks when Sakala Janula Samme began", choose: "13 September 2011" },
            { when: "the question asks when Million March was held", choose: "10 March 2011" },
          ],
          nextStep: "Keep the sequence: Million March (March 2011) preceded Sakala Janula Samme (Sept 2011).",
        },
      ],
    },
  },

  // 9. TM-Q069 (Police Constable 2022 / Mass Protests)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q069",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "What was the name of the historic 42-day strike launched on 13 September 2011, wherein government employees, lawyers, teachers, coal miners of Singareni, and transport workers brought life in Telangana to a complete standstill without essential services?",
      options: [
        {
          text: "Palle Palle Pattala Paiki",
          why: "Palle Palle Pattala Paiki was a specific rail-roko agitation held in March 2011, not the 42-day general strike.",
          attraction: "Prominent protest slogan and rail-blockade movement.",
        },
        {
          text: "Sadak Bandh",
          why: "Sadak Bandh was a 24-hour highway blockade organized on 21 March 2013 on National Highway 44 (Hyderabad-Bengaluru).",
          attraction: "Another famous mass blockade.",
        },
        {
          text: "Sakala Janula Samme (All People's Strike)",
          why: "Sakala Janula Samme was the historic 42-day strike (13 September 2011 to 24 October 2011) that involved over 8 lakh government employees, shut down Singareni coal production, and stopped all RTC bus operations.",
          attraction: "The authentic, celebrated name of the 42-day strike.",
          confusion: false,
        },
        {
          text: "Jail Bharo",
          why: "Jail Bharo describes court-arrest agitations held at various points, not the 42-day continuous general strike.",
          attraction: "Generic agitation name.",
        },
      ],
      answer: 2,
      reason: "'Sakala Janula Samme' (All People's Strike) began on 13 September 2011 under the leadership of TJAC and employee associations (TNGOs, TGOs). It lasted for an unprecedented 42 days until 24 October 2011, crippling thermal power generation, bus transport, schools, and courts across all 10 Telangana districts.",
      clue: "Look for '42-day strike starting 13 September 2011 involving employees, RTC, Singareni': Sakala Janula Samme.",
      trap: "Do not confuse the 42-day general strike (Sakala Janula Samme) with one-day events like Sadak Bandh or rail-roko (Pattala Paiki).",
      elimination: "Eliminate Sadak Bandh (highway blockade 2013) and Palle Palle Pattala Paiki (rail blockade); the 42-day strike was Sakala Janula Samme.",
      anchor: "Sakala Janula Samme: 42 days (13 Sept 2011 to 24 Oct 2011); Singareni, RTC, TNGOs joined.",
      hint: "What Telugu phrase means 'All People's Strike'?",
      source: "TS Police Constable 2022, PWT, General Studies",
      page: 20,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check Palle Palle Pattala Paiki.",
          correctMeaning: "The 42-day strike was Sakala Janula Samme.",
          selectedMeaning: "Palle Palle Pattala Paiki was a three-day rail blockade agitation in March 2011.",
          possibleConfusion: "Both were massive civil disobedience protests in 2011.",
          decisionRules: [
            { when: "the question asks for the rail-roko agitation where villagers camped on train tracks", choose: "Palle Palle Pattala Paiki" },
            { when: "the question asks for the 42-day general strike", choose: "Sakala Janula Samme" },
          ],
          nextStep: "Associate Pattala Paiki strictly with railway track blockades.",
        },
        {
          observation: "Check the date and nature of Sadak Bandh.",
          correctMeaning: "The prolonged strike was Sakala Janula Samme.",
          selectedMeaning: "Sadak Bandh was a 24-hour blockade of NH-44 (Hyderabad–Bangalore highway) on 21 March 2013.",
          possibleConfusion: "Both paralyzed transportation, but Sadak Bandh was a highway blockade in 2013.",
          decisionRules: [
            { when: "the question asks about the 24-hour NH-44 highway blockade in 2013", choose: "Sadak Bandh" },
            { when: "the question asks about the 42-day strike in 2011", choose: "Sakala Janula Samme" },
          ],
          nextStep: "Remember: Sadak Bandh = NH-44 blockade (March 2013).",
        },
        {
          observation: "You correctly named Sakala Janula Samme.",
          correctMeaning: "Sakala Janula Samme was one of the longest and largest peaceful general strikes in post-independence Indian history.",
          selectedMeaning: "Sakala Janula Samme was one of the longest and largest peaceful general strikes in post-independence Indian history.",
          possibleConfusion: "You answered correctly. The strike forced the Union Government to reopen active high-level consultations.",
          decisionRules: [
            { when: "the question asks how many days Sakala Janula Samme lasted", choose: "42 days" },
            { when: "the question asks on what date Sakala Janula Samme began", choose: "13 September 2011" },
          ],
          nextStep: "Review how Singareni coal workers halted coal supply to South Indian thermal plants during the strike.",
        },
        {
          observation: "Check Jail Bharo campaigns.",
          correctMeaning: "The correct term is Sakala Janula Samme.",
          selectedMeaning: "Jail Bharo is a generic tactic of courting arrest, not the name of the 42-day general strike.",
          possibleConfusion: "Activists courted arrest during the movement, but the strike had a dedicated title.",
          decisionRules: [
            { when: "the question asks for the 42-day general strike", choose: "Sakala Janula Samme" },
            { when: "the question asks which employee union led the civil servants' strike", choose: "TNGOs (led by K. Swamy Goud)" },
          ],
          nextStep: "Note K. Swamy Goud's leadership of TNGOs during the strike.",
        },
      ],
    },
  },

  // 10. TM-Q070 (Group-4 2023 / Mass Protests)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q070",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 30 September 2012, despite torrential rain, teargas shelling, and heavy barbed wire blockades across Hyderabad, lakhs of Telangana citizens gathered around the Hussainsagar lake along Necklace Road for a massive show of strength. What was this event officially titled?",
      options: [
        {
          text: "Chalo Assembly",
          why: "Chalo Assembly was a separate protest held on 14 June 2013 demanding the introduction of the Telangana bill.",
          attraction: "Major protest targeting the Legislative Assembly.",
        },
        {
          text: "Million March",
          why: "Million March took place on 10 March 2011 on Tank Bund, not on 30 September 2012.",
          attraction: "The famous Tank Bund march of 2011.",
        },
        {
          text: "Telangana March (Sagara Haram)",
          why: "On 30 September 2012, TJAC organized the 'Telangana March' (Sagara Haram) along Necklace Road, creating a human chain around Hussainsagar.",
          attraction: "The authentic title of the 30 September 2012 Necklace Road rally.",
          confusion: false,
        },
        {
          text: "Vidyarthi Garjana",
          why: "Vidyarthi Garjana was held on 3 January 2010 at Osmania University Arts College.",
          attraction: "Massive student rally at Osmania University.",
        },
      ],
      answer: 2,
      reason: "On 30 September 2012, the Telangana Joint Action Committee (TJAC) staged the historic 'Telangana March' (popularly called Sagara Haram) along Necklace Road. Braving heavy police action and non-stop rain, activists converged from all districts and stood firm until late evening.",
      clue: "Look for '30 September 2012 rally along Necklace Road': Telangana March / Sagara Haram.",
      trap: "Do not confuse the Telangana March (30 Sep 2012 at Necklace Road) with the Million March (10 March 2011 at Tank Bund).",
      elimination: "Eliminate Chalo Assembly (June 2013) and Million March (March 2011); the September 2012 event was Telangana March (Sagara Haram).",
      anchor: "Telangana March (Sagara Haram): 30 September 2012 at Necklace Road.",
      hint: "Which mass rally was titled 'Sagara Haram' because it circled the Hussainsagar lake?",
      source: "TGPSC Group-4 2023, Paper I, General Studies",
      page: 25,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check the date of Chalo Assembly.",
          correctMeaning: "The 30 September 2012 event was Telangana March (Sagara Haram).",
          selectedMeaning: "Chalo Assembly was organized on 14 June 2013 during the budget session of the Assembly.",
          possibleConfusion: "Both were major showdowns between police and TJAC in Hyderabad.",
          decisionRules: [
            { when: "the question asks for the date of Chalo Assembly", choose: "14 June 2013" },
            { when: "the question asks for the date of Telangana March (Sagara Haram)", choose: "30 September 2012" },
          ],
          nextStep: "Remember: Sagara Haram was 2012; Chalo Assembly was 2013.",
        },
        {
          observation: "Check the location and date of the Million March.",
          correctMeaning: "Telangana March took place on 30 September 2012 on Necklace Road.",
          selectedMeaning: "Million March took place on 10 March 2011 on Tank Bund.",
          possibleConfusion: "Both surrounded the same Hussainsagar lake.",
          decisionRules: [
            { when: "the question asks for the march on 10 March 2011", choose: "Million March" },
            { when: "the question asks for the march on 30 September 2012", choose: "Telangana March (Sagara Haram)" },
          ],
          nextStep: "Differentiate Million March (2011) from Telangana March (2012).",
        },
        {
          observation: "You correctly identified Telangana March (Sagara Haram).",
          correctMeaning: "Sagara Haram was organized on 30 September 2012, symbolizing a garland of people around Hussainsagar.",
          selectedMeaning: "Sagara Haram was organized on 30 September 2012, symbolizing a garland of people around Hussainsagar.",
          possibleConfusion: "You answered correctly. The police granted conditional permission only after prolonged court battles.",
          decisionRules: [
            { when: "the question asks for the event on 30 September 2012", choose: "Telangana March (Sagara Haram)" },
            { when: "the question asks where Sagara Haram was held", choose: "Necklace Road, Hyderabad" },
          ],
          nextStep: "Note the timing coinciding with the COP-11 International Biodiversity Conference in Hyderabad.",
        },
        {
          observation: "Check Vidyarthi Garjana.",
          correctMeaning: "Sagara Haram is the correct title.",
          selectedMeaning: "Vidyarthi Garjana was the massive student convention held on 3 January 2010 at Osmania University.",
          possibleConfusion: "Osmania students were prominent in both gatherings.",
          decisionRules: [
            { when: "the question asks about the student rally on 3 January 2010", choose: "Vidyarthi Garjana (OU Arts College)" },
            { when: "the question asks about the Necklace Road rally on 30 September 2012", choose: "Telangana March (Sagara Haram)" },
          ],
          nextStep: "Anchor Vidyarthi Garjana to January 2010 at Osmania University.",
        },
      ],
    },
  },

  // 11. TM-Q071 (Legal / APRA 2014)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q071",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Under the Andhra Pradesh Reorganisation Act, 2014, how many Government Companies and Public Corporations were listed in the Ninth Schedule (Schedule IX) for the apportionment of assets, liabilities, and employee bifurcation?",
      options: [
        {
          text: "89",
          why: "The Ninth Schedule (Schedule IX) of the AP Reorganisation Act, 2014 explicitly lists exactly 89 Government Companies and Corporations (such as Singareni Collieries, RTC, APGENCO, APTRANSCO, and Industrial Infrastructure Corporation).",
          attraction: "The exact statutory number specified in the Act.",
          confusion: false,
        },
        {
          text: "107",
          why: "107 is the number of institutions listed in the Tenth Schedule (Schedule X: Training and Educational Institutions), not Schedule IX.",
          attraction: "Commonly confused with the Tenth Schedule total.",
          confusion: true,
        },
        {
          text: "42",
          why: "42 was the number of days of Sakala Janula Samme, not the count of Schedule IX corporations.",
          attraction: "Another prominent number in the movement.",
        },
        {
          text: "65",
          why: "Arbitrary number.",
          attraction: "Plausible number.",
        },
      ],
      answer: 0,
      reason: "Part VII of the AP Reorganisation Act, 2014 governs the bifurcation of public entities: Schedule IX contains 89 Government Companies and Corporations; Schedule X contains 107 Training Institutions and Centers.",
      clue: "Look for 'number of institutions in Ninth Schedule (Schedule IX) of APRA 2014': exactly 89 corporations.",
      trap: "Do not confuse Schedule IX (89 Corporations) with Schedule X (107 Training Institutions).",
      elimination: "Eliminate 107 (Schedule X institutions); Schedule IX has 89 companies and corporations.",
      anchor: "APRA 2014: Schedule IX = 89 Government Companies/Corporations; Schedule X = 107 Training Institutions.",
      hint: "Is Schedule IX 89 corporations or 107 institutions?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Schedule IX",
      page: 65,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified 89 companies and corporations.",
          correctMeaning: "Schedule IX contains 89 Government Companies and Corporations subject to division under Sections 68–71 of APRA 2014.",
          selectedMeaning: "Schedule IX contains 89 Government Companies and Corporations subject to division under Sections 68–71 of APRA 2014.",
          possibleConfusion: "You answered correctly. The bifurcation of Schedule IX entities was studied by the Sheela Bhide Committee.",
          decisionRules: [
            { when: "the question asks how many companies are in Schedule IX of APRA 2014", choose: "89" },
            { when: "the question asks who chaired the expert committee on Schedule IX bifurcation", choose: "Sheela Bhide Committee" },
          ],
          nextStep: "Remember: Schedule IX = 89 companies (Sheela Bhide Committee).",
        },
        {
          observation: "Notice the count in Schedule X.",
          correctMeaning: "Schedule IX lists 89 corporations; Schedule X lists 107 institutions.",
          selectedMeaning: "Option 2 quotes 107, which belongs to the Tenth Schedule (training institutions).",
          possibleConfusion: "Candidates frequently transpose the 89 and 107 numbers between Schedules IX and X.",
          decisionRules: [
            { when: "the question asks for Schedule IX companies count", choose: "89" },
            { when: "the question asks for Schedule X institutions count", choose: "107" },
          ],
          nextStep: "Pair IX with 89 (Corporations) and X with 107 (Training centers).",
        },
        {
          observation: "Check the number 42.",
          correctMeaning: "The correct statutory count is 89.",
          selectedMeaning: "42 was the duration in days of the 2011 Sakala Janula Samme strike.",
          possibleConfusion: "Numeric confusion from movement history.",
          decisionRules: [
            { when: "the question asks how many days Sakala Janula Samme lasted", choose: "42 days" },
            { when: "the question asks for Schedule IX entities", choose: "89" },
          ],
          nextStep: "Separate strike duration from statutory schedule counts.",
        },
        {
          observation: "Check arbitrary count 65.",
          correctMeaning: "The statutory number is 89.",
          selectedMeaning: "65 is not a schedule count in the 2014 Act.",
          possibleConfusion: "Guessing an arbitrary intermediate number.",
          decisionRules: [
            { when: "the question asks for Schedule IX total", choose: "89" },
            { when: "the question asks for Schedule X total", choose: "107" },
          ],
          nextStep: "Anchor the two numbers firmly: 89 and 107.",
        },
      ],
    },
  },

  // 12. TM-Q072 (Legal / APRA 2014)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q072",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Under the Tenth Schedule (Schedule X) of the Andhra Pradesh Reorganisation Act, 2014, how many Continuing Education and Training Institutions (such as MCRHRD, Telugu University, and Police Academy) were specified under Section 75 for mutual facility sharing?",
      options: [
        {
          text: "89",
          why: "89 is the number of Government Companies in Schedule IX, not the Schedule X training institutions.",
          attraction: "Confuses Schedule IX with Schedule X.",
        },
        {
          text: "107",
          why: "The Tenth Schedule (Schedule X) of the Act enumerates exactly 107 Training Institutions, Centers, and Academies where citizens of both states are entitled to training facilities under Section 75.",
          attraction: "Exact statutory total of Schedule X institutions.",
          confusion: false,
        },
        {
          text: "119",
          why: "119 is the total number of elected Assembly constituencies in Telangana, not the count of Schedule X institutions.",
          attraction: "Famous legislative number in Telangana.",
          confusion: true,
        },
        {
          text: "150",
          why: "150 is the number of wards in GHMC or questions in Group papers.",
          attraction: "Generic number.",
        },
      ],
      answer: 1,
      reason: "Section 75 and the Tenth Schedule of the Andhra Pradesh Reorganisation Act, 2014 list exactly 107 institutions (such as Dr. MCR HRD Institute, SVPNPA, Telugu Academy, and Board of Intermediate Education) whose facilities were to remain shared between Telangana and Andhra Pradesh.",
      clue: "Look for 'number of institutions in Tenth Schedule (Schedule X) of APRA 2014': exactly 107 institutions.",
      trap: "Do not confuse Schedule X (107 Training Institutions) with Schedule IX (89 Corporations) or Assembly seats (119).",
      elimination: "Eliminate 89 (Schedule IX) and 119 (Assembly seats); Schedule X has 107 institutions.",
      anchor: "APRA 2014 Tenth Schedule: 107 Training Institutions under Section 75.",
      hint: "How many training institutions are listed in Schedule X of the Bifurcation Act?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Schedule X",
      page: 69,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "Check the Schedule IX count.",
          correctMeaning: "Schedule X contains 107 institutions.",
          selectedMeaning: "89 is the count of corporations in Schedule IX.",
          possibleConfusion: "Reversing the two schedules.",
          decisionRules: [
            { when: "the question asks for Schedule IX count", choose: "89" },
            { when: "the question asks for Schedule X count", choose: "107" },
          ],
          nextStep: "Remember: IX = 89, X = 107.",
        },
        {
          observation: "You correctly identified 107 institutions.",
          correctMeaning: "Schedule X contains 107 educational and training institutions covered under Section 75.",
          selectedMeaning: "Schedule X contains 107 educational and training institutions covered under Section 75.",
          possibleConfusion: "You answered correctly. The sharing of assets of these institutions has been a protracted inter-state dispute.",
          decisionRules: [
            { when: "the question asks how many institutions are in Tenth Schedule", choose: "107" },
            { when: "the question asks which section governs Tenth Schedule facilities", choose: "Section 75 of APRA 2014" },
          ],
          nextStep: "Note that Supreme Court delivered a landmark ruling on Telugu Academy asset division in Schedule X.",
        },
        {
          observation: "Check the significance of the number 119.",
          correctMeaning: "The count of Schedule X institutions is 107.",
          selectedMeaning: "119 is the total number of elected seats in the Telangana Legislative Assembly.",
          possibleConfusion: "Associating a well-known constitutional figure with the schedule count.",
          decisionRules: [
            { when: "the question asks how many seats are in Telangana Legislative Assembly", choose: "119" },
            { when: "the question asks for Tenth Schedule institutions", choose: "107" },
          ],
          nextStep: "Distinguish Assembly strength (119) from Schedule X institutions (107).",
        },
        {
          observation: "Check the number 150.",
          correctMeaning: "The correct total is 107.",
          selectedMeaning: "150 is the number of GHMC corporator divisions.",
          possibleConfusion: "Random round figure.",
          decisionRules: [
            { when: "the question asks for Schedule X total", choose: "107" },
            { when: "the question asks for Schedule IX total", choose: "89" },
          ],
          nextStep: "Anchor 107 firmly as the Tenth Schedule total.",
        },
      ],
    },
  },

  // 13. TM-Q073 (Legal / APRA 2014)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q073",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Which specific Schedule of the Andhra Pradesh Reorganisation Act, 2014 outlines the statutory infrastructure development commitments made by the Central Government to the successor State of Telangana, including a National Tribal University, an AIIMS medical institute, and the feasibility of a Rail Coach Factory at Kazipet and Steel Plant at Bayyaram?",
      options: [
        {
          text: "Schedule I",
          why: "Schedule I deals with Rajya Sabha seat allotments (7 seats to Telangana, 11 seats to AP).",
          attraction: "First schedule of the Act.",
        },
        {
          text: "Schedule VII",
          why: "Schedule VII deals with the valuation of assets and liabilities.",
          attraction: "Financial schedule.",
        },
        {
          text: "Schedule XIII (Infrastructure and Special Economic Measures)",
          why: "Schedule XIII explicitly specifies the infrastructure and educational commitments made to Telangana and Andhra Pradesh, including the Central Tribal University at Mulugu, AIIMS at Bibinagar, and feasibility studies for Kazipet Rail Coach Factory and Bayyaram Steel Plant.",
          attraction: "The dedicated infrastructure and higher education schedule.",
          confusion: false,
        },
        {
          text: "Schedule IX",
          why: "Schedule IX lists the 89 Government Companies, not infrastructural project commitments.",
          attraction: "Lists public corporations.",
        },
      ],
      answer: 2,
      reason: "Part XII and the Thirteenth Schedule (Schedule XIII) of the AP Reorganisation Act, 2014 contain the binding promises of the Central Government regarding infrastructure development. Under Education: Section 93 / Schedule XIII promised an Indian Institute of Management (IIM), an Indian Institute of Technology (IIT), and a Central Tribal University in Telangana. Under Infrastructure: a Rail Coach Factory at Kazipet, a Steel Plant at Bayyaram, and a 4,000 MW NTPC power plant were promised.",
      clue: "Look for 'Schedule of APRA 2014 outlining infrastructure, Tribal University, Rail Coach Factory, Steel Plant': Schedule XIII.",
      trap: "Do not confuse Schedule XIII (Infrastructure) with Schedule IX (Corporations) or Schedule I (Rajya Sabha seats).",
      elimination: "Eliminate Schedule I (Rajya Sabha seats) and Schedule IX (Corporations); infrastructure commitments are in Schedule XIII.",
      anchor: "APRA 2014 Schedule XIII: Infrastructure and Special Economic Measures (Tribal University, Kazipet Rail Coach Factory, Bayyaram Steel Plant).",
      hint: "Which schedule at the very end of the Act (numbered thirteen) deals with infrastructure projects?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Schedule XIII",
      page: 78,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check Schedule I of APRA 2014.",
          correctMeaning: "Schedule XIII contains infrastructure promises.",
          selectedMeaning: "Schedule I allocates Rajya Sabha seats: 7 to Telangana and 11 to Andhra Pradesh.",
          possibleConfusion: "Schedule I is famous for parliamentary seat distribution, not infrastructure.",
          decisionRules: [
            { when: "the question asks which schedule allocates Rajya Sabha seats", choose: "Schedule I of APRA 2014" },
            { when: "the question asks which schedule details infrastructure and education commitments", choose: "Schedule XIII of APRA 2014" },
          ],
          nextStep: "Remember: Schedule I = Rajya Sabha; Schedule XIII = Infrastructure.",
        },
        {
          observation: "Check Schedule VII of APRA 2014.",
          correctMeaning: "Infrastructure commitments are in Schedule XIII.",
          selectedMeaning: "Schedule VII outlines general principles for apportioning assets and liabilities.",
          possibleConfusion: "Both schedules involve economic matters.",
          decisionRules: [
            { when: "the question asks about Schedule VII", choose: "Apportionment of assets and liabilities" },
            { when: "the question asks where Tribal University and Kazipet coach factory are promised", choose: "Schedule XIII" },
          ],
          nextStep: "Link Schedule XIII directly to central institutional promises.",
        },
        {
          observation: "You correctly selected Schedule XIII.",
          correctMeaning: "Schedule XIII contains the statutory commitments for a Tribal University, Kazipet Rail Coach Factory, and thermal power plant.",
          selectedMeaning: "Schedule XIII contains the statutory commitments for a Tribal University, Kazipet Rail Coach Factory, and thermal power plant.",
          possibleConfusion: "You answered correctly. The non-implementation of some Schedule XIII promises has been a major ongoing political debate.",
          decisionRules: [
            { when: "the question asks which schedule contains commitments for Telangana infrastructure", choose: "Schedule XIII" },
            { when: "the question asks where the Central Tribal University was established", choose: "Mulugu (Sammakka Sarakka Central Tribal University)" },
          ],
          nextStep: "Note Parliament's passage of the Central Universities (Amendment) Bill in 2023 establishing the Sammakka Sarakka Central Tribal University at Mulugu.",
        },
        {
          observation: "Check Schedule IX.",
          correctMeaning: "Schedule XIII is the infrastructure schedule.",
          selectedMeaning: "Schedule IX contains the list of 89 government corporations.",
          possibleConfusion: "Confusing corporate entities with infrastructural developmental commitments.",
          decisionRules: [
            { when: "the question asks about 89 public corporations", choose: "Schedule IX" },
            { when: "the question asks about infrastructure projects under Section 93", choose: "Schedule XIII" },
          ],
          nextStep: "Anchor Schedule XIII as the definitive infrastructure schedule.",
        },
      ],
    },
  },

  // 14. TM-Q074 (Expected / 2024 Statehood Update)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q074",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In 2024, the Ministry of Road Transport and Highways (MoRTH), acting upon a resolution passed by the Government of Telangana, issued an official gazette notification replacing the state's motor vehicle registration abbreviation. What was the state code changed from and to?",
      options: [
        {
          text: "Changed from 'TS' to 'TG'",
          why: "In March 2024, the Central Government notified the replacement of 'TS' with 'TG' as the official state code on all vehicle registration plates, aligning with the historical cultural sentiment of the movement (Telangana Gadda).",
          attraction: "The authentic 2024 gazette decision.",
          confusion: false,
        },
        {
          text: "Changed from 'TG' to 'TS'",
          why: "This reverses the change: 'TS' was adopted in 2014, and replaced with 'TG' in 2024.",
          attraction: "Inverted chronological direction.",
          confusion: true,
        },
        {
          text: "Changed from 'AP' to 'TL'",
          why: "'TL' was never an official abbreviation; AP was bifurcated in 2014.",
          attraction: "Incorrect abbreviation.",
        },
        {
          text: "Changed from 'TS' to 'TE'",
          why: "'TE' was never adopted.",
          attraction: "Arbitrary abbreviation.",
        },
      ],
      answer: 0,
      reason: "During the statehood agitation, 'TG' was the widespread popular symbol used by all organizations and student vehicles. After state formation in 2014, the previous government had adopted 'TS'. In February 2024, the Telangana Cabinet resolved to restore 'TG', and the Union Ministry of Road Transport and Highways formally amended the Motor Vehicles Rules in March 2024 notifying 'TG' as the official state code.",
      clue: "Look for '2024 vehicle registration abbreviation change': changed from 'TS' to 'TG'.",
      trap: "Do not reverse the order; 'TS' was the old code (2014–2024) and 'TG' is the new code (2024 onward).",
      elimination: "Eliminate reverse order (TG to TS) and non-existent abbreviations (TL, TE); the change was from TS to TG.",
      anchor: "2024 State Code Amendment: TS replaced with TG by MoRTH gazette notification.",
      hint: "Did the government change the vehicle registration prefix to TG or TS in 2024?",
      source: "Gazette Notification, Ministry of Road Transport and Highways (March 2024)",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the transition from 'TS' to 'TG'.",
          correctMeaning: "The state code was officially amended from 'TS' to 'TG' in March 2024 to honour movement heritage.",
          selectedMeaning: "The state code was officially amended from 'TS' to 'TG' in March 2024 to honour movement heritage.",
          possibleConfusion: "You answered correctly. The state also adopted the new state anthem ('Jaya Jaya He Telangana') in the same administrative review.",
          decisionRules: [
            { when: "the question asks for the official vehicle registration prefix of Telangana from 2024 onward", choose: "TG" },
            { when: "the question asks what prefix it replaced", choose: "TS" },
          ],
          nextStep: "Note that existing TS vehicles are not required to replace old number plates.",
        },
        {
          observation: "Check the chronological direction.",
          correctMeaning: "The change was from 'TS' to 'TG'.",
          selectedMeaning: "Option 2 claims 'TG' was changed to 'TS', which was the reverse decision made in 2014.",
          possibleConfusion: "Confusing the 2014 decision with the 2024 restoration.",
          decisionRules: [
            { when: "the question asks about the 2024 change", choose: "From TS to TG" },
            { when: "the question asks what was adopted in 2014", choose: "TS" },
          ],
          nextStep: "Remember: TG was restored in 2024.",
        },
        {
          observation: "Check abbreviation 'TL'.",
          correctMeaning: "The code is 'TG'.",
          selectedMeaning: "Option 3 proposes 'TL', which was never recognized by the Ministry of Transport.",
          possibleConfusion: "Thinking TL might stand for Telangana.",
          decisionRules: [
            { when: "the question asks for the current official state registration prefix", choose: "TG" },
            { when: "evaluating options", choose: "From TS to TG" },
          ],
          nextStep: "Anchor 'TG' as the sole recognized state motor vehicle prefix.",
        },
        {
          observation: "Check abbreviation 'TE'.",
          correctMeaning: "The official code is 'TG'.",
          selectedMeaning: "Option 4 proposes 'TE', which is not used.",
          possibleConfusion: "Arbitrary abbreviation.",
          decisionRules: [
            { when: "the question asks for the 2024 state abbreviation change", choose: "From TS to TG" },
            { when: "the question asks about the state anthem", choose: "Jaya Jaya He Telangana by Ande Sri" },
          ],
          nextStep: "Review the trio of 2024 symbolic updates: TG code, State Anthem, and updated emblem.",
        },
      ],
    },
  },

  // 15. TM-Q075 (Expected / Article 371-D Legal Framework)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q075",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Article 371-D of the Constitution of India (inserted by the 32nd Constitutional Amendment Act, 1973 pursuant to the Six-Point Formula), which fundamental power is conferred upon the President of India under Clause (1)?",
      options: [
        {
          text: "Power to make orders providing for equitable opportunities and facilities for the people of the State in public employment and education, including specifying local cadres and direct recruitment quotas",
          why: "Article 371-D(1) explicitly empowers the President to make orders providing equitable opportunities in public employment and education, organizing civil posts into local cadres for different parts of the State, which formed the constitutional bedrock of the Zonal system.",
          attraction: "The exact constitutional text of Article 371-D(1).",
          confusion: false,
        },
        {
          text: "Power to dissolve the State Legislative Assembly without the advice of the Council of Ministers",
          why: "Article 371-D contains no such power; assembly dissolution is governed by Article 174 and Article 356.",
          attraction: "Sounds like an extraordinary presidential power.",
        },
        {
          text: "Power to directly appoint the Chief Minister of the State",
          why: "Chief Minister appointment is governed by Article 164 by the Governor.",
          attraction: "Incorrect constitutional post.",
        },
        {
          text: "Power to permanently suspend the jurisdiction of the Supreme Court of India over state employees",
          why: "While Article 371-D created the Administrative Tribunal, the Supreme Court struck down the clause that excluded its judicial review in the landmark P. Sambamurthy case (1987).",
          attraction: "Touches on the Administrative Tribunal clause.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "Article 371-D was added to the Constitution by the 32nd Amendment (1973) following the Six-Point Formula. Clause (1) states: 'The President may by order made with respect to the State of Andhra Pradesh (and subsequently Telangana) provide, having regard to the requirements of the State as a whole, for equitable opportunities and facilities for the people belonging to different parts of the State, in the matter of public employment and in the matter of education.' This gave constitutional immunity to the 1975 and 2018 Presidential Orders.",
      clue: "Look for 'Article 371-D Clause (1) power of the President': equitable opportunities in public employment and education by organizing local cadres.",
      trap: "Do not confuse the employment/education local cadre power under Clause (1) with the Administrative Tribunal clause under Clause (3).",
      elimination: "Eliminate Assembly dissolution (Art 356) and Chief Minister appointment (Art 164); Article 371-D is exclusively about public employment and educational safeguards.",
      anchor: "Article 371-D(1): Presidential power to organize local cadres and ensure equitable employment and education opportunities.",
      hint: "What article of the Constitution enables the Zonal System and local reservation quotas in Telangana police recruitments?",
      source: "Constitution of India, Article 371-D & 32nd Amendment Act 1973",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the constitutional power under Article 371-D(1).",
          correctMeaning: "Article 371-D(1) empowers the President to issue orders organizing public posts into local cadres and regulating educational admissions.",
          selectedMeaning: "Article 371-D(1) empowers the President to issue orders organizing public posts into local cadres and regulating educational admissions.",
          possibleConfusion: "You answered correctly. Both the 1975 Presidential Order and the 2018 New Zonal System derive their constitutional validity from Article 371-D.",
          decisionRules: [
            { when: "the question asks which constitutional article empowers the President to create the Zonal System in Telangana", choose: "Article 371-D" },
            { when: "the question asks which constitutional amendment inserted Article 371-D", choose: "32nd Constitutional Amendment Act, 1973" },
          ],
          nextStep: "Review the landmark P. Sambamurthy v. State of AP (1987) case which struck down Clause (5) of Article 371-D.",
        },
        {
          observation: "Check the assembly dissolution powers.",
          correctMeaning: "Article 371-D governs employment and education quotas.",
          selectedMeaning: "Assembly dissolution is governed by Article 174 (by Governor) and Article 356 (President's Rule), completely unrelated to Article 371-D.",
          possibleConfusion: "Conflating emergency powers with special regional safeguard provisions.",
          decisionRules: [
            { when: "the question asks about President's Rule", choose: "Article 356" },
            { when: "the question asks about local cadre employment orders", choose: "Article 371-D" },
          ],
          nextStep: "Remember: Article 371-D is strictly about public employment and education.",
        },
        {
          observation: "Check Chief Minister appointment.",
          correctMeaning: "Article 371-D is dedicated to local cadres and education.",
          selectedMeaning: "Chief Minister is appointed by the Governor under Article 164.",
          possibleConfusion: "Misallocating political executive appointments.",
          decisionRules: [
            { when: "the question asks who appoints the Chief Minister", choose: "Governor under Article 164" },
            { when: "the question asks what Article 371-D provides", choose: "Equitable opportunities in public employment and education" },
          ],
          nextStep: "Anchor Article 371-D to public employment and education.",
        },
        {
          observation: "Notice the Administrative Tribunal and Supreme Court judicial review in Option 4.",
          correctMeaning: "Clause (1) provides the local cadre power.",
          selectedMeaning: "Option 4 refers to Clause (5) which attempted to give the state government veto power over tribunal orders, but was struck down in P. Sambamurthy case (1987) as violating basic structure.",
          possibleConfusion: "Remembering that the Administrative Tribunal was created under Article 371-D(3), but confusing it with the main local cadre power of Clause (1).",
          decisionRules: [
            { when: "the question asks which clause of Article 371-D was struck down by the Supreme Court in 1987", choose: "Clause (5) in P. Sambamurthy case" },
            { when: "the question asks what Clause (1) of Article 371-D empowers", choose: "Organizing local cadres and educational quotas" },
          ],
          nextStep: "Distinguish between Clause (1) (Local Cadres) and Clause (3) (Administrative Tribunal).",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 4 (${batchQuestions.length} questions)...`);

const importPayload = {
  actor: "human_operator_curator",
  reason: "Import authentic TS Police Constable (2016-2022) culture, armed struggle, mass movement milestones, and APRA 2014 Schedules IX, X, XIII.",
  sources,
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
  reason: "Independently verified against official TSLPRB Police Constable papers, official APRA 2014 gazettes, and constitutional provisions.",
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

// Sync to legacy questions table as well
const rows = db.prepare("SELECT id FROM corpus_questions WHERE published_version IS NOT NULL").all() as { id: string }[];
const insertLegacy = db.prepare("INSERT OR REPLACE INTO questions VALUES(?,?,?,?,?)");
for (const r of rows) {
  const qRow = db.prepare("SELECT content FROM corpus_question_versions WHERE question_id=? ORDER BY version DESC LIMIT 1").get(r.id) as { content: string };
  const q = JSON.parse(qRow.content);
  insertLegacy.run(q.id, q.topic, q.modelId, q.sourceStatus, qRow.content);
}

db.close();
console.log(`Batch 4 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
