import * as React from "react"

export const BackSquare = ({className="",fill="white", ...other}:{
	className?: string,
	fill?: string,
	[key:string]: any,
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		preserveAspectRatio="true"
		className={className}
		fill={fill}
		{...other}
	>
		<path
		fill={fill}
		d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2Zm-2.27 14.13H9c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4.92c1.28 0 2.33-1.04 2.33-2.33s-1.04-2.33-2.33-2.33H8.85l.26.26c.29.3.29.77-.01 1.07-.15.15-.34.22-.53.22s-.38-.07-.53-.22L6.47 9.72a.754.754 0 0 1 0-1.06l1.57-1.57c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-.33.33h5.15c2.11 0 3.83 1.72 3.83 3.83 0 2.11-1.72 3.82-3.83 3.82Z"
		/>
  </svg>
)

export const ExitDoor = ({className="",fill="white", ...other}:{
	className?: string,
	fill?: string,
	[key:string]: any,
}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill={fill}
		preserveAspectRatio="true"
		viewBox="0 0 32 32"
		{...other}
	>
		<path d="M30.9 13.6c-.1-.1-.1-.2-.2-.3l-4-4c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l2.3 2.3H22V3c0-.6-.4-1-1-1H4c-.1 0-.3 0-.4.1h-.1s-.1 0-.1.1l-.1.1c-.1.1-.2.2-.2.3v.1c-.1.1-.1.2-.1.3v22c0 .4.2.8.6.9l9 4c.1.1.3.1.4.1.2 0 .4-.1.5-.2.3-.2.5-.5.5-.8v-3h7c.6 0 1-.4 1-1V15h5.6l-2.3 2.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l4-4c.1-.1.2-.2.2-.3.1-.3.1-.5 0-.8zM10 21c0 .6-.4 1-1 1s-1-.4-1-1v-4c0-.6.4-1 1-1s1 .4 1 1v4zm10-11v14h-6V7c0-.4-.2-.8-.6-.9L8.7 4H20v6z" />
	</svg>
)

export const StatsIcon = ({className="",fill="white", ...other}:{
	className?: string,
	fill?: string,
	[key:string]: any,
}) => (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  viewBox="0 0 31 31"
	  preserveAspectRatio="true"
	  fill={fill}
	  {...other}
	>
	  <path
		fill={fill}
		d="M27.308.741H3.702A2.95 2.95 0 0 0 .75 3.692v23.607a2.95 2.95 0 0 0 2.95 2.95h23.607a2.95 2.95 0 0 0 2.951-2.95V3.692a2.95 2.95 0 0 0-2.95-2.95Zm-16.23 22.131a1.475 1.475 0 1 1-2.95 0v-2.95a1.475 1.475 0 0 1 2.95 0v2.95Zm5.902 0a1.475 1.475 0 0 1-2.95 0V14.02a1.475 1.475 0 1 1 2.95 0v8.852Zm5.902 0a1.475 1.475 0 1 1-2.95 0V8.118a1.476 1.476 0 0 1 2.95 0v14.754Z"
	  />
	</svg>
  )

export const CurrencyIcon = ({className="",fill="white", ...other}:{
	className?: string,
	fill?: string,
	[key:string]: any,
}) => (
	<svg
	  xmlns="http://www.w3.org/2000/svg"
	  viewBox="0 0 69 69"
	  fill={fill}
	  {...other}
	>
	  <circle cx={34.028} cy={34.424} r={33.201} fill="#000" stroke="#fff" />
	  <path
		fill={fill}
		d="M22.582 18.566h16.296c2.587 0 4.72.84 6.402 2.522 1.682 1.681 2.522 4.01 2.522 6.984 0 2.975-.84 5.303-2.522 6.984-.905.906-2.198 1.488-3.88 1.746l7.566 14.938h-4.85l-6.984-14.356H27.044V51.74h-4.462V18.566Zm4.462 3.686v11.446H38.49c1.294 0 2.393-.453 3.298-1.358.906-.905 1.358-2.328 1.358-4.268 0-1.81-.517-3.233-1.552-4.268-1.034-1.035-2.263-1.552-3.686-1.552H27.044Z"
	  />
	  <path
		fill="transparent"
		fillRule="evenodd"
		d="M53.539 30.522H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		fill="transparent"
		fillRule="evenodd"
		d="M53.539 30.522H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		fill={fill}
		fillRule="evenodd"
		d="M53.539 30.522H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		fill={fill}
		fillRule="evenodd"
		d="M53.539 30.522H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		fill={fill}
		fillRule="evenodd"
		d="M53.539 43.293H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		fill={fill}
		fillRule="evenodd"
		d="M53.539 43.293H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		fill={fill}
		fillRule="evenodd"
		d="M53.539 43.293H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	  <path
		fill={fill}
		fillRule="evenodd"
		d="M53.539 43.293H14.517v-2.838h39.022v2.838Z"
		clipRule="evenodd"
	  />
	</svg>
  )