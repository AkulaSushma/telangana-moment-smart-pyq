# Question model catalog

Version1 · current models are authored teaching models, not frequencies discovered from authenticated PYQs. IDs match the initial implementation and must remain stable.

| ID | Model | Initial items | Reasoning skill |
| --- | --- | --- | --- |
| TM-QM-REC-01 | Recognition | Q001, Q002, Q003 | Identify a framework from the exact provision or qualification. |
| TM-QM-PROV-01 | Provision identification | Q004, Q008 | Match an institution or a bundle of clues to its framework. |
| TM-QM-CHRON-01 | Chronology | Q005 | Anchor events to1956,1973,2014, then order them. |
| TM-QM-STMT-01 | Statements | Q006, Q010 | Judge each claim separately; reject reversed or exaggerated relationships. |
| TM-QM-NEG-01 | Negative wording | Q007 | Read NOT and choose the unsupported provision. |
| TM-QM-REWORD-01 | Changed wording | Q009 | Recognise the relationship when familiar phrasing changes. |

Initial counts: recognition3, provision2, chronology1, statements2, negative1, changed wording1. All IDs above have the `TM-` question prefix, e.g. Q002 means TM-Q002.

## Expansion contract

New model records need ID, name, definition, source examples, required facts, distractor rules, ambiguity checks and observed versus proposed status. Priorities after verified ingestion include year-event, person-event, committee-recommendation, immediate trigger versus cause, cause versus outcome, match, before/after, movement phase and similar-name/year confusion.

Do not force every concept into every model. Assertion questions require a source-supported logical relationship; chronology needs independent dated anchors; “first” and “only” need complete enough evidence to support exclusivity. Use genuine source occurrences to decide whether a model is relevant to SI/Constable, not an invented popularity score.

Monitor answer positions, template phrases, model/difficulty/concept distribution and similarity groups separately. Option rotation in the UI reduces displayed-letter bias; it does not improve conceptual diversity.
