import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(authService.getUserName());
  const [isOrganization, setIsOrganization] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(authService.getUserName());
      setIsOrganization(authService.isOrganization());
    };

    // Sprawdzaj zmiany w localStorage
    window.addEventListener('storage', handleStorageChange);

    // Sprawdzaj przy mount'owaniu
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUsername(null);
    setIsOrganization(false);
    setIsMenuOpen(false);
    navigate('/login');
    window.location.reload();
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link" onClick={handleMenuClose}>
        <div className="navbar-logo">
          <img src="/godlo.png" alt="Godło" className="navbar-godlo" />
          <div className="navbar-brand">
            <span className="logo-name">
              <span className="logo-m">m</span>Poparcie
            </span>
            <span className="logo-slogan">Głosujesz i decydujesz</span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="hamburger-btn"
        onClick={handleMenuToggle}
        aria-label={isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
        aria-expanded={isMenuOpen}
        aria-controls="navbar-menu"
      >
        <span className="hamburger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <ul id="navbar-menu" className={`navbar-links ${isMenuOpen ? 'is-open' : ''}`}>
        <li>
          <Link to="/about" className="nav-link about-btn" onClick={handleMenuClose}>
            O projekcie
          </Link>
        </li>
        {username ? (
          <>
            <li className="welcome-msg">Witaj, {username}!</li>
            {isOrganization && (
              <>
                <li>
                  <Link to="/my-petitions" className="nav-btn-secondary" onClick={handleMenuClose}>
                    Moje petycje
                  </Link>
                </li>
                <li>
                  <Link
                    to="/petition/create"
                    className="nav-btn-primary create-petition-btn"
                    onClick={handleMenuClose}
                  >
                    + Utwórz petycję
                  </Link>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout} className="nav-btn-secondary logout-btn">
                Wyloguj
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register" className="nav-btn-secondary" onClick={handleMenuClose}>
                Rejestracja
              </Link>
            </li>
            <li>
              <Link to="/login" className="nav-btn-primary" onClick={handleMenuClose}>
                Logowanie
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
