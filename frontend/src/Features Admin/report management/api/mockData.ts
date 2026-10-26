import { ReportItem } from '../types';


export const initialReports: ReportItem[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    date: new Date('2026-10-25T12:30:15'),
    flag: "Harassment",
    reportedContent: "\"This is completely unacceptable. The instructor has no idea what they're talking about. I demand a refund for this entire course. This is a total waste of time and money.\"",
    reportedPage: "Q&A Comment",
    reason: "The user is using aggressive language and making personal attacks against the instructor. This violates our community guidelines regarding respect and safety.",
    status: "Pending"
  },
  {
    id: 2,
    name: "David Kim",
    date: new Date('2026-10-25T11:00:00'),
    flag: "Spam",
    reportedContent: "\"Check out my new course on Abc! It's the best way to learn React in 2024. Use my referral link: https://abc.com/course/123456\"",
    reportedPage: "Live Room Chat",
    reason: "This user is repeatedly posting external links to their own courses during the live session, disrupting the Q&A and attempting to self-promote.",
    status: "Pending"
  },
  {
    id: 3,
    name: "Michael Chen",
    date: new Date('2026-10-25T00:00:00'),
    flag: "Repeated disruption",
    reportedContent: "\"I don't think this course is suitable for beginners. The instructor is moving too fast and doesn't explain the basics clearly. I'm really struggling to keep up with the pace.\"",
    reportedPage: "Q&A Comment",
    reason: "The user has posted the same complaint under six different lessons and replied repeatedly to students who asked unrelated questions. Several learners have said the repeated messages are making it difficult to find answers in the Q&A feed. I have included the original comment here for context: critical feedback itself should remain welcome, but the duplicate replies may need moderation. Please review the surrounding thread before deciding whether to warn the author or delete the repeated content.",
    status: "Pending"
  }
];


