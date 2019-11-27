import { ISoctServerOptions } from "./";
export declare class SoctServer {
    private _state;
    constructor(service: {
        [key: string]: any;
    }, port: number, { delayedStart }?: ISoctServerOptions);
    start(): void;
    stop(): void;
}
