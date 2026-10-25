import { useState } from "react";
import { ChevronRightIcon } from "./Icons";
import type { Course, Lesson } from "../types/course";
import type { FormEvent } from "react";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: string;
}

interface LivePracticeViewProps {
  course: Course;
  lesson: Lesson;
  onBack: () => void;
  onGoToCourses: () => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: "chat-1",
    author: "Alex Nguyen",
    text: "Hello teacher!",
    time: "10:02",
  },
  {
    id: "chat-2",
    author: "Minh Tran",
    text: "Could you repeat the last example, please?",
    time: "10:03",
  },
];

export function LivePracticeView({
  course,
  lesson,
  onBack,
  onGoToCourses,
}: LivePracticeViewProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [handRaised, setHandRaised] = useState(false);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    const now = new Date();

    setMessages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        author: "You",
        text,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setDraft("");
  };

  return (
    <main className="td-main td-main--course td-live-page">
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

      <header className="td-live-header">
        <div>
          <div className="td-live-status">
            <span className="td-live-status__dot" />
            LIVE PRACTICE
          </div>
          <h1 className="td-h1">{lesson.title}</h1>
          <p className="td-subtitle">{course.title} · Meeting room</p>
        </div>

        <button
          type="button"
          className="td-btn td-btn--outline"
          onClick={onBack}
        >
          Leave meeting
        </button>
      </header>

      <div
        className={`td-live-layout ${
          chatOpen ? "" : "td-live-layout--chat-closed"
        }`}
      >
        <section className="td-live-stage">
          <div className="td-live-stage__topbar">
            <span>Meeting room</span>
            <span className="td-live-participant-count">
              3 participants (demo)
            </span>
          </div>

          <div className="td-live-video-grid">
            <article className="td-live-video-tile td-live-video-tile--main">
              <div className="td-live-avatar td-live-avatar--large">T</div>
              <strong>You · Teacher</strong>
              <span className="td-live-video-state">
                {cameraOn ? "Camera enabled (preview UI)" : "Camera is off"}
              </span>
              <span className="td-live-name-tag">
                {micOn ? "🎙 Microphone on" : "🔇 Microphone off"}
              </span>
            </article>

            <article className="td-live-video-tile">
              <div className="td-live-avatar">A</div>
              <strong>Alex Nguyen</strong>
              <span className="td-live-name-tag">Participant demo</span>
            </article>

            <article className="td-live-video-tile">
              <div className="td-live-avatar td-live-avatar--purple">M</div>
              <strong>Minh Tran</strong>
              <span className="td-live-name-tag">Participant demo</span>
            </article>
          </div>

          <div className="td-live-controls">
            <button
              type="button"
              className={`td-live-control ${
                micOn ? "" : "td-live-control--off"
              }`}
              onClick={() => setMicOn((value) => !value)}
            >
              <span>{micOn ? "🎙" : "🔇"}</span>
              {micOn ? "Mute" : "Unmute"}
            </button>

            <button
              type="button"
              className={`td-live-control ${
                cameraOn ? "" : "td-live-control--off"
              }`}
              onClick={() => setCameraOn((value) => !value)}
            >
              <span>{cameraOn ? "📹" : "🚫"}</span>
              {cameraOn ? "Stop video" : "Start video"}
            </button>

            <button
              type="button"
              className={`td-live-control ${
                handRaised ? "td-live-control--raised" : ""
              }`}
              onClick={() => setHandRaised((value) => !value)}
            >
              <span>✋</span>
              {handRaised ? "Lower hand" : "Raise hand"}
            </button>

            <button
              type="button"
              className={`td-live-control ${
                chatOpen ? "td-live-control--active" : ""
              }`}
              onClick={() => setChatOpen((value) => !value)}
            >
              <span>💬</span>
              {chatOpen ? "Hide chat" : "Show chat"}
            </button>

            <button
              type="button"
              className="td-live-control td-live-control--leave"
              onClick={onBack}
            >
              <span>↗</span>
              Leave
            </button>
          </div>
        </section>

        {chatOpen && (
          <aside className="td-live-chat">
            <header className="td-live-chat__header">
              <div>
                <h2>Meeting chat</h2>
                <p>Messages in this demo session</p>
              </div>
              <button
                type="button"
                className="td-live-chat__close"
                aria-label="Close chat"
                onClick={() => setChatOpen(false)}
              >
                ×
              </button>
            </header>

            <div className="td-live-chat__messages">
              <p className="td-live-chat__notice">
                Welcome to the meeting. Keep messages relevant to the lesson.
              </p>

              {messages.map((message) => (
                <article className="td-live-message" key={message.id}>
                  <div className="td-live-message__meta">
                    <strong>{message.author}</strong>
                    <time>{message.time}</time>
                  </div>
                  <p>{message.text}</p>
                </article>
              ))}
            </div>

            <form className="td-live-chat__form" onSubmit={sendMessage}>
              <label className="td-sr-only" htmlFor="td-live-chat-input">
                Write a chat message
              </label>
              <textarea
                id="td-live-chat-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Message everyone..."
                rows={2}
              />
              <button
                type="submit"
                className="td-btn td-btn--primary"
                disabled={!draft.trim()}
              >
                Send
              </button>
            </form>
          </aside>
        )}
      </div>
    </main>
  );
}
