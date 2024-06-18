"use client"

import s from '../page.module.scss';
import t from '../../../elements.module.scss'
import { UserIcon, CaretArrow } from '@/assets/svg/svg';
import Btn from '@/components/Button/Btn';
import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { useSignalEvent } from '@catsums/signal-event-bus';
import { useState } from 'react';
import { PageSection, homePageSectionBus, goToSection } from '../page';
import { FixedContents } from './FixedContents';
import { HomeCard } from '../HomeCard';

export function StartSection(){

	let [active, setActive] = useState(false);

	useSignalEvent("section",(section:PageSection)=>{
		
		setActive(section == PageSection.Start);
	}, homePageSectionBus);

	let activeClass = active ? "pointer-events-auto" : "pointer-events-none";

	return (
		<section className={`${activeClass} min-h-[100vh] min-w-[100vw] w-max absolute top-[100vh] left-0 flex flex-col justify-evenly items-center ${t.gradient} ${t.solidText}`}>
			<h2 className={s.prompt}>What would you like to do?</h2>
			<div className={`flex flex-row justify-around items-center w-1/2`}>
				<HomeCard icon={<UserIcon/>} text={"Host Game"}
					onClick={()=>{
						goToSection(PageSection.Login);
					}}
				/>
				<HomeCard icon={<UserIcon/>} text={"Join Game"}
					onClick={()=>{
						goToSection(PageSection.Join);
					}}
				/>
			</div>

			<div className={`${s.backToTop} flex justify-center items-center`}>
				<Btn
					onClick={()=>{
						goToSection(PageSection.Splash);
					}}
				>
					<div className={`flex justify-center items-center`}>
						<div>Back to top</div>
						<div className={`aspect-square w-10 ${t.fillSolidText}`}>
							<SVGIcon>
								<CaretArrow/>
							</SVGIcon>
						</div>
					</div>
				</Btn>
			</div>
			{active && <FixedContents/>}
		</section>
	)
}

