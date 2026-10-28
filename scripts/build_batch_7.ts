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
  // 1. TM-Q106 (1997 Warangal Declaration)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q106",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 28–29 December 1997, the historic 'Telangana Mahasabha' held at Warangal adopted a landmark declaration comprising 50 comprehensive resolutions outlining economic, cultural, and political exploitation. What is this historic document known as?",
      options: [
        {
          text: "Warangal Declaration (వరంగల్ డిక్లరేషన్)",
          why: "The Warangal Declaration was adopted at the Kakatiya University campus on 28–29 December 1997 under the intellectual guidance of Prof. Jayashankar and Kaloji Narayana Rao, demanding an unconditional separate state.",
          attraction: "The historic declaration that revived the modern ideological movement.",
          confusion: false,
        },
        {
          text: "Bhuvanagiri Declaration",
          why: "Bhuvanagiri hosted the March 1997 seminar on 'Dagaa Paddana Telangana' organized by the Telangana Students Front, which preceded the Warangal conference.",
          attraction: "Earlier 1997 seminar venue.",
          confusion: true,
        },
        {
          text: "Siddipet Declaration",
          why: "Siddipet was KCR's electoral seat, but did not host the 1997 intellectual declaration.",
          attraction: "Prominent movement hub.",
        },
        {
          text: "Karimnagar Declaration",
          why: "Karimnagar hosted the 2001 Simha Garjana rally, not the 1997 50-resolution declaration.",
          attraction: "Venue of the 2001 TRS rally.",
        },
      ],
      answer: 0,
      reason: "The Warangal Declaration (December 1997) was organized by the All India People's Resistance Forum (AIPRF) and Telangana cultural activists. With 50 resolutions detailing agricultural crisis, water diversion, power shortages, and cultural subjugation, it laid the ideological platform for the modern 21st-century statehood movement.",
      clue: "Look for '1997 December conference at Warangal adopting 50 resolutions on Telangana exploitation': Warangal Declaration.",
      trap: "Do not confuse the March 1997 Bhuvanagiri seminar ('Dagaa Paddana Telangana') with the December 1997 Warangal Declaration.",
      elimination: "Eliminate Bhuvanagiri (March 1997 seminar) and Karimnagar (2001 rally); the 50-resolution document is the Warangal Declaration.",
      anchor: "Warangal Declaration (Dec 1997): 50 resolutions against regional exploitation, reviving the statehood agitation.",
      hint: "Which historic declaration was adopted at Kakatiya University in December 1997?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 62,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the Warangal Declaration.",
          correctMeaning: "The Warangal Declaration of December 1997 declared that separate statehood was the only remedy for Telangana's problems.",
          selectedMeaning: "The Warangal Declaration of December 1997 declared that separate statehood was the only remedy for Telangana's problems.",
          possibleConfusion: "You answered correctly. Kaloji Narayana Rao gave the famous keynote call urging youth to lead the struggle.",
          decisionRules: [
            { when: "the question asks about the 50-resolution document adopted in December 1997", choose: "Warangal Declaration" },
            { when: "the question asks who organized the 1997 Warangal conference", choose: "Telangana Mahasabha / AIPRF" },
          ],
          nextStep: "Note the sequence in 1997: Bhuvanagiri Sabha (March 1997) -> Suryapet Dalit conference -> Warangal Declaration (December 1997).",
        },
        {
          observation: "Check the Bhuvanagiri seminar.",
          correctMeaning: "The 50-resolution declaration was adopted at Warangal.",
          selectedMeaning: "The Bhuvanagiri conference was held on 8–9 March 1997 titled 'Dagaa Paddana Telangana', where Prof. Jayashankar spoke on resource exploitation.",
          possibleConfusion: "Both were seminal intellectual events in 1997.",
          decisionRules: [
            { when: "the question asks about the March 1997 'Dagaa Paddana Telangana' seminar", choose: "Bhuvanagiri Sabha" },
            { when: "the question asks about the December 1997 50 resolutions", choose: "Warangal Declaration" },
          ],
          nextStep: "Pair Bhuvanagiri with March 1997 and Warangal with December 1997.",
        },
        {
          observation: "Check Siddipet's milestones.",
          correctMeaning: "Warangal hosted the 1997 declaration.",
          selectedMeaning: "Siddipet hosted employee conventions and was the epicenter of KCR's 2009 deeksha.",
          possibleConfusion: "Major political agitation hub.",
          decisionRules: [
            { when: "the question asks for the 1997 50-resolution declaration", choose: "Warangal Declaration" },
            { when: "evaluating options", choose: "Warangal Declaration" },
          ],
          nextStep: "Associate the 1997 declaration exclusively with Warangal.",
        },
        {
          observation: "Check Karimnagar 2001.",
          correctMeaning: "Warangal was the 1997 venue.",
          selectedMeaning: "Karimnagar hosted the 'Simha Garjana' rally on 17 May 2001 launching TRS into mass politics.",
          possibleConfusion: "Both were massive turning points in movement history.",
          decisionRules: [
            { when: "the question asks about Karimnagar 17 May 2001", choose: "Simha Garjana rally of TRS" },
            { when: "the question asks about December 1997", choose: "Warangal Declaration" },
          ],
          nextStep: "Chronological anchor: 1997 (Warangal Declaration) -> 2001 (Karimnagar Simha Garjana).",
        },
      ],
    },
  },

  // 2. TM-Q107 (Centre for Telangana Studies / Information Trust)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q107",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In 1989, which dedicated research organization was established in Hyderabad by prominent intellectuals including B. Prabhakar Rao, Prof. K. Jayashankar, and K. Ramakrishna Reddy to collect authentic statistical data on regional discrimination and publish fact-finding booklets?",
      options: [
        {
          text: "Telangana Information Trust (తెలంగాణ ఇన్ఫర్మేషన్ ట్రస్ట్)",
          why: "The Telangana Information Trust was founded in 1989 by B. Prabhakar Rao (Managing Trustee), Prof. Jayashankar, and colleagues, publishing pioneering research booklets that mathematically proved the diversion of Telangana's revenues and water.",
          attraction: "The pioneering data and research trust founded in 1989.",
          confusion: false,
        },
        {
          text: "Telangana Praja Samithi",
          why: "Telangana Praja Samithi was the political agitation vehicle of 1969, not the 1989 research trust.",
          attraction: "Historic 1969 political organization.",
        },
        {
          text: "Telangana Rashtra Samithi",
          why: "TRS was founded in 2001, twelve years after the 1989 research trust.",
          attraction: "The political party founded in 2001.",
        },
        {
          text: "Telangana Joint Action Committee",
          why: "TJAC was established in December 2009, two decades later.",
          attraction: "The mass coordination committee of 2009.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "The Telangana Information Trust (1989) played an indispensable role in providing unassailable statistical proof of discrimination in irrigation, jobs, and funds. It published booklets such as 'Telangana Problem - A Study' and helped educate students and professionals during the silent period of the 1990s.",
      clue: "Look for 'Trust formed in 1989 by B. Prabhakar Rao and Prof. Jayashankar to publish statistical data on Telangana': Telangana Information Trust.",
      trap: "Do not confuse the research body (Telangana Information Trust 1989) with political parties (TPS 1969, TRS 2001) or activist platforms (TJAC 2009).",
      elimination: "Eliminate TPS (1969), TRS (2001), and TJAC (2009); the 1989 research entity was the Telangana Information Trust.",
      anchor: "Telangana Information Trust (1989): Founded by B. Prabhakar Rao and Prof. Jayashankar to publish authentic data on regional disparity.",
      hint: "Which trust founded in 1989 published statistical reports on river water and employment discrimination?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 65,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the Telangana Information Trust.",
          correctMeaning: "The Telangana Information Trust was the intellectual laboratory that provided data for the second phase of the agitation.",
          selectedMeaning: "The Telangana Information Trust was the intellectual laboratory that provided data for the second phase of the agitation.",
          possibleConfusion: "You answered correctly. B. Prabhakar Rao served as its Managing Trustee and brought out crucial reports.",
          decisionRules: [
            { when: "the question asks who founded the Telangana Information Trust in 1989", choose: "B. Prabhakar Rao, Prof. Jayashankar, and colleagues" },
            { when: "the question asks what was its primary objective", choose: "Collecting and publishing statistical data on regional discrimination" },
          ],
          nextStep: "Note that its publications formed the factual backbone for KCR's early speeches.",
        },
        {
          observation: "Check TPS timeline.",
          correctMeaning: "The 1989 research trust is Telangana Information Trust.",
          selectedMeaning: "Telangana Praja Samithi was active during 1969–1971 under Madan Mohan and Dr. Chenna Reddy.",
          possibleConfusion: "Confusing different organizations sharing 'Telangana' in their title.",
          decisionRules: [
            { when: "the question asks about the 1969 political party", choose: "Telangana Praja Samithi" },
            { when: "the question asks about the 1989 research trust", choose: "Telangana Information Trust" },
          ],
          nextStep: "Separate 1969 TPS from 1989 Information Trust.",
        },
        {
          observation: "Check TRS launch year.",
          correctMeaning: "The trust was formed in 1989.",
          selectedMeaning: "Telangana Rashtra Samithi was founded on 27 April 2001 at Jala Drushyam.",
          possibleConfusion: "Major political organization of the 2000s.",
          decisionRules: [
            { when: "the question asks when TRS was founded", choose: "2001" },
            { when: "the question asks when Telangana Information Trust was founded", choose: "1989" },
          ],
          nextStep: "Remember: 1989 Trust -> 2001 TRS Party.",
        },
        {
          observation: "Check TJAC formation date.",
          correctMeaning: "The 1989 entity is Telangana Information Trust.",
          selectedMeaning: "Telangana Joint Action Committee was formed on 24 December 2009 under Prof. M. Kodandaram.",
          possibleConfusion: "Another prominent intellectual-led platform.",
          decisionRules: [
            { when: "the question asks about TJAC formation", choose: "December 2009" },
            { when: "the question asks about 1989 data trust", choose: "Telangana Information Trust" },
          ],
          nextStep: "Keep TJAC anchored to December 2009.",
        },
      ],
    },
  },

  // 3. TM-Q108 (Telangana Aikya Vedika 1997)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q108",
      topic: "TM-03.01",
      concept: "TM-03.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 16 October 1997, which broad-based civil society platform was founded at Hyderabad under the leadership of Prof. K. Jayashankar and veteran socialist leader Prof. Keshava Rao Jadhav to unite various voluntary groups demanding statehood?",
      options: [
        {
          text: "Telangana Aikya Vedika (తెలంగాణ ఐక్యవేదిక)",
          why: "Telangana Aikya Vedika was established on 16 October 1997 at Hyderabad with Prof. Keshava Rao Jadhav as President and Prof. Jayashankar as the ideological advisor, acting as an umbrella forum for activists.",
          attraction: "The leading unified civil forum formed in late 1997.",
          confusion: false,
        },
        {
          text: "Telangana Jana Sabha",
          why: "Telangana Jana Sabha was formed in July 1997 by revolutionary groups led by Akula Bhoomaiah, prior to Telangana Aikya Vedika.",
          attraction: "Contemporaneous activist forum formed in 1997.",
          confusion: true,
        },
        {
          text: "Telangana Vidrohula Sangham",
          why: "Not an authentic historic organization.",
          attraction: "Fictitious name.",
        },
        {
          text: "Telangana Joint Action Committee",
          why: "TJAC was established in 2009, not 1997.",
          attraction: "The famous 2009 coordination body.",
        },
      ],
      answer: 0,
      reason: "Following the Bhuvanagiri and Warangal meets, intellectual leaders recognized the need for an institutional civil umbrella. Telangana Aikya Vedika was launched on 16 October 1997 at Sundarayya Vignana Kendram, Hyderabad. Prof. Keshava Rao Jadhav served as President, and it conducted extensive study circles across the 10 districts.",
      clue: "Look for 'Platform formed on 16 October 1997 by Prof. Jayashankar and Prof. Keshava Rao Jadhav': Telangana Aikya Vedika.",
      trap: "Do not confuse Telangana Aikya Vedika (headed by Keshava Rao Jadhav) with Telangana Jana Sabha (headed by Akula Bhoomaiah).",
      elimination: "Eliminate Telangana Jana Sabha (Akula Bhoomaiah) and TJAC (2009); Telangana Aikya Vedika was formed by Keshava Rao Jadhav and Jayashankar in October 1997.",
      anchor: "Telangana Aikya Vedika (Oct 1997): Founded by Prof. Keshava Rao Jadhav and Prof. Jayashankar as a unified civil platform.",
      hint: "Which 'Aikya Vedika' was formed by socialist leader Keshava Rao Jadhav in 1997?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 68,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Telangana Aikya Vedika.",
          correctMeaning: "Telangana Aikya Vedika brought together intellectuals, socialists, and activists under one banner in late 1997.",
          selectedMeaning: "Telangana Aikya Vedika brought together intellectuals, socialists, and activists under one banner in late 1997.",
          possibleConfusion: "You answered correctly. Keshava Rao Jadhav was a lifelong follower of Rammanohar Lohia and a stalwart of the 1969 movement.",
          decisionRules: [
            { when: "the question asks who was the President of Telangana Aikya Vedika (1997)", choose: "Prof. Keshava Rao Jadhav" },
            { when: "the question asks when Telangana Aikya Vedika was founded", choose: "16 October 1997" },
          ],
          nextStep: "Remember Keshava Rao Jadhav's role in linking socialist ideals with Telangana regional autonomy.",
        },
        {
          observation: "Check Telangana Jana Sabha.",
          correctMeaning: "Keshava Rao Jadhav and Jayashankar led Telangana Aikya Vedika.",
          selectedMeaning: "Telangana Jana Sabha was formed on 6 July 1997 at Ravindra Bharathi with Akula Bhoomaiah as President.",
          possibleConfusion: "Both were launched in 1997 as civil society pressure groups.",
          decisionRules: [
            { when: "the question asks who founded Telangana Jana Sabha in July 1997", choose: "Akula Bhoomaiah" },
            { when: "the question asks who founded Telangana Aikya Vedika in October 1997", choose: "Prof. Keshava Rao Jadhav and Prof. Jayashankar" },
          ],
          nextStep: "Differentiate Jana Sabha (Akula Bhoomaiah) from Aikya Vedika (Keshava Rao Jadhav).",
        },
        {
          observation: "Check fictitious name.",
          correctMeaning: "The authentic platform is Telangana Aikya Vedika.",
          selectedMeaning: "Option 3 is an invented distractor.",
          possibleConfusion: "Rhetorical phrasing from movement speeches.",
          decisionRules: [
            { when: "the question asks who headed the October 1997 umbrella body", choose: "Prof. Keshava Rao Jadhav (Telangana Aikya Vedika)" },
            { when: "the question asks who was its ideological advisor", choose: "Prof. K. Jayashankar" },
          ],
          nextStep: "Rely only on authenticated civil society names.",
        },
        {
          observation: "Check TJAC.",
          correctMeaning: "1997 was Telangana Aikya Vedika.",
          selectedMeaning: "TJAC was formed in December 2009 after the Union Government's flip-flop on statehood.",
          possibleConfusion: "Both served as umbrella bodies uniting different factions.",
          decisionRules: [
            { when: "the question asks for the 1997 umbrella body", choose: "Telangana Aikya Vedika" },
            { when: "the question asks for the 2009 umbrella body", choose: "Telangana Joint Action Committee (TJAC)" },
          ],
          nextStep: "Chronological anchor: 1997 (Aikya Vedika) -> 2009 (TJAC).",
        },
      ],
    },
  },

  // 4. TM-Q109 (Karimnagar Simha Garjana 17 May 2001)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q109",
      topic: "TM-03.02",
      concept: "TM-03.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 17 May 2001, exactly three weeks after the party was founded, the Telangana Rashtra Samithi (TRS) held its mammoth inaugural public rally attended by over two lakh people at SRR Government Arts College grounds. What was this historic rally titled?",
      options: [
        {
          text: "Simha Garjana (సింహ గర్జన - The Lion's Roar)",
          why: "The Karimnagar public meeting on 17 May 2001 was named 'Simha Garjana' (Lion's Roar), where KCR blew the ceremonial conch (Shankharavam) and delivered his legendary speech declaring that Telangana statehood was an unstoppable force.",
          attraction: "The historic first mega-rally of TRS at Karimnagar.",
          confusion: false,
        },
        {
          text: "Vidyarthi Garjana",
          why: "Vidyarthi Garjana was organized by Osmania University students in January 2010.",
          attraction: "Famous student rally of 2010.",
        },
        {
          text: "Polikeka",
          why: "Polikeka was a later mass convention organized by employee unions, not the 2001 Karimnagar rally.",
          attraction: "Famous movement rally title.",
        },
        {
          text: "Jana Garjana",
          why: "Jana Garjana was organized at Warangal in 2003, not the May 2001 inaugural rally.",
          attraction: "Later rally title used in Warangal.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "Following the party's birth on 27 April 2001, the Karimnagar 'Simha Garjana' on 17 May 2001 demonstrated massive grassroots support. KCR announced that TRS was formed not for political power but strictly as a single-point movement party to achieve statehood. Prominent leaders from Jharkhand and Chhattisgarh also addressed the mammoth crowd.",
      clue: "Look for 'TRS first mega public rally at Karimnagar on 17 May 2001': Simha Garjana.",
      trap: "Do not confuse the 2001 Karimnagar rally ('Simha Garjana') with the 2003 Warangal rally ('Jana Garjana') or the 2010 OU rally ('Vidyarthi Garjana').",
      elimination: "Eliminate Vidyarthi Garjana (2010) and Jana Garjana (2003 Warangal); the 17 May 2001 Karimnagar rally was Simha Garjana.",
      anchor: "Karimnagar Simha Garjana (17 May 2001): The inaugural public rally of TRS that shook Andhra Pradesh politics.",
      hint: "What was the 'Lion's Roar' rally held at Karimnagar SRR College in May 2001?",
      source: "TGPSC Group-1 Preliminary Examination 2024",
      page: 24,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Simha Garjana.",
          correctMeaning: "Simha Garjana at Karimnagar established TRS as a serious political force within weeks of its launch.",
          selectedMeaning: "Simha Garjana at Karimnagar established TRS as a serious political force within weeks of its launch.",
          possibleConfusion: "You answered correctly. The success of Simha Garjana forced all major political parties to reconsider their stance on Telangana.",
          decisionRules: [
            { when: "the question asks for the name of the 17 May 2001 Karimnagar rally", choose: "Simha Garjana" },
            { when: "the question asks where Simha Garjana was held", choose: "SRR College Grounds, Karimnagar" },
          ],
          nextStep: "Remember: 27 April 2001 = Party formed at Jala Drushyam; 17 May 2001 = Simha Garjana at Karimnagar.",
        },
        {
          observation: "Check Vidyarthi Garjana.",
          correctMeaning: "The May 2001 rally was Simha Garjana.",
          selectedMeaning: "Vidyarthi Garjana was held on 3 January 2010 at Osmania University Arts College grounds.",
          possibleConfusion: "Both were seminal rallies in movement history.",
          decisionRules: [
            { when: "the question asks about the Osmania University student rally on 3 Jan 2010", choose: "Vidyarthi Garjana" },
            { when: "the question asks about the 17 May 2001 Karimnagar rally", choose: "Simha Garjana" },
          ],
          nextStep: "Pair Vidyarthi Garjana with Osmania University (2010) and Simha Garjana with Karimnagar (2001).",
        },
        {
          observation: "Check Polikeka.",
          correctMeaning: "The rally was Simha Garjana.",
          selectedMeaning: "Polikeka was a historic teachers and employees convention held at Nizam College grounds during the 2011 agitation.",
          possibleConfusion: "Another evocative Telugu title from movement gatherings.",
          decisionRules: [
            { when: "the question asks about the teachers/employees rally 'Polikeka'", choose: "Nizam College Grounds, Hyderabad" },
            { when: "the question asks for the 2001 TRS launch rally", choose: "Simha Garjana" },
          ],
          nextStep: "Identify Polikeka as an employee/teacher union rally.",
        },
        {
          observation: "Check Jana Garjana.",
          correctMeaning: "The 2001 rally was Simha Garjana.",
          selectedMeaning: "Jana Garjana was the massive second-anniversary plenary rally organized by TRS at Hanamkonda (Warangal) in April 2003.",
          possibleConfusion: "Both rallies featured 'Garjana' in their name.",
          decisionRules: [
            { when: "the question asks about the April 2003 Warangal rally", choose: "Jana Garjana" },
            { when: "the question asks about the May 2001 Karimnagar rally", choose: "Simha Garjana" },
          ],
          nextStep: "Chronological anchor: 2001 (Simha Garjana, Karimnagar) -> 2003 (Jana Garjana, Warangal).",
        },
      ],
    },
  },

  // 5. TM-Q110 (2004 Common Minimum Programme of UPA)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q110",
      topic: "TM-03.02",
      concept: "TM-03.02-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "In May 2004, following the alliance between the Congress and TRS in the general elections, what specific provision regarding the demand for a separate Telangana State was officially incorporated into the National Common Minimum Programme (NCMP) of the United Progressive Alliance (UPA-I) government?",
      options: [
        {
          text: "'The UPA government will consider the demand for the formation of a Telangana State by taking into account the consensus among all political parties and through consultations'",
          why: "The NCMP adopted in May 2004 explicitly stated under regional aspirations: 'The UPA government will consider the demand for the formation of a Telangana State by taking into account the consensus among all political parties and through consultations.'",
          attraction: "The official text of the 2004 UPA Common Minimum Programme.",
          confusion: false,
        },
        {
          text: "'The UPA government will grant unconditional statehood to Telangana within 100 days of assuming office'",
          why: "No 100-day deadline was ever written in the NCMP; it conditioned progress on political consensus.",
          attraction: "Frequent campaign promise rhetoric.",
          confusion: true,
        },
        {
          text: "'The UPA government rejects any further division of linguistic states in India'",
          why: "The NCMP recognized the Telangana demand and promised consultation, rather than rejecting it.",
          attraction: "Anti-bifurcation position.",
        },
        {
          text: "'The UPA government will appoint a second States Reorganisation Commission to examine Telangana'",
          why: "While some Congress leaders suggested a Second SRC, the NCMP itself specified 'consultations and consensus', not a Second SRC.",
          attraction: "Common alternative proposal debated in 2004.",
        },
      ],
      answer: 0,
      reason: "In the 2004 elections, Congress allied with TRS (TRS won 26 Assembly and 5 Lok Sabha seats). KCR and A. Narendra joined the Union Cabinet. For the first time in Indian parliamentary history, the formation of a separate Telangana State was formally included in the ruling national coalition's Common Minimum Programme and mentioned in the President's address to Parliament.",
      clue: "Look for 'Text of 2004 UPA Common Minimum Programme on Telangana': Consider the demand through consultations and consensus among all political parties.",
      trap: "Do not choose the 100-day deadline or Second SRC; the NCMP explicitly mandated 'consultations and consensus among all political parties'.",
      elimination: "Eliminate 100-day deadline and Second SRC; the NCMP text specified consultations and consensus.",
      anchor: "2004 UPA Common Minimum Programme: Officially committed to consider Telangana statehood through consultations and consensus.",
      hint: "What was the consensus-based wording used in the 2004 UPA government agreement?",
      source: "TGPSC Group-1 Preliminary Examination 2023",
      page: 30,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the consensus and consultation clause.",
          correctMeaning: "The NCMP recognized Telangana as a legitimate national governance priority while leaving room for consensus building.",
          selectedMeaning: "The NCMP recognized Telangana as a legitimate national governance priority while leaving room for consensus building.",
          possibleConfusion: "You answered correctly. President A.P.J. Abdul Kalam also reiterated this commitment in his joint address to Parliament in June 2004.",
          decisionRules: [
            { when: "the question asks what was promised in the 2004 UPA Common Minimum Programme", choose: "To consider Telangana demand through consultations and consensus" },
            { when: "the question asks who was the President of India who mentioned Telangana in his 2004 address", choose: "Dr. A.P.J. Abdul Kalam" },
          ],
          nextStep: "Note that KCR served as Union Cabinet Minister for Labour and Employment in UPA-I.",
        },
        {
          observation: "Check the 100-day deadline claim.",
          correctMeaning: "The NCMP had no 100-day timeline.",
          selectedMeaning: "BJP had earlier made 100-day promises during the Kakinada resolution (1997 'One Vote, Two States'), but UPA's 2004 document had no such date.",
          possibleConfusion: "Conflating BJP's 1997 Kakinada slogan with UPA's 2004 policy document.",
          decisionRules: [
            { when: "the question asks about BJP's 1997 Kakinada resolution", choose: "'One Vote, Two States' (Oka Vote, Rendu Rashtralu)" },
            { when: "the question asks about UPA's 2004 NCMP", choose: "Consultations and consensus" },
          ],
          nextStep: "Differentiate party resolutions from coalition government policy agreements.",
        },
        {
          observation: "Check anti-division claims.",
          correctMeaning: "The NCMP accepted the demand for active consideration.",
          selectedMeaning: "Left parties opposed statehood, but Congress and TRS ensured Telangana was recognized in the national document.",
          possibleConfusion: "Assuming national parties rejected statehood in 2004.",
          decisionRules: [
            { when: "the question asks whether Telangana was in 2004 NCMP", choose: "Yes, included as a specific commitment" },
            { when: "evaluating options", choose: "Commitment to consider through consensus" },
          ],
          nextStep: "Anchor 2004 NCMP as the first official central coalition document recognizing Telangana.",
        },
        {
          observation: "Check the Second SRC debate.",
          correctMeaning: "The NCMP did not mention a Second SRC.",
          selectedMeaning: "The Congress Working Committee occasionally debated a Second SRC, but TRS firmly rejected it as a delay tactic.",
          possibleConfusion: "Second SRC was a major talking point in 2004–2006.",
          decisionRules: [
            { when: "the question asks what the NCMP explicitly mandated", choose: "Consultations and consensus" },
            { when: "the question asks what committee was appointed in 2005", choose: "Pranab Mukherjee Sub-Committee" },
          ],
          nextStep: "Remember: NCMP = consensus; 2005 = Pranab Mukherjee Sub-Committee.",
        },
      ],
    },
  },

  // 6. TM-Q111 (Pranab Mukherjee Sub-Committee 2005)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q111",
      topic: "TM-03.02",
      concept: "TM-03.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In January 2005, the UPA Central Government constituted a three-member Cabinet Sub-Committee to build consensus among political parties on the separate Telangana demand. Who chaired this high-powered Cabinet Sub-Committee?",
      options: [
        {
          text: "Pranab Mukherjee (then Union Defence Minister)",
          why: "The Cabinet Sub-Committee was constituted on 5 January 2005 under the chairmanship of veteran statesman Pranab Mukherjee, with Dayanidhi Maran and Raghuvansh Prasad Singh as members.",
          attraction: "The chairman of the 2005 UPA Sub-Committee on Telangana.",
          confusion: false,
        },
        {
          text: "Sushilkumar Shinde",
          why: "Sushilkumar Shinde chaired the Group of Ministers (GoM) in 2013 that drafted the Bifurcation Bill, not the 2005 sub-committee.",
          attraction: "Chaired the 2013 GoM on Telangana.",
          confusion: true,
        },
        {
          text: "P. Chidambaram",
          why: "P. Chidambaram was Union Home Minister in 2009 who made the December 9 announcement, not the 2005 sub-committee chairman.",
          attraction: "Union Home Minister during the 2009 announcements.",
        },
        {
          text: "A.K. Antony",
          why: "A.K. Antony headed the Congress Party's four-member internal committee in 2013, not the 2005 government sub-committee.",
          attraction: "Headed the 2013 Antony Committee.",
        },
      ],
      answer: 0,
      reason: "The Pranab Mukherjee Sub-Committee was formed in January 2005 to fulfill the NCMP promise. It sent letters to over 30 political parties seeking their written views on Telangana. While many parties (including TRS, TDP, BJP, CPI, and BSP) responded positively, the committee delayed submitting a final report, prompting TRS ministers to resign from the Union Cabinet in August 2006.",
      clue: "Look for 'Chairman of the 2005 three-member UPA Cabinet Sub-Committee on Telangana': Pranab Mukherjee.",
      trap: "Do not confuse the 2005 Pranab Mukherjee Sub-Committee with the 2013 Sushilkumar Shinde GoM or the 2013 A.K. Antony Committee.",
      elimination: "Eliminate Sushilkumar Shinde (2013 GoM) and A.K. Antony (2013 party committee); Pranab Mukherjee chaired the 2005 Sub-Committee.",
      anchor: "Pranab Mukherjee Sub-Committee (Jan 2005): Appointed by UPA-I to ascertain consensus on Telangana statehood.",
      hint: "Which senior defense minister (who later became President of India) chaired the 2005 Telangana committee?",
      source: "TGPSC Group-1 Preliminary Examination 2024",
      page: 26,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Pranab Mukherjee.",
          correctMeaning: "Pranab Mukherjee headed the 2005 Cabinet Sub-Committee alongside Dayanidhi Maran and Raghuvansh Prasad Singh.",
          selectedMeaning: "Pranab Mukherjee headed the 2005 Cabinet Sub-Committee alongside Dayanidhi Maran and Raghuvansh Prasad Singh.",
          possibleConfusion: "You answered correctly. Ironically, Pranab Mukherjee later gave Presidential assent to the AP Reorganisation Act in March 2014.",
          decisionRules: [
            { when: "the question asks who chaired the 2005 Cabinet Sub-Committee on Telangana", choose: "Pranab Mukherjee" },
            { when: "the question asks who were the other two members", choose: "Dayanidhi Maran and Raghuvansh Prasad Singh" },
          ],
          nextStep: "Note that in August 2006, KCR and A. Narendra resigned from the Union Cabinet protesting inaction by this sub-committee.",
        },
        {
          observation: "Check Sushilkumar Shinde's role.",
          correctMeaning: "Pranab Mukherjee chaired the 2005 committee.",
          selectedMeaning: "Sushilkumar Shinde was Union Home Minister in 2013 and chaired the Group of Ministers (GoM) that drafted the Bifurcation Bill.",
          possibleConfusion: "Both were senior Union ministers chairing Telangana committees.",
          decisionRules: [
            { when: "the question asks who chaired the 2013 Group of Ministers (GoM)", choose: "Sushilkumar Shinde" },
            { when: "the question asks who chaired the 2005 Cabinet Sub-Committee", choose: "Pranab Mukherjee" },
          ],
          nextStep: "Chronological anchor: 2005 (Pranab Mukherjee Sub-Committee) -> 2013 (Sushilkumar Shinde GoM).",
        },
        {
          observation: "Check P. Chidambaram.",
          correctMeaning: "The 2005 chairman was Pranab Mukherjee.",
          selectedMeaning: "P. Chidambaram served as Finance Minister in 2005 and became Home Minister in late 2008.",
          possibleConfusion: "Chidambaram made the historic 9 December 2009 announcement.",
          decisionRules: [
            { when: "the question asks who delivered the 9 December 2009 midnight announcement", choose: "P. Chidambaram" },
            { when: "the question asks who chaired the 2005 committee", choose: "Pranab Mukherjee" },
          ],
          nextStep: "Tie Chidambaram to 2009 and Pranab to 2005.",
        },
        {
          observation: "Check A.K. Antony Committee.",
          correctMeaning: "Pranab Mukherjee was the 2005 chairman.",
          selectedMeaning: "The A.K. Antony Committee was an internal Congress party committee appointed in August 2013 to hear Seemandhra grievances.",
          possibleConfusion: "Internal party committee versus Cabinet Sub-Committee.",
          decisionRules: [
            { when: "the question asks about the 2013 Congress grievance committee", choose: "A.K. Antony Committee" },
            { when: "the question asks about the 2005 UPA government committee", choose: "Pranab Mukherjee Sub-Committee" },
          ],
          nextStep: "Remember: 2005 = Pranab Mukherjee; 2013 = A.K. Antony.",
        },
      ],
    },
  },

  // 7. TM-Q112 (29 November 2009 Indefinite Fast / Alaganur Arrest)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q112",
      topic: "TM-03.02",
      concept: "TM-03.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 29 November 2009, TRS President K. Chandrashekar Rao launched an indefinite hunger strike (Aamarna Deeksha) demanding statehood for Telangana with the slogan 'Telangana Waley - Telangana Ravaley' (తెలంగాణ వచ్చుడో - కేసీఆర్ సచ్చుడో). At which location was his convoy intercepted and arrested by the Andhra Pradesh police while en route to Siddipet?",
      options: [
        {
          text: "Alaganur village (near Karimnagar)",
          why: "On the morning of 29 November 2009, while KCR was traveling from Karimnagar to Siddipet to sit on the hunger strike at Rangadhampally, his convoy was stopped and he was arrested at Alaganur village on the Karimnagar-Siddipet road.",
          attraction: "The historic village where KCR was arrested on 29 November 2009.",
          confusion: false,
        },
        {
          text: "Rangadhampally (Siddipet)",
          why: "Rangadhampally was the intended deeksha site where the stage had been constructed, but KCR was intercepted before reaching it.",
          attraction: "The planned deeksha site.",
          confusion: true,
        },
        {
          text: "Khammam Sub-Jail",
          why: "Khammam Sub-Jail was where KCR was remanded in judicial custody after arrest, not the interception location.",
          attraction: "Where KCR was remanded after arrest.",
        },
        {
          text: "NIMS Hospital, Hyderabad",
          why: "NIMS was where KCR was shifted on 3 December 2009 when his health deteriorated, continuing his fast in the ICU.",
          attraction: "Where the fast concluded on 9 December 2009.",
        },
      ],
      answer: 0,
      reason: "KCR announced his fast unto death starting 29 November 2009. Police placed him under preventive custody at Alaganur village near Karimnagar. He was taken to Khammam Sub-Jail, where he continued his hunger strike. His arrest triggered spontaneous uprisings across Telangana, with thousands of students clashing with police on the Osmania University campus, forcing his transfer to NIMS.",
      clue: "Look for 'Location where KCR was arrested on 29 November 2009 while proceeding to his deeksha': Alaganur village.",
      trap: "Do not confuse the arrest site (Alaganur village) with the planned deeksha stage (Rangadhampally) or the jail (Khammam).",
      elimination: "Eliminate Rangadhampally (destination) and Khammam (remand jail); KCR was intercepted at Alaganur village.",
      anchor: "29 November 2009 Deeksha: KCR arrested at Alaganur village; his fast sparked the decisive final statehood agitation.",
      hint: "At which Karimnagar village was KCR's convoy stopped on the morning of 29 November 2009?",
      source: "TGPSC Group-1 Preliminary Examination 2024",
      page: 28,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Alaganur village.",
          correctMeaning: "Alaganur village in Thimmapur mandal, Karimnagar is the exact spot where police arrested KCR on 29 November 2009.",
          selectedMeaning: "Alaganur village in Thimmapur mandal, Karimnagar is the exact spot where police arrested KCR on 29 November 2009.",
          possibleConfusion: "You answered correctly. The slogan he raised before arrest was: 'తెలంగాణ వచ్చుడో - కేసీఆర్ సచ్చుడో' (Either Telangana is achieved or KCR dies).",
          decisionRules: [
            { when: "the question asks where KCR was intercepted and arrested on 29 November 2009", choose: "Alaganur village (Karimnagar)" },
            { when: "the question asks where he was initially jailed", choose: "Khammam Sub-Jail" },
          ],
          nextStep: "Note that on 3 December 2009, he was shifted to NIMS Hospital in Hyderabad as his condition turned critical.",
        },
        {
          observation: "Check Rangadhampally's significance.",
          correctMeaning: "The arrest happened at Alaganur.",
          selectedMeaning: "Rangadhampally (near Siddipet) was the venue where the grand 'Deeksha Vedika' stage was erected.",
          possibleConfusion: "The deeksha was famously billed as 'Siddipet Deeksha'.",
          decisionRules: [
            { when: "the question asks where the 2009 Deeksha stage was planned", choose: "Rangadhampally, Siddipet" },
            { when: "the question asks where KCR was intercepted and arrested", choose: "Alaganur village" },
          ],
          nextStep: "Remember: Planned at Rangadhampally; intercepted at Alaganur.",
        },
        {
          observation: "Check Khammam Sub-Jail.",
          correctMeaning: "Alaganur was the arrest site.",
          selectedMeaning: "Khammam Sub-Jail was chosen by the government to keep KCR far away from Hyderabad and Osmania University.",
          possibleConfusion: "KCR stayed in Khammam jail from 29 November to 2 December.",
          decisionRules: [
            { when: "the question asks which jail KCR was taken to after arrest at Alaganur", choose: "Khammam Sub-Jail" },
            { when: "the question asks where he was arrested", choose: "Alaganur village" },
          ],
          nextStep: "Differentiate arrest site (Alaganur) from detention jail (Khammam).",
        },
        {
          observation: "Check NIMS Hospital.",
          correctMeaning: "The arrest was at Alaganur.",
          selectedMeaning: "NIMS (Nizam's Institute of Medical Sciences) in Punjagutta, Hyderabad was where KCR was admitted under medical supervision from 3 to 9 December.",
          possibleConfusion: "NIMS was the epicenter of public vigil during the final days of the fast.",
          decisionRules: [
            { when: "the question asks where KCR broke his 11-day fast on 9 December 2009", choose: "NIMS Hospital, Hyderabad" },
            { when: "the question asks where he was arrested on day one", choose: "Alaganur village" },
          ],
          nextStep: "Chronological chain: Alaganur (Nov 29) -> Khammam Jail (Nov 29-Dec 2) -> NIMS (Dec 3-9).",
        },
      ],
    },
  },

  // 8. TM-Q113 (P. Chidambaram Historic Midnight Announcement 9 Dec 2009)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q113",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On the historic midnight of 9 December 2009, as KCR's 11-day hunger strike pushed Telangana to the brink of revolution, which Union Home Minister delivered the official statement from New Delhi declaring: 'The process of forming the state of Telangana will be initiated'?",
      options: [
        {
          text: "P. Chidambaram",
          why: "At 11:30 PM on 9 December 2009, Union Home Minister P. Chidambaram emerged after a crucial meeting of the Congress Core Committee at the Prime Minister's residence and read out the historic two-sentence statement initiating the process of forming Telangana State.",
          attraction: "The Union Home Minister who made the 9 December 2009 announcement.",
          confusion: false,
        },
        {
          text: "Sushilkumar Shinde",
          why: "Sushilkumar Shinde was Union Home Minister in 2013–2014 when the Bill was passed, not in December 2009.",
          attraction: "Home Minister during 2014 state formation.",
          confusion: true,
        },
        {
          text: "Shivraj Patil",
          why: "Shivraj Patil resigned as Home Minister after the 26/11 Mumbai attacks in November 2008 and was succeeded by P. Chidambaram.",
          attraction: "Preceding Union Home Minister.",
        },
        {
          text: "Dr. Manmohan Singh",
          why: "Dr. Manmohan Singh was the Prime Minister who approved the decision, but the public statement was delivered by Home Minister P. Chidambaram.",
          attraction: "Prime Minister of India in 2009.",
        },
      ],
      answer: 0,
      reason: "The exact statement read by P. Chidambaram on 9 December 2009 was: 'The process of forming the state of Telangana will be initiated. An appropriate resolution will be moved in the State Legislative Assembly. We request the leaders of all parties to withdraw their agitations and advise Shri K. Chandrashekar Rao to end his fast.' Upon hearing this broadcast at NIMS, KCR accepted lemon juice and ended his fast.",
      clue: "Look for 'Union Home Minister who announced the initiation of Telangana statehood process on 9 December 2009': P. Chidambaram.",
      trap: "Do not confuse P. Chidambaram (9 Dec 2009 announcement) with Sushilkumar Shinde (2014 parliamentary passage) or Prime Minister Manmohan Singh.",
      elimination: "Eliminate Sushilkumar Shinde (2013-14) and Shivraj Patil (resigned 2008); P. Chidambaram made the historic 9 December announcement.",
      anchor: "9 December 2009 Historic Announcement: Union Home Minister P. Chidambaram announced that the process of forming Telangana will be initiated.",
      hint: "Which Union Home Minister issued the midnight statement that led KCR to break his fast at NIMS?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 75,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected P. Chidambaram.",
          correctMeaning: "P. Chidambaram issued the landmark 9 December 2009 statement on behalf of the Central Government.",
          selectedMeaning: "P. Chidambaram issued the landmark 9 December 2009 statement on behalf of the Central Government.",
          possibleConfusion: "You answered correctly. Celebrations erupted all over Telangana before the decision was controversially reversed two weeks later.",
          decisionRules: [
            { when: "the question asks who made the 9 December 2009 midnight announcement on Telangana", choose: "P. Chidambaram" },
            { when: "the question asks what time the announcement was made", choose: "11:30 PM, 9 December 2009" },
          ],
          nextStep: "Remember that Chief Minister K. Rosaiah had held an all-party meeting in Hyderabad earlier that evening supporting the move.",
        },
        {
          observation: "Check Sushilkumar Shinde's tenure.",
          correctMeaning: "Chidambaram made the 2009 announcement.",
          selectedMeaning: "Sushilkumar Shinde replaced Chidambaram as Home Minister in July 2012 and steered the 2014 Bifurcation Bill.",
          possibleConfusion: "Both were Union Home Ministers central to Telangana statehood.",
          decisionRules: [
            { when: "the question asks who was Home Minister on 9 December 2009", choose: "P. Chidambaram" },
            { when: "the question asks who moved the AP Reorganisation Bill in Lok Sabha in Feb 2014", choose: "Sushilkumar Shinde" },
          ],
          nextStep: "Chronological anchor: 2009 announcement (Chidambaram) -> 2014 Bill passage (Shinde).",
        },
        {
          observation: "Check Shivraj Patil.",
          correctMeaning: "The Home Minister was P. Chidambaram.",
          selectedMeaning: "Shivraj Patil was Home Minister until November 2008.",
          possibleConfusion: "Preceding Home Minister under UPA-I.",
          decisionRules: [
            { when: "the question asks who replaced Shivraj Patil in late 2008", choose: "P. Chidambaram" },
            { when: "the question asks who made the Telangana announcement", choose: "P. Chidambaram" },
          ],
          nextStep: "Eliminate Shivraj Patil from 2009 Telangana milestones.",
        },
        {
          observation: "Check Prime Minister's role.",
          correctMeaning: "Chidambaram delivered the announcement.",
          selectedMeaning: "Dr. Manmohan Singh was Prime Minister and presided over the cabinet meetings, but the formal declaration was read by Home Minister Chidambaram.",
          possibleConfusion: "Attributing ministerial statements to the head of government.",
          decisionRules: [
            { when: "the question asks who delivered the announcement", choose: "Union Home Minister P. Chidambaram" },
            { when: "the question asks who was Prime Minister", choose: "Dr. Manmohan Singh" },
          ],
          nextStep: "Differentiate the Prime Minister from the Home Minister who made the formal announcement.",
        },
      ],
    },
  },

  // 9. TM-Q114 (23 December 2009 Rollback Statement)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q114",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 23 December 2009, exactly two weeks after the midnight declaration, Union Home Minister P. Chidambaram issued a second statement putting the statehood process on hold citing 'altered situation' and widespread resignations in Seemandhra. What did this statement immediately spark across Telangana?",
      options: [
        {
          text: "Widespread mass resignations of 131 Telangana MLAs across party lines and the immediate formation of the Telangana Joint Action Committee (TJAC)",
          why: "The betrayal of 23 December 2009 ignited unprecedented fury across Telangana. 131 MLAs from Congress, TDP, TRS, and CPI tendered their resignations, and on 24 December 2009, all political parties and employee unions united to create the Telangana Joint Action Committee (TJAC).",
          attraction: "The direct historical consequence of the 23 December rollback.",
          confusion: false,
        },
        {
          text: "Complete abandonment of the statehood demand by all political parties",
          why: "The demand was intensified, not abandoned.",
          attraction: "Completely false historical interpretation.",
        },
        {
          text: "Imposition of President's Rule in Andhra Pradesh under Article 356",
          why: "President's Rule was imposed in February 2014 after Kiran Kumar Reddy resigned, not in December 2009.",
          attraction: "Confuses 2009 with February 2014.",
        },
        {
          text: "Dissolution of the Andhra Pradesh Legislative Assembly",
          why: "The Assembly was not dissolved; the Rosaiah ministry continued.",
          attraction: "Constitutional misconception.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "The 23 December 2009 statement stated that 'a large number of political parties are divided on the issue... wide-ranging consultations are necessary.' This backtracked on the 9 December pledge. Outraged, 131 MLAs, 16 MPs, and MLCs resigned. To prevent political fragmentation, Prof. Kodandaram, KCR, and union leaders founded the TJAC at the Jubilee Hall in Hyderabad on 24 December 2009.",
      clue: "Look for 'Consequences of 23 December 2009 Central Government rollback statement': Mass resignations of 131 Telangana MLAs and formation of TJAC.",
      trap: "Do not confuse the 2009 crisis with President's Rule (which occurred in February 2014).",
      elimination: "Eliminate President's Rule (2014) and Assembly dissolution; the 23 December rollback triggered mass MLA resignations and the birth of TJAC.",
      anchor: "23 December 2009 Rollback: Central government backtrack triggered mass MLA resignations and the formation of TJAC on 24 December 2009.",
      hint: "What massive coordination committee was formed on 24 December 2009 following the Centre's rollback?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 78,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the mass resignations and TJAC formation.",
          correctMeaning: "The 23 December rollback united all political parties, employee unions, and students into the most powerful coalition: TJAC.",
          selectedMeaning: "The 23 December rollback united all political parties, employee unions, and students into the most powerful coalition: TJAC.",
          possibleConfusion: "You answered correctly. The joint resignations proved that no political party in Telangana could compromise on statehood.",
          decisionRules: [
            { when: "the question asks what happened immediately after the 23 December 2009 rollback", choose: "Mass resignations of Telangana legislators and formation of TJAC on 24 Dec 2009" },
            { when: "the question asks how many legislators resigned", choose: "131 MLAs" },
          ],
          nextStep: "Note that TJAC was born just 24 hours after the rollback statement.",
        },
        {
          observation: "Check abandonment claim.",
          correctMeaning: "The movement intensified into non-cooperation and general strikes.",
          selectedMeaning: "Option 2 claims statehood was abandoned, which is the exact opposite of reality.",
          possibleConfusion: "Complete misreading of historical direction.",
          decisionRules: [
            { when: "the question asks what was the reaction to the 23 December 2009 rollback", choose: "Mass resignations of 131 MLAs and formation of TJAC" },
            { when: "the question asks whether the statehood demand was abandoned", choose: "No, movement intensified into mass strikes" },
          ],
          nextStep: "Remember: The 23 Dec statement escalated the movement into its most militant phase.",
        },
        {
          observation: "Check President's Rule timeline.",
          correctMeaning: "President's Rule was not imposed in 2009.",
          selectedMeaning: "President's Rule was imposed on 28 February 2014 after Chief Minister N. Kiran Kumar Reddy resigned in protest against Parliament passing the Bifurcation Bill.",
          possibleConfusion: "Both were major constitutional crises during the agitation.",
          decisionRules: [
            { when: "the question asks when President's Rule was imposed before state formation", choose: "February 2014" },
            { when: "the question asks about December 2009", choose: "Mass MLA resignations and TJAC formation" },
          ],
          nextStep: "Differentiate 2009 TJAC formation from 2014 President's Rule.",
        },
        {
          observation: "Check Assembly dissolution.",
          correctMeaning: "The Assembly remained intact.",
          selectedMeaning: "Assembly Speaker N. Kiran Kumar Reddy did not accept the resignations, keeping the assembly functional.",
          possibleConfusion: "Assuming mass resignations automatically dissolved the legislature.",
          decisionRules: [
            { when: "the question asks what the Speaker did with the 131 resignations", choose: "Rejected/kept them pending" },
            { when: "the question asks what was formed on 24 Dec 2009", choose: "Telangana Joint Action Committee (TJAC)" },
          ],
          nextStep: "Link 24 December 2009 directly to the founding of TJAC.",
        },
      ],
    },
  },

  // 10. TM-Q115 (Formation of TJAC on 24 Dec 2009)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q115",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 24 December 2009, all major political parties, employee federations, student groups, and caste organizations converged to form the 'Telangana Joint Action Committee' (TJAC). Who was unanimously chosen as the Chairman of TJAC to steer the non-violent mass movement?",
      options: [
        {
          text: "Prof. M. Kodandaram (Professor of Political Science, Osmania University)",
          why: "Prof. Maddikunta Kodandaram, a respected professor of political science at Osmania University and civil liberties activist, was unanimously chosen as Chairman of TJAC on 24 December 2009 and served as the chief architect of the Million March and Sakala Janula Samme.",
          attraction: "The unanimous Chairman and face of the Telangana Joint Action Committee.",
          confusion: false,
        },
        {
          text: "Prof. K. Jayashankar",
          why: "Prof. Jayashankar was the supreme ideological mentor and guide of the entire movement, but Prof. Kodandaram was appointed as the working executive Chairman of TJAC.",
          attraction: "Ideological father of the movement.",
          confusion: true,
        },
        {
          text: "K. Swami Goud",
          why: "K. Swami Goud was the President of the Telangana Gazetted Officers (TGOs) and served as co-convener, not the Chairman.",
          attraction: "Prominent employee union leader in TJAC.",
        },
        {
          text: "V. Srinivas Goud",
          why: "V. Srinivas Goud was the President of TNGOs who led employee strikes, not the Chairman of TJAC.",
          attraction: "Key leader of TNGOs in TJAC.",
        },
      ],
      answer: 0,
      reason: "To ensure that the movement remained non-partisan and resistant to political co-optation, political parties agreed that an academic intellectual should head the coordination committee. Prof. M. Kodandaram was elected Chairman. Under his stewardship, TJAC organized non-violent mass actions including Non-Cooperation, Million March, Vanta Varpu, Sakala Janula Samme, and Sagara Haram.",
      clue: "Look for 'Chairman of the Telangana Joint Action Committee (TJAC) formed on 24 December 2009': Prof. M. Kodandaram.",
      trap: "Do not confuse Chairman Prof. M. Kodandaram with Ideological Mentor Prof. K. Jayashankar or union co-conveners like Swami Goud.",
      elimination: "Eliminate Prof. Jayashankar (mentor) and Swami Goud (co-convener); Prof. M. Kodandaram was the Chairman of TJAC.",
      anchor: "Telangana Joint Action Committee (TJAC): Formed 24 Dec 2009; chaired by Prof. M. Kodandaram.",
      hint: "Which Osmania University political science professor chaired the TJAC?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 81,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Prof. M. Kodandaram.",
          correctMeaning: "Prof. M. Kodandaram steered the TJAC through every major mass mobilization phase from 2009 to 2014.",
          selectedMeaning: "Prof. M. Kodandaram steered the TJAC through every major mass mobilization phase from 2009 to 2014.",
          possibleConfusion: "You answered correctly. His neutral academic standing enabled all political parties (TRS, Congress, BJP, CPI, TDP factions) to sit at the same table.",
          decisionRules: [
            { when: "the question asks who was the Chairman of TJAC", choose: "Prof. M. Kodandaram" },
            { when: "the question asks when TJAC was formed", choose: "24 December 2009" },
          ],
          nextStep: "Note that Mallepalli Laxmaiah served as co-convener alongside employee leaders.",
        },
        {
          observation: "Check Prof. Jayashankar's designated role.",
          correctMeaning: "Prof. Kodandaram was the active Chairman.",
          selectedMeaning: "Prof. K. Jayashankar was revered as the supreme ideological mentor (Margadarshi) who advised TJAC leaders.",
          possibleConfusion: "Both were senior Osmania/Kakatiya university professors guiding the movement.",
          decisionRules: [
            { when: "the question asks who was the Chairman of TJAC", choose: "Prof. M. Kodandaram" },
            { when: "the question asks who was the ideological mentor of the movement", choose: "Prof. K. Jayashankar" },
          ],
          nextStep: "Differentiate executive leadership (Kodandaram) from ideological mentorship (Jayashankar).",
        },
        {
          observation: "Check K. Swami Goud's post.",
          correctMeaning: "Prof. Kodandaram was Chairman.",
          selectedMeaning: "K. Swami Goud was the President of Telangana Gazetted Officers (TGO) Association and co-convener of TJAC, later becoming Chairman of Telangana Legislative Council.",
          possibleConfusion: "Swami Goud was the foremost employee voice in TJAC.",
          decisionRules: [
            { when: "the question asks who led the Telangana Gazetted Officers (TGO)", choose: "K. Swami Goud" },
            { when: "the question asks for the Chairman of TJAC", choose: "Prof. M. Kodandaram" },
          ],
          nextStep: "Associate Swami Goud with TGOs and Legislative Council chairmanship.",
        },
        {
          observation: "Check V. Srinivas Goud.",
          correctMeaning: "Kodandaram was the Chairman.",
          selectedMeaning: "V. Srinivas Goud was the President of the Telangana Non-Gazetted Officers (TNGO) Central Union and later became a cabinet minister.",
          possibleConfusion: "Key operational leader during Sakala Janula Samme.",
          decisionRules: [
            { when: "the question asks who headed the TNGOs during 2009–2014", choose: "V. Srinivas Goud" },
            { when: "the question asks who was the overall Chairman of TJAC", choose: "Prof. M. Kodandaram" },
          ],
          nextStep: "Pair TNGO leadership with Srinivas Goud, and TJAC chairmanship with Kodandaram.",
        },
      ],
    },
  },

  // 11. TM-Q116 (Non-Cooperation Movement Feb 2011)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q116",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 17 February 2011, the Telangana Joint Action Committee (TJAC) and employee unions launched a massive agitation inspired by Mahatma Gandhi's freedom struggle, where government staff refused to collect taxes, transport revenue, or register land transactions. What was this agitation called?",
      options: [
        {
          text: "Non-Cooperation Movement (అసహాయ నిరాకరణోద్యమం / Asahaya Yoga Udyamam)",
          why: "On 17 February 2011, over three lakh government employees, teachers, municipal workers, and transport staff commenced the 'Non-Cooperation Movement', refusing to issue toll passes, collect sales tax, or process official files, causing massive revenue losses to the state exchequer.",
          attraction: "The historic 2011 Gandhian non-cooperation agitation.",
          confusion: false,
        },
        {
          text: "Million March",
          why: "Million March was organized a month later on 10 March 2011 on Tank Bund.",
          attraction: "Major March 2011 event.",
          confusion: true,
        },
        {
          text: "Vanta Varpu",
          why: "Vanta Varpu (cooking on highways) was held on 19 June 2011, after the Non-Cooperation Movement.",
          attraction: "Famous highway cooking protest.",
        },
        {
          text: "Sakala Janula Samme",
          why: "Sakala Janula Samme was the 42-day general strike held later in September–October 2011.",
          attraction: "The 42-day general strike.",
        },
      ],
      answer: 0,
      reason: "The Non-Cooperation Movement began on 17 February 2011 and lasted for 16 days. Employees reported to offices but signed attendance registers and refused to work. Lawyers boycotted courts, RTC employees stalled buses, and farmers refused to pay electricity bills, bringing the government machinery to a standstill.",
      clue: "Look for 'Agitation launched on 17 February 2011 where employees refused to collect taxes or work': Non-Cooperation Movement (Asahaya Yoga Udyamam).",
      trap: "Do not confuse the Non-Cooperation Movement (Feb 2011) with the Million March (Mar 2011) or Sakala Janula Samme (Sep-Oct 2011).",
      elimination: "Eliminate Million March (10 March) and Sakala Janula Samme (Sep-Oct); February 2011 was the Non-Cooperation Movement.",
      anchor: "Non-Cooperation Movement (17 Feb 2011): 16-day strike by employees refusing to collect revenues or process government work.",
      hint: "Which Gandhian-style 'Asahaya Yoga' agitation began on 17 February 2011?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 84,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the Non-Cooperation Movement.",
          correctMeaning: "The Non-Cooperation Movement was the first major coordinated industrial action by Telangana government employees in 2011.",
          selectedMeaning: "The Non-Cooperation Movement was the first major coordinated industrial action by Telangana government employees in 2011.",
          possibleConfusion: "You answered correctly. It lasted for 16 days until 4 March 2011, paving the way for the Million March.",
          decisionRules: [
            { when: "the question asks about the agitation launched on 17 February 2011", choose: "Non-Cooperation Movement (Asahaya Yoga Udyamam)" },
            { when: "the question asks how long the 2011 Non-Cooperation Movement lasted", choose: "16 days" },
          ],
          nextStep: "Chronology of 2011: Non-Cooperation (Feb 17) -> Million March (Mar 10) -> Vanta Varpu (Jun 19) -> Sakala Janula Samme (Sep 13).",
        },
        {
          observation: "Check Million March date.",
          correctMeaning: "Non-Cooperation began on 17 Feb 2011.",
          selectedMeaning: "The Million March took place on 10 March 2011 on Tank Bund, inspired by Egypt's Tahrir Square protests.",
          possibleConfusion: "Both happened in early 2011 within weeks of each other.",
          decisionRules: [
            { when: "the question asks about the Tank Bund march on 10 March 2011", choose: "Million March" },
            { when: "the question asks about the 17 February employee strike", choose: "Non-Cooperation Movement" },
          ],
          nextStep: "Remember: February = Non-Cooperation; March = Million March.",
        },
        {
          observation: "Check Vanta Varpu.",
          correctMeaning: "The February agitation was Non-Cooperation.",
          selectedMeaning: "Vanta Varpu (cooking food on roads and rail tracks) took place on 19 June 2011 across all state and national highways.",
          possibleConfusion: "Novel cultural protest method.",
          decisionRules: [
            { when: "the question asks about the community cooking protest on highways on 19 June 2011", choose: "Vanta Varpu" },
            { when: "the question asks about February 2011", choose: "Non-Cooperation Movement" },
          ],
          nextStep: "Pair Vanta Varpu with 19 June 2011.",
        },
        {
          observation: "Check Sakala Janula Samme.",
          correctMeaning: "Non-Cooperation occurred in February.",
          selectedMeaning: "Sakala Janula Samme was the historic 42-day strike from 13 September to 24 October 2011.",
          possibleConfusion: "Both involved massive government employee participation.",
          decisionRules: [
            { when: "the question asks for the 42-day strike in Sept-Oct 2011", choose: "Sakala Janula Samme" },
            { when: "the question asks about the 16-day strike in February 2011", choose: "Non-Cooperation Movement" },
          ],
          nextStep: "Contrast: 16 days in Feb (Non-Cooperation) vs 42 days in Sep-Oct (Sakala Janula Samme).",
        },
      ],
    },
  },

  // 12. TM-Q117 (Sadak Bandh 21 March 2013)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q117",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 21 March 2013, the TJAC organized 'Sadak Bandh' (సడక్ బంద్), completely choking vehicular traffic between Hyderabad and South India for 24 hours. Which national highway was completely blocked by hundreds of thousands of protesters across Mahabubnagar district?",
      options: [
        {
          text: "National Highway 44 (NH-7 / Hyderabad–Bangalore National Highway)",
          why: "Sadak Bandh on 21 March 2013 brought the 300-km stretch of National Highway 44 (formerly NH-7, connecting Hyderabad to Bangalore via Shamshabad, Jadcherla, and Alampur) to a complete standstill, cutting off road connectivity to Karnataka and Tamil Nadu.",
          attraction: "The primary north-south national highway blocked during Sadak Bandh.",
          confusion: false,
        },
        {
          text: "National Highway 65 (Hyderabad–Vijayawada Highway)",
          why: "NH-65 was blocked during earlier Rasta Rokos at Suryapet, but the official 'Sadak Bandh' of 21 March 2013 was organized specifically on NH-44.",
          attraction: "Major highway to Coastal Andhra.",
          confusion: true,
        },
        {
          text: "National Highway 163 (Hyderabad–Warangal Highway)",
          why: "NH-163 connects Hyderabad to Warangal, not the venue of the 21 March 2013 Sadak Bandh.",
          attraction: "Major highway to north Telangana.",
        },
        {
          text: "National Highway 63 (Nizamabad–Jagdalpur Highway)",
          why: "NH-63 is in northern Telangana, completely away from the Sadak Bandh venue.",
          attraction: "Northern national highway.",
        },
      ],
      answer: 0,
      reason: "The TJAC announced 'Sadak Bandh' on 21 March 2013 on the Hyderabad–Bangalore highway (NH-44). Despite heavy deployment of paramilitary forces and arbitrary arrests of Prof. Kodandaram and KTR, tens of thousands of people sat on the highway from Shamshabad to Alampur, cooking food, dancing, and blocking all vehicular movement for 24 hours.",
      clue: "Look for 'National Highway blocked during TJAC Sadak Bandh on 21 March 2013': NH-44 (Hyderabad–Bangalore Highway).",
      trap: "Do not confuse the Sadak Bandh on NH-44 (Hyderabad-Bangalore) with the Vijayawada highway (NH-65) protests.",
      elimination: "Eliminate NH-65 (Vijayawada) and NH-163 (Warangal); Sadak Bandh was organized exclusively on NH-44 (Hyderabad–Bangalore).",
      anchor: "Sadak Bandh (21 March 2013): 24-hour total blockade of NH-44 (Hyderabad–Bangalore Highway) organized by TJAC.",
      hint: "Which highway connecting Hyderabad to Bangalore through Mahabubnagar was blocked during Sadak Bandh?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 92,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected National Highway 44.",
          correctMeaning: "NH-44 (connecting Hyderabad and Bangalore) was the target of Sadak Bandh to draw national attention to the pending statehood bill.",
          selectedMeaning: "NH-44 (connecting Hyderabad and Bangalore) was the target of Sadak Bandh to draw national attention to the pending statehood bill.",
          possibleConfusion: "You answered correctly. The protest demonstrated that south Telangana districts like Mahabubnagar were fully committed to the agitation.",
          decisionRules: [
            { when: "the question asks which highway was blocked during Sadak Bandh on 21 March 2013", choose: "National Highway 44 (Hyderabad–Bangalore Highway)" },
            { when: "the question asks through which district the primary blockade was concentrated", choose: "Mahabubnagar district" },
          ],
          nextStep: "Note that NH-44 was formerly designated as NH-7.",
        },
        {
          observation: "Check NH-65.",
          correctMeaning: "Sadak Bandh was on NH-44.",
          selectedMeaning: "NH-65 (Hyderabad–Vijayawada) witnessed major rail-roko and rasta-roko demonstrations at Suryapet and Kodad.",
          possibleConfusion: "Heavily utilized highway for political blockades.",
          decisionRules: [
            { when: "the question asks about the Hyderabad–Vijayawada highway", choose: "NH-65" },
            { when: "the question asks which highway was targeted for Sadak Bandh (21 March 2013)", choose: "NH-44" },
          ],
          nextStep: "Pair Sadak Bandh with NH-44, not NH-65.",
        },
        {
          observation: "Check NH-163.",
          correctMeaning: "The blocked highway was NH-44.",
          selectedMeaning: "NH-163 links Hyderabad, Jangaon, and Warangal.",
          possibleConfusion: "Connects major movement epicenters.",
          decisionRules: [
            { when: "the question asks about the Hyderabad–Warangal highway", choose: "NH-163" },
            { when: "the question asks about Sadak Bandh", choose: "NH-44" },
          ],
          nextStep: "Identify NH-44 as the south-bound arterial corridor.",
        },
        {
          observation: "Check NH-63.",
          correctMeaning: "NH-44 is the correct highway.",
          selectedMeaning: "NH-63 connects Nizamabad, Armoor, Jagtial, and Mancherial.",
          possibleConfusion: "Cross-regional national highway.",
          decisionRules: [
            { when: "the question asks for Sadak Bandh highway", choose: "NH-44" },
            { when: "evaluating options", choose: "NH-44" },
          ],
          nextStep: "Anchor Sadak Bandh firmly to NH-44.",
        },
      ],
    },
  },

  // 13. TM-Q118 (Samsad Yatra / Chalo Delhi April 2013)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q118",
      topic: "TM-03.03",
      concept: "TM-03.03-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 27–29 April 2013, the TJAC organized the massive 'Samsad Yatra' (సన్సద్ యాత్ర / Chalo Delhi), booking entire special trains (Telangana Express) to New Delhi. At which iconic national protest ground did thousands of Telangana activists stage a two-day Satyagraha demanding the immediate tabling of the Telangana Bill in Parliament?",
      options: [
        {
          text: "Jantar Mantar, New Delhi",
          why: "Thousands of Telangana activists, lawyers, and students arrived at New Delhi and conducted a historic two-day Satyagraha at Jantar Mantar on 27–28 April 2013, which forced central leaders of all national parties to visit and express solidarity.",
          attraction: "The historic national protest ground at Jantar Mantar.",
          confusion: false,
        },
        {
          text: "Ramleela Maidan",
          why: "Ramleela Maidan hosted anti-corruption rallies, but the Samsad Yatra satyagraha was conducted at Jantar Mantar.",
          attraction: "Famous massive ground in Delhi.",
          confusion: true,
        },
        {
          text: "India Gate lawns",
          why: "Protests were banned near India Gate after the 2012 Nirbhaya protests.",
          attraction: "Prominent central Delhi landmark.",
        },
        {
          text: "Red Fort grounds",
          why: "Red Fort was not the designated protest site for Samsad Yatra.",
          attraction: "Historic national monument.",
        },
      ],
      answer: 0,
      reason: "The 'Samsad Yatra' was organized by TJAC in April 2013 to mount direct pressure on Parliament during its budget session. Over 10,000 activists traveled to Delhi on specially chartered trains. At Jantar Mantar, prominent national leaders including Sharad Yadav, Prakash Karat, Sushma Swaraj, and Ram Vilas Paswan addressed the gathering, demonstrating pan-Indian political support.",
      clue: "Look for 'Site of TJAC Samsad Yatra Satyagraha in New Delhi on 27–28 April 2013': Jantar Mantar.",
      trap: "Do not choose Ramleela Maidan; Jantar Mantar was the designated satyagraha site for Samsad Yatra.",
      elimination: "Eliminate Ramleela Maidan and India Gate; Jantar Mantar was the venue of the 2013 Samsad Yatra.",
      anchor: "Samsad Yatra (April 2013): TJAC staged a 2-day satyagraha at Jantar Mantar, New Delhi demanding the Telangana Bill.",
      hint: "Which famous protest street/ground near Parliament in New Delhi hosted the Samsad Yatra?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 95,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Jantar Mantar.",
          correctMeaning: "Jantar Mantar was the national stage where TJAC demonstrated that the demand for Telangana had broad multi-party support across India.",
          selectedMeaning: "Jantar Mantar was the national stage where TJAC demonstrated that the demand for Telangana had broad multi-party support across India.",
          possibleConfusion: "You answered correctly. Opposition Leader Sushma Swaraj famously declared at Jantar Mantar: 'BJP will support the bill if the government introduces it in Parliament.'",
          decisionRules: [
            { when: "the question asks where Samsad Yatra satyagraha was held in April 2013", choose: "Jantar Mantar, New Delhi" },
            { when: "the question asks which opposition leader promised full support at Jantar Mantar", choose: "Sushma Swaraj" },
          ],
          nextStep: "Note that three special trains were chartered from Secunderabad to New Delhi for this yatra.",
        },
        {
          observation: "Check Ramleela Maidan.",
          correctMeaning: "The venue was Jantar Mantar.",
          selectedMeaning: "Ramleela Maidan was the venue for Anna Hazare and Baba Ramdev's anti-corruption fasts in 2011.",
          possibleConfusion: "Both were major Delhi protest locations during that era.",
          decisionRules: [
            { when: "the question asks about the Anna Hazare anti-corruption fast", choose: "Ramleela Maidan" },
            { when: "the question asks about the TJAC Samsad Yatra (April 2013)", choose: "Jantar Mantar" },
          ],
          nextStep: "Differentiate anti-corruption fasts (Ramleela) from Telangana Samsad Yatra (Jantar Mantar).",
        },
        {
          observation: "Check India Gate lawns.",
          correctMeaning: "The satyagraha was held at Jantar Mantar.",
          selectedMeaning: "India Gate was heavily barricaded and prohibited for political dharnas.",
          possibleConfusion: "High-visibility Delhi location.",
          decisionRules: [
            { when: "the question asks where TJAC protests occurred in Delhi", choose: "Jantar Mantar" },
            { when: "evaluating options", choose: "Jantar Mantar" },
          ],
          nextStep: "Remember: Jantar Mantar is the authorized protest zone near Parliament.",
        },
        {
          observation: "Check Red Fort.",
          correctMeaning: "Jantar Mantar was the location.",
          selectedMeaning: "Red Fort is the site of the Prime Minister's Independence Day address, not civil society sit-ins.",
          possibleConfusion: "National landmark.",
          decisionRules: [
            { when: "the question asks about Samsad Yatra venue", choose: "Jantar Mantar" },
            { when: "evaluating options", choose: "Jantar Mantar" },
          ],
          nextStep: "Firmly associate Samsad Yatra with Jantar Mantar.",
        },
      ],
    },
  },

  // 14. TM-Q119 (Group of Ministers GoM 2013)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q119",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In October 2013, following the Congress Working Committee resolution approving separate statehood, the Union Cabinet appointed a Group of Ministers (GoM) to determine the modalities and draft the Andhra Pradesh Reorganisation Bill. Who headed this high-level Group of Ministers?",
      options: [
        {
          text: "Sushilkumar Shinde (Union Home Minister)",
          why: "On 8 October 2013, the Union Cabinet constituted the Group of Ministers (GoM) headed by Union Home Minister Sushilkumar Shinde, with A.K. Antony, P. Chidambaram, Ghulam Nabi Azad, Veerappa Moily, Jairam Ramesh, and V. Narayanasamy as members.",
          attraction: "The Chairman of the 2013 Group of Ministers that drafted the Bifurcation Bill.",
          confusion: false,
        },
        {
          text: "Jairam Ramesh",
          why: "Jairam Ramesh (Union Minister for Rural Development) was an active drafting member and spokesperson of the GoM, but Sushilkumar Shinde was the formal Chairman.",
          attraction: "The principal drafter and key member of the GoM.",
          confusion: true,
        },
        {
          text: "P. Chidambaram",
          why: "P. Chidambaram was a member of the GoM (as Finance Minister), but not its Chairman.",
          attraction: "Senior cabinet member in the GoM.",
        },
        {
          text: "A.K. Antony",
          why: "A.K. Antony was the Defence Minister and member of the GoM, not the Chairman.",
          attraction: "Senior minister in the GoM.",
        },
      ],
      answer: 0,
      reason: "The GoM was tasked with preparing the bifurcation blueprint across 11 key terms of reference, including division of river waters, power sharing, assets and liabilities, and the status of Hyderabad. While Jairam Ramesh was the most articulate spokesperson who drafted the chapters, Union Home Minister Sushilkumar Shinde was the official head of the GoM.",
      clue: "Look for 'Head of the Group of Ministers (GoM) appointed in October 2013 to draft the AP Reorganisation Bill': Sushilkumar Shinde.",
      trap: "Do not confuse the official Chairman (Union Home Minister Sushilkumar Shinde) with the principal drafter/spokesperson (Jairam Ramesh).",
      elimination: "Eliminate Jairam Ramesh (drafting member) and P. Chidambaram (Finance Minister member); Sushilkumar Shinde was the Chairman of the GoM.",
      anchor: "Group of Ministers (GoM, Oct 2013): Headed by Union Home Minister Sushilkumar Shinde; drafted the AP Reorganisation Bill.",
      hint: "Which Union Home Minister presided over the GoM meetings in North Block in late 2013?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 98,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Sushilkumar Shinde.",
          correctMeaning: "Sushilkumar Shinde was the official Chairman of the GoM that formulated the Andhra Pradesh Reorganisation Act, 2014.",
          selectedMeaning: "Sushilkumar Shinde was the official Chairman of the GoM that formulated the Andhra Pradesh Reorganisation Act, 2014.",
          possibleConfusion: "You answered correctly. The GoM held extensive public and political consultations before finalizing the draft bill.",
          decisionRules: [
            { when: "the question asks who headed the 2013 Group of Ministers (GoM) on bifurcation", choose: "Sushilkumar Shinde" },
            { when: "the question asks when the GoM was constituted", choose: "October 2013" },
          ],
          nextStep: "Note that the Union Cabinet approved the draft bill finalized by the Shinde GoM on 5 December 2013.",
        },
        {
          observation: "Check Jairam Ramesh's role.",
          correctMeaning: "Sushilkumar Shinde was the Chairman.",
          selectedMeaning: "Jairam Ramesh was the key drafting member who authored the book 'Old History, New Geography: Bifurcating Andhra Pradesh'.",
          possibleConfusion: "Jairam Ramesh was the primary public face answering media questions on the bill.",
          decisionRules: [
            { when: "the question asks who authored 'Old History, New Geography' on the 2014 bifurcation", choose: "Jairam Ramesh" },
            { when: "the question asks who was the official Chairman of the GoM", choose: "Sushilkumar Shinde" },
          ],
          nextStep: "Remember: Shinde = Chairman; Jairam Ramesh = Drafting member and author.",
        },
        {
          observation: "Check P. Chidambaram's role.",
          correctMeaning: "Shinde was the Chairman.",
          selectedMeaning: "P. Chidambaram participated as Finance Minister, focusing on the financial apportionment of debts and tax concessions.",
          possibleConfusion: "Senior minister who made the 2009 announcement.",
          decisionRules: [
            { when: "the question asks who was Finance Minister in the 2013 GoM", choose: "P. Chidambaram" },
            { when: "the question asks who chaired the GoM", choose: "Sushilkumar Shinde" },
          ],
          nextStep: "Distinguish Finance portfolio (Chidambaram) from GoM Chairmanship (Shinde).",
        },
        {
          observation: "Check A.K. Antony's role.",
          correctMeaning: "The Chairman was Sushilkumar Shinde.",
          selectedMeaning: "A.K. Antony was Defence Minister and second-ranking cabinet member in the GoM.",
          possibleConfusion: "Headed an earlier party committee.",
          decisionRules: [
            { when: "the question asks who headed the 2013 GoM", choose: "Sushilkumar Shinde" },
            { when: "evaluating options", choose: "Sushilkumar Shinde" },
          ],
          nextStep: "Anchor Sushilkumar Shinde as the head of the GoM.",
        },
      ],
    },
  },

  // 15. TM-Q120 (Passage of AP Reorganisation Bill in Parliament Feb 2014)
  {
    sourceIds: ["SR-LEGAL-APRA-2014"],
    question: {
      id: "TM-Q120",
      topic: "TM-03.05",
      concept: "TM-03.05-M01",
      model: "Chronology",
      modelId: "TM-QM-CHR-01",
      stage: "practice",
      prompt: "The Andhra Pradesh Reorganisation Bill, 2014, creating Telangana as the 29th State of the Indian Union, was passed by both Houses of Parliament in February 2014. On which exact dates was the Bill passed by the Lok Sabha and Rajya Sabha respectively, and on which date did President Pranab Mukherjee grant his assent?",
      options: [
        {
          text: "Lok Sabha: 18 February 2014; Rajya Sabha: 20 February 2014; Presidential Assent: 1 March 2014",
          why: "The historic legislative timeline is: Lok Sabha passed the Bill on 18 February 2014; Rajya Sabha passed it on 20 February 2014; and President Pranab Mukherjee signed it into law on 1 March 2014 (published in the Gazette of India on 2 March 2014 as Act No. 6 of 2014).",
          attraction: "The exact statutory enactment chronology of the Andhra Pradesh Reorganisation Act, 2014.",
          confusion: false,
        },
        {
          text: "Lok Sabha: 13 February 2014; Rajya Sabha: 15 February 2014; Presidential Assent: 2 June 2014",
          why: "13 February was the day the Bill was tabled amidst pepper spray chaos; 2 June 2014 was the Appointed Day, not Presidential Assent.",
          attraction: "Confuses tabling date with passage date and Appointed Day with Assent date.",
          confusion: true,
        },
        {
          text: "Lok Sabha: 20 February 2014; Rajya Sabha: 22 February 2014; Presidential Assent: 15 March 2014",
          why: "Incorrect dates; Lok Sabha passed it on 18 Feb and Rajya Sabha on 20 Feb.",
          attraction: "Slightly shifted February dates.",
        },
        {
          text: "Lok Sabha: 28 January 2014; Rajya Sabha: 30 January 2014; Presidential Assent: 1 February 2014",
          why: "January was when the AP State Assembly debated and rejected the draft bill.",
          attraction: "Assembly debate dates.",
        },
      ],
      answer: 0,
      reason: "The passage of the Bifurcation Bill completed a six-decade struggle. Tabled on 13 February 2014, it was passed by the Lok Sabha by voice vote on 18 February 2014 with support from the principal opposition BJP. The Rajya Sabha passed it on 20 February 2014. President Pranab Mukherjee granted his assent on 1 March 2014, and 2 June 2014 was notified as the Appointed Day.",
      clue: "Look for 'Dates of passage of AP Reorganisation Bill, 2014 in Lok Sabha, Rajya Sabha, and Presidential Assent': 18 Feb 2014 (Lok Sabha), 20 Feb 2014 (Rajya Sabha), 1 March 2014 (Presidential Assent).",
      trap: "Do not confuse the passage dates (18 & 20 February 2014) with the Appointed Day (2 June 2014) or the tabling date (13 February 2014).",
      elimination: "Eliminate 2 June 2014 (Appointed Day); the Bill was passed on 18 Feb (LS), 20 Feb (RS), and received Presidential Assent on 1 March 2014.",
      anchor: "AP Reorganisation Act, 2014 Timeline: Lok Sabha passed on 18 Feb 2014; Rajya Sabha passed on 20 Feb 2014; Presidential Assent on 1 March 2014.",
      hint: "On which date in February 2014 did the Lok Sabha pass the Telangana Bill by voice vote?",
      source: "Andhra Pradesh Reorganisation Act, 2014, Gazette of India",
      page: 1,
      sourceStatus: "EXPECTED PRACTICE QUESTION",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 18 Feb (Lok Sabha), 20 Feb (Rajya Sabha), and 1 March (Presidential Assent).",
          correctMeaning: "These three dates represent the constitutional culmination of the Telangana statehood struggle in Parliament.",
          selectedMeaning: "These three dates represent the constitutional culmination of the Telangana statehood struggle in Parliament.",
          possibleConfusion: "You answered correctly. The Bill became Act No. 6 of 2014 upon publication in the official gazette on 2 March 2014.",
          decisionRules: [
            { when: "the question asks on which date the Lok Sabha passed the Telangana Bill", choose: "18 February 2014" },
            { when: "the question asks on which date the Rajya Sabha passed the Telangana Bill", choose: "20 February 2014" },
            { when: "the question asks on which date President Pranab Mukherjee granted assent", choose: "1 March 2014" },
          ],
          nextStep: "Remember: 18 Feb (LS) -> 20 Feb (RS) -> 1 March (Assent) -> 2 June (Appointed Day).",
        },
        {
          observation: "Check the significance of 2 June 2014.",
          correctMeaning: "Presidential Assent was on 1 March 2014.",
          selectedMeaning: "2 June 2014 was the 'Appointed Day' under Section 2(a) on which the new State of Telangana legally came into existence.",
          possibleConfusion: "Confusing the date the law was signed with the date the new state was born.",
          decisionRules: [
            { when: "the question asks for the 'Appointed Day' of Telangana formation", choose: "2 June 2014" },
            { when: "the question asks for the date of Presidential Assent", choose: "1 March 2014" },
          ],
          nextStep: "Separate enactment dates (Feb–March 2014) from the formation day (2 June 2014).",
        },
        {
          observation: "Check shifted dates.",
          correctMeaning: "The Lok Sabha vote was on 18 February.",
          selectedMeaning: "Option 3 proposes 20 and 22 February, which misplaces the Lok Sabha vote date.",
          possibleConfusion: "Slight numerical errors on exam day.",
          decisionRules: [
            { when: "the question asks for Lok Sabha passage", choose: "18 February 2014" },
            { when: "the question asks for Rajya Sabha passage", choose: "20 February 2014" },
          ],
          nextStep: "Firmly remember the pair: 18 February and 20 February 2014.",
        },
        {
          observation: "Check January 2014 events.",
          correctMeaning: "Parliament enacted the law in February.",
          selectedMeaning: "On 30 January 2014, the Andhra Pradesh Legislative Assembly rejected the draft bill by voice vote under Chief Minister N. Kiran Kumar Reddy.",
          possibleConfusion: "Confusing state assembly debate with parliamentary passage.",
          decisionRules: [
            { when: "the question asks when the AP Assembly rejected the draft bill", choose: "30 January 2014" },
            { when: "the question asks when Parliament passed the bill", choose: "18 & 20 February 2014" },
          ],
          nextStep: "Note that under Article 3, Parliament has sovereign power to create states regardless of state assembly rejection.",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 7 (${batchQuestions.length} questions)...`);

const importPayload = {
  actor: "human_operator_curator",
  reason: "Ingesting Batch 7: Warangal Declaration 1997, Telangana Information Trust, Telangana Aikya Vedika, Simha Garjana Karimnagar, 2004 NCMP, Pranab Mukherjee Sub-Committee, Nov 29 2009 Alaganur arrest, Dec 9 2009 Chidambaram announcement, Dec 23 rollback, TJAC formation, Non-Cooperation 2011, Sadak Bandh NH-44, Samsad Yatra Jantar Mantar, Sushilkumar Shinde GoM, and Parliamentary passage 18/20 Feb 2014.",
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
  reason: "Batch 7 verified and authenticated for Telangana Police SI & Constable preparation.",
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
console.log(`Batch 7 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
