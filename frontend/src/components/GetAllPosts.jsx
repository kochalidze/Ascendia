import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import LikePostButton from './LikePostButton';
import './styles/GetAllPosts.css';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const POST_TYPE_CONFIG = {
  BROADCAST: { label: 'broadcast', className: 'type-broadcast' },
  NEED_INTEL: { label: 'intel', className: 'type-intel' },
  CHALLENGE: { label: 'challenge', className: 'type-challenge' },
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).toUpperCase();
}

function PostCard({ post, onDeleted }) {
  const navigate = useNavigate();
  const typeConfig = POST_TYPE_CONFIG[post.type] || {
    label: post.type,
    className: 'type-broadcast',
  };

  return (
    <div className={`post-card ${typeConfig.className}`}>
      {/* 1. ზედა ნაწილი: ავატარი, ავტორი, თარიღი და პოსტის ტიპი */}
      <div className="post-card-header">
        <div className="post-author-info">
          <div className="post-avatar">
            {/* პროფილის ფოტო - თუ სურათი არ არის, გამოაჩენს ინიციალს */}
            {post.avatar_url ? (
              <img src={post.avatar_url} alt={post.username} />
            ) : (
              <Link to={`/profile/${post.user_id}`}>
                <span className="avatar-placeholder">
                  {post.username ? post.username.charAt(0).toUpperCase() : 'U'}
                </span>
              </Link>
            )}
          </div>
          <div className="author-details">
            <h3 className="post-author-name">{post.username}</h3>
            <span className="post-date">{formatDate(post.created_at)}</span>
          </div>
        </div>

        <span className={`post-type-badge ${typeConfig.className}`}>
          {typeConfig.label}
        </span>
      </div>

      {/* 2. შუა ნაწილი: ტექსტი, სათაური და მედია */}
      <div className="post-card-body">
        {post.title && <h2 className="post-title">{post.title}</h2>}
        {post.content && <p className="post-content">{post.content}</p>}

        {/* ------------------------------------------------------------- */}
        {/* აქ ჩასვამ შენს ფოტოს/ვიდეოს მომავალში (მაგალითის სტრუქტურა): */}
        {post.media_url && (
          <div className="post-media-container">
            {/* მაგალითად: <img src={post.media_url} alt="Post media" /> */}
          </div>
        )}
        {/* ------------------------------------------------------------- */}
      </div>

      {/* 3. ქვედა ნაწილი: ღილაკები, XP, ID */}
      <div className="post-card-footer">
        <div className="footer-left">
          <LikePostButton 
            postId={post.id} 
            initialLiked={post.liked_by_me} 
            initialCount={post.like_count} 
          />
        </div>

        <div className="footer-right">
          <span className="post-xp">
            <span className="xp-icon">⬡</span>
            +{post.xp_rewarded} XP
          </span>
          <span className="post-id">#{String(post.id).padStart(4, '0')}</span>
        </div>
      </div>
    </div>
  );
}

function GetAllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePostDeleted = (deletedId) => {
    setPosts(prev => prev.filter(post => post.id !== deletedId));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts/get-all-posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('FAILED TO RETRIEVE POSTS');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="all-posts-container">
      <div className="all-posts-header">
        {!loading && !error && (
          <span className="posts-count">{posts.length} ENTRIES</span>
        )}
      </div>

      {loading && (
        <div className="posts-status">
          <span className="status-dot loading-dot" />
          RETRIEVING DATA...
        </div>
      )}

      {error && (
        <div className="posts-status error">
          <span className="status-dot error-dot" />
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="posts-status">
          <span className="status-dot" />
          NO POSTS FOUND
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-feed">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onDeleted={handlePostDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}

export default GetAllPosts;