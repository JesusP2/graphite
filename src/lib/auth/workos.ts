import { WorkOS } from "@workos-inc/node";
import { envs } from "@/lib/env-vars";

export const workos = new WorkOS(envs.WORKOS_API_KEY);
export const clientId = envs.WORKOS_CLIENT_ID;
