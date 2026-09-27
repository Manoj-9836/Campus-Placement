/**
 * FRONTEND-ONLY MOCK DATA
 * -----------------------
 * BACKEND PLACEHOLDER: every export here stands in for an API response.
 * Replace each with a real fetch / server function later, e.g.
 *   const { data } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile })
 */

export const currentUser = {
  name: "Manoj Kumar",
  handle: "@Manoj502",
  location: "India",
  institution: "Lendi Institute of Engineering and Technology",
  about: "Aspiring software engineer. DSA + full-stack. Consistency over intensity.",
  avatar: "",
  streak: 2,
  globalRank: 27965,
  cScore: 612.65,
  profileViews: 0,
  visibility: "public" as "public" | "private",
};

export const platformStats = [
  { name: "LeetCode", handle: "manoj502", connected: true, solved: 412, rating: 1687 },
  { name: "CodeChef", handle: "manoj_502", connected: true, solved: 96, rating: 1542 },
  { name: "Codeforces", handle: "manoj502", connected: false, solved: 0, rating: 0 },
  { name: "GeeksforGeeks", handle: "manoj502", connected: true, solved: 143, rating: 0 },
];

export const developmentStats = [
  { name: "GitHub", handle: "manoj502", connected: true, repos: 34, contributions: 612 },
];

export const questionSplit = [
  { label: "Easy", value: 186, color: "var(--color-success)" },
  { label: "Medium", value: 342, color: "var(--color-warning)" },
  { label: "Hard", value: 123, color: "var(--color-destructive)" },
];

export const topicStats = [
  { topic: "Arrays", count: 100 },
  { topic: "String", count: 52 },
  { topic: "Two Pointers", count: 41 },
  { topic: "Sorting", count: 40 },
  { topic: "HashMap and Set", count: 30 },
  { topic: "Binary Search", count: 29 },
  { topic: "Math", count: 20 },
  { topic: "Matrix", count: 18 },
  { topic: "Dynamic Programming", count: 18 },
  { topic: "Greedy Algorithms", count: 15 },
];

export const contestRatings = [
  { month: "Mar", rating: 1420 },
  { month: "Apr", rating: 1468 },
  { month: "May", rating: 1512 },
  { month: "Jun", rating: 1495 },
  { month: "Jul", rating: 1580 },
  { month: "Aug", rating: 1687 },
];

export const awards = [
  { title: "100 Days Streak", subtitle: "Consistency badge" },
  { title: "Knight", subtitle: "LeetCode rating 1850+" },
  { title: "3★ CodeChef", subtitle: "Division 2" },
];

export const heatmap = Array.from({ length: 26 * 7 }, (_, i) => ({
  day: i,
  count: Math.max(0, Math.round(Math.sin(i / 7) * 3 + (i % 5) - 1)),
}));

export const sheets = [
  {
    id: "striver-a2z",
    title: "Strivers A2Z DSA Course Sheet",
    author: "Raj Vikramaditya",
    followers: 36002,
    questions: 455,
    progress: 5,
    tags: ["Complete DSA", "Popular"],
    description:
      "This course is made for people who want to learn DSA from A to Z for free in a well-organised manner.",
  },
  {
    id: "striver-sde",
    title: "Striver SDE Sheet",
    author: "Raj Vikramaditya",
    followers: 13559,
    questions: 191,
    progress: 6,
    tags: ["Quick Revision", "Popular"],
    description: "Striver SDE Sheet contains very handily crafted and picked top coding interview questions.",
  },
  {
    id: "love-babbar",
    title: "Love Babbar DSA Sheet",
    author: "Love Babbar",
    followers: 8851,
    questions: 445,
    progress: 1,
    tags: ["Complete DSA"],
    description: "The DSA sheet by Love Babbar is designed to cover almost every concept in Data Structures.",
  },
  {
    id: "neetcode-150",
    title: "Neetcode 150",
    author: "Navdeep Singh",
    followers: 6261,
    questions: 150,
    progress: 11,
    tags: ["Topic Specific", "Popular"],
    description: "The Neetcode 150 sheet, curated by Navdeep Singh, is a popular and beginner-friendly list.",
  },
  {
    id: "top-interview-150",
    title: "Top Interview 150",
    author: "LeetCode",
    followers: 5193,
    questions: 150,
    progress: 12,
    tags: ["Quick Revision"],
    description: "The Top 150 sheet, curated by LeetCode, features the most frequently asked interview questions.",
  },
  {
    id: "blind-75",
    title: "Blind 75",
    author: "Community",
    followers: 4382,
    questions: 75,
    progress: 4,
    tags: ["Quick Revision", "Competitive"],
    description: "The Blind 75 sheet includes a curated list of 75 frequently asked LeetCode questions.",
  },
];

