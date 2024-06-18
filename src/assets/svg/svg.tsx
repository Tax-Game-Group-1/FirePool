import React from "react"

import { forwardRef, Ref } from "react"

interface ISVGProps {
	className?: string,
	style?: React.CSSProperties,
	fill?: string,
	stroke?: string,
	// [key:string]: any,
}

export const BackSquare = forwardRef(function BackSquare({className="",fill="", ...other}:ISVGProps, ref:Ref<any>){
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			className={className}
			fill={fill}
			ref={ref}
			{...other}
		>
			<path
			// fill={fill}
			d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2Zm-2.27 14.13H9c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4.92c1.28 0 2.33-1.04 2.33-2.33s-1.04-2.33-2.33-2.33H8.85l.26.26c.29.3.29.77-.01 1.07-.15.15-.34.22-.53.22s-.38-.07-.53-.22L6.47 9.72a.754.754 0 0 1 0-1.06l1.57-1.57c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-.33.33h5.15c2.11 0 3.83 1.72 3.83 3.83 0 2.11-1.72 3.82-3.83 3.82Z"
			/>
	</svg>
	)
});

export const ExitDoor = forwardRef(function ExitDoor({className="",fill="", ...other}:ISVGProps, ref:Ref<any>){
	return (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 0 32 32"
		ref={ref}
		className={className}
		{...other}
	>
		<path d="M30.9 13.6c-.1-.1-.1-.2-.2-.3l-4-4c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l2.3 2.3H22V3c0-.6-.4-1-1-1H4c-.1 0-.3 0-.4.1h-.1s-.1 0-.1.1l-.1.1c-.1.1-.2.2-.2.3v.1c-.1.1-.1.2-.1.3v22c0 .4.2.8.6.9l9 4c.1.1.3.1.4.1.2 0 .4-.1.5-.2.3-.2.5-.5.5-.8v-3h7c.6 0 1-.4 1-1V15h5.6l-2.3 2.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l4-4c.1-.1.2-.2.2-.3.1-.3.1-.5 0-.8zM10 21c0 .6-.4 1-1 1s-1-.4-1-1v-4c0-.6.4-1 1-1s1 .4 1 1v4zm10-11v14h-6V7c0-.4-.2-.8-.6-.9L8.7 4H20v6z" />
	</svg>
	)
});

export const StatsIcon = forwardRef(function StatsIcon({className="",stroke="",fill="", ...other}:ISVGProps, ref:Ref<any>){
	return (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  viewBox="0 0 31 31"
	  fill={fill}
	  ref={ref}
	  className={className}
	  stroke={stroke}
	  {...other}
	>
	  <path
		// fill={fill}
		d="M27.308.741H3.702A2.95 2.95 0 0 0 .75 3.692v23.607a2.95 2.95 0 0 0 2.95 2.95h23.607a2.95 2.95 0 0 0 2.951-2.95V3.692a2.95 2.95 0 0 0-2.95-2.95Zm-16.23 22.131a1.475 1.475 0 1 1-2.95 0v-2.95a1.475 1.475 0 0 1 2.95 0v2.95Zm5.902 0a1.475 1.475 0 0 1-2.95 0V14.02a1.475 1.475 0 1 1 2.95 0v8.852Zm5.902 0a1.475 1.475 0 1 1-2.95 0V8.118a1.476 1.476 0 0 1 2.95 0v14.754Z"
	  />
	</svg>
	)
});

