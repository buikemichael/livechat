import { io } from "socket.io-client";
export const socket = io(`${URL}`, {
    reconnectionDelayMax: 10000,
    transports: ["websocket"]
});
export const homeSocket = io(`${process.env.URL}/home`, {
    reconnectionDelayMax: 10000,
    transports: ["websocket"],
    auth: {
        authId: localStorage.getItem('authId')
    }
});
