"use client"

import dynamic from 'next/dynamic'
import { useState, forwardRef, Ref } from 'react';
import GameHUD, {WorldHUD, PlayerHUD} from '@/components/Game/GameHUD'
import GameFooter from '@/components/Game/GameFooter'
import GameContentContainer, { GameContent } from '@/components/Game/GameContentContainer'
import AnimationContainer from '@/components/AnimationContainer/AnimationContainer';
import { ContentLayer, ContentLayersContainer } from '@/components/Game/ContentLayer';

const MatchMedia = dynamic(async() => {
	let x = await import('@/components/useMediaQuery/useMediaQuery')
	return x.MatchMedia;
}, { ssr: false })


const Layouts = forwardRef(function Layouts({}, ref:Ref<any>) {

	let gameContent = (
		<GameContentContainer>
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
				<GameContent className="absolute self-end m-2">
					<div className="min-w-24 aspect-square bg-green-200"></div>
				</GameContent>
			</AnimationContainer>
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
						delay: 0.1,
					}
				}}
			>
				<GameContent className="absolute self-center m-2">
					<div className="min-w-24 aspect-square bg-blue-200"></div>
				</GameContent>
			</AnimationContainer>
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
						delay: 0.2,
					}
				}}
			>
				<GameContent className="absolute self-start m-2">
					<div className="min-w-24 aspect-square bg-red-200"></div>
				</GameContent>
			</AnimationContainer>
		</GameContentContainer>
	)

	const MobileLayout = forwardRef(function Layout({}, ref:Ref<any>) {
		return(
			<div ref={ref} className="max-h-svh max-w-svw h-screen w-screen overflow-hidden bg-white text-white grid grid-rows-12 gap-2 p-2">
				<main className="row-span-11 bg-black rounded-md flex p-2 mb-8 relative justify-center items-center">
					<ContentLayersContainer>
						<ContentLayer>
							<GameHUD>
								<WorldHUD/>
								<PlayerHUD/>
							</GameHUD>
						</ContentLayer>

						<ContentLayer>
							{gameContent}
						</ContentLayer>

					</ContentLayersContainer>
				</main>
				<GameFooter/>
			</div>
		);
	});

	const PCLayout = forwardRef(function Layout({}, ref:Ref<any>) {
		return(
			<div ref={ref} className="max-h-svh max-w-svw h-screen w-screen overflow-hidden bg-white text-white grid grid-rows-12 gap-2 p-2">
				<main className="row-span-11 bg-black rounded-md flex p-2 relative justify-center items-center">
					<ContentLayersContainer>
						<ContentLayer>
							<GameHUD>
								<WorldHUD/>
								<PlayerHUD/>
							</GameHUD>
						</ContentLayer>

						<ContentLayer>
							{gameContent}
						</ContentLayer>

					</ContentLayersContainer>
				</main>
				<GameFooter/>
			</div>
		);
	});

	return (
		<>
			<MatchMedia 
				query={["xs","sm"]}
				hidingType="display"
			>
				<MobileLayout/>
			</MatchMedia>
			<MatchMedia 
				query={{
					"min-width":"lg"
				}}
				hidingType="display"
			>
				<PCLayout/>
			</MatchMedia>
		</>
	)
});

export default Layouts;
