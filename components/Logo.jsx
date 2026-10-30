// components/Logo.jsx
// The Bright Edge logo mark as an inline SVG (a white "B" on a blue-purple rounded square).
// To use the real logo later, replace the contents of this file with an <img> or the new SVG.

export default function Logo() {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Bright Edge logo">
      <defs>
        <linearGradient id="be-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d7bff" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#be-logo-grad)" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M20 16H35C43 16 47 20 47 26C47 30 45 33 41 34.5C46 36 49 39 49 44C49 51 43 56 34 56H20ZM30 24V31H34C37 31 38 29 38 27.5C38 25.5 37 24 34 24ZM30 39V48H35C38.5 48 40 46 40 43.5C40 41 38.5 39 35 39Z"
      />
      <circle cx="51" cy="13" r="5" fill="#ffd166" />
    </svg>
  );
}
