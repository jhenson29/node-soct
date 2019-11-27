import {ISoctListenerProxy} from "../common";

export interface ISoctClientOptions {
    host?: string;
}

export interface ISoctClientState {
    socket: SocketIOClient.Socket;
    eventListeners: ISoctListenerProxy[];
}
