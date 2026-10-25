import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MOCK_ANNOUNCEMENTS, MOCK_USER } from "../api/mockCourses";
import { useCourses } from "../hooks/useCourses";
import type {
  ForumAnswer,
  ForumQuestion,
  Lesson,
  NewCourseInput,
  NewLessonInput,
  QuizData,
} from "../types/course";
import { AppHeader } from "./AppHeader";
import { CoursePageView } from "./CoursePageView";
import { CreateCourseModal } from "./CreateCourseModal";
import { DashboardView } from "./DashboardView";
import { MyCoursesView } from "./MyCoursesView";
import { CourseForumView } from "./CourseForumView";
import { AssignmentDetailView } from "./AssignmentDetailView";
import { QuizBuilderView } from "./QuizBuilderView";
import { LessonDetailView } from "./LessonDetailView";
import { NewLessonModal } from "./NewLessonModal";
import { LivePracticeView } from "./LivePracticeView";
import { QnaReportView } from "./QnAReportView";

import { MOCK_QA_REPORTS } from "../api/mockQaReports";
import type { QnaReply, QnaReportItem } from "../types/course";
import "../assets/teacherDashboard.css";

type View =
  | { name: "dashboard" }
  | { name: "courses" }
  | { name: "course"; courseId: string }
  | { name: "forum"; courseId: string }
  | { name: "lesson"; courseId: string; lessonId: string }
  | { name: "qa-reports" };

function getViewFromPath(pathname: string): View {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  if (segments[0] !== "teacher") {
    return { name: "dashboard" };
  }

  if (segments[1] === "dashboard") {
    return { name: "dashboard" };
  }

  if (segments[1] === "qa-reports") {
    return { name: "qa-reports" };
  }

  if (segments[1] !== "courses") {
    return { name: "dashboard" };
  }

  if (segments.length === 2) {
    return { name: "courses" };
  }

  const courseId = segments[2];

  if (!courseId) {
    return { name: "dashboard" };
  }

  if (segments.length === 3) {
    return { name: "course", courseId };
  }

  if (segments.length === 4 && segments[3] === "forum") {
    return { name: "forum", courseId };
  }

  if (segments.length === 5 && segments[3] === "lessons" && segments[4]) {
    return {
      name: "lesson",
      courseId,
      lessonId: segments[4],
    };
  }

  return { name: "dashboard" };
}

