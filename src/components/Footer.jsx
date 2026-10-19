import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './ui.jsx';
import { useData } from '../data/store.js';

export default function Footer() {
  const { settings } = useData();
  return (
    <footer className="footer">
      <div className="wrap foot-grid">
        <div>
          <Logo />
          <p className="small">Voyages au féminin — une expérience rare, imaginée par des femmes, pour des femmes.</p>
        </div>
        <div>
          <h3>Explorer</h3>
          <Link to="/experiences/arcachon-entre-femmes">Bassin d’Arcachon — Entre femmes</Link>
          <Link to="/experiences/arcachon-mere-enfant">Bassin d’Arcachon — Ateliers Mère-Enfant</Link>
          <Link to="/experiences/marrakech-entre-femmes">Marrakech — Entre femmes</Link>
          <Link to="/experiences/marrakech-mere-enfant">Marrakech — Mère &amp; enfant</Link>
          <Link to="/experiences/trek-compostelle">Trek au féminin — Compostelle</Link>
          <Link to="/notre-histoire">Notre histoire</Link>
        </div>
        <div>
          <h3>Informations</h3>
          <Link to="/cgv">Conditions générales de vente</Link>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/mentions-legales#confidentialite">Confidentialité &amp; cookies</Link>
          <Link to="/contact">Contact</Link>
          <a href={settings.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <Link to="/admin" className="muted">Espace organisatrices</Link>
        </div>
      </div>
      <p className="small center">
        © {new Date().getFullYear()} Complices d’ailleurs. Mentions légales à compléter par les organisatrices.
        <br />
        <span className="muted" style={{ fontSize: '.76rem' }}>
          Photographies et visuels d’ambiance non contractuels — selon les dates et les formules (notamment pour les journées Mère-Enfant), le lieu d’accueil avec spa/jacuzzi peut varier tout en garantissant un standing et des prestations équivalents.
        </span>
      </p>
    </footer>
  );
}
