import { object, string, minLength, parse } from "valibot";

export const envsSchema = object({
  WORKOS_API_KEY: string("WORKOS_API_KEY is required", [
    minLength(1, "WORKOS_API_KEY is required"),
  ]),
  WORKOS_CLIENT_ID: string("WORKOS_CLIENT_ID is required", [
    minLength(1, "WORKOS_CLIENT_ID is required"),
  ]),
  REDIS_URL: string("REDIS_URL is required", [
    minLength(1, "REDIS_URL is required"),
  ]),
  DB_HOST: string("DB_HOST is required", [minLength(1, "DB_HOST is required")]),
  DB_USERNAME: string("DB_USERNAME is required", [
    minLength(1, "DB_USERNAME is required"),
  ]),
  DB_PASSWORD: string("DB_PASSWORD is required", [
    minLength(1, "DB_PASSWORD is required"),
  ]),
  DB_URL: string("DB_URL is required", [minLength(1, "DB_URL is required")]),
  GOOGLE_CALLBACK_URL: string("GOOGLE_CALLBACK_URL is required", [
    minLength(1, "GOOGLE_CALLBACK_URL is required"),
  ]),
  JWT_SECRET_KEY: string("JWT_SECRET_KEY is required", [
    minLength(1, "JWT_SECRET_KEY is required"),
  ]),
});
export const envs = parse(envsSchema, process.env);
