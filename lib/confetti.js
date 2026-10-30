// lib/confetti.js
// Fires a short burst of coloured pieces when a task is confirmed as completed.
// The animation itself (.cf and @keyframes pop) lives in components/ConfirmDialog.jsx.

export function confetti() {
  const colors = ["#1d7bff", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6"];
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("span");
    piece.className = "cf";
    piece.style.cssText = `left:${42 + Math.random() * 16}vw;background:${colors[i % 5]};--x:${(Math.random() - 0.5) * 60}vw;--r:${Math.random() * 720}deg;animation-delay:${Math.random() * 0.15}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1700); // clean up after the animation
  }
}
