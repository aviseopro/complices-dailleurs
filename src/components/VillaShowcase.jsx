import React, { useState } from 'react';
import { Sparkles, Sun, Waves, Home as HomeIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from './ui.jsx';

export const VILLA_PHOTOS = [
  {
    src: '/img/villa-salon-cathedrale.png',
    title: 'Grand salon cathédrale & filet suspendu',
    caption: 'Poutres apparentes, filet cocooning en mezzanine, fauteuil suspendu en macramé et volumes baignés de lumière.',
    featured: true,
  },
  {
    src: '/img/villa-jacuzzi.jpg',
    title: 'Espace Jacuzzi intérieur privatisé',
    caption: 'Spa privatif sur lit de galets blancs et mur de pierre, pour se détendre en toute intimité entre les soins.',
    featured: true,
  },
  {
    src: '/img/villa-terrasse-piscine.jpg',
    title: 'Terrasse bois, pergola & piscine',
    caption: 'Grande tablée conviviale à l’ombre de la pergola, cuisine d’été, piscine entourée de bois et espace détente au soleil.',
    featured: true,
  },
  {
    src: '/img/villa-piscine-nuit.png',
    title: 'Douceur des soirées au bord de l’eau',
    caption: 'Piscine illuminée à la tombée de la nuit, bardage bois esprit cabane du Bassin et guirlandes chaleureuses.',
    featured: true,
  },
  {
    src: '/img/villa-verriere-terrasse.jpg',
    title: 'Grande verrière ouverte sur l’extérieur',
    caption: 'Une circulation fluide dedans-dehors avec bois flotté, matières naturelles et lumière douce du Bassin d’Arcachon.',
    featured: true,
  },
  {
    src: '/img/villa-salle-a-manger.png',
    title: 'Salle à manger en pierre & verrière atelier',
    caption: 'Mur en pierres de taille, verrière d’atelier et grande table conviviale pour nos repas végétariens gourmands.',
    featured: true,
  },
];

export default function VillaShowcase() {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + VILLA_PHOTOS.length) % VILLA_PHOTOS.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % VILLA_PHOTOS.length);
  };

  return (
    <section className="section villa-sec" id="lieu">
      <div className="wrap">
        <Reveal>
          <div className="villa-head">
            <p className="eyebrow">Votre refuge exclusif · Bassin d’Arcachon</p>
            <h2>Un lieu d’exception niché sur le Bassin d’Arcachon</h2>
            <p className="script-sub">L’esprit cabane chic du Bassin, entre matières naturelles, piscine et jacuzzi privatif</p>
            <p>
              Pour que votre parenthèse entre femmes soit inoubliable, nous avons choisi une <strong>villa de charme entièrement privatisée sur le Bassin d’Arcachon</strong>. Alliage rare de pierre, de bardage bois inspiré des cabanes ostréicoles et de grands volumes lumineux, chaque espace a été pensé pour vous offrir confort, intimité et lâcher-prise :
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="villa-pillars">
            <div className="villa-pillar">
              <Waves size={22} />
              <div>
                <strong>Jacuzzi intérieur &amp; piscine extérieure</strong>
                <span>Un espace spa sur lit de galets blancs et un bassin entouré d’une terrasse en bois.</span>
              </div>
            </div>
            <div className="villa-pillar">
              <HomeIcon size={22} />
              <div>
                <strong>Salon cathédrale &amp; coins cocooning</strong>
                <span>Poutres apparentes, filet suspendu en hauteur, fauteuil macramé et grande verrière atelier.</span>
              </div>
            </div>
            <div className="villa-pillar">
              <Sun size={22} />
              <div>
                <strong>Pergola ombragée &amp; vie dedans-dehors</strong>
                <span>Grande tablée sous les ombres, cuisine d’été, jardin intimiste et soirées sous les guirlandes.</span>
              </div>
            </div>
            <div className="villa-pillar">
              <Sparkles size={22} />
              <div>
                <strong>Cocon privatisé entre femmes</strong>
                <span>Un cadre haut de gamme, chaleureux et sans vis-à-vis pour se sentir immédiatement chez soi.</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="villa-mosaic">
          {VILLA_PHOTOS.map((photo, idx) => (
            <Reveal key={photo.src} delay={(idx % 3) * 70}>
              <button
                type="button"
                className={`villa-photo-card ${idx === 0 || idx === 3 ? 'wide' : ''}`}
                onClick={() => setLightboxIdx(idx)}
                aria-label={`Agrandir la photo : ${photo.title}`}
              >
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <div className="villa-photo-cap">
                  <strong>{photo.title}</strong>
                  <span>{photo.caption}</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {lightboxIdx !== null && (
          <div
            className="villa-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={VILLA_PHOTOS[lightboxIdx].title}
            onClick={() => setLightboxIdx(null)}
          >
            <button
              type="button"
              className="villa-lb-close"
              aria-label="Fermer la galerie"
              onClick={() => setLightboxIdx(null)}
            >
              <X size={24} />
            </button>
            <button type="button" className="villa-lb-nav prev" aria-label="Photo précédente" onClick={prev}>
              <ChevronLeft size={28} />
            </button>
            <div className="villa-lb-content" onClick={(e) => e.stopPropagation()}>
              <img src={VILLA_PHOTOS[lightboxIdx].src} alt={VILLA_PHOTOS[lightboxIdx].title} />
              <div className="villa-lb-caption">
                <strong>{VILLA_PHOTOS[lightboxIdx].title}</strong>
                <p>{VILLA_PHOTOS[lightboxIdx].caption}</p>
                <small>{lightboxIdx + 1} / {VILLA_PHOTOS.length}</small>
              </div>
            </div>
            <button type="button" className="villa-lb-nav next" aria-label="Photo suivante" onClick={next}>
              <ChevronRight size={28} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
