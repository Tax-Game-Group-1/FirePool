"use client"

import React, {Children, cloneElement, forwardRef, LegacyRef, Ref, RefObject, useEffect, useRef, useState} from 'react'

import { DOMKeyframesDefinition, useAnimate, ValueAnimationOptions, ValueAnimationTransition } from 'framer-motion'

/**
 * An interface for animation settings for FramerMotion
 */
export interface IAnimationSettings {
	options?: ValueAnimationTransition,
	animations?: DOMKeyframesDefinition,
}

/**
 * This hook allows for an animation to play when the functional component is mounted and unmounted. 
 * This is normally used in the animation container, but can be used in other hook or component to do the same.
 * This makes use of FramerMotion's `useAnimate()` to run animations.
 * 
 * @param isMounted 
 * Checks if the component is mounted in the virtual DOM
 * @param scopeRef 
 * A reference to the element(s) to be animated
 * @param enter 
 * Animation settings for the `useAnimate()` inside the hook to animate as the component gets mounted.
 * This can also be a custom function to do your own animations to the children directly.
 * @param exit 
 * Animation settings for the `useAnimate()` inside the hook to animate as the component gets unmounted.
 * This can also be a custom function to do your own animations to the children directly.
 * @returns 
 * A state of `boolean` the determines whether to render the element
 */
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

/**
 * A wrapper component that allows for adding FramerMotion animations or custom animations from a function to its children.
 * This allows for custom functions that do not make use of FramerMotion as well, such as wanting to use animejs, gsap or even hard-coded JS animations.
 * 
 * @example 
 * Here is an example that does not make use of the FramerMotion settings at all, but uses `animejs`
 * 
 * ```tsx
 * 	<AnimationContainer enter={(childElements)=>{
 * 		anime({
 * 			target: childElements, //targets the child elements in this container
 * 			opacity: [0, 1], //opacity from 0 to 1
 * 			duration: 500, //for 0.5 seconds
 * 		})
 * 	}}>
 * 		<div className="">A</div>
 * 	</AnimationContainer>
 * ```
 * 
 * @example 
 * Here is another example that only makes use of `requestAnimationFrame()` to perform an animation:
 * 
 * ```tsx
 * 	function animateElements(childElements:Element){
 * 		let duration = 2000;
 * 		let elapsed = 0;
 * 		let startTime = -1;
 * 		let prevTimeStamp = -1;
 *		let done = false;
 * 
 * 		function onFrame(timeStamp){
 * 			if(startTime < 0){
 * 				startTime = timeStamp;
 * 			}
 * 			elapsed = timeStamp - startTime;
 * 			if(prevTimeStamp != timeStamp){
 * 				for(let child of childElements){
 * 					let count = Math.min(0.1 * elapsed, 200);
 * 					child.style.translate = `${count}px 0`;
 * 					if(count == 200) done = true;
 * 				}
 * 			}
 * 			if(elapsed < duration){
 * 				prevTimeStamp = timeStamp
 * 				if(!done){
 * 					requestAnimationFrame(onFrame);
 * 				}
 * 			}
 * 		}
 * 
 * 		requestAnimationFrame(onFrame);
 * 	}
 * ///adding function to enter prop
 * 	<AnimationContainer enter={animateElements}>
 * 		<div className="">A</div>
 * 	</AnimationContainer>
 * ```
 * 
 * @param children The child components meant to be animated. Normally this animates components that can be referenced (allows for a ref to be passed)
 * @param enter 
 * Animation settings for the `useAnimate()` inside the hook to animate as the component gets mounted.
 * This can also be a custom function to do your own animations to the children directly.
 * @param exit 
 * Animation settings for the `useAnimate()` inside the hook to animate as the component gets unmounted.
 * This can also be a custom function to do your own animations to the children directly.
 * @param className 
 * Adds some class names to the children meant to be animated that you want
 * @param ref 
 * A ref that can be passed to reference the children. This is a forwarded React Ref.
 * @returns
 * A component that wraps the children and does not add anything extra other than the children itself to the DOM
 */
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
				if(ref && typeof ref === "object" && ref.current){
					ref.current[i] = r;
				}else if(ref && typeof ref === "function"){
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