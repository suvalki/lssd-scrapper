import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {protectedAuthRoutes} from "@/config/routing/protected-routes";
import {hasProtectedRouter, routerParser} from "@/libs/routes-handlers/router-parser";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (!request.cookies.has("token") && hasProtectedRouter(request.nextUrl.pathname, protectedAuthRoutes) && routerParser(request.nextUrl.pathname, protectedAuthRoutes)[0].deny) return NextResponse.redirect(new URL("/login", request.url))

    return NextResponse.next()
}


export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
}
// See "Matching Paths" below to learn more