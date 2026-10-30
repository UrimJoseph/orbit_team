// components/Dashboard.jsx
// The overview screen: four stat cards, priority tasks, a 7-day chart,
// the Focus mode card and progress per project.
//
// Props:
//   tasks, focus      all tasks, and the focus-seconds log ({ "2026-10-30": 900, ... })
//   timer             the focus timer (passed on to FocusTimer)
//   onOpen(task)      open the edit dialog
//   onProject(name)   jump to that project's task list

import FocusTimer from "./FocusTimer";
import { today, addDays, nice, cap, byUrgency, dueLabel } from "../lib/helpers";

const css = `
.g4,.g3{display:grid;gap:14px;margin-bottom:14px}
.g4{grid-template-columns:repeat(4,1fr)}
.g3{grid-template-columns:1.1fr 1.3fr .9fr}
.g4 .card{border-top:3px solid var(--blue)}
.g4 .card:nth-child(2){border-top-color:var(--green)}
.g4 .card:nth-child(3){border-top-color:var(--purple)}
.g4 .card:nth-child(4){border-top-color:var(--orange)}
.stat{display:flex;flex-direction:column;gap:6px}
.stat b{font-size:38px;font-weight:600;line-height:1}
.stat .row{display:flex;justify-content:space-between;align-items:flex-end;gap:8px}
.mini{display:flex;align-items:flex-end;gap:3px;height:46px}
.mini i{width:9px;border-radius:3px;background:var(--line)}.mini i.hi{background:var(--green)}
.bars{display:flex;align-items:flex-end;gap:10px;height:170px}
.bars div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:6px;font-size:12px;color:var(--mut)}
.bars i{width:100%;border-radius:8px 8px 4px 4px;background:var(--line);min-height:4px}
.bars i.hi{background:linear-gradient(var(--blue2),var(--blue))}
.pt{display:flex;flex-direction:column;gap:8px}
.prow{background:var(--bg);border-radius:12px;padding:10px 12px;cursor:pointer;border:0;text-align:left;width:100%}
.prow h4{font-size:14px;font-weight:500;margin-top:4px}
.projrow{display:grid;grid-template-columns:150px 1fr 60px;gap:12px;align-items:center;padding:8px 0;font-size:14px}
@media(max-width:1000px){.g4{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr}}
@media(max-width:760px){.g4{grid-template-columns:1fr}.projrow{grid-template-columns:100px 1fr 44px}}
`;

export default function Dashboard({ tasks, focus, timer, onOpen, onProject }) {
  // ----- numbers for the stat cards -----
  const t0 = today();
  const done = tasks.filter((t) => t.status === "done");
  const open = tasks.filter((t) => t.status !== "done");

  const days = [...Array(7)].map((_, i) => addDays(t0, i - 6));              // last 7 days
  const perDay = days.map((d) => done.filter((t) => t.doneAt === d).length); // completed per day
  const max = Math.max(1, ...perDay);
  const thisWeek = perDay.reduce((a, b) => a + b, 0);
  const lastWeek = done.filter((t) => t.doneAt >= addDays(t0, -13) && t.doneAt <= addDays(t0, -7)).length;
  const delta = thisWeek - lastWeek;

  const rate = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
  const focusMin = Math.round((focus[t0] || 0) / 60);
  const dueNow = open.filter((t) => t.due && t.due <= t0).length;
  const top = [...open].sort(byUrgency).slice(0, 4);
  const projects = [...new Set(tasks.map((t) => t.project).filter(Boolean))];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Row 1: four stat cards */}
      <div className="g4">
        <div className="card stat">
          <h3>Completed this week</h3>
          <div className="row">
            <b>{thisWeek} <span className={delta >= 0 ? "up" : "dn"}>{delta >= 0 ? "▲" : "▼"}</span></b>
            <div className="mini">
              {perDay.map((n, i) => (
                <i key={i} className={i === 6 ? "hi" : ""} style={{ height: Math.max(8, (n / max) * 100) + "%" }} />
              ))}
            </div>
          </div>
          <span className="sub">{delta >= 0 ? "+" : ""}{delta} from last week</span>
        </div>

        <div className="card stat">
          <h3>Completion rate</h3>
          <b>{rate}%</b>
          <div className="bar"><i style={{ width: rate + "%" }} /></div>
          <span className="sub">{done.length} of {tasks.length} tasks finished</span>
        </div>

        <div className="card stat">
          <h3>Focus time today</h3>
          <b>{(focusMin / 60).toFixed(1)} h</b>
          <div className="bar"><i style={{ width: Math.min(100, (focusMin / 120) * 100) + "%", background: "var(--green)" }} /></div>
          <span className="sub">Goal is 2 h a day</span>
        </div>

        <div className="card stat">
          <h3>Due or overdue</h3>
          <b>{dueNow} <span className={dueNow ? "dn" : "up"}>{dueNow ? "▼" : "▲"}</span></b>
          <span className="sub">{dueNow ? "Needs your attention today" : "You are all caught up"}</span>
        </div>
      </div>

      {/* Row 2: priority tasks, weekly chart, focus timer */}
      <div className="g3">
        <div className="card">
          <h3>Priority tasks</h3>
          <div className="pt">
            {top.length === 0 && <div className="empty">No open tasks. Create one to get started.</div>}
            {top.map((t) => (
              <button key={t.id} className="prow" onClick={() => onOpen(t)}>
                <span className={"pill p-" + t.priority}>{cap(t.priority)}</span>
                <h4>{t.title}</h4>
                <div className="meta">{t.project} {dueLabel(t)}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Completed per day</h3>
          <div className="bars">
            {perDay.map((n, i) => (
              <div key={i}>
                {n}
                <i className={n > 0 && n === Math.max(...perDay) ? "hi" : ""} style={{ height: Math.max(3, (n / max) * 80) + "%" }} />
                {nice(days[i], { weekday: "short" })}
              </div>
            ))}
          </div>
        </div>

        <FocusTimer timer={timer} openTasks={open} />
      </div>

      {/* Row 3: progress for each project */}
      <div className="card">
        <h3>By project</h3>
        {projects.length === 0 && <div className="empty">Give a task a project name and it shows up here.</div>}
        {projects.map((p) => {
          const all = tasks.filter((t) => t.project === p);
          const d = all.filter((t) => t.status === "done").length;
          return (
            <div className="projrow" key={p}>
              <button className="ghost" onClick={() => onProject(p)}>{p}</button>
              <div className="bar"><i style={{ width: (d / all.length) * 100 + "%" }} /></div>
              <span className="sub">{d}/{all.length}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
