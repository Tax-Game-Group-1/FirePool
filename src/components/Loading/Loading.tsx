import React, { forwardRef, Ref } from 'react'

import { LoadingIcon } from '@/assets/svg/svg'
import SVGIcon from '../SVGIcon/SVGIcon'

import style from './Loading.module.scss';
import t from '../../elements.module.scss'

export const LoadingStatus = forwardRef(function LoadingStatus({}, ref:Ref<any>) {
	return (
		<div ref={ref} className={`${style.loading} ${t.fillSolidText}`}>
			<SVGIcon>
				<LoadingIcon className={`absolute ${style.loadingAnim}`}/>
				<LoadingIcon className={`absolute ${style.loadingAnim}`}/>
			</SVGIcon>
		</div>
	)
});

export default LoadingStatus;
