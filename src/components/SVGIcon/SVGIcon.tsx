"use client"

import { mergeRefs } from "@/mergeRefs/mergeRefs";
import { forwardRef, Children, cloneElement, ReactNode, DetailedReactHTMLElement, LegacyRef, useEffect, useRef } from "react";


///By Catsums
const SVGIcon = forwardRef(function SVGIcon({children, className="", resizeBasedOnContainer=true}:{
	children: ReactNode,
	className?: string,
	resizeBasedOnContainer?: boolean,
}, ref:LegacyRef<any>){

	const childRefs = useRef<any[]>([]);

	useEffect(()=>{
		if(!resizeBasedOnContainer) return;

		let childs = childRefs.current;
		function resetSVG(svg:SVGElement){
			svg.setAttribute('height', `0`);
			svg.setAttribute('width', `0`);
			svg.style.height = `0`;
			svg.style.width = `0`;
		}
		function scaleSVG(svg:SVGElement, parent:Element) {
			//client sizes ignore border and padding and margin, only focus on the true element size
			let width = parent.clientWidth;
			let height = parent.clientHeight;

			svg.setAttribute('height', `${height}`);
			svg.setAttribute('width', `${width}`);

			svg.style.height = `${height}`;
			svg.style.width = `${width}`;
		}
		for(let child of childs){
			let svg = child as SVGElement;
			window.addEventListener('resize', ()=>{
				resetSVG(svg);
				requestAnimationFrame(()=>{
					let cont = svg.parentElement;
					if(!cont) return;
					scaleSVG(svg, cont);
				})
			});
			
			resetSVG(svg);
			requestAnimationFrame(()=>{
				let cont = svg.parentElement;
				if(!cont) return;
				scaleSVG(svg, cont);
			})
		}
	})

	let childs = Children.map(children as any, (child:any,i) =>
		cloneElement(child, {
			className: `${child?.props?.className || ""} ${className}`,
			style: Object.assign(child?.props?.style || {}, {
				width: resizeBasedOnContainer ? 0 : "initial", 
				height: resizeBasedOnContainer ? 0 : "initial", 
			}),
			ref: (r:any)=>{
				if(ref){
					if(typeof ref == "object"){
						ref.current[i] = r;
					}else if(typeof ref == "function"){
						ref(r);
					}
				}
				childRefs.current[i] = r
			},
		})
	  );
	return (
		<>
			{childs}
		</>
	)
})

export default SVGIcon;