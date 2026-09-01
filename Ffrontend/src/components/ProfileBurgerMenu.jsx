import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './styles/BurgerMenu.css'

function ProfileBurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="burger-wrapper">

      {/* ბურგერის ღილაკი */}
      <div className="burger-btn" onClick={toggleMenu}>
        <div className={`burger-line ${isOpen ? 'line-top-open' : ''}`}></div>
        <div className={`burger-line ${isOpen ? 'line-mid-open' : ''}`}></div>
        <div className={`burger-line ${isOpen ? 'line-bot-open' : ''}`}></div>
      </div>

      {/* მენიუ */}
      <div className={`burger-menu ${isOpen ? 'burger-menu-open' : ''}`}>
        <ul className="burger-links">
          <li onClick={() => setIsOpen(false)}><Link to="/">Home</Link></li>
          <li onClick={() => setIsOpen(false)}><Link to="/profile">Profile</Link></li>
          <li onClick={() => setIsOpen(false)}><Link to="/settings">Settings</Link></li>
          <li onClick={() => setIsOpen(false)}><Link to="/login">Logout</Link></li>
        </ul>
      </div>

      {/* overlay */}
      {isOpen && <div className="burger-overlay" onClick={() => setIsOpen(false)}></div>}

    </div>
  );
}

export default ProfileBurgerMenu;