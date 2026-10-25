export interface TeacherClass {
  id: string;
  name: string;
}

export interface ClassStudent {
  id: string;
  name: string;
  classId: string;
  demoSubmitted: boolean;
}

export const MOCK_CLASSES: TeacherClass[] = [
  { id: "class-10a", name: "Class 10A" },
  { id: "class-10b", name: "Class 10B" },
  { id: "class-11a", name: "Class 11A" },
  { id: "class-11b", name: "Class 11B" },
];

export const MOCK_CLASS_STUDENTS: ClassStudent[] = [
  {
    id: "student-1",
    name: "Alex Nguyen",
    classId: "class-10a",
    demoSubmitted: true,
  },
  {
    id: "student-2",
    name: "Minh Tran",
    classId: "class-10a",
    demoSubmitted: true,
  },
  {
    id: "student-3",
    name: "Linh Pham",
    classId: "class-10a",
    demoSubmitted: false,
  },
  {
    id: "student-4",
    name: "Taylor Le",
    classId: "class-10b",
    demoSubmitted: true,
  },
  {
    id: "student-5",
    name: "An Vu",
    classId: "class-10b",
    demoSubmitted: false,
  },
  {
    id: "student-6",
    name: "Khanh Do",
    classId: "class-10b",
    demoSubmitted: true,
  },
  {
    id: "student-7",
    name: "Bao Ho",
    classId: "class-11a",
    demoSubmitted: false,
  },
  {
    id: "student-8",
    name: "Mai Bui",
    classId: "class-11a",
    demoSubmitted: true,
  },
  {
    id: "student-9",
    name: "Nam Dang",
    classId: "class-11a",
    demoSubmitted: false,
  },
  {
    id: "student-10",
    name: "Vy Phan",
    classId: "class-11b",
    demoSubmitted: true,
  },
  {
    id: "student-11",
    name: "Quan Ly",
    classId: "class-11b",
    demoSubmitted: false,
  },
  {
    id: "student-12",
    name: "Ha Nguyen",
    classId: "class-11b",
    demoSubmitted: true,
  },
];
