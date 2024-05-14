import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Tax Game",
  description: "Learn how to spend your taxes",
  icons: "icon.ico"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/icons/icon.ico" sizes="any"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
