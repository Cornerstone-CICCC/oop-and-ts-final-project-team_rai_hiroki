import type { Task } from "@/types";

export const DUMMY_TASKS: Task[] = [
  {
    id: "task-1",
    category: "DESIGN SYSTEM",
    categoryColorClassName: "bg-green-500",
    title: "Hero section",
    content:
      "Create a design system for a hero section in 2 different variants. Create a simple presentation with these components.",
    assignees: [
      { id: "user-vh", initials: "VH", colorClassName: "bg-blue-600" },
      { id: "user-ag", initials: "AG", colorClassName: "bg-orange-400" },
    ],
    status: "To Do",
  },
  {
    id: "task-2",
    category: "TYPOGRAPHY",
    categoryColorClassName: "bg-sky-400",
    title: "Typography change",
    content:
      "Modify typography and styling of text placed on 6 screens of the website design. Prepare a documentation.",
    assignees: [{ id: "user-ml", initials: "ML", colorClassName: "bg-pink-500" }],
    status: "To Do",
  },
  {
    id: "task-3",
    category: "DEVELOPMENT",
    categoryColorClassName: "bg-pink-500",
    title: "Implement design screens",
    content:
      "Our designers created 6 screens for a website that needs to be implemented by our dev team.",
    assignees: [
      { id: "user-vh", initials: "VH", colorClassName: "bg-blue-600" },
      { id: "user-lk", initials: "LK", colorClassName: "bg-green-500" },
    ],
    status: "In Progress",
  },
  {
    id: "task-4",
    category: "DEVELOPMENT",
    categoryColorClassName: "bg-pink-500",
    title: "Fix bugs in the CSS code",
    content:
      "Fix small bugs that are essential to prepare for the next release that will happen this quarter.",
    assignees: [
      { id: "user-hu", initials: "HU", colorClassName: "bg-pink-500" },
      { id: "user-vh", initials: "VH", colorClassName: "bg-orange-400" },
    ],
    status: "Done",
  },
  {
    id: "task-5",
    category: "TYPOGRAPHY",
    categoryColorClassName: "bg-sky-400",
    title: "Proofread final text",
    content:
      "The text provided by marketing department needs to be proofread so that we make sure that it fits into our design.",
    assignees: [{ id: "user-ag", initials: "AG", colorClassName: "bg-orange-400" }],
    status: "Done",
  },
  {
    id: "task-6",
    category: "DESIGN SYSTEM",
    categoryColorClassName: "bg-green-500",
    title: "Responsive design",
    content:
      "All designs need to be responsive. The requirement is that it fits all web and mobile screens.",
    assignees: [
      { id: "user-vh", initials: "VH", colorClassName: "bg-blue-600" },
      { id: "user-ag", initials: "AG", colorClassName: "bg-orange-400" },
    ],
    status: "Done",
  },
];
