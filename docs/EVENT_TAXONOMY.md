# Learning event taxonomy

Version1. Events are observations; diagnosis is a separate derived record. Each stored event has a unique ID, profile ID, type, timestamp and optional question ID/value. Future events should also include session ID, question version and engine version when applicable.

| Event | Producer / meaning |
| --- | --- |
| session_started / session_ended | Server lifecycle transition. |
| question_viewed | Browser displayed a question; exposure, not answered evidence. |
| answer_selected / answer_changed | First choice or subsequent choice; canonical option index. |
| confidence_selected | Learner chose a confidence level. |
| hint_requested | Hint displayed; answer cannot count as independent recall. |
| answer_submitted | Server accepted/scored attempt; idempotent request ID prevents duplicate attempts. |
| explanation_opened / explanation_section_opened | Learner opened extra teaching detail. Essential immediate correction need not be opened. |
| comparison_opened | Comparison viewed; not proof of understanding. |
| bookmark_changed | Bookmark state changed. |
| topic_opened | Topic selected/viewed; not proof of topic practice. |
| mentor_recommendation_opened | Recommendation interaction; legacy engine also logs this on repair suggestion creation, so it must not be used as a reliable click metric until corrected. |
| app_backgrounded / app_returned | Page visibility transition, used for active timing. |
| question_skipped | Accepted event type; verify actual skip/session behavior separately. |

Some accepted events are not emitted by every current UI path. Do not claim complete behavioral telemetry merely because an API allows an event name. Reserved events include revision_started/completed, paper session lifecycle, recommendation_dismissed/completed and topic_abandoned; add only with clear semantics and tests.

The aggregate profile keeps the latest1,000events; normalized SQLite records persist separately. No camera, microphone, cross-site behavior or freeform keystrokes are collected. Client events can be missing or forged and must not determine the authoritative answer key. Abandonment and fatigue require cautious inference and minimum evidence, never a single visibility event.

Production requirements: schema validation by event type; timestamps and event IDs for deduplication; server receipt time; session/version references; retention and export/deletion behavior; append-only audit records for content and policy changes. Avoid sensitive free-text event values.
