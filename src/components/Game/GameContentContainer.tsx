import React, { forwardRef, lazy, LegacyRef, Ref, Suspense } from 'react'
import style from "./GameContentContainer.module.scss";

export default function GameContentContainer({children}:{
	children?: React.ReactNode,
}){
	return (
		<div className={style.gameContentContainer}>
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
	
	return (
		<div className={`${style.gameContent} ${className}`} ref={ref}>
			{children}
		</div>
	)
});