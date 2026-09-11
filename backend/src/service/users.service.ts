import { PutObjectCommand } from "@aws-sdk/client-s3";
import env from "../config/env.ts";
import {S3} from "../config/S3.config.ts";
import { db } from '../db/db.ts';
import { userProfiles } from "../db/schema.ts"; //[cite: 3]
import { users } from "../db/schema.ts";
import { eq } from 'drizzle-orm';

export const UserService = {
    saveProfilePicture: async (userId: string, imageBuffer: Buffer, contentType: string): Promise<string> => {
        // 1. ფაილის ტიპის შემოწმება
        if (!contentType.startsWith('image/')) {
            throw new Error('Invalid file type! Only images are allowed.');
        }

        // 2. გაფართოების ამოღება (მაგ: image/png -> png)
        const fileExtension = contentType.split('/')[1] || 'png';
        
        // 3. Template Literal-ის გასწორება (Backticks)
        const r2Key = `avatars/original/user_${userId}_${Date.now()}.${fileExtension}`;

        // 4. S3/R2-ზე ატვირთვა
        const command = new PutObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: r2Key,
            Body: imageBuffer,
            ContentType: contentType
        }); 

        await S3.send(command);

        // 5. ბაზის განახლება (pfp ველის შეცვლა userProfiles ცხრილში)[cite: 3]
        await db
            .update(userProfiles)
            .set({ pfp: r2Key }) // ან თუ სრული URL გინდა: `${env.R2_PUBLIC_URL}/${r2Key}`
            .where(eq(userProfiles.id, userId)); //[cite: 3]

        return r2Key;
    },

    // Update user profile information (name, bio, background, )
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
}