import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { envs } from "../env-vars";

const connection = connect({
  host: envs.DB_HOST,
  username: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
});

export const db = drizzle(connection);
