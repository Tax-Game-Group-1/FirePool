import React from 'react'

import Layouts from "./layouts"

export default function TestPage() {
  return (
	<div className=" min-h-svh min-w-svw m-0 relative flex flex-col justify-center items-center overflow-hidden top-0 left-0 bg-white text-black">
		<h1>Test Page</h1>
		<p className="text-sm">(Resize the page width to see changes)</p>
		<Layouts/>
	</div>
  )
}
