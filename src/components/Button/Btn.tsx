"use client"
import React, { CSSProperties, MouseEvent } from 'react'

import style from "./Btn.module.scss";

export default function Btn({onClick=()=>{}, children, innerStyle, outerStyle}:{
	children?: React.ReactNode,
	onClick?: (e:MouseEvent) => void,
	innerStyle?: CSSProperties,
	outerStyle?: CSSProperties,
}) {
  return (
	<div className={`${style.btn}`} onClick={onClick} style={outerStyle}>
		<span className={`${style.btnContent}`} style={innerStyle}>
			{children}
		</span>
	</div>
  )
}
