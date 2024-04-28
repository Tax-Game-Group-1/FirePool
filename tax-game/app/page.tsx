import s from './page.module.scss'

export default function Home() {
  return (
      <main>
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
                <img className={s.image} src="mountains.svg" />
                  <div className={s.buttonContainer}>
                      <button className={s.HomeButton}>Start Demo <img src="arrow.svg" /> </button>
                  </div>
              </div>
          </div>
      </main>
  );
}
