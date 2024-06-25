import { ContentLayer } from "@/components/Game/ContentLayer";
import NotifContainer from "@/components/Notification/Notification";

export function FixedContents(){
	return (
		<div className={`fixed z-100 pointer-events-none w-screen h-screen m-0 p-0`}>
			<ContentLayer z={10}>
				<NotifContainer></NotifContainer>
			</ContentLayer>
		</div>
	)
}