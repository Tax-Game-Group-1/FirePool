"use client"
import { isValidElement, useState, useCallback, useEffect, forwardRef, Children, cloneElement, LegacyRef, useRef } from "react"
import _ from "lodash";

import { MediaWidthBreakPoints } from "./breakpoints";
import { randomID } from "@catsums/my";
import React from "react";

export interface IMediaQuery {
	// [query:string] : string | number | boolean;"
	"min-height"?: string | number;
	"max-height"?: string | number;
	"height"?: string | number;
	"min-width"?: string | number;
	"max-width"?: string | number;
	"width"?: string | number;

	"aspect-ratio"?: string | number;
	"resolution"?: string | number;
	"grid"?: number | boolean;
	
	"orientation"?: "landscape" | "portrait";
	"dynamic-range"?: "standard" | "high";
	"video-dynamic-range"?: "standard" | "high";
	"scan"?: "interlace" | "progressive";
	"scripting"?: "none" | "initial-only" | "enabled";
	"update"?: "none" | "slow" | "fast";

	"any-pointer"?: "none" | "coarse" | "fine";
	"pointer"?: "none" | "coarse" | "fine";
	"any-hover"?: "none" | "hover";
	"hover"?: "none" | "hover";

	"prefers-color-scheme"?: "light" | "dark";
	"prefers-contrast"?: "no-preference" | "more" | "less" | "custom";
	"prefers-reduced-motion"?: "no-preference" | "reduce";
	"inverted-colors"?: "none" | "inverted";
	
	"overflow-block"?: "none" | "scroll" | "optional-paged" | "paged";
	"overflow-inline"?: "none" | "scroll";
	
	"display-mode"?: "fullscreen" | "browser" | "minimal-ui" | "picture-in-picture" | "standalone" | "window-controls-overlay";

	"monochrome"?: number;
	"min-monochrome"?: number;
	"max-monochrome"?: number;
	"color"?: number;
	"color-gamut"?: "srgb"|"p3"|"rec2020";
	"color-index"?: number;
	"min-color-index"?: number;
	"max-color-index"?: number;
	"forced-colors"?: "none" | "active";

	not?: IMediaQuery;

	screen?: boolean;
	print?: boolean;
	all?: boolean;
}

///https://stackoverflow.com/questions/72238021/how-to-apply-media-query-in-nextjs
///Modified by Catsum

export function useMediaQuery(query:string|MediaQueryList|IMediaQuery|IMediaQuery[]){
	const [targetReached, setTargetReached] = useState(false)

	const updateTarget = useCallback((e:MediaQueryListEvent) => {
		if (e.matches) setTargetReached(true)
		else setTargetReached(false)
	}, [])

	function createMediaQuery(obj:IMediaQuery){
		let entries = Object.entries(query)
		let out = "";
		for(let i=0; i<entries.length; i++){
			let [k,v] = entries[i];
			k = k.trim();
			if(_.isNumber(v)){
				if(k.endsWith("width") || k.endsWith("height")){
					out += `(${k}: ${v}px)`;
				}
				else if(k.endsWith("resolution")){
					out += `(${k}: ${v}dpi)`;
				}
				else{
					out += `(${k}: ${v})`;
				}
			}else if(_.isString(v)){
				if(k.endsWith("-width") && MediaWidthBreakPoints[v]){
					let val = (k == "min-width") ? MediaWidthBreakPoints[v].min : MediaWidthBreakPoints[v].max;
					out += `(${k}: ${val}px)`;
				}else{
					out += `(${k}: ${v})`;
				}
			}else if(_.isBoolean(v)){
				if(k == "grid"){
					out += `${k ? 1 : 0}`;
				}else{
					out += `${k}`;
				}
			}

			if(i < entries.length - 1){
				out += " and ";
			}
		}

		return out;
	}

	useEffect(() =>{
		let media:MediaQueryList;
		if(query instanceof MediaQueryList){
			media = query
		}else if(_.isString(query)){
			let out = query.trim();
			if(MediaWidthBreakPoints[out]){
				out = `(min-width: ${MediaWidthBreakPoints[out].min}px) and (max-width: ${MediaWidthBreakPoints[out].max}px)`
			}
			media = window.matchMedia(`${out}`)
		}else{
			let arr:IMediaQuery[] = [];
			if(_.isArray(query)){
				arr = query;
			}else{
				arr = [query];
			}
			let out = "";
			for(let i = 0;i<arr.length;i++){
				let obj = arr[i];
				out += createMediaQuery(obj);

				if(i < arr.length - 1){
					out += " or ";
				}
			}
			media = window.matchMedia(`${out}`);
		}
		media.addEventListener('change', updateTarget)

		// Check on mount (callback is not called until a change occurs)
		if (media.matches) setTargetReached(true)

		return () => media.removeEventListener('change', updateTarget)
	}, [])

	return targetReached;
}

