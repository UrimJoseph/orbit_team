// components/Board.jsx
// Kanban board: To do, In progress, Completed. Drag cards between columns.
// Dropping on "Completed" asks for confirmation (handled by onMove in page.js),
// and cards already in "Completed" can never be dragged back out.
//
// Props:
//   tasks            tasks to show (already filtered by search)
//   onOpen(task)     open the edit dialog
//   onNew(status)    create a task pre-set to that column
//   onMove(id, kind, value)  a card was dropped

import { useState } from "react";
import TaskCard from "./TaskCard";
import { byUrgency } from "../lib/helpers";

const css = `
.cols{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:start}
.col{background:color-mix(in srgb,var(--side) 55%,transparent);backdrop-filter:blur(10px);border:1px solid var(--line);
border-radius:18px;padding:12px;display:flex;flex-direction:column;gap:10px;min-height:220px}
.col.over{outline:2px dashed var(--blue)}
.col h3{display:flex;align-items:center;gap:8px;font-size:15px;margin:2px 4px}
.col h3 button{margin-left:auto;background:none;border:0;font-size:20px;color:var(--mut)}
.addrow{border:1px dashed var(--line);background:none;border-radius:12px;padding:9px;color:var(--mut)}
@media(max-width:1000px){.cols{grid-template-columns:1fr}}
`;

const columns = [
  ["todo", "To do", "var(--red)"],
  ["progress", "In progress", "var(--orange)"],
  ["done", "Completed", "var(--green)"],
];

export default function Board({ tasks, onOpen, onNew, onMove }) {
  const [over, setOver] = useState(null); // which column is being dragged over

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="cols">
        {columns.map(([key, name, color]) => {
          const items = tasks.filter((t) => t.status === key).sort(byUrgency);
          return (
            <section
              key={key}
              className={"col" + (over === key ? " over" : "")}
              onDragOver={(e) => { e.preventDefault(); setOver(key); }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(null);
                onMove(Number(e.dataTransfer.getData("text/plain")), "status", key);
              }}
            >
              <h3>
                <span className="dot" style={{ background: color }} />
                {name} <span className="sub">{items.length}</span>
                <button onClick={() => onNew(key)} aria-label={"Add to " + name}>+</button>
              </h3>
              {items.map((t) => <TaskCard key={t.id} task={t} onOpen={onOpen} />)}
              <button className="addrow" onClick={() => onNew(key)}>+ Add task</button>
            </section>
          );
        })}
      </div>
    </>
  );
}
