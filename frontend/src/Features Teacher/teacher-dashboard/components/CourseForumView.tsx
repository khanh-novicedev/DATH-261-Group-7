import { useState } from "react";
import { ChevronRightIcon } from "./Icons";
import type { Course, ForumQuestion } from "../types/course";

interface CourseForumViewProps {
  course: Course;
  questions: ForumQuestion[];
  currentUser: string;
  onBack: () => void;
  onAddAnswer: (questionId: string, body: string) => void;
  onEditAnswer: (questionId: string, answerId: string, body: string) => void;
  onDeleteAnswer: (questionId: string, answerId: string) => void;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

export function CourseForumView({
  course,
  questions,
  currentUser,
  onBack,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
}: CourseForumViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [expandedThreads, setExpandedThreads] = useState<string[]>([]);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const selectedQuestion = questions.find((q) => q.id === selectedId);

  const toggleThread = (questionId: string) => {
    setExpandedThreads((previous) =>
      previous.includes(questionId)
        ? previous.filter((id) => id !== questionId)
        : [...previous, questionId],
    );
  };

  const submitAnswer = (questionId: string) => {
    if (!answerText.trim()) return;

    onAddAnswer(questionId, answerText.trim());
    setAnswerText("");
    setExpandedThreads((previous) =>
      previous.includes(questionId) ? previous : [...previous, questionId],
    );
  };

  const saveEdit = (questionId: string, answerId: string) => {
    if (!editingText.trim()) return;

    onEditAnswer(questionId, answerId, editingText.trim());
    setEditingAnswerId(null);
    setEditingText("");
  };

  return (
    <main className="td-main td-main--course td-forum-page">
      <nav className="td-breadcrumb" aria-label="Breadcrumb">
        <button type="button" className="td-breadcrumb__link" onClick={onBack}>
          My Courses
        </button>
        <ChevronRightIcon size={14} className="td-breadcrumb__sep" />
        <button type="button" className="td-breadcrumb__link" onClick={onBack}>
          {course.title}
        </button>
        <ChevronRightIcon size={14} className="td-breadcrumb__sep" />
        <span className="td-breadcrumb__current" aria-current="page">
          Forum
        </span>
        {selectedQuestion && (
          <>
            <ChevronRightIcon size={14} className="td-breadcrumb__sep" />
            <span className="td-breadcrumb__current">Question</span>
          </>
        )}
      </nav>

      <div className="td-forum-heading">
        <div>
          <h1 className="td-h1">
            {selectedQuestion ? "Question discussion" : `${course.title} forum`}
          </h1>
          <p className="td-subtitle">
            {selectedQuestion
              ? "Read the answers or share your own."
              : `${questions.length} question${questions.length === 1 ? "" : "s"} in this course`}
          </p>
        </div>

        {selectedQuestion && (
          <button
            type="button"
            className="td-btn td-btn--outline"
            onClick={() => {
              setSelectedId(null);
              setAnswerText("");
              setEditingAnswerId(null);
            }}
          >
            Back to questions
          </button>
        )}
      </div>

      {!selectedQuestion ? (
        <section className="td-card td-forum-list">
          {questions.length === 0 ? (
            <p className="td-empty">
              No questions yet. You can add a question when question creation is
              enabled.
            </p>
          ) : (
            questions.map((question) => {
              const answered = question.answers.length > 0;

              return (
                <button
                  type="button"
                  className="td-forum-question-row"
                  key={question.id}
                  onClick={() => setSelectedId(question.id)}
                >
                  <span
                    className={`td-forum-status ${
                      answered
                        ? "td-forum-status--answered"
                        : "td-forum-status--unanswered"
                    }`}
                    aria-label={answered ? "Answered" : "Unanswered"}
                  >
                    {answered ? "✓" : ""}
                  </span>

                  <span className="td-forum-question-info">
                    <span className="td-forum-question__title">
                      {question.title}
                    </span>
                    <span className="td-forum-meta">
                      By {question.author} · {formatDate(question.createdAt)}
                    </span>
                  </span>

                  <span
                    className={`td-forum-label ${
                      answered
                        ? "td-forum-label--answered"
                        : "td-forum-label--unanswered"
                    }`}
                  >
                    {answered ? "Answered" : "Unanswered"}
                  </span>

                  <ChevronRightIcon size={16} />
                </button>
              );
            })
          )}
        </section>
      ) : (
        <section className="td-card td-forum-discussion">
          <article className="td-forum-original-question">
            <h2 className="td-h3">{selectedQuestion.title}</h2>
            <p className="td-forum-meta">
              Asked by {selectedQuestion.author} ·{" "}
              {formatDate(selectedQuestion.createdAt)}
            </p>
          </article>

          <div className="td-forum-answers-heading">
            <h3 className="td-h3">
              {selectedQuestion.answers.length}{" "}
              {selectedQuestion.answers.length === 1 ? "answer" : "answers"}
            </h3>

            <button
              type="button"
              className="td-btn td-btn--outline"
              onClick={() => toggleThread(selectedQuestion.id)}
            >
              {expandedThreads.includes(selectedQuestion.id)
                ? "Collapse answers"
                : "Expand answers"}
            </button>
          </div>

          {expandedThreads.includes(selectedQuestion.id) && (
            <div className="td-forum-answer-list">
              {selectedQuestion.answers.map((answer) => {
                const isOwner = answer.author === currentUser;
                const isEditing = editingAnswerId === answer.id;

                return (
                  <article className="td-forum-answer" key={answer.id}>
                    <div className="td-forum-answer-avatar">
                      {answer.author.charAt(0).toUpperCase()}
                    </div>

                    <div className="td-forum-answer-content">
                      <p className="td-forum-answer-author">
                        {answer.author}
                        <span className="td-forum-meta">
                          {" "}
                          · {formatDate(answer.updatedAt ?? answer.createdAt)}
                          {answer.updatedAt ? " · edited" : ""}
                        </span>
                      </p>

                      {isEditing ? (
                        <div className="td-forum-editor">
                          <textarea
                            className="td-forum-textarea"
                            value={editingText}
                            onChange={(event) =>
                              setEditingText(event.target.value)
                            }
                            rows={3}
                            aria-label="Edit your answer"
                          />
                          <div className="td-forum-actions">
                            <button
                              type="button"
                              className="td-btn td-btn--primary"
                              onClick={() =>
                                saveEdit(selectedQuestion.id, answer.id)
                              }
                              disabled={!editingText.trim()}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="td-btn td-btn--outline"
                              onClick={() => {
                                setEditingAnswerId(null);
                                setEditingText("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="td-forum-answer-body">{answer.body}</p>
                      )}

                      {isOwner && !isEditing && (
                        <div className="td-forum-actions">
                          <button
                            type="button"
                            className="td-forum-text-action"
                            onClick={() => {
                              setEditingAnswerId(answer.id);
                              setEditingText(answer.body);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="td-forum-text-action td-forum-text-action--danger"
                            onClick={() => {
                              if (window.confirm("Delete this answer?")) {
                                onDeleteAnswer(selectedQuestion.id, answer.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}

              {selectedQuestion.answers.length === 0 && (
                <p className="td-empty">
                  No answers yet. Be the first to answer.
                </p>
              )}
            </div>
          )}

          <form
            className="td-forum-reply"
            onSubmit={(event) => {
              event.preventDefault();
              submitAnswer(selectedQuestion.id);
            }}
          >
            <label className="td-forum-reply-label" htmlFor="td-forum-reply">
              Your answer
            </label>
            <textarea
              id="td-forum-reply"
              className="td-forum-textarea"
              placeholder="Write a helpful answer..."
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              rows={3}
            />
            <div className="td-forum-actions">
              <button
                type="submit"
                className="td-btn td-btn--primary"
                disabled={!answerText.trim()}
              >
                Post answer
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
