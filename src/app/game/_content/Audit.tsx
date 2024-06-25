"use client"
import { GameContent } from '@/components/Game/GameContentContainer'
import LoadingStatus from '@/components/Loading/Loading'
import React from 'react'

export function AuditCitizen() {
	return (
		<GameContent isAbsolute>
			<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
				<div className={`text-lg`}>
					Tax Authority is currently auditing other citizens.
				</div>
				<div className={`text-sm`}>
					Waiting for other citizens...
				</div>
				<div>
					<LoadingStatus/>
				</div>
			</div>
		</GameContent>
	)
}
export function AuditMinister() {
	return (
		<GameContent isSub>
			<div className={`flex flex-col justify-center items-center p-4 gap-4`}>
				<div className={``}>
					Waiting for all citizens to finish being audited...
				</div>
				<div>
					<LoadingStatus/>
				</div>
			</div>
		</GameContent>
	)
}
