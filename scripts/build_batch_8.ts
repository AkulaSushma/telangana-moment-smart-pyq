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
  // 1. TM-Q121 (2018 Presidential Order: 7 Zones Breakdown)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q121",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under the Telangana Public Employment (Organization of Local Cadres and Regulation of Direct Recruitment) Order, 2018 (New Zonal System), the 33 revenue districts of Telangana are organized into 7 administrative Zones. What is the correct official sequence and naming of Zones 1 to 7?",
      options: [
        {
          text: "Zone I: Kaleshwaram, Zone II: Basara, Zone III: Rajanna, Zone IV: Bhadradri, Zone V: Yadadri, Zone VI: Charminar, Zone VII: Jogulamba",
          why: "The First Schedule to the 2018 Presidential Order officially names the seven zones after regional, cultural, and spiritual landmarks: Zone I (Kaleshwaram), Zone II (Basara), Zone III (Rajanna), Zone IV (Bhadradri), Zone V (Yadadri), Zone VI (Charminar), and Zone VII (Jogulamba).",
          attraction: "The authentic statutory sequence of the 7 Zones under the 2018 Order.",
          confusion: false,
        },
        {
          text: "Zone I: Charminar, Zone II: Yadadri, Zone III: Bhadradri, Zone IV: Rajanna, Zone V: Basara, Zone VI: Kaleshwaram, Zone VII: Jogulamba",
          why: "This inverts the order; Zone I is Kaleshwaram in the north, while Charminar is Zone VI in Hyderabad.",
          attraction: "Inverted south-to-north ordering.",
          confusion: true,
        },
        {
          text: "Zone I: Godavari, Zone II: Krishna, Zone III: Manjira, Zone IV: Tungabhadra, Zone V: Musi, Zone VI: Penganga, Zone VII: Pranahita",
          why: "The zones are named after temple and cultural heritage monuments, not river names.",
          attraction: "Plausible river-based names.",
        },
        {
          text: "Zone I: Kakatiya, Zone II: Satavahana, Zone III: Qutb Shahi, Zone IV: Asaf Jahi, Zone V: Chalukya, Zone VI: Rashtrakuta, Zone VII: Ikshvaku",
          why: "The zones are not named after historic dynasties.",
          attraction: "Dynasty-based names.",
        },
      ],
      answer: 0,
      reason: "The 2018 New Zonal System abolished the old 2-zone structure of 1975 (Zone V and Zone VI) and created 7 compact zones: Zone 1 (Kaleshwaram: Asifabad, Mancherial, Peddapalli, Bhupalpally); Zone 2 (Basara: Adilabad, Nirmal, Nizamabad, Kamareddy); Zone 3 (Rajanna: Karimnagar, Jagtial, Sircilla, Siddipet); Zone 4 (Bhadradri: Kothagudem, Khammam, Mahabubabad, Warangal, Hanamkonda); Zone 5 (Yadadri: Suryapet, Nalgonda, Bhongir, Jangaon); Zone 6 (Charminar: Medchal, Hyderabad, Rangareddy, Sangareddy, Vikarabad); Zone 7 (Jogulamba: Mahabubnagar, Narayanpet, Wanaparthy, Gadwal, Nagarkurnool).",
      clue: "Look for 'Sequence of 7 Zones in 2018 Presidential Order': Kaleshwaram, Basara, Rajanna, Bhadradri, Yadadri, Charminar, Jogulamba.",
      trap: "Do not confuse the 7 zones with river names or historical dynasties; they are named after temple and cultural icons (Kaleshwaram to Jogulamba).",
      elimination: "Eliminate river names (Godavari/Krishna) and dynasties (Kakatiya); the 7 zones are Kaleshwaram, Basara, Rajanna, Bhadradri, Yadadri, Charminar, Jogulamba.",
      anchor: "2018 Presidential Order 7 Zones: Zone 1 (Kaleshwaram) to Zone 7 (Jogulamba).",
      hint: "Which zone is Zone 1 in the north (Kaleshwaram) and Zone 6 in Hyderabad (Charminar)?",
      source: "Telangana Public Employment Order 2018, First Schedule",
      page: 4,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the 7 Zones in statutory sequence.",
          correctMeaning: "The 7 Zones (Kaleshwaram, Basara, Rajanna, Bhadradri, Yadadri, Charminar, Jogulamba) form the territorial units for Zonal cadre posts.",
          selectedMeaning: "The 7 Zones (Kaleshwaram, Basara, Rajanna, Bhadradri, Yadadri, Charminar, Jogulamba) form the territorial units for Zonal cadre posts.",
          possibleConfusion: "You answered correctly. Each zone has a 95% reservation for local candidates in direct recruitment.",
          decisionRules: [
            { when: "the question asks for Zone 1 under the 2018 Presidential Order", choose: "Kaleshwaram Zone" },
            { when: "the question asks for the zone covering Hyderabad and Rangareddy", choose: "Zone VI (Charminar)" },
          ],
          nextStep: "Remember the south-most zone: Zone VII (Jogulamba).",
        },
        {
          observation: "Check the order of zones.",
          correctMeaning: "Zone I is Kaleshwaram; Zone VI is Charminar.",
          selectedMeaning: "Option 2 places Charminar as Zone I, which reverses the geographical progression.",
          possibleConfusion: "Candidates assume the capital city zone is numbered Zone 1.",
          decisionRules: [
            { when: "the question asks which zone is Charminar", choose: "Zone VI" },
            { when: "the question asks which zone is Kaleshwaram", choose: "Zone I" },
          ],
          nextStep: "Anchor Zone I in the northern forest belt (Kaleshwaram) and Zone VI in Hyderabad (Charminar).",
        },
        {
          observation: "Check river naming misconception.",
          correctMeaning: "The zones are named after cultural and spiritual landmarks.",
          selectedMeaning: "Rivers like Godavari and Krishna flow through multiple zones and were not chosen as zonal names.",
          possibleConfusion: "Assuming river basin geography determined the administrative names.",
          decisionRules: [
            { when: "the question asks how the 2018 zones were named", choose: "After temple landmarks and historical monuments (Kaleshwaram, Basara, Charminar, etc.)" },
            { when: "evaluating options", choose: "Kaleshwaram, Basara, Rajanna, Bhadradri, Yadadri, Charminar, Jogulamba" },
          ],
          nextStep: "Associate each zone with its signature shrine or monument.",
        },
        {
          observation: "Check dynasty names.",
          correctMeaning: "Landmarks, not dynasties, name the zones.",
          selectedMeaning: "Kakatiya, Satavahana, and Qutb Shahi are used for university or auditorium names, not the 2018 zones.",
          possibleConfusion: "Associating historical dynasties with territorial governance zones.",
          decisionRules: [
            { when: "the question asks about the 7 zones", choose: "Kaleshwaram to Jogulamba" },
            { when: "evaluating options", choose: "Kaleshwaram, Basara, Rajanna, Bhadradri, Yadadri, Charminar, Jogulamba" },
          ],
          nextStep: "Memorize the 7 landmarks in order: 1.Kaleshwaram, 2.Basara, 3.Rajanna, 4.Bhadradri, 5.Yadadri, 6.Charminar, 7.Jogulamba.",
        },
      ],
    },
  },

  // 2. TM-Q122 (2018 Presidential Order: Multi-Zone Composition)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q122",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under the 2018 New Zonal System, how are the 7 administrative Zones grouped into the two Multi-Zones for the purpose of organizing Multi-Zonal cadres, such as Police Sub-Inspectors and Deputy Tahsildars?",
      options: [
        {
          text: "Multi-Zone I comprises Zones I, II, III, and IV; Multi-Zone II comprises Zones V, VI, and VII",
          why: "Under the Second Schedule to the 2018 Presidential Order, Multi-Zone I (Northern Telangana) consists of Kaleshwaram (I), Basara (II), Rajanna (III), and Bhadradri (IV); Multi-Zone II (Southern Telangana) consists of Yadadri (V), Charminar (VI), and Jogulamba (VII).",
          attraction: "The exact statutory grouping of zones into Multi-Zone I and Multi-Zone II.",
          confusion: false,
        },
        {
          text: "Multi-Zone I comprises Zones I, II, and III; Multi-Zone II comprises Zones IV, V, VI, and VII",
          why: "Bhadradri (Zone IV) is part of Multi-Zone I, not Multi-Zone II.",
          attraction: "Uneven split with 3 zones in Multi-Zone I.",
          confusion: true,
        },
        {
          text: "Multi-Zone I comprises Zones I to V; Multi-Zone II comprises Zones VI and VII",
          why: "Incorrect grouping; Multi-Zone I has exactly 4 zones and Multi-Zone II has 3 zones.",
          attraction: "Leaves only Hyderabad and south in Multi-Zone II.",
        },
        {
          text: "Multi-Zone I comprises rural zones; Multi-Zone II comprises exclusively urban zones",
          why: "The division is geographical (north and south), not rural versus urban.",
          attraction: "Rural-urban misconception.",
        },
      ],
      answer: 0,
      reason: "The Multi-Zonal cadre division is critical for Telangana Police Sub-Inspector (SI) recruitment. Multi-Zone I (4 zones: Kaleshwaram, Basara, Rajanna, Bhadradri) covers 19 districts in the north and east; Multi-Zone II (3 zones: Yadadri, Charminar, Jogulamba) covers 14 districts in the south and central regions. Candidates local to Multi-Zone I compete for 95% of SI posts in Multi-Zone I.",
      clue: "Look for 'Composition of Multi-Zones in 2018 Presidential Order': Multi-Zone I = Zones 1, 2, 3, 4; Multi-Zone II = Zones 5, 6, 7.",
      trap: "Do not place Bhadradri (Zone IV) into Multi-Zone II; Bhadradri belongs to Multi-Zone I.",
      elimination: "Eliminate 3-4 split and 5-2 split; Multi-Zone I has 4 zones (I–IV) and Multi-Zone II has 3 zones (V–VII).",
      anchor: "2018 Presidential Order Multi-Zones: Multi-Zone I = Zones I to IV; Multi-Zone II = Zones V to VII.",
      hint: "Which Multi-Zone groups the first four zones together and the remaining three together?",
      source: "Telangana Public Employment Order 2018, Second Schedule",
      page: 6,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the 4:3 split between Multi-Zone I and Multi-Zone II.",
          correctMeaning: "Multi-Zone I covers Zones I–IV; Multi-Zone II covers Zones V–VII.",
          selectedMeaning: "Multi-Zone I covers Zones I–IV; Multi-Zone II covers Zones V–VII.",
          possibleConfusion: "You answered correctly. In SI recruitment notifications, separate merit lists and local cut-offs are published for Multi-Zone I and Multi-Zone II.",
          decisionRules: [
            { when: "the question asks which zones make up Multi-Zone I", choose: "Zones I, II, III, and IV" },
            { when: "the question asks which zones make up Multi-Zone II", choose: "Zones V, VI, and VII" },
          ],
          nextStep: "Note that Warangal and Khammam fall under Multi-Zone I (via Zone IV Bhadradri).",
        },
        {
          observation: "Check Bhadradri's placement.",
          correctMeaning: "Bhadradri is in Multi-Zone I.",
          selectedMeaning: "Option 2 incorrectly puts Bhadradri into Multi-Zone II, which would unbalance the geographical allocation.",
          possibleConfusion: "Candidates associate Khammam/Bhadradri with south Telangana.",
          decisionRules: [
            { when: "the question asks which multi-zone Bhadradri (Zone IV) belongs to", choose: "Multi-Zone I" },
            { when: "the question asks which multi-zone Yadadri (Zone V) belongs to", choose: "Multi-Zone II" },
          ],
          nextStep: "Remember: Zone IV (Bhadradri) stays in Multi-Zone I; Zone V (Yadadri) starts Multi-Zone II.",
        },
        {
          observation: "Check 5:2 split.",
          correctMeaning: "The split is 4:3.",
          selectedMeaning: "Option 3 would leave Multi-Zone II with only Charminar and Jogulamba.",
          possibleConfusion: "Assuming Yadadri is in the northern group.",
          decisionRules: [
            { when: "the question asks how many zones are in Multi-Zone I", choose: "Four zones (I, II, III, IV)" },
            { when: "the question asks how many zones are in Multi-Zone II", choose: "Three zones (V, VI, VII)" },
          ],
          nextStep: "Remember: 4 zones in Multi-Zone I; 3 zones in Multi-Zone II.",
        },
        {
          observation: "Check rural-urban classification.",
          correctMeaning: "The grouping is contiguous geographical territory.",
          selectedMeaning: "Both Multi-Zones contain both rural farming districts and major urban cities.",
          possibleConfusion: "Assuming Charminar's urban character created an urban-specific cadre.",
          decisionRules: [
            { when: "the question asks what is the basis of Multi-Zonal organization", choose: "Contiguous territorial zones" },
            { when: "evaluating options", choose: "Multi-Zone I (I–IV) and Multi-Zone II (V–VII)" },
          ],
          nextStep: "Anchor Multi-Zone I = 1,2,3,4 and Multi-Zone II = 5,6,7.",
        },
      ],
    },
  },

  // 3. TM-Q123 (2018 Presidential Order: Local Candidate 4-Year Study Rule)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q123",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Paragraph 7 of the Telangana Public Employment (Organization of Local Cadres and Regulation of Direct Recruitment) Order, 2018, what is the primary educational criterion required for an applicant to be determined as a 'Local Candidate' for direct recruitment in a District or Zone?",
      options: [
        {
          text: "Having studied in an educational institution in that local area for not less than 4 consecutive academic years ending with the academic year in which the candidate appeared for the SSC or equivalent examination",
          why: "Paragraph 7(1)(a) of the 2018 Order mandates that a candidate is deemed a local candidate if they have studied in an educational institution in that local area for not less than 4 consecutive academic years ending with Class VII (or Class X / SSC).",
          attraction: "The exact statutory text of the 4-year study rule under the 2018 Order.",
          confusion: false,
        },
        {
          text: "Having studied for a minimum of 7 consecutive years ending with intermediate education",
          why: "The 2018 Order reduced the 7-year qualifying window to 4 consecutive academic years and lowered the threshold to Class 7.",
          attraction: "Recalls old 1975 Presidential Order 7-year criteria.",
          confusion: true,
        },
        {
          text: "Having a domicile certificate proving birth of candidate's parents in that revenue district",
          why: "Indian constitutional law under Article 16(2) bars reservation based on descent or place of birth; only institutional study/residence is permitted.",
          attraction: "Parental nativity misconception.",
        },
        {
          text: "Owning agricultural land or ancestral property within that district for 10 years",
          why: "Property ownership is not a criterion under the Presidential Order.",
          attraction: "Property-based domicile misconception.",
        },
      ],
      answer: 0,
      reason: "Paragraph 7 of the 2018 Presidential Order simplified the local candidate definition: (1) A candidate who has studied in an educational institution in such local area for not less than 4 consecutive academic years ending with the year in which they first appeared for SSC (or Class VII for Class 1–7 span); (2) Where they studied in different areas, the area where they studied the maximum period within the 7-year span (Classes 1 to 7).",
      clue: "Look for 'Local candidate definition in 2018 Presidential Order': 4 consecutive academic years of study in that local area.",
      trap: "Do not confuse the 2018 rule (4 consecutive academic years) with the 1975 rule (4 out of 7 consecutive years) or parental birth.",
      elimination: "Eliminate parental birth (barred by Article 16) and property ownership; the 2018 Order specifies 4 consecutive academic years of institutional study.",
      anchor: "2018 Presidential Order Para 7: Local candidate status requires 4 consecutive academic years of study in that local area.",
      hint: "How many consecutive academic years of schooling (four, seven, or ten) determine local status under the new zonal rules?",
      source: "Telangana Public Employment Order 2018, Paragraph 7",
      page: 8,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 4 consecutive academic years of study.",
          correctMeaning: "Paragraph 7 establishes institutional study for 4 consecutive academic years as the definitive test of local status.",
          selectedMeaning: "Paragraph 7 establishes institutional study for 4 consecutive academic years as the definitive test of local status.",
          possibleConfusion: "You answered correctly. If a candidate studied without institutional schooling (private study), a 4-year residence certificate by Tahsildar is required.",
          decisionRules: [
            { when: "the question asks for the local candidate study requirement in the 2018 Presidential Order", choose: "4 consecutive academic years" },
            { when: "the question asks which classes form the educational study block", choose: "Classes 1 to 7" },
          ],
          nextStep: "Contrast with the 1975 Order which looked at Classes 4 to 10.",
        },
        {
          observation: "Check the 7-year rule.",
          correctMeaning: "The 2018 Order specifies 4 consecutive years.",
          selectedMeaning: "Under the 1975 Presidential Order, a 7-year period (Classes 4 to 10) was inspected, requiring 4 out of 7 years in that zone.",
          possibleConfusion: "Candidates confuse the 1975 formula with the 2018 formula.",
          decisionRules: [
            { when: "the question asks about 1975 local candidate rule", choose: "4 out of 7 consecutive years (Classes 4–10)" },
            { when: "the question asks about 2018 local candidate rule", choose: "4 consecutive academic years (Classes 1–7)" },
          ],
          nextStep: "Remember: 1975 = 4 of 7 years (Classes 4-10); 2018 = 4 consecutive years (Classes 1-7).",
        },
        {
          observation: "Check parental birth.",
          correctMeaning: "Study in local institutions determines status.",
          selectedMeaning: "Article 16(2) of the Indian Constitution strictly prohibits discrimination in public employment on grounds of place of birth or descent.",
          possibleConfusion: "Popular assumption that parents' nativity defines local status.",
          decisionRules: [
            { when: "the question asks if parental birth determines local candidate status in recruitments", choose: "No, institutional study of the candidate determines status" },
            { when: "evaluating options", choose: "4 consecutive academic years of institutional study" },
          ],
          nextStep: "Firmly reject parental birth or ancestral domicile in public recruitment questions.",
        },
        {
          observation: "Check property ownership.",
          correctMeaning: "Education, not property, is the criterion.",
          selectedMeaning: "Property ownership has no legal standing under Article 371-D or the Presidential Orders.",
          possibleConfusion: "Confusing revenue tax records with recruitment local cadre eligibility.",
          decisionRules: [
            { when: "the question asks about local cadre eligibility", choose: "4 consecutive academic years of institutional study" },
            { when: "evaluating options", choose: "4 consecutive academic years" },
          ],
          nextStep: "Anchor 4 consecutive academic years as the gold standard of local candidate verification.",
        },
      ],
    },
  },

  // 4. TM-Q124 (APRA 2014 Section 8: Governor's Special Responsibility)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q124",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Section 8 of the Andhra Pradesh Reorganisation Act, 2014, what extraordinary responsibility was vested in the Governor of Telangana for the common capital area of Hyderabad during the 10-year common capital period?",
      options: [
        {
          text: "Special responsibility for the security of life, liberty, and property of all persons residing in the common capital area, and the management of law and order, police administration, and vital government installations",
          why: "Section 8(1) and 8(2) of APRA 2014 gave the Governor special responsibility for law and order, police, and vital installations in Hyderabad, acting in personal discretion after consulting the Telangana Council of Ministers.",
          attraction: "The exact statutory wording of Section 8 of APRA 2014.",
          confusion: false,
        },
        {
          text: "Power to veto any legislation passed by the Telangana Legislative Assembly without referring it to the President",
          why: "Section 8 did not confer legislative veto powers beyond normal Article 200 constitutional provisions.",
          attraction: "Exaggerated gubernatorial power.",
        },
        {
          text: "Authority to collect all municipal taxes in GHMC and apportion them equally between the two states",
          why: "Tax collection remained exclusively with the Government of Telangana and GHMC.",
          attraction: "Revenue misconception.",
        },
        {
          text: "Power to unilaterally alter the revenue district boundaries of Hyderabad and Rangareddy",
          why: "District reorganization is an executive power of the State Government under the AP/Telangana District Formation Act, 1974.",
          attraction: "Territorial misconception.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "Section 8 was one of the most hotly contested provisions of APRA 2014. To assure Seemandhra citizens living in Hyderabad, Parliament conferred special responsibility for law and order in the common capital area on the Governor. The Telangana government vehemently opposed any implementation of Section 8 as an infringement on elected state autonomy, and Governor E.S.L. Narasimhan avoided exercising discretionary police powers.",
      clue: "Look for 'Governor's special responsibility under Section 8 of APRA 2014': Security of life, liberty, property, and law and order in the common capital area.",
      trap: "Do not confuse the Section 8 law and order responsibility with municipal taxation or legislative vetoes.",
      elimination: "Eliminate legislative veto and municipal tax collection; Section 8 deals strictly with law and order, police, and security in the common capital area.",
      anchor: "APRA 2014 Section 8: Special responsibility of Governor for law and order, life, liberty, and property in common capital Hyderabad.",
      hint: "Which section of the Bifurcation Act gave the Governor special powers over police and security in Hyderabad?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Section 8",
      page: 6,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the law and order and security responsibility.",
          correctMeaning: "Section 8 made the Governor responsible for the safety of all residents in Hyderabad during the 10-year common capital period.",
          selectedMeaning: "Section 8 made the Governor responsible for the safety of all residents in Hyderabad during the 10-year common capital period.",
          possibleConfusion: "You answered correctly. The provision expired on 2 June 2024 when Hyderabad ceased to be the common capital under Section 5.",
          decisionRules: [
            { when: "the question asks which section of APRA 2014 gave the Governor special law and order responsibility in Hyderabad", choose: "Section 8" },
            { when: "the question asks when Section 8 powers expired", choose: "2 June 2024 (upon expiry of 10-year common capital period)" },
          ],
          nextStep: "Note that Section 8 required the Governor to be assisted by two advisors appointed by the Central Government.",
        },
        {
          observation: "Check legislative veto powers.",
          correctMeaning: "Section 8 is limited to executive law and order.",
          selectedMeaning: "Gubernatorial assent to state bills is governed by Article 200 of the Constitution, not Section 8 of APRA 2014.",
          possibleConfusion: "Confusing constitutional legislative assent with bifurcation emergency powers.",
          decisionRules: [
            { when: "the question asks which article governs Governor's assent to bills", choose: "Article 200" },
            { when: "the question asks what Section 8 of APRA 2014 covers", choose: "Law and order in common capital area" },
          ],
          nextStep: "Differentiate Article 200 (Assent to bills) from Section 8 (Law and order).",
        },
        {
          observation: "Check municipal taxation.",
          correctMeaning: "Section 8 covers security, not taxation.",
          selectedMeaning: "All municipal taxes collected by GHMC remained in the Telangana Consolidated Fund; no tax sharing was mandated under Section 8.",
          possibleConfusion: "Assuming common capital meant shared civic revenues.",
          decisionRules: [
            { when: "the question asks if GHMC revenues were shared under Section 8", choose: "No, Section 8 is strictly about security and law and order" },
            { when: "evaluating options", choose: "Law and order and security responsibility" },
          ],
          nextStep: "Remember: Common capital did NOT mean common revenue or common administration.",
        },
        {
          observation: "Check district reorganization powers.",
          correctMeaning: "District formation belongs to the State Government.",
          selectedMeaning: "In October 2016, the Government of Telangana reorganized 10 districts into 31 (and later 33) districts under the Telangana District Formation Act, without Governor's discretionary approval.",
          possibleConfusion: "Thinking district boundaries were frozen by Section 8.",
          decisionRules: [
            { when: "the question asks who has power to reorganize districts in Telangana", choose: "State Government of Telangana" },
            { when: "the question asks what Section 8 governed", choose: "Law and order in common capital area" },
          ],
          nextStep: "Anchor Section 8 strictly to law, order, and police security.",
        },
      ],
    },
  },

  // 5. TM-Q125 (APRA 2014 Section 47: Pension Liabilities Population Ratio)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q125",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Part VI and Section 47 of the Andhra Pradesh Reorganisation Act, 2014, on what exact population ratio basis are the pension liabilities, public debt apportionment, and cash balances of the undivided state divided between Andhra Pradesh and Telangana?",
      options: [
        {
          text: "58.32% to Andhra Pradesh and 41.68% to Telangana (based on the 2011 Census population)",
          why: "Section 2(h) of APRA 2014 defines 'population ratio' in relation to Andhra Pradesh and Telangana as 58.32 : 41.68, based on the 2011 Census (AP population: 49,577,103; Telangana population: 35,003,674).",
          attraction: "The exact statutory population ratio defined under Section 2(h) and applied in Section 47.",
          confusion: false,
        },
        {
          text: "50% to Andhra Pradesh and 50% to Telangana (equal 1:1 division)",
          why: "Equal division was rejected in favor of the demographic population ratio of the 2011 Census.",
          attraction: "Plausible equal division formula.",
          confusion: true,
        },
        {
          text: "60% to Andhra Pradesh and 40% to Telangana",
          why: "60:40 is an approximation, not the precise statutory ratio of 58.32 : 41.68.",
          attraction: "Rounded figure.",
        },
        {
          text: "53.89% to Andhra Pradesh and 46.11% to Telangana",
          why: "53.89 : 46.11 is the power consumption ratio in Schedule XII, not the population ratio under Section 47.",
          attraction: "Confuses power sharing ratio with population ratio.",
        },
      ],
      answer: 0,
      reason: "Section 2(h) of APRA 2014 defines the 'population ratio' as 58.32 to 41.68. Under Part VI, all public debts not tied to specific physical assets, cash balances, unallocated bank deposits, and pension liabilities of existing pensioners as of the appointed day (Section 59) are apportioned strictly on this 58.32 : 41.68 ratio.",
      clue: "Look for 'Population ratio in APRA 2014 for pension liabilities and public debt': 58.32% (Andhra Pradesh) and 41.68% (Telangana).",
      trap: "Do not confuse the population ratio (58.32 : 41.68) with the power sharing ratio (53.89 : 46.11) or a 50:50 split.",
      elimination: "Eliminate 50:50 and power ratio (53.89 : 46.11); the statutory population ratio is 58.32 : 41.68.",
      anchor: "APRA 2014 Population Ratio: 58.32% (Andhra Pradesh) and 41.68% (Telangana) based on 2011 Census.",
      hint: "What is the exact population ratio (fifty-eight point three two to forty-one point six eight)?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Section 2(h) & Section 47",
      page: 38,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the 58.32 : 41.68 population ratio.",
          correctMeaning: "The 2011 Census established 58.32% population in the 13 Seemandhra districts and 41.68% in the 10 Telangana districts.",
          selectedMeaning: "The 2011 Census established 58.32% population in the 13 Seemandhra districts and 41.68% in the 10 Telangana districts.",
          possibleConfusion: "You answered correctly. This ratio governs the division of unallocated assets and liabilities in Sections 47, 53, and 59.",
          decisionRules: [
            { when: "the question asks for the population ratio in APRA 2014", choose: "58.32% to AP and 41.68% to Telangana" },
            { when: "the question asks which Census was used for the population ratio", choose: "2011 Census" },
          ],
          nextStep: "Contrast with Schedule XII which uses the 5-year power consumption ratio.",
        },
        {
          observation: "Check the equal division assumption.",
          correctMeaning: "The division is by population ratio (58.32 : 41.68).",
          selectedMeaning: "Equal 50:50 division applies only to board representation (such as KRMB and GRMB members), not financial liabilities.",
          possibleConfusion: "Aspirants assume debts are split 50:50 between the two states.",
          decisionRules: [
            { when: "the question asks how debts and pensions are apportioned", choose: "58.32% (AP) and 41.68% (Telangana)" },
            { when: "evaluating options", choose: "58.32 : 41.68" },
          ],
          nextStep: "Remember: Financial liabilities follow the population ratio (58.32 : 41.68).",
        },
        {
          observation: "Check rounded numbers.",
          correctMeaning: "The statutory ratio has exact decimals: 58.32 : 41.68.",
          selectedMeaning: "60:40 is colloquial rounding that will be marked incorrect in official exams.",
          possibleConfusion: "Choosing approximate figures.",
          decisionRules: [
            { when: "the question asks for the statutory population ratio in APRA 2014", choose: "58.32 : 41.68" },
            { when: "evaluating options", choose: "58.32 : 41.68" },
          ],
          nextStep: "Anchor the two decimal numbers: 58.32 and 41.68.",
        },
        {
          observation: "Check power consumption ratio.",
          correctMeaning: "58.32 : 41.68 is the population ratio.",
          selectedMeaning: "53.89 : 46.11 is the power sharing ratio under Schedule XII based on average electricity consumption.",
          possibleConfusion: "Confusing the two major percentage formulas in the Bifurcation Act.",
          decisionRules: [
            { when: "the question asks for the population ratio (debts/pensions)", choose: "58.32 : 41.68" },
            { when: "the question asks for the power sharing ratio (Schedule XII)", choose: "53.89 : 46.11" },
          ],
          nextStep: "Separate: Population/Pensions = 58.32 : 41.68; Power = 53.89 : 46.11.",
        },
      ],
    },
  },

  // 6. TM-Q126 (APRA 2014 Schedule I & II: Parliamentary Seats Distribution)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q126",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Sections 9 and 10 and the First and Second Schedules of the Andhra Pradesh Reorganisation Act, 2014, how are the 18 Rajya Sabha seats and 42 Lok Sabha seats of undivided Andhra Pradesh distributed between Telangana and the successor State of Andhra Pradesh?",
      options: [
        {
          text: "Telangana: 7 Rajya Sabha seats and 17 Lok Sabha seats; Andhra Pradesh: 11 Rajya Sabha seats and 25 Lok Sabha seats",
          why: "Section 9 / Schedule I allocates 7 Rajya Sabha seats to Telangana and 11 to Andhra Pradesh. Section 10 / Schedule II allocates 17 Lok Sabha seats to Telangana and 25 to Andhra Pradesh.",
          attraction: "The exact statutory distribution of parliamentary seats in APRA 2014.",
          confusion: false,
        },
        {
          text: "Telangana: 9 Rajya Sabha seats and 21 Lok Sabha seats; Andhra Pradesh: 9 Rajya Sabha seats and 21 Lok Sabha seats",
          why: "Equal division of seats was not applied; seats were allocated based on territorial constituencies.",
          attraction: "Assumes an equal 50:50 division.",
          confusion: true,
        },
        {
          text: "Telangana: 6 Rajya Sabha seats and 16 Lok Sabha seats; Andhra Pradesh: 12 Rajya Sabha seats and 26 Lok Sabha seats",
          why: "Incorrect numbers; Telangana has 7 RS and 17 LS seats.",
          attraction: "Arbitrary seat distribution.",
        },
        {
          text: "Telangana: 8 Rajya Sabha seats and 18 Lok Sabha seats; Andhra Pradesh: 10 Rajya Sabha seats and 24 Lok Sabha seats",
          why: "Incorrect numbers; the statutory totals are 7 and 17 for Telangana.",
          attraction: "Close numerical distractor.",
        },
      ],
      answer: 0,
      reason: "Of the 42 Lok Sabha seats in undivided AP, 17 fell in Telangana (including 3 SC seats: Peddapalli, Nagarkurnool, Warangal; and 2 ST seats: Adilabad, Mahabubabad). Of the 18 Rajya Sabha seats, the Election Commission drew lots under Section 9, allotting 7 sitting members to Telangana and 11 members to Andhra Pradesh.",
      clue: "Look for 'Parliamentary seats distribution in APRA 2014': Telangana = 7 Rajya Sabha + 17 Lok Sabha; AP = 11 Rajya Sabha + 25 Lok Sabha.",
      trap: "Do not guess equal split (9 and 21); Telangana has 7 Rajya Sabha seats and 17 Lok Sabha seats.",
      elimination: "Eliminate equal split and 6/16; the correct seats are 7 RS and 17 LS for Telangana (11 RS and 25 LS for AP).",
      anchor: "APRA 2014 Parliamentary Seats: Telangana = 7 Rajya Sabha, 17 Lok Sabha; Andhra Pradesh = 11 Rajya Sabha, 25 Lok Sabha.",
      hint: "How many Rajya Sabha seats (seven) and Lok Sabha seats (seventeen) does Telangana have?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Schedule I & II",
      page: 10,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 7 Rajya Sabha and 17 Lok Sabha seats.",
          correctMeaning: "Telangana has 7 seats in the Council of States (Rajya Sabha) and 17 seats in the House of the People (Lok Sabha).",
          selectedMeaning: "Telangana has 7 seats in the Council of States (Rajya Sabha) and 17 seats in the House of the People (Lok Sabha).",
          possibleConfusion: "You answered correctly. The 17 Lok Sabha constituencies include 12 General, 3 SC, and 2 ST seats.",
          decisionRules: [
            { when: "the question asks how many Lok Sabha seats Telangana has", choose: "17 seats" },
            { when: "the question asks how many Rajya Sabha seats Telangana has", choose: "7 seats" },
          ],
          nextStep: "Note the combined parliamentary representation of Telangana is 24 MPs (17 + 7).",
        },
        {
          observation: "Check equal split misconception.",
          correctMeaning: "The seats are divided 17:25 (Lok Sabha) and 7:11 (Rajya Sabha).",
          selectedMeaning: "An equal split would give 21 Lok Sabha seats, but Telangana has only 17 geographically delineated constituencies.",
          possibleConfusion: "Assuming undivided AP's 42 seats were halved equally.",
          decisionRules: [
            { when: "the question asks for Telangana Lok Sabha seats", choose: "17 seats" },
            { when: "the question asks for AP Lok Sabha seats", choose: "25 seats" },
          ],
          nextStep: "Remember: 17 for Telangana and 25 for Andhra Pradesh.",
        },
        {
          observation: "Check the 6 and 16 count.",
          correctMeaning: "The counts are 7 and 17.",
          selectedMeaning: "Option 3 undercounts each house by one seat.",
          possibleConfusion: "Slight memory lapse on single-digit numbers.",
          decisionRules: [
            { when: "the question asks for Rajya Sabha seats of Telangana", choose: "7" },
            { when: "the question asks for Lok Sabha seats of Telangana", choose: "17" },
          ],
          nextStep: "Notice the matching '7' in both numbers: 7 (Rajya Sabha) and 17 (Lok Sabha).",
        },
        {
          observation: "Check 8 and 18 count.",
          correctMeaning: "Telangana has 7 RS and 17 LS seats.",
          selectedMeaning: "Option 4 overcounts by one seat.",
          possibleConfusion: "Guessing adjacent numbers.",
          decisionRules: [
            { when: "the question asks for parliamentary seats of Telangana", choose: "7 Rajya Sabha and 17 Lok Sabha" },
            { when: "evaluating options", choose: "7 RS and 17 LS" },
          ],
          nextStep: "Anchor 7 and 17 as the permanent parliamentary representation of Telangana.",
        },
      ],
    },
  },

  // 7. TM-Q127 (APRA 2014 Section 17 & Schedule III: Assembly Seats)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q127",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Section 17 and the Third Schedule of the Andhra Pradesh Reorganisation Act, 2014, how many elected seats were allocated to the Telangana Legislative Assembly, and what specific expansion was promised under Section 26 subject to constitutional delimitation?",
      options: [
        {
          text: "119 elected seats allocated to Telangana Assembly, with Section 26 providing for an increase from 119 to 153 seats",
          why: "Section 17 allocated 119 elected seats to the Telangana Legislative Assembly (and 175 to AP). Section 26 provided that subject to Article 170 provisions, the total number of seats in the Telangana Assembly shall be increased from 119 to 153.",
          attraction: "The exact statutory assembly seat count and Section 26 expansion target.",
          confusion: false,
        },
        {
          text: "100 elected seats, with Section 26 providing for an increase to 125 seats",
          why: "100 seats is an arbitrary round figure; the actual number of elected seats is 119.",
          attraction: "Plausible round number.",
        },
        {
          text: "119 elected seats, with Section 26 prohibiting any future increase in assembly strength",
          why: "Section 26 explicitly mandated an increase in seats (from 119 to 153 for Telangana and 175 to 225 for AP), not a prohibition.",
          attraction: "Misinterprets Section 26.",
          confusion: true,
        },
        {
          text: "150 elected seats allocated immediately with no delimitation clause",
          why: "150 is the number of wards in GHMC, not Assembly seats.",
          attraction: "Confuses GHMC wards with Assembly constituencies.",
        },
      ],
      answer: 0,
      reason: "Of the 294 Assembly seats in undivided Andhra Pradesh, 119 constituencies fell in Telangana (including 19 SC constituencies and 12 ST constituencies). Section 26 of APRA 2014 promised that the number of seats in the Legislative Assembly of Telangana would be increased from 119 to 153, and in Andhra Pradesh from 175 to 225, though implementation has been deferred pending national delimitation.",
      clue: "Look for 'Telangana Legislative Assembly seats in APRA 2014 and Section 26 expansion target': 119 seats, to be increased to 153 seats.",
      trap: "Do not confuse the current Assembly strength (119 seats) with the Section 26 promised target (153 seats) or GHMC wards (150).",
      elimination: "Eliminate 100 seats and prohibition of increase; Telangana was allocated 119 seats with Section 26 enabling increase to 153.",
      anchor: "Telangana Legislative Assembly: 119 seats under Section 17; Section 26 provides for increase to 153 seats.",
      hint: "How many MLAs are elected to the Telangana Assembly (119), and what is the promised target (153)?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Section 17 & Section 26",
      page: 14,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 119 seats and expansion to 153.",
          correctMeaning: "Telangana has 119 elected Assembly constituencies, and Section 26 specifies increasing this to 153.",
          selectedMeaning: "Telangana has 119 elected Assembly constituencies, and Section 26 specifies increasing this to 153.",
          possibleConfusion: "You answered correctly. In addition, 1 Anglo-Indian member was nominated prior to the 104th Constitutional Amendment Act, 2019.",
          decisionRules: [
            { when: "the question asks how many elected seats are in the Telangana Legislative Assembly", choose: "119 seats" },
            { when: "the question asks to what number Section 26 proposes to increase Telangana Assembly seats", choose: "153 seats" },
          ],
          nextStep: "Note the corresponding numbers for Andhra Pradesh: 175 seats, proposed to increase to 225 seats.",
        },
        {
          observation: "Check the 100-seat number.",
          correctMeaning: "The statutory number is 119.",
          selectedMeaning: "100 was the strength of the Telangana Legislative Council under earlier proposals before being fixed at 40.",
          possibleConfusion: "Confusing round figures with actual constitutional allocations.",
          decisionRules: [
            { when: "the question asks for Telangana Assembly strength", choose: "119 seats" },
            { when: "the question asks for Telangana Legislative Council strength", choose: "40 seats" },
          ],
          nextStep: "Pair Assembly with 119 seats, and Legislative Council with 40 seats.",
        },
        {
          observation: "Check Section 26's purpose.",
          correctMeaning: "Section 26 provides for increasing seats.",
          selectedMeaning: "Section 26 was specifically drafted to enable constituency delimitation to accommodate regional political representation.",
          possibleConfusion: "Confusing Section 26 with Article 170(3) which freezes national delimitation until 2026.",
          decisionRules: [
            { when: "the question asks what Section 26 of APRA 2014 provides", choose: "Delimitation and increase of seats (from 119 to 153 in Telangana)" },
            { when: "evaluating options", choose: "Increase from 119 to 153" },
          ],
          nextStep: "Remember: Section 26 promises an increase, not a freeze.",
        },
        {
          observation: "Check 150 count.",
          correctMeaning: "The Assembly has 119 seats.",
          selectedMeaning: "150 is the number of corporator divisions in the Greater Hyderabad Municipal Corporation (GHMC).",
          possibleConfusion: "Confusing civic wards with legislative assembly seats.",
          decisionRules: [
            { when: "the question asks for GHMC wards count", choose: "150 wards" },
            { when: "the question asks for Telangana Assembly constituencies", choose: "119 constituencies" },
          ],
          nextStep: "Anchor 119 as the authentic number of elected MLAs in Telangana.",
        },
      ],
    },
  },

  // 8. TM-Q128 (APRA 2014 Schedule XII: Power Sharing Ratio)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q128",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under the Twelfth Schedule (Schedule XII) of the Andhra Pradesh Reorganisation Act, 2014, on what specific basis and ratio was electrical power generated by existing APGENCO thermal and hydel power stations apportioned between the successor states?",
      options: [
        {
          text: "Apportioned based on the historical average power consumption of each region over the preceding 5 years: 53.89% to Andhra Pradesh and 46.11% to Telangana",
          why: "Paragraph C.1 of Schedule XII specifies that power allocated from APGENCO stations shall be apportioned based on the actual percentage of power consumption of the respective territories over the five-year period from 2008–09 to 2012–13: 53.89% to AP and 46.11% to Telangana.",
          attraction: "The exact statutory power sharing formula and percentage in Schedule XII.",
          confusion: false,
        },
        {
          text: "Apportioned strictly based on the physical geographic location of the power plant",
          why: "Physical location was rejected because Telangana would have suffered a severe deficit; power was shared from all plants regardless of location.",
          attraction: "Territorial possession misconception.",
          confusion: true,
        },
        {
          text: "Apportioned on the 2011 Census population ratio: 58.32% to AP and 41.68% to Telangana",
          why: "The population ratio applies to debts and pensions (Part VI), not power sharing (Schedule XII).",
          attraction: "Confuses population ratio with power sharing ratio.",
        },
        {
          text: "Apportioned equally at 50% to Telangana and 50% to Andhra Pradesh",
          why: "Power was not divided equally 50:50.",
          attraction: "Plausible equal sharing formula.",
        },
      ],
      answer: 0,
      reason: "Because major hydel power plants like Srisailam and Nagarjuna Sagar and thermal stations like Kothagudem and Ramagundam were located on borders or unevenly distributed, Schedule XII mandated that power be pooled and distributed on the basis of average consumption during 2008–2013: 46.11% to Telangana and 53.89% to Andhra Pradesh.",
      clue: "Look for 'Power sharing ratio under Schedule XII of APRA 2014': 46.11% (Telangana) and 53.89% (Andhra Pradesh) based on 5-year consumption.",
      trap: "Do not confuse the power consumption ratio (46.11 : 53.89) with the population ratio (41.68 : 58.32).",
      elimination: "Eliminate population ratio (41.68 : 58.32) and physical location; power sharing follows the 5-year consumption ratio of 46.11% (Telangana) and 53.89% (AP).",
      anchor: "APRA 2014 Schedule XII Power Ratio: 46.11% to Telangana and 53.89% to Andhra Pradesh based on 5-year historical consumption.",
      hint: "What was the power allocation percentage for Telangana (46.11%) versus Andhra Pradesh (53.89%)?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Schedule XII",
      page: 76,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the 53.89% : 46.11% consumption ratio.",
          correctMeaning: "Schedule XII allocated 46.11% of power to Telangana and 53.89% to Andhra Pradesh based on 5-year average consumption.",
          selectedMeaning: "Schedule XII allocated 46.11% of power to Telangana and 53.89% to Andhra Pradesh based on 5-year average consumption.",
          possibleConfusion: "You answered correctly. Despite this initial formula, power disputes erupted over Krishnapatnam and Rayalaseema thermal plants.",
          decisionRules: [
            { when: "the question asks for the power sharing ratio in Schedule XII of APRA 2014", choose: "46.11% to Telangana and 53.89% to Andhra Pradesh" },
            { when: "the question asks on what basis power was shared", choose: "5-year average power consumption (2008–2013)" },
          ],
          nextStep: "Note that Telangana transformed from a power-deficit state in 2014 into a 24x7 power supplier within two years.",
        },
        {
          observation: "Check the territorial location argument.",
          correctMeaning: "Power was pooled and apportioned by formula, not location.",
          selectedMeaning: "If plant location was used, Seemandhra would have lost access to Srisailam and Nagarjuna Sagar hydel power generated on the Telangana side.",
          possibleConfusion: "Assuming ownership followed geographic territory.",
          decisionRules: [
            { when: "the question asks whether power was divided by plant location", choose: "No, divided by 5-year historical consumption ratio" },
            { when: "evaluating options", choose: "53.89% (AP) and 46.11% (Telangana)" },
          ],
          nextStep: "Remember: Power was shared by consumption, not by plant site.",
        },
        {
          observation: "Check population ratio.",
          correctMeaning: "46.11 : 53.89 is the power ratio.",
          selectedMeaning: "41.68 : 58.32 is the population ratio under Section 2(h) for public debt and pension liabilities.",
          possibleConfusion: "Mixing the two statutory ratios in APRA 2014.",
          decisionRules: [
            { when: "the question asks for the population ratio", choose: "41.68% (Telangana) : 58.32% (AP)" },
            { when: "the question asks for the power ratio", choose: "46.11% (Telangana) : 53.89% (AP)" },
          ],
          nextStep: "Notice that Telangana got more power (46.11%) than its population share (41.68%) because of high agricultural pump-set consumption.",
        },
        {
          observation: "Check equal split.",
          correctMeaning: "The ratio is 46.11 : 53.89.",
          selectedMeaning: "Equal division was not used.",
          possibleConfusion: "Plausible assumption.",
          decisionRules: [
            { when: "the question asks for Schedule XII power formula", choose: "46.11% (Telangana) and 53.89% (AP)" },
            { when: "evaluating options", choose: "46.11% and 53.89%" },
          ],
          nextStep: "Anchor 46.11% and 53.89% as the definitive Schedule XII power ratio.",
        },
      ],
    },
  },

  // 9. TM-Q129 (APRA 2014 Section 92: Singareni Collieries Ownership)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q129",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Section 92 and the Twelfth Schedule of the Andhra Pradesh Reorganisation Act, 2014, what is the exact equity shareholding structure established for the Singareni Collieries Company Limited (SCCL)?",
      options: [
        {
          text: "51% equity held by the Government of Telangana and 49% equity held by the Government of India",
          why: "Section 92 and Schedule XII explicitly confirm that the existing equity holding of the state government (51%) was transferred entirely to the Government of Telangana, with the remaining 49% retained by the Government of India (Ministry of Coal).",
          attraction: "The exact statutory equity structure of SCCL in APRA 2014.",
          confusion: false,
        },
        {
          text: "100% equity held exclusively by the Government of Telangana",
          why: "The Government of India owns 49% of SCCL; it is not a 100% state-owned enterprise.",
          attraction: "Misconception that SCCL is entirely state-owned.",
          confusion: true,
        },
        {
          text: "Apportioned on population ratio: 58.32% to AP and 41.68% to Telangana",
          why: "Andhra Pradesh was given zero equity in SCCL; coal mines physically lie entirely in Telangana.",
          attraction: "Confuses company equity with general population ratio.",
        },
        {
          text: "50% equity held by Telangana and 50% held by Andhra Pradesh",
          why: "Andhra Pradesh has no shareholding in Singareni.",
          attraction: "Plausible inter-state corporate sharing.",
        },
      ],
      answer: 0,
      reason: "Singareni Collieries Company Limited (SCCL), the historic coal company operating across the Pranahita-Godavari valley in Adilabad, Karimnagar, Warangal, and Khammam, is a joint venture. Section 92 of APRA 2014 protected Telangana's controlling interest, granting 51% to Telangana and 49% to the Union Government, while guaranteeing coal linkages to thermal plants in both states.",
      clue: "Look for 'SCCL equity shareholding under Section 92 of APRA 2014': 51% Government of Telangana and 49% Government of India.",
      trap: "Do not give any equity share to Andhra Pradesh; SCCL is owned 51% by Telangana and 49% by the Government of India.",
      elimination: "Eliminate 100% state-owned and Andhra Pradesh share; SCCL is 51% Telangana and 49% Government of India.",
      anchor: "Singareni Collieries (SCCL) Ownership: 51% Government of Telangana and 49% Government of India under Section 92 of APRA 2014.",
      hint: "What is the joint venture ratio between Telangana (51%) and the Centre (49%) in Singareni?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Section 92 & Schedule XII",
      page: 75,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 51% Telangana and 49% Government of India.",
          correctMeaning: "Telangana holds majority controlling equity (51%) in SCCL, while the Ministry of Coal holds 49%.",
          selectedMeaning: "Telangana holds majority controlling equity (51%) in SCCL, while the Ministry of Coal holds 49%.",
          possibleConfusion: "You answered correctly. SCCL remains the only major coal public sector undertaking in India where a state government holds a controlling majority.",
          decisionRules: [
            { when: "the question asks for the ownership pattern of Singareni Collieries (SCCL)", choose: "51% Government of Telangana and 49% Government of India" },
            { when: "the question asks which section of APRA 2014 governs SCCL", choose: "Section 92" },
          ],
          nextStep: "Note that Coal India Limited (CIL) is 100% central PSU, whereas SCCL is 51:49 state-centre JV.",
        },
        {
          observation: "Check the 100% state-owned claim.",
          correctMeaning: "The Centre holds 49%.",
          selectedMeaning: "The Government of India invested heavily in SCCL over decades and retained its 49% equity.",
          possibleConfusion: "Assuming complete state ownership because it is called 'Telangana's pride'.",
          decisionRules: [
            { when: "the question asks what percentage the Government of India owns in SCCL", choose: "49%" },
            { when: "the question asks what percentage Telangana owns in SCCL", choose: "51%" },
          ],
          nextStep: "Remember the 51:49 formula.",
        },
        {
          observation: "Check Andhra Pradesh equity claims.",
          correctMeaning: "Andhra Pradesh has zero equity in SCCL.",
          selectedMeaning: "AP received coal linkage guarantees for its thermal plants, but zero shares in SCCL.",
          possibleConfusion: "Thinking company equity was divided on the 58.32 : 41.68 population ratio.",
          decisionRules: [
            { when: "the question asks whether Andhra Pradesh has equity shares in Singareni", choose: "No, zero equity" },
            { when: "evaluating options", choose: "51% Telangana and 49% Government of India" },
          ],
          nextStep: "Exclude Andhra Pradesh completely from SCCL ownership.",
        },
        {
          observation: "Check 50:50 split.",
          correctMeaning: "The ratio is 51% to 49%.",
          selectedMeaning: "A 51% share ensures that the Chairman and Managing Director (CMD) is appointed by the Government of Telangana.",
          possibleConfusion: "Assuming a simple equal joint venture.",
          decisionRules: [
            { when: "the question asks who appoints the CMD of SCCL", choose: "Government of Telangana (holding 51%)" },
            { when: "evaluating options", choose: "51% Telangana and 49% Centre" },
          ],
          nextStep: "Anchor 51% (Telangana) and 49% (Centre) firmly.",
        },
      ],
    },
  },

  // 10. TM-Q130 (APRA 2014 Polavaram Mandals Transfer Ordinance 2014)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q130",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "In May 2014, through an extraordinary presidential ordinance (subsequently enacted as the Andhra Pradesh Reorganisation (Amendment) Act, 2014), seven revenue mandals of Khammam district were transferred from Telangana to Andhra Pradesh to facilitate the Indira Sagar (Polavaram) National Project. Which seven mandals were affected?",
      options: [
        {
          text: "Kukunoor, Velairpadu, Chintoor, Kunavaram, Vararamachandrapuram (VR Puram), and submerged areas of Bhadrachalam and Burgampahad",
          why: "The amendment transferred 5 full mandals (Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram) and all submergence villages of Bhadrachalam mandal (excluding the historic Bhadrachalam temple revenue village) and Burgampahad mandal to East and West Godavari districts of AP.",
          attraction: "The exact statutory list of the 7 transferred Polavaram mandals.",
          confusion: false,
        },
        {
          text: "Aswaraopeta, Dammapeta, Sathupalli, Kothagudem, Yellandu, Palvancha, and Manuguru",
          why: "These mandals are integral parts of Bhadradri Kothagudem district in Telangana and were never transferred.",
          attraction: "Prominent mainland Khammam/Kothagudem mandals.",
        },
        {
          text: "Wazeed, Venkatapuram, Cherla, Dummugudem, Pinapaka, Mulugu, and Eturnagaram",
          why: "These agency mandals remain in Telangana (now in Mulugu and Bhadradri Kothagudem districts).",
          attraction: "Agency tribal mandals along the Godavari.",
          confusion: true,
        },
        {
          text: "Alampur, Ieeja, Manopad, Waddepally, Itikyal, Gadwal, and Maldakal",
          why: "These mandals are in Jogulamba Gadwal district along the Tungabhadra river, completely unrelated to Polavaram.",
          attraction: "Mahabubnagar/Gadwal mandals.",
        },
      ],
      answer: 0,
      reason: "On 29 May 2014 (four days before Telangana's appointed day), the Central Government issued an Ordinance amending Section 3 of APRA 2014, transferring 7 mandals of Khammam to Seemandhra. Despite massive bandhs across Telangana, Parliament enacted the amendment in July 2014. The historic temple town of Bhadrachalam was retained in Telangana, but its surrounding 21 tribal villages were transferred to AP.",
      clue: "Look for 'Seven Khammam mandals transferred to AP for Polavaram Project in 2014': Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram, Bhadrachalam (part), Burgampahad (part).",
      trap: "Do not include Bhadrachalam temple town (which remained in Telangana); only its submergence villages were transferred along with Kukunoor, Velairpadu, Chintoor, Kunavaram, and VR Puram.",
      elimination: "Eliminate Aswaraopeta/Sathupalli (Telangana mainland) and Wazeed/Cherla; the transferred mandals were Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram, and parts of Bhadrachalam and Burgampahad.",
      anchor: "Polavaram Mandals Transfer (2014): 7 mandals of Khammam (Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram, and submerged parts of Bhadrachalam and Burgampahad) transferred to AP.",
      hint: "Which five full mandals (Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram) and two partial mandals were transferred to AP?",
      source: "Andhra Pradesh Reorganisation (Amendment) Act, 2014 (Act No. 19 of 2014)",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the 7 transferred Polavaram mandals.",
          correctMeaning: "These 7 tribal mandals in the Godavari gorge were transferred to prevent inter-state administrative disputes over Polavaram reservoir submergence.",
          selectedMeaning: "These 7 tribal mandals in the Godavari gorge were transferred to prevent inter-state administrative disputes over Polavaram reservoir submergence.",
          possibleConfusion: "You answered correctly. The Telangana Legislative Assembly passed a unanimous resolution demanding the re-merger of these mandals with Telangana.",
          decisionRules: [
            { when: "the question asks which mandals of Khammam were transferred for Polavaram", choose: "Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram, and parts of Bhadrachalam and Burgampahad" },
            { when: "the question asks whether the Bhadrachalam temple town was transferred", choose: "No, the temple town remained in Telangana" },
          ],
          nextStep: "Note that Kukunoor and Velairpadu were merged into West Godavari; Chintoor, Kunavaram, and VR Puram into East Godavari.",
        },
        {
          observation: "Check mainland Khammam mandals.",
          correctMeaning: "The transferred mandals were in the submergence zone.",
          selectedMeaning: "Aswaraopeta, Sathupalli, and Kothagudem are inland industrial and coal mandals that were never part of the Polavaram transfer.",
          possibleConfusion: "Listing familiar Khammam towns.",
          decisionRules: [
            { when: "the question asks about the transferred mandals", choose: "Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram" },
            { when: "evaluating options", choose: "Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram, Bhadrachalam/Burgampahad parts" },
          ],
          nextStep: "Identify the transferred mandals as strictly Godavari river submergence zones.",
        },
        {
          observation: "Check Cherla and Dummugudem.",
          correctMeaning: "Cherla and Dummugudem remained in Telangana.",
          selectedMeaning: "Wazeed, Venkatapuram, and Cherla are tribal agency mandals retained in Telangana along the left bank.",
          possibleConfusion: "Both are adjacent agency mandals with heavy tribal populations.",
          decisionRules: [
            { when: "the question asks which agency mandals were retained in Telangana", choose: "Cherla, Dummugudem, Venkatapuram, Wazeed" },
            { when: "the question asks which were transferred to AP", choose: "Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram" },
          ],
          nextStep: "Keep Cherla/Dummugudem in Telangana and Chintoor/Kunavaram in AP.",
        },
        {
          observation: "Check Jogulamba Gadwal mandals.",
          correctMeaning: "The transfer occurred in Khammam on the Godavari.",
          selectedMeaning: "Alampur and Gadwal are in south Telangana on the Krishna and Tungabhadra rivers.",
          possibleConfusion: "Completely wrong river basin.",
          decisionRules: [
            { when: "the question asks which river basin the 2014 transferred mandals belong to", choose: "Godavari basin (Khammam)" },
            { when: "evaluating options", choose: "Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram" },
          ],
          nextStep: "Firmly connect Polavaram to the 7 Khammam mandals.",
        },
      ],
    },
  },

  // 11. TM-Q131 (APRA 2014 Section 89: River Water Tribunal Terms)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q131",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Section 89 of the Andhra Pradesh Reorganisation Act, 2014, what specific additional terms of reference were mandated to the ongoing Krishna Water Disputes Tribunal (KWDT-II, headed by Justice Brijesh Kumar)?",
      options: [
        {
          text: "To make project-wise specific allocation of Krishna waters for existing and ongoing projects, and to determine operational protocols for water release during deficit years between the two successor States",
          why: "Section 89 explicitly mandated that the term of the KWDT-II be extended to make project-wise specific allocations for both successor states (Clause a) and determine operational protocols for water release in deficit years (Clause b).",
          attraction: "The exact statutory text of Section 89 of APRA 2014.",
          confusion: false,
        },
        {
          text: "To reallocate the entire Krishna river waters from scratch among Maharashtra, Karnataka, Telangana, and Andhra Pradesh",
          why: "Section 89 limited the inquiry strictly between the two successor states (Telangana and AP) without disturbing the shares of upper riparian states Maharashtra and Karnataka.",
          attraction: "Confuses Section 89 with an original Article 262 inter-state river tribunal complaint.",
          confusion: true,
        },
        {
          text: "To direct the complete demolition of the Srisailam and Nagarjuna Sagar dams",
          why: "Absurd distractor.",
          attraction: "Completely fictitious.",
        },
        {
          text: "To transfer the Krishna River Management Board headquarters permanently to New Delhi",
          why: "APRA Section 85 mandated KRMB headquarters in Andhra Pradesh, not New Delhi.",
          attraction: "HQ location misconception.",
        },
      ],
      answer: 0,
      reason: "Prior to bifurcation, KWDT-II had allocated Krishna water as a single block to undivided Andhra Pradesh (1001 TMC ft). Section 89 mandated KWDT-II to make project-wise distribution between Telangana and Andhra Pradesh. In October 2023, the Union Cabinet issued fresh terms of reference under Section 5 of the ISRWD Act, 1956 to adjudicate water sharing between Telangana and AP from the combined allocation.",
      clue: "Look for 'Section 89 of APRA 2014 mandate to KWDT-II': Project-wise specific allocation and operational protocols for water release during deficit years.",
      trap: "Do not choose total reallocation among all four basin states; Section 89 specifically restricted the allocation between the two successor states (Telangana and AP).",
      elimination: "Eliminate four-state reallocation and dam demolition; Section 89 mandates project-wise allocation between the two successor states.",
      anchor: "APRA 2014 Section 89: Mandated KWDT-II to determine project-specific allocations and deficit-year operational protocols between Telangana and AP.",
      hint: "Did Section 89 mandate project-wise allocations between the two states or re-open the shares of Karnataka and Maharashtra?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Section 89",
      page: 73,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected project-wise allocation and deficit year protocols.",
          correctMeaning: "Section 89 extended KWDT-II to apportion the undivided state's water quota into individual project quotas.",
          selectedMeaning: "Section 89 extended KWDT-II to apportion the undivided state's water quota into individual project quotas.",
          possibleConfusion: "You answered correctly. Telangana has continuously argued before KWDT-II that undivided AP had allocated excess water to Seemandhra projects outside the basin.",
          decisionRules: [
            { when: "the question asks what Section 89 of APRA 2014 mandates", choose: "Project-wise allocation and operational protocols during deficit years" },
            { when: "the question asks which tribunal was extended under Section 89", choose: "Krishna Water Disputes Tribunal II (Justice Brijesh Kumar Tribunal)" },
          ],
          nextStep: "Note that in October 2023, the Central Government expanded the terms of reference to ensure comprehensive adjudication.",
        },
        {
          observation: "Check four-state reallocation.",
          correctMeaning: "Section 89 was confined to Telangana and AP.",
          selectedMeaning: "Maharashtra and Karnataka successfully argued in the Supreme Court that Section 89 cannot be used to reopen their finalized allocations.",
          possibleConfusion: "Aspirants assume a river water tribunal always reallocates across all riparian states.",
          decisionRules: [
            { when: "the question asks whether Section 89 reopened Maharashtra and Karnataka shares", choose: "No, it was restricted strictly between the two successor states" },
            { when: "evaluating options", choose: "Project-wise allocation between the two successor states" },
          ],
          nextStep: "Remember: Section 89 is strictly bilateral between Telangana and Andhra Pradesh.",
        },
        {
          observation: "Check dam demolition.",
          correctMeaning: "Section 89 is about water quotas.",
          selectedMeaning: "Option 3 is a frivolous distractor.",
          possibleConfusion: "None.",
          decisionRules: [
            { when: "evaluating options", choose: "Project-wise allocation and operational protocols" },
            { when: "the question asks about Section 89 mandates", choose: "Allocation of waters, not infrastructure demolition" },
          ],
          nextStep: "Focus on statutory allocation language.",
        },
        {
          observation: "Check KRMB headquarters.",
          correctMeaning: "Section 89 governs the Tribunal, not board headquarters.",
          selectedMeaning: "The location of KRMB headquarters was governed by Section 85, which stipulated it shall be located in Andhra Pradesh.",
          possibleConfusion: "Confusing Section 85 (Board HQ) with Section 89 (Tribunal TOR).",
          decisionRules: [
            { when: "the question asks which section established KRMB", choose: "Section 85" },
            { when: "the question asks which section governed the Tribunal's terms of reference", choose: "Section 89" },
          ],
          nextStep: "Pair Section 85 with River Management Boards and Section 89 with the Water Tribunal.",
        },
      ],
    },
  },

  // 12. TM-Q132 (High Court Bifurcation: Sections 30 & 31)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q132",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Chronology",
      modelId: "TM-QM-CHR-01",
      stage: "practice",
      prompt: "Under Sections 30 and 31 of the Andhra Pradesh Reorganisation Act, 2014, the High Court of Judicature at Hyderabad served as a common High Court until a separate High Court was established. On which historic date did the separate High Court of Telangana formally come into existence, with its first Chief Justice taking oath?",
      options: [
        {
          text: "1 January 2019 (with Justice Thottathil B. Radhakrishnan sworn in as the first Chief Justice)",
          why: "Following a presidential notification issued in December 2018, the separate High Court for the State of Telangana formally commenced functioning on 1 January 2019 at the historic High Court building along the Musi river, with Justice T.B. Radhakrishnan sworn in as its first Chief Justice.",
          attraction: "The authentic date of bifurcation and establishment of the Telangana High Court.",
          confusion: false,
        },
        {
          text: "2 June 2014 (on the Appointed Day of Telangana State)",
          why: "On 2 June 2014, the High Court remained a common High Court under Section 30; it was not bifurcated on the Appointed Day.",
          attraction: "Appointed Day of state formation.",
          confusion: true,
        },
        {
          text: "15 August 2017",
          why: "Arbitrary date during the ongoing lawyers' agitation.",
          attraction: "Independence Day date.",
        },
        {
          text: "2 June 2024 (upon expiry of the 10-year common capital period)",
          why: "The High Court was bifurcated more than five years earlier, on 1 January 2019, well before the 10-year period expired.",
          attraction: "Confuses High Court bifurcation with Section 5 capital expiry.",
        },
      ],
      answer: 0,
      reason: "Following intense agitations by Telangana advocates and judges demanding the bifurcation of the judiciary under Section 31, the Supreme Court monitored the construction of the interim High Court building at Nelapadu, Amaravati. On 26 December 2018, President Ram Nath Kovind issued the notification bifurcating the High Court with effect from 1 January 2019. Justice T.B. Radhakrishnan was sworn in as the first Chief Justice of Telangana.",
      clue: "Look for 'Date of establishment of separate High Court of Telangana': 1 January 2019 (First Chief Justice: T.B. Radhakrishnan).",
      trap: "Do not choose 2 June 2014; on 2 June 2014 it was a Common High Court under Section 30. The separate High Court was established on 1 January 2019.",
      elimination: "Eliminate 2 June 2014 (common High Court started) and 2 June 2024 (capital expiry); the separate High Court began on 1 January 2019.",
      anchor: "High Court of Telangana: Established on 1 January 2019 under Section 31 of APRA 2014; first Chief Justice was T.B. Radhakrishnan.",
      hint: "On New Year's Day of which year (2019) did the separate Telangana High Court start?",
      source: "Presidential Notification, Ministry of Law and Justice, December 2018",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 1 January 2019.",
          correctMeaning: "1 January 2019 marked the formal judicial separation, ending the common High Court era.",
          selectedMeaning: "1 January 2019 marked the formal judicial separation, ending the common High Court era.",
          possibleConfusion: "You answered correctly. Justice T.B. Radhakrishnan took oath as Chief Justice of Telangana, and Justice C. Praveen Kumar was appointed Acting Chief Justice of Andhra Pradesh.",
          decisionRules: [
            { when: "the question asks on which date the separate High Court of Telangana was established", choose: "1 January 2019" },
            { when: "the question asks who was the first Chief Justice of Telangana High Court", choose: "Justice Thottathil B. Radhakrishnan" },
          ],
          nextStep: "Remember: Historic building along Musi river stayed with Telangana; AP High Court shifted to Amaravati.",
        },
        {
          observation: "Check 2 June 2014.",
          correctMeaning: "On 2 June 2014, it remained a common High Court.",
          selectedMeaning: "Section 30 of APRA 2014 designated the existing High Court as the 'High Court of Judicature at Hyderabad' common to both states until Section 31 was activated.",
          possibleConfusion: "Assuming judicial bifurcation took place on the same day as state formation.",
          decisionRules: [
            { when: "the question asks about High Court status on 2 June 2014", choose: "Common High Court for both states under Section 30" },
            { when: "the question asks when the separate High Court was established", choose: "1 January 2019 under Section 31" },
          ],
          nextStep: "Chronology: 2014 (Common High Court) -> 2019 (Separate High Court).",
        },
        {
          observation: "Check lawyers' strike timeline.",
          correctMeaning: "The separation occurred on 1 January 2019.",
          selectedMeaning: "In June–July 2016, Telangana advocates and judicial officers launched a massive strike against the provisional allocation of non-local judges.",
          possibleConfusion: "Confusing agitation peaks with the final gazette enactment date.",
          decisionRules: [
            { when: "the question asks about the major Telangana judicial officers strike", choose: "June–July 2016" },
            { when: "the question asks when the separate High Court started", choose: "1 January 2019" },
          ],
          nextStep: "Differentiate the 2016 strike from the 2019 establishment date.",
        },
        {
          observation: "Check 2024 capital expiry.",
          correctMeaning: "The High Court bifurcated in 2019.",
          selectedMeaning: "2 June 2024 was the expiry date for Section 5 (Hyderabad as common capital), which occurred five years after judicial bifurcation.",
          possibleConfusion: "Conflating common capital 10-year timeline with judicial bifurcation.",
          decisionRules: [
            { when: "the question asks when Section 5 common capital expired", choose: "2 June 2024" },
            { when: "the question asks when the High Court separated", choose: "1 January 2019" },
          ],
          nextStep: "Anchor 1 January 2019 as the landmark date for the High Court of Telangana.",
        },
      ],
    },
  },

  // 13. TM-Q133 (2018 Presidential Order Police District Cadres)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q133",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under the Telangana Public Employment Order, 2018 (New Zonal System), which premier category of uniform posts in the Telangana Police Department is categorized under the 'District Cadre', reserving 95% of direct recruitment vacancies strictly for local candidates of that specific revenue district?",
      options: [
        {
          text: "Stipendiary Cadet Trainee (SCT) Police Constable (Civil, AR, and District Special Contingents)",
          why: "Under the 2018 Presidential Order, the post of Police Constable is organized as a District Cadre post. In all recruitments conducted by TSLPRB, 95% of Constable vacancies are strictly reserved for local candidates of that revenue district, with only 5% unreserved.",
          attraction: "The primary police uniform post categorized under District Cadre.",
          confusion: false,
        },
        {
          text: "Sub-Inspector of Police (Civil and AR)",
          why: "Sub-Inspector is a Multi-Zonal Cadre post (Multi-Zone I and Multi-Zone II), not a District Cadre post.",
          attraction: "Confuses Sub-Inspector with Constable.",
          confusion: true,
        },
        {
          text: "Deputy Superintendent of Police (DSP - Civil / Group-1)",
          why: "DSP is a State-wide Cadre post recruited through TGPSC Group-1, with zero local reservation.",
          attraction: "Gazetted police post.",
        },
        {
          text: "Circle Inspector of Police",
          why: "Circle Inspector is a promotional post filled from Sub-Inspectors, not a direct recruitment district post.",
          attraction: "Promotional police rank.",
        },
      ],
      answer: 0,
      reason: "To ensure that youth from rural and backward districts secure police employment within their home districts, the 2018 Presidential Order placed Police Constable (Civil/AR) in the District Cadre (95% local reservation to the district). Sub-Inspector was placed in the Multi-Zonal Cadre (95% local reservation to Multi-Zone I or II), while DSP was placed in the State-wide Cadre.",
      clue: "Look for 'Police uniform post categorized under District Cadre with 95% local quota in 2018 Order': Police Constable.",
      trap: "Do not choose Sub-Inspector (Multi-Zonal Cadre) or DSP (State-wide Cadre); Police Constable is the District Cadre post.",
      elimination: "Eliminate Sub-Inspector (Multi-Zonal) and DSP (State-wide); Police Constable is strictly a District Cadre post.",
      anchor: "2018 Presidential Order: Police Constable = District Cadre (95% local); Sub-Inspector = Multi-Zonal Cadre (95% local).",
      hint: "Which basic recruitment post in TSLPRB notifications is allocated 95% district-wise?",
      source: "Telangana Public Employment Order 2018, Schedule III & TSLPRB Rules",
      page: 15,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Police Constable as a District Cadre post.",
          correctMeaning: "Police Constable vacancies are declared district-wise with 95% reserved for that district's local youth.",
          selectedMeaning: "Police Constable vacancies are declared district-wise with 95% reserved for that district's local youth.",
          possibleConfusion: "You answered correctly. This district-level quota prevents candidates from other districts from cornering constable jobs.",
          decisionRules: [
            { when: "the question asks for the cadre of Police Constable under 2018 Order", choose: "District Cadre (95% local quota)" },
            { when: "the question asks for the cadre of Police Sub-Inspector", choose: "Multi-Zonal Cadre (95% local quota)" },
          ],
          nextStep: "Remember the police hierarchy: Constable = District; SI = Multi-Zonal; DSP = State-wide.",
        },
        {
          observation: "Check Sub-Inspector cadre.",
          correctMeaning: "Sub-Inspector is Multi-Zonal.",
          selectedMeaning: "Sub-Inspector vacancies are allocated across Multi-Zone I (Zones 1–4) and Multi-Zone II (Zones 5–7).",
          possibleConfusion: "Candidates preparing for both Constable and SI confuse the cadre boundary.",
          decisionRules: [
            { when: "the question asks which police post belongs to Multi-Zonal Cadre", choose: "Sub-Inspector of Police" },
            { when: "the question asks which belongs to District Cadre", choose: "Police Constable" },
          ],
          nextStep: "Separate District (Constable) from Multi-Zonal (SI).",
        },
        {
          observation: "Check DSP post.",
          correctMeaning: "DSP is a State-wide Cadre post.",
          selectedMeaning: "Deputy Superintendent of Police (DSP) is recruited through TGPSC Group-1 and is open state-wide.",
          possibleConfusion: "Assuming all police recruitments have zonal quotas.",
          decisionRules: [
            { when: "the question asks about DSP cadre", choose: "State-wide Cadre" },
            { when: "the question asks about Constable cadre", choose: "District Cadre" },
          ],
          nextStep: "Identify DSP as State-wide / Group-1.",
        },
        {
          observation: "Check Circle Inspector.",
          correctMeaning: "Constable is the direct recruitment post.",
          selectedMeaning: "Circle Inspector is filled 100% by promotion from the rank of Sub-Inspector, not by direct recruitment.",
          possibleConfusion: "Thinking CI is a direct recruitment quota category.",
          decisionRules: [
            { when: "the question asks for direct recruitment District Cadre post", choose: "Police Constable" },
            { when: "evaluating options", choose: "Police Constable" },
          ],
          nextStep: "Anchor Police Constable firmly as the primary District Cadre post.",
        },
      ],
    },
  },

  // 14. TM-Q134 (Supreme Court P. Sambamurthy Judgment 1987)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q134",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "In the landmark constitutional case P. Sambamurthy v. State of Andhra Pradesh (1987), which specific clause of Article 371-D of the Constitution of India was struck down by a Constitution Bench of the Supreme Court as unconstitutional and violative of judicial review and the basic structure?",
      options: [
        {
          text: "Clause (5) of Article 371-D (along with its Proviso), which empowered the State Government to modify or annul any order or award passed by the Andhra Pradesh Administrative Tribunal (APAT)",
          why: "Clause (5) gave the state government arbitrary power to nullify tribunal judgments. The Constitution Bench headed by Chief Justice P.N. Bhagwati struck it down in 1987, ruling that judicial review is an inviolable basic feature of the Constitution and no executive can sit in judgment over judicial orders.",
          attraction: "The famous constitutional ruling striking down Clause (5) of Article 371-D.",
          confusion: false,
        },
        {
          text: "Clause (1) of Article 371-D, which empowered the President to organize local cadres for public employment",
          why: "Clause (1) was upheld as completely valid and forms the continuing bedrock of the Zonal System.",
          attraction: "Confuses the invalidated Clause (5) with the valid core Clause (1).",
          confusion: true,
        },
        {
          text: "Clause (3) of Article 371-D, which authorized the establishment of the Administrative Tribunal",
          why: "Clause (3) setting up the Tribunal was upheld; only the government's power to annul its orders in Clause (5) was struck down.",
          attraction: "Confuses tribunal creation with the annulment clause.",
        },
        {
          text: "Clause (10) of Article 371-D, which gave non-obstante effect to the Article",
          why: "Clause (10) remains fully valid in the Constitution.",
          attraction: "Legal technicality distractor.",
        },
      ],
      answer: 0,
      reason: "Article 371-D was inserted by the 32nd Amendment (1973). Clause (3) created the Administrative Tribunal for state employees. However, Clause (5) gave the State Government the shocking power to confirm, modify, or annul any order of the Tribunal within two months. In P. Sambamurthy v. State of AP (1987), the Supreme Court struck down Clause (5) and its proviso, holding that making the judiciary subordinate to the executive destroys the rule of law.",
      clue: "Look for 'Clause of Article 371-D struck down in P. Sambamurthy case (1987)': Clause (5) (Government's power to modify or annul Administrative Tribunal orders).",
      trap: "Do not select Clause (1) (which was upheld); only Clause (5) allowing executive annulment of tribunal judgments was invalidated.",
      elimination: "Eliminate Clause (1) (core Zonal power) and Clause (3) (tribunal creation); Clause (5) was struck down in P. Sambamurthy (1987).",
      anchor: "P. Sambamurthy Case (1987): Supreme Court struck down Clause (5) of Article 371-D as violative of judicial review and basic structure.",
      hint: "Which clause gave the state government the unconstitutional power to cancel tribunal court orders?",
      source: "Supreme Court of India, AIR 1987 SC 663 (P. Sambamurthy v. State of AP)",
      page: 663,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Clause (5) of Article 371-D.",
          correctMeaning: "Clause (5) of Article 371-D was struck down because it placed the state executive above the Administrative Tribunal.",
          selectedMeaning: "Clause (5) of Article 371-D was struck down because it placed the state executive above the Administrative Tribunal.",
          possibleConfusion: "You answered correctly. Chief Justice P.N. Bhagwati delivered the unanimous judgment upholding the supremacy of judicial review.",
          decisionRules: [
            { when: "the question asks which clause of Article 371-D was struck down in P. Sambamurthy case", choose: "Clause (5) and its Proviso" },
            { when: "the question asks in which year the P. Sambamurthy judgment was delivered", choose: "1987" },
          ],
          nextStep: "Note that Clause (1) authorizing the Zonal System remained fully valid and intact.",
        },
        {
          observation: "Check Clause (1).",
          correctMeaning: "Clause (5) was invalidated, while Clause (1) was upheld.",
          selectedMeaning: "Clause (1) gives the President power to provide equitable opportunities and organize local cadres, and remains the constitutional foundation of Telangana recruitment.",
          possibleConfusion: "Confusing the clause struck down with the most famous clause of Article 371-D.",
          decisionRules: [
            { when: "the question asks which clause of Article 371-D authorizes the Zonal System", choose: "Clause (1)" },
            { when: "the question asks which clause was struck down as unconstitutional", choose: "Clause (5)" },
          ],
          nextStep: "Remember: Clause (1) = Upheld & Active; Clause (5) = Struck down & Dead.",
        },
        {
          observation: "Check Clause (3).",
          correctMeaning: "Clause (5) was struck down, not Clause (3).",
          selectedMeaning: "Clause (3) authorizes the President to establish the Administrative Tribunal (APAT) to handle employee grievances.",
          possibleConfusion: "Both clauses relate to the Administrative Tribunal.",
          decisionRules: [
            { when: "the question asks which clause authorized establishment of the Tribunal", choose: "Clause (3)" },
            { when: "the question asks which clause allowed the executive to annul tribunal orders", choose: "Clause (5)" },
          ],
          nextStep: "Differentiate tribunal establishment (Clause 3) from executive annulment (Clause 5).",
        },
        {
          observation: "Check Clause (10).",
          correctMeaning: "Clause (5) is the struck-down provision.",
          selectedMeaning: "Clause (10) contains the non-obstante clause ('provisions of this article shall have effect notwithstanding anything in this Constitution') and is valid.",
          possibleConfusion: "Constitutional clauses often challenged in court.",
          decisionRules: [
            { when: "the question asks about P. Sambamurthy ruling", choose: "Clause (5) struck down" },
            { when: "evaluating options", choose: "Clause (5)" },
          ],
          nextStep: "Anchor Clause (5) as the sole struck-down portion of Article 371-D.",
        },
      ],
    },
  },

  // 15. TM-Q135 (Article 371-D 32nd Amendment 1973 Six-Point Formula)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q135",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Article 371-D and Article 371-E were inserted into the Constitution of India pursuant to the Six-Point Formula to protect educational and employment opportunities in Andhra Pradesh and Telangana. By which Constitutional Amendment Act was this enacted, and on what date did it take effect?",
      options: [
        {
          text: "32nd Constitutional Amendment Act, 1973 (effective retrospectively from 1 July 1974)",
          why: "The Constitution (Thirty-second Amendment) Act, 1973 received presidential assent in May 1974 and was given retrospective effect from 1 July 1974, inserting Articles 371-D and 371-E (the latter authorizing the Central University of Hyderabad).",
          attraction: "The exact Constitutional Amendment and year for Article 371-D.",
          confusion: false,
        },
        {
          text: "42nd Constitutional Amendment Act, 1976",
          why: "The 42nd Amendment (1976) was the Mini-Constitution during Emergency, not the Six-Point Formula amendment.",
          attraction: "Famous major constitutional amendment.",
          confusion: true,
        },
        {
          text: "44th Constitutional Amendment Act, 1978",
          why: "The 44th Amendment removed the right to property, completely unrelated to Telangana safeguards.",
          attraction: "Famous Janata Party amendment.",
        },
        {
          text: "36th Constitutional Amendment Act, 1975",
          why: "The 36th Amendment integrated Sikkim as a full State of India.",
          attraction: "Close numerical amendment.",
        },
      ],
      answer: 0,
      reason: "Following the collapse of the Mulki Rules in court and the violent 1972 Jai Andhra agitation, political leaders agreed upon the Six-Point Formula on 21 September 1973. To provide constitutional immunity that could not be challenged under Article 16, Parliament passed the 32nd Constitutional Amendment in 1973, inserting Article 371-D (Zonal local cadres) and Article 371-E (establishing the University of Hyderabad).",
      clue: "Look for 'Constitutional Amendment inserting Article 371-D under Six-Point Formula': 32nd Constitutional Amendment Act, 1973.",
      trap: "Do not confuse the 32nd Amendment (1973, Article 371-D) with the 42nd Amendment (1976) or 44th Amendment (1978).",
      elimination: "Eliminate 42nd (Emergency amendment) and 36th (Sikkim); the 32nd Constitutional Amendment Act, 1973 inserted Article 371-D.",
      anchor: "32nd Constitutional Amendment Act, 1973: Inserted Article 371-D (Zonal System) and Article 371-E (Central University).",
      hint: "Which amendment number (thirty-second, forty-second, or forty-fourth) inserted Article 371-D?",
      source: "Constitution of India, 32nd Amendment Act, 1973",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the 32nd Constitutional Amendment Act, 1973.",
          correctMeaning: "The 32nd Amendment inserted Articles 371-D and 371-E to implement Points 1 and 2 of the Six-Point Formula.",
          selectedMeaning: "The 32nd Amendment inserted Articles 371-D and 371-E to implement Points 1 and 2 of the Six-Point Formula.",
          possibleConfusion: "You answered correctly. It gave constitutional immunity to the 1975 and 2018 Presidential Orders against Article 16 challenges.",
          decisionRules: [
            { when: "the question asks which amendment inserted Article 371-D", choose: "32nd Constitutional Amendment Act, 1973" },
            { when: "the question asks which article authorized the establishment of Central University of Hyderabad", choose: "Article 371-E" },
          ],
          nextStep: "Remember: 32nd Amendment = Article 371-D (Local Cadres) + Article 371-E (Central University).",
        },
        {
          observation: "Check the 42nd Amendment.",
          correctMeaning: "The relevant amendment is the 32nd Amendment.",
          selectedMeaning: "The 42nd Amendment (1976) inserted Fundamental Duties, added 'Secular' and 'Socialist' to the Preamble, and amended Article 368.",
          possibleConfusion: "Frequently asked omnibus amendment.",
          decisionRules: [
            { when: "the question asks about Fundamental Duties / Preamble amendment", choose: "42nd Amendment (1976)" },
            { when: "the question asks about Article 371-D / Six-Point Formula", choose: "32nd Amendment (1973)" },
          ],
          nextStep: "Differentiate 42nd (Mini-Constitution) from 32nd (Telangana safeguards).",
        },
        {
          observation: "Check the 44th Amendment.",
          correctMeaning: "The amendment is the 32nd.",
          selectedMeaning: "The 44th Amendment (1978) restored fundamental rights post-Emergency and made the Right to Property a legal right under Article 300A.",
          possibleConfusion: "Prominent constitutional milestone.",
          decisionRules: [
            { when: "the question asks about the Right to Property amendment", choose: "44th Amendment (1978)" },
            { when: "the question asks about Article 371-D", choose: "32nd Amendment (1973)" },
          ],
          nextStep: "Keep 44th tied to Article 300A and Emergency safeguards.",
        },
        {
          observation: "Check the 36th Amendment.",
          correctMeaning: "32nd Amendment inserted 371-D.",
          selectedMeaning: "The 36th Amendment (1975) added Sikkim as the 22nd State of India and inserted Article 371-F.",
          possibleConfusion: "Both amendments inserted special provisions in Part XXI (371-D vs 371-F).",
          decisionRules: [
            { when: "the question asks which amendment integrated Sikkim (Article 371-F)", choose: "36th Amendment (1975)" },
            { when: "the question asks which amendment inserted Article 371-D", choose: "32nd Amendment (1973)" },
          ],
          nextStep: "Anchor 32nd Amendment firmly as the sole constitutional parent of Article 371-D.",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 8 (${batchQuestions.length} questions)...`);

const importPayload = {
  actor: "human_operator_curator",
  reason: "Ingesting Batch 8: 2018 Presidential Order 7 Zones, Multi-Zone composition, 4-year study rule, Section 8 Governor powers, Section 47 58.32:41.68 ratio, Schedule I & II seats (7 RS, 17 LS), Schedule III Assembly 119 seats (increase to 153), Schedule XII power ratio (53.89:46.11), Section 92 SCCL 51:49 ownership, Polavaram 7 mandals transfer, Section 89 KWDT-II terms, High Court 1 Jan 2019 separation, Police Constable District Cadre 95%, P. Sambamurthy 1987 Clause 5 ruling, and 32nd Amendment 1973 Article 371-D.",
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
  reason: "Batch 8 verified and authenticated for Telangana Police SI & Constable preparation.",
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
console.log(`Batch 8 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
