import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { errorMessage } from '@shared/api';
import type { Course, NewCourseInput } from '../types/course';

interface CreateCourseModalProps {
  initialCourse?: Course;
  onClose: () => void;
  onSave: (input: NewCourseInput) => Promise<void> | void;
}

const FOCUSABLE = 'button:not([disabled]), input, textarea, [href], [tabindex]:not([tabindex="-1"])';

export function CreateCourseModal({ initialCourse, onClose, onSave }: CreateCourseModalProps) {
  const isEditing = Boolean(initialCourse);
  const [name, setName] = useState(initialCourse?.title ?? '');
  const [description, setDescription] = useState(initialCourse?.description ?? '');
  const [category, setCategory] = useState(initialCourse?.category ?? '');
  const [prerequisites, setPrerequisites] = useState(initialCourse?.prerequisites ?? '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const nameId = `${uid}-name`;
  const descId = `${uid}-description`;
  const categoryId = `${uid}-category`;
  const prerequisitesId = `${uid}-prerequisites`;
  const errorId = `${uid}-error`;

  // Focus the first field, lock page scroll, and restore focus to the opener on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nameRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    // Keep Tab focus inside the dialog.
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Course name is required.');
      nameRef.current?.focus();
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        name: trimmed,
        description: description.trim(),
        category: category.trim(),
        prerequisites: prerequisites.trim(),
      });
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="td-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        className="td-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="td-modal__header">
          <h2 id={titleId} className="td-modal__title">
            {isEditing ? 'Edit Course' : 'Create Course'}
          </h2>
          <button
            type="button"
            className="td-modal__close"
            aria-label="Close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="td-modal__label" htmlFor={nameId}>
            Course name
          </label>
          <input
            ref={nameRef}
            id={nameId}
            className="td-modal__input"
            type="text"
            placeholder="Enter the name..."
            maxLength={100}
            value={name}
            disabled={isSubmitting}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            autoComplete="off"
          />
          {error && (
            <p id={errorId} className="td-modal__error" role="alert">
              {error}
            </p>
          )}

          <label className="td-modal__label" htmlFor={descId}>
            Description
          </label>
          <textarea
            id={descId}
            className="td-modal__input td-modal__textarea"
            placeholder="About this course..."
            rows={3}
            maxLength={500}
            value={description}
            disabled={isSubmitting}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="td-modal__label" htmlFor={categoryId}>
            Category
          </label>
          <input
            id={categoryId}
            className="td-modal__input"
            type="text"
            placeholder="e.g. Teamwork"
            maxLength={100}
            value={category}
            disabled={isSubmitting}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label className="td-modal__label" htmlFor={prerequisitesId}>
            Prerequisites
          </label>
          <textarea
            id={prerequisitesId}
            className="td-modal__input td-modal__textarea"
            placeholder="Any prerequisites for learners..."
            rows={2}
            maxLength={500}
            value={prerequisites}
            disabled={isSubmitting}
            onChange={(e) => setPrerequisites(e.target.value)}
          />

          <div className="td-modal__actions">
            <button
              type="button"
              className="td-btn td-btn--ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="td-btn td-btn--modal"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
