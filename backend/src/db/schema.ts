import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { defineRelations } from "drizzle-orm";
import {
    text,
    timestamp,
    boolean,
    index,
    uniqueIndex,
    primaryKey
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
    // background: text(""),
    status: statusEnum("status"),
    occupation: text("occupation"),
    education: text("education"),
    note: text("note"),
    lastNoteCreatedAt: timestamp("last_note_created_at"),
    dateOfBirth: timestamp("date_of_birth"),
    gender: genderEnum("gender"),
});

export const postVisibilityEnum = pgEnum("post_visibility", ["public", "friends", "private"]);
export const mediaTypeEnum = pgEnum("media_type", ["image", "video"]);

export const posts = pgTable("posts", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    caption: text("caption"),
    visibility: postVisibilityEnum("visibility").notNull().default("public"),
    commentsDisabled: boolean("comments_disabled").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => [
    index("posts_author_created_idx").on(t.authorId, t.createdAt),
    index("posts_created_idx").on(t.createdAt),
]);

// ერთ პოსტზე რამდენიმე ფოტო, მაგრამ მხოლოდ ერთი ვიდეო
export const postMedia = pgTable("post_media", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    type: mediaTypeEnum("type").notNull(),
    url: text("url").notNull(),
    position: integer("position").notNull().default(0),
}, (t) => [
    index("post_media_post_idx").on(t.postId, t.position),
    // DB-ის დონეზე: ერთ პოსტზე მაქსიმუმ 1 ვიდეო
    uniqueIndex("post_media_one_video_idx").on(t.postId).where(sql`${t.type} = 'video'`),
]);

// ლაიქები (რეაქციების გარეშე)
export const postLikes = pgTable("post_likes", {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
    primaryKey({ columns: [t.postId, t.userId] }),
    index("post_likes_user_idx").on(t.userId),
]);

// რეპოსტი (ცალკე ცხრილში, რომ posts-ში მედიის გარეშე ჩანაწერები არ გაჩნდეს)
export const postReposts = pgTable("post_reposts", {
    postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
    primaryKey({ columns: [t.postId, t.userId] }),
]);

//? გვინდა თუ არა მოუდები (public,  private...)? +
//? გვინდა თუ არა პოსტის დაედითება?
//? როგორი ტიპის მედია გვინდა? (მინდა ფოტოს და ვიდეოს ატვირთვა მხოლოდ)
//? გვინდა თუ არა ცალკე ტექსტის პოსტები? -
//? გვინდა თუ არა რამოდენიმე მედიის  ატვირთვა რო შეგვეძლოს? -
//? როგორ მივუდგეთ ბევრი/სხვადასხა მედიის  ატვირთვას? (შეგვეძლოს რამოდენიმე ფოტოს ატვირთვა ერთთად, მაგრამ შეგვეძლოს მხოლოდ ერთი ვიდეოს ატვირთვა)
//? დავამატოთ თუ არა კომენტარის აკრძალვა? +
//? რეკლამები?! -
//? რეპოსტი თუ შეარი? (რეპოსტი, და ცალკე ღილაკით შეგვეძლოს მეგობარზე გაგზავნა)
//? შეარი პოსტად უნდა ჩაითალოს თუ არა? (არა)
//? ლაიქები იყოს თუ რეაქციები? (ლაიქები)