'use client'
import "@/globals.scss";
import "@/components/ThemeContext/themes.scss"
import {ThemeProvider} from "@/components/ThemeContext/themecontext";

import { GameGlobal } from "./global";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
		<head>
			<link rel="icon" href="/images/icons/icon.ico" sizes="any"/>
			<link rel="manifest" href="/manifest.json"/>
			<meta name="wow"/>
		</head>
			<body>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
