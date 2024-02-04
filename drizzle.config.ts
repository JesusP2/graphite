import { envs } from "@/lib/env-vars";
import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./src/lib/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: envs.DB_URL,
  },
  out: "./migrations-folder",
  breakpoints: false,
};

export default config;
