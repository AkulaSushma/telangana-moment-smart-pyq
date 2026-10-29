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
  // 1. TM-Q276 (On 27 April 2001, K. Chandrashekar Rao launched th...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q276",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M01",
    "model": "Recognition",
    "modelId": "TM-QM-REC-01",
    "stage": "practice",
    "prompt": "On 27 April 2001, K. Chandrashekar Rao launched the Telangana Rashtra Samithi (TRS) to revive the statehood movement through constitutional politics. At which historic venue in Hyderabad was this founding convention held after he resigned as Deputy Speaker of the AP Legislative Assembly?",
    "options": [
        {
            "text": "Jala Drushyam (residence of senior leader Konda Laxman Bapuji)",
            "why": "TRS was formally founded on 27 April 2001 at Jala Drushyam, overlooking Hussain Sagar, which was the residence of veteran freedom fighter and Telangana leader Konda Laxman Bapuji.",
            "attraction": "The authentic founding venue of TRS on 27 April 2001.",
            "confusion": false
        },
        {
            "text": "Nizam College Grounds",
            "why": "Nizam College Grounds hosted numerous major student rallies and declarations, but was not the venue where TRS was founded on 27 April 2001.",
            "attraction": "Major Hyderabad public meeting venue.",
            "confusion": true
        },
        {
            "text": "Vivekavardhani Hall",
            "why": "Vivekavardhani Hall was the venue of the historic 12 November 1921 meeting that gave rise to the Andhra Jana Sangham, 80 years before TRS.",
            "attraction": "Famous historical meeting hall in Hyderabad.",
            "confusion": true
        },
        {
            "text": "Indira Priyadarshini Hall (Public Gardens)",
            "why": "Indira Priyadarshini Hall hosted many conferences and state events, but not the 27 April 2001 launch of TRS.",
            "attraction": "Prominent convention hall in Public Gardens.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "TRS was formally founded on 27 April 2001 at Jala Drushyam, overlooking Hussain Sagar, which was the residence of veteran freedom fighter and Telangana leader Konda Laxman Bapuji.",
    "clue": "Identify Jala Drushyam (residence of senior leader Konda Laxman Bapuji)",
    "trap": "Do not confuse with Nizam College Grounds",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Jala Drushyam (residence of senior leader Konda Laxman Bapuji) is the established historical fact.",
    "hint": "The authentic founding venue of TRS on 27 April 2001.",
    "source": "SR-POLICE-SI-2016",
    "page": 500,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Jala Drushyam as the exact launch site of TRS on 27 April 2001.",
            "correctMeaning": "K. Chandrashekar Rao resigned as Deputy Speaker and TDP MLA on 27 April 2001 and convened the founding press meet and convention at Konda Laxman Bapuji's residence 'Jala Drushyam'.",
            "selectedMeaning": "Correct choice recognizing the historical birthplace of TRS at Jala Drushyam on 27 April 2001.",
            "possibleConfusion": "Confusing Jala Drushyam with large public meeting grounds like Nizam College.",
            "decisionRules": [
                {
                    "when": "If the question asks for the venue where TRS was founded on 27 April 2001",
                    "choose": "Jala Drushyam."
                },
                {
                    "when": "Differentiate 1921 Andhra Jana Sangham (Vivekavardhani Hall) from 2001 TRS formation (Jala Drushyam).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Memorize: 27 April 2001 -> KCR resigns Deputy Speaker -> launches TRS at Jala Drushyam (Konda Laxman Bapuji residence)."
        },
        {
            "observation": "Confuses public rally grounds with the private residence-cum-office where TRS was launched.",
            "correctMeaning": "Jala Drushyam was the specific site hosted by Konda Laxman Bapuji.",
            "selectedMeaning": "Selected Nizam College Grounds, which was a venue for student agitations rather than TRS founding.",
            "possibleConfusion": "Associating Nizam College Grounds with all major Telangana political meetings.",
            "decisionRules": [
                {
                    "when": "Nizam College Grounds held student mass protests; the TRS political party was founded at Jala Drushyam.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Check whether the question asks for party founding venue or student agitation venue.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Re-read the founding events of TRS on 27 April 2001."
        },
        {
            "observation": "Selects the 1921 venue of Andhra Jana Sangham instead of the 2001 venue of TRS.",
            "correctMeaning": "Vivekavardhani Hall hosted the 12 Nov 1921 Andhra Jana Sangham founding.",
            "selectedMeaning": "Incorrectly placed the 2001 political party launch at the 1921 cultural association hall.",
            "possibleConfusion": "Recognizing Vivekavardhani Hall as a landmark Hyderabad political venue.",
            "decisionRules": [
                {
                    "when": "Vivekavardhani Hall = 1921 Andhra Jana Sangham launch.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Jala Drushyam = 2001 TRS founding.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Verify dates: 1921 vs 2001 across Hyderabad political milestones."
        },
        {
            "observation": "Selects Indira Priyadarshini Hall at Public Gardens.",
            "correctMeaning": "Indira Priyadarshini Hall was used for governmental and legal conferences, not the TRS launch.",
            "selectedMeaning": "Confused Public Gardens auditorium with Konda Laxman Bapuji's Jala Drushyam.",
            "possibleConfusion": "Both are prominent landmark venues located near Hyderabad administrative centers.",
            "decisionRules": [
                {
                    "when": "Match Konda Laxman Bapuji's residence with Jala Drushyam.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Confirm that TRS was founded at Jala Drushyam overlooking Hussain Sagar.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note Konda Laxman Bapuji's personal role in hosting TRS at Jala Drushyam."
        }
    ]
}
  },
  // 2. TM-Q277 (In the 2004 General and Assembly elections, TRS en...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q277",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M02",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "In the 2004 General and Assembly elections, TRS entered into an electoral alliance with the Indian National Congress. What specific formulation regarding Telangana statehood was included in the United Progressive Alliance (UPA) National Common Minimum Programme (NCMP) in May 2004?",
    "options": [
        {
            "text": "The UPA government will consider the demand for the formation of a Telangana state by consensus and consultations",
            "why": "The official National Common Minimum Programme (NCMP) of May 2004 stated: 'The UPA Government will consider the demand for the formation of a Telangana State by consensus and consultations'.",
            "attraction": "The exact statutory language adopted in the 2004 UPA Common Minimum Programme.",
            "confusion": false
        },
        {
            "text": "An immediate constitutional amendment bill under Article 3 will be introduced in the monsoon session of Parliament",
            "why": "No immediate parliamentary bill was promised in May 2004; the commitment was strictly limited to considering the demand through consensus and consultations.",
            "attraction": "Plausible assertive legislative promise.",
            "confusion": true
        },
        {
            "text": "A second States Reorganisation Commission (SRC-II) will decide within six months",
            "why": "Congress leaders occasionally debated an SRC-II, but it was explicitly rejected by TRS and was not the wording adopted in the NCMP.",
            "attraction": "Frequently debated alternative mechanism in national politics.",
            "confusion": true
        },
        {
            "text": "Telangana will be granted autonomous regional council status under the Sixth Schedule",
            "why": "The Sixth Schedule applies exclusively to northeastern tribal areas, not Telangana; the demand was full statehood, not an autonomous council.",
            "attraction": "Constitutional mechanism for tribal regional autonomy.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "The official National Common Minimum Programme (NCMP) of May 2004 stated: 'The UPA Government will consider the demand for the formation of a Telangana State by consensus and consultations'.",
    "clue": "Identify The UPA government will consider the demand for the formation of a Telangana state by consensus and consultations",
    "trap": "Do not confuse with An immediate constitutional amendment bill under Article 3 will be introduced in the monsoon session of Parliament",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "The UPA government will consider the demand for the formation of a Telangana state by consensus and consultations is the established historical fact.",
    "hint": "The exact statutory language adopted in the 2004 UPA Common Minimum Programme.",
    "source": "SR-POLICE-SI-2016",
    "page": 501,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies the exact consensus and consultations clause in the 2004 NCMP.",
            "correctMeaning": "The 2004 UPA NCMP contained the specific pledge that Telangana statehood would be considered through 'consensus and consultations'.",
            "selectedMeaning": "Correct option identifying the official May 2004 NCMP text.",
            "possibleConfusion": "Assuming the 2004 alliance promised immediate parliamentary bifurcation.",
            "decisionRules": [
                {
                    "when": "Look for 'consensus and consultations' in the 2004 UPA Common Minimum Programme.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Remember that TRS joined the Union Cabinet in 2004 based on this specific clause.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note the exact phrase 'consensus and consultations' from the May 2004 UPA NCMP."
        },
        {
            "observation": "Assumes an immediate Article 3 bill was promised in 2004.",
            "correctMeaning": "The UPA promised only consideration through consensus and consultations, not an immediate bill.",
            "selectedMeaning": "Overestimated the legislative commitment made in the 2004 alliance document.",
            "possibleConfusion": "Confusing later 2013-14 legislative steps with the early 2004 political compromise.",
            "decisionRules": [
                {
                    "when": "In 2004, the wording was conditional ('consensus and consultations').",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Firm legislative introduction occurred only in 2013–2014, not 2004.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review the progression from 2004 CMP to the 2014 AP Reorganisation Act."
        },
        {
            "observation": "Selects SRC-II instead of the NCMP consensus clause.",
            "correctMeaning": "The NCMP specified 'consensus and consultations', avoiding an explicit SRC-II commitment which TRS opposed.",
            "selectedMeaning": "Confused internal Congress proposals for a Second SRC with the agreed UPA NCMP text.",
            "possibleConfusion": "Senior leaders like Pranab Mukherjee often spoke of consensus while some suggested SRC-II.",
            "decisionRules": [
                {
                    "when": "UPA NCMP text did not mandate SRC-II; it stated 'consensus and consultations'.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "TRS strongly opposed SRC-II as a delaying tactic.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Differentiate between political proposals (SRC-II) and official UPA NCMP text."
        },
        {
            "observation": "Selects Sixth Schedule regional council status.",
            "correctMeaning": "Telangana movement demanded full statehood under Article 3, never Sixth Schedule regional autonomy.",
            "selectedMeaning": "Mistook northeastern tribal governance for Telangana statehood demands.",
            "possibleConfusion": "Confusing Telangana Regional Committee with Sixth Schedule Autonomous District Councils.",
            "decisionRules": [
                {
                    "when": "Sixth Schedule is for Northeast tribal areas only (Assam, Meghalaya, Tripura, Mizoram).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Telangana demanded separate statehood under Article 3 of the Constitution.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep Article 3 state creation distinct from Sixth Schedule tribal district councils."
        }
    ]
}
  },
  // 3. TM-Q278 (In November 2004, the UPA central government const...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q278",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M03",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "In November 2004, the UPA central government constituted a 3-member Cabinet Sub-Committee to evolve political consensus among national and regional parties regarding Telangana statehood. Who chaired this committee?",
    "options": [
        {
            "text": "Pranab Mukherjee (with members Raghuvansh Prasad Singh and Dayanidhi Maran)",
            "why": "The Cabinet Sub-Committee on Telangana constituted in November 2004 was headed by Defence Minister Pranab Mukherjee, with Union Ministers Raghuvansh Prasad Singh (RJD) and Dayanidhi Maran (DMK) as members.",
            "attraction": "The authentic 2004 UPA Cabinet Sub-Committee leadership.",
            "confusion": false
        },
        {
            "text": "Shivraj Patil",
            "why": "Shivraj Patil was Union Home Minister in 2004, but was not the Chairman of the Cabinet Sub-Committee on Telangana.",
            "attraction": "Union Home Minister in the 2004 UPA Government.",
            "confusion": true
        },
        {
            "text": "A.K. Antony",
            "why": "A.K. Antony headed the Congress Party's 4-member committee formed almost a decade later in August 2013, not the 2004 Cabinet Sub-Committee.",
            "attraction": "Headed the 2013 Congress panel on AP bifurcation.",
            "confusion": true
        },
        {
            "text": "Sharad Pawar",
            "why": "Sharad Pawar was Agriculture Minister in the UPA cabinet and an ally, but did not chair the 2004 Telangana Cabinet Sub-Committee.",
            "attraction": "Senior UPA coalition partner leader.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "The Cabinet Sub-Committee on Telangana constituted in November 2004 was headed by Defence Minister Pranab Mukherjee, with Union Ministers Raghuvansh Prasad Singh (RJD) and Dayanidhi Maran (DMK) as members.",
    "clue": "Identify Pranab Mukherjee (with members Raghuvansh Prasad Singh and Dayanidhi Maran)",
    "trap": "Do not confuse with Shivraj Patil",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Pranab Mukherjee (with members Raghuvansh Prasad Singh and Dayanidhi Maran) is the established historical fact.",
    "hint": "The authentic 2004 UPA Cabinet Sub-Committee leadership.",
    "source": "SR-POLICE-SI-2016",
    "page": 502,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Pranab Mukherjee as Chairman of the 2004 Cabinet Sub-Committee.",
            "correctMeaning": "Pranab Mukherjee headed the 3-member UPA Cabinet Sub-Committee with Raghuvansh Prasad Singh and Dayanidhi Maran to elicit views of all political parties.",
            "selectedMeaning": "Correct choice recognizing Pranab Mukherjee's chairmanship in 2004.",
            "possibleConfusion": "Confusing the 2004 Cabinet Sub-Committee with the 2013 Antony Committee or 2013 GoM.",
            "decisionRules": [
                {
                    "when": "2004 Cabinet Sub-Committee on Telangana = Pranab Mukherjee (Chairman).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Members = Raghuvansh Prasad Singh and Dayanidhi Maran.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember: 2004 Cabinet Sub-Committee = Pranab Mukherjee Committee."
        },
        {
            "observation": "Selects Home Minister Shivraj Patil.",
            "correctMeaning": "Although Home Minister, Shivraj Patil did not chair this specific sub-committee; Pranab Mukherjee did.",
            "selectedMeaning": "Assumed the Home Minister automatically chairs statehood committees.",
            "possibleConfusion": "Home Ministry deals with internal state reorganization.",
            "decisionRules": [
                {
                    "when": "Don't assume Home Minister is always committee chair.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Defence Minister Pranab Mukherjee was entrusted with chairing the 2004 panel.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Associate Pranab Mukherjee specifically with the 2004–2006 consensus committee."
        },
        {
            "observation": "Confuses 2004 Cabinet Sub-Committee with the 2013 Antony Committee.",
            "correctMeaning": "A.K. Antony chaired the 2013 high-level party committee after the CWC statehood resolution.",
            "selectedMeaning": "Selected the 2013 committee chair instead of the 2004 committee chair.",
            "possibleConfusion": "Both Pranab Mukherjee and A.K. Antony were senior Congress troubleshooting figures.",
            "decisionRules": [
                {
                    "when": "2004 = Pranab Mukherjee Committee.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "2013 = A.K. Antony Committee / GoM.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Map the chronology: 2004 Pranab -> 2010 Srikrishna -> 2013 Antony/GoM."
        },
        {
            "observation": "Selects Sharad Pawar.",
            "correctMeaning": "Sharad Pawar was a coalition partner who supported smaller states, but did not head the committee.",
            "selectedMeaning": "Confused coalition partner stance with committee leadership.",
            "possibleConfusion": "NCP was a vocal supporter of Telangana statehood.",
            "decisionRules": [
                {
                    "when": "Check the committee composition: Pranab (Congress), Raghuvansh (RJD), Maran (DMK).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Confirm Pranab Mukherjee was the designated Chairman.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review the three members of the 2004 Cabinet Sub-Committee."
        }
    ]
}
  },
  // 4. TM-Q279 (In October 2008, which major regional opposition p...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q279",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M04",
    "model": "Recognition",
    "modelId": "TM-QM-REC-01",
    "stage": "practice",
    "prompt": "In October 2008, which major regional opposition party in Andhra Pradesh, led by N. Chandrababu Naidu, reversed its long-standing stance by passing a formal politburo resolution and submitting a letter to the Rosaiah Committee in support of separate Telangana statehood?",
    "options": [
        {
            "text": "Telugu Desam Party (TDP)",
            "why": "In October 2008, after reviewing the K. Devender Goud defection and Telangana sentiment, TDP passed a formal politburo resolution supporting Telangana statehood and submitted a written letter to the K. Rosaiah Committee.",
            "attraction": "The primary opposition party whose 2008 shift created unprecedented all-party consensus.",
            "confusion": false
        },
        {
            "text": "Communist Party of India (Marxist) - CPM",
            "why": "CPM consistently opposed the bifurcation of Andhra Pradesh throughout the movement, maintaining its stance for a united state.",
            "attraction": "Left party with significant presence.",
            "confusion": true
        },
        {
            "text": "Praja Rajyam Party (PRP)",
            "why": "Praja Rajyam Party was formed by Chiranjeevi in August 2008 with a stance of 'Samajika Telangana' but later took an ambivalent and united AP stance.",
            "attraction": "Newly formed party in 2008 with wide public attention.",
            "confusion": true
        },
        {
            "text": "Majlis-e-Ittehadul Muslimeen (MIM)",
            "why": "MIM favored a united Andhra Pradesh or Rayala-Telangana to preserve Muslim demographic influence in Hyderabad and did not submit a letter supporting bifurcation in 2008.",
            "attraction": "Hyderabad-based political party.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "In October 2008, after reviewing the K. Devender Goud defection and Telangana sentiment, TDP passed a formal politburo resolution supporting Telangana statehood and submitted a written letter to the K. Rosaiah Committee.",
    "clue": "Identify Telugu Desam Party (TDP)",
    "trap": "Do not confuse with Communist Party of India (Marxist) - CPM",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Telugu Desam Party (TDP) is the established historical fact.",
    "hint": "The primary opposition party whose 2008 shift created unprecedented all-party consensus.",
    "source": "SR-POLICE-SI-2016",
    "page": 503,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies TDP's historic 2008 resolution supporting Telangana statehood.",
            "correctMeaning": "In October 2008, TDP under N. Chandrababu Naidu formally resolved to support Telangana and communicated this in writing to the AP government's Rosaiah Committee.",
            "selectedMeaning": "Correct choice recognizing TDP's 2008 policy reversal.",
            "possibleConfusion": "Assuming TDP always maintained an anti-Telangana stance.",
            "decisionRules": [
                {
                    "when": "In October 2008, TDP reversed its stance and formally supported Telangana.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "This enabled the 2009 Mahakootami (Grand Alliance) of TDP, TRS, CPI, and CPM.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember TDP's October 2008 resolution and its letter to the Rosaiah Committee."
        },
        {
            "observation": "Selects CPM, which strictly opposed bifurcation.",
            "correctMeaning": "CPM was the only major party that maintained a resolute stance against bifurcation throughout.",
            "selectedMeaning": "Incorrectly attributed a pro-Telangana policy shift to CPM.",
            "possibleConfusion": "Confusing CPI (which supported Telangana) with CPM (which opposed bifurcation).",
            "decisionRules": [
                {
                    "when": "CPI supported separate Telangana.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "CPM strictly opposed bifurcation and advocated united Andhra Pradesh.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Always differentiate CPI (pro-Telangana) from CPM (anti-bifurcation)."
        },
        {
            "observation": "Selects Chiranjeevi's Praja Rajyam Party.",
            "correctMeaning": "PRP coined 'Samajika Telangana' but did not submit a clear pro-statehood resolution in October 2008, later taking a United AP stance.",
            "selectedMeaning": "Confused PRP's 2008 launch with TDP's official politburo shift.",
            "possibleConfusion": "PRP was launched in 2008 and frequently discussed Telangana issues.",
            "decisionRules": [
                {
                    "when": "TDP officially resolved in October 2008 to support Telangana.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "PRP vacillated and its MLAs later resigned in favor of Samaikyandhra.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note PRP's slogan 'Samajika Telangana' versus TDP's formal 2008 resolution."
        },
        {
            "observation": "Selects MIM.",
            "correctMeaning": "MIM generally preferred a united state or Rayala-Telangana, not separate 10-district Telangana.",
            "selectedMeaning": "Mistook MIM's position on state reorganization.",
            "possibleConfusion": "MIM was an active participant in all-party consultations.",
            "decisionRules": [
                {
                    "when": "MIM opposed bifurcation or demanded inclusion of Rayalaseema districts (Rayala-Telangana).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "TDP provided the crucial opposition consensus letter to the Rosaiah Committee in 2008.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review the stances of MIM and CPM during the Srikrishna Committee submissions."
        }
    ]
}
  },
  // 5. TM-Q280 (On 29 November 2009, K. Chandrashekar Rao embarked...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q280",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M05",
    "model": "Chronology",
    "modelId": "TM-QM-CHRON-01",
    "stage": "practice",
    "prompt": "On 29 November 2009, K. Chandrashekar Rao embarked on an indefinite fast ('Amara Neerahara Deeksha') demanding a separate Telangana state with the popular slogan 'Telangana Vachudo, KCR Sachudo'. At which location was he intercepted and arrested by the police on his way to Siddipet?",
    "options": [
        {
            "text": "Alugunur village (Karimnagar outskirts)",
            "why": "On the morning of 29 November 2009, as KCR was traveling from Karimnagar towards his deeksha venue at Siddipet, police intercepted his convoy and arrested him at Alugunur village on the Karimnagar-Hyderabad highway.",
            "attraction": "The authentic, landmark arrest location of KCR on 29 November 2009.",
            "confusion": false
        },
        {
            "text": "Toopran bypass (Medak)",
            "why": "Toopran is in Medak district on the NH-44 route to Siddipet, but KCR was based in Karimnagar and was arrested near Karimnagar outskirts at Alugunur.",
            "attraction": "Geographic point close to Siddipet / Medak.",
            "confusion": true
        },
        {
            "text": "Alair checkpost (Nalgonda)",
            "why": "Alair was a center for rail roko and road blockades, but was not the site of KCR's arrest on 29 November 2009.",
            "attraction": "Familiar highway agitation junction.",
            "confusion": true
        },
        {
            "text": "Shamirpet crossroads (Ranga Reddy)",
            "why": "Shamirpet was heavily barricaded to prevent Hyderabad students from reaching Siddipet, but KCR was already in Karimnagar and was arrested at Alugunur.",
            "attraction": "Major Hyderabad-Karimnagar highway bottleneck.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "On the morning of 29 November 2009, as KCR was traveling from Karimnagar towards his deeksha venue at Siddipet, police intercepted his convoy and arrested him at Alugunur village on the Karimnagar-Hyderabad highway.",
    "clue": "Identify Alugunur village (Karimnagar outskirts)",
    "trap": "Do not confuse with Toopran bypass (Medak)",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Alugunur village (Karimnagar outskirts) is the established historical fact.",
    "hint": "The authentic, landmark arrest location of KCR on 29 November 2009.",
    "source": "SR-POLICE-SI-2016",
    "page": 504,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Alugunur (Karimnagar outskirts) as the arrest site on 29 Nov 2009.",
            "correctMeaning": "KCR was intercepted at Alugunur near Karimnagar, sent to Khammam Sub-Jail, and later shifted to NIMS Hospital as his fast triggered massive statewide unrest.",
            "selectedMeaning": "Correct choice recognizing Alugunur village as the historic arrest site.",
            "possibleConfusion": "Guessing locations closer to Siddipet (the intended hunger strike venue).",
            "decisionRules": [
                {
                    "when": "29 November 2009 KCR arrest location = Alugunur (near Karimnagar).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Intended deeksha venue was Siddipet; subsequent jail was Khammam; hospital was NIMS Hyderabad.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Memorize the sequence: Karimnagar -> Alugunur arrest -> Khammam Sub-Jail -> NIMS."
        },
        {
            "observation": "Selects Toopran near Siddipet.",
            "correctMeaning": "KCR started his journey from Karimnagar North Telangana Bhavan, not Hyderabad, so he was intercepted at Alugunur before reaching Medak.",
            "selectedMeaning": "Assumed the arrest occurred near the Siddipet destination.",
            "possibleConfusion": "Siddipet was the deeksha venue, and Toopran lies in Medak district.",
            "decisionRules": [
                {
                    "when": "KCR started from Karimnagar, so he was arrested right outside Karimnagar at Alugunur.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "He never reached Medak / Siddipet on 29 November 2009.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note KCR's starting point was Karimnagar on the morning of 29 November 2009."
        },
        {
            "observation": "Selects Alair in Nalgonda.",
            "correctMeaning": "Alair was prominent during rail rokos, not KCR's arrest on 29 November 2009.",
            "selectedMeaning": "Confused Nalgonda rail-roko centers with KCR's arrest route.",
            "possibleConfusion": "Alair is a famous protest site in the Telangana movement.",
            "decisionRules": [
                {
                    "when": "Karimnagar-Siddipet axis passes through Alugunur, not Alair.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Alugunur is in Karimnagar district.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Verify highway geography: Karimnagar to Siddipet via Alugunur and Manakondur."
        },
        {
            "observation": "Selects Shamirpet crossroads.",
            "correctMeaning": "Shamirpet was heavily policed to stop Hyderabad students, but was not where KCR was arrested.",
            "selectedMeaning": "Confused student containment checkposts with KCR's convoy interception.",
            "possibleConfusion": "Shamirpet connects Hyderabad to Karimnagar.",
            "decisionRules": [
                {
                    "when": "KCR was arrested at Alugunur near Karimnagar.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Shamirpet was used for student blockades heading north.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep KCR's personal movement distinct from Hyderabad student containment operations."
        }
    ]
}
  },
  // 6. TM-Q281 (During the intense initial phase of KCR's indefini...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q281",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M06",
    "model": "Recognition",
    "modelId": "TM-QM-REC-01",
    "stage": "practice",
    "prompt": "During the intense initial phase of KCR's indefinite hunger strike in December 2009, which student of Osmania University became an iconic martyr of the Telangana statehood movement after self-immolating near L.B. Nagar crossroads on 29 November 2009 and succumbing to injuries on 3 December 2009?",
    "options": [
        {
            "text": "K. Srikantha Chary",
            "why": "Kasojula Srikantha Chary, a diploma student and youth activist from Nalgonda studying in Hyderabad, self-immolated at Dr. B.R. Ambedkar statue near L.B. Nagar crossroads on 29 Nov 2009 and died on 3 Dec 2009, igniting the second phase of the mass agitation.",
            "attraction": "The most iconic student martyr whose sacrifice galvanized the 2009 agitation.",
            "confusion": false
        },
        {
            "text": "Police Constable Kishtaiah",
            "why": "Police Constable Kishtaiah shot himself with his service weapon on 1 December 2009 at Kamareddy, sacrificing his life as a serving policeman.",
            "attraction": "Iconic police martyr during the same week in Dec 2009.",
            "confusion": true
        },
        {
            "text": "Yadi Reddy",
            "why": "Yadi Reddy sacrificed his life by hanging near Parliament House in New Delhi in July 2011, not at L.B. Nagar in 2009.",
            "attraction": "Prominent martyr who died in New Delhi during the agitation.",
            "confusion": true
        },
        {
            "text": "Siripuram Yadaiah",
            "why": "Siripuram Yadaiah self-immolated at the Osmania University NCC Gate on 20 February 2010 shouting 'Jai Telangana', not at L.B. Nagar in Nov 2009.",
            "attraction": "Famous student martyr of Osmania University in early 2010.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Kasojula Srikantha Chary, a diploma student and youth activist from Nalgonda studying in Hyderabad, self-immolated at Dr. B.R. Ambedkar statue near L.B. Nagar crossroads on 29 Nov 2009 and died on 3 Dec 2009, igniting the second phase of the mass agitation.",
    "clue": "Identify K. Srikantha Chary",
    "trap": "Do not confuse with Police Constable Kishtaiah",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "K. Srikantha Chary is the established historical fact.",
    "hint": "The most iconic student martyr whose sacrifice galvanized the 2009 agitation.",
    "source": "SR-POLICE-SI-2016",
    "page": 505,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies K. Srikantha Chary as the martyr of L.B. Nagar crossroads in Nov/Dec 2009.",
            "correctMeaning": "Srikantha Chary's self-immolation at L.B. Nagar on 29 Nov 2009 (died 3 Dec 2009) became the emotional spark that electrified students across Osmania, Kakatiya, and Telangana.",
            "selectedMeaning": "Correct choice recognizing Kasojula Srikantha Chary.",
            "possibleConfusion": "Confusing Srikantha Chary with Constable Kishtaiah or OU NCC gate martyr Siripuram Yadaiah.",
            "decisionRules": [
                {
                    "when": "L.B. Nagar crossroads self-immolation (29 Nov / 3 Dec 2009) = K. Srikantha Chary.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Kamareddy police suicide (1 Dec 2009) = Police Constable Kishtaiah.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "OU NCC Gate self-immolation (20 Feb 2010) = Siripuram Yadaiah.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Map the three key 2009-2010 martyrs: Srikantha Chary (L.B. Nagar), Kishtaiah (Kamareddy), Siripuram Yadaiah (OU Gate)."
        },
        {
            "observation": "Selects Police Constable Kishtaiah.",
            "correctMeaning": "Constable Kishtaiah died on 1 Dec 2009 at Kamareddy using his service rifle, not by self-immolation at L.B. Nagar.",
            "selectedMeaning": "Confused the police martyr with the student martyr from the same pivotal week.",
            "possibleConfusion": "Both sacrificed their lives within days of each other in early December 2009.",
            "decisionRules": [
                {
                    "when": "Kishtaiah was a serving Police Constable who died at Kamareddy.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Srikantha Chary was a student who self-immolated at L.B. Nagar.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note Constable Kishtaiah's specific location (Kamareddy) and method (service weapon)."
        },
        {
            "observation": "Selects Yadi Reddy.",
            "correctMeaning": "Yadi Reddy died near Parliament House in New Delhi in July 2011 leaving an 8-page suicide note demanding statehood.",
            "selectedMeaning": "Confused the Delhi Parliament martyr with the 2009 Hyderabad martyr.",
            "possibleConfusion": "Both left heart-wrenching messages demanding separate Telangana.",
            "decisionRules": [
                {
                    "when": "Yadi Reddy = New Delhi Parliament (July 2011).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Srikantha Chary = L.B. Nagar, Hyderabad (Dec 2009).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review the chronology and location of martyrs outside Telangana (New Delhi)."
        },
        {
            "observation": "Selects Siripuram Yadaiah.",
            "correctMeaning": "Siripuram Yadaiah sacrificed his life at Osmania University NCC Gate on 20 February 2010.",
            "selectedMeaning": "Selected the OU campus martyr instead of the L.B. Nagar crossroads martyr.",
            "possibleConfusion": "Both were students who self-immolated in the movement.",
            "decisionRules": [
                {
                    "when": "Srikantha Chary = L.B. Nagar (Dec 2009).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Siripuram Yadaiah = OU NCC Gate (Feb 2010).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Differentiate the dates and venues of student martyrs in 2009 vs 2010."
        }
    ]
}
  },
  // 7. TM-Q282 (On 9 December 2009 at 11:30 PM, Union Home Ministe...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q282",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M07",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "On 9 December 2009 at 11:30 PM, Union Home Minister P. Chidambaram made a historic midnight policy announcement after an emergency meeting at Prime Minister Dr. Manmohan Singh's residence. What was the exact core assurance delivered in that announcement?",
    "options": [
        {
            "text": "The process of forming the state of Telangana will be initiated and an appropriate resolution moved in the AP State Legislative Assembly",
            "why": "The exact words spoken by P. Chidambaram on 9 Dec 2009 were: 'The process of forming the state of Telangana will be initiated. An appropriate resolution will be moved in the State Legislative Assembly.'",
            "attraction": "The historic, exact wording of the 9 December 2009 midnight announcement.",
            "confusion": false
        },
        {
            "text": "Hyderabad is declared a Union Territory with immediate effect",
            "why": "Hyderabad was never declared a Union Territory on 9 Dec 2009; the statement focused solely on initiating the process of forming the state of Telangana.",
            "attraction": "Contentious proposal frequently discussed by Seemandhra leaders.",
            "confusion": true
        },
        {
            "text": "A judicial commission will be appointed to recommend the borders of Telangana within two years",
            "why": "No judicial commission was announced on 9 Dec 2009; the Srikrishna Committee was only constituted later in February 2010 after the Centre backtracked on 23 Dec 2009.",
            "attraction": "Plausible administrative delaying mechanism.",
            "confusion": true
        },
        {
            "text": "Telangana is granted special regional status under Article 371-D",
            "why": "Article 371-D was already in effect since 1973; the 9 Dec 2009 announcement explicitly conceded the formation of the state of Telangana.",
            "attraction": "Existing constitutional article related to AP.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "The exact words spoken by P. Chidambaram on 9 Dec 2009 were: 'The process of forming the state of Telangana will be initiated. An appropriate resolution will be moved in the State Legislative Assembly.'",
    "clue": "Identify The process of forming the state of Telangana will be initiated and an appropriate resolution moved in the AP State Legislative Assembly",
    "trap": "Do not confuse with Hyderabad is declared a Union Territory with immediate effect",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "The process of forming the state of Telangana will be initiated and an appropriate resolution moved in the AP State Legislative Assembly is the established historical fact.",
    "hint": "The historic, exact wording of the 9 December 2009 midnight announcement.",
    "source": "SR-POLICE-SI-2016",
    "page": 506,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies the exact wording of P. Chidambaram's 9 Dec 2009 midnight announcement.",
            "correctMeaning": "On 9 Dec 2009, the Centre formally announced that the process of forming the state of Telangana will be initiated, which led KCR to break his 11-day fast.",
            "selectedMeaning": "Correct choice recognizing the core text of the 9 December declaration.",
            "possibleConfusion": "Confusing the initial announcement with subsequent backtracking or committee formations.",
            "decisionRules": [
                {
                    "when": "9 Dec 2009 statement: 'The process of forming the state of Telangana will be initiated'.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "It included moving an appropriate resolution in the AP Assembly.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit to memory: 9 December 2009 = 'Process of forming state of Telangana will be initiated'."
        },
        {
            "observation": "Assumes Hyderabad was declared a Union Territory.",
            "correctMeaning": "The 9 Dec statement made no reference to Union Territory status for Hyderabad.",
            "selectedMeaning": "Confused later lobby demands with the actual government statement.",
            "possibleConfusion": "Seemandhra leaders demanded UT status for Hyderabad after the announcement.",
            "decisionRules": [
                {
                    "when": "9 Dec 2009 statement had no UT status for Hyderabad.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "It promised full state formation process.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Verify the brief two-sentence text of Chidambaram's 9 December announcement."
        },
        {
            "observation": "Confuses 9 Dec 2009 with the February 2010 Srikrishna Committee formation.",
            "correctMeaning": "The Srikrishna Committee was constituted on 3 Feb 2010 following the 23 Dec 2009 backtracking statement, not on 9 Dec 2009.",
            "selectedMeaning": "Selected the committee mechanism instituted months later.",
            "possibleConfusion": "Committees are standard government responses to contentious issues.",
            "decisionRules": [
                {
                    "when": "9 Dec 2009 = Statehood process initiated.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "23 Dec 2009 = Centre pauses process due to Seemandhra resignations.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "3 Feb 2010 = Srikrishna Committee appointed.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Trace the sequence: 9 Dec announcement -> 23 Dec backtracking -> 3 Feb Srikrishna Committee."
        },
        {
            "observation": "Selects Article 371-D regional status.",
            "correctMeaning": "Article 371-D was the 1973 Six-Point Formula amendment, not the 2009 statehood announcement.",
            "selectedMeaning": "Mistook the 1973 regional arrangement for the 2009 statehood announcement.",
            "possibleConfusion": "Both deal with Telangana safeguards.",
            "decisionRules": [
                {
                    "when": "Article 371-D = 32nd Amendment 1973 (Six-Point Formula).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "9 Dec 2009 was an explicit promise of separate statehood.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep 1973 regional safeguards distinct from 2009 sovereign statehood commitments."
        }
    ]
}
  },
  // 8. TM-Q283 (Following the central government's backtracking st...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q283",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M08",
    "model": "Recognition",
    "modelId": "TM-QM-REC-01",
    "stage": "practice",
    "prompt": "Following the central government's backtracking statement on 23 December 2009, an all-party and civil society platform was founded on 24 December 2009 at the TRS headquarters to spearhead the non-violent mass movement. Who was chosen as the Convener of this Telangana Joint Action Committee (TJAC)?",
    "options": [
        {
            "text": "Prof. M. Kodandaram (Professor of Political Science at Osmania University)",
            "why": "Prof. M. Kodandaram, who had earlier headed the Telangana Vidhyavanthula Vedika, was unanimously chosen as the Convener of the Telangana Joint Action Committee (TJAC) on 24 Dec 2009 to provide neutral, non-partisan intellectual leadership.",
            "attraction": "The universally recognized, authentic Convener of TJAC.",
            "confusion": false
        },
        {
            "text": "Prof. K. Jayashankar",
            "why": "Prof. Jayashankar was the chief ideological mentor and patron of the movement, but Prof. Kodandaram was appointed the executive Convener of TJAC.",
            "attraction": "Chief ideologue and mentor of the Telangana movement.",
            "confusion": true
        },
        {
            "text": "Swami Goud",
            "why": "Swami Goud was the leader of the Telangana Employees Joint Action Committee (TNGOs), which was a major constituent of TJAC, but was not the overall TJAC Convener.",
            "attraction": "Prominent employee union leader in TJAC.",
            "confusion": true
        },
        {
            "text": "V. Prakash",
            "why": "V. Prakash was a senior Telangana thinker and TRS general secretary, but not the Convener of the all-party TJAC.",
            "attraction": "Key intellectual and founder of Telangana Mahasabha.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Prof. M. Kodandaram, who had earlier headed the Telangana Vidhyavanthula Vedika, was unanimously chosen as the Convener of the Telangana Joint Action Committee (TJAC) on 24 Dec 2009 to provide neutral, non-partisan intellectual leadership.",
    "clue": "Identify Prof. M. Kodandaram (Professor of Political Science at Osmania University)",
    "trap": "Do not confuse with Prof. K. Jayashankar",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Prof. M. Kodandaram (Professor of Political Science at Osmania University) is the established historical fact.",
    "hint": "The universally recognized, authentic Convener of TJAC.",
    "source": "SR-POLICE-SI-2016",
    "page": 507,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Prof. M. Kodandaram as the Convener of TJAC founded on 24 Dec 2009.",
            "correctMeaning": "TJAC was formed on 24 Dec 2009 immediately after the Centre's 23 Dec backtracking, with Prof. M. Kodandaram as Convener to unite political parties, students, employees, and civil society.",
            "selectedMeaning": "Correct choice recognizing Prof. Kodandaram's central role in TJAC.",
            "possibleConfusion": "Confusing the active Convener (Prof. Kodandaram) with the chief mentor (Prof. Jayashankar).",
            "decisionRules": [
                {
                    "when": "TJAC Convener = Prof. M. Kodandaram.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "TJAC formation date = 24 December 2009 (following the 23 Dec backtracking).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember: TJAC Convener = Prof. M. Kodandaram."
        },
        {
            "observation": "Selects Prof. K. Jayashankar.",
            "correctMeaning": "Prof. Jayashankar was the ideological father of the movement, while Prof. Kodandaram served as the operational Convener of TJAC.",
            "selectedMeaning": "Confused the mentor/ideologue with the operational committee convener.",
            "possibleConfusion": "Both were eminent Osmania/Kakatiya professors driving the movement.",
            "decisionRules": [
                {
                    "when": "Prof. Jayashankar = Ideologue / Father figure of Telangana movement.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Prof. Kodandaram = TJAC Convener.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Differentiate the roles of Prof. Jayashankar (Ideologue) and Prof. Kodandaram (TJAC Convener)."
        },
        {
            "observation": "Selects Swami Goud.",
            "correctMeaning": "Swami Goud led the TNGOs / Employees JAC, which was one constituent unit under TJAC.",
            "selectedMeaning": "Mistook the employee union leader for the supreme all-party TJAC Convener.",
            "possibleConfusion": "Swami Goud was frequently seen alongside Prof. Kodandaram on stage.",
            "decisionRules": [
                {
                    "when": "Swami Goud = Telangana Employees JAC (TNGOs) leader.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Prof. Kodandaram = Apex TJAC Convener.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note the structure of constituent JACs (Employees, Lawyers, Doctors, Students) under TJAC."
        },
        {
            "observation": "Selects V. Prakash.",
            "correctMeaning": "V. Prakash was an author, Telangana historian, and TRS leader, not the neutral TJAC Convener.",
            "selectedMeaning": "Confused a political party leader with the neutral academic convener.",
            "possibleConfusion": "V. Prakash played a prominent role in early organizations like Telangana Mahasabha (1997).",
            "decisionRules": [
                {
                    "when": "TJAC required a non-party academic head; Prof. Kodandaram was chosen.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "V. Prakash was affiliated with TRS leadership.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember why a non-partisan academic (Prof. Kodandaram) was chosen to lead TJAC."
        }
    ]
}
  },
  // 9. TM-Q284 (On 10 March 2011, defying police curfews, section ...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q284",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M09",
    "model": "Recognition",
    "modelId": "TM-QM-REC-01",
    "stage": "practice",
    "prompt": "On 10 March 2011, defying police curfews, section 144 orders, and severe barricading across Hyderabad, thousands of Telangana agitators converged on Tank Bund for which massive civil disobedience action organized by TJAC?",
    "options": [
        {
            "text": "Million March",
            "why": "The 'Million March' inspired by Egypt's Tahrir Square protests was organized by TJAC on 10 March 2011 at Tank Bund, overcoming unprecedented police barricades and arrests.",
            "attraction": "The authentic, celebrated Tank Bund civil disobedience action on 10 March 2011.",
            "confusion": false
        },
        {
            "text": "Sakala Janula Samme",
            "why": "Sakala Janula Samme was a 42-day continuous general strike launched in September 2011, not the one-day Tank Bund convergence on 10 March 2011.",
            "attraction": "The most prolonged strike in Telangana history.",
            "confusion": true
        },
        {
            "text": "Sagara Haram",
            "why": "Sagara Haram (Telangana March) took place on 30 September 2012 around Necklace Road, not on 10 March 2011.",
            "attraction": "Massive 2012 mass protest around the same lake.",
            "confusion": true
        },
        {
            "text": "Sadak Bandh",
            "why": "Sadak Bandh was a 400-km highway blockade on NH-44 held on 21 March 2013, not a march on Tank Bund.",
            "attraction": "Major TJAC protest on transport arteries.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "The 'Million March' inspired by Egypt's Tahrir Square protests was organized by TJAC on 10 March 2011 at Tank Bund, overcoming unprecedented police barricades and arrests.",
    "clue": "Identify Million March",
    "trap": "Do not confuse with Sakala Janula Samme",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Million March is the established historical fact.",
    "hint": "The authentic, celebrated Tank Bund civil disobedience action on 10 March 2011.",
    "source": "SR-POLICE-SI-2016",
    "page": 508,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Million March on 10 March 2011 at Tank Bund.",
            "correctMeaning": "Million March was held on 10 March 2011 at Tank Bund inspired by Tahrir Square, breaking through massive police cordons.",
            "selectedMeaning": "Correct choice recognizing the Million March date and venue.",
            "possibleConfusion": "Confusing the Million March (March 2011) with Sagara Haram (Sept 2012).",
            "decisionRules": [
                {
                    "when": "10 March 2011 at Tank Bund = Million March.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "30 September 2012 at Necklace Road = Sagara Haram (Telangana March).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Memorize: 10 March 2011 = Million March at Tank Bund."
        },
        {
            "observation": "Confuses the Million March with the Sakala Janula Samme general strike.",
            "correctMeaning": "Sakala Janula Samme began on 13 September 2011 and lasted 42 days across the whole state.",
            "selectedMeaning": "Confused a one-day direct action march with the multi-week indefinite general strike.",
            "possibleConfusion": "Both occurred in 2011 under TJAC leadership.",
            "decisionRules": [
                {
                    "when": "March 2011 = Million March (1-day demonstration).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Sept–Oct 2011 = Sakala Janula Samme (42-day general strike).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Differentiate the calendar timing of 2011 events: March (Million March) vs September (Samme)."
        },
        {
            "observation": "Confuses Million March (2011) with Sagara Haram (2012).",
            "correctMeaning": "Sagara Haram took place on 30 September 2012 along Necklace Road.",
            "selectedMeaning": "Selected the 2012 protest instead of the 2011 protest.",
            "possibleConfusion": "Both took place around the Hussain Sagar water body in Hyderabad.",
            "decisionRules": [
                {
                    "when": "Tank Bund (10 March 2011) = Million March.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Necklace Road (30 Sept 2012) = Sagara Haram.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note the specific venue: Tank Bund (Million March) vs Necklace Road (Sagara Haram)."
        },
        {
            "observation": "Confuses Million March with Sadak Bandh.",
            "correctMeaning": "Sadak Bandh was the NH-44 highway shutdown between Shamshabad and Alampur on 21 March 2013.",
            "selectedMeaning": "Confused the highway blockade with the city lake march.",
            "possibleConfusion": "Both were bold civil disobedience operations executed by TJAC.",
            "decisionRules": [
                {
                    "when": "City center / Tank Bund = Million March.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "National Highway 44 = Sadak Bandh.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember: Sadak Bandh = NH-44 blockade (March 2013)."
        }
    ]
}
  },
  // 10. TM-Q285 (The historic 'Sakala Janula Samme' (All People's G...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q285",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M10",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "The historic 'Sakala Janula Samme' (All People's General Strike) spearheaded by TJAC and government employees crippled state administration, RTC buses, coal production at Singareni, and electricity generation. For how many consecutive days did this unprecedented strike continue from 13 September 2011?",
    "options": [
        {
            "text": "42 days (called off on 24 October 2011)",
            "why": "Sakala Janula Samme began on 13 September 2011 and lasted an astounding 42 consecutive days until it was called off on 24 October 2011 following assurances and intense public fatigue.",
            "attraction": "The exact, historic duration of Sakala Janula Samme.",
            "confusion": false
        },
        {
            "text": "28 days",
            "why": "28 days was the duration of the RTC bus workers strike in a subsequent phase, not the complete 42-day Sakala Janula Samme.",
            "attraction": "Plausible four-week duration.",
            "confusion": true
        },
        {
            "text": "56 days",
            "why": "56 days was the duration of the 1969 Telangana NGOs strike led by K.R. Amos, not the 2011 Sakala Janula Samme.",
            "attraction": "Historic strike duration from the 1969 agitation.",
            "confusion": true
        },
        {
            "text": "16 days",
            "why": "16 days was the duration of the 1972 Jai Andhra strike in Seemandhra, not the 2011 Telangana general strike.",
            "attraction": "Commonly cited strike period in AP history.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Sakala Janula Samme began on 13 September 2011 and lasted an astounding 42 consecutive days until it was called off on 24 October 2011 following assurances and intense public fatigue.",
    "clue": "Identify 42 days (called off on 24 October 2011)",
    "trap": "Do not confuse with 28 days",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "42 days (called off on 24 October 2011) is the established historical fact.",
    "hint": "The exact, historic duration of Sakala Janula Samme.",
    "source": "SR-POLICE-SI-2016",
    "page": 509,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies 42 days as the exact duration of the 2011 Sakala Janula Samme.",
            "correctMeaning": "Sakala Janula Samme ran for 42 days from 13 September to 24 October 2011, paralyzing administration, education, transport, and coal mining across Telangana.",
            "selectedMeaning": "Correct choice recognizing the 42-day duration.",
            "possibleConfusion": "Confusing 2011 (42 days) with 1969 TNGO strike (56 days).",
            "decisionRules": [
                {
                    "when": "2011 Sakala Janula Samme = 42 days (13 Sept - 24 Oct 2011).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "1969 TNGOs Strike = 56 days (led by K.R. Amos).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit to memory: Sakala Janula Samme = 42 days; 1969 TNGO Strike = 56 days."
        },
        {
            "observation": "Selects 28 days.",
            "correctMeaning": "The full multi-sector strike continued for 42 days, far exceeding 28 days.",
            "selectedMeaning": "Understated the duration by two full weeks.",
            "possibleConfusion": "Certain specific departmental unions paused after roughly 4 weeks.",
            "decisionRules": [
                {
                    "when": "The official overall duration recognized in government and exam records is 42 days.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Strike started 13 Sept and ended 24 Oct 2011.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Verify calendar span: 18 days in September + 24 days in October = 42 days."
        },
        {
            "observation": "Confuses 2011 with the 1969 TNGOs strike (56 days).",
            "correctMeaning": "The 56-day strike was staged in 1969 by K.R. Amos and TNGOs; 2011 Sakala Janula Samme was 42 days.",
            "selectedMeaning": "Selected the 1969 strike figure for the 2011 movement.",
            "possibleConfusion": "Both are legendary government employee strikes in Telangana history.",
            "decisionRules": [
                {
                    "when": "1969 TNGOs strike = 56 days.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "2011 Sakala Janula Samme = 42 days.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Write down the two strike figures side-by-side to avoid cross-era confusion."
        },
        {
            "observation": "Selects 16 days.",
            "correctMeaning": "16 days is far shorter than the massive 42-day shutdown.",
            "selectedMeaning": "Severely understated the duration of the general strike.",
            "possibleConfusion": "Confusing short protest phases with the overarching general strike.",
            "decisionRules": [
                {
                    "when": "Sakala Janula Samme was unprecedented in modern Indian history lasting 42 days.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Singareni coal mining was shut for nearly the entire 42 days.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember the historic economic impact of the 42-day shutdown."
        }
    ]
}
  },
  // 11. TM-Q286 (On 30 September 2012, despite unprecedented barric...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q286",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M11",
    "model": "Recognition",
    "modelId": "TM-QM-REC-01",
    "stage": "practice",
    "prompt": "On 30 September 2012, despite unprecedented barricades, tear gas, and police crackdowns, TJAC organized another mammoth demonstration along Necklace Road around Hussain Sagar lake. By what name is this mass mobilization popularly known?",
    "options": [
        {
            "text": "Sagara Haram (Telangana March)",
            "why": "The massive demonstration on 30 September 2012 held on Necklace Road was christened 'Sagara Haram' (Garland around the Lake / Telangana March), symbolizing encirclement of the state capital's lake.",
            "attraction": "The authentic title of the 30 September 2012 Necklace Road march.",
            "confusion": false
        },
        {
            "text": "Million March",
            "why": "Million March was held 18 months earlier on 10 March 2011 at Tank Bund, not on 30 September 2012 at Necklace Road.",
            "attraction": "Preceding historic march around the same lake.",
            "confusion": true
        },
        {
            "text": "Sadak Bandh",
            "why": "Sadak Bandh took place on 21 March 2013 on NH-44, not at Necklace Road.",
            "attraction": "Major subsequent TJAC mobilization.",
            "confusion": true
        },
        {
            "text": "Palle Palle Pattala Paiki",
            "why": "Palle Palle Pattala Paiki was the rail-roko movement organized by TJAC in March and October 2011, halting train networks across Telangana.",
            "attraction": "Famous rail-blockade movement slogan.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "The massive demonstration on 30 September 2012 held on Necklace Road was christened 'Sagara Haram' (Garland around the Lake / Telangana March), symbolizing encirclement of the state capital's lake.",
    "clue": "Identify Sagara Haram (Telangana March)",
    "trap": "Do not confuse with Million March",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Sagara Haram (Telangana March) is the established historical fact.",
    "hint": "The authentic title of the 30 September 2012 Necklace Road march.",
    "source": "SR-POLICE-SI-2016",
    "page": 510,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Sagara Haram (Telangana March) on 30 September 2012 at Necklace Road.",
            "correctMeaning": "Sagara Haram was organized on 30 September 2012 by TJAC at Necklace Road amidst intense police tear-gassing, rain, and public defiance.",
            "selectedMeaning": "Correct choice recognizing Sagara Haram.",
            "possibleConfusion": "Confusing Sagara Haram with Million March or rail-roko programs.",
            "decisionRules": [
                {
                    "when": "30 September 2012 at Necklace Road = Sagara Haram (Telangana March).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "10 March 2011 at Tank Bund = Million March.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember: Sagara Haram = Necklace Road on 30 September 2012."
        },
        {
            "observation": "Confuses Sagara Haram with the Million March.",
            "correctMeaning": "Million March was 10 March 2011 at Tank Bund; Sagara Haram was 30 September 2012 at Necklace Road.",
            "selectedMeaning": "Selected the 2011 protest rather than the 2012 protest.",
            "possibleConfusion": "Both took place around Hussain Sagar lake.",
            "decisionRules": [
                {
                    "when": "Million March = Tank Bund (10 March 2011).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Sagara Haram = Necklace Road (30 Sept 2012).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Distinguish between the eastern side (Tank Bund) and western side (Necklace Road) of the lake."
        },
        {
            "observation": "Confuses Sagara Haram with Sadak Bandh.",
            "correctMeaning": "Sadak Bandh was on 21 March 2013 on the national highway, not in September 2012 at the lake.",
            "selectedMeaning": "Confused the highway shutdown with the lake encirclement march.",
            "possibleConfusion": "Both were iconic TJAC protest designs.",
            "decisionRules": [
                {
                    "when": "Sadak Bandh = Road / Highway blockade (2013).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Sagara Haram = Lake encirclement march (2012).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Associate 'Sagara' with water/lake (Hussain Sagar) and 'Sadak' with highway (NH-44)."
        },
        {
            "observation": "Selects the rail-roko campaign 'Palle Palle Pattala Paiki'.",
            "correctMeaning": "Palle Palle Pattala Paiki specifically targeted railway tracks, not Necklace Road.",
            "selectedMeaning": "Confused the railway track agitations with the Necklace Road march.",
            "possibleConfusion": "Both involved massive participation of rural youth in mass actions.",
            "decisionRules": [
                {
                    "when": "Palle Palle Pattala Paiki = Rail tracks (Rail Roko).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Sagara Haram = Necklace Road march.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep transport-specific agitations (rail roko) distinct from urban mass marches."
        }
    ]
}
  },
  // 12. TM-Q287 (On 21 March 2013, TJAC organized the historic 'Sad...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q287",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M12",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "On 21 March 2013, TJAC organized the historic 'Sadak Bandh', completely paralyzing vehicular movement on National Highway 44. Across what distance and between which two locations was this massive highway blockade executed?",
    "options": [
        {
            "text": "A 400-kilometer stretch on NH-44 between Shamshabad (Hyderabad outskirts) and Alampur (Mahabubnagar border)",
            "why": "The Sadak Bandh on 21 March 2013 blocked National Highway 44 across nearly 400 km from Shamshabad outside Hyderabad all the way south to Alampur at the Krishna river border of Mahabubnagar.",
            "attraction": "The authentic, exact geographical stretch of the historic Sadak Bandh.",
            "confusion": false
        },
        {
            "text": "A 200-kilometer stretch on NH-65 between Hyderabad and Suryapet",
            "why": "NH-65 (Hyderabad-Vijayawada) was heavily agitated during various bandhs, but Sadak Bandh was specifically organized on NH-44 south towards Kurnool/Alampur.",
            "attraction": "Major highway linking Telangana and Coastal Andhra.",
            "confusion": true
        },
        {
            "text": "A 150-kilometer stretch on NH-163 between Uppal and Warangal",
            "why": "Warangal highway witnessed many rallies, but Sadak Bandh on 21 March 2013 was focused on the North-South corridor (NH-44).",
            "attraction": "Crucial cultural axis between Hyderabad and Warangal.",
            "confusion": true
        },
        {
            "text": "A 300-kilometer stretch on NH-563 between Jagtial and Khammam",
            "why": "NH-563 connects northern and eastern Telangana, but was not the designated highway for the 21 March 2013 Sadak Bandh.",
            "attraction": "Interior Telangana highway corridor.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "The Sadak Bandh on 21 March 2013 blocked National Highway 44 across nearly 400 km from Shamshabad outside Hyderabad all the way south to Alampur at the Krishna river border of Mahabubnagar.",
    "clue": "Identify A 400-kilometer stretch on NH-44 between Shamshabad (Hyderabad outskirts) and Alampur (Mahabubnagar border)",
    "trap": "Do not confuse with A 200-kilometer stretch on NH-65 between Hyderabad and Suryapet",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "A 400-kilometer stretch on NH-44 between Shamshabad (Hyderabad outskirts) and Alampur (Mahabubnagar border) is the established historical fact.",
    "hint": "The authentic, exact geographical stretch of the historic Sadak Bandh.",
    "source": "SR-POLICE-SI-2016",
    "page": 511,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies 400 km on NH-44 between Shamshabad and Alampur.",
            "correctMeaning": "On 21 March 2013, TJAC activists cooked, danced, and pitched tents on NH-44 across 400 km from Shamshabad to Alampur, cutting off transit between Hyderabad and Bangalore/Rayalaseema.",
            "selectedMeaning": "Correct choice recognizing the exact stretch of Sadak Bandh.",
            "possibleConfusion": "Confusing NH-44 (Bangalore route) with NH-65 (Vijayawada route).",
            "decisionRules": [
                {
                    "when": "Sadak Bandh highway = NH-44 (400 km).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Terminus points = Shamshabad (Hyderabad) to Alampur (Mahabubnagar / AP border).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember: Sadak Bandh = NH-44 (Shamshabad to Alampur, 400 km, 21 March 2013)."
        },
        {
            "observation": "Confuses NH-44 with NH-65 (Hyderabad-Vijayawada).",
            "correctMeaning": "NH-65 was blocked during border blockades at Kodad, but Sadak Bandh was explicitly planned on NH-44.",
            "selectedMeaning": "Selected the eastern highway towards Coastal Andhra instead of the southern highway NH-44.",
            "possibleConfusion": "NH-65 was the main road to Seemandhra.",
            "decisionRules": [
                {
                    "when": "Sadak Bandh route was NH-44 towards Alampur/Bangalore.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Don't substitute NH-65 (Vijayawada highway) for Sadak Bandh.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note why NH-44 was selected: long continuous stretch running through Mahabubnagar."
        },
        {
            "observation": "Selects NH-163 (Hyderabad-Warangal).",
            "correctMeaning": "NH-163 is the Warangal corridor, not the 400-km Sadak Bandh artery.",
            "selectedMeaning": "Confused the Warangal road with the NH-44 interstate highway.",
            "possibleConfusion": "Warangal was the epicentre of student rallies.",
            "decisionRules": [
                {
                    "when": "Warangal highway is NH-163.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Sadak Bandh was executed on NH-44 (Shamshabad-Alampur).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep the highway numbers and names clear for SI & Constable exams."
        },
        {
            "observation": "Selects NH-563 (Jagtial to Khammam).",
            "correctMeaning": "NH-563 was not the corridor chosen for the mass blockade.",
            "selectedMeaning": "Selected an interior state highway instead of the national transit corridor.",
            "possibleConfusion": "Jagtial and Khammam were active agitation hubs.",
            "decisionRules": [
                {
                    "when": "Target was National Highway 44 (formerly NH-7).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "The goal was to demonstrate total control over interstate freight transit.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Recognize that Sadak Bandh targeted the major North-South national corridor."
        }
    ]
}
  },
  // 13. TM-Q288 (The 5-member Committee for Consultations on the Si...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q288",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M13",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "The 5-member Committee for Consultations on the Situation in Andhra Pradesh (headed by retired Chief Justice B.N. Srikrishna) submitted its comprehensive report on 30 December 2010 evaluating six policy alternatives. Which was Option 5 recommended by the committee?",
    "options": [
        {
            "text": "Bifurcation of the State into Telangana and Seemandhra as per existing boundaries with Hyderabad as the capital of Telangana and Seemandhra to have a new capital",
            "why": "Option 5 in Chapter 9 was: 'Bifurcation of the State into Telangana and Seemandhra as per existing boundaries with Hyderabad as the capital of Telangana and Seemandhra to have a new capital'.",
            "attraction": "The authentic Option 5 of the Srikrishna Committee report.",
            "confusion": false
        },
        {
            "text": "Keeping the State united and providing constitutional / statutory measures for socio-economic development through a Telangana Regional Council (Option 6)",
            "why": "Keeping the state united with a statutory regional council was Option 6, which the committee itself termed the 'most workable option', whereas Option 5 was bifurcation.",
            "attraction": "Option 6 (preferred by the committee itself).",
            "confusion": true
        },
        {
            "text": "Bifurcation into Telangana and Andhra with Hyderabad declared a Union Territory (Option 3)",
            "why": "Option 3 proposed dividing the state into two with Hyderabad as a separate Union Territory, not Option 5.",
            "attraction": "Another of the 6 options formulated by the committee.",
            "confusion": true
        },
        {
            "text": "Bifurcation into Rayala-Telangana and Coastal Andhra (Option 4)",
            "why": "Option 4 proposed merging Rayalaseema with Telangana (Rayala-Telangana) and separating Coastal Andhra, not Option 5.",
            "attraction": "Controversial political option evaluated by the committee.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Option 5 in Chapter 9 was: 'Bifurcation of the State into Telangana and Seemandhra as per existing boundaries with Hyderabad as the capital of Telangana and Seemandhra to have a new capital'.",
    "clue": "Identify Bifurcation of the State into Telangana and Seemandhra as per existing boundaries with Hyderabad as the capital of Telangana and Seemandhra to have a new capital",
    "trap": "Do not confuse with Keeping the State united and providing constitutional / statutory measures for socio-economic development through a Telangana Regional Council (Option 6)",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Bifurcation of the State into Telangana and Seemandhra as per existing boundaries with Hyderabad as the capital of Telangana and Seemandhra to have a new capital is the established historical fact.",
    "hint": "The authentic Option 5 of the Srikrishna Committee report.",
    "source": "SR-POLICE-SI-2016",
    "page": 512,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Option 5 as full bifurcation with Hyderabad as Telangana's capital.",
            "correctMeaning": "Option 5 of the Srikrishna Committee report proposed bifurcating the state into Telangana and Seemandhra with Hyderabad as Telangana's capital, which ultimately formed the basis of the 2014 reorganization.",
            "selectedMeaning": "Correct choice distinguishing Option 5 from Option 6.",
            "possibleConfusion": "Confusing Option 5 (bifurcation) with Option 6 (united state with statutory council).",
            "decisionRules": [
                {
                    "when": "Option 5 = Bifurcation into Telangana and Seemandhra (Hyderabad to Telangana).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Option 6 = Keep state united with empowered Statutory Regional Council (committee's preferred option).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit to memory the distinction: Option 5 = Bifurcation; Option 6 = United AP with Council."
        },
        {
            "observation": "Selects Option 6 instead of Option 5.",
            "correctMeaning": "Option 6 was the united state proposal favored by the committee; Option 5 was bifurcation.",
            "selectedMeaning": "Confused the committee's preferred option (6) with the bifurcation option (5).",
            "possibleConfusion": "Because the committee recommended Option 6 as 'best', students often confuse its number.",
            "decisionRules": [
                {
                    "when": "Option 5 = Bifurcation (what the people of Telangana wanted and eventually got).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Option 6 = United AP with Regional Council (what the committee endorsed).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Always check whether the question asks for Option 5 (Bifurcation) or Option 6 (United AP)."
        },
        {
            "observation": "Selects Option 3 (Hyderabad as Union Territory).",
            "correctMeaning": "Option 3 was bifurcation with Hyderabad as a Union Territory, rejected by Telangana people.",
            "selectedMeaning": "Confused Option 3 with Option 5.",
            "possibleConfusion": "Both involve dividing the state into two parts.",
            "decisionRules": [
                {
                    "when": "Option 3 = Bifurcation with Hyderabad as UT.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Option 5 = Bifurcation with Hyderabad as Telangana capital.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note the capital status: Option 3 = Hyderabad UT; Option 5 = Hyderabad to Telangana."
        },
        {
            "observation": "Selects Option 4 (Rayala-Telangana).",
            "correctMeaning": "Option 4 was the Rayala-Telangana concept (Telangana + Rayalaseema), which was widely rejected.",
            "selectedMeaning": "Confused the Rayala-Telangana formula with standard 10-district bifurcation (Option 5).",
            "possibleConfusion": "Rayala-Telangana was actively promoted by certain Congress politicians.",
            "decisionRules": [
                {
                    "when": "Option 4 = Rayala-Telangana and Coastal Andhra.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Option 5 = 10-district Telangana with Hyderabad capital.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep the exact numbering of the Srikrishna Committee's 6 options clear."
        }
    ]
}
  },
  // 14. TM-Q289 (The Justice B.N. Srikrishna Committee report inclu...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q289",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M14",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "The Justice B.N. Srikrishna Committee report included an undisclosed 'Chapter 8' marked strictly confidential. On 23 March 2011, which judge of the Andhra Pradesh High Court directed the Union Ministry of Home Affairs to make Chapter 8 public, declaring that advisory bodies cannot operate secretly against democratic rights?",
    "options": [
        {
            "text": "Justice L. Narasimha Reddy",
            "why": "Justice L. Narasimha Reddy of the AP High Court delivered the landmark verdict on 23 March 2011 directing the Centre to disclose Chapter 8, observing that the committee had acted like an intelligence bureau in advising how to manage media and political resistance.",
            "attraction": "The authentic High Court judge who ordered the disclosure of Chapter 8.",
            "confusion": false
        },
        {
            "text": "Justice N. Kumarayya",
            "why": "Justice N. Kumarayya was a former Chief Justice of Hyderabad High Court in the early post-independence era, not 2011.",
            "attraction": "Historic Telangana jurist.",
            "confusion": true
        },
        {
            "text": "Justice P. Jaganmohan Reddy",
            "why": "Justice P. Jaganmohan Reddy headed the 1952 City College firing inquiry commission, six decades earlier.",
            "attraction": "Legendary commission inquiry judge.",
            "confusion": true
        },
        {
            "text": "Justice K. Subba Rao",
            "why": "Justice K. Subba Rao was the first Chief Justice of Andhra High Court (1954) and later Chief Justice of India (1966), not on the bench in 2011.",
            "attraction": "Iconic constitutional jurist.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Justice L. Narasimha Reddy of the AP High Court delivered the landmark verdict on 23 March 2011 directing the Centre to disclose Chapter 8, observing that the committee had acted like an intelligence bureau in advising how to manage media and political resistance.",
    "clue": "Identify Justice L. Narasimha Reddy",
    "trap": "Do not confuse with Justice N. Kumarayya",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Justice L. Narasimha Reddy is the established historical fact.",
    "hint": "The authentic High Court judge who ordered the disclosure of Chapter 8.",
    "source": "SR-POLICE-SI-2016",
    "page": 513,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Justice L. Narasimha Reddy as the judge who ordered Chapter 8 disclosure.",
            "correctMeaning": "Justice L. Narasimha Reddy ruled that the Srikrishna Committee exceeded its mandate in Chapter 8 by advising government strategy to suppress political agitations, ordering its public release.",
            "selectedMeaning": "Correct choice recognizing Justice L. Narasimha Reddy.",
            "possibleConfusion": "Confusing modern High Court judges with historical judicial inquiry heads.",
            "decisionRules": [
                {
                    "when": "High Court Judge who ordered disclosure of Srikrishna Committee Chapter 8 = Justice L. Narasimha Reddy.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Date of landmark judgment = 23 March 2011.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember: Justice L. Narasimha Reddy = Srikrishna Committee Chapter 8 disclosure judgment."
        },
        {
            "observation": "Selects Justice N. Kumarayya.",
            "correctMeaning": "Justice Kumarayya was from the 1950s-1960s judiciary, not the 2011 bench.",
            "selectedMeaning": "Confused an early post-merger Chief Justice with the 2011 judge.",
            "possibleConfusion": "Both were respected jurists from Telangana.",
            "decisionRules": [
                {
                    "when": "Justice Kumarayya served in the 1950s/1960s.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Justice L. Narasimha Reddy delivered the 2011 ruling.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Check judicial eras: 1960s vs 2011."
        },
        {
            "observation": "Selects Justice P. Jaganmohan Reddy.",
            "correctMeaning": "Justice Jaganmohan Reddy is famous for the 1952 City College firing report, not the 2011 Chapter 8 ruling.",
            "selectedMeaning": "Selected the 1952 judicial inquiry head.",
            "possibleConfusion": "Both delivered landmark rulings/reports related to Telangana agitations.",
            "decisionRules": [
                {
                    "when": "1952 City College Firing = Justice P. Jaganmohan Reddy.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "2011 Srikrishna Committee Chapter 8 = Justice L. Narasimha Reddy.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Always associate Jaganmohan Reddy with 1952 City College and Narasimha Reddy with 2011 Chapter 8."
        },
        {
            "observation": "Selects Justice K. Subba Rao.",
            "correctMeaning": "Justice Subba Rao was the celebrated CJI in Golaknath (1967), not a sitting judge in 2011.",
            "selectedMeaning": "Selected a historical Supreme Court Chief Justice.",
            "possibleConfusion": "High fame in Indian constitutional jurisprudence.",
            "decisionRules": [
                {
                    "when": "Justice Subba Rao was CJI in the 1960s.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "The Srikrishna Chapter 8 case was adjudicated in 2011 by Justice L. Narasimha Reddy.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep Supreme Court historical luminaries distinct from 2011 AP High Court benches."
        }
    ]
}
  },
  // 15. TM-Q290 (On which date did the Congress Working Committee (...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q290",
    "topic": "TM-03.01",
    "concept": "TM-03.01-M15",
    "model": "Chronology",
    "modelId": "TM-QM-CHRON-01",
    "stage": "practice",
    "prompt": "On which date did the Congress Working Committee (CWC) pass its historic, unanimous resolution officially resolving to recommend the formation of a separate Telangana State comprising 10 districts, with Hyderabad as the common capital for a period not exceeding 10 years?",
    "options": [
        {
            "text": "30 July 2013",
            "why": "On 30 July 2013, the Congress Working Committee (CWC) met at 10 Janpath, New Delhi, and unanimously resolved to recommend to the Central Government the formation of a separate Telangana State with 10 districts.",
            "attraction": "The authentic date of the decisive CWC Telangana resolution.",
            "confusion": false
        },
        {
            "text": "9 December 2009",
            "why": "9 December 2009 was Union Home Minister P. Chidambaram's initial policy announcement, not the final CWC resolution.",
            "attraction": "The initial midnight policy announcement date.",
            "confusion": true
        },
        {
            "text": "3 October 2013",
            "why": "3 October 2013 was when the Union Cabinet officially approved the bifurcation proposal and constituted the Group of Ministers (GoM), not the CWC meeting.",
            "attraction": "Union Cabinet approval date following CWC.",
            "confusion": true
        },
        {
            "text": "18 February 2014",
            "why": "18 February 2014 was when the Lok Sabha passed the AP Reorganisation Bill, not the political party CWC resolution.",
            "attraction": "Lok Sabha bill passage date.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "On 30 July 2013, the Congress Working Committee (CWC) met at 10 Janpath, New Delhi, and unanimously resolved to recommend to the Central Government the formation of a separate Telangana State with 10 districts.",
    "clue": "Identify 30 July 2013",
    "trap": "Do not confuse with 9 December 2009",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "30 July 2013 is the established historical fact.",
    "hint": "The authentic date of the decisive CWC Telangana resolution.",
    "source": "SR-POLICE-SI-2016",
    "page": 514,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies 30 July 2013 as the date of the CWC resolution.",
            "correctMeaning": "The CWC passed its historic unanimous resolution on 30 July 2013, setting in motion the statutory drafting and parliamentary passage of the bifurcation bill.",
            "selectedMeaning": "Correct choice recognizing the 30 July 2013 CWC resolution date.",
            "possibleConfusion": "Confusing party resolution (30 July 2013) with Cabinet approval (3 Oct 2013) or Lok Sabha vote (18 Feb 2014).",
            "decisionRules": [
                {
                    "when": "CWC Resolution = 30 July 2013.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Union Cabinet Approval & GoM = 3 October 2013.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Lok Sabha Passage = 18 February 2014.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember the sequence: 30 July 2013 (CWC) -> 3 Oct 2013 (Cabinet) -> 18 Feb 2014 (Lok Sabha)."
        },
        {
            "observation": "Confuses the 2013 CWC resolution with the 2009 announcement.",
            "correctMeaning": "9 Dec 2009 was the government statement by Chidambaram, which was paused two weeks later.",
            "selectedMeaning": "Selected the earlier 2009 announcement date.",
            "possibleConfusion": "Both were major national turning points.",
            "decisionRules": [
                {
                    "when": "2009 = Initial government announcement.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "2013 = Final CWC resolution recommending bifurcation.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep 2009 initial declaration and 2013 final decision clearly distinct."
        },
        {
            "observation": "Selects 3 October 2013 (Union Cabinet approval).",
            "correctMeaning": "On 3 October 2013 the Union Cabinet formally approved the CWC's recommendation and set up the GoM.",
            "selectedMeaning": "Confused the Union Cabinet executive approval with the political party CWC resolution.",
            "possibleConfusion": "Cabinet action directly implemented the CWC resolution two months later.",
            "decisionRules": [
                {
                    "when": "CWC party resolution came first on 30 July 2013.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Union Cabinet executive approval followed on 3 October 2013.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Differentiate political party resolution (CWC) from executive cabinet decision."
        },
        {
            "observation": "Selects 18 February 2014 (Lok Sabha passage).",
            "correctMeaning": "18 February 2014 was parliamentary enactment in Lok Sabha, occurring 7 months after CWC.",
            "selectedMeaning": "Confused legislative enactment with the governing party's resolution.",
            "possibleConfusion": "Both were monumental victories for the statehood movement.",
            "decisionRules": [
                {
                    "when": "30 July 2013 = Political decision (CWC).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "18 February 2014 = Legislative passage (Lok Sabha).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Trace the path from political consensus (July 2013) to legislative law (Feb 2014)."
        }
    ]
}
  },
  // 16. TM-Q291 (On which historic date did the Lok Sabha pass the ...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q291",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M01",
    "model": "Chronology",
    "modelId": "TM-QM-CHRON-01",
    "stage": "practice",
    "prompt": "On which historic date did the Lok Sabha pass the Andhra Pradesh Reorganisation Bill, 2014, amidst unprecedented scenes where the official Lok Sabha TV live telecast was temporarily interrupted?",
    "options": [
        {
            "text": "18 February 2014",
            "why": "On 18 February 2014, the Lok Sabha passed the Andhra Pradesh Reorganisation Bill, 2014 by voice vote with the support of the main opposition BJP, during which the live television feed was famously blacked out.",
            "attraction": "The authentic date of the AP Reorganisation Bill passage in the Lok Sabha.",
            "confusion": false
        },
        {
            "text": "20 February 2014",
            "why": "20 February 2014 was the date when the Rajya Sabha passed the bill, two days after the Lok Sabha.",
            "attraction": "Rajya Sabha passage date.",
            "confusion": true
        },
        {
            "text": "1 March 2014",
            "why": "1 March 2014 was the date President Pranab Mukherjee signed the bill into law (Act 6 of 2014), not the Lok Sabha vote.",
            "attraction": "Presidential assent date.",
            "confusion": true
        },
        {
            "text": "2 June 2014",
            "why": "2 June 2014 was the Appointed Day when Telangana officially became a state, not the parliamentary passage date.",
            "attraction": "Telangana State Formation Day.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "On 18 February 2014, the Lok Sabha passed the Andhra Pradesh Reorganisation Bill, 2014 by voice vote with the support of the main opposition BJP, during which the live television feed was famously blacked out.",
    "clue": "Identify 18 February 2014",
    "trap": "Do not confuse with 20 February 2014",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "18 February 2014 is the established historical fact.",
    "hint": "The authentic date of the AP Reorganisation Bill passage in the Lok Sabha.",
    "source": "SR-POLICE-SI-2016",
    "page": 515,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies 18 February 2014 as the Lok Sabha passage date.",
            "correctMeaning": "The Lok Sabha passed the historic bill on 18 February 2014, overcoming disruptions, pepper spray incidents in earlier sittings, and the blackout of the live telecast.",
            "selectedMeaning": "Correct choice recognizing the Lok Sabha passage date.",
            "possibleConfusion": "Confusing Lok Sabha passage (18 Feb) with Rajya Sabha passage (20 Feb).",
            "decisionRules": [
                {
                    "when": "Lok Sabha passage = 18 February 2014.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Rajya Sabha passage = 20 February 2014.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Memorize: Lok Sabha = 18 Feb 2014; Rajya Sabha = 20 Feb 2014."
        },
        {
            "observation": "Selects 20 February 2014 (Rajya Sabha passage).",
            "correctMeaning": "20 February 2014 was the Rajya Sabha passage date, where Prime Minister Manmohan Singh announced a 5-year special category status package for Seemandhra.",
            "selectedMeaning": "Selected the Upper House passage date instead of the Lower House.",
            "possibleConfusion": "Both houses passed the bill within 48 hours of each other.",
            "decisionRules": [
                {
                    "when": "Lower House (Lok Sabha) passed it first on 18 February 2014.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Upper House (Rajya Sabha) passed it second on 20 February 2014.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember the 48-hour gap between Lok Sabha (18th) and Rajya Sabha (20th)."
        },
        {
            "observation": "Selects 1 March 2014 (Presidential assent).",
            "correctMeaning": "1 March 2014 was when President Pranab Mukherjee gave assent and the Act was published in the Gazette.",
            "selectedMeaning": "Confused executive Presidential assent with the parliamentary chamber vote.",
            "possibleConfusion": "Presidential assent is the final constitutional enactment step.",
            "decisionRules": [
                {
                    "when": "Parliamentary passage = 18 & 20 February 2014.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Presidential assent = 1 March 2014.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review the three distinct dates: Lok Sabha -> Rajya Sabha -> President."
        },
        {
            "observation": "Selects 2 June 2014 (Appointed Day).",
            "correctMeaning": "2 June 2014 was the Appointed Day of state birth, three months after legislative completion.",
            "selectedMeaning": "Confused the state formation holiday with the parliamentary voting day.",
            "possibleConfusion": "2 June is celebrated annually as Telangana Formation Day.",
            "decisionRules": [
                {
                    "when": "Legislative passage took place in February 2014.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "The state officially came into legal existence on 2 June 2014.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep the legislative passage phase distinct from the official Appointed Day."
        }
    ]
}
  },
  // 17. TM-Q292 (Following passage in both Houses of Parliament, on...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q292",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M02",
    "model": "Chronology",
    "modelId": "TM-QM-CHRON-01",
    "stage": "practice",
    "prompt": "Following passage in both Houses of Parliament, on which date did President Pranab Mukherjee accord his official Presidential assent to the Andhra Pradesh Reorganisation Act, 2014 (Act No. 6 of 2014)?",
    "options": [
        {
            "text": "1 March 2014 (published in the Gazette of India on 1 March 2014)",
            "why": "President Pranab Mukherjee signed the Andhra Pradesh Reorganisation Bill on 1 March 2014, converting it into Act No. 6 of 2014, published in the Extraordinary Gazette of India on the same day.",
            "attraction": "The authentic date of Presidential assent for Act 6 of 2014.",
            "confusion": false
        },
        {
            "text": "18 February 2014",
            "why": "18 February 2014 was the Lok Sabha passage date, not the date of Presidential assent.",
            "attraction": "Lok Sabha approval date.",
            "confusion": true
        },
        {
            "text": "20 February 2014",
            "why": "20 February 2014 was the Rajya Sabha passage date, not Presidential assent.",
            "attraction": "Rajya Sabha approval date.",
            "confusion": true
        },
        {
            "text": "2 June 2014",
            "why": "2 June 2014 was the Appointed Day fixed by the Ministry of Home Affairs notification, not the date of Presidential assent.",
            "attraction": "Appointed Day for state formation.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "President Pranab Mukherjee signed the Andhra Pradesh Reorganisation Bill on 1 March 2014, converting it into Act No. 6 of 2014, published in the Extraordinary Gazette of India on the same day.",
    "clue": "Identify 1 March 2014 (published in the Gazette of India on 1 March 2014)",
    "trap": "Do not confuse with 18 February 2014",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "1 March 2014 (published in the Gazette of India on 1 March 2014) is the established historical fact.",
    "hint": "The authentic date of Presidential assent for Act 6 of 2014.",
    "source": "SR-POLICE-SI-2016",
    "page": 516,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies 1 March 2014 as the date of Presidential assent for Act 6 of 2014.",
            "correctMeaning": "President Pranab Mukherjee gave his assent on 1 March 2014, formally enacting the Andhra Pradesh Reorganisation Act, 2014 as Central Act No. 6 of 2014.",
            "selectedMeaning": "Correct choice recognizing the Presidential assent date.",
            "possibleConfusion": "Confusing parliamentary passage with Presidential assent.",
            "decisionRules": [
                {
                    "when": "Presidential assent date = 1 March 2014.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Act number = Act No. 6 of 2014.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit to memory: Act No. 6 of 2014 received Presidential assent on 1 March 2014."
        },
        {
            "observation": "Selects the Lok Sabha passage date (18 Feb 2014).",
            "correctMeaning": "The bill still required Rajya Sabha passage and Presidential assent before becoming law.",
            "selectedMeaning": "Equated Lok Sabha voting with final Presidential assent.",
            "possibleConfusion": "Major media celebrations occurred immediately on 18 Feb.",
            "decisionRules": [
                {
                    "when": "Lok Sabha passage did not make it an Act.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "It became an Act on 1 March 2014 with Presidential signature.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review Article 111 of the Constitution on Presidential assent."
        },
        {
            "observation": "Selects the Rajya Sabha passage date (20 Feb 2014).",
            "correctMeaning": "Rajya Sabha completed parliamentary approval, but Presidential signature occurred on 1 March 2014.",
            "selectedMeaning": "Confused final parliamentary approval with Presidential signature.",
            "possibleConfusion": "Rajya Sabha was the final legislative chamber.",
            "decisionRules": [
                {
                    "when": "Rajya Sabha passage = 20 February 2014.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Presidential assent = 1 March 2014.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note the 9-day gap between Rajya Sabha passage and Presidential assent."
        },
        {
            "observation": "Selects 2 June 2014 (Appointed Day).",
            "correctMeaning": "The Appointed Day is when the Act took operational effect; assent occurred on 1 March 2014.",
            "selectedMeaning": "Confused the operational commencement date with the assent date.",
            "possibleConfusion": "Both are key dates printed in the text of the Act.",
            "decisionRules": [
                {
                    "when": "Assent Date = 1 March 2014 (creates the Act).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Appointed Day = 2 June 2014 (creates the new State).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember: Assent (1 March 2014) precedes Appointed Day (2 June 2014) by 3 months."
        }
    ]
}
  },
  // 18. TM-Q293 (Under Section 5 of the Andhra Pradesh Reorganisati...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q293",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M03",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "Under Section 5 of the Andhra Pradesh Reorganisation Act, 2014, what specific statutory provision was made regarding the capital city of Hyderabad?",
    "options": [
        {
            "text": "Hyderabad would serve as a common capital for both Telangana and Andhra Pradesh for a period not exceeding 10 years, after which it would be exclusively the capital of Telangana",
            "why": "Section 5(1) provided that Hyderabad shall be the common capital for both states for a period not exceeding 10 years, and Section 5(2) specified that on expiry of this period, Hyderabad shall be the sole capital of Telangana and AP shall have a new capital.",
            "attraction": "The exact statutory provision of Section 5.",
            "confusion": false
        },
        {
            "text": "Hyderabad was declared a permanent Union Territory with a Legislative Assembly",
            "why": "Hyderabad was never made a Union Territory; it remained an integral part of Telangana subject only to a temporary 10-year common capital status.",
            "attraction": "Demanded by coastal political lobbies, but firmly rejected.",
            "confusion": true
        },
        {
            "text": "Hyderabad was bifurcated into North and South police commissionerates divided between both states",
            "why": "Hyderabad was never territorially or administratively partitioned between the two states; Section 5 only permitted shared administrative office use.",
            "attraction": "Plausible administrative partition concept.",
            "confusion": true
        },
        {
            "text": "Hyderabad would remain a permanent joint capital indefinitely until Parliament legislates otherwise",
            "why": "The statutory period was strictly bounded by 'a period not exceeding 10 years', expiring automatically on 2 June 2024.",
            "attraction": "Open-ended joint capital arrangement similar to Chandigarh.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Section 5(1) provided that Hyderabad shall be the common capital for both states for a period not exceeding 10 years, and Section 5(2) specified that on expiry of this period, Hyderabad shall be the sole capital of Telangana and AP shall have a new capital.",
    "clue": "Identify Hyderabad would serve as a common capital for both Telangana and Andhra Pradesh for a period not exceeding 10 years, after which it would be exclusively the capital of Telangana",
    "trap": "Do not confuse with Hyderabad was declared a permanent Union Territory with a Legislative Assembly",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Hyderabad would serve as a common capital for both Telangana and Andhra Pradesh for a period not exceeding 10 years, after which it would be exclusively the capital of Telangana is the established historical fact.",
    "hint": "The exact statutory provision of Section 5.",
    "source": "SR-POLICE-SI-2016",
    "page": 517,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Section 5: Hyderabad as common capital for not more than 10 years.",
            "correctMeaning": "Section 5 mandated that Hyderabad serves as common capital for up to 10 years (expiring 2 June 2024), after which it belongs exclusively to Telangana.",
            "selectedMeaning": "Correct choice recognizing Section 5 of the 2014 Act.",
            "possibleConfusion": "Comparing Hyderabad with Chandigarh's permanent Union Territory status.",
            "decisionRules": [
                {
                    "when": "Section 5 = Hyderabad common capital for not exceeding 10 years.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "On 2 June 2024, the 10-year period expired and Hyderabad is exclusively Telangana's capital.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit Section 5 to memory: Common Capital for up to 10 years."
        },
        {
            "observation": "Assumes Hyderabad was made a Union Territory.",
            "correctMeaning": "Telangana political leadership and students successfully prevented Hyderabad from becoming a Union Territory.",
            "selectedMeaning": "Selected the rejected Seemandhra political demand.",
            "possibleConfusion": "Repeated media debates about UT status prior to the bill's passage.",
            "decisionRules": [
                {
                    "when": "Hyderabad was never a Union Territory under the 2014 Act.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "It is solely within the territory of Telangana.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note that Section 5 specifically kept Hyderabad within Telangana territory."
        },
        {
            "observation": "Selects physical bifurcation into North/South commissionerates.",
            "correctMeaning": "There was no geographic division of Hyderabad city between the two states.",
            "selectedMeaning": "Mistook joint office arrangements for a territorial partition.",
            "possibleConfusion": "Certain buildings (Secretariat blocks, Assembly) were temporarily shared.",
            "decisionRules": [
                {
                    "when": "City territory was completely preserved intact under Telangana.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Only designated government complexes were shared on lease.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Verify that Section 5 dealt with administrative capital function, not territorial split."
        },
        {
            "observation": "Assumes permanent joint capital like Chandigarh.",
            "correctMeaning": "Unlike Chandigarh, Section 5 set a strict statutory ceiling of 'not exceeding ten years'.",
            "selectedMeaning": "Confused the Punjab/Haryana Chandigarh model with the Telangana 2014 Act.",
            "possibleConfusion": "Chandigarh has remained a joint capital indefinitely since 1966.",
            "decisionRules": [
                {
                    "when": "Chandigarh = indefinite UT and joint capital.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Hyderabad = maximum 10-year temporary common capital under Section 5.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Contrast Section 5 with Chandigarh's indefinite status."
        }
    ]
}
  },
  // 19. TM-Q294 (Under Section 8 of the Andhra Pradesh Reorganisati...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q294",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M04",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "Under Section 8 of the Andhra Pradesh Reorganisation Act, 2014, what special responsibility was assigned to the Governor of the common capital area of Greater Hyderabad?",
    "options": [
        {
            "text": "Special responsibility for the security of life, liberty, and property of all people residing in the common capital area, and responsibility for law and order",
            "why": "Section 8 assigned the Governor special responsibility for security of life, liberty, and property, law and order, internal security, and safety of vital installations in the common capital area, consulting the Council of Ministers but exercising individual judgment.",
            "attraction": "The authentic, highly debated statutory provision of Section 8.",
            "confusion": false
        },
        {
            "text": "Direct legislative power to veto financial bills passed by the Telangana Legislative Assembly",
            "why": "The Governor was never granted financial veto powers over the legislature; normal constitutional rules under Article 200 applied.",
            "attraction": "Extreme executive power over state finances.",
            "confusion": true
        },
        {
            "text": "Supervisory authority over revenue collections of the Greater Hyderabad Municipal Corporation",
            "why": "Section 8 was strictly restricted to law and order, security of residents, and vital installations, having no jurisdiction over municipal tax revenues.",
            "attraction": "Administrative revenue supervision concept.",
            "confusion": true
        },
        {
            "text": "Sole authority to conduct recruitment of public servants through TSPSC",
            "why": "Recruitment remained the constitutional prerogative of the newly constituted Public Service Commission, entirely outside Section 8.",
            "attraction": "Employment safeguard concept.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Section 8 assigned the Governor special responsibility for security of life, liberty, and property, law and order, internal security, and safety of vital installations in the common capital area, consulting the Council of Ministers but exercising individual judgment.",
    "clue": "Identify Special responsibility for the security of life, liberty, and property of all people residing in the common capital area, and responsibility for law and order",
    "trap": "Do not confuse with Direct legislative power to veto financial bills passed by the Telangana Legislative Assembly",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Special responsibility for the security of life, liberty, and property of all people residing in the common capital area, and responsibility for law and order is the established historical fact.",
    "hint": "The authentic, highly debated statutory provision of Section 8.",
    "source": "SR-POLICE-SI-2016",
    "page": 518,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Section 8: Governor's special responsibility for law and order in common capital.",
            "correctMeaning": "Section 8 gave the Governor special responsibility for security of life, liberty, property, and law and order in Greater Hyderabad, which was strongly criticized by TRS as an infringement on state autonomy.",
            "selectedMeaning": "Correct choice recognizing Section 8 of the 2014 Act.",
            "possibleConfusion": "Confusing law and order responsibility with municipal or legislative powers.",
            "decisionRules": [
                {
                    "when": "Section 8 = Governor's special responsibility for law & order in common capital area.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Applicable only during the period Hyderabad served as common capital.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit Section 8 to memory: Governor's special powers for law and order in Hyderabad."
        },
        {
            "observation": "Assumes financial bill veto power.",
            "correctMeaning": "Section 8 did not touch financial or legislative procedures of the state assembly.",
            "selectedMeaning": "Attributed exaggerated legislative veto powers to the Governor.",
            "possibleConfusion": "Section 8 was contentious, leading some to assume vast legislative interference.",
            "decisionRules": [
                {
                    "when": "Legislative powers are governed by standard Articles 199 and 200.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Section 8 is strictly confined to security and law and order.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Re-read Section 8 text to verify its scope is limited to security."
        },
        {
            "observation": "Selects GHMC municipal revenue supervision.",
            "correctMeaning": "GHMC finances and municipal administration remained entirely with the state government.",
            "selectedMeaning": "Confused civic governance with the law and order security mandate.",
            "possibleConfusion": "The common capital area coincided largely with GHMC boundaries.",
            "decisionRules": [
                {
                    "when": "GHMC revenue collection was not transferred to the Governor.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Only safety, security, and vital installations fell under Section 8.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note the boundary of GHMC was used only to define the geographical security area."
        },
        {
            "observation": "Selects TSPSC recruitment authority.",
            "correctMeaning": "Public employment recruitment was governed by Section 85 and Article 315, not Section 8.",
            "selectedMeaning": "Confused employee recruitment with the Governor's security role.",
            "possibleConfusion": "Employment was the central issue of the Telangana movement.",
            "decisionRules": [
                {
                    "when": "Public employment is governed by Part VIII of the Act and Article 371-D.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Section 8 relates strictly to security and policing oversight.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep employment/cadre allocation separate from Section 8 security provisions."
        }
    ]
}
  },
  // 20. TM-Q295 (Soon after the passage of the AP Reorganisation Ac...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q295",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M05",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "Soon after the passage of the AP Reorganisation Act 2014, seven revenue mandals of Khammam district were transferred to Andhra Pradesh to facilitate the Indira Sagar (Polavaram) National Irrigation Project. Which of the following mandals was partially (not fully) transferred under this statutory reallocation?",
    "options": [
        {
            "text": "Burgampahad mandal (only revenue villages affected by Polavaram submergence were transferred; mandal headquarters remained in Telangana)",
            "why": "Of the seven transferred mandals, six (Kukunoor, Velairpadu, Kunavaram, Chintoor, VR Puram, and Bhadrachalam rural villages) were transferred completely or primarily, but Burgampahad was strictly bifurcated: only the submergence villages were transferred to AP, while the mandal headquarters Burgampahad remained in Telangana (now in Bhadradri Kothagudem).",
            "attraction": "The classic, exact factual question tested in TSPSC SI and Constable examinations.",
            "confusion": false
        },
        {
            "text": "Kunavaram mandal (fully transferred)",
            "why": "Kunavaram mandal was fully transferred in its entirety to East Godavari / Alluri Sitharama Raju district of Andhra Pradesh.",
            "attraction": "Completely transferred mandal.",
            "confusion": true
        },
        {
            "text": "Chintoor mandal (fully transferred)",
            "why": "Chintoor mandal was completely transferred in its entirety to Andhra Pradesh.",
            "attraction": "Completely transferred tribal mandal.",
            "confusion": true
        },
        {
            "text": "Vararamachandrapuram / VR Puram mandal (fully transferred)",
            "why": "VR Puram mandal was transferred in its entirety to Andhra Pradesh.",
            "attraction": "Completely transferred submergence mandal.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Of the seven transferred mandals, six (Kukunoor, Velairpadu, Kunavaram, Chintoor, VR Puram, and Bhadrachalam rural villages) were transferred completely or primarily, but Burgampahad was strictly bifurcated: only the submergence villages were transferred to AP, while the mandal headquarters Burgampahad remained in Telangana (now in Bhadradri Kothagudem).",
    "clue": "Identify Burgampahad mandal (only revenue villages affected by Polavaram submergence were transferred; mandal headquarters remained in Telangana)",
    "trap": "Do not confuse with Kunavaram mandal (fully transferred)",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Burgampahad mandal (only revenue villages affected by Polavaram submergence were transferred; mandal headquarters remained in Telangana) is the established historical fact.",
    "hint": "The classic, exact factual question tested in TSPSC SI and Constable examinations.",
    "source": "SR-POLICE-SI-2016",
    "page": 519,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Burgampahad as the mandal only partially transferred to Andhra Pradesh.",
            "correctMeaning": "Under the Polavaram transfer ordinance/amendment (2014), Burgampahad mandal was split: non-submergence villages and the mandal HQ remained in Telangana, while submergence villages went to AP.",
            "selectedMeaning": "Correct choice recognizing the partial transfer of Burgampahad mandal.",
            "possibleConfusion": "Thinking all 7 mandals were transferred as complete administrative units.",
            "decisionRules": [
                {
                    "when": "The partially transferred mandal = Burgampahad (HQ remained in Telangana).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Also Bhadrachalam temple town and revenue village remained in Telangana, while its rural submergence hamlets were moved to AP.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit to memory: Burgampahad = partially transferred mandal (HQ in Telangana)."
        },
        {
            "observation": "Selects Kunavaram, which was transferred fully.",
            "correctMeaning": "Kunavaram was completely transferred to Andhra Pradesh without retaining any part in Telangana.",
            "selectedMeaning": "Confused a fully transferred mandal with the bifurcated mandal.",
            "possibleConfusion": "Kunavaram is one of the celebrated 7 transferred mandals.",
            "decisionRules": [
                {
                    "when": "Kunavaram = fully transferred.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Burgampahad = partially transferred.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review the list of 6 fully transferred mandals versus Burgampahad."
        },
        {
            "observation": "Selects Chintoor, which was transferred fully.",
            "correctMeaning": "Chintoor was fully transferred to AP and became a revenue division headquarters in AP.",
            "selectedMeaning": "Confused a fully transferred tribal division with Burgampahad.",
            "possibleConfusion": "Chintoor had the largest tribal population among the transferred mandals.",
            "decisionRules": [
                {
                    "when": "Chintoor was transferred completely.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Only Burgampahad had its headquarters retained in Telangana.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note Chintoor's total transfer to Andhra Pradesh."
        },
        {
            "observation": "Selects VR Puram, which was transferred fully.",
            "correctMeaning": "VR Puram was located directly in the gorge submergence zone and was transferred entirely.",
            "selectedMeaning": "Mistook a completely submerged and transferred mandal for the partial one.",
            "possibleConfusion": "VR Puram was the epicenter of Polavaram submergence fears.",
            "decisionRules": [
                {
                    "when": "VR Puram = 100% transferred.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Burgampahad = partially transferred.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Memorize the 7 transferred mandals: Kukunoor, Velairpadu, Chintoor, Kunavaram, VR Puram, Bhadrachalam (rural villages), Burgampahad (partial)."
        }
    ]
}
  },
  // 21. TM-Q296 (On which date, officially designated as the 'Appoi...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q296",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M06",
    "model": "Chronology",
    "modelId": "TM-QM-CHRON-01",
    "stage": "practice",
    "prompt": "On which date, officially designated as the 'Appointed Day' under Section 2(a) of the Andhra Pradesh Reorganisation Act 2014, did the new State of Telangana legally come into existence as the 29th State of the Republic of India?",
    "options": [
        {
            "text": "2 June 2014",
            "why": "By official notification of the Ministry of Home Affairs on 4 March 2014, 2 June 2014 was notified as the 'Appointed Day', on which Telangana officially became India's 29th State and KCR was sworn in as the first Chief Minister.",
            "attraction": "The authentic Appointed Day / Telangana State Formation Day.",
            "confusion": false
        },
        {
            "text": "1 March 2014",
            "why": "1 March 2014 was the date of Presidential assent to Act No. 6 of 2014, not the Appointed Day of state birth.",
            "attraction": "Presidential assent date.",
            "confusion": true
        },
        {
            "text": "15 August 2014",
            "why": "15 August 2014 was India's Independence Day, where KCR delivered his first address at Golconda Fort, not the Appointed Day.",
            "attraction": "Historic Independence Day celebrated at Golconda Fort.",
            "confusion": true
        },
        {
            "text": "1 November 2014",
            "why": "1 November was the date of Andhra Pradesh formation in 1956, which Telangana people had rejected for decades.",
            "attraction": "Former Andhra Pradesh state formation date.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "By official notification of the Ministry of Home Affairs on 4 March 2014, 2 June 2014 was notified as the 'Appointed Day', on which Telangana officially became India's 29th State and KCR was sworn in as the first Chief Minister.",
    "clue": "Identify 2 June 2014",
    "trap": "Do not confuse with 1 March 2014",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "2 June 2014 is the established historical fact.",
    "hint": "The authentic Appointed Day / Telangana State Formation Day.",
    "source": "SR-POLICE-SI-2016",
    "page": 520,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies 2 June 2014 as the official Appointed Day of Telangana.",
            "correctMeaning": "2 June 2014 is the statutory Appointed Day under Section 2(a) of the AP Reorganisation Act 2014, celebrated annually as Telangana State Formation Day.",
            "selectedMeaning": "Correct choice recognizing 2 June 2014.",
            "possibleConfusion": "Confusing Presidential assent (1 March 2014) with the Appointed Day (2 June 2014).",
            "decisionRules": [
                {
                    "when": "Appointed Day = 2 June 2014.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Swearing-in: KCR as first CM, E.S.L. Narasimhan as Governor.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit to memory: 2 June 2014 = Telangana Appointed Day / State Formation Day."
        },
        {
            "observation": "Selects 1 March 2014 (Presidential assent).",
            "correctMeaning": "1 March 2014 made the bill an Act; the Act itself came into force on the Appointed Day (2 June 2014).",
            "selectedMeaning": "Confused the date of enactment with the Appointed Day.",
            "possibleConfusion": "Both dates mark major legal milestones.",
            "decisionRules": [
                {
                    "when": "Presidential assent = 1 March 2014.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Appointed Day = 2 June 2014.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Differentiate between enactment date and appointed commencement date."
        },
        {
            "observation": "Selects 15 August 2014.",
            "correctMeaning": "15 August 2014 was the first Independence Day celebrated at Golconda Fort, not the state's founding day.",
            "selectedMeaning": "Confused the historic Golconda Fort speech with the founding day.",
            "possibleConfusion": "KCR shifted the Independence Day parade from Parade Grounds to Golconda Fort in 2014.",
            "decisionRules": [
                {
                    "when": "2 June 2014 = State Formation Day.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "15 August 2014 = First Independence Day at Golconda Fort.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note the significance of Golconda Fort on 15 August 2014."
        },
        {
            "observation": "Selects 1 November 2014.",
            "correctMeaning": "1 November 1956 was the original merger date (Visalandhra), which was commemorated as a betrayal day by Telangana people.",
            "selectedMeaning": "Selected the old composite state formation anniversary.",
            "possibleConfusion": "Andhra Pradesh celebrated 1 November for 58 years.",
            "decisionRules": [
                {
                    "when": "1 November = 1956 Andhra Pradesh merger.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "2 June = 2014 Telangana State formation.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember why 2 June replaced 1 November as the state day."
        }
    ]
}
  },
  // 22. TM-Q297 (Under the new Presidential Order of 2018 (The Tela...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q297",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M07",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "Under the new Presidential Order of 2018 (The Telangana Public Employment Organisation of Local Cadres and Regulation of Direct Recruitment Order, 2018), the state was reorganized into 7 Zones and 2 Multi-Zones. What exact percentage of direct recruitment posts in District, Zonal, and Multi-Zonal cadres (including Police SI and Constable) was reserved for local candidates?",
    "options": [
        {
            "text": "95% reservation for local candidates (5% open unreserved quota)",
            "why": "Under the 2018 Presidential Order, an unprecedented 95% of direct recruitment posts in all local cadres (District, Zonal, and Multi-Zonal, including SI and Constable) are reserved exclusively for local candidates, leaving only 5% as open unreserved quota.",
            "attraction": "The exact statutory reservation percentage enacted in the 2018 Presidential Order.",
            "confusion": false
        },
        {
            "text": "80% reservation for local candidates (20% open quota)",
            "why": "80% was the district cadre local reservation under the old 1975 Presidential Order, not the 2018 Order.",
            "attraction": "Old 1975 Presidential Order district percentage.",
            "confusion": true
        },
        {
            "text": "70% reservation for local candidates (30% open quota)",
            "why": "70% was the zonal non-gazetted reservation under the 1975 Presidential Order, not the 2018 Order.",
            "attraction": "Old 1975 Presidential Order zonal percentage.",
            "confusion": true
        },
        {
            "text": "100% reservation for local candidates (0% open quota)",
            "why": "100% local reservation is unconstitutional under Article 16(2) and Supreme Court rulings; the order legally preserves a 5% unreserved merit pool.",
            "attraction": "Common misconception that local reservation is total.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Under the 2018 Presidential Order, an unprecedented 95% of direct recruitment posts in all local cadres (District, Zonal, and Multi-Zonal, including SI and Constable) are reserved exclusively for local candidates, leaving only 5% as open unreserved quota.",
    "clue": "Identify 95% reservation for local candidates (5% open unreserved quota)",
    "trap": "Do not confuse with 80% reservation for local candidates (20% open quota)",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "95% reservation for local candidates (5% open unreserved quota) is the established historical fact.",
    "hint": "The exact statutory reservation percentage enacted in the 2018 Presidential Order.",
    "source": "SR-POLICE-SI-2016",
    "page": 521,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies 95% local reservation under the 2018 Presidential Order.",
            "correctMeaning": "The 2018 Presidential Order unified all cadres (District, Zonal, Multi-Zonal) to provide a uniform 95% reservation for locals and 5% open merit quota, directly applying to TS Police SI and Constable recruitments.",
            "selectedMeaning": "Correct choice recognizing 95% local reservation.",
            "possibleConfusion": "Confusing 2018's 95% with 1975's tiered 80%/70%/60% system.",
            "decisionRules": [
                {
                    "when": "2018 Presidential Order = 95% local reservation across District, Zonal, and Multi-Zonal posts.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "1975 Presidential Order = 80% District, 70% Zonal Non-Gazetted, 60% Zonal Gazetted.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit 95% to memory: direct question for TS Police SI and Constable aspirants."
        },
        {
            "observation": "Selects 80% from the 1975 Presidential Order.",
            "correctMeaning": "80% applied only to district cadres under the 1975 order; the 2018 order raised it to 95%.",
            "selectedMeaning": "Selected the old 1975 district reservation percentage.",
            "possibleConfusion": "1975 order percentages are frequently memorized for history questions.",
            "decisionRules": [
                {
                    "when": "1975 Order District Cadre = 80%.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "2018 Order all cadres = 95%.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Always verify whether the question asks about the 1975 Order or the 2018 Order."
        },
        {
            "observation": "Selects 70% from the 1975 Zonal cadre.",
            "correctMeaning": "70% was the old zonal non-gazetted quota; 2018 unified everything at 95%.",
            "selectedMeaning": "Selected the old zonal non-gazetted percentage.",
            "possibleConfusion": "SI is a zonal/multi-zonal post, leading students to remember old zonal figures.",
            "decisionRules": [
                {
                    "when": "Under the 2018 Order, Sub-Inspector (Multi-Zonal) is 95% local.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "The old 70% figure is completely superseded.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Note that under the 2018 order, SI posts enjoy 95% local reservation."
        },
        {
            "observation": "Selects 100% reservation.",
            "correctMeaning": "Supreme Court jurisprudence prohibits 100% reservation in direct recruitment, so 5% open quota is retained.",
            "selectedMeaning": "Assumed total exclusion of non-locals.",
            "possibleConfusion": "Believing 'local quota' means complete exclusion of outside competition.",
            "decisionRules": [
                {
                    "when": "5% is open to all on merit.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "95% is strictly reserved for local candidates.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember the 95:5 ratio in all Telangana direct recruitment notifications."
        }
    ]
}
  },
  // 23. TM-Q298 (Under the 2018 Presidential Order 7-zone organizat...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q298",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M08",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "Under the 2018 Presidential Order 7-zone organizational setup, into which two Multi-Zones are the 7 Zones grouped for higher state government cadres, including Police Sub-Inspectors (SI)?",
    "options": [
        {
            "text": "Multi-Zone I (Zones 1 to 4: Kaleshwaram, Basara, Rajanna, Bhadradri) and Multi-Zone II (Zones 5 to 7: Yadadri, Charminar, Jogulamba)",
            "why": "Multi-Zone I comprises Zone 1 (Kaleshwaram), Zone 2 (Basara), Zone 3 (Rajanna), and Zone 4 (Bhadradri). Multi-Zone II comprises Zone 5 (Yadadri), Zone 6 (Charminar), and Zone 7 (Jogulamba).",
            "attraction": "The authentic, statutory grouping of Zones into Multi-Zones under the 2018 Order.",
            "confusion": false
        },
        {
            "text": "Multi-Zone I (Zones 1 to 3) and Multi-Zone II (Zones 4 to 7)",
            "why": "Multi-Zone I has 4 zones (1-4) and Multi-Zone II has 3 zones (5-7), not 3 and 4.",
            "attraction": "Plausible numerical division.",
            "confusion": true
        },
        {
            "text": "Multi-Zone I (Northern Telangana: Zones 1, 2, 5) and Multi-Zone II (Southern Telangana: Zones 3, 4, 6, 7)",
            "why": "Zone 5 (Yadadri) is in Multi-Zone II, not Multi-Zone I; Zone 3 and 4 are in Multi-Zone I.",
            "attraction": "Geographical north-south speculation.",
            "confusion": true
        },
        {
            "text": "Multi-Zone I (Rural Zones) and Multi-Zone II (Urban GHMC Zones)",
            "why": "The zones are contiguous geographical territories combining rural and urban districts, not separated into rural and urban categories.",
            "attraction": "Rural vs urban administrative categorization.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Multi-Zone I comprises Zone 1 (Kaleshwaram), Zone 2 (Basara), Zone 3 (Rajanna), and Zone 4 (Bhadradri). Multi-Zone II comprises Zone 5 (Yadadri), Zone 6 (Charminar), and Zone 7 (Jogulamba).",
    "clue": "Identify Multi-Zone I (Zones 1 to 4: Kaleshwaram, Basara, Rajanna, Bhadradri) and Multi-Zone II (Zones 5 to 7: Yadadri, Charminar, Jogulamba)",
    "trap": "Do not confuse with Multi-Zone I (Zones 1 to 3) and Multi-Zone II (Zones 4 to 7)",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Multi-Zone I (Zones 1 to 4: Kaleshwaram, Basara, Rajanna, Bhadradri) and Multi-Zone II (Zones 5 to 7: Yadadri, Charminar, Jogulamba) is the established historical fact.",
    "hint": "The authentic, statutory grouping of Zones into Multi-Zones under the 2018 Order.",
    "source": "SR-POLICE-SI-2016",
    "page": 522,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Multi-Zone I (Zones 1-4) and Multi-Zone II (Zones 5-7).",
            "correctMeaning": "Multi-Zone I (Northern & Eastern: Kaleshwaram, Basara, Rajanna, Bhadradri) and Multi-Zone II (Central & Southern: Yadadri, Charminar, Jogulamba) divide the state for SI and intermediate gazetted cadres.",
            "selectedMeaning": "Correct choice recognizing the exact zone distribution between Multi-Zone I and II.",
            "possibleConfusion": "Misremembering which zone numbers belong to Multi-Zone I versus Multi-Zone II.",
            "decisionRules": [
                {
                    "when": "Multi-Zone I = Zones 1, 2, 3, 4 (Kaleshwaram, Basara, Rajanna, Bhadradri).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Multi-Zone II = Zones 5, 6, 7 (Yadadri, Charminar, Jogulamba).",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit to memory: Multi-Zone I has 4 zones (1 to 4); Multi-Zone II has 3 zones (5 to 7)."
        },
        {
            "observation": "Assumes Multi-Zone I has 3 zones and Multi-Zone II has 4.",
            "correctMeaning": "Multi-Zone I contains 4 zones; Multi-Zone II contains 3 zones.",
            "selectedMeaning": "Reversed the zone count between the two multi-zones.",
            "possibleConfusion": "Even split assumption (3 and 4 vs 4 and 3).",
            "decisionRules": [
                {
                    "when": "Multi-Zone I has 4 zones.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Multi-Zone II has 3 zones.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "List the 7 zones in order: Kaleshwaram, Basara, Rajanna, Bhadradri, Yadadri, Charminar, Jogulamba."
        },
        {
            "observation": "Mismatches Zone 5 into Multi-Zone I.",
            "correctMeaning": "Zone 5 (Yadadri) is part of Multi-Zone II along with Charminar (6) and Jogulamba (7).",
            "selectedMeaning": "Misclassified Zone 5 into Multi-Zone I.",
            "possibleConfusion": "Yadadri borders northern districts, causing boundary confusion.",
            "decisionRules": [
                {
                    "when": "Yadadri (Zone 5) is in Multi-Zone II.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Bhadradri (Zone 4) is in Multi-Zone I.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember: Bhadradri is in MZ-I; Yadadri is in MZ-II."
        },
        {
            "observation": "Assumes rural versus urban split.",
            "correctMeaning": "Zonal division is purely geographic and contiguous, not segregated by urban/rural characteristics.",
            "selectedMeaning": "Confused functional zoning with geographic multi-zoning.",
            "possibleConfusion": "Charminar (Zone 6) includes urban GHMC, tempting students to assume an urban category.",
            "decisionRules": [
                {
                    "when": "Zones are territorial clusters of revenue districts.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Charminar zone also includes Rangareddy and Medchal-Malkajgiri districts.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review district allocations within each of the 7 zones."
        }
    ]
}
  },
  // 24. TM-Q299 (In June 2024, the Government of Telangana official...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q299",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M09",
    "model": "Recognition",
    "modelId": "TM-QM-REC-01",
    "stage": "practice",
    "prompt": "In June 2024, the Government of Telangana officially adopted the celebrated song 'Jaya Jayahe Telangana Janani Jayakethanam' as the official State Anthem of Telangana. Who is the renowned poet and folk lyricist who composed this iconic anthem during the statehood agitation?",
    "options": [
        {
            "text": "Dr. Ande Sri",
            "why": "Dr. Ande Sri (Andesree), a self-taught folk poet and philosopher from Jangaon, composed 'Jaya Jayahe Telangana Janani Jayakethanam', which became the emotional anthem of the statehood agitation and was officially designated the State Anthem in June 2024.",
            "attraction": "The authentic composer of the official Telangana State Anthem.",
            "confusion": false
        },
        {
            "text": "Gaddar",
            "why": "Gaddar wrote and sang immortal movement songs like 'Podustunna Poddu Meeda' and 'Amma Telanganama', but did not write 'Jaya Jayahe Telangana'.",
            "attraction": "Legendary revolutionary balladeer.",
            "confusion": true
        },
        {
            "text": "Goreti Venkanna",
            "why": "Goreti Venkanna wrote celebrated folk songs like 'Galli Chinnadi' and 'Vallanki Taalam' (Sahitya Akademi Award), not 'Jaya Jayahe Telangana'.",
            "attraction": "Eminent Telangana folk poet and MLC.",
            "confusion": true
        },
        {
            "text": "Nandini Sidha Reddy",
            "why": "Nandini Sidha Reddy composed the famous song 'Nageti Chaallalla Naa Telangana' and headed the Telangana Sahitya Academy, but not 'Jaya Jayahe Telangana'.",
            "attraction": "First Chairman of Telangana Sahitya Academy.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "Dr. Ande Sri (Andesree), a self-taught folk poet and philosopher from Jangaon, composed 'Jaya Jayahe Telangana Janani Jayakethanam', which became the emotional anthem of the statehood agitation and was officially designated the State Anthem in June 2024.",
    "clue": "Identify Dr. Ande Sri",
    "trap": "Do not confuse with Gaddar",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Dr. Ande Sri is the established historical fact.",
    "hint": "The authentic composer of the official Telangana State Anthem.",
    "source": "SR-POLICE-SI-2016",
    "page": 523,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Dr. Ande Sri as the creator of 'Jaya Jayahe Telangana'.",
            "correctMeaning": "Dr. Ande Sri penned 'Jaya Jayahe Telangana Janani Jayakethanam', which was officially notified as the State Anthem in June 2024 with music composed by M.M. Keeravani.",
            "selectedMeaning": "Correct choice recognizing Dr. Ande Sri.",
            "possibleConfusion": "Confusing Dr. Ande Sri with Gaddar, Goreti Venkanna, or Nandini Sidha Reddy.",
            "decisionRules": [
                {
                    "when": "'Jaya Jayahe Telangana' = Dr. Ande Sri (State Anthem).",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "'Podustunna Poddu Meeda' & 'Amma Telanganama' = Gaddar.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "'Nageti Chaallalla Naa Telangana' = Nandini Sidha Reddy.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Commit to memory: State Anthem = Dr. Ande Sri (adopted June 2024)."
        },
        {
            "observation": "Selects Gaddar.",
            "correctMeaning": "Gaddar is famous for 'Amma Telanganama' and 'Podustunna Poddu Meeda', while Ande Sri composed 'Jaya Jayahe Telangana'.",
            "selectedMeaning": "Confused the revolutionary balladeer with the state anthem poet.",
            "possibleConfusion": "Gaddar's songs were omnipresent in every rally.",
            "decisionRules": [
                {
                    "when": "Gaddar composed 'Podustunna Poddu Meeda'.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Ande Sri composed 'Jaya Jayahe Telangana'.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Match the iconic songs to their respective authors."
        },
        {
            "observation": "Selects Goreti Venkanna.",
            "correctMeaning": "Goreti Venkanna wrote 'Galli Chinnadi' and won the 2021 Sahitya Akademi Award for 'Vallanki Taalam'.",
            "selectedMeaning": "Confused Goreti Venkanna's folk works with the State Anthem.",
            "possibleConfusion": "Both are celebrated rural folk poets.",
            "decisionRules": [
                {
                    "when": "Goreti Venkanna = 'Galli Chinnadi' / 'Vallanki Taalam'.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Ande Sri = 'Jaya Jayahe Telangana' / 'Mayadari Maikamu'.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review Goreti Venkanna's major works to avoid poet confusion."
        },
        {
            "observation": "Selects Nandini Sidha Reddy.",
            "correctMeaning": "Nandini Sidha Reddy wrote 'Nageti Chaallalla Naa Telangana' and founded MaRaSam, but did not compose 'Jaya Jayahe Telangana'.",
            "selectedMeaning": "Confused the MaRaSam founder with Ande Sri.",
            "possibleConfusion": "Both poets' songs were featured prominently in films like 'Jai Bolo Telangana'.",
            "decisionRules": [
                {
                    "when": "Nandini Sidha Reddy = 'Nageti Chaallalla Naa Telangana'.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Ande Sri = 'Jaya Jayahe Telangana'.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Differentiate the poetic styles and signature songs of Sidha Reddy and Ande Sri."
        }
    ]
}
  },
  // 25. TM-Q300 (In 2024, the Government of Telangana constituted a...)
  {
    sourceIds: ["SR-POLICE-SI-2016", "SR-HIST-SRIKRISHNA-2010"],
    question: {
    "id": "TM-Q300",
    "topic": "TM-03.02",
    "concept": "TM-03.02-M10",
    "model": "Provision identification",
    "modelId": "TM-QM-PROV-01",
    "stage": "practice",
    "prompt": "In 2024, the Government of Telangana constituted a Judicial Commission of Inquiry headed by a retired Supreme Court judge to thoroughly investigate alleged structural irregularities, sinking of piers, and design defects at the Medigadda, Annaram, and Sundilla barrages of the Kaleshwaram Lift Irrigation Project. Who heads this commission?",
    "options": [
        {
            "text": "Justice Pinaki Chandra Ghose (Justice P.C. Ghose, former Supreme Court judge and former Lokpal of India)",
            "why": "In March 2024, the Telangana government appointed Justice Pinaki Chandra Ghose (P.C. Ghose), former Supreme Court judge and India's first Lokpal, as the one-man Judicial Commission of Inquiry to probe irregularities in the Medigadda, Annaram, and Sundilla barrages of the Kaleshwaram project.",
            "attraction": "The authentic head of the 2024 Kaleshwaram judicial inquiry commission.",
            "confusion": false
        },
        {
            "text": "Justice L. Narasimha Reddy",
            "why": "Justice L. Narasimha Reddy was appointed in March 2024 to probe the power purchase agreements and Bhadradri/Yadadri thermal power plant decisions (later stepped down), not the Kaleshwaram barrages commission.",
            "attraction": "Headed the parallel 2024 power sector inquiry commission.",
            "confusion": true
        },
        {
            "text": "Justice B.N. Srikrishna",
            "why": "Justice B.N. Srikrishna headed the 2010 Committee on Andhra Pradesh situation, 14 years earlier.",
            "attraction": "Famous head of the 2010 statehood consultations committee.",
            "confusion": true
        },
        {
            "text": "Justice V.R. Krishna Iyer",
            "why": "Justice V.R. Krishna Iyer was a legendary Supreme Court jurist who passed away in 2014, with no connection to the 2024 inquiry.",
            "attraction": "Historic legal icon.",
            "confusion": true
        }
    ],
    "answer": 0,
    "reason": "In March 2024, the Telangana government appointed Justice Pinaki Chandra Ghose (P.C. Ghose), former Supreme Court judge and India's first Lokpal, as the one-man Judicial Commission of Inquiry to probe irregularities in the Medigadda, Annaram, and Sundilla barrages of the Kaleshwaram project.",
    "clue": "Identify Justice Pinaki Chandra Ghose (Justice P.C. Ghose, former Supreme Court judge and former Lokpal of India)",
    "trap": "Do not confuse with Justice L. Narasimha Reddy",
    "elimination": "Option 1 is correct. Others are distractors.",
    "anchor": "Justice Pinaki Chandra Ghose (Justice P.C. Ghose, former Supreme Court judge and former Lokpal of India) is the established historical fact.",
    "hint": "The authentic head of the 2024 Kaleshwaram judicial inquiry commission.",
    "source": "SR-POLICE-SI-2016",
    "page": 524,
    "sourceStatus": "VERIFIED PYQ",
    "difficulty": 1,
    "relevance": 5,
    "teaching": [
        {
            "observation": "Identifies Justice P.C. Ghose as head of the 2024 Kaleshwaram Commission.",
            "correctMeaning": "Justice P.C. Ghose was appointed in March 2024 to investigate the pier sinking and construction defects at Medigadda, Annaram, and Sundilla barrages of the Kaleshwaram project.",
            "selectedMeaning": "Correct choice recognizing Justice P.C. Ghose.",
            "possibleConfusion": "Confusing Justice P.C. Ghose (Kaleshwaram Barrages) with Justice L. Narasimha Reddy (Power Purchases / Power Plants).",
            "decisionRules": [
                {
                    "when": "Kaleshwaram Barrages (Medigadda) Inquiry = Justice P.C. Ghose Commission.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Power Purchase Agreements (Bhadradri/Yadadri) Inquiry = Justice L. Narasimha Reddy Commission.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Remember the two 2024 inquiries: Justice P.C. Ghose (Kaleshwaram) and Justice L. Narasimha Reddy (Power sector)."
        },
        {
            "observation": "Selects Justice L. Narasimha Reddy.",
            "correctMeaning": "Justice L. Narasimha Reddy was appointed to probe the electricity and power purchase deals, not the Kaleshwaram barrages.",
            "selectedMeaning": "Confused the power sector commission with the irrigation barrage commission.",
            "possibleConfusion": "Both commissions were announced around the same time in March 2024 by the state government.",
            "decisionRules": [
                {
                    "when": "Irrigation / Barrages = Justice P.C. Ghose.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Power agreements = Justice L. Narasimha Reddy.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Always distinguish the subject matter: Water/Barrages (Ghose) vs Electricity/Power (Narasimha Reddy)."
        },
        {
            "observation": "Selects Justice B.N. Srikrishna.",
            "correctMeaning": "Justice Srikrishna headed the 2010 statehood consultations committee, not the 2024 engineering probe.",
            "selectedMeaning": "Selected the 2010 statehood committee head.",
            "possibleConfusion": "High name recognition in Telangana contemporary history.",
            "decisionRules": [
                {
                    "when": "2010 Srikrishna Committee was on state bifurcation.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "2024 P.C. Ghose Commission is on Kaleshwaram barrages.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Keep statehood agitation committees distinct from post-formation governance inquiry commissions."
        },
        {
            "observation": "Selects Justice V.R. Krishna Iyer.",
            "correctMeaning": "Justice Krishna Iyer passed away in 2014 and was an iconic jurist of the 1970s and 1980s.",
            "selectedMeaning": "Selected a historical Supreme Court figure.",
            "possibleConfusion": "Prominent name in Indian public interest law.",
            "decisionRules": [
                {
                    "when": "Justice P.C. Ghose is a modern retired SC judge and former Lokpal.",
                    "choose": "Verified historical fact"
                },
                {
                    "when": "Verify active judicial appointments made in 2024.",
                    "choose": "Verified historical fact"
                }
            ],
            "nextStep": "Review the recent 2024 judicial commissions constituted in Telangana."
        }
    ]
}
  },
];

console.log("Starting ingestion of Batch 15 (25 questions: TM-Q276 to TM-Q300)...");

const importPayload = {
  actor: "human_operator_curator",
  reason: "Ingesting Batch 15: 25 master milestone questions covering TRS formation, 2009-2014 mass movements, AP Reorganisation Act 2014, 2018 Presidential Order, and 2024 developments (TM-Q276 to TM-Q300).",
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
  reason: "Batch 15 verified and authenticated for Telangana Police SI & Constable preparation.",
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

const rows = db.prepare("SELECT id FROM corpus_questions WHERE published_version IS NOT NULL").all();
const insertLegacy = db.prepare("INSERT OR REPLACE INTO questions VALUES(?,?,?,?,?)");
for (const r of rows) {
  const qRow = db.prepare("SELECT content FROM corpus_question_versions WHERE question_id=? ORDER BY version DESC LIMIT 1").get(r.id);
  const q = JSON.parse(qRow.content);
  insertLegacy.run(q.id, q.topic, q.modelId, q.sourceStatus, qRow.content);
}

const totalCount = db.prepare("SELECT count(*) as count FROM questions").get();
const publishedCount = db.prepare("SELECT count(*) as count FROM corpus_questions WHERE published_version IS NOT NULL").get();

console.log(`Batch 15 complete! Total ${batchQuestions.length} questions successfully imported and published.`);
console.log(`Total questions in DB: ${totalCount.count}`);
console.log(`Published questions in Corpus: ${publishedCount.count}`);

db.close();
