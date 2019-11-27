import * as uuid from "uuid/v4";
import * as client from "socket.io-client";
import {ISoctClientOptions, ISoctClientState} from ".";
import {GenericFunction, ISoctListenerProxy} from "../common";

const _state = Symbol("state"),
    _mapClass = Symbol("mapClass"),
    _registerListenOnConnection = Symbol("registerListenOnConnection"),
    _emit = Symbol("emit"),
    _registerListener = Symbol("registerListener");

const OPTION_DEFAULT: ISoctClientOptions = {
    host: "http://localhost",
};

/**
 * Soct proxy class
 */
export class SoctClient {
    [key: string]: any;

    private [_state]: ISoctClientState;

    constructor(service: any, port: number, {host = OPTION_DEFAULT.host}: ISoctClientOptions = OPTION_DEFAULT) {
        this[_state] = {
            socket: client(`${host}:${port}`),
            eventListeners: [],
        };

        this[_mapClass](service);
        this[_registerListenOnConnection]();
    }

    /**
     * add an event listener
     */
    public on(name: string, func: GenericFunction) {
        const {socket, eventListeners} = this[_state],
            listener: ISoctListenerProxy = {
                name,
                uuid: uuid(),
            };
        eventListeners.push(listener);
        this[_registerListener](listener);
        socket.on(name, (args: any) => func(args));
    }

    /**
     * map the class to this instance of soct
     */
    private [_mapClass](service: any) {
        Object.getOwnPropertyNames(service.prototype).forEach(prop => {
            // map a method
            let isFunction = false;
            try {
                isFunction = typeof service.prototype[prop] === "function";
            } catch (err) {
                isFunction = !err;
            }

            if (isFunction) this[prop] = async (...args: any) => this[_emit](prop, [...args]);
            // map a property
            else {
                Object.defineProperty(this, prop, {
                    get: () => this[_emit](prop),
                    set: args => this[_emit](prop, args),
                });
            }
        });
    }

    /**
     * register 'listen on connection'
     */
    private [_registerListenOnConnection]() {
        const {socket} = this[_state];
        socket.on("__soct_new_connection__", () => {
            this[_state].eventListeners.forEach(listener => this[_registerListener](listener));
        });
    }

    /**
     * emit map
     */
    private [_emit](prop: string, args?: any) {
        return new Promise(resolve => this[_state].socket.emit(prop, args, (cb: any) => resolve(cb)));
    }

    /**
     * register listener with socket
     */
    private [_registerListener](listener: ISoctListenerProxy) {
        this[_state].socket.emit("__soct_register_event_listener__", listener);
    }
}
