import { creatAuthClient } from "better-auth/react";

export const authClient = creatAuthClient({
	baseUrl: import.meta.env.VITE_AUTH_BASE_URL,
});