export const CurrencyIcon = forwardRef(function CurrencyIcon({className="",stroke="",fill="", ...other}:ISVGProps, ref:Ref<any>){
	return (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  viewBox="0 0 69 69"
	  fill={fill}
	  ref={ref}
	  stroke={stroke}
	  className={className}
	  {...other}
	>
	  {/* <circle cx={34.028} cy={34.424} r={33.201} 
	//   fill="#000" stroke="#fff"
	   /> */}
	  <path
		// fill={fill}
		d="M22.582 18.566h16.296c2.587 0 4.72.84 6.402 2.522 1.682 1.681 2.522 4.01 2.522 6.984 0 2.975-.84 5.303-2.522 6.984-.905.906-2.198 1.488-3.88 1.746l7.566 14.938h-4.85l-6.984-14.356H27.044V51.74h-4.462V18.566Zm4.462 3.686v11.446H38.49c1.294 0 2.393-.453 3.298-1.358.906-.905 1.358-2.328 1.358-4.268 0-1.81-.517-3.233-1.552-4.268-1.034-1.035-2.263-1.552-3.686-1.552H27.044Z"
	  />
	  <path
		// fill="transparent"
		fillRule="evenodd"
		d="M53.539 30.522H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		// fill="transparent"
		fillRule="evenodd"
		d="M53.539 30.522H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		// fill={fill}
		fillRule="evenodd"
		d="M53.539 30.522H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		// fill={fill}
		fillRule="evenodd"
		d="M53.539 30.522H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		// fill={fill}
		fillRule="evenodd"
		d="M53.539 43.293H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		// fill={fill}
		fillRule="evenodd"
		d="M53.539 43.293H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		// fill={fill}
		fillRule="evenodd"
		d="M53.539 43.293H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		// fill={fill}
		fillRule="evenodd"
		d="M53.539 43.293H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	</svg>
	)
});

export const PercentageIcon = forwardRef(function PercentageIcon({className="",fill="", ...other}:ISVGProps, ref:Ref<any>){
	return (
		<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 0 24 24"
		ref={ref}
		className={className}
		{...other}
		>
		<g 
		// fill={fill}
		>
			<path d="M7.05 17.7a.74.74 0 0 1-.53-.22.75.75 0 0 1 0-1.06l9.9-9.9a.75.75 0 1 1 1.06 1.06l-9.9 9.9a.74.74 0 0 1-.53.22ZM8.5 10.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Zm0-3a.75.75 0 1 0 .75.75.76.76 0 0 0-.75-.75ZM15.5 17.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Zm0-3a.75.75 0 1 0 .75.75.76.76 0 0 0-.75-.75Z" />
		</g>
		</svg>
	)
});

export const CopyIcon = forwardRef(function CopyIcon({
	className="",fill="transparent", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
		<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 0 24 24"
		ref={ref}
		className={className}
		{...other}
		stroke={stroke}
		>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 16V4a2 2 0 0 1 2-2h10M9 22h9a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
		/>
		</svg>
	)
});

export const MenuIcon = forwardRef(function MenuIcon({
	className="",fill="transparent", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
		<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 0 24 24"
		ref={ref}
		className={className}
		{...other}
		>
			<path
				// stroke={stroke}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	)
})

export const InfoIcon = forwardRef(function InfoIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill={fill}
			viewBox="0 0 24 24"
			ref={ref}
			stroke={stroke}
			className={className}
			{...other}
		>
		<path
			// fill={fill}
			fillRule="evenodd"
			d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-10 5.75a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75ZM12 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
			clipRule="evenodd"
		/>
		</svg>
	)
})

export const SettingsIcon = forwardRef(function SettingsIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  fill={fill}
	  viewBox="0 0 24 24"
	  ref={ref}
	  stroke={stroke}
	  className={className}
	  {...other}
	>
	  <path
		// fill="#000"
		fillRule="evenodd"
		d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.409 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353 1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453-.47.807-.704 1.21-.757 1.605-.07.526.074 1.058.4 1.479.148.192.357.353.68.555.477.297.783.803.783 1.361 0 .558-.306 1.064-.782 1.36-.324.203-.533.364-.682.556-.325.421-.469.953-.399 1.479.053.394.287.798.757 1.605.47.807.704 1.21 1.022 1.453.424.323.96.465 1.49.396.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353.015.38.051.64.145.863.204.49.596.88 1.09 1.083.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308.53.07 1.066-.073 1.49-.396.318-.242.553-.646 1.022-1.453.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555-.477-.297-.783-.803-.783-1.361 0-.558.306-1.064.782-1.36.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008 1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083ZM12.5 15c1.67 0 3.023-1.343 3.023-3S14.169 9 12.5 9c-1.67 0-3.023 1.343-3.023 3s1.354 3 3.023 3Z"
		clipRule="evenodd"
	  />
	</svg>
  )
})

