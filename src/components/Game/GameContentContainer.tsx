import React, { forwardRef, lazy, LegacyRef, Ref, Suspense } from 'react'

export default function GameContentContainer({children}:{
	children?: React.ReactNode,
}){
	return (
		<div className="game-content-container h-full w-full absolute top-0 right-0 p-2 bg-transparent flex flex-col justify-center items-center">
			{children}
		</div>
	)
}

export const GameContent = forwardRef(function GameContent(
	{children, className}:{
		children?:React.ReactNode,
		className?:string,
	}, ref:Ref<any>
){
	let _class = ["game-content border rounded-md p-2 inline-flex", className].join(" ");
	
	return (
		<div className={_class} ref={ref}>
			{children}
		</div>
	)
});