"use client"

import { computed, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { GameGlobal } from "../global";
import { getIconURL } from "@/utils/utils";
import { findData, getData } from "../dummyData";
import { GameCard } from './GameCard';
import { AddIcon } from "@/assets/svg/svg";
import SignalEventBus from "@catsums/signal-event-bus";

import t from "../../elements.module.scss";
import { useEffect, useState } from "react";
import { currGame, goToSection, PageSection, setCurrentGame, unsetCurrentGame } from "./page";
import { createPopUp } from "@/components/PopUp/PopUp";

import {getGames, games} from "@/app/host/page"

export let gameCode = computed(()=>{
	let code = GameGlobal.room.value?.id || "";
	let mid = Math.trunc(code.length/2);
	code = [code.slice(0, mid), code.slice(mid)].join("-");

	return code;
});
export let hostID = computed(()=>{
	let id = GameGlobal.user.value?.id || "";
	return id;
});
export let hostName = computed(()=>{
	let name = GameGlobal.user.value?.name || "";
	return name;
});

export let iconURL = computed(()=>{
	let url = GameGlobal.player.value?.iconURL || getIconURL();

	return url;
})


export let gameCardsSignal = new SignalEventBus();

export function GameCardsContainer(){
	useSignals();

	let [hostGames, setHostGames] = useState([]);


	useEffect(()=>{

		if(hostID.value){
			getGames();
		}

		return () => {};

	},[]);

	let rooms = games.value;

	let gameCards = rooms.map((game, i) => {
		return (
			<GameCard key={game.gameId} name={game.name} onClick={()=>{
				setCurrentGame(game);
			}}>
				<img className={`rounded-md`} src={getIconURL(game.gameId).href} alt={`${game.name} icon`}/>
			</GameCard>
		)
	})
	gameCards.unshift(
		<GameCard onClick={()=>{
			goToSection(PageSection.Create);
			unsetCurrentGame();
		}} key={0} name={"Create Game"}>
			<AddIcon className={`${t.fillAccent} p-6`}/>
		</GameCard>
	)

	return (
		<div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1 lg:p-4 overflow-auto h-auto`}>
			{gameCards}
		</div>
	)


}
