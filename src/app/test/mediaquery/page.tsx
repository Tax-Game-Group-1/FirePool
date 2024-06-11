
import React from 'react'

import { IMediaQuery, MatchMedia } from '@/components/useMediaQuery/useMediaQuery'
import AnimationContainer from '@/components/AnimationContainer/AnimationContainer'

import { MediaWidthBreakPoints } from "@/components/useMediaQuery/breakpoints";


function Card({children, bgColor="black", txtColor="white", borderColor=bgColor}:{
	children: React.ReactNode,
	bgColor?: string,
	txtColor?: string,
	borderColor?: string,
}){
	return (
		<div 
			className="card m-2 p-2 border inline-flex justify-center items-center rounded-md"
			style={{
				backgroundColor: bgColor,
				color: txtColor,
				borderColor: borderColor,
			}}
		>
			{children}
		</div>
	)
}

export default function TestPage() {

	let cards = [];
	let colors = [
		"black","darkred","darkblue","darkgreen","darkcyan","darkyellow"
	];
	let sizes = ["xs","sm","md","lg","xl","2xl"];

	for(let i=0; i<sizes.length; i++){
		let size = sizes[i];
		let color = colors[i];

		let breakpoint = MediaWidthBreakPoints[size];

		let query:IMediaQuery = {
			"min-width": breakpoint.min,
			"max-width": breakpoint.max,
		}
		if(i == 0){
			delete query["min-width"];
		}else if(i == sizes.length - 1){
			delete query["max-width"];
		}

		let card = (
			<MatchMedia query={query}>
				<Card key={i} bgColor={color} txtColor="white">
					<div className="w-[30vw] aspect-[3/4] flex justify-center items-center">
						Card size {size}
					</div>
				</Card>
			</MatchMedia>
		)
		cards.push(card);
	}

	return (
		<div className=" min-h-svh min-w-svw m-0 relative flex flex-col justify-center items-center overflow-hidden top-0 left-0 bg-white text-black">
			<h1>Test Page</h1>
			<p className="text-sm">(Resize the page width to see changes)</p>
			{cards}
		</div>
	)
}
