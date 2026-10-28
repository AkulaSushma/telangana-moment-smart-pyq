# Source quality and publication policy

Source authority, file identity, extraction quality, answer correctness and question provenance are separate claims. A SHA256 match proves file identity, not authority or historical truth.

## Trust hierarchy

| Tier | Source | Required checks |
| --- | --- | --- |
| 1 | Original government/recruitment publication | Official origin; document identity, year, stage and language; retained locator. |
| 2 | Official final key, correction or official archive | Paper/set mapping; final versus provisional status; corrections and withdrawn items. |
| 3 | Institutional archive of an identifiable original | Original cover/numbering; archive chain; compare to an official copy when available. |
| 4 | Reliable paper repository | Preserve repository provenance; independently authenticate the reproduced document. |
| 5 | Memory/coaching reconstruction | Always labelled memory-based; cannot become an official original by repetition. |

Tier numbers follow the user specification. A later official correction overrides an earlier key irrespective of tier numbering.

## Question statuses

`VERIFIED_PYQ`: exact original paper text/options and provenance authenticated; answer verified against the final official key and corrections before scored publication.

`VERIFIED_TEXT_NO_OFFICIAL_KEY`: original text authenticated, final official answer unavailable. Keep separate from officially keyed practice; if editorial scoring is added, display that limitation and record its evidence.

`PARTIALLY_VERIFIED`: a required provenance or extraction check remains unresolved.

`MEMORY_BASED`: a reconstruction, never silently promoted to an original paper.

`GENERATED_PRACTICE`, `GENERATED_PYQ_STYLE`, `EXPECTED_QUESTION`: authored training; retain concept/model/fact references and generation version. The current ten items display “GENERATED PRACTICE QUESTION”, which maps to `GENERATED_PRACTICE`.

## Ingestion and review gates

Register before download; hash bytes; associate matching hashes; extract in page-sized units; retain raw text; parse stem/options/question number; find and map the final key; map ontology/models/traps; verify each item; deduplicate; then publish eligible versions. Record every failure with source ID, stage and retry/review action. Resuming a job must not duplicate already committed items.

An exact fingerprint normalizes text, sorts normalized options and expresses the answer by option text, so shuffled options do not create a new question. Near matches, OCR variations and translations require review rather than automatic deletion or merging. A canonical question can have several source relationships without inflating frequency counts.

Retain both physical PDF page and printed page. Do not silently repair uncertain OCR in an original quotation; store the original and proposed correction with evidence. Missing answer, ambiguous options, disputed dates, weak distractors or absent fact evidence send the item to review.

## Current exclusions

Do not score the parent manuscript's disputed President's Rule or High Court dates. Do not collapse proposal, enactment, commencement and implementation into one date. The historical fifteen-year Mulki residence route has additional conditions and does not describe every qualifying category. The 1959 employment rules are not interchangeable with the earlier Mulki regulations.

No source collection is considered complete. Authentication of current SI and Constable notifications and original paper/final-key pairs remains a priority.
