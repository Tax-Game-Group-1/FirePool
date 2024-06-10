'use client'
import t from '../themes.module.scss'
import s from './join.module.scss'
import {useTheme} from "@/app/themecontext";
import {useRouter} from "next/navigation";
import {socket} from "@/socket"
import { useRef } from 'react';

export default function JoinGame() {
    const {getThemeClass} = useTheme();
    const router = useRouter();
    const roomCode = useRef(null);
    
    const checkRoomCode = () => {
        let code = roomCode.current.value;
        //see that room code is correct and connect to server
        socket.emit("joinGame",{code});

        socket.on("joinedGame",(data)=>{
            // let {id} = data
            // localStorage.setItem("playerID", id);

            console.log("SUCCESS")
            console.log(data);
            //goes to page where you set your name in waiting room
            // router.push('/inGame')
        })
    }

    return (
        <div className={getThemeClass()}>
            <div className={[s.container, t.gradient].join(' ')}>
                <div>
                    <p className={s.message}>Enter the game code to join</p>
                    <hr className={s.rule}/>
                </div>

                <div className={[s.center, t.solidElement].join(' ')}>
                    <img  className={s.createImage} src={'images/create.png'}/>
                    <div className={s.room}/>
                    <div>
                        <p>Room code:</p>
                        <input type={'text'} className={s.input} ref={roomCode}/>
                    </div>
                    <button className={s.button}
                            onClick={() => checkRoomCode()}
                    >Enter Room</button>
                </div>
                <div className={[s.return, t.solidElement].join(' ')}>
                    <button><img style={{'transform': 'rotate(180deg)'}}
                                 src={'/images/icons/arrow.svg'}/>
                        Return to Main Menu
                    </button>
                </div>
            </div>
        </div>
    )
}