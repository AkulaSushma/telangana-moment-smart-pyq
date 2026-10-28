import type { Question } from "./content";
import type { TeachingLesson } from "./teaching";

export type StudyQuestion = Question & {
  version: number;
  lessons: TeachingLesson[];
};
