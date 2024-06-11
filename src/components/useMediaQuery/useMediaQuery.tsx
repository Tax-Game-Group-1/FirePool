"use client"
import { useState, useCallback, useEffect, forwardRef, Children, cloneElement, LegacyRef, useRef } from "react"
import _ from "lodash";

import { MediaWidthBreakPoints } from "./breakpoints";

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
export const MatchMedia = forwardRef(function MediaQuery({children=[], query}:{
	children?: React.ReactNode,
	query: string | MediaQueryList | IMediaQuery | IMediaQuery[],
}, ref:LegacyRef<any>) {
	
	let matches = useMediaQuery(query);
	let childRefs = useRef<any[]>([]);

	let childs = Children.map(children as any, (child:any,i) =>
		cloneElement(child, {
			ref: (r: any)=>{
				if(ref && typeof ref === "object"){
					ref.current[i] = r;
				}
				childRefs.current[i] = r;
			},
		})
	);

	return (
		<>
			{
				matches && <>{childs}</>
			}
		</>
	)
})