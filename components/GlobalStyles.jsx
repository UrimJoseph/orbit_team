// components/GlobalStyles.jsx
// Shared look of the whole app, rendered ONCE in page.js:
//  - colour tokens (light + dark), base page styles
//  - styles reused by many components (cards, pills, buttons, progress bars, task cards)
//  - the page-load "bounce in" animation (active while the .intro class is on .app)
// Each other component keeps the CSS that only it needs inside its own file.

const css = `
:root{--bg:#ececf0;--side:#f7f7f9;--card:#ffffffb3;--solid:#fff;--ink:#16181d;--mut:#737885;--line:#e4e6ec;
--blue:#1d7bff;--blue2:#4aa3ff;--green:#22c55e;--orange:#f59e0b;--pink:#ec4899;--purple:#8b5cf6;--red:#ef4444;
--btn:#16181d;--btnink:#fff;color-scheme:light;box-sizing:border-box;
padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0c0e13;--side:#12151c;--card:#171b24b0;--solid:#171b24;
--ink:#eceef4;--mut:#8b92a5;--line:#262b38;--btn:#eceef4;--btnink:#12151c;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0c0e13;--side:#12151c;--card:#171b24b0;--solid:#171b24;
--ink:#eceef4;--mut:#8b92a5;--line:#262b38;--btn:#eceef4;--btnink:#12151c;color-scheme:dark}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:400 15px/1.45 Outfit,system-ui,sans-serif}
button,input,select{font:inherit;color:inherit}button{cursor:pointer}
:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
h1,h2,h3,h4,p{margin:0}

/* Page shell: sidebar + main column */
.app{display:grid;grid-template-columns:230px 1fr;min-height:100vh}
.app main{padding:22px clamp(14px,3vw,32px);min-width:0}
@media(max-width:760px){.app{grid-template-columns:1fr}}

/* Shared building blocks */
.card{background:var(--card);backdrop-filter:blur(14px);border-radius:18px;padding:16px;border:1px solid var(--line);box-shadow:0 4px 18px #1d2a5a14}
.card h3{font-size:16px;font-weight:600;margin-bottom:12px}
.btn{background:var(--btn);color:var(--btnink);border:0;border-radius:12px;padding:10px 18px;font-weight:500}
.ghost{background:none;border:1px solid var(--line);border-radius:10px;padding:7px 12px;color:var(--mut)}
.dot{width:9px;height:9px;border-radius:50%;flex:none}
.sub{font-size:12px;color:var(--mut)}
.up{color:var(--green);font-size:14px}.dn{color:var(--red);font-size:14px}
.bar{height:6px;border-radius:9px;background:var(--line);overflow:hidden;margin-top:6px}
.bar i{display:block;height:100%;background:linear-gradient(90deg,var(--blue2),var(--blue));border-radius:9px;animation:grow 1s ease-out}
@keyframes grow{from{width:0}}
.empty{text-align:center;color:var(--mut);padding:36px;border:1px dashed var(--line);border-radius:14px}
.pill{display:inline-block;font-size:12px;font-weight:500;padding:2px 9px;border-radius:7px}
.p-high{background:#ef44441f;color:var(--red)}.p-medium{background:#f59e0b24;color:#c27803}.p-low{background:#22c55e22;color:#15803d}
.meta{display:flex;gap:4px 12px;flex-wrap:wrap;font-size:12px;color:var(--mut);margin-top:6px}.late{color:var(--red);font-weight:600}
.task{padding:12px;cursor:pointer;border-radius:14px}
.task h4{font-size:15px;font-weight:500;margin-top:6px}
.task.done h4{text-decoration:line-through;color:var(--mut)}
.task,.lrow,.prow,.nav{transition:transform .2s,box-shadow .2s,background .2s}
.task:hover,.lrow:hover,.prow:hover{transform:translateY(-3px);box-shadow:0 12px 26px #1d2a5a26}
dialog{border:0;border-radius:18px;padding:20px;width:min(420px,92vw);background:var(--solid);color:var(--ink);box-shadow:0 24px 60px #0004}
dialog::backdrop{background:#0008;backdrop-filter:blur(4px)}

/* Page-load intro: every section bounces in one after another */
@keyframes bounceIn{0%{opacity:0;transform:translateY(50px) scale(.88)}55%{opacity:1;transform:translateY(-10px) scale(1.03)}78%{transform:translateY(4px) scale(.99)}100%{opacity:1;transform:none}}
@keyframes logoPop{0%{transform:scale(0) rotate(-120deg)}70%{transform:scale(1.2) rotate(10deg)}100%{transform:none}}
.intro aside,.intro header>*,.intro main .card,.intro .col,.intro .day,.intro .lrow,.intro .empty,.intro footer{
animation:bounceIn .85s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0)*70ms)}
.intro .brand svg{animation:logoPop .9s cubic-bezier(.2,.8,.3,1) .15s both}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}.cf{display:none}}
`;

export default function GlobalStyles() {
  // dangerouslySetInnerHTML keeps the CSS exactly as written (React would otherwise escape quotes and ">").
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
