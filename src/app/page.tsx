import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import { createTimer } from '@/utils/utils';
import { redirect, RedirectType } from 'next/navigation'
import React from 'react'

export default function Page() {

	//Redirect to home page
	redirect("/home", RedirectType.replace);

	return (
		<LoadingScreen/>
	)
}
