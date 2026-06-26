import { proxy } from "./proxy";

export function middleware(request) {
   return proxy(request);
}

export const config = {
   matcher: [
      "/((?!api|_next/static|_next/image|_next/data|favicon.ico|assets).*)",
   ],
};
