"use client"
import dynamic from 'next/dynamic'
import React, { lazy, Suspense, useEffect } from 'react'

import "./page.scss"
import { useTheme } from '@/components/ThemeContext/themecontext'
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil'
import { GameGlobal, loadGameGlobal, theme } from '../global'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'

import { socket } from '@/app/socket'
import { computed } from '@preact/signals-react'

const Layouts = dynamic(() => import("./layouts"), {ssr: false})

export default function Layout() {


	useEffect(()=>{
		loadGameGlobal();
	},[])

	return (
		<div className={`${theme.value} w-full h-full flex justify-center items-center overflow-hidden`}>
			
			<Suspense fallback={<p></p>}>
				<Layouts/>
			</Suspense>
		</div>
	)
}
