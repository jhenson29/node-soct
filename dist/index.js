"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const server_1 = require("./server");
function createSoctClient(service, port, options) {
    return new client_1.SoctClient(service, port, options);
}
exports.createSoctClient = createSoctClient;
function createSoctServer(service, port, options) {
    return new server_1.SoctServer(service, port, options);
}
exports.createSoctServer = createSoctServer;
//# sourceMappingURL=index.js.map