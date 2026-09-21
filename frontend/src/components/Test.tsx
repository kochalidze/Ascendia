import { useState } from "react";
import type { ChangeEvent } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:6975/api/auth";

const errText = (e: unknown) =>
    axios.isAxiosError(e)
        ? `${e.response?.status ?? "პასუხი არ მოვიდა (სავარაუდოდ CORS ან სერვერი გამორთულია)"} ${JSON.stringify(e.response?.data ?? e.message)}`
        : String(e);

export default function UploadTest() {
    const [kind, setKind] = useState<"avatar" | "banner">("avatar");
    const [logs, setLogs] = useState<string[]>([]);
    const [imgUrl, setImgUrl] = useState("");

    const log = (m: string) => setLogs((l) => [...l, m]);

    const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setLogs([]);
        setImgUrl("");
        log(`ფაილი: ${file.name} (${file.type}, ${Math.round(file.size / 1024)}KB)`);

        // 1) presigned URL ბექენდისგან
        let presignUrl = "";
        let publicUrl = "";
        try {
            log("1) presigned URL-ის მოთხოვნა...");
            const { data } = await axios.post(
                `${API}/users/me/${kind}/presign`,
                { contentType: file.type },
                { withCredentials: true }
            );
            presignUrl = data.presignUrl;
            publicUrl = data.publicUrl;
            log("OK 1) presign მიღებულია");
            log("publicUrl: " + publicUrl);
        } catch (err) {
            return log("ERROR 1) presign ვერ მოხერხდა: " + errText(err));
        }

        // 2) ატვირთვა პირდაპირ R2-ში
        try {
            log("2) R2-ში ატვირთვა...");
            await axios.put(presignUrl, file, { headers: { "Content-Type": file.type } });
            log("OK 2) ფაილი R2-ში აიტვირთა");
        } catch (err) {
            return log("ERROR 2) R2-ში ატვირთვა ვერ მოხერხდა: " + errText(err));
        }

        // 3) URL-ის შენახვა ბექენდში
        try {
            log("3) URL-ის შენახვა ბექენდში...");
            const { data } = await axios.put(
                `${API}/users/me/${kind}`,
                { url: publicUrl },
                { withCredentials: true }
            );
            log("OK 3) შენახულია: " + JSON.stringify(data));
            setImgUrl(data.pfp ?? data.background ?? publicUrl);
        } catch (err) {
            log("ERROR 3) შენახვა ვერ მოხერხდა: " + errText(err));
            setImgUrl(publicUrl + "?t=" + Date.now()); // მაინც ვცადოთ worker-იდან ჩვენება
        }
    };

    return (
        <div style={{ maxWidth: 520, margin: "0 auto", padding: 16, display: "grid", gap: 12 }}>
            <label>
                ტიპი:{" "}
                <select value={kind} onChange={(e) => setKind(e.target.value as "avatar" | "banner")}>
                    <option value="avatar">ავატარი</option>
                    <option value="banner">ბანერი</option>
                </select>
            </label>

            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />

            <pre style={{ background: "#111", color: "#0f0", padding: 12, whiteSpace: "pre-wrap", minHeight: 80 }}>
                {logs.join("\n") || "აირჩიე ფაილი..."}
            </pre>

            {imgUrl && (
                <img
                    src={imgUrl}
                    alt="ატვირთული"
                    style={{ maxWidth: "100%", borderRadius: 8 }}
                    onLoad={() => log("OK 4) სურათი worker-იდან წარმატებით ჩაიტვირთა")}
                    onError={() => log("ERROR 4) სურათი worker-იდან ვერ ჩაიტვირთა (შეამოწმე worker და URL)")}
                />
            )}
        </div>
    );
}