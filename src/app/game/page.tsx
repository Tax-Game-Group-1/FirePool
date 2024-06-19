"use client"
import dynamic from 'next/dynamic'
import React, { lazy, Suspense } from 'react'

import "./page.scss"
import { useTheme } from '@/components/ThemeContext/themecontext'

const Layouts = dynamic(() => import("./layouts"), {ssr: false})

export default function Layout() {

	let {theme} = useTheme();

	return (
		<div className={`${theme} w-full h-full flex justify-center items-center overflow-hidden`}>
			<Suspense fallback={<p></p>}>
				<Layouts/>
			</Suspense>
		</div>
	)
}
