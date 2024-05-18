"use client";
import Statbox from "@/app/declare/statbox/statbox";
import s from './delclare.module.scss'
import t from '../themes.module.scss'
import { useState} from "react";
import {ThemeProvider, useTheme} from "@/app/themecontext";

const MAX_TAX_RATE = 70;
const MIN_TAX_RATE = 20;

export default function Declare(props: { name: string, taxRate: number, year: number, universeFunds: number }) {


  const { toggleTheme, getThemeClass } = useTheme();

  const [num, setNum] = useState<number>(props.taxRate);
  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = +event.target.value; // Convert to number
    if (!isNaN(value)) {
      setNum(value);
    } else {
      setNum(MIN_TAX_RATE)
    }
  }

  const handleBlur = () => {
    if (num == undefined || isNaN(num as number) || num < MIN_TAX_RATE)
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
      <main className={[getThemeClass(), t.background].join(' ')}>
        <div className={[s.container].join(' ')}>
          <div className={[s.content, t.solidWindow].join(' ')}>
            <div className={[s.statBox, t.solidElement].join(' ')}>
              <Statbox name={props.name} taxRate={props.taxRate} universeFunds={props.universeFunds}
                       year={props.year}/>
            </div>
            <div className={[s.declare, t.solidElement].join(' ')}>
              <div>
                <p>What is this year's tax rate going to be?</p>
                <div className={s.inputOuter}>
                  <div className={s.inputContainer}>
                    <input
                        className={s.input}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={num || ''}/>
                    <div>
                      <img
                          src={"images/icons/arrow.svg"}
                          onClick={decrement}/>
                      <img
                          src={"images/icons/arrow.svg"}
                          onClick={increment}/>
                    </div>
                  </div>
                  <div className={s.percentage}>
                    %
                  </div>
                </div>
              </div>
              <div className={[s.buttons, t.textBoxFontColor].join(' ')}>
                <button>Confirm<img src={"images/icons/tick.svg"}/></button>
                <button>Cancel<img src={"images/icons/cross.svg"}/></button>
              </div>
            </div>

          </div>
          <div className={[t.toolBar, s.toolbar].join(' ')}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <button onClick={() => toggleTheme()} className={t.solidElement}></button>
          </div>
        </div>
      </main>
  )
}