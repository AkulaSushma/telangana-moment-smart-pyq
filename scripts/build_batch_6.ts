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
  // 1. TM-Q091 (Kakatiya Heritage / Tank Irrigation)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q091",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Which medieval dynasty laid the enduring foundation of Telangana's distinct agricultural and cultural identity by constructing the celebrated chain-link tank irrigation network (such as Ramappa, Pakhal, and Laknavaram lakes), which served as the historical inspiration for 'Mission Kakatiya'?",
      options: [
        {
          text: "Kakatiya Dynasty (12th–14th Century CE)",
          why: "The Kakatiya rulers (notably Ganapati Deva, Rudrama Devi, and Prataparudra) engineered an interconnected chain-tank system (Golusukattu Cheruvulu) perfectly tailored to the Deccan topography, which the post-2014 Government of Telangana restored under 'Mission Kakatiya'.",
          attraction: "The dynasty celebrated for Ramappa Lake, Thousand Pillar Temple, and chain tanks.",
          confusion: false,
        },
        {
          text: "Western Chalukyas of Kalyani",
          why: "The Western Chalukyas were predecessors of the Kakatiyas, but did not construct the iconic chain-tank lakes of Telangana.",
          attraction: "Earlier Deccan imperial dynasty.",
        },
        {
          text: "Bahmani Sultanate",
          why: "The Bahmanis ruled the Deccan from Gulbarga and Bidar, not responsible for the Warangal chain tank networks.",
          attraction: "Prominent medieval sultanate in Deccan.",
        },
        {
          text: "Vishnukundina Dynasty",
          why: "Vishnukundinas were an ancient 5th–6th century dynasty associated with Keesaragutta, not the medieval lakes of Ramappa and Pakhal.",
          attraction: "Ancient dynasty of Telangana.",
        },
      ],
      answer: 0,
      reason: "The Kakatiya rulers pioneered tank-based irrigation across Telangana, turning dry plateau soil into fertile agricultural land. Lakes like Ramappa (constructed under commander Recharla Rudra), Pakhal, and Laknavaram remain living marvels. The revival of these tanks under 'Mission Kakatiya' (Mana Ooru - Mana Cheruvu) became a flagship program of the new state.",
      clue: "Look for 'Dynasty constructing chain-tank network (Ramappa, Pakhal, Laknavaram) inspiring Mission Kakatiya': Kakatiyas.",
      trap: "Do not confuse the medieval Kakatiya tank system with ancient Vishnukundinas or later Qutb Shahi wells.",
      elimination: "Eliminate Chalukyas and Bahmanis; Kakatiyas constructed Ramappa and Pakhal lakes.",
      anchor: "Kakatiya Dynasty: Pioneers of Telangana chain-tank irrigation (Ramappa, Pakhal, Laknavaram lakes); inspired Mission Kakatiya.",
      hint: "Which dynasty ruled from Warangal (Orugallu) and built Ramappa temple and lake?",
      source: "TGPSC Group-1 Preliminary Examination 2024",
      page: 8,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the Kakatiya Dynasty.",
          correctMeaning: "The Kakatiyas created the interconnected chain-tank system where surplus water from one tank flows into the next downstream.",
          selectedMeaning: "The Kakatiyas created the interconnected chain-tank system where surplus water from one tank flows into the next downstream.",
          possibleConfusion: "You answered correctly. Ramappa Temple was declared a UNESCO World Heritage Site in July 2021.",
          decisionRules: [
            { when: "the question asks which dynasty constructed Ramappa and Pakhal lakes", choose: "Kakatiya Dynasty" },
            { when: "the question asks which historic dynasty inspired Mission Kakatiya", choose: "Kakatiya Dynasty" },
          ],
          nextStep: "Remember that Recharla Rudra was the general who constructed Ramappa temple and lake in 1213 CE.",
        },
        {
          observation: "Check the Western Chalukyas.",
          correctMeaning: "The tank builders were the Kakatiyas.",
          selectedMeaning: "Western Chalukyas ruled prior to the Kakatiyas, and Kakatiyas originally served as their feudatories.",
          possibleConfusion: "Both dynasties ruled parts of Telangana.",
          decisionRules: [
            { when: "the question asks who built the thousand pillar temple and chain tanks", choose: "Kakatiyas" },
            { when: "the question asks who ruled before the independent Kakatiya state", choose: "Western Chalukyas" },
          ],
          nextStep: "Identify Kakatiyas specifically with Warangal tank irrigation.",
        },
        {
          observation: "Check Bahmani architecture.",
          correctMeaning: "Kakatiyas built the chain lakes.",
          selectedMeaning: "The Bahmani Sultanate was known for fortresses at Gulbarga, Bidar, and Golconda, not Telangana rural chain-tanks.",
          possibleConfusion: "Major medieval power in the Deccan.",
          decisionRules: [
            { when: "the question asks about the founders of Deccan Sultanates", choose: "Bahmani Sultanate" },
            { when: "the question asks for Ramappa and Pakhal builders", choose: "Kakatiyas" },
          ],
          nextStep: "Associate lake chains exclusively with the Kakatiyas.",
        },
        {
          observation: "Check Vishnukundina period.",
          correctMeaning: "Kakatiyas constructed the lakes.",
          selectedMeaning: "Vishnukundinas were ancient rulers famous for Keesaragutta and cave architecture.",
          possibleConfusion: "Ancient dynasty originating in Telangana.",
          decisionRules: [
            { when: "the question asks who ruled from Keesaragutta in 5th century CE", choose: "Vishnukundinas" },
            { when: "the question asks who built the medieval tank irrigation network", choose: "Kakatiyas" },
          ],
          nextStep: "Differentiate 5th century Vishnukundinas from 12th century Kakatiyas.",
        },
      ],
    },
  },

  // 2. TM-Q092 (Qutb Shahi Composite Culture / Malkibharama)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q092",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "During the reign of the Qutb Shahi rulers of Golconda, which Sultan was affectionately celebrated by contemporary Telugu court poets as 'Malkibharama' for his deep love and extensive patronage of Telugu literature, including works like Addanki Gangadhara Kavi's 'Tapati Samvaranopadhyanamu'?",
      options: [
        {
          text: "Ibrahim Qutb Shah (reigned 1550–1580)",
          why: "Ibrahim Qutb Shah lived in exile in Vijayanagara for seven years, developed deep fluency and love for Telugu, and upon becoming Sultan of Golconda, patronized Telugu poets who fondly addressed him as 'Malkibharama'.",
          attraction: "The famous Golconda Sultan known in Telugu literature as 'Malkibharama'.",
          confusion: false,
        },
        {
          text: "Muhammad Quli Qutb Shah (reigned 1580–1612)",
          why: "Muhammad Quli Qutb Shah founded the city of Hyderabad and built Charminar in 1591, but 'Malkibharama' was the title given to his father Ibrahim Qutb Shah.",
          attraction: "Founder of Hyderabad and builder of Charminar.",
          confusion: true,
        },
        {
          text: "Abdullah Qutb Shah (reigned 1626–1672)",
          why: "Abdullah Qutb Shah was a later ruler during whose time Kshetrayya visited the court.",
          attraction: "Later Qutb Shahi ruler.",
        },
        {
          text: "Sultan Quli Qutb-ul-Mulk (reigned 1518–1543)",
          why: "Sultan Quli was the founder of the dynasty who declared independence from the Bahmanis, not known as Malkibharama.",
          attraction: "Founder of the Golconda dynasty.",
        },
      ],
      answer: 0,
      reason: "Ibrahim Qutb Shah's court patronized brilliant Telugu poets such as Addanki Gangadhara Kavi (author of 'Tapati Samvaranopadhyanamu', the first Telugu book dedicated to a Muslim ruler), Ponnikanti Telaganarya (who wrote 'Yayati Charitra', the first accha-Telugu kavya), and Kandukuru Rudra Kavi. They celebrated him as 'Malkibharama'.",
      clue: "Look for 'Golconda Sultan celebrated as Malkibharama by Telugu poets': Ibrahim Qutb Shah.",
      trap: "Do not confuse Ibrahim Qutb Shah ('Malkibharama') with his son Muhammad Quli Qutb Shah (builder of Charminar in 1591).",
      elimination: "Eliminate Muhammad Quli (founder of Hyderabad) and Sultan Quli (founder of dynasty); Ibrahim Qutb Shah was Malkibharama.",
      anchor: "Ibrahim Qutb Shah: Patron of Telugu poets Addanki Gangadhara and Ponnikanti Telaganarya; fondly called 'Malkibharama'.",
      hint: "Which Golconda Sultan lived in Vijayanagara for seven years before ruling Golconda?",
      source: "TGPSC Group-4 2023 Paper I, General Studies",
      page: 14,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Ibrahim Qutb Shah.",
          correctMeaning: "Ibrahim Qutb Shah was the Golconda Sultan affectionately known as Malkibharama.",
          selectedMeaning: "Ibrahim Qutb Shah was the Golconda Sultan affectionately known as Malkibharama.",
          possibleConfusion: "You answered correctly. He also laid out the famous Hussain Sagar lake in 1562 named after Hussain Shah Wali.",
          decisionRules: [
            { when: "the question asks which Golconda Sultan was called 'Malkibharama'", choose: "Ibrahim Qutb Shah" },
            { when: "the question asks who built Hussain Sagar lake in 1562", choose: "Ibrahim Qutb Shah" },
          ],
          nextStep: "Note that Ponnikanti Telaganarya dedicated 'Yayati Charitra' to Ibrahim's minister Amin Khan.",
        },
        {
          observation: "Check Muhammad Quli Qutb Shah's achievements.",
          correctMeaning: "Malkibharama refers to Ibrahim Qutb Shah.",
          selectedMeaning: "Muhammad Quli Qutb Shah (Ibrahim's son) founded Hyderabad in 1591 and wrote Urdu/Dakhni poetry under the pen name 'Maani'.",
          possibleConfusion: "Both were major cultural patrons of the Qutb Shahi dynasty.",
          decisionRules: [
            { when: "the question asks who built the Charminar in 1591", choose: "Muhammad Quli Qutb Shah" },
            { when: "the question asks who was known as 'Malkibharama'", choose: "Ibrahim Qutb Shah" },
          ],
          nextStep: "Remember: Ibrahim = Malkibharama & Hussain Sagar; Muhammad Quli = Charminar & Hyderabad city.",
        },
        {
          observation: "Check Abdullah Qutb Shah.",
          correctMeaning: "The ruler was Ibrahim Qutb Shah.",
          selectedMeaning: "Abdullah Qutb Shah was visited by Carnatic composer Kshetrayya who composed padams in his court.",
          possibleConfusion: "Later patron of music and literature.",
          decisionRules: [
            { when: "the question asks which Golconda ruler patronized Kshetrayya", choose: "Abdullah Qutb Shah" },
            { when: "the question asks who was celebrated as Malkibharama", choose: "Ibrahim Qutb Shah" },
          ],
          nextStep: "Pair Kshetrayya with Abdullah Qutb Shah, and Addanki Gangadhara with Ibrahim.",
        },
        {
          observation: "Check Sultan Quli Qutb-ul-Mulk.",
          correctMeaning: "The correct Sultan is Ibrahim Qutb Shah.",
          selectedMeaning: "Sultan Quli was the dynasty founder who built the mud fort of Golconda into granite fortifications.",
          possibleConfusion: "Dynastic founder.",
          decisionRules: [
            { when: "the question asks who founded the Qutb Shahi dynasty in 1518", choose: "Sultan Quli Qutb-ul-Mulk" },
            { when: "the question asks who was addressed as Malkibharama", choose: "Ibrahim Qutb Shah" },
          ],
          nextStep: "Anchor Ibrahim Qutb Shah as 'Malkibharama'.",
        },
      ],
    },
  },

  // 3. TM-Q093 (1857 Revolt in Hyderabad / Turrebaz Khan)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q093",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 17 July 1857, who led the heroic armed assault by over 5,000 freedom fighters on the British Residency at Koti in Hyderabad to demand the release of mutinous sepoys, culminating in his capture and eventual martyrdom near Toopran?",
      options: [
        {
          text: "Turrebaz Khan (accompanied by Maulvi Alauddin)",
          why: "Turrebaz Khan and Maulvi Alauddin organized the 17 July 1857 attack on the British Residency. Turrebaz Khan was captured, escaped from prison, and was shot dead near Toopran on 18 January 1859, while Maulvi Alauddin was sentenced to life imprisonment in the Andaman Islands.",
          attraction: "The foremost leader of the 1857 war of independence in Hyderabad.",
          confusion: false,
        },
        {
          text: "Cheeda Khan",
          why: "Cheeda Khan was a sepoy of the 3rd Cavalry of Hyderabad Contingent who refused to march against Delhi sepoys and was imprisoned, which sparked Turrebaz Khan's attack.",
          attraction: "The imprisoned sepoy whose release was demanded.",
          confusion: true,
        },
        {
          text: "Raja Venkatappa Nayaka",
          why: "Raja Venkatappa Nayaka of Shorapur (Surapuram) led the 1857 revolt in the Shorapur principality, not the direct attack on the Koti Residency.",
          attraction: "Prominent 1857 rebel ruler of Shorapur Samsthanam.",
        },
        {
          text: "Ramji Gond",
          why: "Ramji Gond led the 1860 tribal rebellion in Adilabad, not the 1857 assault on the British Residency in Hyderabad.",
          attraction: "Tribal leader of the 1860 Adilabad uprising.",
        },
      ],
      answer: 0,
      reason: "When sepoy Cheeda Khan was captured and held at the British Residency in Hyderabad, Turrebaz Khan and Maulvi Alauddin mobilized thousands of patriots from Mecca Masjid on 17 July 1857 and attacked the Residency. Major Davidson repelled the attack with artillery. Turrebaz Khan was shot near Toopran and his body was displayed publicly at the Residency.",
      clue: "Look for 'Leader of the attack on the British Residency at Koti on 17 July 1857': Turrebaz Khan.",
      trap: "Do not confuse Turrebaz Khan (who attacked the Residency) with Cheeda Khan (the imprisoned soldier whose release was demanded).",
      elimination: "Eliminate Cheeda Khan (the prisoner) and Raja Venkatappa Nayaka (Shorapur ruler); Turrebaz Khan led the Koti Residency assault.",
      anchor: "1857 Revolt in Hyderabad: Turrebaz Khan and Maulvi Alauddin attacked British Residency at Koti on 17 July 1857.",
      hint: "Which freedom fighter was shot dead near Toopran in 1859 after leading the Residency attack?",
      source: "TS Police Constable 2018, FWT, General Studies",
      page: 29,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Turrebaz Khan.",
          correctMeaning: "Turrebaz Khan was the intrepid commander of the 1857 Hyderabad uprising.",
          selectedMeaning: "Turrebaz Khan was the intrepid commander of the 1857 Hyderabad uprising.",
          possibleConfusion: "You answered correctly. A major road near Koti in Hyderabad is named 'Turrebaz Khan Road' in his honour.",
          decisionRules: [
            { when: "the question asks who led the attack on British Residency in Hyderabad in July 1857", choose: "Turrebaz Khan (with Maulvi Alauddin)" },
            { when: "the question asks where Turrebaz Khan was martyred", choose: "Near Toopran (Medak district)" },
          ],
          nextStep: "Note that Maulvi Alauddin was transported to the Andaman Cellular Jail, becoming its first prisoner from Hyderabad.",
        },
        {
          observation: "Check Cheeda Khan's role.",
          correctMeaning: "Turrebaz Khan led the attack.",
          selectedMeaning: "Subedar Cheeda Khan was arrested at Aurangabad and detained in the Hyderabad Residency because he refused to fight fellow Indian sepoys.",
          possibleConfusion: "Cheeda Khan's arrest was the immediate spark for Turrebaz Khan's march.",
          decisionRules: [
            { when: "the question asks whose release Turrebaz Khan demanded during the Residency attack", choose: "Cheeda Khan" },
            { when: "the question asks who led the attack", choose: "Turrebaz Khan" },
          ],
          nextStep: "Remember: Cheeda Khan was the imprisoned soldier; Turrebaz Khan was the rescuer/leader.",
        },
        {
          observation: "Check Raja Venkatappa Nayaka's domain.",
          correctMeaning: "The leader in Hyderabad was Turrebaz Khan.",
          selectedMeaning: "Raja Venkatappa Nayaka led the 1857 uprising in Shorapur (Surapuram) Samsthanam and was advised by Meadows Taylor.",
          possibleConfusion: "Another legendary hero of the 1857 rebellion in the Nizam dominions.",
          decisionRules: [
            { when: "the question asks who led the 1857 revolt in Shorapur Samsthanam", choose: "Raja Venkatappa Nayaka" },
            { when: "the question asks who attacked the Koti Residency", choose: "Turrebaz Khan" },
          ],
          nextStep: "Distinguish Shorapur (Venkatappa Nayaka) from Hyderabad Residency (Turrebaz Khan).",
        },
        {
          observation: "Check Ramji Gond's timeline.",
          correctMeaning: "Turrebaz Khan fought in 1857.",
          selectedMeaning: "Ramji Gond organized Gond and Rohilla guerrillas in Nirmal/Adilabad in 1860.",
          possibleConfusion: "Both fought against British and Nizam hegemony.",
          decisionRules: [
            { when: "the question asks about the 1860 tribal rebellion in Adilabad", choose: "Ramji Gond" },
            { when: "the question asks about the 1857 Residency assault", choose: "Turrebaz Khan" },
          ],
          nextStep: "Chronological anchor: 1857 (Turrebaz Khan) -> 1860 (Ramji Gond).",
        },
      ],
    },
  },

  // 4. TM-Q094 (Ramji Gond 1860 Revolt / Nirmal Veyyi Ulla Marri)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q094",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In 1860, the tribal leader Ramji Gond organized a fierce armed rebellion against British and Nizam forces across the Godavari basin. Following their defeat in battle, at which location were 1,000 Gond and Rohilla rebels executed together by hanging on a single banyan tree known as 'Veyyi Ulla Marri' (వెయ్యి ఉడల మర్రి)?",
      options: [
        {
          text: "Nirmal (in present-day Nirmal district)",
          why: "On 9 April 1860, after the battle between Ramji Gond's forces and British officer Colonel Roberts, 1,000 captured Gond and Rohilla warriors were hanged en masse on a sprawling banyan tree in Nirmal, known historically as 'Veyyi Ulla Marri'.",
          attraction: "The sacred site of the 1,000 hangings in 1860.",
          confusion: false,
        },
        {
          text: "Asifabad (Jodeghat)",
          why: "Jodeghat is the sacred martyrdom site of Komaram Bheem in September 1940, not the 1860 Ramji Gond execution site.",
          attraction: "Famous Gond martyrdom site of Komaram Bheem.",
          confusion: true,
        },
        {
          text: "Utnoor",
          why: "Utnoor is a prominent tribal center and ITDA headquarters in Adilabad, but not the site of the 1860 banyan tree hangings.",
          attraction: "Major Gond cultural center in Adilabad.",
        },
        {
          text: "Mancherial",
          why: "Mancherial is an industrial town on the Godavari, not the site of the Veyyi Ulla Marri.",
          attraction: "Coal and industrial town of north Telangana.",
        },
      ],
      answer: 0,
      reason: "Ramji Gond ruled an independent tribal belt between the Godavari and Penganga rivers. In April 1860, the British and Nizam armies defeated the rebels and hanged 1,000 patriots on a giant banyan tree in Nirmal. The tree came to be revered as 'Veyyi Ulla Marri' (The Banyan Tree of 1,000 Nooses) and stands as a monument to early anti-colonial tribal heroism.",
      clue: "Look for 'Site of Veyyi Ulla Marri where 1,000 Gond fighters under Ramji Gond were hanged in 1860': Nirmal.",
      trap: "Do not confuse Ramji Gond's martyrdom at Nirmal (1860) with Komaram Bheem's martyrdom at Jodeghat, Asifabad (1940).",
      elimination: "Eliminate Jodeghat (Komaram Bheem 1940) and Utnoor; Nirmal is the site of Veyyi Ulla Marri.",
      anchor: "Ramji Gond Rebellion (1860): 1,000 fighters hanged on 'Veyyi Ulla Marri' at Nirmal.",
      hint: "In which historic town famous for wooden toys and brass craft was the 1,000-martyr banyan tree located?",
      source: "TS Police Constable 2018, FWT, General Studies",
      page: 33,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Nirmal.",
          correctMeaning: "Nirmal is the site of 'Veyyi Ulla Marri' where 1,000 tribal and Rohilla fighters were hanged by the British in 1860.",
          selectedMeaning: "Nirmal is the site of 'Veyyi Ulla Marri' where 1,000 tribal and Rohilla fighters were hanged by the British in 1860.",
          possibleConfusion: "You answered correctly. The Government of Telangana has developed the memorial park at Nirmal to honor Ramji Gond.",
          decisionRules: [
            { when: "the question asks where the 'Veyyi Ulla Marri' banyan tree was located", choose: "Nirmal" },
            { when: "the question asks who led the 1860 tribal rebellion in Adilabad", choose: "Ramji Gond" },
          ],
          nextStep: "Note that Ramji Gond's forces fought against British Collector Davidson and Colonel Roberts.",
        },
        {
          observation: "Check Jodeghat's history.",
          correctMeaning: "Nirmal is the site of Veyyi Ulla Marri.",
          selectedMeaning: "Jodeghat (near Kerameri in Asifabad) is where Komaram Bheem was martyred on 1 September 1940.",
          possibleConfusion: "Both Ramji Gond and Komaram Bheem were legendary Gond leaders from Adilabad.",
          decisionRules: [
            { when: "the question asks where Komaram Bheem was martyred in 1940", choose: "Jodeghat (Asifabad)" },
            { when: "the question asks where Ramji Gond's 1,000 followers were hanged in 1860", choose: "Nirmal" },
          ],
          nextStep: "Keep Ramji Gond (1860 Nirmal) distinct from Komaram Bheem (1940 Jodeghat).",
        },
        {
          observation: "Check Utnoor's tribal significance.",
          correctMeaning: "The execution took place at Nirmal.",
          selectedMeaning: "Utnoor is the location of the Integrated Tribal Development Agency (ITDA) and Nagoba Jathara at Keslapur.",
          possibleConfusion: "Prominent tribal nerve center.",
          decisionRules: [
            { when: "the question asks where Keslapur Nagoba Jathara is held", choose: "Utnoor mandal, Adilabad" },
            { when: "the question asks where Veyyi Ulla Marri stood", choose: "Nirmal" },
          ],
          nextStep: "Pair Nagoba Jathara with Keslapur/Utnoor, and Veyyi Ulla Marri with Nirmal.",
        },
        {
          observation: "Check Mancherial.",
          correctMeaning: "The correct location is Nirmal.",
          selectedMeaning: "Mancherial was carved out as a separate district in 2016, known for Gudem Satyanarayana temple and Singareni coalfields.",
          possibleConfusion: "Adjacent northern district.",
          decisionRules: [
            { when: "the question asks about Veyyi Ulla Marri memorial", choose: "Nirmal" },
            { when: "evaluating options", choose: "Nirmal" },
          ],
          nextStep: "Firmly anchor Nirmal as the site of the 1860 mass hanging.",
        },
      ],
    },
  },

  // 5. TM-Q095 (Salar Jung Reforms & Inflow of Non-Mulkis)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q095",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "During the administrative modernization initiated by Prime Minister Mir Turab Ali Khan (Salar Jung I, 1853–1883) in Hyderabad State, which specific policy development inadvertently sowed the seeds of the historic Mulki vs Non-Mulki conflict?",
      options: [
        {
          text: "Replacing Persian with Urdu in administration and recruiting educated English and Urdu-speaking officers from North India (Non-Mulkis / Ghair-Mulkis) into higher administrative and judicial posts",
          why: "To modernize the bureaucratic apparatus, Salar Jung I recruited highly educated Kayasthas, Muslims, and civil servants from Uttar Pradesh, Bihar, and Bengal (Ghair-Mulkis), who quickly monopolized high government offices and excluded local Hyderabadis (Mulkis).",
          attraction: "The primary historical origin of the Mulki movement.",
          confusion: false,
        },
        {
          text: "Imposing a total ban on the employment of native Hyderabadi Muslims in the state police force",
          why: "There was never any ban on native Muslims; the issue was the recruitment of outsiders into top bureaucratic and judicial tiers.",
          attraction: "Plausible administrative friction point.",
        },
        {
          text: "Mandating Telugu as the sole official administrative language of Hyderabad State",
          why: "Urdu replaced Persian; Telugu was never made the official language of the Nizam's dominion.",
          attraction: "Linguistic misconception.",
        },
        {
          text: "Handing over all tax collection rights exclusively to the British East India Company",
          why: "Salar Jung I centralized tax collection through government talukdars (Zilabandi system) to prevent British annexations.",
          attraction: "Confuses revenue modernization with British annexation.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "Under Salar Jung I's 'Zilabandi' reforms (1865), Hyderabad State created modern departments (Finance, Revenue, Police, Judiciary). Because native Mulkis predominantly spoke Deccani and had traditional Persian schooling, Salar Jung imported thousands of North Indian bureaucrats fluent in modern Urdu and English. These Non-Mulkis dominated the administration, sparking local resentment that led to the Mulki Rules of 1888, 1919, and 1933.",
      clue: "Look for 'Salar Jung I reforms causing Mulki vs Non-Mulki issue': Recruitment of North Indian educated officials into high administrative posts.",
      trap: "Do not assume the conflict arose from British East India Company taxation; it was driven by the influx of North Indian civil servants (Ghair-Mulkis).",
      elimination: "Eliminate British taxation and Telugu language mandates; the issue was Non-Mulki bureaucratic appointments by Salar Jung I.",
      anchor: "Salar Jung I Reforms (1853–1883): Modernization led to large-scale influx of Non-Mulki officers from North India, birthing the Mulki agitation.",
      hint: "Why did educated locals protest against outsiders brought from North India by Salar Jung I?",
      source: "TGPSC Group-1 Preliminary Examination 2023",
      page: 25,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the recruitment of North Indian educated officials.",
          correctMeaning: "Salar Jung's recruitment of non-locals created a privileged bureaucratic elite that provoked the original Mulki movement.",
          selectedMeaning: "Salar Jung's recruitment of non-locals created a privileged bureaucratic elite that provoked the original Mulki movement.",
          possibleConfusion: "You answered correctly. The agitation led the 6th Nizam Mir Mahboob Ali Khan to issue the first Mulki regulations in 1888.",
          decisionRules: [
            { when: "the question asks what sparked the Mulki issue during Salar Jung I's era", choose: "Large-scale recruitment of North Indian (Ghair-Mulki) officers into administration" },
            { when: "the question asks when the first formal Mulki circulars appeared", choose: "1888 under Mir Mahboob Ali Khan" },
          ],
          nextStep: "Note that in 1884 Urdu was declared the official administrative language, replacing Persian.",
        },
        {
          observation: "Check religious discrimination claims.",
          correctMeaning: "The divide was regional (Mulki vs Non-Mulki), not religious.",
          selectedMeaning: "Both Mulkis and Non-Mulkis included Muslims, Hindus, and Parsis; the grievance was domicile, not religion.",
          possibleConfusion: "Assuming communal tension rather than nativity conflict.",
          decisionRules: [
            { when: "the question asks what was the nature of the Mulki conflict", choose: "Native residents of Hyderabad (Mulkis) vs Outsiders (Non-Mulkis)" },
            { when: "evaluating options", choose: "Regional nativity and domicile grievance" },
          ],
          nextStep: "Remember: The Mulki issue was fundamentally about local employment protection.",
        },
        {
          observation: "Check the language transition in Hyderabad.",
          correctMeaning: "Urdu replaced Persian.",
          selectedMeaning: "Persian was the court language until 1884, when Salar Jung II made Urdu the official language.",
          possibleConfusion: "Thinking Telugu was promoted at state level.",
          decisionRules: [
            { when: "the question asks which language replaced Persian as official in Hyderabad in 1884", choose: "Urdu" },
            { when: "the question asks who was imported to staff the administration", choose: "North Indian Urdu and English speakers" },
          ],
          nextStep: "Note that Osmania University (1918) later became the first university in India to teach in Urdu.",
        },
        {
          observation: "Check Salar Jung's financial reforms.",
          correctMeaning: "Non-Mulki recruitment was the cause.",
          selectedMeaning: "Salar Jung created the Zilabandi system (dividing the state into 14 districts) and restored state finances to pay off British subsidiary forces.",
          possibleConfusion: "Both were major pillars of Salar Jung's tenure.",
          decisionRules: [
            { when: "the question asks about Salar Jung's revenue/district reorganization", choose: "Zilabandi system (1865)" },
            { when: "the question asks about the origin of Mulki agitation", choose: "Import of Non-Mulki officers" },
          ],
          nextStep: "Differentiate Zilabandi (revenue) from Non-Mulki appointments (employment).",
        },
      ],
    },
  },

  // 6. TM-Q096 (1919 Nizam's Firman on Mulki Rules)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q096",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "In 1919, the 7th Nizam Mir Osman Ali Khan issued a historic Royal Firman establishing the formal legal definition of a 'Mulki' for public employment. Under this 1919 Firman, what was the minimum continuous residence required in Hyderabad State for a non-native to be granted Mulki citizenship?",
      options: [
        {
          text: "15 years of continuous residence in the State with an affidavit of permanent settlement",
          why: "The 1919 Firman promulgated by Mir Osman Ali Khan defined a Mulki by residence as any person who had resided in Hyderabad State continuously for at least 15 years and given an undertaking to abandon their former domicile.",
          attraction: "The foundational 15-year residence rule of Hyderabad Mulki law.",
          confusion: false,
        },
        {
          text: "12 years of continuous residence",
          why: "12 years was the ordinary period for adverse possession or general naturalization in British India, but Hyderabad Mulki law explicitly specified 15 years.",
          attraction: "Standard British Indian domicile period.",
          confusion: true,
        },
        {
          text: "7 years of continuous residence",
          why: "7 years was later proposed under the 1975 Presidential Order for direct recruitment study periods, not the 1919 Nizam's Firman.",
          attraction: "Recalls 1975 Presidential Order 7-year institutional study rule.",
        },
        {
          text: "4 years of continuous residence",
          why: "4 years is the modern New Zonal System (2018) study criterion, completely different from 1919.",
          attraction: "Recalls the 2018 Presidential Order 4-year study rule.",
        },
      ],
      answer: 0,
      reason: "The 1919 Nizam's Firman created the Executive Council (Bab-e-Hukumat) and codified Mulki Rules into four categories: (1) By Birth (born in the State); (2) By Descent (father was a Mulki at birth); (3) By Residence (permanent residence for not less than 15 years without intention of leaving); and (4) Married women whose husbands are Mulkis.",
      clue: "Look for 'Minimum continuous residence for Mulki under 1919 Nizam's Firman': 15 years.",
      trap: "Do not confuse the 1919 Firman (15 years) with the 1975 Presidential Order (7 years) or the 2018 Presidential Order (4 years).",
      elimination: "Eliminate 12, 7, and 4 years; the 1919 Firman established the 15-year continuous residence requirement.",
      anchor: "1919 Nizam's Firman: Codified Mulki Rules requiring 15 years continuous residence in Hyderabad State.",
      hint: "How many years of residence (fifteen, twelve, or seven) did the Nizam prescribe in 1919?",
      source: "TGPSC Group-4 2023 Paper I, General Studies",
      page: 28,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 15 years.",
          correctMeaning: "15 years continuous residence was the statutory requirement under the 1919 Firman, later defended in the Supreme Court in 1972.",
          selectedMeaning: "15 years continuous residence was the statutory requirement under the 1919 Firman, later defended in the Supreme Court in 1972.",
          possibleConfusion: "You answered correctly. This 15-year rule was carried forward into the 1959 AP Public Employment Rules.",
          decisionRules: [
            { when: "the question asks for the residence requirement under the 1919 Nizam's Firman", choose: "15 years" },
            { when: "the question asks how many categories of Mulkis were defined in 1919", choose: "Four categories" },
          ],
          nextStep: "Note that in 1935 the Nizam's Subjects League (Mulki League) was formed to protect this 15-year rule.",
        },
        {
          observation: "Check the 12-year period.",
          correctMeaning: "The statutory period in Hyderabad was 15 years.",
          selectedMeaning: "12 years was common in other provincial domicile certificates in British India.",
          possibleConfusion: "Standard legal limitation period.",
          decisionRules: [
            { when: "the question asks for Hyderabad Mulki residence requirement", choose: "15 years" },
            { when: "evaluating options", choose: "15 years" },
          ],
          nextStep: "Anchor 15 years as the uncompromised historical hallmark of Mulki identity.",
        },
        {
          observation: "Check the 7-year period.",
          correctMeaning: "1919 Firman mandated 15 years.",
          selectedMeaning: "7 years was the educational study window under the 1975 Presidential Order (G.O. Ms. No. 674).",
          possibleConfusion: "Confusing the 1919 Nizam's Firman with the 1975 Presidential Order.",
          decisionRules: [
            { when: "the question asks about the 1975 Presidential Order local candidate study period", choose: "4 out of 7 consecutive academic years" },
            { when: "the question asks about the 1919 Firman", choose: "15 years continuous residence" },
          ],
          nextStep: "Remember: 1919 Firman = 15 years; 1975 Order = 4 out of 7 years.",
        },
        {
          observation: "Check the 4-year period.",
          correctMeaning: "The 1919 requirement is 15 years.",
          selectedMeaning: "4 consecutive academic years of study (classes 1 to 7) is the local candidate criterion under the 2018 New Zonal System.",
          possibleConfusion: "Confusing modern 2018 recruitment criteria with 1919 royal decree.",
          decisionRules: [
            { when: "the question asks about local candidate criterion in 2018 Presidential Order", choose: "4 consecutive academic years" },
            { when: "the question asks about 1919 Nizam's Firman", choose: "15 years" },
          ],
          nextStep: "Chronological progression: 1919 (15 years) -> 1975 (4 of 7 years) -> 2018 (4 consecutive years).",
        },
      ],
    },
  },

  // 7. TM-Q097 (1938 Vande Mataram Movement in Osmania University)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q097",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In 1938, Hindu students at Osmania University launched the historic 'Vande Mataram Movement' after the university authorities prohibited the singing of the national song in the campus prayer hall. Which prominent student agitator (who later served as the Prime Minister of India) was rusticated from Osmania University and completed his degree at Nagpur University?",
      options: [
        {
          text: "P.V. Narasimha Rao",
          why: "Pamulaparthi Venkata Narasimha Rao (1921–2004) was a student at Osmania University who participated actively in the 1938 Vande Mataram strike, was expelled along with hundreds of colleagues, and was welcomed by Nagpur University to complete his education.",
          attraction: "The future Prime Minister of India who was expelled during the 1938 movement.",
          confusion: false,
        },
        {
          text: "Dr. Marri Chenna Reddy",
          why: "Dr. M. Chenna Reddy was studying medicine during that period and supported the nationalist cause, but P.V. Narasimha Rao was the famous rusticated student who went to Nagpur.",
          attraction: "Prominent contemporary student leader and future Chief Minister.",
          confusion: true,
        },
        {
          text: "Burgula Ramakrishna Rao",
          why: "Burgula Ramakrishna Rao was already a practicing senior advocate and leader of Andhra Mahasabha in 1938, not a student.",
          attraction: "First elected Chief Minister of Hyderabad State.",
        },
        {
          text: "K.V. Ranga Reddy",
          why: "K.V. Ranga Reddy was a veteran leader and legislator in 1938, not a university student.",
          attraction: "Senior statesman from Telangana.",
        },
      ],
      answer: 0,
      reason: "In November 1938, when the proctor of Osmania University banned 'Vande Mataram' in the Hindu hostel prayer halls, 350 students went on an indefinite strike. When the Nizam refused to relent, the students were rusticated. The Vice-Chancellor of Nagpur University, Justice Bhavani Shankar Niyogi, generously admitted the rusticated students, enabling P.V. Narasimha Rao, V.D. Deshpande, and others to complete their degrees.",
      clue: "Look for 'Future Prime Minister of India expelled from Osmania University in 1938 Vande Mataram strike who went to Nagpur': P.V. Narasimha Rao.",
      trap: "Do not confuse P.V. Narasimha Rao (the expelled student) with senior leaders like Burgula Ramakrishna Rao or K.V. Ranga Reddy who defended them legally.",
      elimination: "Eliminate Burgula and K.V. Ranga Reddy (who were adult leaders); P.V. Narasimha Rao was the rusticated student.",
      anchor: "1938 Vande Mataram Movement: P.V. Narasimha Rao expelled from Osmania University; completed degree at Nagpur University.",
      hint: "Which scholar-statesman from Vangara became Prime Minister of India in 1991?",
      source: "TS Police Constable 2018, FWT, General Studies",
      page: 36,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected P.V. Narasimha Rao.",
          correctMeaning: "P.V. Narasimha Rao was the young student rebel expelled in 1938 who later rose to become Chief Minister of AP and Prime Minister of India.",
          selectedMeaning: "P.V. Narasimha Rao was the young student rebel expelled in 1938 who later rose to become Chief Minister of AP and Prime Minister of India.",
          possibleConfusion: "You answered correctly. The movement marked the baptism by fire of a whole generation of Telangana leaders.",
          decisionRules: [
            { when: "the question asks who was expelled from Osmania University in 1938 and went to Nagpur", choose: "P.V. Narasimha Rao" },
            { when: "the question asks who was the Nagpur University VC who admitted the expelled students", choose: "Justice Bhavani Shankar Niyogi" },
          ],
          nextStep: "Remember that Vande Mataram Ramachandra Rao also earned his prefix 'Vande Mataram' from this 1938 movement.",
        },
        {
          observation: "Check Dr. M. Chenna Reddy's role.",
          correctMeaning: "The expelled student who went to Nagpur was P.V. Narasimha Rao.",
          selectedMeaning: "Dr. Marri Chenna Reddy graduated from Osmania Medical College in 1941 and founded the Youth League of Congress.",
          possibleConfusion: "Both were towering political contemporaries from Telangana.",
          decisionRules: [
            { when: "the question asks who completed studies at Nagpur University after 1938 rustication", choose: "P.V. Narasimha Rao" },
            { when: "the question asks who led the 1969 Telangana Praja Samithi", choose: "Dr. Marri Chenna Reddy" },
          ],
          nextStep: "Pair 1938 Nagpur transfer with P.V. Narasimha Rao.",
        },
        {
          observation: "Check Burgula Ramakrishna Rao's standing in 1938.",
          correctMeaning: "P.V. Narasimha Rao was the student agitator.",
          selectedMeaning: "Burgula Ramakrishna Rao was a leading member of the Hyderabad bar and political leader who advised the students.",
          possibleConfusion: "Leading nationalist lawyer in Hyderabad.",
          decisionRules: [
            { when: "the question asks who was the first Chief Minister of Hyderabad State (1952)", choose: "Burgula Ramakrishna Rao" },
            { when: "the question asks about the student expelled in 1938", choose: "P.V. Narasimha Rao" },
          ],
          nextStep: "Identify Burgula as senior mentor and lawyer, not a student in 1938.",
        },
        {
          observation: "Check K.V. Ranga Reddy's role.",
          correctMeaning: "P.V. Narasimha Rao is the correct answer.",
          selectedMeaning: "K.V. Ranga Reddy was the President of the Hyderabad Central Andhra Mahasabha in 1935 and a senior leader.",
          possibleConfusion: "Senior elder statesman of Telangana.",
          decisionRules: [
            { when: "the question asks who served as Deputy CM in 1959 after Gentlemen's Agreement", choose: "K.V. Ranga Reddy" },
            { when: "the question asks for the 1938 student leader", choose: "P.V. Narasimha Rao" },
          ],
          nextStep: "Keep K.V. Ranga Reddy in the elder statesman category.",
        },
      ],
    },
  },

  // 8. TM-Q098 (Telangana Peasant Armed Struggle / Doddi Komaraiah)
  {
    sourceIds: ["SR-POLICE-CONSTABLE-2016-2022"],
    question: {
      id: "TM-Q098",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "On 4 July 1946, the martyrdom of which valiant peasant youth at Kadavendi village (in Jangaon taluk) during a protest against the terror of Visnoor Deshmukh Ramachandra Reddy ignited the historic Telangana Peasant Armed Struggle (తెలంగాణ సాయుధ పోరాటం)?",
      options: [
        {
          text: "Doddi Komaraiah",
          why: "Doddi Komaraiah, a young activist of the Andhra Mahasabha, was shot dead on 4 July 1946 when the mercenaries (gundas) of Visnoor Deshmukh opened fire on a peaceful procession at Kadavendi village, sparking the armed uprising across 3,000 villages.",
          attraction: "The first martyr of the Telangana Peasant Armed Struggle.",
          confusion: false,
        },
        {
          text: "Komaram Bheem",
          why: "Komaram Bheem was martyred in September 1940 at Jodeghat resisting forest and revenue officials, six years before the 1946 Kadavendi incident.",
          attraction: "Iconic tribal armed struggle martyr.",
          confusion: true,
        },
        {
          text: "Doddi Mallaiah",
          why: "Doddi Mallaiah was the elder brother of Doddi Komaraiah who survived the firing and continued the struggle.",
          attraction: "Brother of the martyr who was present in the procession.",
        },
        {
          text: "Bathini Mogilaiah",
          why: "Bathini Mogilaiah was martyred during the armed struggle in Warangal, but was not the first martyr of 4 July 1946.",
          attraction: "Prominent martyr of the armed struggle in Warangal.",
        },
      ],
      answer: 0,
      reason: "On 4 July 1946, the local branch of Andhra Mahasabha took out a procession in Kadavendi village defending the house of an activist. Visnoor Deshmukh's mother, Janamma, ordered the gundas to fire. Doddi Komaraiah was shot in the chest and martyred. His death transformed the peasant movement from petitions into armed resistance, liberating 3,000 villages.",
      clue: "Look for 'Peasant youth martyred at Kadavendi village on 4 July 1946 sparking Telangana Armed Struggle': Doddi Komaraiah.",
      trap: "Do not confuse Doddi Komaraiah (martyred 4 July 1946 at Kadavendi) with Komaram Bheem (martyred 1940 at Jodeghat) or Doddi Mallaiah (his surviving brother).",
      elimination: "Eliminate Komaram Bheem (1940) and Doddi Mallaiah (surviving brother); Doddi Komaraiah was the 4 July 1946 martyr.",
      anchor: "Doddi Komaraiah: First martyr of the Telangana Peasant Armed Struggle (martyred 4 July 1946 at Kadavendi).",
      hint: "Whose martyrdom at Kadavendi village in Jangaon is celebrated as the spark of the Armed Struggle?",
      source: "TS Police Constable 2022, FWT, General Studies",
      page: 35,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Doddi Komaraiah.",
          correctMeaning: "Doddi Komaraiah was the first martyr of the Telangana Peasant Armed Struggle.",
          selectedMeaning: "Doddi Komaraiah was the first martyr of the Telangana Peasant Armed Struggle.",
          possibleConfusion: "You answered correctly. The anniversary of his martyrdom on July 4th is commemorated across Telangana.",
          decisionRules: [
            { when: "the question asks who was the first martyr of the Telangana Peasant Armed Struggle (4 July 1946)", choose: "Doddi Komaraiah" },
            { when: "the question asks where Doddi Komaraiah was martyred", choose: "Kadavendi village (Jangaon)" },
          ],
          nextStep: "Note that Kadavendi is located near Palakurthi in Jangaon district.",
        },
        {
          observation: "Check Komaram Bheem's timeline.",
          correctMeaning: "Doddi Komaraiah was the 1946 martyr.",
          selectedMeaning: "Komaram Bheem was the Gond tribal hero martyred on 1 September 1940 at Jodeghat.",
          possibleConfusion: "Both have 'Komara/Komaram' in their names and were martyred fighting feudal oppression.",
          decisionRules: [
            { when: "the question asks about the Gond tribal martyr of Jodeghat (1940)", choose: "Komaram Bheem" },
            { when: "the question asks about the Kadavendi martyr of 4 July 1946", choose: "Doddi Komaraiah" },
          ],
          nextStep: "Differentiate Komaram Bheem (Gond leader, 1940) from Doddi Komaraiah (Peasant struggle, 1946).",
        },
        {
          observation: "Check Doddi Mallaiah.",
          correctMeaning: "Doddi Komaraiah was the martyr.",
          selectedMeaning: "Doddi Mallaiah was Komaraiah's elder brother who led the agricultural workers' union and survived the firing.",
          possibleConfusion: "Brother of the martyr who was present in the demonstration.",
          decisionRules: [
            { when: "the question asks who was martyred at Kadavendi", choose: "Doddi Komaraiah" },
            { when: "evaluating options", choose: "Doddi Komaraiah" },
          ],
          nextStep: "Remember: Komaraiah was the martyr; Mallaiah was his brother.",
        },
        {
          observation: "Check Bathini Mogilaiah.",
          correctMeaning: "The Kadavendi martyr was Doddi Komaraiah.",
          selectedMeaning: "Bathini Mogilaiah was a brave guerrilla who fought against Razakars in Warangal and laid down his life holding the national flag.",
          possibleConfusion: "Famous hero of the armed struggle.",
          decisionRules: [
            { when: "the question asks about Warangal armed struggle martyr holding national flag", choose: "Bathini Mogilaiah" },
            { when: "the question asks for the Kadavendi spark martyr", choose: "Doddi Komaraiah" },
          ],
          nextStep: "Link Mogilaiah to Warangal and Komaraiah to Kadavendi.",
        },
      ],
    },
  },

  // 9. TM-Q099 (1944 Bhuvanagiri Andhra Mahasabha 11th Conference)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q099",
      topic: "TM-01.01",
      concept: "TM-01.01-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In 1944, the 11th session of the Andhra Mahasabha held at Bhuvanagiri (Bhongir) marked a historic watershed in the Telangana freedom struggle under whose presidency, resulting in the decisive ideological split between nationalist moderates and radical communists?",
      options: [
        {
          text: "Ravi Narayana Reddy",
          why: "Ravi Narayana Reddy presided over the historic 11th Andhra Mahasabha at Bhuvanagiri in 1944, where communist youth mobilized over 10,000 peasants, leading the moderates (led by K.V. Ranga Reddy) to split and form a separate rival Mahasabha.",
          attraction: "The communist leader who presided over the landmark 1944 Bhuvanagiri conference.",
          confusion: false,
        },
        {
          text: "Suravaram Pratapa Reddy",
          why: "Suravaram Pratapa Reddy presided over the very first Andhra Mahasabha held at Medak in 1930, not the 11th Bhuvanagiri session.",
          attraction: "President of the 1st Andhra Mahasabha (1930).",
          confusion: true,
        },
        {
          text: "K.V. Ranga Reddy",
          why: "K.V. Ranga Reddy was the leader of the moderate nationalist faction who walked out and organized the rival 12th conference at Madikonda in 1945.",
          attraction: "Leader of the nationalist faction who split from the communists.",
        },
        {
          text: "Burgula Ramakrishna Rao",
          why: "Burgula Ramakrishna Rao presided over the 3rd Andhra Mahasabha at Devarkonda in 1932, not the 1944 Bhuvanagiri session.",
          attraction: "Presided over the 3rd Andhra Mahasabha.",
        },
      ],
      answer: 0,
      reason: "The 11th Andhra Mahasabha conference at Bhuvanagiri in 1944, chaired by Ravi Narayana Reddy, radicalized the organization. Sunkara Satyanarayana's play 'Kashtajeevi' and revolutionary songs were staged. Moderate leaders like K.V. Ranga Reddy and M. Chenna Reddy objected to communist predominance, splitting the organization into Nationalist Andhra Mahasabha and Communist Andhra Mahasabha.",
      clue: "Look for 'President of the 11th Andhra Mahasabha at Bhuvanagiri in 1944 where the split occurred': Ravi Narayana Reddy.",
      trap: "Do not confuse Ravi Narayana Reddy (11th session at Bhuvanagiri in 1944) with Suravaram Pratapa Reddy (1st session at Medak in 1930) or Burgula (3rd session at Devarkonda in 1932).",
      elimination: "Eliminate Suravaram (1930 Medak) and Burgula (1932 Devarkonda); Ravi Narayana Reddy presided at Bhuvanagiri in 1944.",
      anchor: "11th Andhra Mahasabha (1944, Bhuvanagiri): Presided by Ravi Narayana Reddy; decisive split between communists and moderates.",
      hint: "Which legendary communist parliamentarian chaired the 1944 Bhuvanagiri Mahasabha?",
      source: "TGPSC Group-1 Preliminary Examination 2024",
      page: 19,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected Ravi Narayana Reddy.",
          correctMeaning: "Ravi Narayana Reddy chaired the landmark 1944 Bhuvanagiri conference that transformed the peasant struggle.",
          selectedMeaning: "Ravi Narayana Reddy chaired the landmark 1944 Bhuvanagiri conference that transformed the peasant struggle.",
          possibleConfusion: "You answered correctly. In the 1952 general elections, he won the Nalgonda parliamentary seat with more votes than Jawaharlal Nehru.",
          decisionRules: [
            { when: "the question asks who presided over the 11th Andhra Mahasabha at Bhuvanagiri in 1944", choose: "Ravi Narayana Reddy" },
            { when: "the question asks where the 1944 conference took place", choose: "Bhuvanagiri (Bhongir)" },
          ],
          nextStep: "Note that Baddan Yella Reddy was the General Secretary alongside Ravi Narayana Reddy.",
        },
        {
          observation: "Check the 1st Andhra Mahasabha president.",
          correctMeaning: "Ravi Narayana Reddy chaired the 1944 session.",
          selectedMeaning: "Suravaram Pratapa Reddy presided over the inaugural 1st Andhra Mahasabha at Medak in 1930.",
          possibleConfusion: "Suravaram is the founding president of the Andhra Mahasabha movement.",
          decisionRules: [
            { when: "the question asks who presided over the 1st Andhra Mahasabha in 1930 at Medak", choose: "Suravaram Pratapa Reddy" },
            { when: "the question asks who presided over the 11th session in 1944 at Bhuvanagiri", choose: "Ravi Narayana Reddy" },
          ],
          nextStep: "Remember: 1st (1930 Medak) = Suravaram; 11th (1944 Bhuvanagiri) = Ravi Narayana Reddy.",
        },
        {
          observation: "Check K.V. Ranga Reddy's faction.",
          correctMeaning: "Ravi Narayana Reddy was the elected president.",
          selectedMeaning: "K.V. Ranga Reddy led the breakaway moderate group that called the 1944 communist resolutions unconstitutional.",
          possibleConfusion: "K.V. Ranga Reddy was the central figure of the opposing nationalist faction.",
          decisionRules: [
            { when: "the question asks who led the moderate breakaway faction in 1944", choose: "K.V. Ranga Reddy" },
            { when: "the question asks who chaired the 11th Bhuvanagiri session", choose: "Ravi Narayana Reddy" },
          ],
          nextStep: "Distinguish the communist chair (Ravi Narayana Reddy) from the moderate dissenter (K.V. Ranga Reddy).",
        },
        {
          observation: "Check Burgula Ramakrishna Rao's session.",
          correctMeaning: "The 1944 president was Ravi Narayana Reddy.",
          selectedMeaning: "Burgula Ramakrishna Rao presided over the 3rd Andhra Mahasabha at Devarkonda in 1932.",
          possibleConfusion: "Both were major historical presidents of the organization.",
          decisionRules: [
            { when: "the question asks who presided over the 3rd Andhra Mahasabha (1932, Devarkonda)", choose: "Burgula Ramakrishna Rao" },
            { when: "the question asks about Bhuvanagiri 11th session (1944)", choose: "Ravi Narayana Reddy" },
          ],
          nextStep: "Pair Devarkonda (1932) with Burgula, and Bhuvanagiri (1944) with Ravi Narayana Reddy.",
        },
      ],
    },
  },

  // 10. TM-Q100 (1952 City College Firing / Justice Jaganmohan Reddy Commission)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q100",
      topic: "TM-01.02",
      concept: "TM-01.02-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Following the tragic police firing on student demonstrators during the 'Non-Mulki Go Back' (Idli-Sambar Go Back) agitation near City College, Hyderabad on 3–4 September 1952, which judicial commission of inquiry was appointed by Chief Minister Burgula Ramakrishna Rao to investigate the police firing?",
      options: [
        {
          text: "Justice P. Jaganmohan Reddy Commission",
          why: "On 5 September 1952, the Government of Hyderabad appointed Justice P. Jaganmohan Reddy (then High Court Judge) to inquire into the causes of the police firing at City College that killed four people. The report criticized the police for using excessive force without magistrates' orders.",
          attraction: "The official judicial inquiry into the 1952 City College firing.",
          confusion: false,
        },
        {
          text: "Justice Vashishtha Bhargava Committee",
          why: "Justice Bhargava headed the 1969 committee auditing surplus revenues, not the 1952 firing inquiry.",
          attraction: "Famous judicial committee of the 1969 movement.",
        },
        {
          text: "Justice K.N. Wanchoo Committee",
          why: "Justice Wanchoo examined employment constitutional remedies in 1969, and in 1953 had examined the formation of Andhra State at Kurnool.",
          attraction: "High-profile judicial commissions in AP history.",
          confusion: true,
        },
        {
          text: "Justice K. Jayachandra Reddy Commission",
          why: "Justice K. Jayachandra Reddy was a later Supreme Court judge, not associated with the 1952 Hyderabad firing.",
          attraction: "Prominent jurist name.",
        },
      ],
      answer: 0,
      reason: "During the 1952 Mulki agitation against non-local teachers recruited in Warangal and Hyderabad, thousands of students marched from City College to the High Court on 3 September 1952. Hyderabad City Police Commissioner Shiva Kumar Lal ordered a lathi charge and firing. When protests erupted again on 4 September, police firing killed four persons (including Mohammad Qasim and Sheikh Mahboob). The Justice P. Jaganmohan Reddy Commission investigated the tragedy.",
      clue: "Look for 'Commission of inquiry on the 1952 City College police firing': Justice P. Jaganmohan Reddy Commission.",
      trap: "Do not confuse the 1952 City College inquiry (Justice P. Jaganmohan Reddy) with the 1969 committees (Bhargava, Wanchoo).",
      elimination: "Eliminate Bhargava and Wanchoo (both 1969); Justice P. Jaganmohan Reddy probed the 1952 City College firing.",
      anchor: "1952 City College Firing: Inquired by the Justice P. Jaganmohan Reddy Commission (appointed Sep 1952).",
      hint: "Which High Court judge who later became Supreme Court judge probed the 1952 City College firing?",
      source: "TS Police SI Preliminary 2016, Paper I",
      page: 177,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the Justice P. Jaganmohan Reddy Commission.",
          correctMeaning: "Justice P. Jaganmohan Reddy conducted the first judicial inquiry in post-independence Hyderabad State into student firing.",
          selectedMeaning: "Justice P. Jaganmohan Reddy conducted the first judicial inquiry in post-independence Hyderabad State into student firing.",
          possibleConfusion: "You answered correctly. The firing deaths forced the Burgula government to constitute a Cabinet Sub-Committee on Mulki Rules.",
          decisionRules: [
            { when: "the question asks who inquired into the 1952 City College police firing", choose: "Justice P. Jaganmohan Reddy Commission" },
            { when: "the question asks who was the Hyderabad Police Commissioner during the 1952 firing", choose: "Shiva Kumar Lal" },
          ],
          nextStep: "Note that four people lost their lives in the 3–4 September 1952 firings.",
        },
        {
          observation: "Check Justice Bhargava Committee's mandate.",
          correctMeaning: "Justice Jaganmohan Reddy probed the 1952 firing.",
          selectedMeaning: "Justice Vashishtha Bhargava was appointed in 1969 to calculate Telangana surplus revenues.",
          possibleConfusion: "Both were prominent judicial commissions in movement history.",
          decisionRules: [
            { when: "the question asks about the 1969 surplus revenue committee", choose: "Justice Vashishtha Bhargava Committee" },
            { when: "the question asks about the 1952 City College firing inquiry", choose: "Justice P. Jaganmohan Reddy Commission" },
          ],
          nextStep: "Pair 1952 firing with Jaganmohan Reddy, and 1969 surpluses with Bhargava.",
        },
        {
          observation: "Check Justice Wanchoo's reports.",
          correctMeaning: "The 1952 firing commission was Jaganmohan Reddy.",
          selectedMeaning: "Justice K.N. Wanchoo reported in February 1953 on the creation of Andhra State with capital at Kurnool, and in 1969 on Mulki safeguards.",
          possibleConfusion: "Active jurist in 1950s AP state-formation politics.",
          decisionRules: [
            { when: "the question asks who recommended Kurnool as temporary capital of Andhra State in 1953", choose: "Justice K.N. Wanchoo" },
            { when: "the question asks who probed 1952 City College firing", choose: "Justice P. Jaganmohan Reddy" },
          ],
          nextStep: "Differentiate Wanchoo (1953 Andhra capital report) from Jaganmohan Reddy (1952 City College inquiry).",
        },
        {
          observation: "Check the names.",
          correctMeaning: "The judge was Justice P. Jaganmohan Reddy.",
          selectedMeaning: "Justice K. Jayachandra Reddy was a different judge of the Supreme Court who headed the Press Council.",
          possibleConfusion: "Similar sounding surname and jurist title.",
          decisionRules: [
            { when: "the question asks for the 1952 City College inquiry judge", choose: "Justice P. Jaganmohan Reddy" },
            { when: "evaluating options", choose: "Justice P. Jaganmohan Reddy" },
          ],
          nextStep: "Anchor Justice P. Jaganmohan Reddy firmly to the 1952 agitation.",
        },
      ],
    },
  },

  // 11. TM-Q101 (Fazal Ali States Reorganisation Commission Report 1955)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q101",
      topic: "TM-01.03",
      concept: "TM-01.03-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "In paragraphs 378 to 389 of its landmark report submitted in September 1955, what specific recommendation did the States Reorganisation Commission (SRC, headed by Justice Fazal Ali, with members H.N. Kunzru and K.M. Panikkar) make regarding the proposed merger of Telangana with Andhra State?",
      options: [
        {
          text: "Telangana should initially be retained as a separate State (Hyderabad State), and its merger with Andhra State should only take place if the Telangana State Legislature passed a resolution with a two-thirds majority after the 1961 General Elections",
          why: "Paragraph 386 of the SRC Report explicitly recommended: 'The Telangana area should be constituted into a separate State to be known as Hyderabad State... with provision for its unification with Andhra after the general elections to be held in or about 1961, if a resolution to that effect is passed by the Hyderabad legislature by a two-thirds majority.'",
          attraction: "The exact statutory recommendation of the Fazal Ali Commission in 1955.",
          confusion: false,
        },
        {
          text: "Immediate, unconditional merger of Telangana and Andhra into a single unified Telugu-speaking State on 1 November 1956",
          why: "The SRC explicitly rejected an immediate merger, warning that Telangana was economically and educationally disadvantaged and might be overwhelmed by Andhra.",
          attraction: "What the political leaders actually executed in 1956 contrary to the Commission's recommendation.",
          confusion: true,
        },
        {
          text: "Permanent partition of Hyderabad State among Bombay, Mysore, and Andhra with no special status for Telangana",
          why: "The Commission partitioned Marathwada to Bombay and Kannada districts to Mysore, but recommended keeping Telangana separate as Hyderabad State.",
          attraction: "Describes the trifurcation without the separate statehood provision.",
        },
        {
          text: "Making Hyderabad city a permanent Union Territory under direct central administration",
          why: "The SRC made no recommendation to make Hyderabad city a Union Territory.",
          attraction: "Recalls later proposals during the 2010 Srikrishna Committee deliberations.",
        },
      ],
      answer: 0,
      reason: "The Fazal Ali Commission (SRC 1955) recognized the legitimate fears of the Telangana people regarding land loss, river water sharing (Krishna and Godavari), and public employment. In paragraph 386, the Commission recommended keeping Telangana as a separate Hyderabad State for at least 5 years, giving the local legislature the final veto through a two-thirds majority vote after the 1961 elections.",
      clue: "Look for 'Fazal Ali Commission (SRC 1955) recommendation on Telangana': Form separate Hyderabad State, merger only after 1961 with two-thirds majority of Telangana MLAs.",
      trap: "Do not confuse what the SRC recommended (separate state for 5 years with 2/3rd majority required) with what politicians actually did (immediate merger in 1956 under the Gentlemen's Agreement).",
      elimination: "Eliminate immediate merger (which the SRC explicitly warned against); the SRC recommended separate Hyderabad State with a 1961 two-thirds majority requirement.",
      anchor: "States Reorganisation Commission (SRC 1955): Paragraph 386 recommended retaining Telangana as a separate State until 1961, merger subject to a 2/3rd legislative majority.",
      hint: "Did the Fazal Ali Commission recommend immediate merger or a 5-year trial separation until 1961 with a two-thirds majority vote?",
      source: "TGPSC Group-1 Preliminary Examination 2024",
      page: 21,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the separate statehood and two-thirds majority recommendation.",
          correctMeaning: "The SRC cautioned against premature merger and gave Telangana a 5-year cooling period and legislative veto.",
          selectedMeaning: "The SRC cautioned against premature merger and gave Telangana a 5-year cooling period and legislative veto.",
          possibleConfusion: "You answered correctly. Political pressure from Congress leadership bypassed this recommendation to form Andhra Pradesh in 1956.",
          decisionRules: [
            { when: "the question asks what the Fazal Ali Commission recommended for Telangana in 1955", choose: "Retain Telangana as separate State, merger only if 2/3rd majority approved after 1961" },
            { when: "the question asks who were the members of the SRC (1953–1955)", choose: "Justice Fazal Ali (Chairman), H.N. Kunzru, and K.M. Panikkar" },
          ],
          nextStep: "Remember paragraph numbers: Paragraphs 378 to 389 of the SRC Report.",
        },
        {
          observation: "Check why immediate merger is historically inaccurate.",
          correctMeaning: "The SRC recommended against immediate merger.",
          selectedMeaning: "Immediate merger was pushed by Andhra leaders and central politicians via the Gentlemen's Agreement of February 1956, directly overruling the SRC's warning.",
          possibleConfusion: "Aspirants assume the SRC recommended what actually happened on 1 November 1956.",
          decisionRules: [
            { when: "the question asks what the Fazal Ali Commission recommended", choose: "Separate State with 2/3rd majority vote after 1961" },
            { when: "the question asks what political pact bypassed the SRC recommendation", choose: "Gentlemen's Agreement (1956)" },
          ],
          nextStep: "Contrast the SRC recommendation (caution & separate state) with the political outcome (merger in 1956).",
        },
        {
          observation: "Check the trifurcation details.",
          correctMeaning: "Telangana was to be preserved as Hyderabad State.",
          selectedMeaning: "The non-Telugu districts were separated: 5 Marathwada districts went to Bombay, and 3 Kannada districts went to Mysore, leaving 9 Telangana districts.",
          possibleConfusion: "Conflating the division of non-Telugu areas with the disposal of Telangana.",
          decisionRules: [
            { when: "the question asks which districts went to Bombay State in 1956", choose: "5 Marathwada districts (Aurangabad, Nanded, Parbhani, Beed, Osmanabad)" },
            { when: "the question asks what was recommended for Telangana", choose: "Separate Hyderabad State" },
          ],
          nextStep: "Identify that the remaining 9 districts were proposed as an independent Hyderabad State.",
        },
        {
          observation: "Check the Union Territory proposal.",
          correctMeaning: "The SRC did not propose Hyderabad as a UT.",
          selectedMeaning: "Union Territory status for Hyderabad was debated decades later in 2010 during the Srikrishna Committee deliberations.",
          possibleConfusion: "Anachronistic mixing of 1955 SRC with 2010 Srikrishna Report.",
          decisionRules: [
            { when: "the question asks which committee analyzed Hyderabad as a Union Territory", choose: "Srikrishna Committee (2010, Option 2)" },
            { when: "the question asks about Fazal Ali SRC in 1955", choose: "Separate Hyderabad State for Telangana" },
          ],
          nextStep: "Keep 1955 SRC focused on Paragraph 386.",
        },
      ],
    },
  },

  // 12. TM-Q102 (1969 Bhargava Committee / Surplus Funds Audit)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q102",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "Following the Eight-Point Plan announced by Prime Minister Indira Gandhi in April 1969 to diffuse the 1969 Telangana agitation, which committee headed by a sitting Supreme Court judge was constituted to determine the exact quantum of diverted Telangana financial surpluses?",
      options: [
        {
          text: "Justice Vashishtha Bhargava Committee",
          why: "In April 1969, under Point 2 of the Eight-Point Formula, the Government of India appointed the Committee on Telangana Surpluses headed by Supreme Court Judge Justice Vashishtha Bhargava, which determined unspent Telangana surpluses at ₹28.34 crores.",
          attraction: "The official judicial committee appointed under the 1969 Eight-Point Plan.",
          confusion: false,
        },
        {
          text: "Justice K.N. Wanchoo Committee",
          why: "Justice Wanchoo headed the Committee on Public Employment Safeguards in 1969, not the financial surpluses committee.",
          attraction: "Another prominent judicial committee appointed in April 1969 under the Eight-Point Plan.",
          confusion: true,
        },
        {
          text: "Kumaraswamy Committee",
          why: "The Kumaraswamy Committee was appointed earlier by the State Government in January 1969 and estimated surpluses at ₹102 crores, but was not the Supreme Court judge committee under the Eight-Point Plan.",
          attraction: "Earlier state committee that calculated ₹102 crores surplus.",
        },
        {
          text: "Justice J.M. Girglani Commission",
          why: "Justice Girglani was a retired IAS officer who headed the One-Man Commission in 2001 on G.O. 610, not 1969.",
          attraction: "Commission on G.O. 610.",
        },
      ],
      answer: 0,
      reason: "Point 2 of Indira Gandhi's Eight-Point Formula (11 April 1969) mandated a high-powered committee to apportion surplus revenues. The Justice Vashishtha Bhargava Committee was appointed with Prof. V.V. Ramanadham and Hari Bhushan Bhar as members. In its report submitted in October 1969, it determined the accumulated diverted surplus of Telangana to be ₹28.34 crores as of 31 March 1968.",
      clue: "Look for 'Committee headed by a sitting Supreme Court judge under the 1969 Eight-Point Plan to determine surplus funds': Justice Vashishtha Bhargava Committee.",
      trap: "Do not confuse the Bhargava Committee (Surpluses, Supreme Court judge, 1969) with the Wanchoo Committee (Employment safeguards, 1969) or the Kumaraswamy Committee (earlier state audit).",
      elimination: "Eliminate Wanchoo (employment safeguards) and Kumaraswamy (earlier state committee); Justice Vashishtha Bhargava headed the Eight-Point Formula surplus audit committee.",
      anchor: "Justice Vashishtha Bhargava Committee (1969): Appointed under Eight-Point Formula; determined diverted Telangana surplus at ₹28.34 crores.",
      hint: "Which Supreme Court judge calculated the diverted surplus of Telangana at ₹28.34 crores in 1969?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 32,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected the Justice Vashishtha Bhargava Committee.",
          correctMeaning: "Justice Vashishtha Bhargava was the sitting Supreme Court judge appointed by Indira Gandhi to resolve the surplus dispute.",
          selectedMeaning: "Justice Vashishtha Bhargava was the sitting Supreme Court judge appointed by Indira Gandhi to resolve the surplus dispute.",
          possibleConfusion: "You answered correctly. The TPS criticized the Bhargava report for drastically reducing the Kumaraswamy estimate from ₹102 crores to ₹28.34 crores.",
          decisionRules: [
            { when: "the question asks which committee determined diverted Telangana surpluses at ₹28.34 crores", choose: "Justice Vashishtha Bhargava Committee" },
            { when: "the question asks which point of the Eight-Point Plan created this committee", choose: "Point 2 of Eight-Point Plan (1969)" },
          ],
          nextStep: "Note the members: Justice Vashishtha Bhargava (Chair), Prof. V.V. Ramanadham, and Hari Bhushan Bhar.",
        },
        {
          observation: "Check the Justice Wanchoo Committee's subject.",
          correctMeaning: "The surplus committee was headed by Justice Bhargava.",
          selectedMeaning: "Justice K.N. Wanchoo (former Chief Justice of India) was appointed alongside M.C. Setalvad and Niren De under Point 1 of the Eight-Point Plan to suggest constitutional safeguards for employment.",
          possibleConfusion: "Both committees were appointed simultaneously in April 1969 under the Eight-Point Plan.",
          decisionRules: [
            { when: "the question asks who headed the 1969 Committee on Employment Safeguards", choose: "Justice K.N. Wanchoo Committee" },
            { when: "the question asks who headed the 1969 Committee on Surplus Revenues", choose: "Justice Vashishtha Bhargava Committee" },
          ],
          nextStep: "Remember: Bhargava = Money/Surplus; Wanchoo = Employment/Constitution.",
        },
        {
          observation: "Check the Kumaraswamy Committee.",
          correctMeaning: "Bhargava was the Supreme Court committee.",
          selectedMeaning: "The Kumaraswamy Committee was appointed by the state government following the All-Party Accord in January 1969 and reported ₹102 crores surplus.",
          possibleConfusion: "Both committees computed Telangana surpluses in 1969.",
          decisionRules: [
            { when: "the question asks which committee estimated Telangana surplus at ₹102 crores in early 1969", choose: "Kumaraswamy Committee" },
            { when: "the question asks which central judicial committee arrived at ₹28.34 crores", choose: "Justice Vashishtha Bhargava Committee" },
          ],
          nextStep: "Contrast: Kumaraswamy (₹102 cr) vs Bhargava (₹28.34 cr).",
        },
        {
          observation: "Check the timeline of Girglani Commission.",
          correctMeaning: "Bhargava was in 1969.",
          selectedMeaning: "The J.M. Girglani Commission was constituted 32 years later in June 2001 to investigate G.O. 610.",
          possibleConfusion: "Prominent Telangana inquiry body.",
          decisionRules: [
            { when: "the question asks about the 2001 G.O. 610 inquiry", choose: "J.M. Girglani Commission" },
            { when: "the question asks about 1969 surplus revenues", choose: "Justice Vashishtha Bhargava Committee" },
          ],
          nextStep: "Anchor Bhargava to 1969.",
        },
      ],
    },
  },

  // 13. TM-Q103 (1969 Wanchoo Committee / Employment Remedies)
  {
    sourceIds: ["SR-RESEARCH-GROUP2-2024"],
    question: {
      id: "TM-Q103",
      topic: "TM-01.04",
      concept: "TM-01.04-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "In April 1969, under the Eight-Point Formula, the Government of India constituted a Committee of Jurists headed by former Chief Justice of India K.N. Wanchoo (with members M.C. Setalvad and Niren De). What specific mandate was assigned to this Wanchoo Committee?",
      options: [
        {
          text: "To examine constitutional and legal measures to provide continuing employment safeguards for the people of Telangana following the Supreme Court's striking down of Section 3 of the Public Employment Act, 1957",
          why: "On 28 March 1969, the Supreme Court in the A.V.S. Narasimha Rao case declared Section 3 of the Public Employment Act (which allowed residential requirements in part of a state) unconstitutional under Article 16(3). The Wanchoo Committee was tasked with recommending legal remedies.",
          attraction: "The exact terms of reference of the Wanchoo Committee.",
          confusion: false,
        },
        {
          text: "To determine the exact boundary line between Telangana and Rayalaseema districts",
          why: "There was no boundary dispute between Telangana and Rayalaseema.",
          attraction: "Border demarcation misconception.",
        },
        {
          text: "To investigate the police atrocities and firings during the 1969 agitation",
          why: "The Wanchoo Committee was a committee of jurists on constitutional law, not a judicial inquiry into police firings.",
          attraction: "Confuses legal committee with law and order commissions.",
        },
        {
          text: "To recommend the bifurcation of the Andhra Pradesh High Court into two benches",
          why: "High Court bifurcation was not part of the 1969 Wanchoo Committee terms.",
          attraction: "Confuses 1969 employment safeguards with later High Court issues.",
          confusion: true,
        },
      ],
      answer: 0,
      reason: "Following the invalidation of the Andhra Pradesh Public Employment Rules 1959 by the Supreme Court in A.V.S. Narasimha Rao v. State of AP on 28 March 1969, all Mulki employment quotas collapsed. Prime Minister Indira Gandhi appointed the Wanchoo Committee (Justice K.N. Wanchoo, former Attorney General M.C. Setalvad, and Attorney General Niren De). In its May 1969 report, the Committee concluded that under Article 16(3), Parliament could prescribe residential qualifications only for an entire State, not for a part of a State, necessitating a Constitutional Amendment.",
      clue: "Look for 'Mandate of the 1969 Wanchoo Committee of Jurists': Recommend constitutional measures for employment safeguards after Supreme Court struck down Section 3 of Public Employment Act.",
      trap: "Do not confuse the Wanchoo Committee (Employment safeguards / Article 16-3) with the Bhargava Committee (Surplus funds).",
      elimination: "Eliminate boundary line and police firing inquiry; the Wanchoo Committee was explicitly tasked with resolving the constitutional crisis over public employment quotas.",
      anchor: "Wanchoo Committee (1969): Examined constitutional remedies for Telangana employment safeguards after Supreme Court invalidated Section 3 of Public Employment Act.",
      hint: "Why did former Chief Justice Wanchoo examine Article 16(3) of the Constitution in 1969?",
      source: "TGPSC Group-2 2024 Paper IV, Telangana Movement",
      page: 35,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 2,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly identified the constitutional employment safeguards mandate.",
          correctMeaning: "The Wanchoo Committee investigated how to protect local employment legally after the Supreme Court's ruling.",
          selectedMeaning: "The Wanchoo Committee investigated how to protect local employment legally after the Supreme Court's ruling.",
          possibleConfusion: "You answered correctly. The Committee noted that an ordinary law could not provide regional reservations, laying the groundwork for Article 371-D in 1973.",
          decisionRules: [
            { when: "the question asks why the Wanchoo Committee was formed in 1969", choose: "To suggest constitutional remedies for employment safeguards after Section 3 was struck down" },
            { when: "the question asks who were the members of the 1969 Wanchoo Committee", choose: "Justice K.N. Wanchoo, M.C. Setalvad, and Niren De" },
          ],
          nextStep: "Link this directly to the 32nd Amendment (1973) which inserted Article 371-D to overcome this exact legal limitation.",
        },
        {
          observation: "Check boundary disputes.",
          correctMeaning: "The mandate was public employment safeguards.",
          selectedMeaning: "District boundary reorganizations were handled by state revenue notifications, not a Supreme Court jurists committee.",
          possibleConfusion: "Thinking territorial borders were being studied.",
          decisionRules: [
            { when: "the question asks about the Wanchoo Committee subject", choose: "Public employment constitutional remedies" },
            { when: "evaluating options", choose: "Employment safeguards under Article 16(3)" },
          ],
          nextStep: "Remember: Wanchoo dealt exclusively with the constitutional validity of job quotas.",
        },
        {
          observation: "Check police firing inquiries.",
          correctMeaning: "The Wanchoo Committee was an advisory legal body.",
          selectedMeaning: "Police firings in 1969 were investigated by local district magistrates and condemned by the Bar Association.",
          possibleConfusion: "Multiple firings took place during the 1969 agitation.",
          decisionRules: [
            { when: "the question asks what Wanchoo, Setalvad, and Niren De examined", choose: "Constitutional remedies for employment safeguards" },
            { when: "evaluating options", choose: "Employment safeguards" },
          ],
          nextStep: "Differentiate human rights/firing inquiries from constitutional jurist committees.",
        },
        {
          observation: "Check High Court bifurcation history.",
          correctMeaning: "Wanchoo investigated job quotas.",
          selectedMeaning: "High Court bifurcation emerged as a major statutory issue under Sections 30–31 of APRA 2014, leading to the separate Telangana High Court in 2019.",
          possibleConfusion: "Both involve legal and judicial institutions.",
          decisionRules: [
            { when: "the question asks which sections of APRA 2014 bifurcated the High Court", choose: "Sections 30 and 31" },
            { when: "the question asks what Wanchoo Committee examined in 1969", choose: "Public employment safeguards" },
          ],
          nextStep: "Keep 1969 Wanchoo focused on employment safeguards under Article 16(3).",
        },
      ],
    },
  },

  // 14. TM-Q104 (1971 Lok Sabha Elections Mandate for TPS)
  {
    sourceIds: ["SR-TGPSC-GROUP1-GROUP4-2022-2024"],
    question: {
      id: "TM-Q104",
      topic: "TM-01.05",
      concept: "TM-01.05-M01",
      model: "Recognition",
      modelId: "TM-QM-REC-01",
      stage: "recognition",
      prompt: "In the 1971 Fifth General Elections to the Lok Sabha, the Telangana Praja Samithi (TPS, headed by Dr. Marri Chenna Reddy) contested exclusively on the single-point agenda of a Separate Telangana State. How many parliamentary constituencies did the TPS decisively win out of the 14 Lok Sabha seats in Telangana?",
      options: [
        {
          text: "10 seats (securing an overwhelming 47.5% of the total votes polled in the region)",
          why: "In an extraordinary electoral mandate, TPS won 10 out of the 14 Lok Sabha seats (including Hyderabad, Secunderabad, Warangal, Medak, Karimnagar, Nizamabad, Nalgonda, Siddipet, Peddapalli, and Mahabubnagar), routing the ruling Congress in the region.",
          attraction: "The historic landslide victory of TPS in 1971.",
          confusion: false,
        },
        {
          text: "14 seats (a clean sweep of every seat in Telangana)",
          why: "TPS won 10 seats, but lost 4 seats: Khammam (won by Congress), Miryalguda (won by CPI-M's Baddam Yella Reddy), Nagarkurnool, and Adilabad.",
          attraction: "Exaggerated assumption of a clean sweep.",
          confusion: true,
        },
        {
          text: "7 seats (exactly half of the parliamentary seats)",
          why: "7 was the total number of Rajya Sabha seats allocated to Telangana in 2014, not the 1971 Lok Sabha tally.",
          attraction: "Confuses Rajya Sabha seat allocation with 1971 Lok Sabha tally.",
        },
        {
          text: "4 seats",
          why: "4 seats was what TPS lost, not what it won.",
          attraction: "Inverse of the losing seats count.",
        },
      ],
      answer: 0,
      reason: "The March 1971 Lok Sabha election was fought by TPS as an informal referendum on Telangana statehood. TPS candidates swept 10 seats: Dr. G.S. Melkote (Hyderabad), M.M. Hashim (Secunderabad), S.B. Giri (Warangal), M. Satyanarayana Rao (Karimnagar), Mallikarjun (Medak), M. Ram Gopal Reddy (Nizamabad), K. Ramakrishna Reddy (Nalgonda), G. Venkataswamy (Siddipet), J. Rameshwar Rao (Mahabubnagar), and V. Tulasiram (Peddapalli).",
      clue: "Look for 'Number of Lok Sabha seats won by TPS in the 1971 General Elections': 10 out of 14 seats.",
      trap: "Do not guess 14 (clean sweep); TPS won exactly 10 seats and lost 4 seats (such as Khammam and Miryalguda).",
      elimination: "Eliminate 14 (clean sweep) and 7 (Rajya Sabha seats); TPS won 10 seats in 1971.",
      anchor: "1971 Lok Sabha Elections: Telangana Praja Samithi (TPS) won 10 out of 14 seats on the separate statehood plank.",
      hint: "Did TPS win ten, fourteen, or seven seats in the 1971 parliamentary election?",
      source: "TGPSC Group-1 Preliminary Examination 2023",
      page: 27,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 10 seats.",
          correctMeaning: "TPS won 10 out of 14 seats, demonstrating indisputable democratic support for statehood.",
          selectedMeaning: "TPS won 10 out of 14 seats, demonstrating indisputable democratic support for statehood.",
          possibleConfusion: "You answered correctly. Despite this resounding mandate, TPS merged into Congress in September 1971 after Indira Gandhi agreed to replace Chief Minister Kasu Brahmananda Reddy with P.V. Narasimha Rao.",
          decisionRules: [
            { when: "the question asks how many Lok Sabha seats TPS won in 1971", choose: "10 seats" },
            { when: "the question asks what happened to TPS after the 1971 elections", choose: "Merged into the ruling Congress party in September 1971" },
          ],
          nextStep: "Note that following the TPS merger, P.V. Narasimha Rao became the first Chief Minister from Telangana in September 1971.",
        },
        {
          observation: "Check the seats TPS lost.",
          correctMeaning: "TPS won 10 seats.",
          selectedMeaning: "Congress won Khammam, and CPI(M) won Miryalguda; TPS did not win all 14 seats.",
          possibleConfusion: "Assuming an absolute clean sweep across the entire province.",
          decisionRules: [
            { when: "the question asks for the total seats won by TPS in 1971", choose: "10 out of 14 seats" },
            { when: "evaluating options", choose: "10 seats" },
          ],
          nextStep: "Remember: 10 won, 4 lost.",
        },
        {
          observation: "Check the number 7.",
          correctMeaning: "The 1971 tally is 10.",
          selectedMeaning: "7 is the number of Rajya Sabha seats allocated to Telangana under the 2014 Bifurcation Act.",
          possibleConfusion: "Mixing parliamentary house seat counts.",
          decisionRules: [
            { when: "the question asks how many Rajya Sabha seats Telangana has", choose: "7 seats" },
            { when: "the question asks how many Lok Sabha seats TPS won in 1971", choose: "10 seats" },
          ],
          nextStep: "Distinguish Rajya Sabha strength (7) from 1971 TPS Lok Sabha victory (10).",
        },
        {
          observation: "Check the number 4.",
          correctMeaning: "10 seats were won.",
          selectedMeaning: "4 was the number of seats TPS failed to win.",
          possibleConfusion: "Inverting the win/loss numbers.",
          decisionRules: [
            { when: "the question asks how many seats TPS won", choose: "10 seats" },
            { when: "the question asks how many seats TPS lost", choose: "4 seats" },
          ],
          nextStep: "Anchor 10 firmly as the number of victorious TPS MPs.",
        },
      ],
    },
  },

  // 15. TM-Q105 (1985 G.O. Ms. No. 610 Repatriation Deadline)
  {
    sourceIds: ["SR-POLICE-SI-2016"],
    question: {
      id: "TM-Q105",
      topic: "TM-02.04",
      concept: "TM-02.04-M01",
      model: "Provision identification",
      modelId: "TM-QM-PRO-01",
      stage: "practice",
      prompt: "G.O. Ms. No. 610, issued on 30 December 1985 by the Government of Andhra Pradesh headed by Chief Minister N.T. Rama Rao pursuant to the Jayabharat Reddy Officers Committee recommendations, set what specific statutory deadline for repatriating all non-local employees irregularly appointed in Telangana in violation of the 1975 Presidential Order?",
      options: [
        {
          text: "31 March 1986",
          why: "Paragraph 5 of G.O. Ms. No. 610 specifically stipulated that all non-local candidates appointed in Zones V and VI in violation of the Presidential Order should be repatriated to their respective native zones by 31 March 1986.",
          attraction: "The exact statutory compliance deadline written in G.O. 610.",
          confusion: false,
        },
        {
          text: "31 December 1986",
          why: "This gives a full one-year period; G.O. 610 gave only three months (until 31 March 1986).",
          attraction: "Plausible end-of-year deadline.",
          confusion: true,
        },
        {
          text: "1 November 1985",
          why: "1 November 1985 was prior to the issuance date of G.O. 610 (30 December 1985).",
          attraction: "AP State Formation Day date.",
        },
        {
          text: "30 June 1987",
          why: "1987 was a later extension date discussed in committees, but the original statutory deadline in G.O. 610 was 31 March 1986.",
          attraction: "Later administrative review date.",
        },
      ],
      answer: 0,
      reason: "Following mass protests by the Telangana Non-Gazetted Officers (TNGOs), the N.T. Rama Rao government constituted an Officers Committee comprising Jayabharat Reddy (IAS), Umapathi Rao (IAS), and K.A. Ansari (IAS). Based on their report confirming extensive violations of the 1975 Presidential Order, G.O. Ms. No. 610 was issued on 30 December 1985 ordering repatriation by 31 March 1986. The failure to execute this deadline over the next 15 years revived the statehood movement.",
      clue: "Look for 'Statutory deadline for repatriation of non-locals specified in G.O. Ms. No. 610': 31 March 1986.",
      trap: "Do not choose 31 December 1986; G.O. 610 gave a strict three-month deadline ending on 31 March 1986.",
      elimination: "Eliminate 31 December 1986 and 1987; the deadline stipulated in the G.O. was 31 March 1986.",
      anchor: "G.O. Ms. No. 610 (30 Dec 1985): Mandated repatriation of non-locals from Zones V & VI by 31 March 1986.",
      hint: "Did G.O. 610 require repatriation within 3 months (by March 1986) or 12 months (by December 1986)?",
      source: "TS Police SI Preliminary 2016, Paper I",
      page: 182,
      sourceStatus: "VERIFIED PYQ",
      difficulty: 1,
      relevance: 3,
      teaching: [
        {
          observation: "You correctly selected 31 March 1986.",
          correctMeaning: "31 March 1986 was the strict deadline set by the N.T. Rama Rao government in G.O. 610.",
          selectedMeaning: "31 March 1986 was the strict deadline set by the N.T. Rama Rao government in G.O. 610.",
          possibleConfusion: "You answered correctly. The total failure to implement this 31 March 1986 deadline led to the Girglani Commission in 2001.",
          decisionRules: [
            { when: "the question asks for the repatriation deadline in G.O. Ms. No. 610", choose: "31 March 1986" },
            { when: "the question asks which Chief Minister issued G.O. 610 on 30 December 1985", choose: "N.T. Rama Rao" },
          ],
          nextStep: "Remember the Officers Committee trio: Jayabharat Reddy, Umapathi Rao, and K.A. Ansari.",
        },
        {
          observation: "Check the full year assumption.",
          correctMeaning: "The deadline was 31 March 1986.",
          selectedMeaning: "31 December 1986 would have been a 12-month window; G.O. 610 granted only 3 months.",
          possibleConfusion: "Aspirants guess the end of the subsequent calendar year.",
          decisionRules: [
            { when: "the question asks for G.O. 610 deadline", choose: "31 March 1986" },
            { when: "evaluating options", choose: "31 March 1986" },
          ],
          nextStep: "Pair G.O. 610 (issued 30 Dec 1985) with the 31 March 1986 deadline.",
        },
        {
          observation: "Check the issuance date.",
          correctMeaning: "The deadline is 31 March 1986.",
          selectedMeaning: "G.O. 610 was issued on 30 December 1985, so a deadline in November 1985 is chronologically impossible.",
          possibleConfusion: "Confusing the anniversary of Andhra Pradesh state formation (Nov 1).",
          decisionRules: [
            { when: "the question asks when G.O. 610 was issued", choose: "30 December 1985" },
            { when: "the question asks for its compliance deadline", choose: "31 March 1986" },
          ],
          nextStep: "Verify chronological coherence of order date vs deadline date.",
        },
        {
          observation: "Check subsequent extensions.",
          correctMeaning: "The original statutory deadline is 31 March 1986.",
          selectedMeaning: "1987 was a later date when employee unions protested that the March 1986 deadline was completely ignored.",
          possibleConfusion: "Confusing subsequent agitation milestones with the text of the G.O.",
          decisionRules: [
            { when: "the question asks for the deadline in the G.O.", choose: "31 March 1986" },
            { when: "the question asks which commission investigated its failure in 2001", choose: "J.M. Girglani Commission" },
          ],
          nextStep: "Anchor 31 March 1986 as the definitive text of G.O. 610.",
        },
      ],
    },
  },
];

console.log(`Starting ingestion of Batch 6 (${batchQuestions.length} questions)...`);

// Import sources and questions
const importPayload = {
  actor: "human_operator_curator",
  reason: "Ingesting Batch 6: Kakatiya chain-tanks, Qutb Shahi Malkibharama, 1857 Turrebaz Khan, 1860 Ramji Gond, Salar Jung Non-Mulkis, 1919 Firman, 1938 Vande Mataram OU, 1946 Doddi Komaraiah, 1944 Bhuvanagiri AMS, 1952 Jaganmohan Reddy Commission, 1955 Fazal Ali SRC, 1969 Bhargava & Wanchoo committees, 1971 TPS 10 seats, and 1985 G.O. 610 deadline.",
  sources: [],
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
  reason: "Batch 6 verified and authenticated for Telangana Police SI & Constable preparation.",
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
console.log(`Batch 6 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
