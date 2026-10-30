"use client";
// app/page.js
// The home page. It owns ALL the app data (state) and renders every component.
// Components never talk to each other directly; they call the functions passed
// to them from here (props), and this file updates the state.
//
// Rules implemented here:
//  - completing a task always asks for confirmation first (askDone)
//  - a completed task can never go back to "not completed" (see moveTask and completeTask)

import { useState, useEffect, useLayoutEffect } from "react";
import GlobalStyles from "../components/GlobalStyles";
import Background from "../components/Background";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";
import Board from "../components/Board";
import WeekView from "../components/WeekView";
import TaskList from "../components/TaskList";
import TaskDialog from "../components/TaskDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import HelpDialog from "../components/HelpDialog";
import { useFocusTimer } from "../lib/useFocusTimer";
import { confetti } from "../lib/confetti";
import { today, byUrgency, withStatus, projectsOf } from "../lib/helpers";

const KEY = "taskboard-v2";
// useLayoutEffect warns during server rendering, so fall back to useEffect there.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Home() {
  // ---------- 1. State ----------
  const [ready, setReady] = useState(false);          // true once saved data is loaded
  const [tasks, setTasks] = useState([]);             // every task
  const [focus, setFocus] = useState({});             // focus seconds per day
  const [view, setView] = useState("dash");           // dash | board | week | list
  const [proj, setProj] = useState("");               // active project filter
  const [query, setQuery] = useState("");             // search text
  const [dlg, setDlg] = useState({ open: false, task: null, status: "todo" }); // task dialog
  const [confirmCb, setConfirmCb] = useState(null);   // function to run if the user confirms
  const [helpOpen, setHelpOpen] = useState(false);
  const [intro, setIntro] = useState(true);           // page-load bounce animation

  // Focus timer: every second it adds 1 to today's focus log.
  const timer = useFocusTimer(() => setFocus((f) => ({ ...f, [today()]: (f[today()] || 0) + 1 })));

  // ---------- 2. Load and save (browser localStorage) ----------
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved) {
        setTasks(saved.tasks || []);
        setFocus(saved.focus || {});
      }
      const theme = localStorage.getItem("taskboard-theme");
      if (theme) document.documentElement.dataset.theme = theme;
      // Show the help guide the very first time someone visits.
      // if (!localStorage.getItem("be-help")) {
      //   localStorage.setItem("be-help", "1");
      //   setHelpOpen(true);
      // }
    } catch (e) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ tasks, focus })); } catch (e) {}
  }, [tasks, focus, ready]);

  // ---------- 3. Page-load bounce animation ----------
  useIsoLayoutEffect(() => {
    if (!ready) return;
    // Give each section a delay so they arrive in a wave.
    document
      .querySelectorAll("aside,header>*,main .card,.col,.day,.lrow,.empty,footer")
      .forEach((el, i) => el.style.setProperty("--i", i));
    const id = setTimeout(() => setIntro(false), 2600);
    return () => clearTimeout(id);
  }, [ready]);

  // ---------- 4. Keyboard shortcut: N creates a task ----------
  useEffect(() => {
    function onKey(e) {
      const typing = e.target.matches && e.target.matches("input,select,textarea");
      if (e.key.toLowerCase() === "n" && !typing && !dlg.open && confirmCb === null && !helpOpen) {
        e.preventDefault();
        openNew("todo");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  // ---------- 5. Actions ----------
  const openNew = (status) => setDlg({ open: true, task: null, status });
  const openTask = (task) => setDlg({ open: true, task, status: task.status });
  const closeDlg = () => setDlg((d) => ({ ...d, open: false }));

  // Ask "are you sure?" and remember what to do if the answer is yes.
  const askDone = (fn) => setConfirmCb(() => fn);
  const markDone = (id) => setTasks((ts) => ts.map((t) => (t.id === id ? withStatus(t, "done") : t)));

  function confirmYes() {
    const fn = confirmCb;
    setConfirmCb(null);
    confetti();
    if (fn) fn();
  }

  // Checkbox in the list: completed tasks are locked, others need confirmation.
  function completeTask(t) {
    if (t.status === "done") return;
    askDone(() => markDone(t.id));
  }

  // Dialog "Save task" (create or edit).
  function saveTask(data, status) {
    const editing = dlg.task;
    const commit = () => {
      if (editing) {
        setTasks((ts) => ts.map((t) => (t.id === editing.id ? withStatus({ ...t, ...data }, status) : t)));
      } else {
        setTasks((ts) => [...ts, withStatus({ id: Date.now(), ...data, doneAt: "", status: "todo" }, status)]);
      }
      closeDlg();
    };
    // Moving a task to Completed always asks first.
    if (status === "done" && (!editing || editing.status !== "done")) askDone(commit);
    else commit();
  }

  function deleteTask() {
    setTasks((ts) => ts.filter((t) => t.id !== dlg.task.id));
    closeDlg();
  }

  // Drag and drop: kind "status" (Board) or "due" (Week).
  function moveTask(id, kind, value) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    if (kind === "due") {
      setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, due: value } : x)));
      return;
    }
    if (t.status === "done" || t.status === value) return;       // completed tasks can’t move back
    if (value === "done") askDone(() => markDone(id));            // needs confirmation
    else setTasks((ts) => ts.map((x) => (x.id === id ? withStatus(x, value) : x)));
  }

  function toggleTheme() {
    const dark = getComputedStyle(document.documentElement).colorScheme === "dark";
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("taskboard-theme", next); } catch (e) {}
  }

  function changeQuery(value) {
    setQuery(value.toLowerCase());
    if (view === "dash") setView("list"); // searching from the dashboard jumps to the list
  }

  // ---------- 6. Work out what to show ----------
  // Wait until saved data is loaded so server and browser render the same thing.
  if (!ready) {
    return (
      <>
        <GlobalStyles />
        <Background />
      </>
    );
  }

  const matches = (t) => (t.title + " " + t.project).toLowerCase().includes(query);
  const visible = tasks.filter(matches);
  const listTasks = visible
    .filter((t) => !proj || t.project === proj)
    .sort((a, b) => (a.status === "done") - (b.status === "done") || byUrgency(a, b));
  const openCount = tasks.filter((t) => t.status !== "done").length;

  const hour = new Date().getHours();
  const titles = {
    dash: hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening",
    board: "Board",
    week: "This week",
    list: proj || "All tasks",
  };

  // ---------- 7. Render every component ----------
  return (
    <>
      <GlobalStyles />
      <Background />

      <div className={"app" + (intro ? " intro" : "")}>
        <Sidebar
          view={view}
          proj={proj}
          projects={projectsOf(tasks)}
          openCount={openCount}
          onNav={(v) => { setView(v); setProj(""); }}
          onProject={(p) => { setView("list"); setProj(p); }}
          onHelp={() => setHelpOpen(true)}
          onTheme={toggleTheme}
        />

        <main>
          <Header
            title={titles[view]}
            query={query}
            onQuery={changeQuery}
            onHelp={() => setHelpOpen(true)}
            onCreate={() => openNew("todo")}
          />

          {view === "dash" && (
            <Dashboard
              tasks={tasks}
              focus={focus}
              timer={timer}
              onOpen={openTask}
              onProject={(p) => { setView("list"); setProj(p); }}
            />
          )}
          {view === "board" && <Board tasks={visible} onOpen={openTask} onNew={openNew} onMove={moveTask} />}
          {view === "week" && <WeekView tasks={visible} onOpen={openTask} onMove={moveTask} />}
          {view === "list" && <TaskList tasks={listTasks} query={query} onOpen={openTask} onComplete={completeTask} />}

          <Footer openCount={openCount} doneCount={tasks.length - openCount} onHelp={() => setHelpOpen(true)} />
        </main>
      </div>

      <TaskDialog
        open={dlg.open}
        task={dlg.task}
        defaultStatus={dlg.status}
        defaultProject={proj}
        projects={projectsOf(tasks)}
        onSave={saveTask}
        onDelete={deleteTask}
        onClose={closeDlg}
      />
      <ConfirmDialog open={confirmCb !== null} onYes={confirmYes} onNo={() => setConfirmCb(null)} />
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
