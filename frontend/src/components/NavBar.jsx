import React, {useState} from 'react';

import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

//* icons
//?profile
import { CgProfile } from "react-icons/cg";
//? home
import { GoHomeFill } from "react-icons/go";
//? events
import { MdEmojiEvents } from "react-icons/md";
//? level up
import { FaLevelUpAlt } from "react-icons/fa";

import './styles/NavBar.css';

function NavBar() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	
  return (
	<nav className='navbar '>
		<ul className='nav-links'>
			<li className='nav-item'>
				<Link to="/events" className='nav-link'>
					<MdEmojiEvents size={24} />
					<span className='nav-text'>Events</span>
				</Link>
			</li>
			<li className='nav-item'>
				<Link to="/home" className='nav-link'>
					<GoHomeFill size={24} />
					<span className='nav-text'>Home</span>
				</Link>
			</li>
			<li className='nav-item'>
				<Link to="/level-up" className='nav-link'>
					<FaLevelUpAlt size={24} />
					<span className='nav-text'>Missions</span>
				</Link>
			</li>
			<li className='nav-item'>
				{isAuthenticated ? (
					<Link to="/profile" className='nav-link'>
						<CgProfile size={24} />
						<span className='nav-text'>Profile</span>
					</Link>
				) : (
					<Link to="/login" className='nav-link'>
						<CgProfile size={24} />
						<span className='nav-text'>Login</span>
					</Link>
				)}
			</li>
		</ul>
	</nav>
  )
}

export default NavBar