function getPathFromView(view: View): string {
  switch (view.name) {
    case "dashboard":
      return "/teacher/dashboard";

    case "courses":
      return "/teacher/courses";

    case "course":
      return `/teacher/courses/${encodeURIComponent(view.courseId)}`;

    case "forum":
      return `/teacher/courses/${encodeURIComponent(view.courseId)}/forum`;

    case "lesson":
      return `/teacher/courses/${encodeURIComponent(view.courseId)}/lessons/${encodeURIComponent(view.lessonId)}`;

    case "qa-reports":
      return "/teacher/qa-reports";
  }
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function TeacherDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const view = getViewFromPath(location.pathname);

  const setView = (nextView: View) => {
    navigate(getPathFromView(nextView));
  };

  const { courses, addCourse, addLesson, updateLesson, deleteLesson } =
    useCourses();
  const [creating, setCreating] = useState(false);
  const [forumCreatedFor, setForumCreatedFor] = useState<string[]>([]);
  const [forumQuestions, setForumQuestions] = useState<ForumQuestion[]>([]);
  const [creatingLessonFor, setCreatingLessonFor] = useState<string | null>(
    null,
  );

  const [editingLessonFor, setEditingLessonFor] = useState<{
    courseId: string;
    lesson: Lesson;
  } | null>(null);

  const [quizDataByLesson, setQuizDataByLesson] = useState<
    Record<string, QuizData>
  >({});
  const course =
    view.name === "course" || view.name === "forum" || view.name === "lesson"
      ? courses.find((c) => c.id === view.courseId)
      : undefined;

  const selectedLesson =
    view.name === "lesson" && course
      ? course.lessons.find((lesson) => lesson.id === view.lessonId)
      : undefined;

  const showCourse = view.name === "course" && course !== undefined;

  const goToDashboard = () => setView({ name: "dashboard" });
  const goToCourses = () => setView({ name: "courses" });

  const handleCreate = (input: NewCourseInput) => {
    addCourse(input);
    setCreating(false);
    setView({ name: "courses" });
  };

  const handleCreateForum = (courseId: string) => {
    setForumCreatedFor((previous) =>
      previous.includes(courseId) ? previous : [...previous, courseId],
    );

    // Seed example questions once so the forum can be tested.
    setForumQuestions((previous) => {
      if (previous.some((q) => q.courseId === courseId)) {
        return previous;
      }

      const now = new Date().toISOString();

      return [
        {
          id: makeId(),
          courseId,
          title: "What should I focus on in this course?",
          author: "Alex Nguyen",
          createdAt: now,
          answers: [
            {
              id: makeId(),
              author: "Taylor",
              body: "Start with the core lessons, then practise with the assignments.",
              createdAt: now,
            },
          ],
        },
        {
          id: makeId(),
          courseId,
          title: "Can someone explain the last lesson?",
          author: "Minh Tran",
          createdAt: now,
          answers: [],
        },
      ];
    });

    setView({ name: "forum", courseId });
  };

  const handleSaveLesson = (input: NewLessonInput) => {
    if (editingLessonFor) {
      const { courseId, lesson: oldLesson } = editingLessonFor;

      updateLesson(courseId, oldLesson.id, {
        ...oldLesson,
        title: input.title,
        type: input.type,
        detail: input.type,
        description: input.description,
        openAt: input.openAt,
        closeAt: input.closeAt,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        accessibleClassIds: input.accessibleClassIds,
      });

      setEditingLessonFor(null);
      setView({ name: "course", courseId });
      return;
    }

    if (!creatingLessonFor) return;

    const courseId = creatingLessonFor;

    addLesson(courseId, {
      id: makeId(),
      title: input.title,
      type: input.type,
      detail: input.type,
      status: "not-started",
      description: input.description,
      openAt: input.openAt,
      closeAt: input.closeAt,
      fileName: input.fileName,
      fileUrl: input.fileUrl,
      accessibleClassIds: input.accessibleClassIds,
    });

    setCreatingLessonFor(null);
    setView({ name: "course", courseId });
  };

  const handleDeleteLesson = (courseId: string, lessonId: string) => {
    const confirmed = window.confirm(
      "Remove this lesson? This action cannot be undone.",
    );

    if (!confirmed) return;

    deleteLesson(courseId, lessonId);

    setQuizDataByLesson((previous) => {
      const next = { ...previous };
      delete next[lessonId];
      return next;
    });
  };

  const handleAddAnswer = (questionId: string, body: string) => {
    const now = new Date().toISOString();

    const answer: ForumAnswer = {
      id: makeId(),
      author: MOCK_USER.name,
      body: body.trim(),
      createdAt: now,
    };

    setForumQuestions((previous) =>
      previous.map((question) =>
        question.id === questionId
          ? { ...question, answers: [...question.answers, answer] }
          : question,
      ),
    );
  };

  const handleEditAnswer = (
    questionId: string,
    answerId: string,
    body: string,
  ) => {
    setForumQuestions((previous) =>
      previous.map((question) =>
        question.id !== questionId
          ? question
          : {
              ...question,
              answers: question.answers.map((answer) =>
                answer.id === answerId && answer.author === MOCK_USER.name
                  ? {
                      ...answer,
                      body: body.trim(),
                      updatedAt: new Date().toISOString(),
                    }
                  : answer,
              ),
            },
      ),
    );
  };

  const handleDeleteAnswer = (questionId: string, answerId: string) => {
    setForumQuestions((previous) =>
      previous.map((question) =>
        question.id !== questionId
          ? question
          : {
              ...question,
              answers: question.answers.filter(
                (answer) =>
                  answer.id !== answerId || answer.author !== MOCK_USER.name,
              ),
            },
      ),
    );
  };

  const [qaItems, setQaItems] = useState<QnaReportItem[]>(MOCK_QA_REPORTS);

  const handleQnaReply = (
    itemId: string,
    message: string,
    file: File | null,
  ) => {
    const reply: QnaReply = {
      id: makeId(),
      author: MOCK_USER.name,
      message,
      createdAt: new Date().toISOString(),
      fileName: file?.name,
      fileUrl: file ? URL.createObjectURL(file) : undefined,
    };

    setQaItems((previous) =>
      previous.map((item) =>
        item.id === itemId
          ? { ...item, replies: [...item.replies, reply] }
          : item,
      ),
    );
  };

  const handleToggleQnaStatus = (itemId: string) => {
    setQaItems((previous) =>
      previous.map((item) =>
        item.id !== itemId
          ? item
          : {
              ...item,
              status: item.status === "resolved" ? "unresolved" : "resolved",
            },
      ),
    );
  };

  return (
    <div className="td-root">
      <AppHeader
        active={
          view.name === "dashboard"
            ? "dashboard"
            : view.name === "qa-reports"
              ? "qa-reports"
              : "courses"
        }
        userName={MOCK_USER.name}
        onDashboard={goToDashboard}
        onMyCourses={goToCourses}
        onQAReports={() => setView({ name: "qa-reports" })}
      />

      {view.name === "forum" && course ? (
        <CourseForumView
          course={course}
          questions={forumQuestions.filter(
            (question) => question.courseId === course.id,
          )}
          currentUser={MOCK_USER.name}
          onBack={() => setView({ name: "course", courseId: course.id })}
          onAddAnswer={handleAddAnswer}
          onEditAnswer={handleEditAnswer}
          onDeleteAnswer={handleDeleteAnswer}
        />
      ) : /*: view.name === "lesson" && course && selectedLesson ? (
        <LessonDetailView
          course={course}
          lesson={selectedLesson}
          onBack={() => setView({ name: "course", courseId: course.id })}
          onGoToCourses={goToCourses}
        />
        ) */
      view.name === "lesson" && course && selectedLesson ? (
        selectedLesson.type === "assignment" ? (
          <AssignmentDetailView
            course={course}
            lesson={selectedLesson}
            onBack={() => setView({ name: "course", courseId: course.id })}
            onGoToCourses={goToCourses}
          />
        ) : selectedLesson.type === "quiz" ? (
          <QuizBuilderView
            course={course}
            lesson={selectedLesson}
            quizData={
              quizDataByLesson[selectedLesson.id] ?? {
                durationMinutes: 30,
                questions: [],
              }
            }
            onChange={(data) =>
              setQuizDataByLesson((previous) => ({
                ...previous,
                [selectedLesson.id]: data,
              }))
            }
            onBack={() => setView({ name: "course", courseId: course.id })}
            onGoToCourses={goToCourses}
          />
        ) : selectedLesson.type === "live" ? (
          <LivePracticeView
            course={course}
            lesson={selectedLesson}
            onBack={() => setView({ name: "course", courseId: course.id })}
            onGoToCourses={goToCourses}
          />
        ) : (
          <LessonDetailView
            course={course}
            lesson={selectedLesson}
            onBack={() => setView({ name: "course", courseId: course.id })}
            onGoToCourses={goToCourses}
          />
        )
      ) : showCourse && course ? (
        <CoursePageView
          course={course}
          onBack={goToCourses}
          hasForum={forumCreatedFor.includes(course.id)}
          onCreateForum={() => handleCreateForum(course.id)}
          onOpenForum={() => setView({ name: "forum", courseId: course.id })}
          onNewLesson={() => setCreatingLessonFor(course.id)}
          onOpenLesson={(lessonId) =>
            setView({
              name: "lesson",
              courseId: course.id,
              lessonId,
            })
          }
          onEditLesson={(lesson) =>
            setEditingLessonFor({ courseId: course.id, lesson })
          }
          onDeleteLesson={(lessonId) => handleDeleteLesson(course.id, lessonId)}
        />
      ) : view.name === "courses" ? (
        <MyCoursesView
          courses={courses}
          userName={MOCK_USER.name}
          onNewCourse={() => setCreating(true)}
          onOpenCourse={(courseId) => setView({ name: "course", courseId })}
        />
      ) : view.name === "qa-reports" ? (
        <QnaReportView
          items={qaItems}
          currentUser={MOCK_USER.name}
          onToggleStatus={handleToggleQnaStatus}
          onReply={handleQnaReply}
        />
      ) : (
        <DashboardView
          announcements={MOCK_ANNOUNCEMENTS}
          userName={MOCK_USER.name}
          courses={courses}
          unresolvedQaReports={
            qaItems.filter((item) => item.status === "unresolved").length
          }
          onOpenMyCourses={goToCourses}
          onOpenQaReports={() => setView({ name: "qa-reports" })}
          onOpenCourse={(courseId) => setView({ name: "course", courseId })}
          onOpenLesson={(courseId, lessonId) =>
            setView({ name: "lesson", courseId, lessonId })
          }
        />
      )}

      {creating && (
        <CreateCourseModal
          onClose={() => setCreating(false)}
          onCreate={handleCreate}
        />
      )}

      {(creatingLessonFor || editingLessonFor) && (
        <NewLessonModal
          courseTitle={
            courses.find(
              (item) =>
                item.id === (editingLessonFor?.courseId ?? creatingLessonFor),
            )?.title ?? "Course"
          }
          initialLesson={editingLessonFor?.lesson}
          onClose={() => {
            setCreatingLessonFor(null);
            setEditingLessonFor(null);
          }}
          onSave={handleSaveLesson}
        />
      )}
    </div>
  );
}
