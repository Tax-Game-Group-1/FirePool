"use client";
import Statbox from "@/app/declare/statbox/statbox";
import s from './delclare.module.scss'
import t from '../themes.module.scss'
import React, {ChangeEventHandler, useEffect, useState} from "react";
import {ThemeProvider, useTheme} from "@/app/themecontext";

const MAX_TAX_RATE = 70;
const MIN_TAX_RATE = 20;

enum GameState {
  DECLARE,
  NEW_YEAR,
  RECEIVED
}

function newYearComponent(setDiceHover: (value: (((prevState: boolean) => boolean) | boolean)) => void, diceHover: boolean, setGameState: (value: (((prevState: GameState) => GameState) | GameState)) => void) {
  return <div className={[s.declare, t.solidElement].join(' ')}>
    <p>New year has begun</p>
    <img className={s.roundBorder} src={'images/currency.png'}/>
    <div>It is time to receive your income</div>
    <p>Press to receive:</p>
    <img
        style={{marginTop: '10px'}}
        onMouseOver={() => setDiceHover(true)}
        onMouseOut={() => setDiceHover(false)}
        src={diceHover ? 'images/dice-hover.png' : 'images/dice-normal.png'}
        onClick={() => setGameState(GameState.RECEIVED)}
    />
  </div>;
}

function RecievedComponent() {
  return <div className={[s.declare, t.solidElement].join(' ')}>
    <p>You received:</p>
    <div className={[s.roundBorder, s.receivedAmount].join(' ')}>
      <img src={'images/currency.png'}/>
      <div>1000.00</div>
    </div>
    <div className={s.small}>This is randomly generated</div>
    <p>Nice! What a good pay!</p>
    <button className={s.invertHover}>Proceed to taxes<img src={'images/tick.png'}/></button>
  </div>;
}

function DeclareComponent(props: {
  onChange: ChangeEventHandler<HTMLElement>;
  onBlur: () => void,
  num: number,
  disableDecrement: boolean,
  onDecrementClick: () => void,
  disableIncrement: boolean,
  onIncrementClick: () => void,
  onConfirmClick: () => void
}) {
  return <div className={[s.declare, t.solidElement].join(" ")}>
    <div>
      <p>What is this year&apos;s tax rate going to be?</p>
      <div className={s.inputOuter}>
        <div className={s.inputContainer}>
          <input
              className={s.input}
              onChange={props.onChange}
              onBlur={props.onBlur}
              value={props.num || ""}/>
          <div>
            <img
                className={
                  props.disableDecrement ? s.disabled : ""
                }
                src={"images/icons/arrow.svg"}
                onClick={props.onDecrementClick}/>
            <img
                src={"images/icons/arrow.svg"}
                className={
                  props.disableIncrement ? s.disabled : ""
                }
                onClick={props.onIncrementClick}/>
          </div>
        </div>
        <div className={s.percentage}>
          %
        </div>
      </div>
    </div>
    <div className={[s.buttons, t.textBoxFontColor].join(" ")}>
      <button className={t.buttonBackground} onClick={props.onConfirmClick}>Confirm<img src={"images/icons/tick.svg"}/>
      </button>
      <button className={t.buttonBackground}>Cancel<img src={"images/icons/cross.svg"}/></button>
    </div>
  </div>;
}

function ToolbarComponent(props: { onClick: () => void }) {
  return <div className={[t.toolBar, s.toolbar].join(" ")}>
    <div></div>
    <button onClick={props.onClick} className={t.solidElement}></button>
  </div>;
}

export default function Declare(props: { name: string, taxRate: number, year: number, universeFunds: number }) {

  const {toggleTheme, getThemeClass} = useTheme();

  const [num, setNum] = useState(props.taxRate || MIN_TAX_RATE);
  const [disableIncrement, setDisableIncrement] = useState(false);
  const [disableDecrement, setDisableDecrement] = useState(false);

  const [gameState, setGameState] = useState(GameState.DECLARE)

  const [diceHover, setDiceHover] = useState(false);
  const handleBlur = () => {
    if (num === undefined || isNaN(num) || num < MIN_TAX_RATE) {
      setNum(MIN_TAX_RATE);
    } else if (num > MAX_TAX_RATE) {
      setNum(MAX_TAX_RATE);
    }
  };

  const increment = () => {
    if (num <= MAX_TAX_RATE - 5) {
      setNum((prevNum) => prevNum + 5);
    }
  };

  const decrement = () => {
    if (num >= MIN_TAX_RATE + 5) {
      setNum((prevNum) => prevNum - 5);
    }
  };

  useEffect(() => {
    if (num === MAX_TAX_RATE) {
      setDisableIncrement(true);
    } else {
      setDisableIncrement(false);
    }

    if (num === MIN_TAX_RATE) {
      setDisableDecrement(true);
    } else {
      setDisableDecrement(false);
    }
  }, [num]);

  return (
      <main className={getThemeClass()}>
        <div className={t.background}>
          <div className={s.container} style={{height: '100vh'}}>
            <div className={[s.content, t.gradient].join(' ')}>

              <div className={[s.statBox, t.solidElement].join(' ')}>
                <Statbox name={props.name} taxRate={props.taxRate} universeFunds={props.universeFunds}
                         year={props.year}/>
              </div>

              {
                  gameState == GameState.DECLARE && //declare
                  <DeclareComponent onChange={(e) => setNum(Number((e.target as any).value))} onBlur={handleBlur} num={num}
                                    disableDecrement={disableDecrement} onDecrementClick={decrement}
                                    disableIncrement={disableIncrement} onIncrementClick={increment}
                                    onConfirmClick={() => setGameState(GameState.NEW_YEAR)}/>
              }

              {
                  gameState == GameState.NEW_YEAR &&
                  newYearComponent(setDiceHover, diceHover, setGameState)
              }

              {
                  gameState == GameState.RECEIVED &&
                  RecievedComponent()
              }

            </div>
            <ToolbarComponent onClick={() => toggleTheme()}/>
          </div>
        </div>
      </main>
  )
}