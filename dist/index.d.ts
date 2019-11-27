import { ISoctClientOptions } from "./client";
import { ISoctServerOptions, SoctServer } from "./server";
export declare function createSoctClient<T>(service: any, port: number, options?: ISoctClientOptions): T;
export declare function createSoctServer(service: any, port: number, options?: ISoctServerOptions): SoctServer;
