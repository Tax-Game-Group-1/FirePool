import s from './page.module.scss'

export default function Home() {
  return (
      <main className={s.splash} id={"top"}>
        <section>
          <nav className={s.nav}>
            <ul>
              <li>About Us</li>
              <li>Case Study</li>
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
                <img src="/images/sun.svg" />
                <img src="/images/mountains.svg"/>
              </div>
              <a href={"#bottom"}>
                <div className={s.buttonContainer}>
                  <button className={[s.HomeButton, s.button].join(' ')}>Let's begin<img src="/images/icons/arrow.svg"/></button>
                </div>
              </a>
            </div>
          </div>
        </section>
        <section id={"bottom"}>
          <h2 className={s.prompt}>What would you like to do?</h2>
          <div className={s.cards}>
            <div/>
            <div className={s.card}>
              <img src="/images/create.png"/>
              <p>Create Game</p>
            </div>
            <div/>
            <div className={s.card}>
              <img src="/images/join.png"/>
              <p>Join Game</p>
            </div>
            <div/>
          </div>

          <a href={"#top"}>
            <div className={[s.buttonContainer, s.backToTop].join(' ')}>
              <button className={s.button}>Back to top<img src="/images/icons/arrow-white.svg"/></button>
            </div>
          </a>
        </section>
      </main>
  );
}

//card columns:
//grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
