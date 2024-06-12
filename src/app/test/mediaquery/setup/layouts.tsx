"use client"

import dynamic from 'next/dynamic'
import { useState, forwardRef, Ref } from 'react';

import { Card } from './Card'
import { BorrowedCounter as Counter } from '../Counter'


import { rndInt } from "@catsums/my"
 
const MatchMedia = dynamic(async() => {
	let x = await import('@/components/useMediaQuery/useMediaQuery')
	return x.MatchMedia;
}, { ssr: false })
 

const Layouts = forwardRef(function PCLayout({},ref:Ref<any>){

	let [count, setCount] = useState(0);
	let [myNumber, setNumber] = useState(rndInt(0, 100));

	const PCLayout = forwardRef(function PC({}, ref:Ref<any>){
		return (
			<div ref={ref} className="flex flex-row justify-evenly">
				<Card bgColor="darkred" txtColor="white">
					<div className="w-[30vw] aspect-[3/4] flex flex-col justify-center items-center">
						<span className="p-2">Card A</span>
						<Counter count={count} onClick={()=>{
							setCount(count + 1);
						}}/>
					</div>
				</Card>
				<Card bgColor="darkgreen" txtColor="white">
					<div className="w-[30vw] aspect-[3/4] flex flex-col justify-center items-center">
						<span className="p-2">Card B</span>
						<span>The count in another card is {count}.</span>
						<span>But I prefer {myNumber}.</span>
					</div>
				</Card>
				<Card bgColor="darkblue" txtColor="white">
					<div className="w-[30vw] aspect-[3/4] flex flex-col justify-center items-center">
						<span className="p-2">Card C</span>
					</div>
				</Card>
			</div>
		)
	});
	const MobileLayout = forwardRef(function Mobile({}, ref:Ref<any>){
		return (
			<div ref={ref} className="flex flex-col justify-evenly">
				<div className="flex justify-evenly">
					<Card bgColor="darkred" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<Counter count={count} onClick={()=>{
								setCount(count + 1);
							}}/>
						</div>
					</Card>
					<Card bgColor="darkgreen" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<span className="p-2">Card B</span>
							<span>Your number is {myNumber}.</span>
						</div>
					</Card>
				</div>
				<div className="flex justify-evenly">
					<Card bgColor="darkblue" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<span className="p-2">Card C</span>
						</div>
					</Card>
					<Card bgColor="darkviolet" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<span className="p-2">Card D</span>
						</div>
					</Card>
				</div>
			</div>
		)
	});
	const TabletLayout = forwardRef(function Tablet({}, ref:Ref<any>){
		return (
			<div ref={ref} className="flex flex-col justify-evenly">
				<div className="flex justify-evenly">
					<Card bgColor="darkred" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<Counter count={count} onClick={()=>{
								setCount(count + 1);
							}}/>
						</div>
					</Card>
					<Card bgColor="darkgreen" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<span className="p-2">Card B</span>
							<span>Your number is {myNumber}.</span>
						</div>
					</Card>
					<Card bgColor="darkblue" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<span className="p-2">Card C</span>
						</div>
					</Card>
				</div>
				<div className="flex justify-evenly">
					<Card bgColor="darkred" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<span>Secret counter</span>
							<Counter count={myNumber} onClick={()=>{
								setNumber(myNumber + 1);
							}}/>
						</div>
					</Card>
					<Card bgColor="darkgreen" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<span className="p-2">Card E</span>
							<span>Your number is not {count}.</span>
						</div>
					</Card>
					<Card bgColor="darkblue" txtColor="white">
						<div className="w-[20vw] aspect-[3/4] flex flex-col justify-center items-center">
							<span className="p-2">Card F</span>
						</div>
					</Card>
				</div>
			</div>
		)
	});

	return (
		<>
			<MatchMedia query="sm" hidingType="render">
				<MobileLayout/>
			</MatchMedia>
			<MatchMedia query="md" hidingType="render">
				<TabletLayout/>
			</MatchMedia>
			<MatchMedia query={["lg","xl","2xl"]} hidingType="render">
				<PCLayout/>
			</MatchMedia>
		</>
	)
});

export default Layouts;