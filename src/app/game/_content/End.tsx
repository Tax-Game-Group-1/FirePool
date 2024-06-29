"use client"
import { deleteGameGlobal } from '@/app/global';
import Btn from '@/components/Button/Btn';
import React from 'react'

export default function End() {
  return (
	<div>
		Game over.
		<Btn onClick={()=>{
			deleteGameGlobal();
			window.location.href = "/home";
		}}>Exit</Btn>
	</div>
  )
}
