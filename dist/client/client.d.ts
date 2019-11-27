import { ISoctClientOptions } from ".";
import { GenericFunction } from "../common";
declare const _state: unique symbol, _mapClass: unique symbol, _registerListenOnConnection: unique symbol, _emit: unique symbol, _registerListener: unique symbol;
export declare class SoctClient {
    [key: string]: any;
    private [_state];
    constructor(service: any, port: number, { host }?: ISoctClientOptions);
    on(name: string, func: GenericFunction): void;
    private [_mapClass];
    private [_registerListenOnConnection];
    private [_emit];
    private [_registerListener];
}
export {};
