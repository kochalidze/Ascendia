import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

import { defineRelations } from "drizzle-orm";
import {
    text,
    timestamp,
    boolean,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    bio: text("bio"),
    xp: integer("xp").default(0).notNull(),
    level: integer("level").default(0).notNull(),
    role: varchar("role", { length: 255 }).default("user").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const sessions = pgTable(
    "sessions",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
    "accounts",
    {
        id: text("id").primaryKey(),
        issuer: text("issuer").notNull(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        uniqueIndex("account_issuer_accountId_uidx").on(
            table.issuer,
            table.accountId,
        ),
        index("account_userId_idx").on(table.userId),
    ],
);

export const verifications = pgTable(
    "verifications",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const authRelatoins = defineRelations({ users, sessions, accounts },
    (r) => ({
        user: {
            session: r.many.sessions(),
            account: r.many.accounts(),
        },
        sessions: {
            user: r.one.users({
                from: r.sessions.userId,
                to: r.users.id,
            }),
        },
        accounts: {
            user: r.one.users({
                from: r.accounts.userId,
                to: r.users.id,
            })
        }
    }));


export const statusEnum = pgEnum("status", [
    "single",
    "in_a_relationship",
    "engaged",
    "married",
    "in_a_civil_union",
    "its_complicated",
    "in_a_domestic_partnership",
    "in_an_open_relationship",
    "widowed",
    "separated",
    "divorced"
]);

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const userProfiles = pgTable("user_profiles", {
    id: text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    username: text("username").notNull().unique().default(`sql'user' || floor(random() * (99999999 - 10000000 + 1) + 10000000)::text`),
    bio: text("bio"),
    pfp: text("pfp"),
    background: text("background"),
    status: statusEnum("status"),
    occupation: text("occupation"),
    education: text("education"),
    note: text("note"),
    lastNoteCreatedAt: timestamp("last_note_created_at"),
    dateOfBirth: timestamp("date_of_birth"),
    gender: genderEnum("gender"),
})