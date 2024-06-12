"use client"

import React, { useRef, useState } from 'react'
import AnimationContainer from '@/components/AnimationContainer/AnimationContainer'
import { GameContent } from '@/components/Game/GameContentContainer'

export default function Boxes() {

	let r = useRef(null);

	let [on, setOn] = useState(true);

	return (
		<>
			{on && (<><AnimationContainer 
				className="opacity-0" 
				enter={{
					animations:{
						opacity: [0,1],
						y: [-100, 0],
					},
					options:{
						duration: 0.5,
						ease: "circInOut",
						delay: 0.0,
					}
				}}
			>
				<GameContent className="absolute self-end m-2">
					<div className="min-w-24 aspect-square bg-green-200"></div>
				</GameContent>
			</AnimationContainer>
			<AnimationContainer 
				className="opacity-0" 
				enter={{
					animations:{
						opacity: [0,1],
						y: [-100, 0],
					},
					options:{
						duration: 0.5,
						ease: "circInOut",
						delay: 0.1,
					}
				}}
			>
					<div className="min-w-24 aspect-square bg-blue-200"></div>
			</AnimationContainer>
			<AnimationContainer 
				className="opacity-0" 
				enter={{
					animations:{
						opacity: [0,1],
						y: [-100, 0],
					},
					options:{
						duration: 0.5,
						ease: "circInOut",
						delay: 0.2,
					}
				}}
			>
				<GameContent className="absolute self-start m-2">
					<div className="min-w-24 aspect-square bg-red-200"></div>
				</GameContent>
			</AnimationContainer></>)}
		</>
	)
}
