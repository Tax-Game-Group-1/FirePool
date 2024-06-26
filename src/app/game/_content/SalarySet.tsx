"use client"
import { GameContent } from "@/components/Game/GameContentContainer"
import React, { useRef, MouseEvent, useState, useEffect }  from "react"

import t from "../../../elements.module.scss";
import { CurrencyIcon } from "@/assets/svg/svg";
import { animate, useAnimate } from "framer-motion";

import _ from "lodash";
import { signal } from "@preact/signals-react";
import Btn from "@/components/Button/Btn";

import { useSignals } from "@preact/signals-react/runtime";
import AnimationContainer from "@/components/AnimationContainer/AnimationContainer";
import { GameGlobal } from "@/app/global";
import { GameState } from "@/interfaces";
import { switchGameState } from "./InGame";

let clickCount = signal(0);
let totalSalary = signal(0);

let showSalary = signal(false);

export function generateRandomSalary(num:number = 4){
    let min = 10;
    let max = 100;

    let salaries = [];
    for(let i=0; i< num; i++){
        salaries.push( _.random(min, max) );
    }

    return salaries;

}

export async function onProceedClick(){

    GameGlobal.player.value.salary = totalSalary;

    switchGameState(GameState.TaxDeclare)

}

export function showRealSalary(){
    showSalary.value = true;
}

export function SalaryDisplay(){

    let [scope, animate] = useAnimate();

    useEffect(()=>{
        let anim = animate(
            scope.current,{
                scale: [1, 1.3]
            },
            {
                duration: 0.4, 
                ease: "backInOut",
            }
        )

        return () => {
            anim.cancel();
        }
    },[])

    return (
        <div ref={scope} className={`text-3xl min-w-1/2 gap-2 p-2 px-6 rounded-md flex flex-row justify-center items-center ${t.toolBar}`}>
            <div className={`w-12 self-start aspect-square ${t.fillSolidText} rounded-full border ${t.solidBorder}`}>
                <CurrencyIcon/>
            </div>
            <div>
                {(totalSalary.value).toFixed(2)}
            </div>
        </div>
    )
}

export function SalaryBox({salary}:{
    salary:number,
}){

    let salaryRef = useRef(null);
    let boxRef = useRef(null);
    
    let [active, setActive] = useState(true);

    async function onClick(e:MouseEvent){
        if(!active) return;

        setActive(false);
        await animate(boxRef.current,{
            opacity: [1,0],
            rotate: [0, 360],
            y: [0, -100],
        }, {duration: 0.2, ease: "easeOut"})

        await animate(salaryRef.current,{
            scale: [1,1.4]
        }, {duration: 0.4, ease: "backInOut"})

        let c = clickCount.value;
        c++;
        clickCount.value = c;
        totalSalary.value = totalSalary.value + salary;

        console.log({c})
        if(c >= 4){
            console.log("YEEEE BOIII")
            showRealSalary();
        }

    }

    return (
        <div onClick={onClick} className={`col-span-1 row-span-1 relative flex justify-center items-center relative z-[2] ${t.toolBar} ${t.fillSolidText} flex justify-center w-full p-1 rounded-md aspect-square`}
            style={{
                pointerEvents: "all",
            }}
        >
            <div ref={salaryRef} className={`absolute flex justify-center`}  style={{
                pointerEvents: "all",
            }}>
                {"R "}{salary.toFixed(2)}
            </div>
            <div ref={boxRef} className={`relative ${t.toolBar} ${t.fillSolidText} w-full aspect-square justify-center items-center`}  style={{
                pointerEvents: "all",
            }}>
                <CurrencyIcon />
            </div>
        </div>
    )

}

export default function SalarySet() {
    useSignals();

    let salaries = generateRandomSalary();

    let boxes = salaries.map((salary,i)=>{
        return (
            <SalaryBox salary={salary} key={i} />
        )
    })

    return (
        <GameContent isSub className={`w-1/3 aspect-square justify-center items-center`}>
            
           {
            showSalary.value  == true &&

            <div className={`flex flex-col w-full m-2 p-2 gap-4 justify-around items-center`}>
                <div>
                    You received
                </div>
                <SalaryDisplay/>
                <div className={`text-xs`}>
                   This is randomly generated
                </div>
                <div className={``}>
                   <Btn onClick={onProceedClick}>
                        <div>Proceed</div>
                   </Btn>
                </div>
            </div>
            }

            {
                showSalary.value == false &&

                <div className={`grid grid-cols-2 grid-rows-2 gap-4 w-full`}>
                    {boxes}
                </div>
            }

        </GameContent>
    )

}