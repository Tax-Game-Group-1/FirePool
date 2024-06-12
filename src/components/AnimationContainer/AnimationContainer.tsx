"use client"

import React, {Children, cloneElement, forwardRef, LegacyRef, Ref, RefObject, useEffect, useRef, useState} from 'react'

import { DOMKeyframesDefinition, useAnimate, ValueAnimationOptions, ValueAnimationTransition } from 'framer-motion'

function useDelayUnmount(
	isMounted: boolean,
	scopeRef:LegacyRef<any>,
	enter?: {
		options?: ValueAnimationTransition,
		animations?: DOMKeyframesDefinition,
	},
	exit?: {
		options?: ValueAnimationTransition,
		animations?: DOMKeyframesDefinition,
	},
){
    const [ shouldRender, setShouldRender ] = useState(false);
	let [scope, animate] = useAnimate();

    useEffect(() => {
        let anim;
		let scopes:Element[] = [];
		if(scopeRef){
			scopes = (scopeRef as any).current as Element[];
		}
        if (isMounted && !shouldRender) {
			if(enter){
				anim = animate(scopes, enter?.animations, enter?.options);
			}
			setShouldRender(true);
        }
        else if(!isMounted && shouldRender) {
			if(exit){
				anim = animate(scopes, exit?.animations, exit?.options);
				anim.then(()=>{
					setShouldRender(false);
				})
			}else{
				setShouldRender(false);
			}
        }
        return () => {
			//idk what to do here
		};
    }, [isMounted, shouldRender]);

    return shouldRender;
}

const AnimationContainer = forwardRef(function AnimationContainer({children=[], enter={}, className="", exit={}}:{
	children?: React.ReactNode,
	enter?: {
		options?: ValueAnimationTransition,
		animations?: DOMKeyframesDefinition,
	};
	exit?: {
		options?: ValueAnimationTransition,
		animations?: DOMKeyframesDefinition,
	};
	className?: string,
	// [key:string]: any,
}, ref:Ref<any>) {

	let [ isMounted, setIsMounted ] = useState(false);

	let scopeRef = useRef<any[]>([]);
	let shouldRender = useDelayUnmount(isMounted, scopeRef, enter, exit);

	useEffect(()=>{
		setIsMounted(true);
		return ()=>{
			setIsMounted(false);
		}
	})

	let childs = Children.map(children as any, (child:any,i) =>
		cloneElement(child, {
			className: `${child?.props?.className || ""} ${className}`,
			ref: (r: any)=>{
				if(ref && typeof ref === "object"){
					ref.current[i] = r;
				}else if(typeof ref === "function"){
					ref(r);
				}
				scopeRef.current[i] = r;
			},
		})
	);

	return (
		<>
			{childs}
		</>
	)
})

export default AnimationContainer;