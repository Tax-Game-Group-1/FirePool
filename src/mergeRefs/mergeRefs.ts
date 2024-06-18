import React from "react";

/**
 * Allows to use multiple refs on a single React element.
 * Supports both functions and ref objects created using createRef() and useRef().
 *
 * Usage:
 * ```jsx
 * <div ref={mergeRefs(ref1, ref2, ref3)} />
 * ```
 *
 * @param {...Array<Function|Object>} inputRefs Array of refs
 */
export function mergeRefs(...inputRefs:(Function|React.MutableRefObject<any>)[]) {
	return (ref:React.MutableRefObject<any>) => {
		inputRefs.forEach((inputRef) => {
			if (!inputRef) {
				return;
			}
			if (typeof inputRef === 'function') {
				(inputRef as Function)(ref);
			} else {
			// eslint-disable-next-line no-param-reassign
				inputRef.current = ref;
			}
		});
	};
}