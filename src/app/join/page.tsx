'use client'
import t from '../themes.module.scss'
import s from './join.module.scss'
import {useTheme} from "@/app/themecontext";
import {transform} from "sucrase";
import {rotate} from "next/dist/server/lib/squoosh/impl";

export default function JoinGame() {
    const {getThemeClass} = useTheme();

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
                        <input type={'text'} className={s.input}/>
                    </div>
                    <button className={s.button}>Enter Room</button>
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