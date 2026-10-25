import type { QnaReportItem } from "../types/course";

export const MOCK_QA_REPORTS: QnaReportItem[] = [
  {
    id: "qa-1",
    kind: "report",
    title: "Spam in course discussion",
    status: "unresolved",
    author: "Alex Nguyen",
    anonymous: false,
    className: "Class 10A",
    courseTitle: "Introduction to Programming",
    lessonTitle: "Variables and Data Types",
    content:
      "I found repeated promotional messages in the course discussion. Could a teacher review them?",
    createdAt: "2026-10-23T08:30:00",
    replies: [],
  },
  {
    id: "qa-2",
    kind: "report",
    title: "Dishonest submission",
    status: "unresolved",
    author: "Student",
    anonymous: true,
    className: "Class 10B",
    courseTitle: "Introduction to Programming",
    lessonTitle: "Assignment 1",
    content:
      "I would like to report a possible issue with a submission. Please review it privately.",
    createdAt: "2026-10-23T10:15:00",
    replies: [
      {
        id: "qa-reply-1",
        author: "Teacher",
        message:
          "Thank you for raising this. I will review the submission and follow up appropriately.",
        createdAt: "2026-10-23T11:00:00",
      },
    ],
  },
  {
    id: "qa-3",
    kind: "question",
    title: "How should I submit my assignment?",
    status: "resolved",
    author: "Minh Tran",
    anonymous: false,
    className: "Class 11A",
    courseTitle: "Web Development",
    lessonTitle: "Assignment 2",
    content:
      "Should we upload the source files individually, or submit them in one ZIP file?",
    createdAt: "2026-10-22T13:20:00",
    replies: [
      {
        id: "qa-reply-2",
        author: "Teacher",
        message:
          "Please submit one ZIP file containing your source files and a short README.",
        createdAt: "2026-10-22T14:00:00",
      },
    ],
  },
  {
    id: "qa-4",
    kind: "question",
    title: "Question about the lesson material",
    status: "unresolved",
    author: "Student",
    anonymous: true,
    className: "Class 11B",
    courseTitle: "Web Development",
    lessonTitle: "HTML and CSS",
    content:
      "I am having trouble understanding the layout example. Could you provide another explanation?",
    createdAt: "2026-10-24T09:05:00",
    replies: [],
  },
];
