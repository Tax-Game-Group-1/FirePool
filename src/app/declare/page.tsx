import Statbox from "@/app/declare/statbox/statbox";
import s from './delclare.module.scss'

export default function Declare(props: { name: string, taxRate: number , year: number, universeFunds: number}) {
    return (
        <div className={s.container}>
            <Statbox name={props.name} taxRate={props.taxRate} universeFunds={props.universeFunds} year={props.year}/>
            <div>
                <p>What is this year's tax rate going to be</p>
                <input type={"text"} />
                <div className={s.buttons}></div>
                <button>Confirm</button>
                <button>Cancel</button>
            </div>
        </div>
    )
}