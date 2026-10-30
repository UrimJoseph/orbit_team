// app/layout.js
// The root layout wraps every page. It sets the page title, loads the Outfit font
// and renders whatever page is active inside <body>.
// The browser tab icon comes from app/icon.svg (Next.js picks it up automatically).

export const metadata = {
  title: "Bright Edge Tasks",
  description: "Personal task manager for Bright Edge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
