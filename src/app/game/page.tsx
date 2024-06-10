"use client";
import {useState} from "react";

enum State {
    CHARACTER_SELECTION,
    AWAITING_ROLE,
    REVEAL_ROLE
}

export default function InGame() {
    const [gameState, setGameState] = useState(State.CHARACTER_SELECTION);

    return (
        <>
            {
                gameState == State.CHARACTER_SELECTION &&
                    <div>Selection</div>
            }
        </>
    )


}