export const CloseIcon = forwardRef(function CloseIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  fill={fill}
	  viewBox="0 0 24 24"
	  ref={ref}
	  stroke={stroke}
	  className={className}
	  {...other}
	>
	  <path
    //   fill="#1C274C"
      fillRule="evenodd"
      d="M12 22c-4.714 0-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22ZM8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 0 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 1 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 1 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
	</svg>
  )
})

export const LoadingIcon = forwardRef(function LoadingIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  fill={fill}
	  viewBox="0 0 16 16"
	  ref={ref}
	  stroke={stroke}
	  className={className}
	  {...other}
	>
		<g fillRule="evenodd" clipRule="evenodd">
			<path
				d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"
				opacity={0.2}
			/>
			<path d="M7.25.75A.75.75 0 0 1 8 0a8 8 0 0 1 8 8 .75.75 0 0 1-1.5 0A6.5 6.5 0 0 0 8 1.5a.75.75 0 0 1-.75-.75z" />
		</g>
	</svg>
  )
})
export const DiceIcon = forwardRef(function DiceIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  fill={fill}
	  viewBox="0 0 512 512"
	  ref={ref}
	  stroke={stroke}
	  className={className}
	  {...other}
	>
		<g id="SVGRepo_iconCarrier">
			{/* <style>{".st0{fill:#000}"}</style> */}
			<path
				d="M454.609 111.204 280.557 6.804a47.745 47.745 0 0 0-49.115-.008L57.391 111.204a47.653 47.653 0 0 0-13.556 12.192l207.904 124.708a8.27 8.27 0 0 0 8.519 0L468.16 123.396a47.647 47.647 0 0 0-13.551-12.192zm-296.898 19.109c-10.96 7.611-28.456 7.422-39.081-.452-10.618-7.859-10.342-20.413.618-28.031 10.964-7.626 28.46-7.422 39.081.438 10.621 7.866 10.345 20.412-.618 28.045zm116.448.708c-10.594 7.362-27.496 7.166-37.762-.429-10.263-7.596-9.992-19.727.599-27.089 10.591-7.362 27.492-7.174 37.759.43 10.263 7.595 9.995 19.726-.596 27.088zm117.749 1.681c-10.964 7.618-28.461 7.414-39.085-.444-10.617-7.86-10.343-20.42.621-28.046 10.957-7.61 28.456-7.422 39.078.452 10.625 7.859 10.346 20.412-.614 28.038zM246.136 258.366 38.007 133.523a47.673 47.673 0 0 0-3.798 18.62v208.084a47.752 47.752 0 0 0 23.182 40.946l174.051 104.392A47.707 47.707 0 0 0 250.156 512V265.464a8.272 8.272 0 0 0-4.02-7.098zM75.845 369.736c-12.056-6.57-21.829-21.671-21.829-33.727 0-12.056 9.773-16.502 21.829-9.932 12.056 6.571 21.826 21.671 21.826 33.728 0 12.056-9.77 16.502-21.826 9.931zm0-121.866c-12.056-6.579-21.829-21.679-21.829-33.728 0-12.056 9.773-16.502 21.829-9.931 12.056 6.57 21.826 21.671 21.826 33.728 0 12.048-9.77 16.501-21.826 9.931zm121.87 188.288c-12.052-6.57-21.826-21.671-21.826-33.728 0-12.048 9.773-16.494 21.826-9.924 12.056 6.571 21.826 21.671 21.826 33.72 0 12.058-9.77 16.503-21.826 9.932zm0-121.866c-12.052-6.571-21.826-21.671-21.826-33.728s9.773-16.502 21.826-9.931c12.056 6.57 21.826 21.671 21.826 33.727 0 12.057-9.77 16.502-21.826 9.932zM473.993 133.523l-208.13 124.843a8.272 8.272 0 0 0-4.02 7.099V512a47.696 47.696 0 0 0 18.714-6.435l174.052-104.392a47.763 47.763 0 0 0 23.182-40.946V152.142a47.672 47.672 0 0 0-3.798-18.619zM370.478 355.11c-19.287 10.512-34.922 3.398-34.922-15.892 0-19.282 15.635-43.447 34.922-53.951 19.293-10.519 34.925-3.406 34.925 15.884 0 19.283-15.632 43.447-34.925 53.959z"
				// className="st0"
			/>
		</g>
	</svg>
  )
})

