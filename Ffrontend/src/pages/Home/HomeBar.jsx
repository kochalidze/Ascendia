import React from 'react'

import '../style/HomeBar.css';

function HomeBar() {
  return (
	<div className='home-bar'>
		<div className='profile-image'></div>
		<div className="search-input-container">
			<input type="text"  className="search-input" placeholder="Search..." />
		</div>
	</div>
  )
}

export default HomeBar