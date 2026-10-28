import { execSync } from "node:child_process";

const batches = [
  "scripts/build_batch_1.ts",
  "scripts/build_batch_2.ts",
  "scripts/build_batch_3.ts",
  "scripts/build_batch_4.ts",
  "scripts/build_batch_5.ts",
  "scripts/build_batch_6.ts",
  "scripts/build_batch_7.ts",
  "scripts/build_batch_8.ts",
  "scripts/build_batch_9.ts",
];

console.log("Seeding all batches (1 to 9) to build full 150-question corpus...");
for (const batch of batches) {
  console.log(`Running ${batch}...`);
  execSync(`npx tsx ${batch}`, { stdio: "inherit" });
}
console.log("All batches seeded successfully! 150 questions published.");
