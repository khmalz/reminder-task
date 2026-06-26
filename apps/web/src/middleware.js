import { proxy } from "./proxy";

export function middleware(request) {
   return proxy(request);
}

export { config } from "./proxy";
