# Generated-question policy

Every authored item is training. It remains generated even if its facts come from an official report. “PYQ-style” describes a supported model, not evidence of an exam occurrence. Initial content is ten authored questions; no runtime AI provider is connected.

## Required draft input

Reviewed fact IDs with exact passages; allowed ontology IDs; permitted model; difficulty target; learner weakness stated as evidence; confusion relationships; relevant existing questions and forbidden exact/near duplicates. Missing fact evidence means return `needs_review` with missing inputs, not a speculative draft.

## Required draft output

Stem, four options, canonical answer, simple-English explanation, model ID, concept IDs, trap, question clue, each distractor's intended misconception/attraction/error, fact references, generation/prompt version, similarity warnings and review state. A teacher lesson must explain the selected wrong concept and the correct concept, then a concrete conditional contrast. Do not claim the learner's exact thought process.

## Validation gates

1. Fact and correct-answer evidence supports the entire claim and its qualifiers.
2. Exactly one unambiguous answer; each distractor is wrong for the stated question.
3. No unsupported “first”, “only”, date or causal shortcut.
4. Legitimate ontology/model mapping and SI/Constable relevance.
5. Realistic distractor relationships; no random irrelevant options.
6. Exact fingerprint/reordered-option deduplication; near-duplicate review.
7. Simple Indian English, precise observation cue and correct if/then contrast for every option.
8. Distribution review across model, difficulty, answer position, template and concept.
9. Separate validator result followed by an explicit publication actor and reason.

A deterministic structural pass is not a human factual review. Import unknown drafts into a review queue; do not publish simply because fields are present. Current legacy seed questions were source-backed authoring, not independently signed editorial review. Preserve that distinction in the database and visible source notes.

Record generation prompt name/version, model identifier when used, timestamp, evaluation result, reviewer and publication action. Preserve content versions on corrections, including explanation-only changes; attempts pin the version used for scoring. Publication rejects unverifiable source claims and must not rewrite historical attempts.

Future generation should expand reasoning variety, not create many noun-swapped copies. A10,000-row scale fixture is synthetic test data and never contributes to learner-facing content counts.
