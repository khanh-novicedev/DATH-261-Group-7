import { useState } from "react";
import type {
  QnaItemKind,
  QnaItemStatus,
  QnaReportItem,
} from "../types/course";

interface QnaReportViewProps {
  items: QnaReportItem[];
  currentUser: string;
  onToggleStatus: (itemId: string) => void;
  onReply: (itemId: string, message: string, file: File | null) => void;
}

type KindFilter = "all" | QnaItemKind;
type StatusFilter = "all" | QnaItemStatus;

const formatDate = (value: string) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

export function QnaReportView({
  items,
  currentUser,
  onToggleStatus,
  onReply,
}: QnaReportViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    items[0]?.id ?? null,
  );
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);

  const query = search.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    const matchesKind = kindFilter === "all" || item.kind === kindFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      !query ||
      [
        item.title,
        item.author,
        item.className,
        item.courseTitle,
        item.lessonTitle,
        item.content,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    return matchesKind && matchesStatus && matchesSearch;
  });

  const selectedItem =
    items.find((item) => item.id === selectedId) ?? filteredItems[0];

  const unresolvedCount = items.filter(
    (item) => item.status === "unresolved",
  ).length;

  const handleReply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedItem || !replyText.trim()) return;

    onReply(selectedItem.id, replyText.trim(), replyFile);
    setReplyText("");
    setReplyFile(null);
  };

  const authorLabel = (item: QnaReportItem) =>
    item.anonymous ? "Anonymous student" : item.author;

  const selectItem = (item: QnaReportItem) => {
    setSelectedId(item.id);
    setReplyText("");
    setReplyFile(null);
  };

  return (
    <main className="td-main td-main--course td-qna-page">
      <header className="td-qna-page__heading">
        <div>
          <h1 className="td-h1">Q&A / Report</h1>
          <p className="td-subtitle">
            Review student questions, respond to reports, and track resolution.
          </p>
        </div>

        <div className="td-qna-summary">
          <div>
            <strong>{items.length}</strong>
            <span>Total items</span>
          </div>
          <div>
            <strong>{unresolvedCount}</strong>
            <span>Unresolved</span>
          </div>
        </div>
      </header>

      <div className="td-qna-filters">
        <input
          className="td-search"
          type="search"
          placeholder="Search title, student, class, course..."
          aria-label="Search Q&A and reports"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="td-lesson-form__input"
          aria-label="Filter by type"
          value={kindFilter}
          onChange={(event) => setKindFilter(event.target.value as KindFilter)}
        >
          <option value="all">All items</option>
          <option value="question">Questions</option>
          <option value="report">Reports</option>
        </select>

        <select
          className="td-lesson-form__input"
          aria-label="Filter by state"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as StatusFilter)
          }
        >
          <option value="all">All states</option>
          <option value="unresolved">Unresolved</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="td-qna-layout">
        <section className="td-card td-qna-list" aria-label="All items">
          <div className="td-qna-list__heading">
            <h2 className="td-h3">All questions and reports</h2>
            <span>{filteredItems.length} items</span>
          </div>

          <div className="td-qna-list__scroll">
            {filteredItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`td-qna-list-item ${
                  selectedItem?.id === item.id ? "td-qna-list-item--active" : ""
                }`}
                onClick={() => selectItem(item)}
              >
                <span
                  className={`td-qna-status td-qna-status--${item.status}`}
                  aria-label={item.status}
                  title={item.status}
                >
                  {item.status === "resolved" ? "✓" : "×"}
                </span>

                <span className="td-qna-list-item__body">
                  <span className="td-qna-list-item__title">{item.title}</span>
                  <span className="td-qna-list-item__meta">
                    {item.kind === "report" ? "Report" : "Question"} ·{" "}
                    {authorLabel(item)}
                  </span>
                  <span className="td-qna-list-item__meta">
                    {item.className} · {item.courseTitle}
                  </span>
                  <span className="td-qna-list-item__meta">
                    {item.lessonTitle}
                  </span>
                </span>
              </button>
            ))}

            {filteredItems.length === 0 && (
              <p className="td-empty">No items match these filters.</p>
            )}
          </div>
        </section>

        <section className="td-card td-qna-detail" aria-label="Selected item">
          {!selectedItem ? (
            <div className="td-qna-empty">
              <h2 className="td-h3">Select an item</h2>
              <p className="td-subtitle">
                Choose a question or report to view its details.
              </p>
            </div>
          ) : (
            <>
              <header className="td-qna-detail__header">
                <div>
                  <span className="td-qna-type">
                    {selectedItem.kind === "report" ? "REPORT" : "QUESTION"}
                  </span>
                  <h2 className="td-h3">{selectedItem.title}</h2>
                  <p className="td-qna-detail__date">
                    Created {formatDate(selectedItem.createdAt)}
                  </p>
                </div>

                <span
                  className={`td-qna-state-label td-qna-state-label--${selectedItem.status}`}
                >
                  {selectedItem.status === "resolved"
                    ? "✓ Resolved"
                    : "× Unresolved"}
                </span>
              </header>

              <div className="td-qna-metadata">
                <div>
                  <span>Original author</span>
                  <strong>{authorLabel(selectedItem)}</strong>
                </div>
                <div>
                  <span>Class</span>
                  <strong>{selectedItem.className}</strong>
                </div>
                <div>
                  <span>Course</span>
                  <strong>{selectedItem.courseTitle}</strong>
                </div>
                <div>
                  <span>Lesson</span>
                  <strong>{selectedItem.lessonTitle}</strong>
                </div>
              </div>

              <div className="td-qna-detail__scroll">
                <article className="td-qna-original">
                  <h3>Original content</h3>
                  <p>{selectedItem.content}</p>

                  {selectedItem.fileUrl && selectedItem.fileName && (
                    <a
                      className="td-qna-attachment-link"
                      href={selectedItem.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download={selectedItem.fileName}
                    >
                      📎 {selectedItem.fileName}
                    </a>
                  )}
                </article>

                <section className="td-qna-replies">
                  <h3>Replies ({selectedItem.replies.length})</h3>

                  {selectedItem.replies.map((reply) => (
                    <article className="td-qna-reply" key={reply.id}>
                      <div className="td-qna-reply__header">
                        <strong>{reply.author}</strong>
                        <time>{formatDate(reply.createdAt)}</time>
                      </div>
                      <p>{reply.message}</p>

                      {reply.fileUrl && reply.fileName && (
                        <a
                          className="td-qna-attachment-link"
                          href={reply.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={reply.fileName}
                        >
                          📎 {reply.fileName}
                        </a>
                      )}
                    </article>
                  ))}

                  {selectedItem.replies.length === 0 && (
                    <p className="td-empty">
                      No replies yet. Add the first response below.
                    </p>
                  )}
                </section>
              </div>

              <form className="td-qna-reply-form" onSubmit={handleReply}>
                <label htmlFor="td-qna-reply-text">
                  Reply as {currentUser}
                </label>

                <textarea
                  id="td-qna-reply-text"
                  className="td-forum-textarea"
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  placeholder="Write a response..."
                  rows={3}
                  required
                />

                <div className="td-qna-reply-form__actions">
                  <label className="td-lesson-add-file">
                    {replyFile ? "Change file" : "+ Add file"}
                    <input
                      type="file"
                      onChange={(event) =>
                        setReplyFile(event.currentTarget.files?.[0] ?? null)
                      }
                    />
                  </label>

                  {replyFile && (
                    <span className="td-qna-selected-file">
                      {replyFile.name}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="td-btn td-btn--primary"
                    disabled={!replyText.trim()}
                  >
                    Send reply
                  </button>
                </div>

                <button
                  type="button"
                  className="td-btn td-btn--outline td-qna-resolve-button"
                  onClick={() => onToggleStatus(selectedItem.id)}
                >
                  {selectedItem.status === "resolved"
                    ? "Mark unresolved"
                    : "Mark resolved"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
