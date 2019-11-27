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
const SocketIO = require("socket.io");
const OPTION_DEFAULT = {
    delayedStart: false,
};
class SoctServer {
    constructor(service, port, { delayedStart = OPTION_DEFAULT.delayedStart } = OPTION_DEFAULT) {
        this._state = {
            port,
            io: SocketIO(),
        };
        const listeners = {};
        const functions = {};
        this._state.io.on("connection", socket => {
            const { id } = socket;
            listeners[id] = [];
            functions[id] = [];
            socket.emit("__soct_new_connection__");
            socket.on("__soct_register_event_listener__", ({ name, uuid }) => {
                if (!listeners[socket.id].includes(uuid)) {
                    const func = (args) => socket.emit(name, args);
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
                    functions[id].forEach(listener => service.removeListener && service.removeListener(listener.name, listener.func));
                    delete listeners[id];
                    delete functions[id];
                }
            });
            Object.getOwnPropertyNames(Object.getPrototypeOf(service)).forEach(prop => {
                socket.on(prop, (args, cb) => __awaiter(this, void 0, void 0, function* () {
                    return typeof service[prop] === "function"
                        ? cb(yield service[prop](...args))
                        : args === null
                            ? cb(yield service[prop])
                            : cb(yield (service[prop] = args));
                }));
            });
        });
        if (!delayedStart)
            this.start();
    }
    start() {
        const { io, port } = this._state;
        io.listen(port);
    }
    stop() {
        this._state.io.close();
    }
}
exports.SoctServer = SoctServer;
//# sourceMappingURL=server.js.map