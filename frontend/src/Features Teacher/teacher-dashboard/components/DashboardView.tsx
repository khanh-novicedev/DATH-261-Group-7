import { useMemo } from "react";
import type { Announcement, Course, Lesson } from "../types/course";
import {
  BookIcon,
  ChevronRightIcon,
  DocumentIcon,
  UploadIcon,
  UserIcon,
  VideoIcon,
} from "./Icons";

interface DashboardViewProps {
  announcements: Announcement[];
  userName: string;
  courses?: Course[];
  pendingSubmissions?: number;
  unresolvedQaReports?: number;
  onOpenMyCourses?: () => void;
  onOpenQaReports?: () => void;
  onOpenCourse?: (courseId: string) => void;
  onOpenLesson?: (courseId: string, lessonId: string) => void;
}

interface ScheduleEntry {
  course: Course;
  lesson: Lesson;
  at: Date | null;
}

const asDate = (value?: string): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getLessonDate = (lesson: Lesson): Date | null =>
  asDate(
    lesson.type === "assignment"
      ? (lesson.closeAt ?? lesson.openAt)
      : (lesson.openAt ?? lesson.closeAt),
  );

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

const lessonKind = (lesson: Lesson) => {
  switch (lesson.type) {
    case "live":
      return "Live practice";
    case "assignment":
      return "Assignment deadline";
    case "quiz":
      return "Quiz";
    case "document":
      return "Learning material";
    default:
      return "Lesson";
  }
};

