import React, { lazy, Suspense } from 'react'

import {forwardRef, Ref} from 'react';

const Layouts = lazy(() => import("./layouts"))

export default function Layout() {

	return (
		<div className={`w-full h-full flex justify-center items-center overflow-hidden`}>
			<Suspense fallback={<p></p>}>
				<Layouts/>
			</Suspense>
		</div>
	)
}
