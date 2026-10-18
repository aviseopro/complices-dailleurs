import React, { useState } from 'react';
import { Sparkles, Sun, Waves, Home as HomeIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from './ui.jsx';

export const VILLA_PHOTOS = [
  {
    src: '/img/villa-salon-cathedrale.png',
    title: 'Grand salon cathédrale & filet suspendu',
    caption: 'Poutres apparentes, filet cocooning en mezzanine, fauteuil suspendu en macramé et volumes baignés de lumière.',
  },
  {
    src: '/img/villa-jacuzzi.jpg',
    title: 'Espace Jacuzzi intérieur privatisé',
    caption: 'Spa privatif sur lit de galets blancs et mur de pierre, pour se détendre en toute intimité entre les soins.',
  },
  {
    src: '/img/villa-terrasse-piscine.jpg',
    title: 'Terrasse bois, pergola & piscine',
    caption: 'Grande tablée conviviale à l’ombre de la pergola, cuisine d’été, piscine entourée de bois et espace détente au soleil.',
  },
  {
    src: '/img/villa-suite-baignoire.jpg',
    title: 'Chambre de charme & baignoire d’angle',
    caption: 'Mur en pierres de taille apparentes, baignoire privative, matériaux naturels et atmosphère apaisante.',
  },
  {
    src: '/img/villa-piscine-nuit.png',
    title: 'Douceur des soirées au bord de l’eau',
    caption: 'Piscine illuminée à la tombée de la nuit, bardage bois esprit cabane du Bassin et guirlandes chaleureuses.',
  },
  {
    src: '/img/villa-coin-lecture.png',
    title: 'Coin lecture & fauteuil suspendu',
    caption: 'Un cocon de douceur sous les poutres anciennes pour bouquiner, rêver ou grimper sur le filet en mezzanine.',
  },
  {
    src: '/img/villa-chambre-bois.jpg',
    title: 'Chambre esprit cabane du Bassin',
    caption: 'Tête de lit en bois patiné, lumière douce sous combles et détails marins authentiques.',
  },
  {
    src: '/img/villa-verriere-terrasse.jpg',
    title: 'Grande verrière ouverte sur l’extérieur',
    caption: 'Une circulation fluide dedans-dehors avec bois flotté, matières naturelles et lumière douce du Bassin d’Arcachon.',
  },
  {
    src: '/img/villa-salle-a-manger.png',
    title: 'Salle à manger en pierre & verrière atelier',
    caption: 'Mur en pierres de taille, verrière d’atelier et grande table conviviale pour nos repas végétariens gourmands.',
  },
  {
    src: '/img/villa-chambre-cabane.jpg',
    title: 'Couchages esprit cabane colorée',
    caption: 'Lits cocons en bois et métal aux couleurs des cabanes du Bassin d’Arcachon.',
  },
  {
    src: '/img/villa-filet-mezzanine.png',
    title: 'Le filet suspendu en mezzanine',
    caption: 'Un espace insolite et ultra-cocooning perché sous les toits pour lire, discuter entre femmes ou se reposer.',
  },
  {
    src: '/img/villa-table-exterieure.jpg',
    title: 'Déjeuners & brunchs sous la pergola',
    caption: 'Table conviviale dressée à l’ombre pour partager une cuisine végétarienne saine, locale et gourmande.',
  },
  {
    src: '/img/villa-cuisine-verriere.png',
    title: 'Cuisine ouverte & carreaux de ciment',
    caption: 'Un espace chaleureux avec verrière d’atelier et fruits frais à disposition tout au long du séjour.',
  },
];

export default function VillaShowcase() {
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
                <strong>Chambres de charme &amp; esprit cabane</strong>
                <span>Mur en pierre de taille, baignoire d’angle, bois patiné et couchages douillets.</span>
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
      </div>
    </section>
  );
}
