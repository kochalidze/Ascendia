import React, {useState, useEffect} from 'react'
import axios from 'axios';

import './styles/GetTopUsers.css';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function GetTopUsers() {
	const [topUsers, setTopUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
	const fetchTopUsers = async () => {
		try {
		const response = await api.get('/users/get-top-users');
		setTopUsers(response.data);
		} catch (error) {
		console.error('Error fetching top users:', error);
		setError('Failed to load data. Please try again later.');
		} finally {
		setIsLoading(false);
		}
	};
	fetchTopUsers();
	}, []);
  return (
    <div className="top-users-board">
      <h2>Top Users</h2>

      {isLoading && <p className="loading">იტვირთება...</p>}
      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <ul>
          {topUsers.map((user, index) => (
            <li key={user.id} className={`rank-${index + 1}`}>
              <span className="rank-badge">{index + 1}</span>
              <span className="username">{user.username}</span>
              <span className="stats">
                <span className="level">Level: {user.level}</span>
                <span className="xp">XP: {user.xp}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GetTopUsers