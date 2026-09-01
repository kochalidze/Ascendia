import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './styles/HomeUserProfileBar.css'

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function HomeUserProfileBar() {
	  const [profileData, setProfileData] = useState(null);
	  const { user } = useAuthStore();
	  const navigate = useNavigate();
	  useEffect(() => {
		  const fetchUserProfile = async () => {
			console.log('user:', user); 
			const userId = user?.id || user?._id;
			console.log('userId:', userId);
	
			if (!userId) return;
	
			try {
			  const response = await api.get(`/users/get/${userId}`);
			  console.log('response:', response.data); 
			  setProfileData(response.data);
			} catch (error) {
			  console.error('Error:', error);
			}
		  };
	
		  fetchUserProfile();
	  }, [user]);
  return (
	<div className="home-user-profile-bar">
		<div className='gap-5'>		
			<span>level: {profileData?.level || 1}</span>
			<h2>YOU: <span className="username" onClick={() => navigate('/profile')}>
				{profileData?.username || 'Guest'} 
			</span>
			</h2>
	  </div>

	  <div onClick={() => navigate('/shop')} >
		Shop
	  </div>

	  <div className="ud-xp-section">
		<div className="ud-xp-label">
          <span>{profileData?.xp || 0} / {(profileData?.level + 1) * 100} XP</span>
        </div>
		<div className="ud-xp-track">
          <div
            className="ud-xp-fill"
            style={{ width: `${Math.min((profileData?.xp / ((profileData?.level + 1) * 100)) * 100, 100)}%` }}
          ></div>
        </div>
	  </div>
	</div>
  )
}

export default HomeUserProfileBar;