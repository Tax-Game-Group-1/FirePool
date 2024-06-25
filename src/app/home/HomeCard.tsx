"use client"

import { MouseEvent } from 'react';

import s from './page.module.scss';
import t from '../../elements.module.scss'

export function HomeCard({icon, text, onClick}:{
	icon: React.ReactNode,
	text: string,
	onClick?: (e?:MouseEvent) => void,
}){
	return (
		<div className={` ${t.solidElement} ${s.card}`} onClick={onClick}>
			<div className={`${t.fillToolbar} ${t.textBoxBackground} aspect-square rounded-md p-8`}>
				{icon}
			</div>
			<div className={`flex justify-center items-center text-center`}>
				{text}
			</div>
		</div>
	)
}