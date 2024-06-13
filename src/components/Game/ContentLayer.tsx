
import {forwardRef, Ref} from 'react';
import style from "./ContentLayer.module.scss";

export const ContentLayersContainer = forwardRef(function ContentLayers({children, className=""}:{
	children: React.ReactNode,
	className?: string,
}, ref:Ref<any>){
	
	return (
		<div ref={ref} className={`${style.contentLayersContainer} ${className}`}>
			{children}
		</div>
	)
})

export const ContentLayer = forwardRef(function ContentLayer({children, className=""}:{
	children: React.ReactNode
	className?: string,
}, ref:Ref<any>){

	return (
		<div ref={ref} className={`${style.contentLayer} ${className}`}>
			{children}
		</div>
	)
});