import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.js";
import * as schema from '../db/schema.js';
import { userProfiles } from "../db/schema.js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema
    }),
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await db.insert(userProfiles).values({ id: user.id });
                },
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 1,
    },
    trustedOrigins: [process.env.TRUSTED_ORIGIN || "http://localhost:5173"],
});