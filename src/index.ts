import {SoctClient, ISoctClientOptions} from "./client";
import {ISoctServerOptions, SoctServer} from "./server";

export function createSoctClient<T>(service: any, port: number, options?: ISoctClientOptions) {
    return (new SoctClient(service, port, options) as unknown) as T;
}
export function createSoctServer(service: any, port: number, options?: ISoctServerOptions) {
    return new SoctServer(service, port, options);
}
