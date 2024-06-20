"use client"

import { computed, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { GameGlobal } from "../global";
import { getIconURL } from "@/utils/utils";
import { findData, getData } from "../dummyData";
import { GameCard } from './GameCard';
import { IRoomData } from "@/interfaces";
import { AddIcon } from "@/assets/svg/svg";
import SignalEventBus from "@catsums/signal-event-bus";

import t from "../../elements.module.scss";
import { useEffect, useState } from "react";
import { currGame, goToSection, PageSection, setCurrentGame } from "./page";
import { createPopUp } from "@/components/PopUp/PopUp";

import {getGames, games} from "@/app/host/page"

export let gameCode = computed(()=>{
	let code = GameGlobal.roomData.value?.id || "";
	let mid = Math.trunc(code.length/2);
	code = [code.slice(0, mid), code.slice(mid)].join("-");

	return code;
});
export let hostID = computed(()=>{
	let id = GameGlobal.hostData.value?.id || "";
	return id;
});
export let hostName = computed(()=>{
	let name = GameGlobal.hostData.value?.name || "";
	return name;
});

export let iconURL = computed(()=>{
	let url = GameGlobal.playerData.value?.icon || getIconURL();

	return url;
})


export let gameCardsSignal = new SignalEventBus();

export function GameCardsContainer(){
	useSignals();

	let [hostGames, setHostGames] = useState([]);


	useEffect(()=>{

		getGames();

		return () => {};

	},[]);

	let rooms:IRoomData[] = games.value;

	let gameCards = rooms.map((game, i) => {
		games.value;
		return (
			<GameCard key={game.id} name={game.name} onClick={()=>{
				setCurrentGame(game.id);
			}}>
				<img className={`rounded-md`} src={game.icon || getIconURL(game.id).href} alt={`${game.name} icon`}/>
			</GameCard>
		)
	})
	gameCards.unshift(
		<GameCard onClick={()=>{
			currGame.value = null;
			goToSection(PageSection.Create);
		}} key={-1} name={"Create Game"}>
			<AddIcon className={`${t.fillAccent} p-6`}/>
		</GameCard>
	)

	return (
		<div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1 lg:p-4 overflow-auto h-auto`}>
			{gameCards}
		</div>
	)


}
