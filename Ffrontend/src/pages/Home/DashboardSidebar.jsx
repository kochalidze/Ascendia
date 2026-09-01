import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

import '../style/DashboardSidebar.css'

function DashboardSidebar() {
  const navigate = useNavigate()
  const { user } = useAuthStore();
  const isAuthenticated = Boolean(user)
  const avatar = user?.avatar || user?.avatar_url || ''
  const username = user?.username || 'Guest'
  const initials = username.slice(0, 2).toUpperCase()
  const level = Number(user?.level ?? 0)
  const xp = Number(user?.xp ?? 0)

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-profile-card">
        <div className="sidebar-avatar">
          {avatar ? (
            <img onClick={() => navigate('/profile')} src={avatar} alt={`${username} avatar`} />
              ) : (
                <span onClick={() => navigate('/profile')}>{initials}</span>
          )}
        </div>
        <div>
          <p className="sidebar-profile-name">{username}</p>
          <p className="sidebar-profile-subtitle">Explorer</p>
        </div>
      </div>

          <div className="sidebar-status">
            <span>
              <strong>Level</strong>
              <strong>{level}</strong>
            </span>
            <span>
              <strong>XP</strong>
              <strong>{xp}</strong>
            </span>
          </div>

          {!isAuthenticated ? (
            <div className="guest-actions">
              <button type="button" className="guest-action-btn" onClick={() => navigate('/login')}>
                Login
              </button>
              <button type="button" className="guest-action-btn guest-action-btn--primary" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          ) : (
            <nav className="sidebar-menu">
              <button type="button" className="menu-item" onClick={() => navigate('/profile')}>
                + Create Post
              </button>
              <button type="button" className="menu-item" onClick={() => navigate('/shop')}>
                Shop
              </button>
              <button type="button" className="menu-item">
                Missions
              </button>
            </nav>
          )}
    </aside>
  )
}

export default DashboardSidebar