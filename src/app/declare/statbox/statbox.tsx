import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from 'react';
import s from './statbox.module.scss';
import b from '../../themes.module.scss'

export default function Statbox(props: { name: string, taxRate: number , year: number, universeFunds: number}) {
    let {name, year, taxRate, universeFunds} = props;

    //account for apostrophe
    let declareName = name + "'";
    if(name[name.length-1] != "s"){
        declareName += "s";
    }
//{[s.stats,s.container].join(" ")}
    return (
        <div className={[s.stats, b.solidElement].join(' ')}>
            <div>
                {declareName} Universe
            </div>
            <div className={s.statBoxes}>
                    <div>
                        Tax Rate
                        <div className={[s.displayBox, b.accent].join(" ")}>{taxRate}</div>
                    </div>
                    <div></div>
                    <div>
                        Year
                        <div className={[s.displayBox, b.accent].join(" ")}>{year}</div>
                    </div>
                    <div>
                        Universe Funds
                        <div className={[s.displayBox, b.accent].join(" ")}>{universeFunds.toFixed()}</div>
                    </div>
            </div>
        </div>
    );
}

Statbox.defaultProps = {
    name: 'Thomas',
    taxRate: 40,
    year: 1,
    universeFunds: 100.00,
};






