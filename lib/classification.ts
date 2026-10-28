import type { Attempt } from "./engine";
import type { Question } from "./content";

export function classify(a: Attempt, q?: Question) {
  if (a.correct)
    return a.hint
      ? "Correct with a hint"
      : a.seconds > 60
        ? "Correct, took more time"
        : "Correct without a hint";
  if (a.confidence >= 80) return "Confident, but incorrect";
  if (q?.options[a.selected]?.confusion) return "Possible concept confusion";
  if (q?.model === "Chronology") return "Dates or order need practice";
  if (q?.model === "Negative wording") return "Check the word NOT";
  return "Review the question and the answer";
}
