import React from 'react'
import LoadingStatus from '../Loading/Loading'

import t from "../../elements.module.scss"

export default function LoadingScreen() {
	
	return (
		<div className={`fixed z-[1000] min-w-svw min-h-svh h-screen w-screen inline-flex justify-center self-center items-center overflow-hidden ${t.background} loadingThingy pointer-events-none`}>
			<LoadingStatus/>
		</div>
	)
}
