import {NextResponse} from "next/server";

/**
 * Handles setting up the games
 * When an admin signs in they can create a game
 * Use a post request to set up the game and push it to the database
 * Use a get request to get all games and list them
 */

// {
//     "name": "newGame",
//     "maxNoPlayers": 10,
//     "penalty":0.3,
//     "auditProbability":0.1,
//     "kickPlayersOnBankruptcy": true
// }

export async function POST(request: Request) {
    const data = await request.json();
    console.log("POST REQUEST")
    console.log(data);
    return NextResponse.json({
        status: "success"
    })

}