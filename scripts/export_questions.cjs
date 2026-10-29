const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const db = new DatabaseSync("data/learning.sqlite");
const rows = db.prepare("SELECT id, content FROM questions ORDER BY id").all();

console.log(`Exporting ${rows.length} questions from database...`);
const questions = rows.map((r) => JSON.parse(r.content));

const fileContent = `import type { Question } from "./content";

export const allQuestions: Question[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync(path.join("lib", "all-questions.ts"), fileContent, "utf8");
const size = (fs.statSync(path.join("lib", "all-questions.ts")).size / 1024).toFixed(1);
console.log(`Successfully written lib/all-questions.ts (${size} KB)!`);
