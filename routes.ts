/**
 * This is an array of routes available to both authenticated and unauthenticated users
 * @type {string[]}
 */

export const publicRoutes: string[] = ["/"];

/**
 * This is an array of routes available to only authenticated users
 * @type {string[]}
 */

export const privateRoutes: string[] = ["/classes", "/communities"];

/**
 * This is an array of routes available to only unauthenticated users
 * These routes uses an authentication service one way or the other
 * @type {string[]}
 */

export const authRoutes: string[] = ["/auth"];

export const PUBLIC_REDIRECT = "/login";
export const PRIVATE_REDIRECT = "/";
