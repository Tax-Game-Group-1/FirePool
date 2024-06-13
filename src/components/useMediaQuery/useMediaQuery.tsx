"use client"
import { isValidElement, useState, useCallback, useEffect, forwardRef, Children, cloneElement, LegacyRef, useRef, Ref } from "react"
import _ from "lodash";

import { MediaWidthBreakPoints } from "./breakpoints";
import { randomID } from "@catsums/my";
import React from "react";
import { mergeRefs } from "@/mergeRefs/mergeRefs";

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

	not?: IMediaQuery | (IMediaQuery|string)[] | string;

	screen?: boolean;
	print?: boolean;
	all?: boolean;
}

///https://stackoverflow.com/questions/72238021/how-to-apply-media-query-in-nextjs
///Modified by Catsum

export function useMediaQuery(query:string|MediaQueryList|IMediaQuery|(IMediaQuery|string)[]){
	const [targetReached, setTargetReached] = useState(false)

	const updateTarget = useCallback((e:MediaQueryListEvent) => {
		if (e.matches) setTargetReached(true)
		else setTargetReached(false)
	}, [])

	function createMediaQuery(obj:IMediaQuery){
		let entries = Object.entries(obj)
		let out = "";
		for(let i=0; i<entries.length; i++){
			let [k,v] = entries[i];
			k = k.trim();

			let _out = "";
			if(k == "not"){
				let val = v as IMediaQuery | (IMediaQuery|string)[] | string;
				let _not = "not (";
				if(_.isString(val)){
					let k = val.trim();
					if(MediaWidthBreakPoints[k]){
						k = `(min-width: ${MediaWidthBreakPoints[k].min}px) and (max-width: ${MediaWidthBreakPoints[k].max}px)`
					}
					_not += k;
				}else{
					let arr:(IMediaQuery|string)[] = [];
					if(_.isArray(val)){
						arr = val;
					}else{
						arr = [val];
					}
					let out = "";
					for(let i = 0;i<arr.length;i++){
						let x = arr[i];
						if(_.isString(x)){
							let str = x.trim();
							if(MediaWidthBreakPoints[str]){
								str = `(min-width: ${MediaWidthBreakPoints[str].min}px) and (max-width: ${MediaWidthBreakPoints[str].max}px)`
							}
							out += `(${str})`;
						}else if(_.isObject(x)){
							out += createMediaQuery(x);
						}
		
						if(i < arr.length - 1){
							out += " or ";
						}
					}
					_not += out;
				}
				_not += ")";
				out += _not;
			}else if(_.isNumber(v)){
				if(k.endsWith("width") || k.endsWith("height")){
					_out += `(${k}: ${v}px)`;
				}
				else if(k.endsWith("resolution")){
					_out += `(${k}: ${v}dpi)`;
				}
				else{
					_out += `(${k}: ${v})`;
				}
			}else if(_.isString(v)){
				if(k.endsWith("-width") && MediaWidthBreakPoints[v]){
					let val = (k == "min-width") ? MediaWidthBreakPoints[v].min : MediaWidthBreakPoints[v].max;
					_out += `(${k}: ${val}px)`;
				}else{
					_out += `(${k}: ${v})`;
				}
			}else if(_.isBoolean(v)){
				if(k == "grid"){
					_out += `(${k}: ${v ? 1 : 0})`;
				}else{
					_out += `${k}`;
				}
			}

			out += _out;

			if(i < entries.length - 1){
				out += " and ";
			}
		}

		return `(${out})`;
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
			let arr:(IMediaQuery|string)[] = [];
			if(_.isArray(query)){
				arr = query;
			}else{
				arr = [query];
			}
			let out = "";
			for(let i = 0;i<arr.length;i++){
				let obj = arr[i];
				if(_.isString(obj)){
					let str = obj.trim();
					if(MediaWidthBreakPoints[str]){
						str = `(min-width: ${MediaWidthBreakPoints[str].min}px) and (max-width: ${MediaWidthBreakPoints[str].max}px)`
					}
					out += `(${str})`;
				}else if(_.isObject(obj)){
					out += createMediaQuery(obj);
				}

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
	if(!process.browser){
		return;
	}
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

export const MatchMedia = forwardRef(
	function MediaQuery({children, query, hidingType="render", onMatch, onUnmatch}:{
		children?: React.ReactNode,
		query: string | MediaQueryList | IMediaQuery | (IMediaQuery|string)[],
		hidingType?: HidingMode,
		onMatch?: (children:Element[]) => void,
		onUnmatch?: (children:Element[]) => void,
	}, ref:Ref<any>) {

	///defaulting dom to display because dom is being buggy
	if(hidingType === "dom"){
		hidingType = "display";
	}


	injectStyleInDocument();
	
	let matches = useMediaQuery(query);
	let childRefs = useRef<any[]>([]);
	let propRefs = useRef<any[]>([]);

	let childs = Children.map(children as any, (child:any, i:number) =>{
		let c = cloneElement(child, {
			className: `${child.props?.className || ""} ${className}`,
			ref:(r: any)=>{
				if(ref && typeof ref === "object"){
					ref.current[i] = r;
				}else if(typeof ref === "function"){
					ref(r);
				}
				childRefs.current[i] = r;
			},
		})
		return c;
	});

	let hideOnRender = (hidingType === "render");

	function match(){
		let childElems = childRefs.current as Element[];
		let props = propRefs.current as (Node|null)[];
		
		if(matches){
			if(onMatch){
				onMatch(childElems);
			}else{
				for(let i = 0;i<childElems.length;i++){
					let prop = props[i];
					let child = childElems[i];
					if(!child) return;
	
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
			}
		}else{
			if(onUnmatch){
				onUnmatch(childElems);
			}else{
				for(let i = 0;i<childElems.length;i++){
					let child = childElems[i];
					if(!child) return;
	
					switch(hidingType){
						case "display": case "visibility":
							child.classList.add(className);
							break;
						case "dom":{
							let parent = props[i] as Node;
							if(!parent){
								props[i] = child.parentNode;
							}
							if(child.parentNode || parent){
								child.remove();
							}
						} break;
				}
			}
		}
	}

	
	useEffect(()=>{
		let childElems = childRefs.current as Element[];
		for(let i = 0;i<childElems.length;i++){
			let child = childElems[i];
			if(!child) return;
			child.classList.remove(className);
		}

		if(!hideOnRender){
			injectStyleInDocument();

			for(let i = 0;i<childElems.length;i++){
				let child = childElems[i];
				if(!child) return;
				switch(hidingType){
					case "display": case "visibility":
						child.classList.add(className);
						break;
				}
			}
		}
		match();

		
	})

	
	useEffect(() => {
		if(!hideOnRender){
			let childElems = childRefs.current as Element[];
			for(let i = 0;i<childElems.length;i++){
				let child = childElems[i];
				if(!child) return;
				switch(hidingType){
					case "dom":{
						let parent = child.parentNode;
						if(parent && !matches){
							propRefs.current[i] = parent;
						}
					} break;
				}
			}
			match();
		}
	},[matches])

	return (
		<>
			{
				(matches || !hideOnRender) && childs
			}
		</>
	)
})