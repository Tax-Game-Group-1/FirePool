"use client";
import Statbox from "@/app/declare/statbox/statbox";
import s from './delclare.module.scss'
import d from '../darktheme.module.scss'
import {useMemo, useState} from "react";

const MAX_TAX_RATE = 70;
const MIN_TAX_RATE = 20;

export default function Declare(props: { name: string, taxRate: number , year: number, universeFunds: number}) {
    let t = d; //set for light and dark

    const [num, setNum] = useState<number | null>(props.taxRate);
    const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
       const value = +event.target.value; // Convert to number
        if (!isNaN(value)) {
            setNum(value);
        } else {
            setNum(MIN_TAX_RATE)
        }
    }

    const handleBlur = () => {
        if (isNaN(num) || num < MIN_TAX_RATE)
            setNum(MIN_TAX_RATE)
        else if (num > MAX_TAX_RATE)
            setNum(MAX_TAX_RATE)
    }

    const increment = () => {
        num <= MAX_TAX_RATE - 5 && setNum(num + 5);
        handleBlur();
    }
    const decrement = () => {
        num >= MIN_TAX_RATE + 5 && setNum(num - 5);
        handleBlur();
    }

    return (
        <>
            <div className={[s.container, t.background].join(' ')}>
                <div>
                    <div className={s.statBox}>
                        <Statbox name={props.name} taxRate={props.taxRate} universeFunds={props.universeFunds}
                                 year={props.year}/>
                    </div>
                    <div className={[s.declare, t.solidWindow].join(' ')}>
                        <div>
                            <p>What is this year's tax rate going to be?</p>
                            <div className={s.inputOuter}>
                                <div className={s.inputContainer}>
                                    <input
                                        className={s.input}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={num || ''}
                                    />
                                    <div>
                                        <img
                                            src={"images/icons/arrow.svg"}
                                            onClick={decrement}/>
                                        <img
                                            src={"images/icons/arrow.svg"}
                                            onClick={increment}/>
                                    </div>
                                </div>
                                <div>
                                    %
                                </div>
                            </div>
                        </div>
                        <div className={s.buttons}>
                            <button>Confirm<img src={"images/icons/tick.svg"}/></button>
                            <button>Cancel<img src={"images/icons/cross.svg"}/></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={t.toolBar}>
                <p>toolbar</p>
            </div>
        </>

    )
}