// components/TaskDialog.jsx
// Popup form used to create a task or edit an existing one.
// It uses the browser's native <dialog> element: showModal() opens it, close() hides it.
// A task that is already completed has its Status field locked for good.
//
// Props:
//   open              true/false
//   task              the task being edited, or null when creating
//   defaultStatus     status to pre-select for a new task (e.g. the column's "+")
//   defaultProject    project to pre-fill for a new task
//   projects          existing project names (autocomplete suggestions)
//   onSave(data, status), onDelete(), onClose()

import { useEffect, useRef, useState } from "react";

const css = `
.tform{display:grid;gap:10px}
.tform label{display:grid;gap:3px;font-size:13px;color:var(--mut)}
.tform input,.tform select{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:9px;color:var(--ink)}
.tform .row{display:flex;gap:8px;margin-top:6px}
.tform .row .btn{flex:1}
`;

const empty = { title: "", priority: "medium", status: "todo", due: "", project: "" };

export default function TaskDialog({ open, task, defaultStatus, defaultProject, projects, onSave, onDelete, onClose }) {
  const ref = useRef(null);
  const [form, setForm] = useState(empty);
  const locked = !!task && task.status === "done";

  // Open / close the native dialog whenever `open` changes.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Fill the form each time the dialog opens.
  useEffect(() => {
    if (!open) return;
    setForm(
      task
        ? { title: task.title, priority: task.priority, status: task.status, due: task.due || "", project: task.project || "" }
        : { ...empty, status: defaultStatus || "todo", project: defaultProject || "" }
    );
  }, [open, task, defaultStatus, defaultProject]);

  // Small helper: update one field of the form.
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  function submit(e) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    onSave({ title, priority: form.priority, due: form.due, project: form.project.trim() }, form.status);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <dialog ref={ref} onClose={onClose}>
        <form className="tform" onSubmit={submit}>
          <h3>{task ? "Edit task" : "New task"}</h3>
          <label>Title<input value={form.title} onChange={set("title")} required maxLength={140} /></label>
          <label>Priority
            <select value={form.priority} onChange={set("priority")}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>Status
            <select value={form.status} onChange={set("status")} disabled={locked}>
              <option value="todo">To do</option>
              <option value="progress">In progress</option>
              <option value="done">Completed</option>
            </select>
          </label>
          <label>Due date<input type="date" value={form.due} onChange={set("due")} /></label>
          <label>Project
            <input value={form.project} onChange={set("project")} list="project-options" placeholder="e.g. Portfolio" />
          </label>
          <datalist id="project-options">
            {projects.map((p) => <option key={p} value={p} />)}
          </datalist>
          <div className="row">
            <button className="btn" type="submit">Save task</button>
            {task && <button className="ghost" type="button" onClick={onDelete}>Delete</button>}
            <button className="ghost" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
