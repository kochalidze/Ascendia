import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DeletePostBut from './DeletePostBut';
import LikePostButton from './LikePostButton';

import { useAuthStore } from '../store/authStore';
import './styles/GetPostByAuthor.css';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TYPE_CONFIG = {
  BROADCAST: { label: '#BROADCAST', className: 'tag--broadcast' },
  NEED_INTEL: { label: '#NEED_INTEL', className: 'tag--intel' },
  CHALLENGE: { label: '#CHALLENGE', className: 'tag--challenge' },
};

function GetPostByAuthor() {
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/posts/author-posts/${user.id}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  const filters = ['ALL', 'BROADCAST', 'NEED_INTEL', 'CHALLENGE'];

  const filteredPosts =
    activeFilter === 'ALL'
      ? posts
      : posts.filter((post) => post.type === activeFilter);

  return (
    <div className="posts-section">
      {/* Header */}
      <div className="posts-header">
        <div className="posts-header__left">
          <span className="posts-header__dot" />
          <span className="posts-header__title">TERMINAL // POSTS</span>
        </div>
        <span className="posts-header__sys">SYS_V1.0.4</span>
      </div>

      {/* Filter tabs */}
      <div className="posts-filters">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-tag ${
              f !== 'ALL' ? TYPE_CONFIG[f]?.className : 'tag--all'
            } ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f === 'ALL' ? '#ALL' : TYPE_CONFIG[f].label}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="posts-list">
        {filteredPosts.length === 0 ? (
          <div className="posts-empty">
            <span className="posts-empty__line">// NO POSTS FOUND</span>
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <div
              className="post-card"
              key={post._id}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="post-card__top">
                <h3 className="post-card__title">{post.title}</h3>
                <span
                  className={`post-card__type-badge ${
                    TYPE_CONFIG[post.type]?.className ?? ''
                  }`}
                >
                  {TYPE_CONFIG[post.type]?.label ?? post.type}
                </span>
              </div>

              <p className="post-card__content">{post.content}</p>

              <div className="post-card__footer">
                <span className="post-card__xp">
                  <span className="post-card__xp-icon">⚡</span>
                  {post.xp_rewarded} XP
                </span>
                <span className="post-card__divider" />
                <span className="post-card__type-label">{post.type}</span>
                <LikePostButton postId={post.id} initialLiked={post.liked_by_me} initialCount={post.like_count} />
                <DeletePostBut postId={post.id} />
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GetPostByAuthor;