import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

import './styles/CreatePost.css'; 

export const api = axios.create({

  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function CreatePost({ onPostCreated }) {
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('');
  const [xpReward, setXpReward] = useState(0);
  // const [coinsReward, setCoinsReward] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post('posts/create-post', {
        title,
        content,
        type: postType,
        xpReward,
        // coinsReward
      });
      
      console.log('Sending Core Data:', { title, content, type: postType, xpReward});
      
      setSuccess(true);
      setTitle('');
      setContent('');

      // xp and coins 
      // setXpReward(10);
      // setCoinsReward(10);

      
      if (onPostCreated) onPostCreated(); 

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Transmission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-card">
      {/* ტერმინალის ზედა ზოლი */}
      <div className="terminal-header">
        <span className="terminal-indicator"></span>
        <span className="terminal-title">TERMINAL // CONSOLE_POST</span>
        <span className="terminal-version">SYS_V.1.0.4</span>
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        {/* პოსტის კატეგორიის გადასართავი (Cyber Tabs) */}
        <div className="post-types-container">
          <button
            type="button"
            className={`type-btn type-btn--cyan ${postType === 'broadcast' ? 'active' : ''}`}
            onClick={() => setPostType('broadcast')}
          >
            # BROADCAST
          </button>
          <button
            type="button"
            className={`type-btn type-btn--emerald ${postType === 'intel' ? 'active' : ''}`}
            onClick={() => setPostType('intel')}
          >
            # NEED_INTEL
          </button>
          <button
            type="button"
            className={`type-btn type-btn--rose ${postType === 'challenge' ? 'active' : ''}`}
            onClick={() => setPostType('challenge')}
          >
            # CHALLENGE
          </button>
        </div>

        <div className="textarea-wrapper">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="post-title-input"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              postType === 'broadcast' ? "Share your thoughts with Neon City..." :
              postType === 'intel' ? "What information/help are you looking for in the Matrix?..." :
              "Challenge someone to a [Coding, Quiz, Debate] battle..."
            }
            maxLength={280}
            rows="3"
            required
            className={`post-textarea focus-${postType}`}
          />
          <span className="char-counter">{content.length} / 280</span>
        </div>

        <div className="post-footer">
          <div className="status-message-zone">
            {success && (
              <span className="success-pulse">
                ⚡ DATA TRANSMITTED SUCCESSFULLY! (+10 XP +{xpReward} Coins)
              </span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`transmit-btn transmit-btn--${postType}`}
          >
            {isSubmitting ? 'Connection...' : 'Transmission [TRANSMIT]'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;