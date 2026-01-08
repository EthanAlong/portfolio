// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Computational Designer Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 彻底移除所有类名，只保留最纯粹的 children */}
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}