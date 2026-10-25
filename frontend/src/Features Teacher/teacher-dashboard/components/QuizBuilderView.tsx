import { useState } from "react";
import { ChevronRightIcon } from "./Icons";
import type {
  Course,
  Lesson,
  QuizData,
  QuizOption,
  QuizQuestion,
  QuizQuestionType,
} from "../types/course";

interface QuizBuilderViewProps {
  course: Course;
  lesson: Lesson;
  quizData: QuizData;
  onChange: (data: QuizData) => void;
  onBack: () => void;
  onGoToCourses: () => void;
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const makeOption = (): QuizOption => ({
  id: makeId(),
  text: "",
});

export function QuizBuilderView({
  course,
  lesson,
  quizData,
  onChange,
  onBack,
  onGoToCourses,
}: QuizBuilderViewProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    quizData.questions[0]?.id ?? null,
  );
  const [error, setError] = useState("");

  const questions = quizData.questions;

  const selectedQuestion =
    questions.find((question) => question.id === selectedQuestionId) ??
    questions[0];

  const questionNumber = selectedQuestion
    ? questions.findIndex((question) => question.id === selectedQuestion.id) + 1
    : 0;

  const changeQuestion = (updatedQuestion: QuizQuestion) => {
    onChange({
      ...quizData,
      questions: questions.map((question) =>
        question.id === updatedQuestion.id ? updatedQuestion : question,
      ),
    });
  };

  const addQuestion = () => {
    const question: QuizQuestion = {
      id: makeId(),
      prompt: "",
      type: "single",
      options: [makeOption(), makeOption(), makeOption(), makeOption()],
      correctOptionIds: [],
      saved: false,
    };

    onChange({
      ...quizData,
      questions: [...questions, question],
    });

    setSelectedQuestionId(question.id);
    setError("");
  };

  const updatePrompt = (prompt: string) => {
    if (!selectedQuestion) return;

    changeQuestion({
      ...selectedQuestion,
      prompt,
      saved: false,
    });
  };

  const updateOptionText = (optionId: string, text: string) => {
    if (!selectedQuestion) return;

    changeQuestion({
      ...selectedQuestion,
      saved: false,
      options: selectedQuestion.options.map((option) =>
        option.id === optionId ? { ...option, text } : option,
      ),
    });
  };

  const changeQuestionType = (type: QuizQuestionType) => {
    if (!selectedQuestion) return;

    changeQuestion({
      ...selectedQuestion,
      type,
      saved: false,
      correctOptionIds:
        type === "single"
          ? selectedQuestion.correctOptionIds.slice(0, 1)
          : selectedQuestion.correctOptionIds,
    });
  };

  const toggleCorrectAnswer = (optionId: string) => {
    if (!selectedQuestion) return;

    const currentlySelected =
      selectedQuestion.correctOptionIds.includes(optionId);

    let correctOptionIds: string[];

    if (selectedQuestion.type === "single") {
      correctOptionIds = currentlySelected ? [] : [optionId];
    } else {
      correctOptionIds = currentlySelected
        ? selectedQuestion.correctOptionIds.filter((id) => id !== optionId)
        : [...selectedQuestion.correctOptionIds, optionId];
    }

    changeQuestion({
      ...selectedQuestion,
      correctOptionIds,
      saved: false,
    });
  };

  const saveQuestion = () => {
    if (!selectedQuestion) return;

    const filledOptions = selectedQuestion.options.filter((option) =>
      option.text.trim(),
    );

    const validCorrectOptions = selectedQuestion.correctOptionIds.filter((id) =>
      filledOptions.some((option) => option.id === id),
    );

    if (!selectedQuestion.prompt.trim()) {
      setError("Please enter the question.");
      return;
    }

    if (filledOptions.length < 2) {
      setError("Enter at least two answer options.");
      return;
    }

    if (validCorrectOptions.length === 0) {
      setError("Choose at least one correct answer.");
      return;
    }

    if (
      selectedQuestion.type === "single" &&
      validCorrectOptions.length !== 1
    ) {
      setError("A single-answer question needs exactly one correct answer.");
      return;
    }

    changeQuestion({
      ...selectedQuestion,
      options: selectedQuestion.options,
      correctOptionIds: validCorrectOptions,
      saved: true,
    });

    setError("");
  };

