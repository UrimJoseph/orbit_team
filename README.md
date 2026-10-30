# Bright Edge Tasks (Next.js)

## Run it
    npm install
    npm run dev      # then open http://localhost:3000

## Build for production
    npm run build
    npm start

## Structure
- `app/page.js`      home page: holds all state and renders every component
- `app/layout.js`    page title, font, wrapper (tab icon is `app/icon.svg`)
- `components/`      one file per piece, each with its own JSX, CSS and logic:
  GlobalStyles, Background, Logo, Sidebar, Header, Footer, Dashboard, FocusTimer,
  Board, WeekView, TaskList, TaskCard, TaskDialog, ConfirmDialog, HelpDialog
- `lib/`             helpers.js, confetti.js, useFocusTimer.js (non-visual logic)

Tasks are saved in the browser (localStorage).
