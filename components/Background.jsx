// components/Background.jsx
// The animated backdrop: three blurred colour blobs drifting slowly over a faint grid.
// It is fixed behind everything (z-index -1) and ignores the mouse.

const css = `
.bg{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none}
.bg i{position:absolute;border-radius:50%;filter:blur(80px);opacity:.5;animation:drift 22s ease-in-out infinite alternate}
.bg i:nth-child(1){width:46vmax;height:46vmax;background:#4aa3ff;top:-14vmax;left:-8vmax}
.bg i:nth-child(2){width:40vmax;height:40vmax;background:#c084fc;right:-10vmax;top:8vmax;animation-duration:28s;animation-delay:-6s}
.bg i:nth-child(3){width:36vmax;height:36vmax;background:#34d399;bottom:-14vmax;left:28vw;opacity:.38;animation-duration:32s;animation-delay:-12s}
.bg::after{content:"";position:absolute;inset:0;
background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
background-size:44px 44px;opacity:.4;
mask-image:radial-gradient(ellipse at 50% 30%,#000,transparent 75%);-webkit-mask-image:radial-gradient(ellipse at 50% 30%,#000,transparent 75%)}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .bg i{opacity:.26}}
:root[data-theme="dark"] .bg i{opacity:.26}
@keyframes drift{to{transform:translate(8vmax,6vmax) scale(1.15)}}
`;

export default function Background() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="bg" aria-hidden="true">
        <i></i><i></i><i></i>
      </div>
    </>
  );
}