  const editQuestion = () => {
    if (!selectedQuestion) return;

    changeQuestion({
      ...selectedQuestion,
      saved: false,
    });

    setError("");
  };

  const removeQuestion = () => {
    if (!selectedQuestion) return;

    const currentIndex = questions.findIndex(
      (question) => question.id === selectedQuestion.id,
    );

    const remaining = questions.filter(
      (question) => question.id !== selectedQuestion.id,
    );

    onChange({
      ...quizData,
      questions: remaining,
    });

    setSelectedQuestionId(
      remaining[Math.min(currentIndex, remaining.length - 1)]?.id ?? null,
    );
    setError("");
  };

  const isEditing = selectedQuestion ? !selectedQuestion.saved : false;

  const addAnswerOption = () => {
    if (!selectedQuestion || selectedQuestion.options.length >= 8) return;

    changeQuestion({
      ...selectedQuestion,
      options: [...selectedQuestion.options, makeOption()],
      saved: false,
    });
  };

  return (
    <main className="td-main td-main--course td-quiz-page">
      <nav className="td-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="td-breadcrumb__link"
          onClick={onGoToCourses}
        >
          My Courses
        </button>
        <ChevronRightIcon size={14} className="td-breadcrumb__sep" />
        <button type="button" className="td-breadcrumb__link" onClick={onBack}>
          {course.title}
        </button>
        <ChevronRightIcon size={14} className="td-breadcrumb__sep" />
        <span className="td-breadcrumb__current">{lesson.title}</span>
      </nav>

      <div className="td-quiz-top">
        <section className="td-quiz-title-card">
          <span className="td-lesson-detail__type">Quiz builder</span>
          <h1 className="td-h1">{lesson.title}</h1>
          <p className="td-subtitle">{course.title}</p>

          <label className="td-quiz-duration">
            <span>Time duration</span>
            <div>
              <input
                type="number"
                min={1}
                max={600}
                value={quizData.durationMinutes}
                onChange={(event) =>
                  onChange({
                    ...quizData,
                    durationMinutes: Math.max(
                      1,
                      Number(event.target.value) || 1,
                    ),
                  })
                }
                aria-label="Quiz duration in minutes"
              />
              <span>minutes</span>
            </div>
          </label>

          <div className="td-quiz-time-window">
            <span>
              Opens:{" "}
              {lesson.openAt
                ? new Date(lesson.openAt).toLocaleString()
                : "Not set"}
            </span>
            <span>
              Closes:{" "}
              {lesson.closeAt
                ? new Date(lesson.closeAt).toLocaleString()
                : "Not set"}
            </span>
          </div>
        </section>

        <section className="td-card td-quiz-question-nav">
          <div className="td-quiz-question-nav__heading">
            <div>
              <h2 className="td-h3">Questions</h2>
              <p className="td-subtitle">Total: {questions.length}</p>
            </div>
          </div>

          <div className="td-quiz-question-nav__grid">
            {questions.map((question, index) => (
              <button
                key={question.id}
                type="button"
                className={[
                  "td-quiz-number",
                  selectedQuestion?.id === question.id
                    ? "td-quiz-number--active"
                    : "",
                  question.saved ? "td-quiz-number--saved" : "",
                ].join(" ")}
                onClick={() => {
                  setSelectedQuestionId(question.id);
                  setError("");
                }}
                aria-label={`Open question ${index + 1}`}
                aria-pressed={selectedQuestion?.id === question.id}
              >
                {index + 1}
              </button>
            ))}

            <button
              type="button"
              className="td-quiz-number td-quiz-number--add"
              onClick={addQuestion}
              aria-label="Add question"
              title="Add question"
            >
              +
            </button>
          </div>
        </section>
      </div>

      <section className="td-card td-quiz-editor">
        {!selectedQuestion ? (
          <div className="td-quiz-empty">
            <h2 className="td-h3">Start building your quiz</h2>
            <p className="td-subtitle">
              Add a question, enter its answer options, and mark the correct
              answer.
            </p>
            <button
              type="button"
              className="td-btn td-btn--primary"
              onClick={addQuestion}
            >
              + Add your first question
            </button>
          </div>
        ) : (
          <>
            <div className="td-quiz-editor__heading">
              <div>
                <span className="td-quiz-editor__number">
                  Question {questionNumber}
                </span>
                <h2 className="td-h3">
                  {isEditing ? "Edit question" : "Question preview"}
                </h2>
              </div>
            </div>

            {isEditing ? (
              <>
                <label className="td-quiz-field">
                  Question text
                  <textarea
                    className="td-lesson-form__input"
                    rows={3}
                    value={selectedQuestion.prompt}
                    placeholder="Type your question here..."
                    onChange={(event) => updatePrompt(event.target.value)}
                  />
                </label>

                <fieldset className="td-quiz-type">
                  <legend>Answer type</legend>

                  <label>
                    <input
                      type="radio"
                      name={`type-${selectedQuestion.id}`}
                      checked={selectedQuestion.type === "single"}
                      onChange={() => changeQuestionType("single")}
                    />
                    Single answer
                    <span>Choose one correct answer</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`type-${selectedQuestion.id}`}
                      checked={selectedQuestion.type === "multiple"}
                      onChange={() => changeQuestionType("multiple")}
                    />
                    Multiple answers
                    <span>Choose every correct answer</span>
                  </label>
                </fieldset>

                <p className="td-quiz-instruction">
                  Select the correct answer(s). Selected correct options turn
                  green.
                </p>
              </>
            ) : (
              <h3 className="td-quiz-preview-prompt">
                {selectedQuestion.prompt}
              </h3>
            )}

            <div className="td-quiz-options">
              {selectedQuestion.options
                .filter((option) => isEditing || option.text.trim())
                .map((option, index) => {
                  const isCorrect = selectedQuestion.correctOptionIds.includes(
                    option.id,
                  );
                  const isEmpty = !option.text.trim();

                  return (
                    <label
                      key={option.id}
                      className={[
                        "td-quiz-option",
                        isCorrect ? "td-quiz-option--correct" : "",
                        isEditing ? "td-quiz-option--editable" : "",
                      ].join(" ")}
                    >
                      <input
                        type={
                          selectedQuestion.type === "single"
                            ? "radio"
                            : "checkbox"
                        }
                        name={`answer-${selectedQuestion.id}`}
                        checked={isCorrect}
                        disabled={!isEditing}
                        onChange={() => toggleCorrectAnswer(option.id)}
                        aria-label={`Mark option ${index + 1} as correct`}
                      />

                      {isEditing ? (
                        <input
                          className="td-quiz-option__text-input"
                          value={option.text}
                          placeholder={`Option ${index + 1}`}
                          onChange={(event) =>
                            updateOptionText(option.id, event.target.value)
                          }
                        />
                      ) : (
                        <span className="td-quiz-option__text">
                          {option.text || (isEmpty ? "Empty option" : "")}
                        </span>
                      )}

                      {isCorrect && (
                        <span className="td-quiz-option__badge">
                          Correct answer
                        </span>
                      )}
                    </label>
                  );
                })}
            </div>

            {isEditing && selectedQuestion.options.length < 8 && (
              <button
                type="button"
                className="td-quiz-add-option"
                onClick={addAnswerOption}
              >
                + Add answer option
              </button>
            )}

            {error && <p className="td-lesson-form__error">{error}</p>}

            <div className="td-quiz-question-actions">
              <button
                type="button"
                className="td-btn td-btn--primary"
                onClick={saveQuestion}
                disabled={!isEditing}
              >
                Save
              </button>

              <button
                type="button"
                className="td-btn td-btn--outline"
                onClick={editQuestion}
                disabled={isEditing}
              >
                Edit
              </button>

              <button
                type="button"
                className="td-btn td-btn--danger"
                onClick={removeQuestion}
              >
                Remove
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
