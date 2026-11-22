import { useState } from "react";
import type { FormEvent } from "react";
import { errorMessage } from "@shared/api";
import type { Lesson, LessonType, NewLessonInput } from "../types/course";
import { MOCK_CLASSES } from "../api/mockClasses";

interface NewLessonModalProps {
  courseTitle: string;
  initialLesson?: Lesson;
  onClose: () => void;
  onSave: (input: NewLessonInput) => Promise<void> | void;
}

export function NewLessonModal({
  courseTitle,
  initialLesson,
  onClose,
  onSave,
}: NewLessonModalProps) {
  const [title, setTitle] = useState(initialLesson?.title ?? "");
  const [description, setDescription] = useState(
    initialLesson?.description ?? "",
  );
  const [type, setType] = useState<LessonType>(
    initialLesson?.type === "video" ||
      initialLesson?.type === "document" ||
      initialLesson?.type === "live"
      ? initialLesson.type
      : "document",
  );
  const [openAt, setOpenAt] = useState(initialLesson?.openAt ?? "");
  const [closeAt, setCloseAt] = useState(initialLesson?.closeAt ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [accessibleClassIds, setAccessibleClassIds] = useState<string[]>(
    initialLesson?.accessibleClassIds?.length
      ? initialLesson.accessibleClassIds
      : ["all"],
  );

  const isEditing = Boolean(initialLesson);
  const isAllClasses = accessibleClassIds.includes("all");

  const toggleClass = (classId: string) => {
    setAccessibleClassIds((previous) => {
      if (classId === "all") {
        return ["all"];
      }

      const selected = previous.filter((id) => id !== "all");

      return selected.includes(classId)
        ? selected.filter((id) => id !== classId)
        : [...selected, classId];
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Lesson name is required.");
      return;
    }

    if (openAt && closeAt && closeAt <= openAt) {
      setError("The closing time must be after the opening time.");
      return;
    }

    if (accessibleClassIds.length === 0) {
      setError("Choose at least one class, or select All classes.");
      return;
    }

    let fileName: string | undefined;
    let fileUrl: string | undefined;

    if (file) {
      fileName = file.name;
      fileUrl = URL.createObjectURL(file);
    } else if (!removeExistingFile && initialLesson) {
      fileName = initialLesson.fileName;
      fileUrl = initialLesson.fileUrl;
    }

    try {
      setIsSaving(true);
      await onSave({
        title: title.trim(),
        description: description.trim(),
        type,
        openAt,
        closeAt,
        fileName,
        fileUrl,
        accessibleClassIds,
      });
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="td-lesson-modal-overlay"
      onMouseDown={() => {
        if (!isSaving) onClose();
      }}
    >
      <section
        className="td-lesson-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="td-lesson-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="td-lesson-modal__header">
          <div>
            <h2 id="td-lesson-modal-title">
              {isEditing ? "Edit lesson" : "New lesson"}
            </h2>
            <p>{courseTitle}</p>
          </div>

          <button
            type="button"
            className="td-lesson-modal__close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="td-lesson-form" onSubmit={handleSubmit}>
          <label>
            Lesson name
            <input
              className="td-lesson-form__input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter lesson name"
              maxLength={120}
              disabled={isSaving}
              required
            />
          </label>

          <label>
            Description / instructions
            <textarea
              className="td-lesson-form__input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explain what students should learn or do..."
              rows={3}
              disabled={isSaving}
            />
          </label>

          <label>
            Lesson type
            <select
              className="td-lesson-form__input"
              value={type}
              disabled={isSaving}
              onChange={(event) => setType(event.target.value as LessonType)}
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="live">Live practice</option>
            </select>
          </label>

          <div className="td-lesson-form__time-grid">
            <label>
              Time open (optional)
              <input
                type="datetime-local"
                className="td-lesson-form__input"
                value={openAt}
                disabled={isSaving}
                onChange={(event) => setOpenAt(event.target.value)}
              />
            </label>

            <label>
              Time close (optional)
              <input
                type="datetime-local"
                className="td-lesson-form__input"
                value={closeAt}
                min={openAt || undefined}
                disabled={isSaving}
                onChange={(event) => setCloseAt(event.target.value)}
              />
            </label>
          </div>

          <fieldset className="td-class-access">
            <legend>Accessible to</legend>
            <p className="td-lesson-form__hint">
              Choose the classes that can access this lesson.
            </p>

            <label className="td-class-access__option">
              <input
                type="checkbox"
                checked={isAllClasses}
                disabled={isSaving}
                onChange={() => toggleClass("all")}
              />
              <span>All classes</span>
            </label>

            {MOCK_CLASSES.map((teacherClass) => (
              <label className="td-class-access__option" key={teacherClass.id}>
                <input
                  type="checkbox"
                  checked={accessibleClassIds.includes(teacherClass.id)}
                  disabled={isSaving}
                  onChange={() => toggleClass(teacherClass.id)}
                />
                <span>{teacherClass.name}</span>
              </label>
            ))}
          </fieldset>

          <label>
            Attachment (optional)
            <input
              type="file"
              className="td-lesson-form__input"
              disabled={isSaving}
              onChange={(event) => {
                setFile(event.currentTarget.files?.[0] ?? null);
                setRemoveExistingFile(false);
              }}
            />
            {initialLesson?.fileName && !removeExistingFile && !file && (
              <span className="td-lesson-form__hint">
                Current file: {initialLesson.fileName}
              </span>
            )}
          </label>

          {initialLesson?.fileName && (
            <label className="td-class-access__option">
              <input
                type="checkbox"
                checked={removeExistingFile}
                disabled={isSaving}
                onChange={(event) => {
                  setRemoveExistingFile(event.target.checked);
                  if (event.target.checked) setFile(null);
                }}
              />
              <span>Remove existing attachment</span>
            </label>
          )}

          {error && <p className="td-lesson-form__error">{error}</p>}

          <div className="td-lesson-modal__actions">
            <button
              type="button"
              className="td-btn td-btn--outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="td-btn td-btn--primary"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create lesson"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
