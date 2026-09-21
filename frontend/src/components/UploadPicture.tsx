// import { useState } from "react";
// import type { ChangeEvent } from "react";
// import api from "../api/api";

// const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
// const maxFileSize = 5 * 1024 * 1024; 

// function UploadPicture() {
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     event.target.value = "";

//     if (!file) return;

//     setError("");

//     if (!allowedTypes.includes(file.type)) {
//       setError("აირჩიე JPG, PNG ან WEBP სურათი.");
//       return;
//     }

//     if (file.size > maxFileSize) {
//       setError("სურათის ზომა 5MB-ზე მეტი არ უნდა იყოს.");
//       return;
//     }

//     setIsUploading(true);

//     try {
//       const { data } = await api.post("/me/avatar/presign", {
//         contentType: file.type,
//       });

//       await api.put(data.presignUrl, file, {
//         headers: { "Content-Type": file.type },
//         baseURL: "",
//         withCredentials: false,
//       });

//       await api.put("/users/me/profile", { pfp: data.publicUrl });
//       setPreviewUrl(`${data.publicUrl}?t=${Date.now()}`);
//     } catch (uploadError) {
//       console.error(uploadError);
//       setError("სურათის ატვირთვა ვერ მოხერხდა. სცადე თავიდან.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div>
//       <label htmlFor="profile-picture">პროფილის ფოტო</label>
//       <input
//         id="profile-picture"
//         type="file"
//         accept="image/jpeg,image/png,image/webp"
//         onChange={handleFileChange}
//         disabled={isUploading}
//       />

//       {isUploading && <p>იტვირთება...</p>}
//       {error && <p role="alert">{error}</p>}
//       {previewUrl && <img src={previewUrl} alt="პროფილის ფოტო" width={160} height={160} />}
//     </div>
//   );
// }

// export default UploadPicture


import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:6975/api/auth/me';

export default function UploadTest() {
    const [status, setStatus] = useState('');
    const [url, setUrl] = useState('');

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setStatus('1/2: presigned URL-ის მოთხოვნა...');
            const { data } = await axios.post(
                `${API}/avatar/presign`,
                { contentType: file.type, size: file.size },
                { withCredentials: true }
            );

            setStatus('2/2: R2-ში ატვირთვა...');
            // აქ სუფთა axios გამოიყენე (არა შენი api instance), რომ cookie/auth header R2-ს არ გაჰყვეს
            await axios.put(data.presignUrl, file, {
                headers: { 'Content-Type': file.type },
            });

            setUrl(data.publicUrl);
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