import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './styles/LikePostButton.css';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function LikePostButton({
  postId,
  initialLiked = false,
  initialCount = 0,
}) {
  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);
  const [pop, setPop] = useState(false);

  // თუ post-ი ცვლის props-ს (მაგ. parent-ში სხვა feed-ი ჩაიტვირთა),
  // ლოკალური state სინქრონში დარჩეს
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      setLiked(Boolean(initialLiked));
      setCount(initialCount);
    }
    mounted.current = true;
  }, [postId, initialLiked, initialCount]);

  const handleClick = async () => {
    if (pending) return;

    // optimistic update
    const prevLiked = liked;
    const prevCount = count;
    const nextLiked = !liked;
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1);

    setLiked(nextLiked);
    setCount(nextCount);
    setPending(true);
    setPop(true);
    setTimeout(() => setPop(false), 260);

    try {
      const { data } = await api.post(`/posts/like-post/${postId}`);
      setLiked(Boolean(data.liked));
      setCount(data.count);
    } catch (err) {
      // rollback
      setLiked(prevLiked);
      setCount(prevCount);
      console.error('Failed to toggle like:', err);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`like-post-btn ${liked ? 'is-liked' : ''} ${pending ? 'is-pending' : ''}`}
      onClick={handleClick}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike post' : 'Like post'}
    >
      <svg
        className={`like-post-btn__icon ${pop ? 'pop' : ''}`}
        viewBox="0 0 24 24"
        width="18"
        height="18"
      >
        <path
          d="M12 20.6c-.2 0-.4-.07-.55-.2C7.4 17.05 3.5 13.7 3.5 9.8 3.5 7 5.65 4.85 8.4 4.85c1.55 0 2.95.75 3.6 1.95.65-1.2 2.05-1.95 3.6-1.95 2.75 0 4.9 2.15 4.9 4.95 0 3.9-3.9 7.25-7.95 10.6-.15.13-.35.2-.55.2Z"
          fill={liked ? 'var(--like-active)' : 'none'}
          stroke={liked ? 'var(--like-active)' : 'var(--like-idle)'}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      <span className="like-post-btn__count">{formatCount(count)}</span>
    </button>
  );
}

function formatCount(n) {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}m`;
}

export default LikePostButton;