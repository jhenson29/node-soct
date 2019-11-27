"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
const client = require("socket.io-client");
const _state = Symbol("state"), _mapClass = Symbol("mapClass"), _registerListenOnConnection = Symbol("registerListenOnConnection"), _emit = Symbol("emit"), _registerListener = Symbol("registerListener");
const OPTION_DEFAULT = {
    host: "http://localhost",
};
class SoctClient {
    constructor(service, port, { host = OPTION_DEFAULT.host } = OPTION_DEFAULT) {
        this[_state] = {
            socket: client(`${host}:${port}`),
            eventListeners: [],
        };
        this[_mapClass](service);
        this[_registerListenOnConnection]();
    }
    on(name, func) {
        const { socket, eventListeners } = this[_state], listener = {
            name,
            uuid: uuid(),
        };
        eventListeners.push(listener);
        this[_registerListener](listener);
        socket.on(name, (args) => func(args));
    }
    [_mapClass](service) {
        Object.getOwnPropertyNames(service.prototype).forEach(prop => {
            let isFunction = false;
            try {
                isFunction = typeof service.prototype[prop] === "function";
            }
            catch (err) {
                isFunction = !err;
            }
            if (isFunction)
                this[prop] = (...args) => __awaiter(this, void 0, void 0, function* () { return this[_emit](prop, [...args]); });
            else {
                Object.defineProperty(this, prop, {
                    get: () => this[_emit](prop),
                    set: args => this[_emit](prop, args),
                });
            }
        });
    }
    [_registerListenOnConnection]() {
        const { socket } = this[_state];
        socket.on("__soct_new_connection__", () => {
            this[_state].eventListeners.forEach(listener => this[_registerListener](listener));
        });
    }
    [_emit](prop, args) {
        return new Promise(resolve => this[_state].socket.emit(prop, args, (cb) => resolve(cb)));
    }
    [_registerListener](listener) {
        this[_state].socket.emit("__soct_register_event_listener__", listener);
    }
}
exports.SoctClient = SoctClient;
//# sourceMappingURL=client.js.map