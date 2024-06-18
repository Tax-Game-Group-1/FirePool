"use client"
import React from "react";
import QRCode from "react-qr-code";

export default function Page() {

	let url = window.location.href;

	return (
		<div className={`flex justify-center items-center w-screen h-screen bg-white`}>
			<div className={`border border-black p-2`}>
				<QRCode value={url}/>
			</div>
		</div>
	)
}
