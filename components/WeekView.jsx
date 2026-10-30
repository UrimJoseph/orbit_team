// components/WeekView.jsx
// Monday-to-Sunday planner. Each task sits on its due date;
// drag a card onto another day to reschedule it.
//
// Props: tasks (filtered), onOpen(task), onMove(id, kind, value)

import { useState } from "react";
import TaskCard from "./TaskCard";
import { today, addDays, nice, byUrgency } from "../lib/helpers";

const css = `
.weekhint{margin-bottom:10px}
.week{display:grid;grid-template-columns:repeat(7,minmax(130px,1fr));gap:10px;overflow-x:auto}
.day{background:color-mix(in srgb,var(--side) 55%,transparent);backdrop-filter:blur(10px);border:1px solid var(--line);
border-radius:16px;padding:10px;min-height:260px;display:flex;flex-direction:column;gap:8px}
.day.over{outline:2px dashed var(--blue)}
.day h4{font-size:13px;color:var(--mut);font-weight:500}
.day.now h4{color:var(--blue);font-weight:700}
`;

export default function WeekView({ tasks, onOpen, onMove }) {
  const [over, setOver] = useState(null);

  // Find this week's Monday (getDay(): Sunday = 0, so shift by 6 and wrap).
  const monday = addDays(today(), -((new Date().getDay() + 6) % 7));
  const days = [...Array(7)].map((_, i) => addDays(monday, i));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <p className="sub weekhint">Drag a task onto a day to reschedule it.</p>
      <div className="week">
        {days.map((day) => (
          <section
            key={day}
            className={"day" + (day === today() ? " now" : "") + (over === day ? " over" : "")}
            onDragOver={(e) => { e.preventDefault(); setOver(day); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(null);
              onMove(Number(e.dataTransfer.getData("text/plain")), "due", day);
            }}
          >
            <h4>{nice(day, { weekday: "short", day: "numeric" })}</h4>
            {tasks.filter((t) => t.due === day).sort(byUrgency).map((t) => (
              <TaskCard key={t.id} task={t} onOpen={onOpen} />
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
