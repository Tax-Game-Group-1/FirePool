"use client"

import { forwardRef, LegacyRef, Ref, useState } from "react"

export const BorrowedCounter = forwardRef(function Counter({count=0, onClick=(e)=>{}}:{
	count?: number;
	onClick?: (e:MouseEvent) => void;
}, ref:LegacyRef<any>) {
	return (
		<div ref={ref}>
			Number: {count}
			<button className="text-sm" onClick={(e)=>{
				onClick(e as any);
			}}>Count</button>
		</div>
	)
})
export const SelfCounter = forwardRef(function Counter({}:{
}, ref:LegacyRef<any>) {

	let [count, setCount] = useState(0)

	return (
		<div ref={ref}>
			Number: {count}
			<button className="text-sm" onClick={()=>{
				setCount(count+1);
			}}>Count</button>
		</div>
	)
})