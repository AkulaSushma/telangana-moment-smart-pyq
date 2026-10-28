# Confusion graph

Version1. An edge describes a plausible instructional contrast; observed learner evidence is stored separately. Do not turn an editorial distractor into a certain diagnosis.

| Edge | Direction | Distinguishing clue | Current evidence |
| --- | --- | --- | --- |
| CP-MULKI-SPF-01 | Six-Point Formula asked → Mulki selected | University proposal, tribunal, local cadres with development, or replacement of old rules → formula. | Explicit distractor mappings on Q001, Q002, Q004, Q008, Q009 and comparison recall. |
| CP-MULKI-SPF-02 | Mulki asked → formula selected | Historical15-year residence qualifying route → Mulki. | Q003 distractor mapping. |
| CP-AGREEMENT-SPF-01 | Formula provision →1956 agreement selected | A broad education theme is insufficient; the particular Central University proposal is point2 of the later formula. | Editorial contrast in Q002/Q008; no established learner diagnosis. |
| CP-PROPOSAL-SOURCE-01 | Historical rule → report describing it selected | Separate the original rule from a later report explaining it. | Q003 source-versus-origin distractor. |

Legacy `Option.confusion` stores a boolean. That supports an initial paired-concept count, not a fully directional graph. Production graph records should carry `from_concept`, `selected_concept`, `question_version`, `option_id`, `evidence_count`, `distinct_questions`, confidence and observation dates. Repeated errors on one unchanged item are weaker than cross-question evidence.

## Teaching a single error

Say “This option may have looked correct because both are about local opportunities.” Do not say “You did not observe properly” or “You are confused” as fact. Point to the actual clue, explain both concepts, then ask a changed-wording check. Confidence affects coaching priority, not historical correctness.

The current threshold of two mapped wrong selections is an auditable heuristic. Cross-question, directional and longitudinal thresholds need calibration before broad claims. A correct answer after a hint or immediate repetition is not enough to mark a confusion resolved. Resolution requires varied independent answers and delayed retrieval.
