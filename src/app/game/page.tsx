"use client"
import dynamic from 'next/dynamic'
import React, { lazy, Suspense, useEffect } from 'react'

import "./page.scss"
import { useTheme } from '@/components/ThemeContext/themecontext'
import { useRemoveLoadingScreen } from '@/components/LoadingScreen/LoadingScreenUtil'
import { loadGameGlobal } from '../global'
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'

import { socket } from '@/socket'

const Layouts = dynamic(() => import("./layouts"), {ssr: false})

export default function Layout() {

	let {theme} = useTheme();

	useRemoveLoadingScreen(()=>{
		loadGameGlobal();
	})

	useEffect(()=>{
		// if(!socket.connected){
		// 	socket.connect();
		// }

		// return ()=>{
		// 	socket.disconnect();
		// }
	},[])

	return (
		<div className={`${theme} w-full h-full flex justify-center items-center overflow-hidden`}>
			<LoadingScreen/>
			<Suspense fallback={<p></p>}>
				<Layouts/>
			</Suspense>
		</div>
	)
}
