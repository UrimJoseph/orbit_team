// components/Footer.jsx
// Bottom strip with a quick summary and a link to the help guide.
//
// Props: openCount, doneCount, onHelp

const css = `
footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:28px;padding:14px 4px;
border-top:1px solid var(--line);font-size:13px;color:var(--mut)}
footer button{background:none;border:0;color:var(--blue);text-decoration:underline;padding:0}
`;

export default function Footer({ openCount, doneCount, onHelp }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <footer>
        <span>{openCount} open, {doneCount} completed</span>
        <span>© {new Date().getFullYear()} Bright Edge. All rights reserved.</span>
        <button onClick={onHelp}>Need help? Open the guide</button>
      </footer>
    </>
  );
}
