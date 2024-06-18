import { forwardRef } from "react";

export const Card = forwardRef(function Card({children, bgColor="black", txtColor="white", borderColor=bgColor}:{
	children: React.ReactNode,
	bgColor?: string,
	txtColor?: string,
	borderColor?: string,
}, ref:any){
	return (
		<div 
			className="card m-2 p-2 border inline-flex justify-center items-center rounded-md"
			style={{
				backgroundColor: bgColor,
				color: txtColor,
				borderColor: borderColor,
			}}
			ref={ref}
		>
			{children}
		</div>
	)
});