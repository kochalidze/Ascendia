import React from 'react'
import GetAllPosts from '../../components/GetAllPosts'
import { useAuthStore } from '../../store/authStore'

import DashboardSidebar from './DashboardSidebar'
import QuickView from './QuickView'

import '../style/Home.css'

function Home() {
  // const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAuthenticated = Boolean(user)
  const username = user?.username || 'Guest'
  const level = Number(user?.level ?? 0)
  const xp = Number(user?.xp ?? 0)
  const avatar = user?.avatar || user?.avatar_url || ''
  const initials = username.slice(0, 2).toUpperCase()
  const progress = Math.min((xp / ((level + 1) * 100)) * 100, 100)

  return (
    <div className="home-page">
      <div className="dashboard-grid">

        <DashboardSidebar />

        <main className="dashboard-main">
          <div className="cards-row top-cards">
            <section className="card stories-card">
              <div className="card-header">
                <h2>Stories</h2>
                <span>→</span>
              </div>
              <div className="stories-list">
                <div className="story-block" />
                <div className="story-block" />
                <div className="story-block" />
              </div>
            </section>

            <section className="card mini-card">
              <div className="card-header">
                <h2>Today</h2>
                <span>↻</span>
              </div>
              <div className="mini-card-body" />
            </section>

            <section className="card mini-card">
              <div className="card-header">
                <h2>Notes</h2>
                <span>⋯</span>
              </div>
              <div className="mini-card-body" />
            </section>
          </div>

          <div className="cards-row middle-cards">
            <section className="card suggestions-card">
              <div className="card-header">
                <h2>Suggestions</h2>
                <span>→</span>
              </div>
              <div className="suggestions-list">
                <span />
                <span />
                <span />
              </div>
            </section>

            {/* <section className="card overview-card">
              <div className="card-header">
                <h2>Overview</h2>
                <span>⚡</span>
              </div>
              <div className="overview-body" />
            </section> */}
          </div>

              {/*_________Posts_________ */}
          <div className="cards-row bottom-row">
            <section className="card posts-card">
              <div className="card-header">
                <h2>Posts</h2>
                <span>✦</span>
              </div>
              <div className="home-posts-shell">
                <GetAllPosts />
              </div>
            </section>
          </div>
        </main>

        <QuickView />
      </div>
    </div>
  )
}

export default Home