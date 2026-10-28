import type { Question } from "./content";
import { getTeaching } from "./teaching";
import type { StudyQuestion } from "./contracts";

export function studyQuestion(
  q: Question & { version: number },
): StudyQuestion {
  const { teaching, ...question } = q;
  return {
    ...question,
    lessons: teaching || q.options.map((_, i) => getTeaching(q, i)),
  };
}
