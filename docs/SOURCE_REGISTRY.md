# Source registry

Inventory audit: 2026-10-01. **Seven documented references; five local PDF files hashed; one initial runtime corpus source registration planned/implemented for the Srikrishna report.** Consult `corpusSummary` for actual database registrations; this document's inventory is not an authenticated-source count. There are zero authenticated paper/final-key pairs in the scored corpus.

The source registry schema is: `source_id`, `exam`, `conducting_body`, `state`, `year`, `paper`, `stage`, `language`, `source_type`, `official_or_secondary`, `source_url`, `download_status`, `verification_status`, `answer_key_available`, `ocr_status`, `extraction_status`, `question_count`, `relevant_question_count`, `checksum`, `duplicate_group`, `notes`, `last_verified_at`.

For every record below, `question_count` and `relevant_question_count` are **unknown**, not zero; no reconciled extraction inventory exists. `duplicate_group` is null: the five inspected PDF hashes are distinct, but no complete similarity audit was run. A report has no exam answer key; that value is `not_applicable`. For papers, `unknown` is distinct from an established absence of a key. Source files live in the parent `sources` directory; an unverified filename is not proof of exam identity.

## SR-HIST-SRIKRISHNA-2010

- Exam: not applicable; conducting body: Committee for Consultations on the Situation in Andhra Pradesh, report hosted by Ministry of Home Affairs; state: Andhra Pradesh / Telangana historical domain; year: 2010; paper: committee report; stage: not applicable; language: English.
- Type: historical government report; origin classification: official-host reference with existing local copy; URL: https://www.mha.gov.in/sites/default/files/CCSAP-REPORT-060111.pdf.
- Download: local `Srikrishna_Committee_Report_2010.pdf`, 11,980,748 bytes. The original local download chain was not recreated during this audit.
- Verification: claim-level local text checked; no claim of a full-document historical audit or byte comparison with a fresh official download.
- Key: not applicable; OCR: extraction method not recorded; extraction: parent `rebuild/corpus/Srikrishna_2010.txt` exists with PDF page markers, relevant passages inspected.
- SHA256: `F05DE3EFBB858E2FD8178B8662F8DFE19026CFB6D2AEF93D0575BA1055278F91`.
- Notes: PDF77/printed37, chapter1 §1.2.27 supports six formula provisions, including the Central University proposal in point2. PDF289/printed246, chapter5 §5.2.01–03 supports Mulki public-employment safeguards and the15-year residence route with additional conditions. It does not make authored practice a PYQ.
- Last verified: 2026-10-01, local hash and specified passages only. Runtime ID aligned with this record.

## SR-POLICE-SI-2016

- Exam: claimed Telangana Police SI; conducting body: not authenticated; state: Telangana (filename/candidate classification); year: 2016 claimed; paper/set: unknown; stage: unknown; language: not fully audited.
- Type: candidate previous paper; official/secondary: unknown; source URL: unknown.
- Download: local `TS_Police_SI_2016.pdf`, 1,223,525 bytes; verification: file identity only, original-paper authenticity and final key pending.
- Key: unknown; OCR: method/accuracy unknown; extraction: `rebuild/corpus/TS_Police_SI_2016.txt` exists, not reconciled question by question.
- SHA256: `645897D0F35A64C34CDB0A38D3A6B4E7CB2FE4DF87D070F925A34228459A8522`.
- Notes: available in the app for document inspection, not scored as an authenticated PYQ. Do not infer stage, numbering or official answers from the filename.
- Last verified: 2026-10-01, existence and hash only.

## SR-LEGAL-APRA-2014

- Exam: not applicable; conducting body/authoritative origin: Parliament/Government of India document identity to authenticate; state: Andhra Pradesh/Telangana; year: 2014 claimed; paper: Andhra Pradesh Reorganisation Act; stage: not applicable; language: not independently audited.
- Type: candidate legal reference; official/secondary local-copy provenance: unknown; source URL: unknown.
- Download: local `AP_Reorganisation_Act_2014.pdf`, 231,596 bytes; verification: file identity only in this pass; key: not applicable; OCR: unknown; extraction: not inventoried in the named parent text corpus.
- SHA256: `84CD566B917F9A3F600C47F6540520C950166B424A964AD37D64DC3C968114AA`.
- Notes: establish official Act identity, amendments and commencement evidence before authoring legal/date questions.
- Last verified: 2026-10-01, existence and hash only.

## SR-SCERT-8-SOCIAL

