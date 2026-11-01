import axios from 'axios';
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { NewCourseInput } from '../types/course';

interface CreateCourseModalProps {
  onClose: () => void;
  onCreate: (input: NewCourseInput) => Promise<void>;
  initialCourse?: NewCourseInput;
  mode?: 'create' | 'edit';
}

interface ApiErrorResponse {
  message?: string;
  errorCode?: string;
}

const FOCUSABLE = 'button:not([disabled]), input, textarea, [href], [tabindex]:not([tabindex="-1"])';

export function CreateCourseModal({
  onClose,
  onCreate,
  initialCourse,
  mode = 'create',
}: CreateCourseModalProps) {
  const [name, setName] = useState(initialCourse?.name ?? '');
  const [description, setDescription] = useState(
    initialCourse?.description ?? '',
  );
  const [category, setCategory] = useState(initialCourse?.category ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const nameId = `${uid}-name`;
  const descId = `${uid}-description`;
  const categoryId = `${uid}-category`;
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
      if (!submitting) onClose();
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

    setSubmitting(true);
    setError('');
    try {
      await onCreate({
        name: trimmed,
        description: description.trim(),
        category: category.trim(),
      });
    } catch (submitError) {
      let message = 'Unable to create course. Please try again.';
      if (axios.isAxiosError<ApiErrorResponse>(submitError)) {
        message = submitError.response
          ? submitError.response.data?.message ??
            submitError.response.data?.errorCode ??
            submitError.message
          : `Cannot reach the API at ${submitError.config?.baseURL ?? 'the configured API URL'}. Make sure the backend is running and VITE_API_BASE_URL points to it.`;
      } else if (submitError instanceof Error) {
        message = submitError.message;
      }
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="td-overlay"
      onMouseDown={(e) => {
        if (!submitting && e.target === e.currentTarget) onClose();
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
            {mode === 'edit' ? 'Edit Course' : 'Create Course'}
          </h2>
          <button
            type="button"
            className="td-modal__close"
            aria-label="Close"
            onClick={onClose}
            disabled={submitting}
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
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            disabled={submitting}
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
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError('');
            }}
            disabled={submitting}
          />

          <label className="td-modal__label" htmlFor={categoryId}>
            Category
          </label>
          <input
            id={categoryId}
            className="td-modal__input"
            type="text"
            placeholder="e.g. Teamwork"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (error) setError('');
            }}
            disabled={submitting}
          />

          <div className="td-modal__actions">
            <button
              type="button"
              className="td-btn td-btn--ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="td-btn td-btn--modal"
              disabled={submitting}
            >
              {submitting
                ? mode === 'edit'
                  ? 'Saving…'
                  : 'Creating…'
                : mode === 'edit'
                  ? 'Save changes'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
