// lib/useFocusTimer.js
// A custom hook that owns the Focus Mode timer. It lives in page.js (not in the
// FocusTimer component) so the countdown keeps running when you change views.

import { useState, useEffect, useRef } from "react";

export function useFocusTimer(onSecond) {
  const [len, setLen] = useState(1500);   // session length in seconds
  const [left, setLeft] = useState(1500); // seconds remaining
  const [run, setRun] = useState(false);  // is it counting down?
  const [task, setTask] = useState("");   // id of the task being focused on

  // Keep the latest callback in a ref so the interval never uses an old copy.
  const cb = useRef(onSecond);
  cb.current = onSecond;

  // While running, tick once per second.
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => {
      setLeft((l) => l - 1);
      cb.current(); // tells the page "1 more second of focus time"
    }, 1000);
    return () => clearInterval(id);
  }, [run]);

  // When the countdown reaches zero, stop and reset.
  useEffect(() => {
    if (run && left <= 0) {
      setRun(false);
      setLeft(len);
    }
  }, [left, run, len]);

  return {
    len, left, run, task, setTask,
    toggle: () => setRun((r) => !r),
    reset: () => { setRun(false); setLeft(len); },
    setMinutes: (m) => { setRun(false); setLen(m * 60); setLeft(m * 60); },
  };
}
