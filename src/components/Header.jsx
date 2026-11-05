import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './ui.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 20);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`header ${solid ? 'solid' : ''}`}>
      <div className="header-promo-bar">
        <div className="header-promo-in">
          <Link to="/experiences/arcachon-entre-femmes" onClick={close} className="header-promo-link">
            Voyages &amp; expériences au féminin — <span>Découvrez notre week-end sur le Bassin d’Arcachon</span>
          </Link>
        </div>
      </div>
      <div className="header-in">
        <Logo />
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Navigation principale">
          <Link to="/#escapades" onClick={close} className="nav-item-clean">
            Nos escapades
          </Link>
          <Link to="/#ateliers" onClick={close} className="nav-item-clean">
            Nos ateliers
          </Link>
          <NavLink to="/notre-histoire" onClick={close} className="nav-item-clean">
            Notre histoire
          </NavLink>
          <NavLink to="/contact" onClick={close} className="nav-item-clean">
            Contact
          </NavLink>
          <Link to="/reserver/arcachon-entre-femmes" onClick={close} className="btn btn-terra btn-sm nav-mobile-cta">
            Réserver Arcachon
          </Link>
        </nav>
        <Link to="/reserver/arcachon-entre-femmes" className="btn btn-terra btn-sm head-cta">
          Réserver Arcachon
        </Link>
        <button
          className="burger"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
