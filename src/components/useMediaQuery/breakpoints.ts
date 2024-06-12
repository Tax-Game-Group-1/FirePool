
export const MediaWidthBreakPoints:{
	[key:string]:{
		min: string | number;
		max: string | number;
	},
} = {
	'xs': { min: 100, max: 374 },
	'sm': { min: 375, max: 767 },
	'md': { min: 768, max: 1023 },
	'lg': { min: 1024, max: 1279 },
	'xl': { min: 1280, max: 1535 },
	'2xl': { min: 1536, max: 2047 },
	'2k': { min: 2048, max: 3839 },
	'4k': { min: 3840, max: 7679 },
	'8k': { min: 7680, max: 15360 },
	'hd': { min: 1920, max: 3839 },
}
