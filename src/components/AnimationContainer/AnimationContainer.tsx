"use client"

import React, {Children, cloneElement, forwardRef, LegacyRef, Ref, RefObject, useEffect, useRef, useState} from 'react'

import { DOMKeyframesDefinition, useAnimate, ValueAnimationOptions, ValueAnimationTransition } from 'framer-motion'

export function useDelayUnmount(
	isMounted: boolean,
	scopeRef:LegacyRef<any>,
	enter?: IAnimationSettings | ((arr:Element[])=>void),
	exit?: IAnimationSettings | ((arr:Element[])=>void),
){
    const [ shouldRender, setShouldRender ] = useState(false);
	let [scope, animate] = useAnimate();

    useEffect(() => {
		//for every update
        let anim;
		let scopes:Element[] = [];
		if(scopeRef){
			scopes = (scopeRef as any).current as Element[];
		}
		//if element is going to be mounted, render it
        if (isMounted && !shouldRender) {
			if(typeof enter == "object"){
				anim = animate(scopes, enter?.animations, enter?.options);
			}else if(typeof enter == "function"){
				enter(scopes);
			}
			setShouldRender(true);
        }
		//if element is going to be unmounted, unrender it
        else if(!isMounted && shouldRender) {
			if(typeof exit == "object"){
				anim = animate(scopes, exit?.animations, exit?.options);
				anim.then(()=>{
					setShouldRender(false);
				})
			}else if(typeof exit == "function"){
				exit(scopes);
				setShouldRender(false);
			}else{
				setShouldRender(false);
			}
        }
        return () => {
			//idk what to do here
			//this is meant to clear the animation
		};
    }, [animate, enter, exit, isMounted, scopeRef, shouldRender]);

    return shouldRender;
}

const AnimationContainer = forwardRef(function AnimationContainer({children=[], enter={}, className="", exit={}}:{
	children?: React.ReactNode,
	enter?: IAnimationSettings | ((arr:Element[])=>void),
	exit?: IAnimationSettings | ((arr:Element[])=>void),
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