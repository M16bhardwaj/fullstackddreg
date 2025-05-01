import { env } from "./env";

export const appConfig = {
    env: env.NODE_ENV,
    port: env.PORT,
    clientUrl: env.CLIENT_URL,
}