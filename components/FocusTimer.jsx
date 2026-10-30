// components/FocusTimer.jsx
// The blue "Focus mode" card: pick a task, pick a length, start/pause/reset.
// The countdown itself is handled by the useFocusTimer hook (see page.js);
// this component only displays it.
//
// Props:
//   timer       object returned by useFocusTimer()
//   openTasks   tasks that are not completed (for the dropdown)

import { fmtTime } from "../lib/helpers";

const css = `
.focus{background:linear-gradient(135deg,#2b8bff,#7c5cff,#1260e8,#2b8bff);background-size:300% 300%;animation:flow 14s ease infinite;
color:#fff;border:0;text-align:center;display:flex;flex-direction:column;gap:12px}
@keyframes flow{50%{background-position:100% 100%}}
.focus h3{margin:0}
.focus select{background:#ffffff26;border:0;border-radius:10px;padding:8px;color:#fff;width:100%}
.focus option{color:#16181d}
.ringbox{position:relative;width:150px;height:150px;margin:0 auto}
.ringbox svg{width:100%;height:100%;transform:rotate(-90deg)}
.ringbox span{position:absolute;inset:0;display:grid;place-items:center;font-size:32px;font-weight:600}
.focus .btn{background:#fff;color:#1260e8}
.focus .row{display:flex;gap:8px}.focus .row>*{flex:1}
.focus .ghost{color:#fff;border-color:#ffffff66}
`;

const C = 2 * Math.PI * 66; // circumference of the progress ring

export default function FocusTimer({ timer, openTasks }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="card focus">
        <h3>Focus mode</h3>

        <select value={timer.task} onChange={(e) => timer.setTask(e.target.value)} aria-label="Task to focus on">
          <option value="">Free focus session</option>
          {openTasks.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>

        <div className="ringbox">
          <svg viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="66" fill="none" stroke="#ffffff40" strokeWidth="8" />
            <circle
              cx="75" cy="75" r="66" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - timer.left / timer.len)}
            />
          </svg>
          <span>{fmtTime(timer.left)}</span>
        </div>

        <select value={timer.len / 60} onChange={(e) => timer.setMinutes(+e.target.value)} aria-label="Session length">
          {[15, 25, 50].map((m) => (
            <option key={m} value={m}>{m} minutes</option>
          ))}
        </select>

        <div className="row">
          <button className="btn" onClick={timer.toggle}>{timer.run ? "Pause" : "Start"}</button>
          <button className="ghost" onClick={timer.reset}>Reset</button>
        </div>
      </div>
    </>
  );
}
