'use client'
import s from './page.module.scss'
import {useTheme} from "@/components/ThemeContext/themecontext";
import t from '../elements.module.scss'
import {transform} from "sucrase";
import {rotate} from "next/dist/server/lib/squoosh/impl";
import Btn from '@/components/Button/Btn';
import { CaretArrow, MinimalSun, PlayIcon } from '@/assets/svg/svg';
import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { MinimalMountains } from '../assets/svg/svg';

export default function Home() {

  const { toggleTheme, theme  } = useTheme();

  return (
        <main className={`${s.splash} ${theme} overflow-auto`} id={"top"}>
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
            <div className={`${s.container} p-10 lg:p-20 h-screen grid-rows-12 lg:grid-rows-none lg:grid-cols-12 gap-0`}>
              <div className={`row-span-3 md:row-span-4 lg:col-span-4 relative z-20`}>
                <h1 className={s.heading}>Welcome to the Tax Game</h1>
                <p>Tax Game is an app that helps you understand taxes. You'll play through scenarios, learn about
                  deductions and government spending, and see how taxes affect the economy. Customize your game,
                  play with friends, and make profits!</p>
              </div>
              <div className={`${t.strokeSolidText} items-center h-full relative z-10 flex flex-col row-span-3 lg:col-start-8 lg:col-end-12`}>
                <div className={`${s.mountain} opacity-20 lg:opacity-100 aspect-square w-96 lg:w-auto lg:self-stretch p-8 lg:p-2 m-0`}>
                  <MinimalSun className={`${s.splashImage} ${s.sun}`}/>
                  <MinimalMountains className={`${s.splashImage}`}/>
                </div>
				<div className={`w-1/3 flex items-center justify-center self-center opacity-100`}>
					<Btn>
						<a href={"#bottom"} className={`flex gap-2`}>
							<div>{`Let's Begin`}</div>
							<div className={`aspect-square w-8 ${t.fillSolidText}`}>
								<SVGIcon>
									<PlayIcon/>
								</SVGIcon>
							</div>
						</a>
					</Btn>
				</div>
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

			<div className={`${s.backToTop} flex justify-center items-center`}>
				<Btn>
					<a href={"#top"} className={`flex justify-center items-center`}>
						<div>Back to top</div>
						<div className={`aspect-square w-10 ${t.fillSolidText}`}>
							<SVGIcon>
								<CaretArrow/>
							</SVGIcon>
						</div>
					</a>
				</Btn>
			</div>
          </section>
        </main>
  );
}

//card columns:
//grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
