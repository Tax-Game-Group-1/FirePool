"use client"
import React, { CSSProperties, forwardRef, MouseEvent, Ref } from 'react'

import style from "./Btn.module.scss";

export const Btn = forwardRef(function Btn({
	onClick=()=>{}, 
	onMouseEnter=()=>{}, 
	onMouseExit=()=>{}, 
	children, innerStyle, outerStyle, className="",
	invert = false,
}:{
	children?: React.ReactNode,
	className?: string,
	onClick?: (e:MouseEvent) => void,
	onMouseEnter?: (e:MouseEvent) => void,
	onMouseExit?: (e:MouseEvent) => void,
	innerStyle?: CSSProperties,
	outerStyle?: CSSProperties,
	invert?: boolean,
}, ref:Ref<any>) {
  return (
	<div 
		ref={ref} 
		className={`${style.btn} ${className} ${invert ? style.invert : ""}`} 
		onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseExit}
		style={outerStyle}
	>
		<span className={`${style.btnContent}`} style={innerStyle}>
			{children}
		</span>
	</div>
  )
});

export default Btn;
