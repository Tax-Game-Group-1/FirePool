'use client'
import "@/globals.scss";
import {ThemeProvider} from "@/components/ThemeContext/themecontext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/icons/icon.ico" sizes="any"/>
		<meta name="wow"/>
      </head>
      <ThemeProvider>
        <body>{children}</body>
      </ThemeProvider>
    </html>
  );
}
