// components/Sidebar.jsx
// Left menu: logo, the four views, the project list, and the help/theme buttons.
// On phones it becomes a horizontal strip across the top.
//
// Props:
//   view / proj      which view and which project are currently active
//   projects         list of project names
//   openCount        number shown next to "All tasks"
//   onNav(view)      user clicked a view
//   onProject(name)  user clicked a project
//   onHelp / onTheme user clicked the help or theme button

import Logo from "./Logo";

const css = `
aside{background:color-mix(in srgb,var(--side) 70%,transparent);backdrop-filter:blur(16px);border-right:1px solid var(--line);
padding:22px 14px;display:flex;flex-direction:column;gap:4px;position:sticky;top:0;height:100vh}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;line-height:1.1;padding:0 10px 16px}
.brand small{display:block;font-weight:400;font-size:12px;color:var(--mut)}
.brand svg{width:38px;height:38px;flex:none}
aside h5{font-size:12px;color:var(--mut);font-weight:500;margin:16px 10px 4px}
.nav{display:flex;align-items:center;gap:10px;background:none;border:0;border-radius:10px;padding:9px 10px;text-align:left;width:100%}
.nav:hover{background:var(--line)}
.nav.on{background:var(--solid);box-shadow:0 1px 3px #0001;font-weight:600}
.nav small{margin-left:auto;color:var(--mut)}
.spacer{flex:1}
@media(max-width:760px){
aside{position:static;height:auto;flex-direction:row;overflow-x:auto;padding:10px;border-right:0;border-bottom:1px solid var(--line);align-items:center}
aside h5,.spacer,.brand span{display:none}.brand{padding:0 6px 0 0}.brand svg{width:30px;height:30px}
.nav{width:auto;white-space:nowrap}}
`;

const items = [
  ["dash", "Dashboard", "var(--blue)"],
  ["board", "Board", "var(--orange)"],
  ["week", "Week", "var(--purple)"],
  ["list", "All tasks", "var(--green)"],
];

export default function Sidebar({ view, proj, projects, openCount, onNav, onProject, onHelp, onTheme }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <aside>
        <div className="brand">
          <Logo />
          <span>Bright Edge<small>Task manager</small></span>
        </div>

        <h5>Menu</h5>
        {items.map(([key, name, color]) => (
          <button key={key} className={"nav" + (view === key && !proj ? " on" : "")} onClick={() => onNav(key)}>
            <span className="dot" style={{ background: color }} />
            {name}
            {key === "list" && <small>{openCount}</small>}
          </button>
        ))}

        {projects.length > 0 && <h5>Projects</h5>}
        {projects.map((p) => (
          <button key={p} className={"nav" + (proj === p ? " on" : "")} onClick={() => onProject(p)}>
            <span className="dot" style={{ background: "var(--mut)" }} />
            {p}
          </button>
        ))}

        <div className="spacer" />
        <button className="nav" onClick={onHelp}>Help guide</button>
        <button className="nav" onClick={onTheme}>Switch theme</button>
      </aside>
    </>
  );
}
