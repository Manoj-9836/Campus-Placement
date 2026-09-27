import {
  Home,
  Globe,
  ClipboardList,
  LayoutList,
  Network,
  FileText,
  StickyNote,
  CalendarDays,
  Trophy,
  CircleHelp,
  MessageSquare,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: typeof Home;
};

export type NavSection = {
  heading?: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    items: [{ label: "Home", to: "/", icon: Home }],
  },
  {
    heading: "Profile Tracker",
    items: [{ label: "Portfolio", to: "/portfolio", icon: Globe }],
  },
  {
    heading: "Question Tracker",
    items: [
      { label: "Company Wise Kit", to: "/company-wise-kit", icon: ClipboardList },
      { label: "My Workspace", to: "/workspace", icon: LayoutList },
      { label: "Explore Sheets", to: "/explore-sheets", icon: Network },
      { label: "My Sheets", to: "/my-sheets", icon: FileText },
      { label: "Notes", to: "/notes", icon: StickyNote },
    ],
  },
  {
    heading: "Event Tracker",
    items: [{ label: "Contests", to: "/contests", icon: CalendarDays }],
  },
  {
    heading: "Community",
    items: [{ label: "Leaderboard", to: "/leaderboard", icon: Trophy }],
  },
  {
    heading: "Support",
    items: [
      { label: "Help Center", to: "/help-center", icon: CircleHelp },
      { label: "Feedback", to: "/feedback", icon: MessageSquare },
    ],
  },
];
