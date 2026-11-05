import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Photo, Reveal } from '../components/ui.jsx';

export default function Story() {
  return (
    <section className="section page">
      <div className="wrap">
        <p className="eyebrow">Notre histoire</p>
        <h1>Émilie et Virginie</h1>

        <div className="founders-clean" style={{ marginTop: '2rem' }}>
          <Reveal>
            <Photo
              src="/img/emilie-virginie-marrakech.jpg"
              label="Émilie et Virginie — Complices d’ailleurs"
              theme="sand"
              className="portrait zoom"
            />
          </Reveal>

          <Reveal delay={100} className="founders-text-col">
            <p className="founders-intro">
              Complices d’ailleurs est né de notre envie de créer des séjours et des journées à taille humaine, où l’on prend le temps de souffler, de partager de bons repas, de bouger à son rythme et de faire quelque chose de ses mains.
            </p>

            <div className="founder-voice-card">
              <h3>Émilie · Soins du visage et ateliers créatifs</h3>
              <p>
                « Je suis esthéticienne diplômée. Je réalise les soins du visage, dont les soins hydrafacial selon l’expérience, et j’anime les ateliers créatifs. J’aime proposer des moments où l’on prend le temps de faire quelque chose de ses mains, de laisser aller son imagination et de retrouver le plaisir de créer. »
              </p>
            </div>

            <div className="founder-voice-card">
              <h3>Virginie · Yoga</h3>
              <p>
                « Je suis professeure de yoga diplômée. Je vous guide dans des séances de Yin et de Hatha Yoga, avec une attention au rythme de chacune. »
              </p>
            </div>

            <p style={{ marginTop: '1.2rem', color: 'var(--ink)', lineHeight: 1.68 }}>
              Que ce soit pour un week-end dans notre loft sur le Bassin d’Arcachon, une escapade en Corse du Sud, un séjour en riad à Marrakech, un trek sur le chemin de Compostelle ou un atelier créatif sur le Bassin, nous vous accompagnons personnellement en petit groupe.
            </p>

            <div className="cta-row" style={{ marginTop: '1.6rem' }}>
              <Link to="/experiences/arcachon-entre-femmes" className="btn btn-terra">
                Découvrir le week-end à Arcachon <ArrowRight size={16} />
              </Link>
              <Link to="/#escapades" className="btn btn-ghost">
                Voir toutes nos escapades
              </Link>
              <Link to="/#ateliers" className="btn btn-ghost">
                Voir nos ateliers
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
