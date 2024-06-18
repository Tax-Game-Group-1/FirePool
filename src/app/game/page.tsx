import dynamic from 'next/dynamic'
import React, { lazy, Suspense } from 'react'

import "./page.scss"

const Layouts = dynamic(() => import("./layouts"), {ssr: false})

export default function Layout() {

	return (
		<div className={`w-full h-full flex justify-center items-center overflow-hidden`}>
			<Suspense fallback={<p></p>}>
				<Layouts/>
			</Suspense>
		</div>
	)
}
