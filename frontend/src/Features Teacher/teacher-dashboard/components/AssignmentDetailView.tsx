import { useMemo, useState } from "react";
import { ChevronRightIcon } from "./Icons";
import { MOCK_CLASSES, MOCK_CLASS_STUDENTS } from "../api/mockClasses";
import type { Course, Lesson } from "../types/course";

interface AssignmentDetailViewProps {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
  onGoToCourses: () => void;
}

export function AssignmentDetailView({
  course,
  lesson,
  onBack,
  onGoToCourses,
}: AssignmentDetailViewProps) {
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["all"]);

  const accessibleIds = lesson.accessibleClassIds?.length
    ? lesson.accessibleClassIds
    : ["all"];

  const allowedClasses = MOCK_CLASSES.filter(
    (teacherClass) =>
      accessibleIds.includes("all") || accessibleIds.includes(teacherClass.id),
  );

  const allowedClassIds = allowedClasses.map((item) => item.id);

  const students = useMemo(
    () =>
      MOCK_CLASS_STUDENTS.filter((student) =>
        allowedClassIds.includes(student.classId),
      ),
    [allowedClassIds.join("|")],
  );

  const filteredStudents = students.filter((student) =>
    selectedClasses.includes("all")
      ? true
      : selectedClasses.includes(student.classId),
  );

  const toggleClass = (classId: string) => {
    setSelectedClasses((previous) => {
      if (classId === "all") return ["all"];

      const selected = previous.filter((id) => id !== "all");

      return selected.includes(classId)
        ? selected.filter((id) => id !== classId)
        : [...selected, classId];
    });
  };

  const getStatus = (demoSubmitted: boolean) => {
    if (demoSubmitted) return "Submitted";
    if (lesson.closeAt && new Date(lesson.closeAt).getTime() < Date.now()) {
      return "Overdue";
    }
    return "Not submitted";
  };

  const submittedCount = filteredStudents.filter(
    (student) => getStatus(student.demoSubmitted) === "Submitted",
  ).length;

  return (
    <main className="td-main td-main--course td-assignment-page">
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

      <div className="td-assignment-heading">
        <div>
          <span className="td-lesson-detail__type">Assignment</span>
          <h1 className="td-h1">{lesson.title}</h1>
          <p className="td-subtitle">{course.title}</p>
        </div>
      </div>

      <div className="td-assignment-layout">
        <section className="td-card td-assignment-instructions">
          <h2 className="td-h3">Instructions</h2>

          <div className="td-assignment-instructions__scroll">
            <p className="td-lesson-detail__description">
              {lesson.description || "No instructions have been added yet."}
            </p>

            <div className="td-lesson-detail__times">
              <div>
                <span>Opens</span>
                <strong>
                  {lesson.openAt
                    ? new Date(lesson.openAt).toLocaleString()
                    : "Not set"}
                </strong>
              </div>
              <div>
                <span>Due date</span>
                <strong>
                  {lesson.closeAt
                    ? new Date(lesson.closeAt).toLocaleString()
                    : "Not set"}
                </strong>
              </div>
            </div>

            {lesson.fileUrl && lesson.fileName && (
              <div className="td-assignment-attachment">
                <strong>Attached resource</strong>
                <span>{lesson.fileName}</span>
                <a
                  className="td-btn td-btn--outline"
                  href={lesson.fileUrl}
                  download={lesson.fileName}
                >
                  Download attachment
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="td-card td-assignment-students">
          <div className="td-assignment-students__header">
            <div>
              <h2 className="td-h3">Student submissions</h2>
              <p className="td-subtitle">
                {submittedCount} of {filteredStudents.length} submitted
              </p>
            </div>
          </div>

          <div className="td-assignment-filters">
            <strong>Filter by class</strong>

            <label className="td-class-access__option">
              <input
                type="checkbox"
                checked={selectedClasses.includes("all")}
                onChange={() => toggleClass("all")}
              />
              <span>All classes</span>
            </label>

            <div className="td-assignment-filters__classes">
              {allowedClasses.map((teacherClass) => (
                <label
                  className="td-class-access__option"
                  key={teacherClass.id}
                >
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(teacherClass.id)}
                    onChange={() => toggleClass(teacherClass.id)}
                  />
                  <span>{teacherClass.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="td-assignment-student-list">
            {filteredStudents.map((student) => {
              const status = getStatus(student.demoSubmitted);
              const teacherClass = allowedClasses.find(
                (item) => item.id === student.classId,
              );

              return (
                <article className="td-assignment-student" key={student.id}>
                  <div className="td-assignment-student__avatar">
                    {student.name.charAt(0)}
                  </div>

                  <div className="td-assignment-student__info">
                    <strong>{student.name}</strong>
                    <span>{teacherClass?.name ?? "Unknown class"}</span>
                  </div>

                  <span
                    className={`td-submission-status td-submission-status--${status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {status}
                  </span>
                </article>
              );
            })}

            {filteredStudents.length === 0 && (
              <p className="td-empty">
                No students match the selected classes.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
