// lib/helpers.js
// Small pure functions shared by many components. No React in here.

// Turn a Date into "YYYY-MM-DD" using LOCAL time (so it matches <input type="date">).
export const iso = (d) =>
  d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

export const today = () => iso(new Date());

// Add (or subtract) days from a "YYYY-MM-DD" string.
export function addDays(s, n) {
  const d = new Date(s + "T00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
}

// Format a "YYYY-MM-DD" string, e.g. nice(s, { weekday: "short" }) gives "Mon".
export const nice = (s, opts) => new Date(s + "T00:00").toLocaleDateString(undefined, opts);

export const cap = (s) => s[0].toUpperCase() + s.slice(1);

// Sort order: high priority first, then earliest due date.
const rank = { high: 0, medium: 1, low: 2 };
export const byUrgency = (a, b) =>
  rank[a.priority] - rank[b.priority] || (a.due || "9").localeCompare(b.due || "9");

// Friendly text such as "Due today" or "Overdue, 3 Oct".
export function dueLabel(t) {
  if (!t.due) return "";
  if (t.due === today()) return "Due today";
  if (t.due === addDays(today(), 1)) return "Due tomorrow";
  const date = nice(t.due, { day: "numeric", month: "short" });
  return (t.due < today() && t.status !== "done" ? "Overdue, " : "Due ") + date;
}

// Returns a COPY of the task with a new status. Completed tasks remember the day they were finished.
export const withStatus = (t, status) => ({
  ...t,
  status,
  doneAt: status === "done" ? t.doneAt || today() : "",
});

// Unique, sorted list of project names used by the tasks.
export const projectsOf = (tasks) => [...new Set(tasks.map((t) => t.project).filter(Boolean))].sort();

// 1500 seconds -> "25:00"
export const fmtTime = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
