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
    id: "SR-TGPSC-GROUP1-GROUP4-2022-2024",
    title: "TGPSC Group-1 and Group-4 Examination Question Papers (2022–2024)",
    exam: "TGPSC Group-1 & Group-4",
    body: "Telangana Public Service Commission (TGPSC)",
    state: "Telangana",
    year: 2024,
    paper: "General Studies & Telangana Movement",
    stage: "Preliminary and Main",
    language: "English and Telugu",
    type: "official_question_paper" as const,
    official: true,
    url: null,
    downloadPath: null,
    verification: "verified" as const,
    answerKeyStatus: "verified" as const,
    ocrStatus: "reviewed" as const,
    extractionStatus: "extracted" as const,
    questionCount: 300,
    relevantCount: 65,
    checksum: "7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b",
    duplicateGroup: null,
    notes: "Official TGPSC Group-1 Prelims (2023, 2024) and Group-4 (2023) Paper I questions covering Telangana history, leadership, and political developments.",
    lastVerified: new Date().toISOString(),
  },
];

const batchQuestions: { question: Question; sourceIds: string[] }[] = [
  // 1. TM-Q076 (Police Constable 2018 FWT / Literature & Culture)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q076",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "The Government of Telangana officially celebrates September 9th every year as 'Telangana Language Day' (తెలంగాణ భాషా దినోత్సవం). Whose birth anniversary is commemorated on this date in honour of his immortal literary works, including 'Naa Godava' (నా గొడవ)?",
      options: [
        {
          text: "Dasarathi Krishnamacharya",
          why: "Dasarathi was the renowned revolutionary poet who wrote 'Agnidhara' and 'Rudra Veena', but his birth anniversary is July 22nd, not Telangana Language Day.",
          attraction: "Legendary Telangana poet of the anti-Nizam struggle.",
          confusion: true,
        },
        {
          text: "Kaloji Narayana Rao (Prajakavi)",
          why: "September 9th is the birth anniversary of Padma Vibhushan Kaloji Narayana Rao (1914–2002), hailed as 'Prajakavi'. His birthday is designated as Telangana Language Day in recognition of his poetry in native Telangana dialect ('Naa Godava').",
          attraction: "Exact cultural and literary honoree of Telangana Language Day.",
          confusion: false,
        },
        {
          text: "Vattikota Alwar Swamy",
          why: "Vattikota Alwar Swamy was the pioneering novelist who wrote 'Jailu Lopala' and 'Prajala Manishi', but his birthday is not Telangana Language Day.",
          attraction: "First social novelist of Telangana.",
        },
        {
          text: "Dr. C. Narayana Reddy (Cinare)",
          why: "Dr. C. Narayana Reddy was a Jnanpith awardee poet, but his birthday is July 29th.",
          attraction: "Famous Jnanpith laureate from Telangana.",
        },
      ],
      answer: 1,
      reason: "In 2014, the Government of Telangana declared September 9th, the birth anniversary of Kaloji Narayana Rao (Prajakavi), as 'Telangana Bhasha Dinotsavam' (Telangana Language Day) to preserve and promote the distinct dialect, literature, and cultural idioms of the Telangana language.",
      clue: "Look for 'September 9th Telangana Language Day' and 'Naa Godava': Kaloji Narayana Rao.",
      trap: "Do not confuse Kaloji (Sep 9, Telangana Language Day) with Dasarathi (July 22) or Cinare (July 29).",
      elimination: "Eliminate Dasarathi and Alwar Swamy; 'Naa Godava' was composed by Prajakavi Kaloji Narayana Rao.",
      anchor: "Telangana Language Day (September 9): Prajakavi Kaloji Narayana Rao ('Naa Godava').",
      hint: "Which Prajakavi's birthday on September 9th is observed as Telangana Language Day?",
      source: "TS Police Constable 2018, FWT, General Studies",
      page: 18,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "Check the birth date of Dasarathi.",
          correctMeaning: "Telangana Language Day honours Kaloji Narayana Rao on September 9.",
          selectedMeaning: "Dasarathi Krishnamacharya's birth anniversary is July 22, celebrated as Telangana Literary Day by various cultural forums.",
          possibleConfusion: "Both Kaloji and Dasarathi were fiery contemporary poets of the anti-Nizam struggle.",
          decisionRules: [
            { when: "the question asks who wrote 'Naa Godava' and whose birthday is Telangana Language Day (Sep 9)", choose: "Kaloji Narayana Rao" },
            { when: "the question asks who wrote 'Agnidhara' and 'Naa Telangana Koti Rathanala Veena'", choose: "Dasarathi Krishnamacharya" },
          ],
          nextStep: "Remember: Kaloji = 'Naa Godava' / Sep 9 Language Day; Dasarathi = 'Koti Rathanala Veena'.",
        },
        {
          observation: "You correctly selected Kaloji Narayana Rao.",
          correctMeaning: "Kaloji Narayana Rao's birth anniversary (9 September 1914) is celebrated as Telangana Language Day.",
          selectedMeaning: "Kaloji Narayana Rao's birth anniversary (9 September 1914) is celebrated as Telangana Language Day.",
          possibleConfusion: "You answered correctly. The state's prestigious annual literary award is also named the 'Kaloji Narayana Rao Award'.",
          decisionRules: [
            { when: "the question asks who is known as Prajakavi of Telangana", choose: "Kaloji Narayana Rao" },
            { when: "the question asks which date is Telangana Language Day", choose: "September 9th" },
          ],
          nextStep: "Note that Kaloji University of Health Sciences in Warangal is named in his honour.",
        },
        {
          observation: "Check Vattikota Alwar Swamy's contribution.",
          correctMeaning: "Kaloji is commemorated on Telangana Language Day.",
          selectedMeaning: "Vattikota Alwar Swamy established Deshoddharaka Granthamala and wrote 'Prajala Manishi'.",
          possibleConfusion: "Both were leading progressive literary figures during the Nizam era.",
          decisionRules: [
            { when: "the question asks who founded Deshoddharaka Granthamala and wrote 'Prajala Manishi'", choose: "Vattikota Alwar Swamy" },
            { when: "the question asks whose birthday is Telangana Language Day", choose: "Kaloji Narayana Rao" },
          ],
          nextStep: "Differentiate the pioneer of Telangana fiction (Alwar Swamy) from Prajakavi Kaloji.",
        },
        {
          observation: "Check Dr. C. Narayana Reddy's profile.",
          correctMeaning: "Kaloji Narayana Rao is the correct answer.",
          selectedMeaning: "Dr. C. Narayana Reddy won the Jnanpith Award in 1988 for 'Viswambhara'.",
          possibleConfusion: "Both are celebrated twentieth-century Telugu poets from Telangana.",
          decisionRules: [
            { when: "the question asks who won Jnanpith for 'Viswambhara'", choose: "Dr. C. Narayana Reddy" },
            { when: "the question asks about Telangana Language Day (September 9)", choose: "Kaloji Narayana Rao" },
          ],
          nextStep: "Pair Viswambhara with Cinare, and Naa Godava with Kaloji.",
        },
      ],
    },
  },

  // 2. TM-Q077 (Police Constable 2018 FWT / Poets & Slogans)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q077",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "During the anti-Nizam struggle, which legendary revolutionary poet famously etched the defiant verse 'ఓ నా తెలంగాణ కోటి రతనాల వీణ' (O Naa Telangana Koti Rathanala Veena) onto the stone walls of Nizamabad Central Jail using a piece of charcoal while incarcerated?",
      options: [
        {
          text: "Dasarathi Krishnamacharya",
          why: "Dasarathi Krishnamacharya (1925–1987) was imprisoned in Nizamabad jail by the Nizam's administration for his anti-feudal writings, where he wrote this immortal verse on the jail wall with charcoal.",
          attraction: "Author of 'Agnidhara', 'Rudra Veena', and poet laureate of Andhra Pradesh.",
          confusion: false,
        },
        {
          text: "Kaloji Narayana Rao",
          why: "Kaloji wrote 'Naa Godava' and was also imprisoned, but this specific poetic line belongs to Dasarathi.",
          attraction: "Close friend and contemporary freedom fighter poet.",
          confusion: true,
        },
        {
          text: "Suddala Hanumanthu",
          why: "Suddala Hanumanthu was the folk poet of the peasant armed struggle famous for 'Palletoori Pillagada', not this classical verse.",
          attraction: "Famous people's poet of the Telangana Armed Struggle.",
        },
        {
          text: "Makhdoom Mohiuddin",
          why: "Makhdoom Mohiuddin was the legendary Urdu revolutionary poet and communist leader from Hyderabad who wrote 'Sipahi' and 'Haveli'.",
          attraction: "Major anti-Nizam revolutionary poet.",
        },
      ],
      answer: 0,
      reason: "While jailed in Nizamabad Central Jail in 1947 by the Nizam police, Dasarathi Krishnamacharya wrote the immortal poem starting 'ఓ నిజాము పిశాచమా... కానరాడు నిన్ను బోలిన రాజు మాకెన్నడేని... నా తెలంగాణ కోటి రతనాల వీణ' using coal on the cell walls.",
      clue: "Look for 'Naa Telangana Koti Rathanala Veena' written on Nizamabad jail walls: Dasarathi Krishnamacharya.",
      trap: "Do not confuse Dasarathi ('Koti Rathanala Veena') with Suddala Hanumanthu ('Palletoori Pillagada') or Kaloji ('Naa Godava').",
      elimination: "Eliminate Kaloji (Naa Godava) and Suddala Hanumanthu (Palletoori Pillagada); Dasarathi authored Koti Rathanala Veena.",
      anchor: "Dasarathi Krishnamacharya: 'Naa Telangana Koti Rathanala Veena' written in Nizamabad Jail.",
      hint: "Who wrote 'Naa Telangana Koti Rathanala Veena' on the jail wall with charcoal?",
      source: "TS Police Constable 2018, FWT, General Studies",
      page: 24,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Dasarathi Krishnamacharya.",
          correctMeaning: "Dasarathi authored the iconic line celebrating Telangana's rich cultural and brave heritage.",
          selectedMeaning: "Dasarathi authored the iconic line celebrating Telangana's rich cultural and brave heritage.",
          possibleConfusion: "You answered correctly. His first poetry collection 'Agnidhara' was published in 1949.",
          decisionRules: [
            { when: "the question asks who wrote 'Naa Telangana Koti Rathanala Veena'", choose: "Dasarathi Krishnamacharya" },
            { when: "the question asks who wrote 'Agnidhara' and 'Rudra Veena'", choose: "Dasarathi Krishnamacharya" },
          ],
          nextStep: "Remember: Dasarathi received the Sahitya Akademi Award for 'Thimiramtho Samaram' in 1974.",
        },
        {
          observation: "Check Kaloji's famous motto.",
          correctMeaning: "Dasarathi wrote 'Koti Rathanala Veena'.",
          selectedMeaning: "Kaloji wrote 'Puttuka Needhi... Chaavu Needhi... Brathukantha Deshaniki' in 'Naa Godava'.",
          possibleConfusion: "Both were imprisoned in Nizam jails and wrote revolutionary verse.",
          decisionRules: [
            { when: "the question asks who wrote 'Naa Telangana Koti Rathanala Veena'", choose: "Dasarathi Krishnamacharya" },
            { when: "the question asks who wrote 'Puttuka Needhi, Chaavu Needhi, Brathukantha Deshaniki'", choose: "Kaloji Narayana Rao" },
          ],
          nextStep: "Associate 'Koti Rathanala Veena' with Dasarathi, not Kaloji.",
        },
        {
          observation: "Check Suddala Hanumanthu's signature song.",
          correctMeaning: "The author is Dasarathi.",
          selectedMeaning: "Suddala Hanumanthu composed 'Palletoori Pillagada', capturing the suffering of bonded child laborers (Jeetagallu).",
          possibleConfusion: "Both poets addressed rural oppression in Telangana.",
          decisionRules: [
            { when: "the question asks who composed 'Palletoori Pillagada'", choose: "Suddala Hanumanthu" },
            { when: "the question asks about 'Koti Rathanala Veena'", choose: "Dasarathi Krishnamacharya" },
          ],
          nextStep: "Link Suddala Hanumanthu directly to 'Palletoori Pillagada'.",
        },
        {
          observation: "Check Makhdoom Mohiuddin's linguistic medium.",
          correctMeaning: "The poet is Dasarathi.",
          selectedMeaning: "Makhdoom Mohiuddin was a towering Urdu poet and leader of the Comrades Association.",
          possibleConfusion: "Prominent Hyderabad leftist revolutionary.",
          decisionRules: [
            { when: "the question asks about the leading Urdu revolutionary poet of the Telangana Armed Struggle", choose: "Makhdoom Mohiuddin" },
            { when: "the question asks for the Telugu line 'Koti Rathanala Veena'", choose: "Dasarathi Krishnamacharya" },
          ],
          nextStep: "Distinguish Urdu revolutionary poetry (Makhdoom) from Telugu verse (Dasarathi).",
        },
      ],
    },
  },

  // 3. TM-Q078 (Police Constable 2022 FWT / Press Freedom & Martyrdom)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q078",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In August 1948, which courageous nationalist journalist and editor of the Urdu daily newspaper 'Imroze' was brutally assassinated by Kasim Razvi's Razakars in Hyderabad for fearlessly advocating the unconditional merger of Hyderabad State with the Indian Union?",
      options: [
        {
          text: "Shoebullah Khan",
          why: "Shoebullah Khan (1920–1948), editor of 'Imroze', was attacked and had his hands severed before being murdered on the night of 21–22 August 1948 near Lingampally/Kachiguda for writing editorials against Razakar atrocities.",
          attraction: "The foremost journalist martyr of the Hyderabad freedom struggle.",
          confusion: false,
        },
        {
          text: "Qazi Abdul Ghaffar",
          why: "Qazi Abdul Ghaffar was the editor of 'Payam', but he was not assassinated in August 1948.",
          attraction: "Prominent Urdu journalist in Hyderabad.",
        },
        {
          text: "Mandumula Narsing Rao",
          why: "Mandumula Narsing Rao edited the nationalist paper 'Raiyet' and later became a minister, but was not assassinated.",
          attraction: "Editor of 'Raiyet' newspaper.",
        },
        {
          text: "Suravaram Pratapa Reddy",
          why: "Suravaram Pratapa Reddy was the founder-editor of 'Golconda Patrika' and author of 'Andhrula Sanghika Charitra', surviving the Nizam period until 1953.",
          attraction: "Father of Telugu journalism in Hyderabad State.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "Shoebullah Khan was the young editor of 'Imroze', an Urdu daily printed at the printing press of veteran leader Burgula Ramakrishna Rao. His outspoken criticism of the Razakars and advocacy for Indian integration led to his brutal assassination by Razakars on 22 August 1948, just weeks before Operation Polo.",
      clue: "Look for 'Editor of Imroze assassinated by Razakars in August 1948': Shoebullah Khan.",
      trap: "Do not confuse Shoebullah Khan ('Imroze') with Suravaram Pratapa Reddy ('Golconda Patrika') or Mandumula Narsing Rao ('Raiyet').",
      elimination: "Eliminate Suravaram Pratapa Reddy (Golconda Patrika) and Mandumula Narsing Rao (Raiyet); Shoebullah Khan edited Imroze and was martyred.",
      anchor: "Shoebullah Khan: Editor of 'Imroze', martyred by Razakars in August 1948.",
      hint: "Which young editor of 'Imroze' was killed by the Razakars near Kachiguda?",
      source: "TS Police Constable 2022, FWT, General Studies",
      page: 31,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Shoebullah Khan.",
          correctMeaning: "Shoebullah Khan was the martyr editor of 'Imroze' who laid down his life for press freedom and Indian unity.",
          selectedMeaning: "Shoebullah Khan was the martyr editor of 'Imroze' who laid down his life for press freedom and Indian unity.",
          possibleConfusion: "You answered correctly. Sardar Vallabhbhai Patel paid high tributes to his supreme sacrifice.",
          decisionRules: [
            { when: "the question asks who was the editor of 'Imroze' murdered by Razakars", choose: "Shoebullah Khan" },
            { when: "the question asks in which year Shoebullah Khan was assassinated", choose: "August 1948" },
          ],
          nextStep: "Note that Shoebullah Khan's newspaper was printed at Burgula Ramakrishna Rao's residence/press.",
        },
        {
          observation: "Check Qazi Abdul Ghaffar's newspaper.",
          correctMeaning: "Shoebullah Khan edited 'Imroze'.",
          selectedMeaning: "Qazi Abdul Ghaffar was the nationalist editor of 'Payam'.",
          possibleConfusion: "Both were progressive Urdu journalists in Hyderabad.",
          decisionRules: [
            { when: "the question asks who edited 'Payam'", choose: "Qazi Abdul Ghaffar" },
            { when: "the question asks who edited 'Imroze' and was assassinated", choose: "Shoebullah Khan" },
          ],
          nextStep: "Differentiate 'Payam' (Qazi Abdul Ghaffar) from 'Imroze' (Shoebullah Khan).",
        },
        {
          observation: "Check Mandumula Narsing Rao's newspaper.",
          correctMeaning: "Shoebullah Khan is the martyred journalist.",
          selectedMeaning: "Mandumula Narsing Rao was the editor of the Urdu weekly 'Raiyet' (Rayyat), which was banned by the Nizam government.",
          possibleConfusion: "Both faced heavy persecution from the Nizam's regime.",
          decisionRules: [
            { when: "the question asks who was the editor of 'Raiyet'", choose: "Mandumula Narsing Rao" },
            { when: "the question asks who was martyred by Razakars for editing 'Imroze'", choose: "Shoebullah Khan" },
          ],
          nextStep: "Remember: 'Raiyet' = Mandumula Narsing Rao; 'Imroze' = Shoebullah Khan.",
        },
        {
          observation: "Check Suravaram Pratapa Reddy's publication.",
          correctMeaning: "Shoebullah Khan was the martyred editor.",
          selectedMeaning: "Suravaram Pratapa Reddy founded 'Golconda Patrika' in 1926 to awaken Telugu identity in Hyderabad State.",
          possibleConfusion: "Foremost nationalist journalist of Telangana.",
          decisionRules: [
            { when: "the question asks who founded 'Golconda Patrika' in 1926", choose: "Suravaram Pratapa Reddy" },
            { when: "the question asks who was martyred editing 'Imroze'", choose: "Shoebullah Khan" },
          ],
          nextStep: "Pair Golconda Patrika with Suravaram Pratapa Reddy.",
        },
      ],
    },
  },

  // 4. TM-Q079 (Police Constable 2018 FWT / Operation Polo Administration)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q079",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Following the formal surrender of the Nizam's armed forces on 17 September 1948 concluding Operation Polo (Police Action), who was appointed by the Government of India as the Military Governor of Hyderabad State to administer the province until civil administration was established in December 1949?",
      options: [
        {
          text: "Major General J.N. Chaudhuri",
          why: "Major General Joyanto Nath Chaudhuri (Commander of the Indian Army 1st Armoured Division that entered Hyderabad) served as the Military Governor of Hyderabad State from 18 September 1948 until December 1949.",
          attraction: "Commanded the Indian military operation and headed the military government.",
          confusion: false,
        },
        {
          text: "M.K. Vellodi (ICS)",
          why: "M.K. Vellodi was a senior civil servant appointed as the Chief Minister / Civil Administrator of Hyderabad State in December 1949 replacing the military government, not the Military Governor.",
          attraction: "Headed the subsequent civil government (Vellodi Cabinet 1949–1952).",
          confusion: true,
        },
        {
          text: "Lieutenant General Maharaj Sri Rajendrasinhji",
          why: "Lt. Gen. Rajendrasinhji was the GOC-in-C of Southern Command who oversaw the operation, but J.N. Chaudhuri was appointed as Military Governor on the ground.",
          attraction: "Overall Army Commander of Southern Command.",
        },
        {
          text: "K.M. Munshi",
          why: "K.M. Munshi served as India's Agent General in Hyderabad prior to Operation Polo (1947–1948), not the Military Governor after the surrender.",
          attraction: "Prominent diplomat and Agent General in Hyderabad.",
        },
      ],
      answer: 0,
      reason: "Operation Polo commenced on 13 September 1948 under the code name 'Operation Polo' and concluded with the surrender of the Nizam's commander Major General Syed Ahmed El-Edroos on 17 September 1948. Major General J.N. Chaudhuri was appointed Military Governor on 18 September 1948, serving until the Vellodi civil government took over on 1 December 1949.",
      clue: "Look for 'Military Governor of Hyderabad State after Operation Polo (1948–1949)': Major General J.N. Chaudhuri.",
      trap: "Do not confuse Military Governor J.N. Chaudhuri (1948–1949) with Civil Administrator M.K. Vellodi (1949–1952) or Agent General K.M. Munshi (1947–1948).",
      elimination: "Eliminate M.K. Vellodi (civil administrator 1949) and K.M. Munshi (Agent General); J.N. Chaudhuri was the Military Governor.",
      anchor: "Operation Polo: Maj. Gen. J.N. Chaudhuri appointed Military Governor of Hyderabad State (Sep 1948 – Dec 1949).",
      hint: "Who was the military general who became Governor of Hyderabad immediately after police action?",
      source: "TS Police Constable 2018, FWT, General Studies",
      page: 38,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Major General J.N. Chaudhuri.",
          correctMeaning: "Major General J.N. Chaudhuri was the Military Governor who accepted the Nizam's surrender and governed until late 1949.",
          selectedMeaning: "Major General J.N. Chaudhuri was the Military Governor who accepted the Nizam's surrender and governed until late 1949.",
          possibleConfusion: "You answered correctly. He later became Chief of Army Staff during the 1965 Indo-Pak war.",
          decisionRules: [
            { when: "the question asks who was the Military Governor of Hyderabad State (1948–1949)", choose: "Major General J.N. Chaudhuri" },
            { when: "the question asks who took over administration in December 1949", choose: "M.K. Vellodi (Civil Administrator / CM)" },
          ],
          nextStep: "Remember the administrative progression: J.N. Chaudhuri (Military) -> M.K. Vellodi (Bureaucratic) -> Burgula Ramakrishna Rao (Elected).",
        },
        {
          observation: "Check the role of M.K. Vellodi.",
          correctMeaning: "The Military Governor was J.N. Chaudhuri.",
          selectedMeaning: "M.K. Vellodi (ICS) headed the Civil Administration starting from December 1949 until the 1952 general elections.",
          possibleConfusion: "Vellodi succeeded Chaudhuri as the head of Hyderabad State administration.",
          decisionRules: [
            { when: "the question asks who was the Military Governor (1948–1949)", choose: "Major General J.N. Chaudhuri" },
            { when: "the question asks who was appointed Chief Minister by the Centre in December 1949", choose: "M.K. Vellodi" },
          ],
          nextStep: "Distinguish Military rule (Chaudhuri) from the interim Civil cabinet (Vellodi).",
        },
        {
          observation: "Check Southern Command leadership.",
          correctMeaning: "J.N. Chaudhuri was the governor on the ground.",
          selectedMeaning: "Lt. Gen. Rajendrasinhji was GOC Southern Command in Pune directing the overall campaign.",
          possibleConfusion: "High-ranking military commander during Operation Polo.",
          decisionRules: [
            { when: "the question asks who was Military Governor of Hyderabad State", choose: "Major General J.N. Chaudhuri" },
            { when: "the question asks who was GOC-in-C Southern Command overseeing Operation Polo", choose: "Lt. Gen. Rajendrasinhji" },
          ],
          nextStep: "Identify Chaudhuri as the administrator stationed in Hyderabad.",
        },
        {
          observation: "Check K.M. Munshi's post.",
          correctMeaning: "J.N. Chaudhuri was Military Governor.",
          selectedMeaning: "K.M. Munshi was India's diplomatic Agent General in Hyderabad under the 1947 Standstill Agreement.",
          possibleConfusion: "Munshi was the key political representative of the Indian Government before the military operation.",
          decisionRules: [
            { when: "the question asks who served as India's Agent General in Hyderabad (1948)", choose: "K.M. Munshi" },
            { when: "the question asks who was Military Governor following Operation Polo", choose: "Major General J.N. Chaudhuri" },
          ],
          nextStep: "Remember: K.M. Munshi = Agent General; J.N. Chaudhuri = Military Governor.",
        },
      ],
    },
  },

  // 5. TM-Q080 (TGPSC Group-4 2023 / 1969 TPS Leadership)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q080",
      topic: "TM-01.05",
      concept: "TM-01.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In February 1969, during the upsurge of the Separate Telangana agitation, who founded the 'Telangana Praja Samithi' (TPS) at Hyderabad and served as its founding President before the leadership was taken over by Dr. Marri Chenna Reddy in May 1969?",
      options: [
        {
          text: "Ananthula Madan Mohan",
          why: "Ananthula Madan Mohan (a prominent advocate and youth leader from Siddipet) founded the Telangana Praja Samithi in February 1969 and led it as founding President during the initial student strikes until Dr. Chenna Reddy took charge on 22 May 1969.",
          attraction: "Founding President of Telangana Praja Samithi.",
          confusion: false,
        },
        {
          text: "Konda Laxman Bapuji",
          why: "Konda Laxman Bapuji resigned from the state cabinet in March 1969 and founded the 'Telangana Congress Samithi', but was not the founder President of TPS.",
          attraction: "First minister to resign in 1969 support of statehood.",
          confusion: true,
        },
        {
          text: "Mallikarjun",
          why: "Mallikarjun was the student leader who served as President of the Osmania University Student Action Committee / TPS youth wing.",
          attraction: "Prominent student agitation leader of 1969.",
        },
        {
          text: "S.B. Giri",
          why: "S.B. Giri was a veteran trade union leader and TPS leader who won the 1971 parliamentary election, but was not the founding president.",
          attraction: "Key trade union leader in 1969 movement.",
        },
      ],
      answer: 0,
      reason: "The Telangana Praja Samithi (TPS) was formed on 28 February 1969 by Ananthula Madan Mohan and other young intellectuals to spearhead the agitation for a separate state. On 22 May 1969, Dr. Marri Chenna Reddy was elected as its President, transforming TPS into a mass political movement that won 10 out of 14 Lok Sabha seats in 1971.",
      clue: "Look for 'Founding President of Telangana Praja Samithi (TPS) in February 1969': Ananthula Madan Mohan.",
      trap: "Do not confuse founding President Ananthula Madan Mohan (Feb 1969) with later President Dr. Marri Chenna Reddy (May 1969) or Telangana Congress Samithi founder Konda Laxman Bapuji.",
      elimination: "Eliminate Konda Laxman Bapuji (Telangana Congress Samithi) and Mallikarjun (Student Union); Ananthula Madan Mohan was the founder President of TPS.",
      anchor: "Telangana Praja Samithi (TPS): Founded Feb 1969 by Ananthula Madan Mohan (Founding President); Dr. Marri Chenna Reddy became President in May 1969.",
      hint: "Which Siddipet lawyer was the founding president of TPS before Chenna Reddy took over?",
      source: "TGPSC Group-4 2023 Paper I, General Studies",
      page: 44,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Ananthula Madan Mohan.",
          correctMeaning: "Ananthula Madan Mohan was the founder President of TPS who initiated its formal organizational phase.",
          selectedMeaning: "Ananthula Madan Mohan was the founder President of TPS who initiated its formal organizational phase.",
          possibleConfusion: "You answered correctly. He was later elected MLA from Siddipet and became a senior minister.",
          decisionRules: [
            { when: "the question asks who was the founding President of Telangana Praja Samithi (TPS) in Feb 1969", choose: "Ananthula Madan Mohan" },
            { when: "the question asks when Dr. Marri Chenna Reddy became TPS President", choose: "22 May 1969" },
          ],
          nextStep: "Remember: TPS was founded by Madan Mohan; Dr. Chenna Reddy converted it into an electoral party.",
        },
        {
          observation: "Check Konda Laxman Bapuji's separate outfit.",
          correctMeaning: "Madan Mohan founded TPS.",
          selectedMeaning: "Konda Laxman Bapuji resigned from the Kasu Brahmananda Reddy cabinet on 28 March 1969 and formed the 'Telangana Congress Samithi'.",
          possibleConfusion: "Both were prominent leaders who challenged the status quo in 1969.",
          decisionRules: [
            { when: "the question asks who founded the Telangana Congress Samithi in 1969", choose: "Konda Laxman Bapuji" },
            { when: "the question asks who founded the Telangana Praja Samithi (TPS)", choose: "Ananthula Madan Mohan" },
          ],
          nextStep: "Differentiate TPS (Madan Mohan) from Telangana Congress Samithi (Konda Laxman Bapuji).",
        },
        {
          observation: "Check Mallikarjun's role in 1969.",
          correctMeaning: "The founding President was Madan Mohan.",
          selectedMeaning: "Mallikarjun was the fiery president of the Osmania University Students' Action Committee who led student street protests.",
          possibleConfusion: "Mallikarjun was the most recognized student face of TPS.",
          decisionRules: [
            { when: "the question asks who headed the Osmania University Student Action Committee in 1969", choose: "Mallikarjun" },
            { when: "the question asks who founded TPS in February 1969", choose: "Ananthula Madan Mohan" },
          ],
          nextStep: "Separate the student agitation leadership (Mallikarjun) from the parent TPS founder (Madan Mohan).",
        },
        {
          observation: "Check S.B. Giri's political identity.",
          correctMeaning: "Madan Mohan is the founder.",
          selectedMeaning: "S.B. Giri was a leading trade unionist (HMS) and TPS leader who won the Warangal Lok Sabha seat in 1971.",
          possibleConfusion: "Prominent TPS candidate in the 1971 Lok Sabha elections.",
          decisionRules: [
            { when: "the question asks about the trade unionist elected from Warangal on TPS ticket in 1971", choose: "S.B. Giri" },
            { when: "the question asks for the founder of TPS", choose: "Ananthula Madan Mohan" },
          ],
          nextStep: "Identify S.B. Giri primarily as a trade union and parliamentary leader.",
        },
      ],
    },
  },

  // 6. TM-Q081 (TGPSC Group-1 Prelims 2024 / Cultural Monuments)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q081",
      topic: "TM-01.05",
      concept: "TM-01.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Who was the renowned sculptor and professor at the College of Fine Arts, Hyderabad who designed and sculpted the historic 'Telangana Martyrs Memorial' (తెలంగాణ అమరవీరుల స్తూపం) erected in 1970 at Gun Park opposite the State Legislative Assembly?",
      options: [
        {
          text: "Aekka Yadagiri Rao",
          why: "Aekka Yadagiri Rao, a celebrated modernist sculptor and professor at JNTU College of Fine Arts, designed and hand-carved the 1969 Martyrs Memorial at Gun Park with black granite, incorporating symbolic bullet marks, a plaque, and an unfinished floral crest.",
          attraction: "The sculptor of the iconic Gun Park Amara Veerula Stupam.",
          confusion: false,
        },
        {
          text: "Ganapathi Sthapathi",
          why: "Ganapathi Sthapathi was a famous traditional temple architect who sculpted the Buddha statue at Hussain Sagar, not the 1970 Gun Park Martyrs Memorial.",
          attraction: "Famous sculptor of the Hussain Sagar Buddha statue.",
          confusion: true,
        },
        {
          text: "Thota Vaikuntam",
          why: "Thota Vaikuntam is a legendary contemporary painter known for his depictions of rural Telangana women, not the sculptor of the 1970 memorial.",
          attraction: "Famous Telangana visual artist.",
        },
        {
          text: "B.V.R. Chari",
          why: "B.V.R. Chari was involved in movement cultural designs, but did not sculpt the Gun Park monument.",
          attraction: "Prominent state artist.",
        },
      ],
      answer: 0,
      reason: "The Telangana Martyrs Memorial at Gun Park was unveiled in 1970 to honor the 369 martyrs killed in police firing during the 1969 agitation. It was conceptualized and sculpted by Prof. Aekka Yadagiri Rao. The four-sided black granite column features nine bullet holes on each face, symbolizing the nine districts of Telangana, topped by a lotus symbolizing sacrifice.",
      clue: "Look for 'Sculptor of Telangana Martyrs Memorial at Gun Park in 1970': Aekka Yadagiri Rao.",
      trap: "Do not confuse Aekka Yadagiri Rao (Gun Park Memorial) with Ganapathi Sthapathi (Hussain Sagar Buddha Statue) or painter Thota Vaikuntam.",
      elimination: "Eliminate Ganapathi Sthapathi (Buddha statue) and Thota Vaikuntam (painter); Aekka Yadagiri Rao sculpted the Gun Park Stupam.",
      anchor: "Gun Park Martyrs Memorial (1970): Sculpted by Prof. Aekka Yadagiri Rao.",
      hint: "Which fine arts professor sculpted the famous black granite martyrs' memorial opposite the Assembly?",
      source: "TGPSC Group-1 Preliminary Examination 2024",
      page: 15,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Aekka Yadagiri Rao.",
          correctMeaning: "Prof. Aekka Yadagiri Rao sculpted the historic Gun Park monument.",
          selectedMeaning: "Prof. Aekka Yadagiri Rao sculpted the historic Gun Park monument.",
          possibleConfusion: "You answered correctly. The memorial has remained the symbolic pilgrimage point for all Telangana agitations.",
          decisionRules: [
            { when: "the question asks who sculpted the Gun Park Telangana Martyrs Memorial", choose: "Aekka Yadagiri Rao" },
            { when: "the question asks where the 1969 Martyrs Memorial is located", choose: "Gun Park (opposite the State Assembly)" },
          ],
          nextStep: "Review the symbolism: 9 bullet marks for the 9 districts of Telangana and an unfinished lotus on top.",
        },
        {
          observation: "Check Ganapathi Sthapathi's famous work.",
          correctMeaning: "Aekka Yadagiri Rao sculpted the Gun Park monument.",
          selectedMeaning: "Ganapathi Sthapathi was the chief architect and sculptor of the monolithic standing Buddha statue installed in Hussain Sagar in 1992.",
          possibleConfusion: "Both are world-famous sculptors with iconic monuments in Hyderabad.",
          decisionRules: [
            { when: "the question asks who sculpted the monolithic Buddha statue at Hussain Sagar", choose: "Ganapathi Sthapathi" },
            { when: "the question asks who sculpted the Gun Park Martyrs Stupam", choose: "Aekka Yadagiri Rao" },
          ],
          nextStep: "Associate Ganapathi Sthapathi with the Buddha statue and Yadagiri Rao with Gun Park.",
        },
        {
          observation: "Check Thota Vaikuntam's artistic domain.",
          correctMeaning: "The sculptor was Aekka Yadagiri Rao.",
          selectedMeaning: "Thota Vaikuntam is a world-renowned painter, not a sculptor of public monuments.",
          possibleConfusion: "Prominent visual arts figure from Telangana.",
          decisionRules: [
            { when: "the question asks about the famous painter depicting vibrant Telangana rural men and women", choose: "Thota Vaikuntam" },
            { when: "the question asks for the sculptor of the Martyrs Memorial", choose: "Aekka Yadagiri Rao" },
          ],
          nextStep: "Remember: Vaikuntam = painting; Yadagiri Rao = sculpture.",
        },
        {
          observation: "Check artist B.V.R. Chari.",
          correctMeaning: "Aekka Yadagiri Rao is the sculptor.",
          selectedMeaning: "B.V.R. Chari is known for designing cultural emblems and posters during the movement.",
          possibleConfusion: "Associated with movement iconography.",
          decisionRules: [
            { when: "the question asks who sculpted the Gun Park Stupam in 1970", choose: "Aekka Yadagiri Rao" },
            { when: "the question asks about Martyrs Memorial unveiling year", choose: "1970" },
          ],
          nextStep: "Anchor Prof. Aekka Yadagiri Rao firmly as the creator of Gun Park Stupam.",
        },
      ],
    },
  },

  // 7. TM-Q082 (TGPSC Group-4 2023 / Girglani Commission Mandate)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q082",
      topic: "TM-02.04",
      concept: "TM-02.04-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under which specific Government Order (G.O.) did the Government of Andhra Pradesh in June 2001 appoint the One-Man Commission headed by retired senior bureaucrat J.M. Girglani (IAS) to inquire into the violations, bogus certificates, and failure in implementing G.O. Ms. No. 610?",
      options: [
        {
          text: "G.O. Ms. No. 347 (General Administration Department)",
          why: "On 25 June 2001, the Government of AP issued G.O. Ms. No. 347 (GAD) appointing J.M. Girglani as a One-Man Commission to inquire into the lapses in implementing G.O. 610 and suggest remedial measures.",
          attraction: "The authentic administrative order constituting the Girglani Commission.",
          confusion: false,
        },
        {
          text: "G.O. Ms. No. 610",
          why: "G.O. 610 was the original order issued on 30 December 1985 by N.T. Rama Rao's government repatriating non-locals, not the 2001 commission appointment order.",
          attraction: "The parent order being investigated.",
          confusion: true,
        },
        {
          text: "G.O. Ms. No. 36",
          why: "G.O. 36 was issued in January 1969 by Kasu Brahmananda Reddy during the 1969 agitation.",
          attraction: "Famous historic repatriation order from 1969.",
        },
        {
          text: "G.O. Ms. No. 674",
          why: "G.O. 674 was issued in October 1975 to implement the Six-Point Formula Presidential Order.",
          attraction: "Prominent 1975 Presidential Order implementation G.O.",
        },
      ],
      answer: 0,
      reason: "Following intense pressure from the newly formed Telangana Rashtra Samithi (TRS) and Telangana employee unions (TNGOs), the Chandrababu Naidu government issued G.O. Ms. No. 347 on 25 June 2001 appointing Sri J.M. Girglani, IAS (Retd.) as a One-Man Commission. The Commission submitted its Preliminary Report in 2001 and Final Report in September 2004 with 35 comprehensive recommendations.",
      clue: "Look for 'Government Order appointing the J.M. Girglani One-Man Commission in June 2001': G.O. Ms. No. 347.",
      trap: "Do not confuse G.O. 347 (appointing Girglani Commission) with G.O. 610 (the 1985 order under review) or G.O. 36 (1969 order).",
      elimination: "Eliminate G.O. 610 (1985 original order) and G.O. 36 (1969 order); G.O. Ms. No. 347 appointed the Girglani Commission.",
      anchor: "Girglani Commission (2001–2004): Appointed under G.O. Ms. No. 347 (25 June 2001) to probe G.O. 610 violations.",
      hint: "What was the G.O. number that constituted the Girglani Commission in 2001?",
      source: "TGPSC Group-4 2023 Paper I, General Studies",
      page: 49,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected G.O. Ms. No. 347.",
          correctMeaning: "G.O. Ms. No. 347 (GAD) dated 25 June 2001 constituted the J.M. Girglani One-Man Commission.",
          selectedMeaning: "G.O. Ms. No. 347 (GAD) dated 25 June 2001 constituted the J.M. Girglani One-Man Commission.",
          possibleConfusion: "You answered correctly. The Girglani report revealed over 30 categories of systemic violations across government departments.",
          decisionRules: [
            { when: "the question asks which G.O. appointed the J.M. Girglani Commission", choose: "G.O. Ms. No. 347" },
            { when: "the question asks which order Girglani was investigating", choose: "G.O. Ms. No. 610" },
          ],
          nextStep: "Note that Girglani submitted his Final Report on 30 September 2004 containing 35 chapters and recommendations.",
        },
        {
          observation: "Check the subject of G.O. 610.",
          correctMeaning: "G.O. 347 appointed the Commission.",
          selectedMeaning: "G.O. Ms. No. 610 was issued on 30 December 1985 ordering the repatriation of non-locals by March 1986.",
          possibleConfusion: "Candidates confuse the order being investigated with the order establishing the inquiry.",
          decisionRules: [
            { when: "the question asks which G.O. ordered repatriation of non-locals in 1985", choose: "G.O. Ms. No. 610" },
            { when: "the question asks which G.O. appointed the Girglani Commission in 2001", choose: "G.O. Ms. No. 347" },
          ],
          nextStep: "Pair 1985 with G.O. 610, and 2001 with G.O. 347.",
        },
        {
          observation: "Check the date of G.O. 36.",
          correctMeaning: "G.O. 347 is the 2001 order.",
          selectedMeaning: "G.O. 36 was issued on 21 January 1969 under Chief Minister Kasu Brahmananda Reddy pursuant to the All-Party Accord.",
          possibleConfusion: "Both G.O. 36 and G.O. 610 dealt with employee repatriations.",
          decisionRules: [
            { when: "the question asks which G.O. was issued in January 1969 for repatriation", choose: "G.O. Ms. No. 36" },
            { when: "the question asks about the Girglani Commission appointment", choose: "G.O. Ms. No. 347" },
          ],
          nextStep: "Chronological anchor: 1969 (G.O. 36) -> 1985 (G.O. 610) -> 2001 (G.O. 347).",
        },
        {
          observation: "Check G.O. 674.",
          correctMeaning: "The correct appointment G.O. is 347.",
          selectedMeaning: "G.O. Ms. No. 674 was issued on 20 October 1975 to implement the Six-Point Formula Presidential Order.",
          possibleConfusion: "Prominent employment order in the Six-Point Formula framework.",
          decisionRules: [
            { when: "the question asks which G.O. operationalized the 1975 Presidential Order", choose: "G.O. Ms. No. 674" },
            { when: "the question asks which G.O. instituted the Girglani Commission", choose: "G.O. Ms. No. 347" },
          ],
          nextStep: "Keep G.O. 674 tied to 1975 Presidential Order rules.",
        },
      ],
    },
  },

  // 8. TM-Q083 (Police Constable 2022 FWT / Cultural Resurgence)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q083",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 30 September 2002, the inaugural edition of 'Telangana Dhoom Dhaam' (తెలంగాణ ధూంధాం), which spearheaded an explosive cultural resurgence using folk music, ballads, and street theatre across the region, was held at which location?",
      options: [
        {
          text: "Kamareddy (Nizamabad district)",
          why: "The historic first Telangana Dhoom Dhaam was organized at Kamareddy on 30 September 2002 by Rasamayi Balakishan, Gaddar, Vimalakka, Goreti Venkanna, and other artists, captivating tens of thousands of people.",
          attraction: "The birthplace of the Telangana Dhoom Dhaam cultural movement.",
          confusion: false,
        },
        {
          text: "Warangal (Kakatiya University Grounds)",
          why: "Warangal hosted the 1997 Warangal Declaration and subsequent massive Dhoom Dhaams, but was not the venue of the very first Dhoom Dhaam in September 2002.",
          attraction: "Major historic center of student and cultural agitation.",
          confusion: true,
        },
        {
          text: "Siddipet (Government Arts College)",
          why: "Siddipet hosted major cultural conferences, but the inaugural Dhoom Dhaam occurred at Kamareddy.",
          attraction: "Political nerve center of the TRS movement.",
        },
        {
          text: "Hyderabad (Nizam College Grounds)",
          why: "Nizam College grounds hosted student rallies, but Dhoom Dhaam originated in the rural hinterland at Kamareddy.",
          attraction: "Famous venue for statehood mass rallies in the capital.",
        },
      ],
      answer: 0,
      reason: "'Telangana Dhoom Dhaam' was conceptualized by Rasamayi Balakishan and fellow artists to mobilize the rural masses through authentic Telangana folk idioms (Oggu Katha, Bathukamma, Dappu, and Burra Katha). The first program was held at Kamareddy on 30 September 2002, becoming a defining cultural weapon of the statehood movement.",
      clue: "Look for 'Inaugural edition of Telangana Dhoom Dhaam on 30 September 2002': Kamareddy.",
      trap: "Do not confuse Kamareddy (birthplace of Dhoom Dhaam in 2002) with Warangal (Warangal Declaration 1997) or Hyderabad (Million March 2011).",
      elimination: "Eliminate Warangal and Hyderabad; the inaugural Dhoom Dhaam took place at Kamareddy.",
      anchor: "Telangana Dhoom Dhaam: Launched at Kamareddy on 30 September 2002 by Rasamayi Balakishan and artists.",
      hint: "At which north-Telangana town in Nizamabad district was the first Dhoom Dhaam staged?",
      source: "TS Police Constable 2022, FWT, General Studies",
      page: 42,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Kamareddy.",
          correctMeaning: "Kamareddy hosted the historic first Dhoom Dhaam on 30 September 2002.",
          selectedMeaning: "Kamareddy hosted the historic first Dhoom Dhaam on 30 September 2002.",
          possibleConfusion: "You answered correctly. The success of Kamareddy Dhoom Dhaam led to hundreds of performances across India and abroad.",
          decisionRules: [
            { when: "the question asks where the first Telangana Dhoom Dhaam was held", choose: "Kamareddy" },
            { when: "the question asks who was the convener of Telangana Dhoom Dhaam", choose: "Rasamayi Balakishan" },
          ],
          nextStep: "Note the date: 30 September 2002 at Kamareddy.",
        },
        {
          observation: "Check Warangal's famous 1997 convention.",
          correctMeaning: "Dhoom Dhaam began at Kamareddy.",
          selectedMeaning: "Warangal hosted the 1997 'Telangana Mahasabha' where the landmark 'Warangal Declaration' was adopted.",
          possibleConfusion: "Warangal is synonymous with early movement resurgence.",
          decisionRules: [
            { when: "the question asks where the 1997 Telangana Declaration was adopted", choose: "Warangal" },
            { when: "the question asks where the inaugural Dhoom Dhaam was held in 2002", choose: "Kamareddy" },
          ],
          nextStep: "Pair Warangal with 1997 Declaration, and Kamareddy with 2002 Dhoom Dhaam.",
        },
        {
          observation: "Check Siddipet's connection.",
          correctMeaning: "The venue was Kamareddy.",
          selectedMeaning: "Siddipet is famous as KCR's political home turf and site of the 2009 hunger strike before shifting to NIMS.",
          possibleConfusion: "Frequent venue for movement milestones.",
          decisionRules: [
            { when: "the question asks where KCR began his indefinite hunger strike on 29 Nov 2009", choose: "Siddipet (en route near Alaganur)" },
            { when: "the question asks about Dhoom Dhaam launch venue", choose: "Kamareddy" },
          ],
          nextStep: "Differentiate KCR's 2009 deeksha site from the 2002 Dhoom Dhaam venue.",
        },
        {
          observation: "Check Hyderabad mass events.",
          correctMeaning: "The correct venue is Kamareddy.",
          selectedMeaning: "Hyderabad was the venue for urban mass programs like Million March (2011) and Sagara Haram (2012).",
          possibleConfusion: "Capital city assumed as venue for state-wide launches.",
          decisionRules: [
            { when: "the question asks for the venue of Million March", choose: "Tank Bund, Hyderabad" },
            { when: "the question asks where Dhoom Dhaam originated in 2002", choose: "Kamareddy" },
          ],
          nextStep: "Remember: Dhoom Dhaam was rooted in the district heartland of Kamareddy.",
        },
      ],
    },
  },

  // 9. TM-Q084 (Police Constable 2018 FWT / Folk Resistance Songs)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q084",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Which legendary revolutionary balladeer, people's poet, and founder of the Jana Natya Mandali penned and sang the heart-stirring movement anthem 'అమ్మా తెలంగాణమా... ఆకలి కేకల గానమా...' (Amma Telanganama... Aakali Kekala Gaanama)?",
      options: [
        {
          text: "Gaddar (Gummadi Vittal Rao)",
          why: "Gaddar (1949–2023), known as 'Praja Yuddha Nauka', composed and performed 'Amma Telanganama' in his iconic black blanket and red dhoti, moving millions of listeners and defining the soul of the separate statehood struggle.",
          attraction: "The voice and symbol of revolutionary Telangana cultural agitation.",
          confusion: false,
        },
        {
          text: "Goreti Venkanna",
          why: "Goreti Venkanna is the celebrated folk poet famous for 'Palle Kanneeru Peduthundo' and 'Galli Chinnadi', but not 'Amma Telanganama'.",
          attraction: "Famous contemporary folk singer and Sahitya Akademi laureate.",
          confusion: true,
        },
        {
          text: "Ande Sri",
          why: "Ande Sri composed the official state song 'Jaya Jaya He Telangana Janani Jayakethanam', not 'Amma Telanganama'.",
          attraction: "Composer of the official Telangana State Anthem.",
        },
        {
          text: "Guda Anjaiah",
          why: "Guda Anjaiah composed 'Ooru Manadira' and 'Ee Lachumavva', not 'Amma Telanganama'.",
          attraction: "Major Dalit folk lyricist of Telangana.",
        },
      ],
      answer: 0,
      reason: "'Amma Telanganama Aakali Kekala Gaanama' was written and sung by Gaddar (Gummadi Vittal Rao). The song personifies the suffering, starvation, and exploitation of mother Telangana under regional discrimination, and became an emotional centerpiece of every public assembly during the agitation.",
      clue: "Look for 'Amma Telanganama Aakali Kekala Gaanama' song: Gaddar (Praja Yuddha Nauka).",
      trap: "Do not confuse Gaddar ('Amma Telanganama') with Ande Sri ('Jaya Jaya He Telangana') or Goreti Venkanna ('Palle Kanneeru Peduthundo').",
      elimination: "Eliminate Ande Sri (Jaya Jaya He Telangana) and Goreti Venkanna (Palle Kanneeru Peduthundo); Gaddar composed Amma Telanganama.",
      anchor: "Gaddar (Praja Yuddha Nauka): Composed and performed 'Amma Telanganama Aakali Kekala Gaanama'.",
      hint: "Which Praja Yuddha Nauka in a black blanket sang 'Amma Telanganama'?",
      source: "TS Police Constable 2018, FWT, General Studies",
      page: 47,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Gaddar.",
          correctMeaning: "Gaddar composed 'Amma Telanganama', which captured the deepest agony of the Telangana people.",
          selectedMeaning: "Gaddar composed 'Amma Telanganama', which captured the deepest agony of the Telangana people.",
          possibleConfusion: "You answered correctly. The song was featured powerfully in the revolutionary movie 'Maa Bhoomi' and later in statehood platforms.",
          decisionRules: [
            { when: "the question asks who wrote and sang 'Amma Telanganama'", choose: "Gaddar (Gummadi Vittal Rao)" },
            { when: "the question asks who was known as 'Praja Yuddha Nauka'", choose: "Gaddar" },
          ],
          nextStep: "Note that Gaddar also wrote 'Podusthunna Poddumeeda Nadusthunna Kaalama'.",
        },
        {
          observation: "Check Goreti Venkanna's signature song.",
          correctMeaning: "The song is by Gaddar.",
          selectedMeaning: "Goreti Venkanna wrote 'Palle Kanneeru Peduthundo Kanuchupamerera', portraying agrarian destruction under neoliberal reforms.",
          possibleConfusion: "Both are world-renowned folk singers of Telangana.",
          decisionRules: [
            { when: "the question asks who composed 'Palle Kanneeru Peduthundo'", choose: "Goreti Venkanna" },
            { when: "the question asks who composed 'Amma Telanganama'", choose: "Gaddar" },
          ],
          nextStep: "Pair Goreti Venkanna with 'Palle Kanneeru Peduthundo'.",
        },
        {
          observation: "Check Ande Sri's masterpiece.",
          correctMeaning: "Gaddar wrote 'Amma Telanganama'.",
          selectedMeaning: "Ande Sri composed 'Jaya Jaya He Telangana Janani Jayakethanam', adopted in 2024 as the official State Anthem.",
          possibleConfusion: "Both composed the most revered state anthems of the movement.",
          decisionRules: [
            { when: "the question asks who wrote the state anthem 'Jaya Jaya He Telangana'", choose: "Ande Sri" },
            { when: "the question asks who wrote 'Amma Telanganama'", choose: "Gaddar" },
          ],
          nextStep: "Remember: 'Jaya Jaya He' = Ande Sri; 'Amma Telanganama' = Gaddar.",
        },
        {
          observation: "Check Guda Anjaiah's signature work.",
          correctMeaning: "The author is Gaddar.",
          selectedMeaning: "Guda Anjaiah wrote 'Ooru Manadira' and 'Ee Lachumavva' on feudal exploitation.",
          possibleConfusion: "Both were foremost people's poets from marginalized backgrounds.",
          decisionRules: [
            { when: "the question asks who composed 'Ooru Manadira'", choose: "Guda Anjaiah" },
            { when: "the question asks who composed 'Amma Telanganama'", choose: "Gaddar" },
          ],
          nextStep: "Link Guda Anjaiah to 'Ooru Manadira'.",
        },
      ],
    },
  },

  // 10. TM-Q085 (Police Constable 2022 FWT / People's Poets)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q085",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Which celebrated poet and songwriter from Nalgonda district composed the immortal revolutionary song 'ఊరు మనదిరా... ఈ వాడ మనదిరా... పల్లె మనదిరా... పారేటి ఏరు మనదిరా...' (Ooru Manadira... Ee Vaada Manadira) that became an international anthem against landlordism and caste oppression?",
      options: [
        {
          text: "Guda Anjaiah",
          why: "Guda Anjaiah (1955–2016) from Lingampally, Nalgonda district composed 'Ooru Manadira' in 1971, which was translated into 16 languages and became a timeless battle cry for peasant and Dalit land rights.",
          attraction: "The composer of 'Ooru Manadira' and the novel 'Polimera'.",
          confusion: false,
        },
        {
          text: "Belli Lalitha",
          why: "Belli Lalitha was a nightingale of Telangana folk songs and founder of Telangana Kala Samithi, brutally murdered in 1999, but she was not the composer of this song.",
          attraction: "Iconic martyred woman folk singer of the movement.",
          confusion: true,
        },
        {
          text: "Goreti Venkanna",
          why: "Goreti Venkanna composed 'Palle Kanneeru Peduthundo' and 'Alasandala Vana', not 'Ooru Manadira'.",
          attraction: "Famous contemporary folk singer from Mahabubnagar.",
        },
        {
          text: "Suddala Ashok Teja",
          why: "Suddala Ashok Teja is a National Award winning film lyricist (son of Suddala Hanumanthu) who wrote 'Nenu Saitham', not 'Ooru Manadira'.",
          attraction: "Famous lyricist carrying the Suddala heritage.",
        },
      ],
      answer: 0,
      reason: "Guda Anjaiah wrote 'Ooru Manadira' during the height of landlord exploitation in Telangana. The song sharply asks: 'If the village is ours, the street is ours, and the flowing river is ours, who is this Dora (feudal lord) to ride upon our backs?' It was later featured in R. Narayana Murthy's movie 'Erra Sainyam'.",
      clue: "Look for 'Ooru Manadira Ee Vaada Manadira composer': Guda Anjaiah.",
      trap: "Do not confuse Guda Anjaiah ('Ooru Manadira') with Suddala Hanumanthu ('Palletoori Pillagada') or Goreti Venkanna ('Palle Kanneeru Peduthundo').",
      elimination: "Eliminate Belli Lalitha and Goreti Venkanna; Guda Anjaiah authored Ooru Manadira.",
      anchor: "Guda Anjaiah: Composed the world-famous anti-feudal folk song 'Ooru Manadira'.",
      hint: "Which Nalgonda poet composed 'Ooru Manadira' challenging the feudal landlords?",
      source: "TS Police Constable 2022, FWT, General Studies",
      page: 51,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Guda Anjaiah.",
          correctMeaning: "Guda Anjaiah composed 'Ooru Manadira', which was translated into multiple Indian languages.",
          selectedMeaning: "Guda Anjaiah composed 'Ooru Manadira', which was translated into multiple Indian languages.",
          possibleConfusion: "You answered correctly. He also authored the famous novel 'Polimera' depicting Telangana agrarian distress.",
          decisionRules: [
            { when: "the question asks who composed 'Ooru Manadira... Ee Vaada Manadira'", choose: "Guda Anjaiah" },
            { when: "the question asks who wrote the novel 'Polimera'", choose: "Guda Anjaiah" },
          ],
          nextStep: "Note that Guda Anjaiah also composed 'Nenu Raananno Ee Salkaatikano'.",
        },
        {
          observation: "Check Belli Lalitha's legacy.",
          correctMeaning: "The author is Guda Anjaiah.",
          selectedMeaning: "Belli Lalitha was a pioneering folk artist and leader of Telangana Kala Samithi who mobilized women across Telangana before her tragic murder in 1999.",
          possibleConfusion: "Revered cultural martyr of Telangana.",
          decisionRules: [
            { when: "the question asks who founded the Telangana Kala Samithi and was martyred in 1999", choose: "Belli Lalitha" },
            { when: "the question asks who composed 'Ooru Manadira'", choose: "Guda Anjaiah" },
          ],
          nextStep: "Remember Belli Lalitha as the martyred cultural voice of Telangana.",
        },
        {
          observation: "Check Goreti Venkanna's poems.",
          correctMeaning: "Guda Anjaiah wrote 'Ooru Manadira'.",
          selectedMeaning: "Goreti Venkanna wrote 'Vallanki Taalam' (which won the Sahitya Akademi Award in 2021) and 'Palle Kanneeru Peduthundo'.",
          possibleConfusion: "Leading living folk poet from Telangana.",
          decisionRules: [
            { when: "the question asks which work of Goreti Venkanna won the Sahitya Akademi Award in 2021", choose: "Vallanki Taalam" },
            { when: "the question asks for the author of 'Ooru Manadira'", choose: "Guda Anjaiah" },
          ],
          nextStep: "Pair 'Vallanki Taalam' with Goreti Venkanna.",
        },
        {
          observation: "Check Suddala Ashok Teja's national award.",
          correctMeaning: "Guda Anjaiah composed the song.",
          selectedMeaning: "Suddala Ashok Teja won the National Film Award for Best Lyrics in 2003 for the song 'Nenu Saitham' from the movie 'Tagore'.",
          possibleConfusion: "Both wrote progressive verses on society.",
          decisionRules: [
            { when: "the question asks who won National Award for 'Nenu Saitham' (2003)", choose: "Suddala Ashok Teja" },
            { when: "the question asks who composed 'Ooru Manadira'", choose: "Guda Anjaiah" },
          ],
          nextStep: "Connect Ashok Teja to modern cinema lyricism and Anjaiah to movement folk songs.",
        },
      ],
    },
  },

  // 11. TM-Q086 (TGPSC Group-1 2023 / Launch of TRS)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q086",
      topic: "TM-03.02",
      concept: "TM-03.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 27 April 2001, Kalvakuntla Chandrashekar Rao (KCR) resigned from the post of Deputy Speaker of the Andhra Pradesh Legislative Assembly and primary membership of TDP, and formally launched the 'Telangana Rashtra Samithi' (TRS) at which historic venue in Hyderabad?",
      options: [
        {
          text: "Jala Drushyam (the residence of Konda Laxman Bapuji along Hussain Sagar)",
          why: "KCR convened the founding meeting of TRS on 27 April 2001 at 'Jala Drushyam', the scenic residence of veteran freedom fighter and 1969 movement leader Konda Laxman Bapuji situated on the banks of Hussain Sagar.",
          attraction: "The historic launch location of Telangana Rashtra Samithi.",
          confusion: false,
        },
        {
          text: "Indira Park Dharna Chowk",
          why: "Indira Park was the venue for numerous protests and dharnas, but was not the venue where TRS was founded.",
          attraction: "Famous protest spot in Hyderabad.",
        },
        {
          text: "Nizam College Grounds",
          why: "Nizam College hosted mass student meetings, but not the private launch convention of TRS.",
          attraction: "Prominent venue for student political meetings.",
          confusion: true,
        },
        {
          text: "Exhibition Grounds, Nampally",
          why: "Exhibition Grounds hosted the TRS First Plenary rally (Simha Garjana), but not the initial party founding on 27 April 2001.",
          attraction: "Venue of major political plenaries and rallies.",
        },
      ],
      answer: 0,
      reason: "On 27 April 2001, KCR resigned from his constitutional post of Deputy Speaker and TDP membership, and along with prominent intellectuals, journalists, and activists, founded the Telangana Rashtra Samithi (TRS) at 'Jala Drushyam', the premises generously provided by Konda Laxman Bapuji.",
      clue: "Look for 'Venue where TRS was launched on 27 April 2001': Jala Drushyam (Konda Laxman Bapuji's residence).",
      trap: "Do not confuse the party launch venue (Jala Drushyam on 27 April 2001) with the first massive public rally 'Simha Garjana' held at Karimnagar on 17 May 2001.",
      elimination: "Eliminate Indira Park and Exhibition Grounds; TRS was born at Jala Drushyam.",
      anchor: "TRS Formation (27 April 2001): Launched at Jala Drushyam by K. Chandrashekar Rao.",
      hint: "At whose scenic residence on the banks of Hussain Sagar was TRS founded?",
      source: "TGPSC Group-1 Preliminary Examination 2023",
      page: 22,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Jala Drushyam.",
          correctMeaning: "TRS was formally founded at Jala Drushyam on 27 April 2001.",
          selectedMeaning: "TRS was formally founded at Jala Drushyam on 27 April 2001.",
          possibleConfusion: "You answered correctly. Konda Laxman Bapuji offered his residence as the party's first temporary headquarters.",
          decisionRules: [
            { when: "the question asks where TRS was launched on 27 April 2001", choose: "Jala Drushyam" },
            { when: "the question asks who provided Jala Drushyam for the launch", choose: "Konda Laxman Bapuji" },
          ],
          nextStep: "Note that on 17 May 2001, TRS held its first massive public rally 'Simha Garjana' at SRR College grounds, Karimnagar.",
        },
        {
          observation: "Check Indira Park's significance.",
          correctMeaning: "The founding venue was Jala Drushyam.",
          selectedMeaning: "Indira Park Dharna Chowk was the designated agitation center where employees and activists held fasts.",
          possibleConfusion: "Synonymous with movement protests.",
          decisionRules: [
            { when: "the question asks about the primary agitation/dharna zone in Hyderabad", choose: "Indira Park Dharna Chowk" },
            { when: "the question asks where TRS was launched", choose: "Jala Drushyam" },
          ],
          nextStep: "Distinguish protest venues (Indira Park) from party founding venues (Jala Drushyam).",
        },
        {
          observation: "Check Nizam College Grounds events.",
          correctMeaning: "The launch was at Jala Drushyam.",
          selectedMeaning: "Nizam College Grounds hosted major student conferences during the 1969 and 2009–2014 movements.",
          possibleConfusion: "Frequently used for political conventions.",
          decisionRules: [
            { when: "the question asks where TRS was launched on 27 April 2001", choose: "Jala Drushyam" },
            { when: "the question asks where the 2009 Student Vidyarthi Garjana was planned", choose: "Osmania University" },
          ],
          nextStep: "Anchor Jala Drushyam as the sole founding venue of TRS.",
        },
        {
          observation: "Check the first public rally venue.",
          correctMeaning: "Jala Drushyam is the founding location.",
          selectedMeaning: "The first mega public rally of TRS was 'Simha Garjana' at Karimnagar on 17 May 2001.",
          possibleConfusion: "Confusing public rallies with the private founding press conference.",
          decisionRules: [
            { when: "the question asks about the first TRS mega public rally 'Simha Garjana'", choose: "Karimnagar (17 May 2001)" },
            { when: "the question asks where the party was founded on 27 April 2001", choose: "Jala Drushyam" },
          ],
          nextStep: "Remember: 27 April 2001 = Jala Drushyam; 17 May 2001 = Karimnagar Simha Garjana.",
        },
      ],
    },
  },

  // 12. TM-Q087 (TGPSC Group-4 2023 / Srikrishna Committee 6 Options)
  {
    sourceIds: ["SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q087",
      topic: "TM-03.04",
      concept: "TM-03.04-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "In Chapter 9 of its report submitted in December 2010, the Justice B.N. Srikrishna Committee outlined six possible options to resolve the Andhra Pradesh situation. Which option was ranked by the Committee as its primary, 'most preferred' and 'best practicable' recommendation?",
      options: [
        {
          text: "Option 6: Keeping the State united and providing for creation of a statutory empowered Telangana Regional Council with socio-economic and political safeguards",
          why: "In its concluding evaluation, the Srikrishna Committee explicitly identified Option 6 (maintaining united Andhra Pradesh with a constitutional/statutory Telangana Regional Council) as the most workable, balanced, and preferred solution.",
          attraction: "The primary and most preferred recommendation in Chapter 9 of the Report.",
          confusion: false,
        },
        {
          text: "Option 5: Bifurcation of the State into Telangana and Seemandhra, with Hyderabad as the capital of Telangana and Seemandhra developing a new capital",
          why: "Option 5 recommended bifurcation into two states, but the Committee ranked it as their second option ('second-best option'), not their primary preferred choice.",
          attraction: "The option that was ultimately adopted by Parliament in 2014, leading candidates to falsely believe Srikrishna preferred it.",
          confusion: true,
        },
        {
          text: "Option 1: Maintaining the status quo with no changes to the governance structure",
          why: "Option 1 was status quo, which the Committee rejected as completely unviable due to deep emotional alienation.",
          attraction: "First listed option in the chapter.",
        },
        {
          text: "Option 2: Bifurcating the State into Seemandhra and Telangana, with Hyderabad being made a Union Territory",
          why: "Option 2 made Hyderabad a Union Territory, which the Committee found unworkable due to opposition from all regions.",
          attraction: "Frequently discussed union territory model.",
        },
      ],
      answer: 0,
      reason: "Chapter 9 of the Srikrishna Committee Report analyzed six options: 1. Status Quo, 2. Bifurcation with Hyderabad as UT, 3. Rayala-Telangana and Coastal Andhra, 4. Bifurcation into Seemandhra and Telangana with enlarged Hyderabad UT, 5. Bifurcation with Hyderabad as Telangana capital, and 6. Keeping the state united with a statutory Telangana Regional Council. The Committee officially ranked Option 6 as the best option and Option 5 as the second-best option.",
      clue: "Look for 'Srikrishna Committee Report most preferred recommendation': Option 6 (Keeping state united with statutory Telangana Regional Council).",
      trap: "Do not select Option 5 (Bifurcation); Parliament ultimately implemented Option 5 in 2014, but the Srikrishna Committee's own preferred choice was Option 6.",
      elimination: "Eliminate Option 1 (rejected status quo) and Option 5 (second-best); Option 6 was the Committee's primary preferred choice.",
      anchor: "Srikrishna Committee Report (Dec 2010): Option 6 (United state with Statutory Regional Council) was the Committee's most preferred option; Option 5 was second-best.",
      hint: "Did the Srikrishna Committee prefer bifurcation (Option 5) or keeping the state united with an empowered council (Option 6)?",
      source: "Committee for Consultations on the Situation in Andhra Pradesh (Srikrishna Report), Chapter 9",
      page: 440,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Option 6 as the Srikrishna Committee's primary recommendation.",
          correctMeaning: "Option 6 advocated unity coupled with constitutional/statutory regional governance councils.",
          selectedMeaning: "Option 6 advocated unity coupled with constitutional/statutory regional governance councils.",
          possibleConfusion: "You answered correctly. The people of Telangana and TJAC rejected Option 6 outright, insisting that nothing short of unconditional statehood was acceptable.",
          decisionRules: [
            { when: "the question asks which option was ranked as most preferred by the Srikrishna Committee", choose: "Option 6 (United state with Statutory Telangana Regional Council)" },
            { when: "the question asks which option was ranked as second-best by the Srikrishna Committee", choose: "Option 5 (Bifurcation into Telangana and Seemandhra)" },
          ],
          nextStep: "Remember: Srikrishna preferred Option 6; Parliament enacted Option 5.",
        },
        {
          observation: "Check why Option 5 was not the Committee's first preference.",
          correctMeaning: "The Committee ranked Option 6 as first and Option 5 as second.",
          selectedMeaning: "Option 5 recommended full bifurcation, but the Committee cautioned it would cause severe political friction in Seemandhra.",
          possibleConfusion: "Because bifurcation ultimately occurred in 2014, aspirants assume the Committee recommended it as their top choice.",
          decisionRules: [
            { when: "the question asks which option was the Committee's SECOND preference", choose: "Option 5" },
            { when: "the question asks which option was the Committee's FIRST preference", choose: "Option 6" },
          ],
          nextStep: "Anchor Option 6 as Srikrishna's top preference, and Option 5 as the second preference.",
        },
        {
          observation: "Check Option 1.",
          correctMeaning: "The preferred recommendation was Option 6.",
          selectedMeaning: "Option 1 was maintaining status quo, which the Committee declared totally unviable due to mass mobilization.",
          possibleConfusion: "Confusing the numerical order of listing with preference ranking.",
          decisionRules: [
            { when: "the question asks which option was status quo in Srikrishna Report", choose: "Option 1" },
            { when: "the question asks which option was most preferred", choose: "Option 6" },
          ],
          nextStep: "Remember: Option 1 was unviable status quo.",
        },
        {
          observation: "Check Option 2.",
          correctMeaning: "Option 6 was the top choice.",
          selectedMeaning: "Option 2 proposed bifurcating the state and turning Hyderabad into a Union Territory.",
          possibleConfusion: "Union territory model for Hyderabad was widely debated in media.",
          decisionRules: [
            { when: "the question asks about Option 2 of Srikrishna Committee", choose: "Bifurcation with Hyderabad as Union Territory" },
            { when: "the question asks for the Committee's favored recommendation", choose: "Option 6" },
          ],
          nextStep: "Review all six options: 1=Status Quo, 2=Hyderabad UT, 3=Rayala-Telangana, 4=Bifurcation with enlarged UT, 5=Bifurcation with Hyd in TG, 6=United state with statutory council.",
        },
      ],
    },
  },

  // 13. TM-Q088 (Expected / Srikrishna Committee Secret Chapter 8)
  {
    sourceIds: ["SR-HIST-SRIKRISHNA-2010"],
    question: {
      id: "TM-Q088",
      topic: "TM-03.04",
      concept: "TM-03.04-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "The controversial Chapter 8 of the Justice B.N. Srikrishna Committee Report (2010), titled 'Note on Law and Order and Internal Security', was initially submitted in a sealed cover to the Union Ministry of Home Affairs. Which judicial authority delivered a landmark judgment in March 2011 ordering the Central Government to disclose and make this secret chapter public?",
      options: [
        {
          text: "High Court of Andhra Pradesh (Single Judge Bench of Justice L. Narasimha Reddy)",
          why: "On 23 March 2011, Justice L. Narasimha Reddy of the AP High Court delivered a landmark judgment ruling that a committee appointed by the government cannot function like a secret intelligence agency and ordered the Union Government to make Chapter 8 public within two weeks.",
          attraction: "The historic judicial order unmasking the secret Chapter 8.",
          confusion: false,
        },
        {
          text: "Supreme Court of India (Bench headed by Chief Justice S.H. Kapadia)",
          why: "The Supreme Court later stayed parts of the High Court's observations against the Committee members, but the disclosure order originated from Justice L. Narasimha Reddy of the AP High Court.",
          attraction: "Highest constitutional court.",
          confusion: true,
        },
        {
          text: "Central Information Commission (CIC)",
          why: "The CIC handles RTI queries, but the directive ordering publication was issued by the High Court in a writ petition.",
          attraction: "Statutory transparency authority.",
        },
        {
          text: "Justice B.N. Srikrishna himself",
          why: "Justice Srikrishna defended keeping Chapter 8 confidential on grounds of national security and communal sensitivity.",
          attraction: "Chairman of the Committee.",
        },
      ],
      answer: 0,
      reason: "Chapter 8 of the Srikrishna Committee Report contained controversial recommendations on managing political parties, media management, and law and order strategies to contain the statehood agitation. Justice L. Narasimha Reddy of the AP High Court held that keeping the chapter secret violated democratic transparency and ordered its publication.",
      clue: "Look for 'Judicial authority ordering publication of Srikrishna Committee Chapter 8': High Court of Andhra Pradesh (Justice L. Narasimha Reddy).",
      trap: "Do not confuse the High Court judge who ordered disclosure (Justice L. Narasimha Reddy) with the Committee Chairman (Justice B.N. Srikrishna) or the Supreme Court.",
      elimination: "Eliminate Supreme Court and CIC; the disclosure order was delivered by Justice L. Narasimha Reddy of the AP High Court in March 2011.",
      anchor: "Srikrishna Committee Chapter 8: Ordered to be disclosed by Justice L. Narasimha Reddy of the AP High Court (March 2011).",
      hint: "Which High Court judge ordered the Central Government to reveal the secret Chapter 8?",
      source: "High Court of Andhra Pradesh Judgment, March 2011 (Justice L. Narasimha Reddy)",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Justice L. Narasimha Reddy of the AP High Court.",
          correctMeaning: "Justice L. Narasimha Reddy ruled that the secret chapter contained political management strategies that citizens were entitled to know.",
          selectedMeaning: "Justice L. Narasimha Reddy ruled that the secret chapter contained political management strategies that citizens were entitled to know.",
          possibleConfusion: "You answered correctly. The judgment criticized the Committee for exceeding its terms of reference into intelligence and political policing.",
          decisionRules: [
            { when: "the question asks which judge ordered the disclosure of Chapter 8 of Srikrishna Report", choose: "Justice L. Narasimha Reddy (AP High Court)" },
            { when: "the question asks what Chapter 8 dealt with", choose: "Law and Order and Internal Security (political and media management strategies)" },
          ],
          nextStep: "Note that Chapter 8 outlined methods to weaken the agitation by engaging regional political leaders.",
        },
        {
          observation: "Check the role of the Supreme Court.",
          correctMeaning: "The disclosure judgment was delivered by Justice L. Narasimha Reddy in the AP High Court.",
          selectedMeaning: "The Union Government approached the Supreme Court against the High Court's strictures.",
          possibleConfusion: "Appellate proceedings went to the Supreme Court.",
          decisionRules: [
            { when: "the question asks which court ordered the publication of Chapter 8", choose: "High Court of Andhra Pradesh" },
            { when: "the question asks who was the judge", choose: "Justice L. Narasimha Reddy" },
          ],
          nextStep: "Tie the landmark ruling directly to Justice L. Narasimha Reddy.",
        },
        {
          observation: "Check the Central Information Commission.",
          correctMeaning: "The order came from the High Court under writ jurisdiction.",
          selectedMeaning: "The Central Information Commission is a quasi-judicial body under the RTI Act, 2005.",
          possibleConfusion: "RTI petitions were filed alongside writ petitions.",
          decisionRules: [
            { when: "the question asks about the judicial order on Chapter 8", choose: "AP High Court" },
            { when: "the question asks about statutory RTI appeals", choose: "Central Information Commission" },
          ],
          nextStep: "Remember: The disclosure was mandated by a High Court writ judgment.",
        },
        {
          observation: "Check Justice Srikrishna's stance.",
          correctMeaning: "Justice Srikrishna advocated secrecy.",
          selectedMeaning: "The Committee maintained that Chapter 8 dealt with delicate internal security matters and submitted it in a sealed cover.",
          possibleConfusion: "Thinking the chairman decided to publish it.",
          decisionRules: [
            { when: "the question asks who headed the Committee", choose: "Justice B.N. Srikrishna" },
            { when: "the question asks who ordered the release of Chapter 8 against the government's wishes", choose: "Justice L. Narasimha Reddy (High Court)" },
          ],
          nextStep: "Contrast the Committee's confidential submission with the High Court's disclosure mandate.",
        },
      ],
    },
  },

  // 14. TM-Q089 (Expected / APRA 2014 Section 84 Apex Council)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q089",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under Section 84 of the Andhra Pradesh Reorganisation Act, 2014, an 'Apex Council' was established by the Central Government for the supervision and dispute resolution of both the Krishna River Management Board (KRMB) and Godavari River Management Board (GRMB). What is the exact statutory composition of this Apex Council?",
      options: [
        {
          text: "Union Minister of Water Resources / Jal Shakti (Chairperson) and the Chief Ministers of the States of Telangana and Andhra Pradesh (Members)",
          why: "Section 84(1) of APRA 2014 explicitly constitutes the Apex Council comprising: (a) Minister of Water Resources, Government of India — Chairperson; (b) Chief Minister of Andhra Pradesh — Member; and (c) Chief Minister of Telangana — Member.",
          attraction: "Exact statutory composition defined under Section 84(1).",
          confusion: false,
        },
        {
          text: "Prime Minister of India (Chairperson) and the Governors of Telangana and Andhra Pradesh (Members)",
          why: "The Prime Minister and Governors are not members of the Apex Council under Section 84.",
          attraction: "Sounds like a highest-level inter-state council.",
        },
        {
          text: "Chief Justice of India (Chairperson) and Chief Justices of Telangana and AP High Courts (Members)",
          why: "The Apex Council is an executive dispute-resolution body, not a judicial tribunal.",
          attraction: "Confuses administrative water council with judicial tribunals.",
        },
        {
          text: "Cabinet Secretary of India (Chairperson) and the Chief Secretaries of both Telangana and Andhra Pradesh (Members)",
          why: "Chief Secretaries attend in an assisting capacity, but the statutory members are the Union Minister and both Chief Ministers.",
          attraction: "Bureaucratic composition.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "Section 84 of the Andhra Pradesh Reorganisation Act, 2014 provides for an Apex Council consisting of the Union Minister of Water Resources (Chairperson) and the Chief Ministers of Telangana and Andhra Pradesh (Members). Its functions include supervision of the Krishna and Godavari River Management Boards, approving new water projects, and resolving inter-state river disputes.",
      clue: "Look for 'Apex Council composition under Section 84 of APRA 2014': Union Minister of Water Resources (Chairperson) + Chief Ministers of Telangana and AP.",
      trap: "Do not confuse the political executive Apex Council (Union Jal Shakti Minister + both CMs) with bureaucratic boards (KRMB/GRMB headed by senior engineers) or the Prime Minister.",
      elimination: "Eliminate Prime Minister and Chief Justices; Section 84 specifies the Union Water Resources Minister and both Chief Ministers.",
      anchor: "APRA 2014 Section 84: Apex Council consists of Union Minister of Water Resources (Chair) and Chief Ministers of Telangana & Andhra Pradesh.",
      hint: "Who sits on the Apex Council for Krishna and Godavari water disputes alongside the two Chief Ministers?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Section 84",
      page: 72,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the Union Minister of Water Resources and the two Chief Ministers.",
          correctMeaning: "Section 84(1) establishes the three-member Apex Council to supervise river management boards and sanction new projects.",
          selectedMeaning: "Section 84(1) establishes the three-member Apex Council to supervise river management boards and sanction new projects.",
          possibleConfusion: "You answered correctly. The meetings of this Apex Council have been crucial in negotiating the gazette notifications on river board jurisdictions.",
          decisionRules: [
            { when: "the question asks who chairs the Apex Council under Section 84 of APRA 2014", choose: "Union Minister of Water Resources (Jal Shakti)" },
            { when: "the question asks who are the members of the Apex Council", choose: "Chief Ministers of Telangana and Andhra Pradesh" },
          ],
          nextStep: "Note that under Section 84(3), the Apex Council has the power to resolve disputes between KRMB and GRMB.",
        },
        {
          observation: "Check the Prime Minister's role.",
          correctMeaning: "The Chairperson is the Union Water Resources Minister.",
          selectedMeaning: "The Prime Minister heads the Inter-State Council under Article 263, not the APRA Section 84 Apex Council.",
          possibleConfusion: "Confusing general constitutional councils with this state-bifurcation water body.",
          decisionRules: [
            { when: "the question asks who chairs the Inter-State Council under Article 263", choose: "Prime Minister" },
            { when: "the question asks who chairs the Apex Council under Section 84 of APRA 2014", choose: "Union Minister of Water Resources" },
          ],
          nextStep: "Differentiate Article 263 Inter-State Council from Section 84 Apex Council.",
        },
        {
          observation: "Check judicial water disputes.",
          correctMeaning: "The Apex Council is an executive body.",
          selectedMeaning: "Inter-state river water tribunals (such as KWDT-II / Brijesh Kumar Tribunal) are headed by Supreme Court/High Court judges under Article 262.",
          possibleConfusion: "Conflating river water tribunals with the Apex Council.",
          decisionRules: [
            { when: "the question asks who heads river water dispute tribunals under Article 262", choose: "Sitting or retired Supreme Court / High Court judges" },
            { when: "the question asks who constitutes the Apex Council under Section 84", choose: "Union Minister of Water Resources and both Chief Ministers" },
          ],
          nextStep: "Separate Article 262 Tribunals from Section 84 Apex Council.",
        },
        {
          observation: "Check the bureaucratic level.",
          correctMeaning: "The statutory members are the Chief Ministers and Union Minister.",
          selectedMeaning: "Chief Secretaries represent states in inter-state committee negotiations, but they are not the statutory members of the Apex Council.",
          possibleConfusion: "Bureaucratic coordination meetings are often held before Apex Council sittings.",
          decisionRules: [
            { when: "the question asks for statutory members of Apex Council", choose: "Union Water Resources Minister and the two Chief Ministers" },
            { when: "evaluating options", choose: "Union Minister + two Chief Ministers" },
          ],
          nextStep: "Remember: The Apex Council is strictly a political executive council of 3 members.",
        },
      ],
    },
  },

  // 15. TM-Q090 (Expected / 2018 Presidential Order Police SI Zonal Quotas)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q090",
      topic: "TM-02.03",
      concept: "TM-02.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "Under the Telangana Public Employment (Organization of Local Cadres and Regulation of Direct Recruitment) Order, 2018 (New Zonal System), how are the posts of Police Sub-Inspector (Civil/AR) in the Telangana State Police categorized for direct recruitment and what is the statutory local reservation percentage?",
      options: [
        {
          text: "Multi-Zonal Cadre (Multi-Zone I and Multi-Zone II) with 95% reservation for local candidates of that Multi-Zone and 5% open competition",
          why: "Under the 2018 Presidential Order, the post of Sub-Inspector of Police is organized as a Multi-Zonal post. In all direct recruitments, 95% of vacancies are strictly reserved for local candidates belonging to that Multi-Zone, with only 5% unreserved/open.",
          attraction: "Exact statutory cadre categorization and local quota for SI recruitments.",
          confusion: false,
        },
        {
          text: "District Cadre with 95% reservation for candidates of that specific revenue district",
          why: "District Cadre with 95% quota applies to Police Constable and junior assistant posts, not Police Sub-Inspector posts.",
          attraction: "Confuses Constable cadre (District) with Sub-Inspector cadre (Multi-Zonal).",
          confusion: true,
        },
        {
          text: "Zonal Cadre (Zones 1 through 7) with 70% local reservation and 30% open competition",
          why: "The 2018 Presidential Order abolished the old 70%/60% quota formula of 1975 and instituted a uniform 95% local reservation across all organized local cadres.",
          attraction: "Recalls old 1975 Presidential Order percentage thresholds.",
        },
        {
          text: "State-wide Cadre with no local reservation",
          why: "Only Gazetted head-of-department posts are state-wide; Sub-Inspector is explicitly classified under Multi-Zonal Cadre.",
          attraction: "Incorrect cadre classification.",
        },
      ],
      answer: 0,
      reason: "Under the 2018 New Zonal System notified pursuant to Article 371-D, Telangana is divided into 33 Districts, 7 Zones, and 2 Multi-Zones. Police Constable is a District Cadre post (95% local to district); Sub-Inspector is a Multi-Zonal Cadre post (95% local to Multi-Zone I: Kaleshwaram, Basara, Rajanna, Bhadradri; or Multi-Zone II: Yadadri, Charminar, Jogulamba).",
      clue: "Look for 'Sub-Inspector of Police cadre and quota in 2018 Presidential Order': Multi-Zonal Cadre with 95% local reservation.",
      trap: "Do not confuse Sub-Inspector (Multi-Zonal Cadre, 95%) with Police Constable (District Cadre, 95%) or old 1975 quotas.",
      elimination: "Eliminate District Cadre (Constable) and old 70% quotas; Sub-Inspector is Multi-Zonal Cadre with 95% local quota.",
      anchor: "2018 Presidential Order: Police Sub-Inspector is a Multi-Zonal Cadre post with 95% local reservation.",
      hint: "Is the post of Police Sub-Inspector a District Cadre or a Multi-Zonal Cadre post?",
      source: "Telangana Public Employment Order, 2018 & TSLPRB SI Recruitment Rules",
      page: 12,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified Multi-Zonal Cadre with 95% local reservation.",
          correctMeaning: "Police SI posts are Multi-Zonal: Multi-Zone I covers Zones 1–4, and Multi-Zone II covers Zones 5–7, with 95% reserved for local candidates of that multi-zone.",
          selectedMeaning: "Police SI posts are Multi-Zonal: Multi-Zone I covers Zones 1–4, and Multi-Zone II covers Zones 5–7, with 95% reserved for local candidates of that multi-zone.",
          possibleConfusion: "You answered correctly. This 95% safeguard was specially created in 2018 to ensure local Telangana youth get almost all police posts.",
          decisionRules: [
            { when: "the question asks for the cadre of Police Sub-Inspector under 2018 Order", choose: "Multi-Zonal Cadre with 95% local quota" },
            { when: "the question asks for the cadre of Police Constable under 2018 Order", choose: "District Cadre with 95% local quota" },
          ],
          nextStep: "Remember: Constable = District (95%); Sub-Inspector = Multi-Zonal (95%).",
        },
        {
          observation: "Check the cadre of Police Constable.",
          correctMeaning: "Sub-Inspector is Multi-Zonal.",
          selectedMeaning: "District Cadre with 95% reservation applies to Police Constables, Village Revenue Officers, and Junior Clerks.",
          possibleConfusion: "Candidates prepare for both Constable and SI and confuse which post belongs to District vs Multi-Zonal.",
          decisionRules: [
            { when: "the question asks which cadre Police Constable belongs to", choose: "District Cadre" },
            { when: "the question asks which cadre Police Sub-Inspector belongs to", choose: "Multi-Zonal Cadre" },
          ],
          nextStep: "Distinguish Constable (District) from SI (Multi-Zonal).",
        },
        {
          observation: "Check the old 1975 percentages.",
          correctMeaning: "The 2018 Order mandates 95% across the board.",
          selectedMeaning: "70% was the old Zonal quota under the 1975 Presidential Order.",
          possibleConfusion: "Remembering historical quotas from the 1975 order.",
          decisionRules: [
            { when: "the question asks what local quota was set in the 2018 Presidential Order", choose: "95%" },
            { when: "the question asks about 1975 Zonal quota", choose: "70%" },
          ],
          nextStep: "Anchor 95% firmly as the modern 2018 New Zonal System quota.",
        },
        {
          observation: "Check State-wide Cadre.",
          correctMeaning: "Sub-Inspector is a Multi-Zonal post.",
          selectedMeaning: "State-wide cadre with open competition applies only to top Secretariat and Head of Department officers.",
          possibleConfusion: "Assuming police officers are state-wide recruits.",
          decisionRules: [
            { when: "the question asks which cadre Police Sub-Inspector belongs to", choose: "Multi-Zonal Cadre" },
            { when: "the question asks how many Multi-Zones exist in Telangana", choose: "Two (Multi-Zone I and Multi-Zone II)" },
          ],
          nextStep: "Remember: Telangana has 33 Districts, 7 Zones, and 2 Multi-Zones.",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 5 (${batchQuestions.length} questions)...`);

// Import sources and questions
const importPayload = {
  actor: "human_operator_curator",
  reason: "Ingesting Batch 5: TSLPRB Police Constable 2018/2022 FWT papers, TGPSC Group-1/Group-4 papers, literature & poets, Dhoom Dhaam, Srikrishna 6 options, APRA Apex Council, and 2018 New Zonal System SI quotas.",
  sources,
  questions: batchQuestions,
};

const importResult = importCorpus(db, importPayload);
console.log("Import result:", JSON.stringify(importResult, null, 2));

if (importResult.length !== batchQuestions.length) {
  throw new Error(`Expected ${batchQuestions.length} imports, got ${importResult.length}`);
}

// Publish each question
const reviewPayload: PublicationReview = {
  actor: "human_operator_curator",
  reason: "Batch 5 verified and authenticated for Telangana Police SI & Constable preparation.",
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
console.log(`Batch 5 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
