import React, { useState } from 'react';
import { Sparkles, Sun, Waves, Home as HomeIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from './ui.jsx';

export const VILLA_PHOTOS = [
  {
    src: '/img/villa-salon-cathedrale.png',
    title: 'Loft atypique rénové & filet suspendu',
    caption: 'Grand volume cathédrale, poutres apparentes, filet cocooning en mezzanine et fauteuil suspendu en macramé.',
  },
  {
    src: '/img/villa-jacuzzi.jpg',
    title: 'Pièce détente : Spa 7 places & Sauna 4 places',
    caption: 'Un véritable espace bien-être intérieur privatisé avec Spa 7 places sur lit de galets blancs et Sauna 4 places.',
  },
  {
    src: '/img/villa-terrasse-piscine.jpg',
    title: 'Piscine chauffée, terrasse bois & cuisine d’été',
    caption: 'Patio extérieur sans vis-à-vis avec piscine chauffée, salon de détente, cuisine d’été et grande tablée sous la pergola.',
  },
  {
    src: '/img/villa-suite-baignoire.jpg',
    title: 'La Chambre « Nature » & sa baignoire privative',
    caption: 'Mur en pierres de taille apparentes, baignoire d’angle privative, bois naturel et atmosphère apaisante.',
  },
  {
    src: '/img/villa-piscine-nuit.png',
    title: 'Piscine chauffée illuminée à la nuit tombée',
    caption: 'Bardage bois esprit cabane du Bassin, guirlandes chaleureuses et baignade sous les étoiles.',
  },
  {
    src: '/img/villa-coin-lecture.png',
    title: 'Coin lecture & fauteuil suspendu',
    caption: 'Un cocon de douceur sous les poutres anciennes pour bouquiner, rêver ou grimper sur le filet en mezzanine.',
  },
  {
    src: '/img/villa-chambre-bois.jpg',
    title: 'Chambre « Cabane Perchée » & Chambre « Charme »',
    caption: 'Tête de lit en bois patiné, salle de bain attenante, lumière douce et détails marins authentiques.',
  },
  {
    src: '/img/villa-verriere-terrasse.jpg',
    title: 'Grande verrière ouverte sur le patio',
    caption: 'Circulation fluide dedans-dehors entre le salon, la terrasse en bois et la piscine chauffée.',
  },
  {
    src: '/img/villa-salle-a-manger.png',
    title: 'Salle à manger en pierre & verrière atelier',
    caption: 'Mur en pierres de taille, verrière d’atelier et grande table conviviale pour nos repas végétariens gourmands.',
  },
  {
    src: '/img/villa-chambre-cabane.jpg',
    title: 'Espace couchages esprit cabane colorée',
    caption: 'Lits cocons 80×200 aux couleurs des cabanes ostréicoles du Bassin d’Arcachon.',
  },
  {
    src: '/img/villa-filet-mezzanine.png',
    title: 'Le filet suspendu en mezzanine',
    caption: 'Un espace insolite et ultra-cocooning perché sous les toits pour lire, discuter entre femmes ou se reposer.',
  },
  {
    src: '/img/villa-table-exterieure.jpg',
    title: 'Déjeuners & brunchs sur la grande terrasse bois',
    caption: 'Table conviviale dressée à l’ombre pour partager une cuisine végétarienne saine, locale et gourmande.',
  },
  {
    src: '/img/villa-cuisine-verriere.png',
    title: 'Cuisine ouverte & carreaux de ciment',
    caption: 'Un espace chaleureux avec verrière d’atelier et fruits frais à disposition tout au long du séjour.',
  },
];

export default function VillaShowcase({ embedded = false }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visiblePhotos = showAll ? VILLA_PHOTOS : VILLA_PHOTOS.slice(0, 6);

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + VILLA_PHOTOS.length) % VILLA_PHOTOS.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % VILLA_PHOTOS.length);
  };

  const inner = (
    <>
      <Reveal>
        <div className="villa-head">
          <p className="eyebrow">Votre refuge exclusif · À 10 min à pied du Bassin d’Arcachon</p>
          <h2>Un loft d’exception, atypique et plein de surprises</h2>
          <p className="script-sub">Piscine chauffée, Spa 7 places, Sauna 4 places et sentier du littoral à deux pas</p>
          <p>
            Pour votre parenthèse entre femmes, nous avons privatisé un <strong>loft entièrement rénové, indépendant et plein de charme, niché à seulement 10 minutes à pied du Bassin d’Arcachon</strong> et à deux pas des sentiers naturels du littoral. Alliage unique de pierre, de bois et de grands volumes lumineux, tout y est réuni pour un lâcher-prise absolu :
          </p>
        </div>
      </Reveal>

        <Reveal delay={80}>
          <div className="villa-pillars">
            <div className="villa-pillar">
              <Waves size={22} />
              <div>
                <strong>Spa 7 places &amp; Sauna 4 places</strong>
                <span>Une pièce de détente intérieure entièrement dédiée à votre bien-être, avec grand jacuzzi et sauna privatif.</span>
              </div>
            </div>
            <div className="villa-pillar">
              <Sun size={22} />
              <div>
                <strong>Piscine chauffée &amp; patio d’été</strong>
                <span>Grande terrasse en bois, piscine chauffée, salon de détente extérieur, pergola ombragée et cuisine d’été.</span>
              </div>
            </div>
            <div className="villa-pillar">
              <HomeIcon size={22} />
              <div>
                <strong>Chambres de caractère &amp; surprises</strong>
                <span>Chambre Nature avec baignoire privative, Chambre Charme avec salle d’eau, Chambre Cabane Perchée, dortoir cabane et filet suspendu.</span>
              </div>
            </div>
            <div className="villa-pillar">
              <Sparkles size={22} />
              <div>
                <strong>Bassin &amp; sentier du littoral à 10 min</strong>
                <span>À 10 minutes à pied du Bassin d’Arcachon et des sentiers côtiers pour nos balades ressourçantes à l’ombre des pins.</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="villa-mosaic">
          {visiblePhotos.map((photo, idx) => (
            <Reveal key={photo.src} delay={(idx % 3) * 70}>
              <button
                type="button"
                className="villa-photo-card"
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

        {VILLA_PHOTOS.length > 6 && (
          <div className="center" style={{ marginTop: '1.6rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Réduire la galerie' : `Voir les ${VILLA_PHOTOS.length} photos de la villa`}
            </button>
          </div>
        )}

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
    </>
  );

  if (embedded) {
    return <div className="villa-embedded" id="lieu">{inner}</div>;
  }

  return (
    <section className="section villa-sec" id="lieu">
      <div className="wrap">{inner}</div>
    </section>
  );
}
