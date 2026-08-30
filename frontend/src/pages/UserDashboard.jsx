import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

import { MdModeEdit } from "react-icons/md";

import ProfileBurgerMenu from '../components/ProfileBurgerMenu';
import CreatePost from '../components/CreatePost';
import GetPostByAuthor from '../components/GetPostByAuthor';

import './style/UserDashboar.css'

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function UserDashboard() {
  const [profileData, setProfileData] = useState(null);
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.id ?? user?._id ?? null;
  const initials = profileData?.username?.slice(0, 2)?.toUpperCase();
  const joinDate = profileData ? new Date(profileData.created_at).toLocaleDateString('ka-GE', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '';

  useEffect(() => {
      const fetchUserProfile = async () => {
        if (!isAuthenticated || !userId) return;

        try {
          const response = await api.get(`/users/get/${userId}`);
          setProfileData(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchUserProfile();
  }, [isAuthenticated, userId]);

  if (!isAuthenticated) return <div>გთხოვთ შეხვიდეთ პროფილის სანახავად.</div>;
  if (!profileData) return <div>მონაცემები იტვირთება...</div>;
  return (
    <div className="ud-root">
      <div className="ud-bg-grid"></div>
      <div className="ud-glow ud-glow-top"></div>
      <ProfileBurgerMenu />
      {/* ჰედერი / ავატარი */}
      
      <div className="ud-header">
        <div className="ud-cover"> </div>
        <div className="ud-avatar-wrap">
          {profileData.avatar
            ? <img src={profileData.avatar} alt="avatar" className="ud-avatar-img" />
            : <div className="ud-avatar-initials">{initials}</div>
          }
          <div className="ud-avatar-ring"></div>
          
        </div>
      </div>
 
      {/* სახელი და როლი */}
      <div className="ud-identity">
        <h1 className="ud-username">{profileData.username}</h1>
        <span className={`ud-role-badge ud-role-${profileData.role}`}>
          {profileData.role === 'admin' ? '⬡ ADMIN' : '◈ USER'}
        </span>
        <p className="ud-email">{profileData.email}</p>
        {profileData.bio && <p className="ud-bio"> bio:  {profileData.bio}</p>}
      </div>

      {/* სტატისტიკა */}
      <div className="ud-stats">
        <div className="ud-stat">
          <span className="ud-stat-value">{profileData.level}</span>
          <span className="ud-stat-label">Level</span>
        </div>
        <div className="ud-stat-divider"></div>
        <div className="ud-stat">
          <span className="ud-stat-value">{profileData.xp}</span>
          <span className="ud-stat-label">XP</span>
        </div>
        <div className="ud-stat-divider"></div>
        <div className="ud-stat">
          <span className="ud-stat-value">{profileData.coins}</span>
          <span className="ud-stat-label">Coins</span>
        </div>
      </div>
 
      {/* XP ბარი */}
      <div className="ud-xp-section">
        <div className="ud-xp-label">
          <span>XP Progress</span>
          <span>{profileData.xp} / {(profileData.level + 1) * 100}</span>
        </div>
        <div className="ud-xp-track">
          <div
            className="ud-xp-fill"
            style={{ width: `${Math.min((profileData.xp / ((profileData.level + 1) * 100)) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
 
      {/* ინფო */}
      <div className="ud-info-card">
        <div className="ud-info-row">
          <span className="ud-info-label">// Registration</span>
          <span className="ud-info-value">{joinDate}</span>
        </div>
        <div className="ud-info-row">
          <span className="ud-info-label">// სტატუსი</span>
          <span className="ud-info-value ud-status-active">● ONLINE</span>
        </div>
      </div>
      <hr className="ud-divider" />
      <CreatePost />
      <div className="get">
        <GetPostByAuthor />
      </div>
    </div>

  ); 
}

export default UserDashboard;