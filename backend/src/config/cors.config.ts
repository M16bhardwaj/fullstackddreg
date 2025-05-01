import { env } from "./env";
import cors from "cors";

export const coreOptions: cors.CorsOptions = {
  origin: [env.CLIENT_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
