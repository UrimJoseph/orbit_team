// components/HelpDialog.jsx
// The help guide: a popup with tap-to-open sections explaining how to use the app.
//
// Props: open, onClose()

import { useEffect, useRef } from "react";

const css = `
#help-guide{width:min(560px,94vw);max-height:86vh;overflow:auto}
#help-guide h2{font-size:22px;margin-bottom:4px}
#help-guide>p{color:var(--mut);margin-bottom:12px}
#help-guide details{border-top:1px solid var(--line);padding:10px 0}
#help-guide summary{cursor:pointer;font-weight:600}
#help-guide details p{color:var(--mut);margin-top:6px;font-size:14px}
#help-guide kbd{background:var(--bg);border:1px solid var(--line);border-radius:5px;padding:0 6px;font:inherit;font-size:13px}
#help-guide .btn{width:100%;margin-top:12px}
`;

// Each section: [title, text]. Edit this list to change the guide.
const sections = [
  ["Create a task", <>Press <b>Create task</b> (or the <kbd>N</kbd> key). Add a title, then choose a priority, status, due date and project. Click <b>Save task</b>. Click any task later to edit or delete it.</>],
  ["Dashboard", "Your overview: tasks completed this week, completion rate, focus time today and what is due. Priority tasks shows what to do next, and By project shows how far along each project is."],
  ["Board", <>Three columns: To do, In progress and Completed. Drag a card from one column to the next as work moves along. The <b>+</b> on a column adds a task straight into it.</>],
  ["Week", "Every task sits on its due date, Monday to Sunday. Drag a task onto another day to reschedule it. Today is highlighted in blue."],
  ["All tasks and search", "A simple list of everything, with open tasks first. Type in the search box at the top to find a task by its title or project."],
  ["Projects", "Type the same project name on several tasks and it appears in the left menu. Click the name to see only that project’s tasks."],
  ["Focus mode", <>On the Dashboard, pick a task, choose 15, 25 or 50 minutes and press <b>Start</b>. You can pause or reset at any time. Time spent focusing is added to your focus time for today.</>],
  ["Completing tasks", "You will always be asked to confirm before a task is marked completed. Completed tasks can’t be changed back to not completed, so only confirm when the work is truly done. You can still edit a completed task’s details or delete it."],
  ["Your data and shortcuts", <>Your tasks are saved in this browser on this device only. Clearing browser data removes them, and they won’t appear on another device. Shortcuts: <kbd>N</kbd> creates a task and <kbd>Esc</kbd> closes any popup. Use <b>Switch theme</b> in the left menu for light or dark mode.</>],
];

export default function HelpDialog({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <dialog id="help-guide" ref={ref} onClose={onClose}>
        <h2>Welcome to Bright Edge Tasks</h2>
        <p>A quick tour of how everything works. Tap a heading to open it.</p>
        {sections.map(([title, body], i) => (
          <details key={title} open={i === 0}>
            <summary>{title}</summary>
            <p>{body}</p>
          </details>
        ))}
        <button className="btn" onClick={onClose}>Got it</button>
      </dialog>
    </>
  );
}
