// import { auth } from "./auth"
// import { apiAuthPrefix, authRoutes, DEFAULT_REDIRECT, publicRoutes } from "./routes"

// export default auth((req)=>{
//     const {nextUrl} = req
//     const isLoggedIn = !!req.auth

//     const isPublicRoutes = publicRoutes.includes(nextUrl.pathname)
//     const isAuthRoutes = authRoutes.includes(nextUrl.pathname)
//     const isApiAuthPrefix = nextUrl.pathname.startsWith(apiAuthPrefix)

//     if (isApiAuthPrefix) {
//         return null
//     }

//     if (isAuthRoutes) {
//         if (isLoggedIn) {
//             return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
//         }
//         return null
//     }

//     if (!isLoggedIn && !isPublicRoutes) {
//         return Response.redirect(new URL("/sign-in", nextUrl))
//     }

//     return null

// })

// // Optionally, don't invoke Middleware on some paths
// export const config = {
//     matcher: [
//         '/((?!.+\\.[\\w]+$|_next).*)','/','/(api|trpc)(.*)'
//     ],
// }