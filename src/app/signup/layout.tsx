import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import React, { Suspense } from 'react'

export default function Layout({children}) {
  return (
	<>
		<LoadingScreen/>
		<Suspense fallback={<p></p>}>
			{children}
		</Suspense>
	</>
  )
}