export const EnterArrow = forwardRef(function EnterArrowIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 0 48 48" 
		ref={ref}
		stroke={stroke}
		className={className}
		{...other}
	>
		<g data-name="Layer 2">
			{/* <path fill="none" d="M0 0h48v48H0z" data-name="invisible box" /> */}
			<path
				d="M46 24a22 22 0 0 1-43.9 2h25.1l-4.6 4.6a1.9 1.9 0 0 0 .2 3 2 2 0 0 0 2.7-.3l7.9-7.9a1.9 1.9 0 0 0 0-2.8l-7.9-8a2.3 2.3 0 0 0-2.7-.3 2 2 0 0 0-.2 3.1l4.6 4.6H2.1A22 22 0 0 1 46 24Z"
				data-name="icons Q2"
			/>
		</g>
	</svg>
  )
})

export const PlayIcon = forwardRef(function PlayIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 0 24 24" 
		ref={ref}
		stroke={stroke}
		className={className}
		{...other}
	>
		<path
			// fill="#050505"
			fillRule="evenodd"
			d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-1.306-6.154 4.72-2.787c.781-.462.781-1.656 0-2.118l-4.72-2.787C9.934 7.706 9 8.29 9 9.214v5.573c0 .923.934 1.507 1.694 1.059Z"
			clipRule="evenodd"
		/>
	</svg>
  )
})

export const UserIcon = forwardRef(function UserIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 0 24 24" 
		ref={ref}
		stroke={stroke}
		className={className}
		{...other}
	>
		<g>
			<path d="M12 1a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM7 14a5 5 0 0 0-5 5v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-3a5 5 0 0 0-5-5H7Z" />
		</g>
	</svg>
  )
})

export const ShareIcon = forwardRef(function ShareIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 0 24 24" 
		ref={ref}
		stroke={stroke}
		className={className}
		{...other}
	>
		<path
			// fill="#000"
			fillRule="evenodd"
			d="M13.803 5.333c0-1.84 1.5-3.333 3.348-3.333A3.341 3.341 0 0 1 20.5 5.333c0 1.841-1.5 3.334-3.349 3.334-.933 0-1.777-.381-2.384-.994l-4.635 3.156a3.336 3.336 0 0 1-.182 1.917l5.082 3.34a3.346 3.346 0 0 1 2.12-.753 3.341 3.341 0 0 1 3.348 3.334C20.5 20.507 19 22 17.151 22a3.341 3.341 0 0 1-3.348-3.333c0-.483.103-.942.289-1.356L9.05 14a3.346 3.346 0 0 1-2.202.821A3.34 3.34 0 0 1 3.5 11.487a3.34 3.34 0 0 1 3.348-3.333c1.064 0 2.01.493 2.623 1.261l4.493-3.059a3.317 3.317 0 0 1-.161-1.023Z"
			clipRule="evenodd"
		/>
	</svg>
  )
})

export const EditTextIcon = forwardRef(function EditTextIcon({
	className="",fill="", stroke="", ...other
}:ISVGProps, ref:Ref<any>){
	return (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		viewBox="0 -0.5 21 21"
		ref={ref}
		stroke={stroke}
		className={className}
		{...other}
	>
		<path
			// fill="#000"
			fillRule="evenodd"
			d="M18.9 18.01H2.1V2.097h8.4V.106H0V20h21v-9.947h-2.1v7.958ZM6.3 9.95 16.63 0 21 4.115l-10.666 9.917H6.3V9.95Z"
		/>
	</svg>
  )
})