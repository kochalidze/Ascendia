import { PutObjectCommand } from "@aws-sdk/client-s3";
import env from "../config/env.ts";
import {S3} from "../config/S3.config.ts";
import { db } from '../db/db.ts';
import { userProfiles } from "../db/schema.ts";
import { users } from "../db/schema.ts";
import { eq } from 'drizzle-orm';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getPresignedUrl = async (userId:string, contentType:string, folder:"avatars" | "banners") => {
    if(!contentType.startsWith('image/')) throw new Error('Invalid file!');
    const fileExtension = contentType.split('/')[1];
    const r2Key = `public/${folder}/${folder === 'avatars' ? 'original' : ''}/${userId}.${fileExtension}`;
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: r2Key,
        ContentType: contentType
    });
    const presignUrl = await getSignedUrl(S3, command, { expiresIn: 60 });
    const publicUrl = `${process.env.WORKER_URL}/${process.env.BUCKET_NAME}/${r2Key}`;
    return { presignUrl, publicUrl };
};

export const UserService = {
    getAvatarPresignedUrl: (userId: string, contentType: string) =>
      getPresignedUrl(userId, contentType, "avatars"),

    getBannerPresignedUrl: (userId: string, contentType: string) =>
      getPresignedUrl(userId, contentType, "banners"),

    saveAvatar: async (userId: string, publicUrl: string) => {
      await db.update(userProfiles).set({ pfp: publicUrl }).where(eq(userProfiles.id, userId));
    },

    // saveBanner: async (userId: string, publicUrl: string) => {
    //   await db.update(userProfiles).set({ background: publicUrl }).where(eq(userProfiles.id, userId));
    // },

    updateProfile: async (userId: string,
        data: {
            name?: string;
            bio?: string; 
            occupation?: string;
            education?: string;
            status?: "single" | "in_a_relationship" | "engaged" | "married" | "its_complicated" | "divorced";
            gender?: "male" | "female" | "other";
            dateOfBirth?: Date;
        } 
    ) => {
        if (data.name) {
            // თუ name არსებობს, ვანახლებთ users ცხრილს!
            await db
                .update(users)
                .set({ name: data.name })
                .where(eq(users.id, userId));
        }
        const { name, ...profileData } = data;

        if (Object.keys(profileData).length > 0) {
            const [updatedProfile] = await db
                .update(userProfiles)
                .set(profileData)
                .where(eq(userProfiles.id, userId))
                .returning();

            return updatedProfile;
        }

        return { message: "Profile updated successfully" };
    }
};