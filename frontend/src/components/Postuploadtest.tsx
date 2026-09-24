import { useState } from "react";

// შეცვალე, თუ შენი API სხვა მისამართზეა (ან Vite proxy-ს იყენებ)
const API = "http://localhost:6975/api/auth";
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

type Media = { id: string; url: string; position: number };
type Post = {
    id: string;
    caption: string;
    visibility: string;
    commentsDisabled: boolean;
    media?: Media[];
};

async function uploadImage(file: File, log: (m: string) => void): Promise<string> {
    // 1. presigned URL-ის აღება
    const presignRes = await fetch(`${API}/me/posts/media/presign`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type }),
    });
    if (!presignRes.ok) {
        throw new Error(`Presign failed (${presignRes.status}): ${await presignRes.text()}`);
    }
    const { presignUrl, r2Key } = await presignRes.json();
    log(`presign OK: ${r2Key}`);

    // 2. პირდაპირ R2-ში ატვირთვა
    const putRes = await fetch(presignUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
    });
    if (!putRes.ok) {
        throw new Error(`R2 upload failed (${putRes.status}). CORS და Content-Type შეამოწმე.`);
    }
    log(`R2 upload OK: ${file.name}`);

    return r2Key;
}

export default function PostUploadTest() {
    const [caption, setCaption] = useState("");
    const [visibility, setVisibility] = useState<"public" | "private">("public");
    const [commentsDisabled, setCommentsDisabled] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [busy, setBusy] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    const log = (m: string) => setLogs((prev) => [...prev, m]);

    const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = Array.from(e.target.files ?? []);
        const valid = picked.filter((f) => ALLOWED.includes(f.type));
        if (valid.length !== picked.length) {
            log("ზოგი ფაილი გამოტოვებულია: მხოლოდ jpeg, png, webp შეიძლება");
        }
        setFiles(valid.slice(0, 10));
    };

    const loadPosts = async () => {
        try {
            const res = await fetch(`${API}/me/posts`, { credentials: "include" });
            if (!res.ok) throw new Error(`Fetch posts failed (${res.status})`);
            setPosts(await res.json());
        } catch (err) {
            log(`შეცდომა: ${(err as Error).message}`);
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setLogs([]);

        try {
            const mediaKeys = await Promise.all(files.map((f) => uploadImage(f, log)));

            const res = await fetch(`${API}/me/posts`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caption, visibility, commentsDisabled, mediaKeys }),
            });
            const body = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(`Create post failed (${res.status}): ${JSON.stringify(body)}`);
            }

            log(`პოსტი შეიქმნა: ${body.id}`);
            setCaption("");
            setFiles([]);
            await loadPosts();
        } catch (err) {
            log(`შეცდომა: ${(err as Error).message}`);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div style={{ maxWidth: 560, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
            <h2>პოსტის ატვირთვის ტესტი</h2>

            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="ტექსტი..."
                    rows={4}
                    maxLength={2200}
                />

                <input type="file" accept={ALLOWED.join(",")} multiple onChange={onFiles} />

                {files.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {files.map((f) => (
                            <img
                                key={f.name + f.size}
                                src={URL.createObjectURL(f)}
                                alt={f.name}
                                style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 6 }}
                            />
                        ))}
                    </div>
                )}

                <label>
                    ხილვადობა:{" "}
                    <select value={visibility} onChange={(e) => setVisibility(e.target.value as "public" | "private")}>
                        <option value="public">public</option>
                        <option value="private">private</option>
                    </select>
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={commentsDisabled}
                        onChange={(e) => setCommentsDisabled(e.target.checked)}
                    />{" "}
                    კომენტარები გამორთულია
                </label>

                <button type="submit" disabled={busy || (!caption.trim() && files.length === 0)}>
                    {busy ? "იტვირთება..." : "პოსტის შექმნა"}
                </button>
            </form>

            {logs.length > 0 && (
                <pre style={{ background: "#f4f4f4", padding: 12, marginTop: 16, whiteSpace: "pre-wrap", fontSize: 13 }}>
                    {logs.join("\n")}
                </pre>
            )}

            <hr style={{ margin: "24px 0" }} />

            <button onClick={loadPosts}>ჩემი პოსტების ჩატვირთვა</button>

            <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
                {posts.map((p) => (
                    <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                        <p style={{ margin: 0 }}>{p.caption || <i>ტექსტის გარეშე</i>}</p>
                        <small>
                            {p.visibility}
                            {p.commentsDisabled ? " · კომენტარები გამორთულია" : ""}
                        </small>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                            {p.media?.map((m) => (
                                <img
                                    key={m.id}
                                    src={m.url}
                                    alt=""
                                    style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 6 }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}