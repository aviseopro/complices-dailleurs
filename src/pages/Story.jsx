import React from 'react';
import { Link } from 'react-router-dom';
import { Photo, Reveal } from '../components/ui.jsx';

export default function Story() {
  return (
    <section className="section page">
      <div className="wrap narrow">
        <p className="eyebrow">Notre histoire</p>
        <h1>Émilie &amp; Virginie</h1>
        <Reveal><Photo src="/img/emilie-virginie-marrakech.jpg" label="Émilie et Virginie à Marrakech" theme="sand" className="portrait" /></Reveal>
        <Reveal>
          <p>Complices d’ailleurs est né de l’envie de créer des voyages au féminin : des parenthèses pour se reconnecter à soi, à sa féminité, dans la douceur, le mouvement et la sororité.</p>
          <ul className="plain">
            <li><strong>Émilie</strong> — esthéticienne diplômée.</li>
            <li><strong>Virginie</strong> — esthéticienne diplômée et professeure de yoga diplômée.</li>
          </ul>
          <blockquote>Parce que prendre soin de sa féminité, c’est aussi se donner la permission d’être pleinement soi.</blockquote>
          <p className="small">Biographies détaillées à fournir par Émilie et Virginie (modifiable dans le code ou à venir dans l’admin).</p>
          <Link to="/experiences/arcachon-entre-femmes" className="btn btn-blue">Découvrir l’expérience Arcachon</Link>
        </Reveal>
      </div>
    </section>
  );
}
