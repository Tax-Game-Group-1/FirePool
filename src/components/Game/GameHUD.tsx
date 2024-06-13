
import React, { forwardRef, Ref } from "react"

const GameHUD = forwardRef(function GameHUD({children}:{
	children?: React.ReactNode
}, ref:Ref<any>){	
	return (
		<div ref={ref} className="game-hud h-full w-full absolute top-0 right-0 p-2 bg-transparent flex flex-col items-end justify-between">
			{children}
		</div>
	)
});

export { PlayerHUD } from "./PlayerHUD";
export { WorldHUD } from "./WorldHUD";

export default GameHUD;