import * as SocketIO from "socket.io";
import {UuidType, GenericFunction} from "../common";
import {ISoctServerState, ISoctServerOptions} from "./";

const OPTION_DEFAULT: ISoctServerOptions = {
    delayedStart: false,
};

/**
 * socket-io service wrapper
 */
export class SoctServer {
    private _state: ISoctServerState;
    constructor(
        service: {[key: string]: any},
        port: number,
        {delayedStart = OPTION_DEFAULT.delayedStart}: ISoctServerOptions = OPTION_DEFAULT,
    ) {
        this._state = {
            port,
            io: SocketIO(),
        };

        const listeners: {[key: string]: UuidType[]} = {};
        const functions: {[key: string]: {name: string; func: GenericFunction}[]} = {};

        this._state.io.on("connection", socket => {
            const {id} = socket;
            listeners[id] = [];
            functions[id] = [];
            socket.emit("__soct_new_connection__");
            socket.on("__soct_register_event_listener__", ({name, uuid}) => {
                if (!listeners[socket.id].includes(uuid)) {
                    const func = (args: any) => socket.emit(name, args);
                    listeners[id].push(uuid);
                    functions[id].push({
                        name,
                        func,
                    });
                    service.on && service.on(name, func);
                }
            });

            socket.on("disconnect", () => {
                if (listeners[id]) {
                    functions[id].forEach(
                        listener => service.removeListener && service.removeListener(listener.name, listener.func),
                    );
                    delete listeners[id];
                    delete functions[id];
                }
            });
            Object.getOwnPropertyNames(Object.getPrototypeOf(service)).forEach(prop => {
                socket.on(prop, async (args, cb) => {
                    // map methods and properties
                    return typeof service[prop] === "function"
                        ? cb(await service[prop](...args))
                        : args === null
                        ? cb(await service[prop])
                        : cb(await (service[prop] = args));
                });
            });
        });

        if (!delayedStart) this.start();
    }

    /**
     * start the socket.io service (if delayed start or stopped)
     */
    public start() {
        const {io, port} = this._state;
        io.listen(port);
    }

    /**
     * stop the socket.io service
     */
    public stop() {
        this._state.io.close();
    }
}
