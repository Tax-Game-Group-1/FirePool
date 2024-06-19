"use client"

import React, { useEffect } from 'react'
import Btn from '@/components/Button/Btn'
import { ContentLayer } from '@/components/Game/ContentLayer'
import NotifContainer from '@/components/Notification/Notification'
import { PopUpContainer } from '@/components/PopUp/PopUp'

import t from "../../elements.module.scss"
import "../page.scss"
import { PlayerCard } from '../game/_waiting/PlayerCard'
import { AvatarIcon } from '../game/_waiting/namingRoom'
import { signal, computed } from '@preact/signals-react'
import { useTheme } from '@/components/ThemeContext/themecontext'
import { BinIcon, ExitDoor, PlayIcon, UserIcon } from '@/assets/svg/svg'
import SVGIcon from '@/components/SVGIcon/SVGIcon'
import { GameCardsContainer } from './GameCards'
import { IRoomData } from '@/interfaces'
import { getIconURL } from '@/utils/utils'
import { EditTextIcon } from '../../assets/svg/svg';
import { GameGlobal } from '../global'
import MainSection from './_sections/MainSection'
import CreateSection from './_sections/CreateSection'

export let hostID = computed(()=>{
	let id = GameGlobal.hostData.value?.id || "";
	return id;
});
export let hostName = computed(()=>{
	let name = GameGlobal.hostData.value?.name || "";
	return name;
});

export let currGame = signal<IRoomData>({
	id: "1A2B3C4D",
	name: "Game 1",
	year: 1,
	host:  "1234abcd",
	players: [
		"1234abcd",
		"01235you",
		"12443ghy",
		"abcd3456",
		"1234abce",
	],
	worlds: [
		"1234abcd"
	],
	taxCoeff: 1.5,
	maxNumberOfPlayers: 20,
	penalty: 0.3,
	kickPlayersOnBackruptcy: true,
	auditProbability: 0.1,
});

export enum PageSection {
	Main,
	Create,
}

let currSection = signal(PageSection.Create);

export function goToSection(section: PageSection) {
	
}

export default function Page() {

	const {theme} = useTheme();

	let url = getIconURL(currGame.value.id);

	let section = <></>;
	switch(currSection.value) {
		case PageSection.Main:
			section = <MainSection/>
			break;
		case PageSection.Create:
			section = <CreateSection/>
			break;
	}

	return (
		<main className={`${theme} h-screen w-screen flex flex-row p-8 justify-evenly items-center`}>
			{section}
			<ContentLayer z={10}>
				<NotifContainer></NotifContainer>
			</ContentLayer>
			<ContentLayer z={10}>
				<PopUpContainer></PopUpContainer>
			</ContentLayer>
		</main>
	)
}