export const sheetFilters = ["Company Wise", "All", "Popular", "Quick Revision", "Complete DSA", "Topic Specific", "Competitive"];

export type Question = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: string;
  topics: string[];
  status: "Solved" | "Attempted" | "Todo";
  notes: boolean;
  solvedAt: string;
};

export const questions: Question[] = [
  { id: "q1", title: "Two Sum", difficulty: "Easy", platform: "LeetCode", topics: ["Arrays", "HashMap"], status: "Solved", notes: true, solvedAt: "2026-08-22" },
  { id: "q2", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", platform: "LeetCode", topics: ["String", "Two Pointers"], status: "Solved", notes: false, solvedAt: "2026-08-21" },
  { id: "q3", title: "Median of Two Sorted Arrays", difficulty: "Hard", platform: "LeetCode", topics: ["Binary Search"], status: "Attempted", notes: true, solvedAt: "2026-08-20" },
  { id: "q4", title: "Merge Intervals", difficulty: "Medium", platform: "LeetCode", topics: ["Sorting", "Arrays"], status: "Solved", notes: false, solvedAt: "2026-08-19" },
  { id: "q5", title: "Word Ladder", difficulty: "Hard", platform: "LeetCode", topics: ["Graphs", "BFS"], status: "Todo", notes: false, solvedAt: "-" },
  { id: "q6", title: "Rod Cutting", difficulty: "Medium", platform: "CodeChef", topics: ["Dynamic Programming"], status: "Solved", notes: true, solvedAt: "2026-08-18" },
  { id: "q7", title: "Rotate Matrix", difficulty: "Medium", platform: "GeeksforGeeks", topics: ["Matrix"], status: "Solved", notes: false, solvedAt: "2026-08-17" },
  { id: "q8", title: "Valid Parentheses", difficulty: "Easy", platform: "LeetCode", topics: ["Stack"], status: "Solved", notes: false, solvedAt: "2026-08-16" },
  { id: "q9", title: "Course Schedule", difficulty: "Medium", platform: "LeetCode", topics: ["Graphs", "Topological Sort"], status: "Attempted", notes: false, solvedAt: "2026-08-15" },
  { id: "q10", title: "Trapping Rain Water", difficulty: "Hard", platform: "LeetCode", topics: ["Two Pointers"], status: "Todo", notes: true, solvedAt: "-" },
];

export const companies = [
  { name: "Google", questions: 512, roles: ["SDE", "SDE Intern"], difficulty: "Hard" },
  { name: "Amazon", questions: 486, roles: ["SDE 1", "Intern"], difficulty: "Medium" },
  { name: "Microsoft", questions: 431, roles: ["SDE", "Intern"], difficulty: "Medium" },
  { name: "Meta", questions: 298, roles: ["E3", "Intern"], difficulty: "Hard" },
  { name: "Adobe", questions: 214, roles: ["MTS 1"], difficulty: "Medium" },
  { name: "Atlassian", questions: 168, roles: ["SDE 1"], difficulty: "Medium" },
  { name: "Uber", questions: 152, roles: ["SDE 1"], difficulty: "Hard" },
  { name: "Flipkart", questions: 141, roles: ["SDE 1"], difficulty: "Medium" },
];

export const contests = [
  { id: "c1", name: "Logical Reasoning (Part 3)", platform: "Unstop", start: "12:00 AM", end: "12:00 AM", day: "Tomorrow", date: "2026-08-26", subscribers: 55, accent: "success" },
  { id: "c2", name: "Starters 253", platform: "CodeChef", start: "8:00 PM", end: "10:00 PM", day: "Tomorrow", date: "2026-08-27", subscribers: 47, accent: "destructive" },
  { id: "c3", name: "13th Asprova Programming Contest (AtCoder)", platform: "AtCoder", start: "11:30 AM", end: "3:30 PM", day: "29 Aug 2026", date: "2026-08-29", subscribers: 14, accent: "info" },
  { id: "c4", name: "Weekly Contest 462", platform: "LeetCode", start: "5:30 PM", end: "7:10 PM", day: "30 Aug 2026", date: "2026-08-30", subscribers: 231, accent: "warning" },
  { id: "c5", name: "Codeforces Round 1042 (Div. 2)", platform: "Codeforces", start: "8:05 PM", end: "10:05 PM", day: "31 Aug 2026", date: "2026-08-31", subscribers: 92, accent: "primary" },
  { id: "c6", name: "Biweekly Contest 141", platform: "LeetCode", start: "8:00 PM", end: "9:30 PM", day: "5 Sep 2026", date: "2026-09-05", subscribers: 188, accent: "warning" },
  { id: "c7", name: "Starters 254", platform: "CodeChef", start: "8:00 PM", end: "10:00 PM", day: "9 Sep 2026", date: "2026-09-09", subscribers: 61, accent: "destructive" },
  { id: "c8", name: "AtCoder Beginner Contest 401", platform: "AtCoder", start: "5:30 PM", end: "7:10 PM", day: "12 Sep 2026", date: "2026-09-12", subscribers: 33, accent: "info" },
];


export const leaderboard = [
  { rank: 1, name: "Pratham Lashkari", handle: "@Pratham", institution: "Sushila Devi Bansal College of Technology", cScore: 889.42, questions: 3120, leetcode: 2410, codeforces: 1980 },
  { rank: 2, name: "Tejas Nalawade", handle: "@tejas_nalawade", institution: "Dr DY Patil Institute of Technology", cScore: 888.94, questions: 3011, leetcode: 2380, codeforces: 1902 },
  { rank: 3, name: "Raj Roy", handle: "@RkRoy", institution: "National Institute of Technology Silchar", cScore: 888.44, questions: 2984, leetcode: 2298, codeforces: 1955 },
  { rank: 4, name: "Aditi Sharma", handle: "@aditis", institution: "IIT Kanpur", cScore: 872.1, questions: 2790, leetcode: 2265, codeforces: 1840 },
  { rank: 5, name: "Vikram Rao", handle: "@vikramr", institution: "BITS Pilani", cScore: 866.5, questions: 2701, leetcode: 2201, codeforces: 1799 },
  { rank: 6, name: "Sneha Iyer", handle: "@snehai", institution: "VIT Vellore", cScore: 851.3, questions: 2588, leetcode: 2150, codeforces: 1710 },
  { rank: 7, name: "Karan Mehta", handle: "@karanm", institution: "NIT Trichy", cScore: 840.8, questions: 2460, leetcode: 2088, codeforces: 1688 },
];

export const notes = [
  { id: "n1", title: "Sliding Window template", question: "Longest Substring Without Repeating Characters", updated: "2 days ago", body: "Expand right, shrink left while invalid. Track best window size. Works for all 'longest/shortest subarray with condition' problems." },
  { id: "n2", title: "Binary search on answer", question: "Median of Two Sorted Arrays", updated: "3 days ago", body: "When the answer is monotonic, binary search over the answer space instead of indices." },
  { id: "n3", title: "DP state design", question: "Rod Cutting", updated: "1 week ago", body: "Define dp[i] = best value using first i units. Transition over every cut length." },
];

export const generalNotes = [
  { id: "g1", title: "Interview checklist", updated: "Yesterday", body: "Clarify constraints, state brute force, optimise, dry run, complexity, edge cases." },
  { id: "g2", title: "System design basics", updated: "5 days ago", body: "Requirements, estimation, API, data model, high-level design, deep dive, bottlenecks." },
];

export const faqs = [
  { q: "How is the C Score calculated?", a: "It is a balanced measure out of 900 combining DSA problem solving, competitive programming ratings and development activity." },
  { q: "How do I connect my coding platforms?", a: "Open Edit Profile > Platform and add your handles. Stats refresh automatically once a backend is connected." },
  { q: "Can I make my profile private?", a: "Yes. Edit Profile > Visibility lets you switch between Public and Private." },
  { q: "How often do stats refresh?", a: "Every few hours, and you can trigger a manual refresh from the Portfolio page." },
  { q: "Is Codolio free?", a: "All core trackers are free. Company Wise Kit includes premium curated sets." },
];
