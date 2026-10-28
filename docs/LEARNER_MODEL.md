# Learner model

Current identity is a local HTTP-only cookie mapped to a SQLite profile. This is not account authentication or cross-device sync. SI/Constable target preference, bookmarks, revision items, session and learning records persist locally. Labelled demo attempts are kept distinct from real attempts.

## Evidence stored

Attempt ID, question ID, canonical selected option, server-derived correctness, confidence(35/60/85), active-page response seconds, first-selection seconds, answer changes, hint flag, timestamp, session ID and demo flag. Content-version pinning is a required corpus integration change; record the exact migration and its tests in PROJECT_STATE. Legacy rows lacking a version must be assigned the original seed version rather than rescored from a new answer key.

The browser measures active-page timing. It is a study aid, not tamper-resistant proctoring. First selection approximates recognition latency but does not measure thought. Backgrounding pauses timing and never establishes fatigue or poor concentration.

## Derived evidence

- Overall, first-attempt, retry, recent, hinted and hint-independent accuracy.
- Per-model attempts, accuracy and response time; unseen models remain unassessed.
- Mean/median time and confidence error; high-confidence mistakes as observed events.
- Mapped distractor confusion evidence and delayed-recall accuracy.
- Improvement, recall-ready and stable states with explicit rule thresholds.

No single percentage is presented as scientifically established mastery. A sample-size badge and distinct-question count should accompany future fine-grained mastery estimates. A correct repeated item is weaker evidence than a correct unseen variant; correctness after a hint does not establish independent recall.

## Missing longitudinal projections

Per-topic/subtopic/microconcept durable state, directional confusion edges, full exposure history, source familiarity, revision forgetting curves, calibrated speed-accuracy trade-off and fatigue hypotheses are future work. The aggregate profile still carries growing attempt history; normalized tables alone do not prove bounded one-year retrieval. Add paginated history and computed summaries before making that scale claim.

Corrections should preserve what was shown/scored, flag affected attempts and explain any recomputation. Deletion, export, backup/recovery, authenticated ownership and retention policies are production gates. The existing JSON export is a local profile export, not a complete privacy or account-management system.
