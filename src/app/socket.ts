"use client";

import { io, Socket } from "socket.io-client";

export const socket = io({
	autoConnect: false,
});
// export const socket:Socket = null