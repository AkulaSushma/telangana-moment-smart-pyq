import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  corpusSummary,
  importCorpus,
  initializeCorpus,
  listCorpusSources,
  publishCorpusQuestion,
  type PublicationReview,
} from "../lib/corpus";

const usage = `Corpus maintenance (local operator tool)
  npx tsx scripts/corpus.ts summary
  npx tsx scripts/corpus.ts sources
  npx tsx scripts/corpus.ts import <file.json>
  npx tsx scripts/corpus.ts publish <question-id> <version> <human-review.json>

The import JSON contains actor, reason, sources and questions:[{question,sourceIds}].
It only stages content. No import automatically publishes a question.
The review JSON contains actor, reason, reviewerKind:"human", and checks:
fact, answer, distractors, source, model, duplicate, language, ambiguity (all true).
PYQ_DATA_DIR overrides the local data directory. Never use synthetic fixtures as real corpus.
`;

function readJson(path: string) {
  const resolved = resolve(path);
  if (statSync(resolved).size > 30 * 1024 * 1024)
    throw new Error("JSON file exceeds the 30 MB operator import limit");
  return JSON.parse(readFileSync(resolved, "utf8").replace(/^\uFEFF/, ""));
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help") {
    console.log(usage);
    return;
  }
  if (!["summary", "sources", "import", "publish"].includes(command))
    throw new Error(usage);
  const dir = process.env.PYQ_DATA_DIR || join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(join(dir, "learning.sqlite"));
  try {
    db.exec(
      "PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;",
    );
    initializeCorpus(db);
    if (command === "summary")
      console.log(JSON.stringify(corpusSummary(db), null, 2));
    if (command === "sources")
      console.log(JSON.stringify(listCorpusSources(db), null, 2));
    if (command === "import") {
      if (args.length !== 1) throw new Error("Specify one import JSON file");
      const results = importCorpus(db, readJson(args[0]));
      console.log(
        JSON.stringify({ publication: "pending_review", results }, null, 2),
      );
    }
    if (command === "publish") {
      if (args.length !== 3)
        throw new Error(
          "Specify question ID, integer version, and human review JSON file",
        );
      console.log(
        JSON.stringify(
          publishCorpusQuestion(
            db,
            args[0],
            Number(args[1]),
            readJson(args[2]) as PublicationReview,
          ),
          null,
          2,
        ),
      );
    }
  } finally {
    db.close();
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
