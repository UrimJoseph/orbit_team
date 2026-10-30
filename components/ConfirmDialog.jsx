// components/ConfirmDialog.jsx
// The small "Are you sure you have completed this task?" popup.
// It also holds the confetti piece styles used by lib/confetti.js.
//
// Props: open, onYes(), onNo()

import { useEffect, useRef } from "react";

const css = `
#confirm-done{width:min(340px,90vw);text-align:center}
#confirm-done p:first-child{font-size:17px;font-weight:600;margin-bottom:6px}
#confirm-done .row{display:flex;gap:8px;margin-top:16px}
#confirm-done .row>*{flex:1}
.cf{position:fixed;top:45vh;width:9px;height:14px;border-radius:2px;z-index:99;pointer-events:none;animation:pop 1.3s ease-out forwards}
@keyframes pop{to{transform:translate(var(--x),38vh) rotate(var(--r));opacity:0}}
`;

export default function ConfirmDialog({ open, onYes, onNo }) {
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
      {/* onClose also fires when the user presses Esc, which counts as "Not yet" */}
      <dialog id="confirm-done" ref={ref} onClose={onNo}>
        <p>Are you sure you have completed this task?</p>
        <p className="sub">Once confirmed, it can’t be marked as not completed.</p>
        <div className="row">
          <button className="btn" type="button" onClick={onYes}>Yes, completed</button>
          <button className="ghost" type="button" onClick={onNo}>Not yet</button>
        </div>
      </dialog>
    </>
  );
}
