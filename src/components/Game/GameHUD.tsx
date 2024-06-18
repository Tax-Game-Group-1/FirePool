
import React, { forwardRef, Ref } from "react"

import style from "./GameHUD.module.scss"

const GameHUD = forwardRef(function GameHUD({children}:{
	children?: React.ReactNode
}, ref:Ref<any>){	
	return (
		<div ref={ref} className={style.gameHUD}>
			{children}
		</div>
	)
});

export { PlayerHUD } from "./PlayerHUD";
export { WorldHUD } from "./WorldHUD";

export default GameHUD;