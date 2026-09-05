import { PutObjectCommand } from "@aws-sdk/client-s3";
import env from "../config/env.ts";
import {S3} from "../config/S3.config.ts";
import { db } from '../db/db.ts';
import { userProfiles } from "../db/schema.ts"; //[cite: 3]
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
    }
};