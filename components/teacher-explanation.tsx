import { BookOpen, CheckCircle2, Lightbulb } from "lucide-react";
import type { Question } from "@/lib/content";
import type { TeachingLesson } from "@/lib/teaching";

export function TeacherExplanation({
  question,
  selected,
  lesson,
}: {
  question: Question;
  selected: number;
  lesson: TeachingLesson;
}) {
  const correct = selected === question.answer;
  return (
    <section className="teacher-explanation" aria-label="Your teacher explains">
      <div className="teacher-heading">
        <BookOpen size={22} />
        <div>
          <span>Your teacher explains</span>
          <h3>
            {correct
              ? "Keep this distinction clear."
              : "Let us see where the answer changed."}
          </h3>
        </div>
      </div>
      <div className="teacher-observation">
        <Lightbulb size={20} />
        <div>
          <h4>First, notice the question words</h4>
          <p>{lesson.observation}</p>
        </div>
      </div>
      <div className="teacher-contrast">
        {!correct && (
          <div className="teacher-choice">
            <span>You chose</span>
            <h4>{question.options[selected].text}</h4>
            <p>{lesson.selectedMeaning}</p>
          </div>
        )}
        <div className="teacher-correct">
          <span>
            <CheckCircle2 size={15} /> Correct answer
          </span>
          <h4>{question.options[question.answer].text}</h4>
          <p>{lesson.correctMeaning}</p>
        </div>
      </div>
      {!correct && (
        <div className="teacher-confusion">
          <h4>Why this can be confusing</h4>
          <p>{lesson.possibleConfusion}</p>
          <small>
            This is a possible reason. One answer cannot tell us exactly what
            you were thinking.
          </small>
        </div>
      )}
      <div className="teacher-rules">
        <h4>How to choose next time</h4>
        <p>Read the full question first. Then match the specific point.</p>
        <dl>
          {lesson.decisionRules.map((rule, index) => (
            <div key={index}>
              <dt>
                <span>If the question asks</span>
                {rule.when}
              </dt>
              <dd>
                <span>Choose</span>
                <strong>{rule.choose}</strong>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="teacher-next">
        <b>Before you move on:</b> {lesson.nextStep}
      </p>
    </section>
  );
}
