import s from './declare.module.scss';

export default function Declare() {
    return (
        <div className={s.stats}>
            <div>
                <div>
                    <div>Income received</div>
                    <input type={"text"}/>
                </div>
            </div>
        </div>
    );
}