export function DashboardView({
  announcements,
  userName,
  courses = [],
  pendingSubmissions,
  unresolvedQaReports = 0,
  onOpenMyCourses,
  onOpenQaReports,
  onOpenCourse,
  onOpenLesson,
}: DashboardViewProps) {
  const allLessons = useMemo(
    () =>
      courses.flatMap((course) =>
        course.lessons.map((lesson) => ({ course, lesson })),
      ),
    [courses],
  );

  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const lessonsThisWeek = allLessons.filter(({ lesson }) => {
    const date = getLessonDate(lesson);
    return date !== null && date >= now && date <= weekEnd;
  }).length;

  const upcomingSchedule = useMemo(() => {
    const currentTime = Date.now();
    const dated: ScheduleEntry[] = allLessons
      .map(({ course, lesson }) => ({
        course,
        lesson,
        at: getLessonDate(lesson),
      }))
      .filter((entry) => entry.at !== null && entry.at.getTime() >= currentTime)
      .sort((a, b) => (a.at?.getTime() ?? 0) - (b.at?.getTime() ?? 0));

    // Existing mock lessons may not have structured dates yet. Keep useful
    // teaching tasks visible, but clearly mark their time as not scheduled.
    const datedIds = new Set(
      dated.map((entry) => `${entry.course.id}:${entry.lesson.id}`),
    );
    const unscheduled: ScheduleEntry[] = allLessons
      .filter(
        ({ course, lesson }) =>
          !datedIds.has(`${course.id}:${lesson.id}`) &&
          !getLessonDate(lesson) &&
          (lesson.type === "live" ||
            lesson.type === "assignment" ||
            lesson.status === "in-progress"),
      )
      .map(({ course, lesson }) => ({ course, lesson, at: null }));

    return [...dated, ...unscheduled].slice(0, 4);
  }, [allLessons]);

  const incompleteAssignments = allLessons.filter(
    ({ lesson }) =>
      lesson.type === "assignment" && lesson.status !== "completed",
  ).length;

  const firstLivePractice = allLessons.find(
    ({ lesson }) => lesson.type === "live",
  );
  const firstAssignment = allLessons.find(
    ({ lesson }) => lesson.type === "assignment",
  );

  const openLessonOrCourse = (entry?: { course: Course; lesson: Lesson }) => {
    if (!entry) {
      onOpenMyCourses?.();
      return;
    }
    if (onOpenLesson) onOpenLesson(entry.course.id, entry.lesson.id);
    else onOpenCourse?.(entry.course.id);
  };

  const firstName = userName.trim().split(/\s+/)[0] || "Teacher";
  const todayLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  const fallbackAnnouncementTitles = [
    "This week's teaching updates",
    "Review upcoming learning materials",
  ];

  return (
    <main className="td-main td-main--dashboard td-dashboard-overview">
      <header className="td-dashboard-welcome">
        <div>
          <p className="td-dashboard-eyebrow">TEACHER WORKSPACE</p>
          <h1 className="td-h1">Good to see you, {firstName}!</h1>
          <p className="td-subtitle">
            Here's what's happening across your courses today.
          </p>
        </div>
        <div
          className="td-dashboard-today"
          aria-label={`Today is ${todayLabel}`}
        >
          <span className="td-dashboard-today__icon">
            <DocumentIcon size={19} />
          </span>
          <span>
            <strong>{todayLabel}</strong>
            <small>Your teaching overview</small>
          </span>
        </div>
      </header>

      <section className="td-dashboard-stats" aria-label="Teaching overview">
        <article className="td-dashboard-stat td-dashboard-stat--blue">
          <span className="td-dashboard-stat__icon">
            <BookIcon size={22} />
          </span>
          <div className="td-dashboard-stat__copy">
            <span>Active courses</span>
            <strong>{courses.length}</strong>
            <small>Across your workspace</small>
          </div>
        </article>

        <article className="td-dashboard-stat td-dashboard-stat--violet">
          <span className="td-dashboard-stat__icon">
            <VideoIcon size={22} />
          </span>
          <div className="td-dashboard-stat__copy">
            <span>Lessons this week</span>
            <strong>{lessonsThisWeek}</strong>
            <small>Based on lesson dates</small>
          </div>
        </article>

        <article className="td-dashboard-stat td-dashboard-stat--amber">
          <span className="td-dashboard-stat__icon">
            <UploadIcon size={22} />
          </span>
          <div className="td-dashboard-stat__copy">
            <span>Pending submissions</span>
            <strong>{pendingSubmissions ?? "—"}</strong>
            <small>
              {pendingSubmissions === undefined
                ? `${incompleteAssignments} assignment${incompleteAssignments === 1 ? "" : "s"} to follow up`
                : "Awaiting teacher review"}
            </small>
          </div>
        </article>

        <article className="td-dashboard-stat td-dashboard-stat--green">
          <span className="td-dashboard-stat__icon">
            <UserIcon size={22} />
          </span>
          <div className="td-dashboard-stat__copy">
            <span>Open Q&A / reports</span>
            <strong>{unresolvedQaReports}</strong>
            <small>Need a response or review</small>
          </div>
        </article>
      </section>

      <div className="td-dashboard-main-grid">
        <section
          className="td-card td-dashboard-panel"
          aria-labelledby="td-dashboard-announcements"
        >
          <div className="td-dashboard-panel__heading">
            <div className="td-dashboard-panel__title-group">
              <span className="td-dashboard-panel__icon td-dashboard-panel__icon--amber">
                <UserIcon size={19} />
              </span>
              <div>
                <h2 id="td-dashboard-announcements" className="td-h3">
                  Announcements
                </h2>
                <p className="td-subtitle">
                  Updates for your teaching workspace
                </p>
              </div>
            </div>
            <span className="td-dashboard-count">{announcements.length}</span>
          </div>

          {announcements.length > 0 ? (
            <div className="td-dashboard-announcements">
              {announcements.map((announcement, index) => {
                const title =
                  announcement.title.trim().toLowerCase() === "announcement"
                    ? fallbackAnnouncementTitles[
                        index % fallbackAnnouncementTitles.length
                      ]
                    : announcement.title;

                return (
                  <article
                    className="td-dashboard-announcement"
                    key={announcement.id}
                  >
                    <span className="td-dashboard-announcement__marker" />
                    <div className="td-dashboard-announcement__body">
                      <h3>{title}</h3>
                      <p>{announcement.author}</p>
                    </div>
                    <span className="td-dashboard-announcement__tag">
                      Update
                    </span>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="td-dashboard-empty">
              <span className="td-dashboard-empty__icon">
                <DocumentIcon size={24} />
              </span>
              <strong>No announcements yet</strong>
              <p>New teaching updates will appear here.</p>
            </div>
          )}
        </section>

        <section
          className="td-card td-dashboard-panel"
          aria-labelledby="td-dashboard-schedule"
        >
          <div className="td-dashboard-panel__heading">
            <div className="td-dashboard-panel__title-group">
              <span className="td-dashboard-panel__icon td-dashboard-panel__icon--blue">
                <VideoIcon size={19} />
              </span>
              <div>
                <h2 id="td-dashboard-schedule" className="td-h3">
                  Upcoming schedule
                </h2>
                <p className="td-subtitle">Lessons and tasks to prepare</p>
              </div>
            </div>
            <button
              type="button"
              className="td-dashboard-text-button"
              onClick={onOpenMyCourses}
            >
              My Courses <ChevronRightIcon size={14} />
            </button>
          </div>

          {upcomingSchedule.length > 0 ? (
            <div className="td-dashboard-schedule-list">
              {upcomingSchedule.map(({ course, lesson, at }) => (
                <button
                  type="button"
                  className="td-dashboard-schedule-item"
                  key={`${course.id}:${lesson.id}`}
                  onClick={() => openLessonOrCourse({ course, lesson })}
                >
                  <span
                    className={`td-dashboard-datebox ${at ? "" : "td-dashboard-datebox--unscheduled"}`}
                  >
                    <small>
                      {at
                        ? at.toLocaleDateString("en", { weekday: "short" })
                        : "SET"}
                    </small>
                    <strong>{at ? at.getDate() : "—"}</strong>
                  </span>
                  <span className="td-dashboard-schedule-item__body">
                    <strong>{lesson.title}</strong>
                    <span>{course.title}</span>
                    <small>
                      {at
                        ? `${lessonKind(lesson)} · ${formatDate(at)} at ${formatTime(at)}`
                        : `${lessonKind(lesson)} · Time not set yet`}
                    </small>
                  </span>
                  <ChevronRightIcon size={17} />
                </button>
              ))}
            </div>
          ) : (
            <div className="td-dashboard-empty">
              <span className="td-dashboard-empty__icon">
                <VideoIcon size={24} />
              </span>
              <strong>No upcoming lessons</strong>
              <p>
                Add opening or closing times to your lessons to see them here.
              </p>
              <button
                type="button"
                className="td-btn td-btn--outline"
                onClick={onOpenMyCourses}
              >
                Open My Courses
              </button>
            </div>
          )}
        </section>
      </div>

      <section
        className="td-dashboard-quick-section"
        aria-labelledby="td-dashboard-quick"
      >
        <div className="td-dashboard-quick-heading">
          <div>
            <h2 id="td-dashboard-quick" className="td-h2">
              Quick access
            </h2>
            <p className="td-subtitle">
              Jump straight to a common teaching task.
            </p>
          </div>
        </div>

        <div className="td-dashboard-quick-grid">
          <button
            type="button"
            className="td-dashboard-quick-card"
            onClick={onOpenMyCourses}
          >
            <span className="td-dashboard-quick-card__icon td-dashboard-quick-card__icon--blue">
              <BookIcon size={21} />
            </span>
            <span className="td-dashboard-quick-card__copy">
              <strong>Create a lesson</strong>
              <small>Choose a course and add learning content</small>
            </span>
            <ChevronRightIcon size={17} />
          </button>

          <button
            type="button"
            className="td-dashboard-quick-card"
            onClick={() => openLessonOrCourse(firstLivePractice)}
          >
            <span className="td-dashboard-quick-card__icon td-dashboard-quick-card__icon--violet">
              <VideoIcon size={21} />
            </span>
            <span className="td-dashboard-quick-card__copy">
              <strong>Live Practice</strong>
              <small>Open a live lesson or choose a course</small>
            </span>
            <ChevronRightIcon size={17} />
          </button>

          <button
            type="button"
            className="td-dashboard-quick-card"
            onClick={() => openLessonOrCourse(firstAssignment)}
          >
            <span className="td-dashboard-quick-card__icon td-dashboard-quick-card__icon--amber">
              <UploadIcon size={21} />
            </span>
            <span className="td-dashboard-quick-card__copy">
              <strong>Review assignments</strong>
              <small>Check assignment instructions and dates</small>
            </span>
            <ChevronRightIcon size={17} />
          </button>

          <button
            type="button"
            className="td-dashboard-quick-card"
            onClick={onOpenQaReports}
          >
            <span className="td-dashboard-quick-card__icon td-dashboard-quick-card__icon--green">
              <DocumentIcon size={21} />
            </span>
            <span className="td-dashboard-quick-card__copy">
              <strong>Q&A / Report</strong>
              <small>Answer questions and review reports</small>
            </span>
            <ChevronRightIcon size={17} />
          </button>
        </div>
      </section>

      <p className="td-dashboard-footnote">
        Teaching workspace · Free educational tools, with no ads or payment
        features.
      </p>
    </main>
  );
}
