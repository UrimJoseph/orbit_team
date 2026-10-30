// components/TaskList.jsx
// The "All tasks" list. Each row has a checkbox, the title, and a priority pill.
// The checkbox only ASKS to complete a task (page.js shows the confirmation);
// once a task is completed its checkbox is locked.
//
// Props: tasks (already filtered + sorted), query, onOpen(task), onComplete(task)

import { cap, dueLabel } from "../lib/helpers";

const css = `
.list{display:flex;flex-direction:column;gap:8px}
.lrow{display:flex;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 14px}
.lrow input{width:20px;height:20px;accent-color:var(--blue)}
.lrow .t{flex:1;cursor:pointer;min-width:0}
.lrow .t.done .ttl{text-decoration:line-through;color:var(--mut)}
.lrow .meta{margin-top:2px}
`;

export default function TaskList({ tasks, query, onOpen, onComplete }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="list">
        {tasks.length === 0 && (
          <div className="empty">{query ? "No tasks match your search." : "Nothing here yet. Create your first task."}</div>
        )}
        {tasks.map((t) => {
          const done = t.status === "done";
          return (
            <div className="lrow" key={t.id}>
              <input
                type="checkbox"
                checked={done}
                disabled={done}
                title={done ? "Completed tasks stay completed" : "Mark as completed"}
                aria-label="Mark complete"
                // Controlled checkbox: it only becomes checked after the user confirms.
                onChange={() => onComplete(t)}
              />
              <div className={"t" + (done ? " done" : "")} onClick={() => onOpen(t)}>
                <div className="ttl">{t.title}</div>
                <div className="meta">
                  {t.project && <span>{t.project}</span>}
                  <span>{dueLabel(t)}</span>
                </div>
              </div>
              <span className={"pill p-" + t.priority}>{cap(t.priority)}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