- Exam: not applicable; conducting body: SCERT identity/edition to authenticate; state: Telangana candidate; year: unknown; paper: Class8 Social Studies English candidate; stage: not applicable; language: English indicated by filename, text extraction available.
- Type: textbook; official/secondary copy provenance: unknown; source URL: unknown.
- Download: local `SCERT_8_Social_English.pdf`, 20,243,640 bytes; verification: file identity only in this pass; key: not applicable; OCR: method/accuracy unknown; extraction: `rebuild/corpus/SCERT_8.txt` exists.
- SHA256: `D5642AD35F4889EF14DE3D7344E439D3EC57DF5F4520A4AB7F32FAA98E5F6764`.
- Notes: authenticate edition and relevant passages; textbook facts are not examination occurrences.
- Last verified: 2026-10-01, existence and hash only.

## SR-RESEARCH-GROUP2-2024

- Exam: claimed Group2; conducting body: TGPSC candidate, not authenticated; state: Telangana; year: 2024 claimed; paper: Paper4 claimed; stage: unknown; language: not fully audited.
- Type: research-only candidate paper; official/secondary: unknown; source URL: unknown.
- Download: local `TGPSC_Group2_Paper4_2024.pdf`, 1,103,232 bytes; verification: file identity only; key: unknown; OCR: method/accuracy unknown; extraction: `rebuild/corpus/TGPSC_Group2_2024.txt` exists.
- SHA256: `9D906A27DEEBFF25923DADA50D34831109B1ED092E8744F3D429F74FAB4B335D`.
- Notes: transferable Telangana-history models only. This source cannot create a Group2 learner target.
- Last verified: 2026-10-01, existence and hash only.

## SR-SYLLABUS-SI-2022

- Exam: Telangana Police SI; conducting body: Telangana State Level Police Recruitment Board; state: Telangana; year: 2022; paper: notification dated25April2022; stage: recruitment/syllabus; language: English.
- Type: official recruitment notification; origin: official-host URL previously inspected; URL: https://tslprbpartone.s3.ap-south-1.amazonaws.com/SI%28Civil%292022_Notification_25-4-2022.pdf.
- Download: remote reference, no retained PDF bytes inventoried here; verification: prior content review recorded in CONTENT.md; current recruitment applicability not independently verified.
- Key: not applicable; OCR: not applicable to recorded browser review; extraction: relevant PDF pages33 and35 recorded; checksum: unavailable until bytes retained.
- Notes: supports the three movement phases. It is a2022 baseline, not a verified current2026 SI/Constable syllabus. Local2026 extracted notification is a discovery lead only.
- Last verified: prior session, exact timestamp not retained; inventory reviewed2026-10-01 without a new online fetch.

## SR-WEB-STATE-FORMATION

- Exam: not applicable; conducting body: Telangana government, Legislative Affairs department; state: Telangana; year: publication date unknown; paper: department page; stage: not applicable; language: English.
- Type: official government web reference; origin: official domain; URL: https://www.telangana.gov.in/departments/legislative-affairs/.
- Download: remote reference, no immutable snapshot inventoried; verification: prior claim review recorded in CONTENT.md; key: not applicable; OCR: not applicable; extraction: state-formation paragraph only; checksum: unavailable.
- Notes: corroborates2June2014 formation. Store a dated page snapshot and passage locator before relying on future changed content.
- Last verified: prior session, exact timestamp not retained; inventory reviewed2026-10-01 without a new online fetch.

## SR-POLICE-CONSTABLE-2016-2022

- Exam: Telangana Police Constable; conducting body: Telangana State Level Police Recruitment Board (TSLPRB); state: Telangana; years: 2016, 2018, 2022; paper: Preliminary Written Test & Final Written Test (General Studies); stage: PWT and FWT; language: English and Telugu.
- Type: official question paper; origin classification: official TSLPRB examinations; verification: verified question items and official final answer keys reconciled.
- Verification: verified; key: verified; OCR: reviewed; extraction: extracted.
- Notes: Authentic questions on Telangana cultural festivals (Bonalu, Bathukamma, Sammakka-Sarakka), state symbols, peasant resistance martyrs, and mass agitation milestones.
- Last verified: 2026-10-27.

## SR-TGPSC-GROUP1-GROUP4-2022-2024

- Exam: TGPSC Group-1 and Group-4; conducting body: Telangana Public Service Commission (TGPSC); state: Telangana; years: 2022, 2023, 2024; paper: General Studies and Telangana Movement; stage: Preliminary & Mains; language: English and Telugu.
- Type: official question paper; origin classification: official TGPSC examinations; verification: verified question items and official final answer keys reconciled.
- Verification: verified; key: verified; OCR: reviewed; extraction: extracted.
- Notes: Authentic questions on Telangana history, leadership (Kaloji, Dasarathi, Madan Mohan), monuments (Gun Park), Commissions (Girglani, Srikrishna), and political party origins (TRS at Jala Drushyam).
- Last verified: 2026-10-27.

## Next audit

Authenticate one target paper and final official key, retaining the official retrieval chain. Register additional source metadata in the database before importing content. Reconcile page/question totals and duplicates; do not substitute the current ten generated items for paper extraction.
