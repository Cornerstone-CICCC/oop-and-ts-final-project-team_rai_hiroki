export type DummyUser = {
  email: string;
  password: string;
  displayName: string;
  bio: string;
};

export const DUMMY_USERS: DummyUser[] = [
  {
    email: "vh@example.com",
    password: "password123",
    displayName: "Victoria Harris",
    bio: "UI/UX Designer with 5 years of experience",
  },
  {
    email: "ag@example.com",
    password: "password123",
    displayName: "Alex Garcia",
    bio: "Frontend Developer passionate about design systems",
  },
  {
    email: "ml@example.com",
    password: "password123",
    displayName: "Maria Lopez",
    bio: "Typography specialist and graphic designer",
  },
  {
    email: "lk@example.com",
    password: "password123",
    displayName: "Liam Kim",
    bio: "Full-stack developer focused on responsive design",
  },
  {
    email: "hu@example.com",
    password: "password123",
    displayName: "Hannah Ueda",
    bio: "CSS expert and accessibility advocate",
  },
];
