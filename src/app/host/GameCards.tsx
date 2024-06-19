"use client"

import { computed } from "@preact/signals-react";
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

export let games = computed(()=>{
	//dependancies
	GameGlobal.hostData.value;
	GameGlobal.roomData.value;

	let rooms = findData("rooms", {
		host: hostID,
	});

	return rooms;
})

export function GameCardsContainer(){
	useSignals();

	let [hostGames, setHostGames] = useState([]);

	async function getGames(){
		//fetch function here
	}

	useEffect(()=>{

		getGames();

		return () => {};

	},[]);

	let rooms:IRoomData[] = hostGames;

	let gameCards = rooms.map((game, i) => {
		games.value;
		return (
			<GameCard key={game.id} name={game.name}>
				<img className={`rounded-md`} src={getIconURL(game.id).href} alt={`${game.name} icon`}/>
			</GameCard>
		)
	})
	if(!gameCards.length){
		gameCards.push(
			<GameCard key={-1} name={"Create Game"}>
				<AddIcon className={`${t.fillAccent} p-6`}/>
			</GameCard>
		)
	}

	return (
		<div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1 lg:p-4 overflow-auto h-auto`}>
			{gameCards}
		</div>
	)


}