///By Catsum
type HidingMode = "display" | "visibility" | "dom" | "render";

const className = randomID("hidden-");
const styleSheetID = "injected-query-control-style"

function injectStyleInDocument(){
	let style = document.querySelector(`#${styleSheetID}`)
	if(!style){
		let style = document.createElement("style");
		style.id = styleSheetID;
		style.setAttribute("type","text/css");
		style.innerHTML = `
			.${className} {
				display: none;
				visibility: hidden;
			}
		`;
		document.getElementsByTagName('head')[0].appendChild(style);
	}
}

export const MatchMedia = forwardRef(function MediaQuery({children, query, hidingType="render"}:{
	children?: React.ReactNode,
	query: string | MediaQueryList | IMediaQuery | IMediaQuery[],
	hidingType?: HidingMode,
}, ref:LegacyRef<any>) {

	injectStyleInDocument();
	
	let matches = useMediaQuery(query);
	let childRefs = useRef<any[]>([]);
	let propRefs = useRef<any[]>([]);

	let childs = Children.map(children as any, (child:any,i) =>{
		let c = (hidingType === "display" || hidingType === "visibility") ? className : "";
		let k = React.createElement(child.type, Object.assign(child.props,{
			className: `${child.props.className} ${c}`,
			ref:(r: any)=>{
				if(ref && typeof ref === "object"){
					ref.current[i] = r;
				}
				childRefs.current[i] = r;
				console.log({r})
			}
		}), child.props.children);
		return k;
	});

	let hideOnRender = (hidingType === "render");

	function match(){
		let childElems = childRefs.current as Element[];
		let props = propRefs.current;
		
		if(matches){
			for(let i = 0;i<childElems.length;i++){
				let prop = props[i];
				let child = childElems[i];

				switch(hidingType){
					case "display": case "visibility":
						child.classList.remove(className);
						break;
					case "dom":{
						let parent = prop as Node;
						if(parent && child.parentNode != parent){
							parent.appendChild(child);
						}
					} break;
				}
			}
		}else{
			for(let i = 0;i<childElems.length;i++){
				let child = childElems[i];

				switch(hidingType){
					case "display": case "visibility":
						child.classList.add(className);
						break;
					case "dom":{
						let parent = props[i] as Node;
						if(!parent){
							props[i] = parent;
						}
						childElems[i].remove();
					} break;
				}
			}
		}
	}

	useEffect(() => {
		if(!hideOnRender){
			match();
		}
	},[matches])

	useEffect(()=>{
		if(!hideOnRender){
			injectStyleInDocument();
			
			let childElems = childRefs.current as Element[];
			console.log({childElems})

			for(let i = 0;i<childElems.length;i++){
				let child = childElems[i];
				switch(hidingType){
					// case "display": case "visibility":
					// 	child.classList.add(className);
					// 	break;
					case "dom":{
						let parent = child.parentNode;
						if(parent){
							propRefs.current[i] = parent;
							childElems[i].remove();
						}
					} break;
				}
			}
		}
		match();
		
	})

	return (
		<>
			{
				(matches || !hideOnRender) && childs
			}
		</>
	)
})