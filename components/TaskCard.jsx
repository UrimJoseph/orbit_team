// components/TaskCard.jsx
// One task shown as a card. Used by the Board and the Week view.
// Its CSS (.task, .pill, .meta) is shared, so it lives in GlobalStyles.jsx.
//
// Props:
//   task     the task object
//   onOpen   called when the card is clicked (opens the edit dialog)

import { cap, dueLabel, today } from "../lib/helpers";

export default function TaskCard({ task, onOpen }) {
  const done = task.status === "done";
  const late = task.due && task.due < today() && !done;

  return (
    <article
      className={"card task" + (done ? " done" : "")}
      draggable
      // Store the task id so the drop zone knows which task was dragged.
      onDragStart={(e) => e.dataTransfer.setData("text/plain", String(task.id))}
      onClick={() => onOpen(task)}
    >
      <span className={"pill p-" + task.priority}>{cap(task.priority)}</span>
      <h4>{task.title}</h4>
      <div className="meta">
        {task.project && <span>{task.project}</span>}
        {task.due && <span className={late ? "late" : ""}>{dueLabel(task)}</span>}
      </div>
    </article>
  );
}
