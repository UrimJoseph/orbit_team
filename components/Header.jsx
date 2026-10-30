// components/Header.jsx
// Top bar of the main area: date + page title, the search box, Help and Create task buttons.
//
// Props:
//   title            big heading text
//   query/onQuery    controlled search box
//   onHelp / onCreate

import { today, nice } from "../lib/helpers";

const css = `
header{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px}
header .hi{flex:1;min-width:160px}
header .hi p{color:var(--mut);font-size:13px}
header h1{font-size:30px;font-weight:700;background:linear-gradient(90deg,var(--ink) 30%,var(--blue));-webkit-background-clip:text;background-clip:text;color:transparent}
.search{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:9px 14px;width:min(240px,100%)}
`;

export default function Header({ title, query, onQuery, onHelp, onCreate }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header>
        <div className="hi">
          <p>{nice(today(), { weekday: "long", day: "numeric", month: "long" })}</p>
          <h1>{title}</h1>
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search tasks"
          aria-label="Search tasks"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
        <button className="ghost" onClick={onHelp}>Help</button>
        <button className="btn" onClick={onCreate}>Create task</button>
      </header>
    </>
  );
}
