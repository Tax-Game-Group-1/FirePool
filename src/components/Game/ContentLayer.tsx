
import {forwardRef, Ref} from 'react';

export const ContentLayersContainer = forwardRef(function ContentLayers({children, className=""}:{
	children: React.ReactNode,
	className?: string,
}, ref:Ref<any>){
	
	return (
		<div ref={ref} className={"content-layers-container flex rounded-md w-full h-full"+` ${className}`}>
			{children}
		</div>
	)
})

export const ContentLayer = forwardRef(function ContentLayer({children, className=""}:{
	children: React.ReactNode
	className?: string,
}, ref:Ref<any>){

	return (
		<div ref={ref} className={"content-layer h-full w-full absolute top-0 right-0 bg-transparent"+` ${className}`}>
			{children}
		</div>
	)
});