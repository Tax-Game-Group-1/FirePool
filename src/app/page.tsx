'use client'
import s from './page.module.scss'
import {useTheme} from "@/components/ThemeContext/themecontext";
import t from '../elements.module.scss'
import {transform} from "sucrase";
import {rotate} from "next/dist/server/lib/squoosh/impl";

export default function Home() {

  const { toggleTheme, theme  } = useTheme();

  return (
        <main className={`${s.splash} ${theme}`} id={"top"}>
          <section className={`${t.solidElement} ${t.solidText}`}>
            <nav className={s.nav}>
              <ul>
                <li>About Us</li>
                <li>Case Study</li>
              </ul>
              <ul>
                <li onClick={() => toggleTheme()}>Change theme</li>
              </ul>
            </nav>
            <div className={s.container}>
              <div>
                <h1 className={s.heading}>Welcome to the Tax Game</h1>
                <p>Tax Game is an app that helps you understand taxes. You'll play through scenarios, learn about
                  deductions and government spending, and see how taxes affect the economy. Customize your game,
                  play with friends, and make profits!</p>
              </div>
              <div>
                <div className={s.mountain}>
                  <img src="/images/sun.svg"/>
                  <img src="/images/mountains.svg"/>
                </div>
                <a href={"#bottom"}>
                  <div className={s.buttonContainer}>
                    <button className={[s.button, t.buttonBackground].join(' ')}>Let's begin<img
                        src="/images/icons/arrow.svg"/></button>
                  </div>
                </a>
              </div>
            </div>
          </section>
          <section id={"bottom"} className={`${t.gradient} ${t.solidText}`}>
            <h2 className={s.prompt}>What would you like to do?</h2>
            <div className={s.cards}>
              <div/>
              <div className={`${s.card} ${t.solidElement}`}>
                <img src="/images/create.png"/>
                <p>Create Game</p>
              </div>
              <div/>
              <div className={`${s.card} ${t.solidElement}`}>
                <img src="/images/join.png"/>
                <p>Join Game</p>
              </div>
              <div/>
            </div>

            <a href={"#top"}>
              <div className={[s.buttonContainer, s.backToTop].join(' ')}>
                <button className={[s.button, t.buttonBackground].join(' ')}>Back to top<img style={{transform: 'rotate(-90deg) translateX(10px)', paddingRight: '20px'}} src="/images/icons/arrow.svg"/></button>
              </div>
            </a>
          </section>
        </main>
  );
}

//card columns:
//grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
