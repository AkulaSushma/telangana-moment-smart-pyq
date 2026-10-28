# Adaptive engine specification

The engine is deterministic and inspectable. Thresholds are coaching heuristics, not validated psychometric cut-offs. Use `lib/engine.ts` for actual current rules; preserve its version when replaying historical decisions.

## Baseline implemented rules

The initial engine retains attempt confidence, hint use, active response time, first-selection proxy, changes and selected distractor. Two mapped concept errors recommend comparison. A wrong answer prioritizes an unused matching-model or recognition item in the remaining session and schedules retrieval after15minutes. Independent correct answers generally schedule one day; successful due recalls double the interval up to14days.

Improvement needs at least six independent recent responses, at least75% accuracy, the last three correct, at least three represented models and a correct changed-wording item. Then immediate repetition reduces. Stable mastery also needs successful independent recall on two separate dates with at least one day spacing. Immediate retests do not establish retention.

The current implementation is one concept family. The legacy fixed queue is replaced by up to50database candidates ordered by answered exposure/recency, followed by stage and model-error ranking into at most9questions. The single recall item remains a limitation. Rule version1.1.0 preserves previous coaching thresholds. A renamed recommendation alone does not prove a different learning path.

## Selection contract

Retrieve a bounded candidate set from published database content. Filter by target exam, available verified evidence, topic/model and publication state. Score using configurable learner need, retention due, model coverage, source quality and novelty; penalize recent exact exposure, same similarity group and overused model. Keep score components and rule version for “Why this?” explanations. Do not pretend a multiplicative formula is a calibrated probability.

Prefer an unseen reviewed variant testing the same concept. Exact repeats are permitted for due recall or when no suitable reviewed alternative exists; disclose insufficient breadth in coverage records. Never invent a new question at answer time merely to avoid repetition. A fixed-size bounded query alone does not prove fair coverage across a large database; candidate sampling/pagination must avoid permanent bias toward first IDs.

Keep exposure (`question_viewed`) separate from answered evidence. Record last-seen, count, last answer, confidence and latency history, model, difficulty and similarity group. Durable exposure projections and long-history aggregates are required before thousands of learner sessions are claimed supported.

## Required learner simulations

| Learner | Evidence | Distinct intended intervention | Acceptance |
| --- | --- | --- | --- |
| A | Recall strong; chronology repeatedly wrong | Date anchors, sequence reconstruction, unseen chronology variant | Chronology share increases without replaying only one sequence. |
| B | Repeated directional Mulki/formula swaps | Side-by-side provision contrast and changed-clue check | Explain observed selections; choose contrast-bearing variants. |
| C | High confidence on wrong answers | Evidence check, contrast, confidence recalibration | Different rationale/content from ordinary low-confidence practice. |
| D | Accurate but slow | Preserve accuracy; short recognition practice | No automatic knowledge-gap diagnosis from latency alone. |
| E | Initial independent improvement, then spaced failure | Reopen repair and shorten interval | Failed due recall changes next action and spacing. |
| F | Inconsistent low-evidence/guess-like pattern | Foundation and independent checks | Describe uncertainty; do not claim cheating or random guessing as fact. |

These are release tests, not six paths claimed complete by this document. See VALIDATION_REPORT for executed evidence. The current small corpus cannot establish sustained differences across100sessions.

## Human control and transparency

Recommendations should show observed counts, applicable rule and uncertainty. Learners must be able to skip, choose another available topic, enter an authenticated paper mode when one exists, and disable a recommendation. Unavailable corpus coverage must stay visibly unavailable. Do not lock the learner into a comparison loop after improvement.
