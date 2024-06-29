"use client"

import { MinimalSun, MinimalMountains, PlayIcon } from "@/assets/svg/svg";
import Btn from "@/components/Button/Btn";
import SVGIcon from "@/components/SVGIcon/SVGIcon";
import { useTheme } from "@/components/ThemeContext/themecontext";
import { useSignalEvent } from "@catsums/signal-event-bus";
import { useState } from "react";
import { PageSection, homePageSectionBus, goToSection } from "../page";
import { FixedContents } from "./FixedContents";

import Themes from "../../../components/ThemeContext/themes.module.scss"
import s from '../page.module.scss';
import t from '../../../elements.module.scss'
import { GameGlobal, saveGameGlobal } from "@/app/global";

function toggleTheme(){
	let themesArr = Object.values(Themes);
	let index = themesArr.indexOf(GameGlobal.theme.value);
	let newIndex = (index+1) % themesArr.length;
	console.log({index,newIndex, i:themesArr[index], n:themesArr[newIndex]})
    // setTheme(themesArr[newIndex]);
	GameGlobal.theme.value = themesArr[newIndex] as string;

	saveGameGlobal();
}

export function SplashSection(){
	// const { toggleTheme  } = useTheme();

	let [active, setActive] = useState(false);

	useSignalEvent("section",(section:PageSection)=>{
		
		setActive(section == PageSection.Splash);
	}, homePageSectionBus);

	let activeClass = active ? "pointer-events-auto" : "pointer-events-none";

	return (
		<section className={`${activeClass} min-h-[100vh] min-w-[100vw] h-screen w-min absolute top-0 ${t.solidElement} ${t.solidText}`}>
		<nav className={`${s.nav}`}>
		  <ul>
			<li>About Us</li>
			<li>Case Study</li>
		  </ul>
		  <ul>
			<li onClick={() => toggleTheme()}>Change theme</li>
		  </ul>
		</nav>
		<div className={`${s.container} p-10 lg:p-20 h-screen grid-rows-12 lg:grid-rows-none lg:grid-cols-12 gap-0`}>
		  <div className={`row-span-3 md:row-span-4 lg:col-span-4 relative z-20`}>
			<h1 className={s.heading}>Welcome to the Tax Game</h1>
			<p>
				{`
				Tax Game is an app that helps you understand taxes. You'll play through scenarios, learn about
			  deductions and government spending, and see how taxes affect the economy. 
				`}
			</p>
			<p>
				{`
				Customize your game,
			  play with friends, and make profits!
				`}
			</p>
		  </div>
		  <div className={`${t.strokeSolidText} items-center h-full relative z-10 flex flex-col row-span-3 lg:col-start-8 lg:col-end-12`}>
			<div className={`${s.mountain} opacity-20 lg:opacity-100 aspect-square w-96 lg:w-auto lg:self-stretch p-8 lg:p-2 m-0`}>
			  <MinimalSun className={`${s.splashImage} ${s.sun}`}/>
			  <MinimalMountains className={`${s.splashImage}`}/>
			</div>
			<div className={` flex items-center justify-center self-center opacity-100`}>
				<Btn 
					onClick={()=>{
						goToSection(PageSection.Start);
					}}
				>
					<div className={`flex gap-1`}>
						<div>{`Let's Begin`}</div>
						<div className={`aspect-square w-8 ${t.fillSolidText}`}>
							<SVGIcon>
								<PlayIcon/>
							</SVGIcon>
						</div>
					</div>
				</Btn>
			</div>
		  </div>
		</div>
		{active && <FixedContents/>}
	  </section>
	)
}