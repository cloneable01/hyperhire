"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
