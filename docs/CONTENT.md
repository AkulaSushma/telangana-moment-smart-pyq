# Content provenance and editorial decisions

All scored items have status `GENERATED PRACTICE QUESTION`. They have no exam year, exam question number, official key status or false PYQ attribution. The app's question IDs are internal IDs.

## Reviewed evidence

| Item                                                      | Source                                                               | Locator                                                        |
| --------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------- |
| Six-Point Formula provisions and replacement relationship | Ministry of Home Affairs, Srikrishna Committee report, December 2010 | Chapter 1 §1.2.27, printed page 37, local PDF page 77          |
| Mulki residence route and other qualifying categories     | Same report                                                          | Chapter 5 §5.2.01–5.2.03, printed page 246, local PDF page 289 |
| Three movement syllabus phases                            | Official SI notification, 25 April 2022                              | PDF pages 33 and 35                                            |
| State formation on 2 June 2014                            | Telangana government, Legislative Affairs department profile         | State formation paragraph                                      |

Primary links:

- https://www.mha.gov.in/sites/default/files/CCSAP-REPORT-060111.pdf
- https://tslprbpartone.s3.ap-south-1.amazonaws.com/SI%28Civil%292022_Notification_25-4-2022.pdf
- https://www.telangana.gov.in/departments/legislative-affairs/

The MHA PDF exceeded the browsing fetch size. Its corresponding local corpus (`../rebuild/corpus/Srikrishna_2010.txt`) and source PDF were already present and were inspected directly. The local corpus preserves page boundaries, allowing exact local PDF page citations. The official syllabus PDF was accessed online. State formation was corroborated in the official government search result. The local 2026 notification extract in `../.firecrawl/tgprb-si-2026-notification.md` contains the same three phases but does not by itself provide an independently checked retrieval chain; the UI keeps the explicit 2022 baseline rather than claiming current notification verification.

## Exclusions and caveats

- The fifteen-year residence route is not taught as the exhaustive definition of Mulki status. Chapter 5 records additional qualifications and conditions.
- The 1959 Public Employment rules must not be silently conflated with the historical Mulki regulations. The more precise chapter 5 citation is used for the Mulki question.
- The source manuscript flags disagreements about President's Rule and High Court dates. These are not scored.
- The date of proposing a framework is not treated as the date every legal instrument took effect. Questions avoid that shortcut.
- The SI 2016 PDF is available for inspection only. Its final key has not been authenticated in this build; no answer is claimed to be officially keyed.
- Other exams do not appear in learner navigation. No cross-exam question is passed off as a police PYQ.
- No fabricated recurrence rate, expected-question probability, current-affairs connection or syllabus completion metric is shown.

## Release gates

Before corpus publication: retain source document hash; compare question text and numbering to the paper; authenticate final key and corrections; add exam stage/language; assign topic, microconcept, model, traps, per-option misconceptions and prerequisite edges; obtain editorial review. Fact-backed generated practice and exact authenticated PYQs remain separate categories.
