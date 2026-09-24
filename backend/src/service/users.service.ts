import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "../config/S3.config.ts";
import { db } from "../db/db.ts";
import { userProfiles, users, posts, postMedia } from "../db/schema.ts";
import { eq, inArray } from "drizzle-orm";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_POST_MEDIA = 10;

const buildPublicUrl = (r2Key: string) =>
    `${process.env.WORKER_URL}/${process.env.BUCKET_NAME}/${r2Key}`;

const getPresignedUrl = async (userId: string, contentType: string, folder: "avatars" | "posts") => {
    if (!ALLOWED_IMAGE_TYPES.includes(contentType)) throw new Error("Invalid file!");
    const fileExtension = contentType.split("/")[1];
    const r2Key = folder === "avatars"
        ? `public/avatars/original/${userId}.${fileExtension}`
        : `public/posts/${userId}/${crypto.randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: r2Key,
        ContentType: contentType,
    });
    const presignUrl = await getSignedUrl(S3, command, { expiresIn: 60 });
    return { presignUrl, publicUrl: buildPublicUrl(r2Key), r2Key }; // r2Key დავამატე
};

//? Create a new post (text + media)
const createPost = async (
    authorId: string,
    caption: string,
    commentsDisabled: boolean,
    visibility: "public" | "private",
    mediaKeys: string[] = []
) => {
    if (!caption.trim() && mediaKeys.length === 0) throw new Error("Empty post");
    if (mediaKeys.length > MAX_POST_MEDIA) throw new Error("Too many files");

    const allowedPrefix = `public/posts/${authorId}/`;
    if (!mediaKeys.every((k) => k.startsWith(allowedPrefix) && !k.includes(".."))) {
        throw new Error("Invalid media key");
    }

    return await db.transaction(async (tx) => {
        const [newPost] = await tx.insert(posts).values({
            authorId,
            caption,
            visibility,
            commentsDisabled,
        }).returning();

        if (!newPost) throw new Error("Failed to create post");

        let media: { id: string; url: string; position: number }[] = [];
        if (mediaKeys.length > 0) {
            const mediaValues: {
                postId: string;
                type: "image" | "video";
                url: string;
                position: number;
            }[] = mediaKeys.map((key, i) => ({
                postId: newPost.id,
                type: "image" as const,
                url: buildPublicUrl(key),
                position: i,
            }));

            media = await tx.insert(postMedia).values(mediaValues).returning();
        }

        return { ...newPost, media };
    });
};

//? Get all posts for a specific user (with media)
const getUserPosts = async (userId: string) => {
    const userPosts = await db.select().from(posts).where(eq(posts.authorId, userId));
    if (userPosts.length === 0) return [];

    const media = await db
        .select()
        .from(postMedia)
        .where(inArray(postMedia.postId, userPosts.map((p) => p.id)));

    return userPosts.map((p) => ({
        ...p,
        media: media.filter((m) => m.postId === p.id).sort((a, b) => a.position - b.position),
    }));
};

export const UserService = {
    getAvatarPresignedUrl: (userId: string, contentType: string) =>
        getPresignedUrl(userId, contentType, "avatars"),

    getPostMediaPresignedUrl: (userId: string, contentType: string) =>
        getPresignedUrl(userId, contentType, "posts"),

    getUserPosts,
    createPost,
};