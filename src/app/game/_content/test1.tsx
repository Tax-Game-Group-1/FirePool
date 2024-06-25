import AnimationContainer from '@/components/AnimationContainer/AnimationContainer';
import Btn from '@/components/Button/Btn';
import { closeContent, contentSignalBus, createContent, GameContent } from '@/components/Game/GameContentContainer';
import { createPopUp } from '@/components/PopUp/PopUp';
import React from 'react'

export default function TestContent1() {
  return (
	<AnimationContainer 
		className="opacity-0" 
		enter={{
			animations:{
				opacity: [0,1],
				y: [-100, 0],
			},
			options:{
				duration: 0.5,
				ease: "circInOut",
				delay: 0.0,
			}
		}}
	>
		<GameContent className="absolute m-2" id="0001">
			<div className="flex flex-col justify-center items-center gap-4 p-8">
				<p>Click the button to summon the popup</p>
				<div className={``}>
					<Btn onClick={()=>{
						let main, sure : any;
						main = {
							content: "Forfeit life savings?",
							buttons:{
								"Yes": ()=>{
									closeContent("0001");
									// let {id} = createContent({
									// 	content: (
									// 		<p className="flex flex-col justify-center items-center gap-4 p-8">
									// 			{"Forfeited life savings"}
									// 		</p>
									// 	),
									// })
									// createContent({
									// 	content: (
									// 		<p className="flex flex-col justify-center items-center gap-4 p-8">
									// 			{"Forfeited life savings too"}
									// 		</p>
									// 	),
									// })

									// setTimeout(()=>{
									// 	closeContent(id);
									// }, 2000)	
								},
								"No": ()=>{
									createPopUp(sure);
								}
							}
						}
						sure = {
							content: "Are you sure?",
							buttons:{
								"Yes": ()=>{
									
								},
								"No": ()=>{
									createPopUp(main);
								}
							}
						}
						createPopUp(main)
					}}>Click</Btn>
				</div>
			</div>
		</GameContent>
	</AnimationContainer>
  )
}
