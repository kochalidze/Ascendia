import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:6975/api/auth/me';

type UploadPictureProps = {
    uploadType?: 'avatar' | 'post';
    onUploaded?: (url: string) => void;
};

export default function UploadPicture({ uploadType = 'avatar', onUploaded }: UploadPictureProps) {
    const [status, setStatus] = useState('');
    const [url, setUrl] = useState('');

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setStatus('1/2: presigned URL-ის მოთხოვნა...');
            const { data } = await axios.post(
                `${API}/${uploadType === 'avatar' ? 'avatar' : 'posts/media'}/presign`,
                { contentType: file.type, size: file.size },
                { withCredentials: true }
            );

            setStatus('2/2: R2-ში ატვირთვა...');
            // აქ სუფთა axios გამოიყენე (არა შენი api instance), რომ cookie/auth header R2-ს არ გაჰყვეს
            await axios.put(data.presignUrl, file, {
                headers: { 'Content-Type': file.type },
            });

            setUrl(data.publicUrl);
            onUploaded?.(data.publicUrl);
            setStatus('ატვირთულია ✅');
        } catch (err: any) {
            console.error(err);
            setStatus(`შეცდომა: ${err.response?.status ?? err.message}`);
        }
    };

    return (
        <div>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} />
            <p>{status}</p>
            {url && (
                <>
                    <p>{url}</p>
                    <img src={url} alt="uploaded" width={150} />
                </>
            )}
        </div>
    );
}