/// <reference types="socket.io" />
export interface ISoctServerOptions {
    delayedStart: boolean;
}
export interface ISoctServerState {
    port: number;
    io: SocketIO.Server;
}
