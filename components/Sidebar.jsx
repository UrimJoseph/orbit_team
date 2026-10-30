
import { useState } from "react";
import Logo from "./Logo";

const css = `
aside {
  background:color-mix(in srgb,var(--side) 70%,transparent);
  backdrop-filter:blur(16px);
  border-right:1px solid var(--line);
  padding:22px 14px;
  display:flex;
  flex-direction:column;
  gap:4px;
  position:sticky;
  top:0;
  height:100vh;
}

.brand {
  display:flex;
  align-items:center;
  gap:10px;
  font-weight:700;
  font-size:19px;
  line-height:1.1;
  padding:0 10px 16px;
}

.brand small {
  display:block;
  font-weight:400;
  font-size:12px;
  color:var(--mut);
}

.brand svg {
  width:38px;
  height:38px;
  flex:none;
}

aside h5 {
  font-size:12px;
  color:var(--mut);
  font-weight:500;
  margin:16px 10px 4px;
}

.nav {
  display:flex;
  align-items:center;
  gap:10px;
  background:none;
  border:0;
  border-radius:10px;
  padding:9px 10px;
  text-align:left;
  width:100%;
  cursor:pointer;
}

.nav:hover {
  background:var(--line);
}

.nav.on {
  background:var(--solid);
  box-shadow:0 1px 3px #0001;
  font-weight:600;
}

.nav small {
  margin-left:auto;
  color:var(--mut);
}

.spacer {
  flex:1;
}

.menu-toggle {
  display:none;
}

@media(max-width:760px) {
  aside {
    position:relative;
    height:auto;
    min-height:60px;
    flex-direction:column;
    overflow:visible;
    padding:12px;
    border-right:0;
    border-bottom:1px solid var(--line);
    align-items:stretch;
    z-index:50;
  }

  .mobile-top {
    display:flex;
    align-items:center;
    justify-content:space-between;
  }

  .brand {
    padding:0;
  }

  .brand svg {
    width:32px;
    height:32px;
  }

  .menu-toggle {
    display:flex;
    align-items:center;
    justify-content:center;
    background:var(--card);
    border:1px solid var(--line);
    border-radius:9px;
    width:40px;
    height:40px;
    font-size:23px;
    cursor:pointer;
    color:var(--ink);
  }

  aside .menu-content {
    display:none;
    padding-top:12px;
  }

  aside.menu-open .menu-content {
    display:flex;
    flex-direction:column;
    gap:4px;
  }

  aside h5 {
    margin:12px 10px 4px;
  }

  aside .spacer {
    display:none;
  }

  aside .nav {
    width:100%;
    white-space:normal;
  }
}

@media(min-width:761px) {
  .mobile-top {
    display:contents;
  }

  .menu-content {
    display:contents;
  }
}
`;

const items = [
  ["dash", "Dashboard", "var(--blue)"],
  ["board", "Board", "var(--orange)"],
  ["week", "Week", "var(--purple)"],
  ["list", "All tasks", "var(--green)"],
];

export default function Sidebar({
  view,
  proj,
  projects,
  openCount,
  onNav,
  onProject,
  onHelp,
  onTheme
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleNav = (key) => {
    onNav(key);
    closeMenu();
  };

  const handleProject = (project) => {
    onProject(project);
    closeMenu();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <aside className={menuOpen ? "menu-open" : ""}>

        <div className="mobile-top">
          <div className="brand">
            <Logo />
            <span>
              Bright Edge
              <small>Task manager</small>
            </span>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        <div className="menu-content">
          <h5>Menu</h5>

          {items.map(([key, name, color]) => (
            <button
              key={key}
              className={"nav" + (view === key && !proj ? " on" : "")}
              onClick={() => handleNav(key)}
            >
              <span className="dot" style={{ background: color }} />
              {name}
              {key === "list" && <small>{openCount}</small>}
            </button>
          ))}

          {projects.length > 0 && <h5>Projects</h5>}

          {projects.map((p) => (
            <button
              key={p}
              className={"nav" + (proj === p ? " on" : "")}
              onClick={() => handleProject(p)}
            >
              <span className="dot" style={{ background: "var(--mut)" }} />
              {p}
            </button>
          ))}

          <div className="spacer" />

          <button className="nav" onClick={() => {
            onHelp();
            closeMenu();
          }}>
            Help guide
          </button>

          <button className="nav" onClick={onTheme}>
            Switch theme
          </button>
        </div>

      </aside>
    </>
  );
}
