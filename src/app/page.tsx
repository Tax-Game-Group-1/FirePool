'use client'
import s from './page.module.scss'
import {useTheme} from "@/components/ThemeContext/themecontext";
import t from '../elements.module.scss'
import {transform} from "sucrase";
import {rotate} from "next/dist/server/lib/squoosh/impl";
import Btn from '@/components/Button/Btn';
import { CaretArrow, MinimalSun, PlayIcon, UserIcon } from '@/assets/svg/svg';
import SVGIcon from '@/components/SVGIcon/SVGIcon';
import { MinimalMountains } from '../assets/svg/svg';

function HomeCard({icon, text}){
	return (
		<div className={` ${t.solidElement} ${s.card}`}>
			<div className={`${t.fillToolbar} ${t.textBoxBackground} aspect-square rounded-md p-8`}>
				{icon}
			</div>
			<div className={`flex justify-center`}>
				{text}
			</div>
		</div>
	)
}

export default function Home() {

  const { toggleTheme, theme  } = useTheme();

  return (
        <main className={`${s.splash} ${theme} overflow-auto`} id={"top"}>
          <section className={`${t.solidElement} ${t.solidText}`}>
            <nav className={`${s.nav}`}>
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
				<div className={` flex items-center justify-center self-center opacity-100`}>
					<a href={"#bottom"} className={`flex gap-1`}>
						<Btn>
							<div className={`flex gap-1`}>
								<div>{`Let's Begin`}</div>
								<div className={`aspect-square w-8 ${t.fillSolidText}`}>
									<SVGIcon>
										<PlayIcon/>
									</SVGIcon>
								</div>
							</div>
						</Btn>
					</a>
				</div>
              </div>
            </div>
          </section>
          <section id={"bottom"} className={`h-screen flex flex-col justify-evenly items-center ${t.gradient} ${t.solidText}`}>
            <h2 className={s.prompt}>What would you like to do?</h2>
            <div className={`flex flex-row justify-around items-center w-1/2`}>
				<HomeCard icon={<UserIcon/>} text={"Host Game"}/>
				<HomeCard icon={<UserIcon/>} text={"Join Game"}/>
            </div>

			<div className={`${s.backToTop} flex justify-center items-center`}>
				<a href={"#top"} className={`flex justify-center items-center`}>
					<Btn>
						<div className={`flex justify-center items-center`}>
							<div>Back to top</div>
							<div className={`aspect-square w-10 ${t.fillSolidText}`}>
								<SVGIcon>
									<CaretArrow/>
								</SVGIcon>
							</div>
						</div>
					</Btn>
				</a>
			</div>
          </section>
        </main>
  );
}

//card columns:
//grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
