import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, BookOpen, Waves, Sun, Check, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from './ui.jsx';

export const MOTHER_CHILD_PHOTOS = [
  {
    src: '/img/atelier-mere-enfant-massage.jpg',
    fallback: '/img/villa-salon-cathedrale.png',
    badge: 'Rituel Signature · En Duo',
    title: 'Atelier Massage Complice Mère ↔ Enfant',
    caption: 'Un moment de tendresse rare guidé par nos esthéticiennes : l’enfant apprend des gestes doux pour masser sa maman (mains, épaules, visage), et la maman masse son enfant dans une bulle d’écoute absolue.',
  },
  {
    src: '/img/atelier-maman-spa.jpg',
    fallback: '/img/villa-jacuzzi.jpg',
    badge: 'Sérénité Absolue · Pour les Mamans',
    title: 'Le Temps des Mamans : Spa 7 places, Sauna & Quiétude',
    caption: 'Pendant qu’Émilie et Virginie animent l’atelier créatif des enfants (argile, mosaïque, bijoux en pâte Fimo), les mamans savourent en toute tranquillité le jacuzzi 7 places, le sauna 4 places et la piscine chauffée.',
  },
  {
    src: '/img/atelier-mere-enfant-lecture.jpg',
    fallback: '/img/villa-filet-mezzanine.png',
    badge: 'Cocon Poétique · En Duo',
    title: 'Lecture, Contes & Confidences dans le Filet Suspendu',
    caption: 'Lovés dans les coussins en lin du filet suspendu en mezzanine ou du coin lecture, maman et enfant partagent histoires, murmures et câlins hors du temps.',
  },
  {
    src: '/img/atelier-enfants-creatif.jpg',
    fallback: '/img/villa-table-exterieure.jpg',
    badge: 'Yoga, Création & Douceur · Enfants & Duo',
    title: 'Yoga Mère-Enfant, Créations Manuelles & Goûter Chic',
    caption: 'Séance de yoga ludique en duo avec Virginie (professeure diplômée), ateliers manuels (argile, vide-poche, mosaïque, pâte Fimo) où chaque enfant repart avec son objet, et grand goûter maison sur la terrasse.',
  },
];

export default function MotherChildShowcase({ embedded = false }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const prev = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i - 1 + MOTHER_CHILD_PHOTOS.length) % MOTHER_CHILD_PHOTOS.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setLightboxIdx((i) => (i + 1) % MOTHER_CHILD_PHOTOS.length);
  };

  const content = (
    <>
      <Reveal>
        <div className="mc-header">
          <span className="mc-badge"><Sparkles size={14} /> Parenthèse d’Exception à la Journée · Villa avec Spa sur le Bassin d’Arcachon</span>
          <h2>Ateliers &amp; Yoga Mère-Enfant — Journées Privilège</h2>
          <p className="script-sub">Yoga complice, massage réciproque maman ↔ enfant &amp; vrai temps de Spa pour les mamans</p>
          <p className="mc-lead">
            Dans l’écrin intimiste de notre <strong>villa-loft avec piscine chauffée, Spa 7 places et Sauna 4 places à 10 minutes à pied du Bassin d’Arcachon</strong>, nous avons imaginé des journées confidentielles en tout petit comité. Une expérience raffinée, douce et sécurisante qui réunit ce dont chaque maman rêve secrètement : <strong>du Yoga Mère-Enfant et des ateliers complices inoubliables avec son enfant</strong>, et <strong>le luxe d’un vrai moment de tranquillité au Spa pendant que nous occupons les enfants autour de belles créations manuelles (argile, mosaïque, bijoux Fimo) qu’ils remportent à la maison</strong>.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mc-dual-promise">
          <div className="mc-promise-card">
            <div className="mc-promise-icon"><Heart size={22} /></div>
            <span className="mc-promise-tag">1 · Yoga &amp; Connexion Mère-Enfant</span>
            <h3>Yoga en duo, massage complice &amp; souvenirs précieux</h3>
            <p>
              Loin du rythme effréné de la semaine et des écrans, vous partagez avec votre enfant des instants de pure présence guidés avec délicatesse :
            </p>
            <ul className="ticks">
              <li><Check size={15} /> <span><strong>Yoga Mère-Enfant &amp; Respiration avec Virginie</strong> : postures douces à deux, yoga ludique et apaisement guidés par notre professeure de yoga diplômée.</span></li>
              <li><Check size={15} /> <span><strong>Atelier Massage Réciproque (Maman ↔ Enfant)</strong> : apprendre à l’enfant à masser sa maman avec douceur, et masser son enfant pour l’apaiser.</span></li>
              <li><Check size={15} /> <span><strong>Moment Lecture &amp; Confidences</strong> perchés dans le grand filet suspendu en mezzanine autour de beaux livres.</span></li>
            </ul>
          </div>

          <div className="mc-promise-card highlight">
            <div className="mc-promise-icon"><Waves size={22} /></div>
            <span className="mc-promise-tag">2 · Le Temps Retrouvé des Mamans</span>
            <h3>Vous soufflez au Spa, vos enfants créent de leurs mains</h3>
            <p>
              Parce qu’une maman ressourcée est le plus beau des cadeaux : pendant que nous animons l’atelier manuel des enfants, <strong>vous profitez d’un temps rien que pour vous</strong> :
            </p>
            <ul className="ticks">
              <li><Check size={15} /> <span><strong>Accès libre au Spa Jacuzzi 7 places &amp; Sauna 4 places</strong> entre mamans, dans le calme absolu.</span></li>
              <li><Check size={15} /> <span><strong>Piscine chauffée, salon cathédrale &amp; terrasse en bois</strong> avec tisanes bio et collations saines.</span></li>
              <li><Check size={15} /> <span><strong>Atelier créatif pour les enfants</strong> (vide-poche en argile, mosaïque ou bijoux en pâte Fimo) : chaque enfant repart chez lui avec sa création.</span></li>
            </ul>
          </div>
        </div>
      </Reveal>

      <div className="mc-gallery-grid">
        {MOTHER_CHILD_PHOTOS.map((item, idx) => (
          <Reveal key={item.title} delay={idx * 90}>
            <button
              type="button"
              className="mc-photo-card"
              onClick={() => setLightboxIdx(idx)}
              aria-label={`Agrandir : ${item.title}`}
            >
              <div className="mc-photo-img-wrap">
                <img
                  src={item.src}
                  alt={item.title}
                  onError={(e) => {
                    if (item.fallback && e.currentTarget.src !== item.fallback) {
                      e.currentTarget.src = item.fallback;
                    }
                  }}
                />
                <span className="mc-photo-badge">{item.badge}</span>
              </div>
              <div className="mc-photo-body">
                <h4>{item.title}</h4>
                <p>{item.caption}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mc-schedule-box">
          <div className="mc-schedule-intro">
            <span className="eyebrow" style={{ marginBottom: '.3rem' }}>Format à la journée · Bassin d’Arcachon</span>
            <h3>Comment s’articule votre Journée Privilège Mère-Enfant ?</h3>
            <p>Un déroulé fluide et équilibré, pensé pour respecter le rythme des enfants (dès 5 ans) et offrir aux mamans une vraie parenthèse de douceur :</p>
            <div className="mc-cta-group">
              <Link to="/contact" className="btn btn-terra">Réserver ou privatiser une journée Mère-Enfant <ArrowRight size={16} /></Link>
              {!embedded && (
                <Link to="/experiences/arcachon-mere-enfant" className="btn btn-ghost">Voir la fiche complète de l’expérience</Link>
              )}
            </div>
          </div>

          <div className="mc-timeline">
            <div className="mc-step">
              <span className="mc-time"><Sun size={14} /> 10h00 – 12h30 · En Duo</span>
              <strong>Accueil gourmand, Yoga complice &amp; Atelier Massage Maman ↔ Enfant</strong>
              <p>Découverte de la villa, éveil corporel doux avec Virginie, puis grand atelier d’initiation au massage réciproque où l’enfant apprend à masser sa maman et reçoit son massage apaisant.</p>
            </div>
            <div className="mc-step">
              <span className="mc-time"><Sparkles size={14} /> 12h30 – 14h00 · Table d’Hôte</span>
              <strong>Déjeuner sain, raffiné &amp; convivial sous la verrière ou en terrasse</strong>
              <p>Une cuisine fraîche, locale et de saison qui ravit le palais des mamans comme celui des enfants.</p>
            </div>
            <div className="mc-step">
              <span className="mc-time"><Waves size={14} /> 14h00 – 16h00 · Temps séparé</span>
              <strong>Spa, Sauna &amp; Piscine pour les Mamans · Argile, Mosaïque &amp; Fimo pour les Enfants</strong>
              <p>Les mamans se prélassent au Spa 7 places et au Sauna pendant qu’Émilie et Virginie animent l’atelier manuel des enfants (vide-poche en argile, petit plat déco, mosaïque ou bijoux en pâte Fimo).</p>
            </div>
            <div className="mc-step">
              <span className="mc-time"><BookOpen size={14} /> 16h00 – 17h30 · Retrouvailles</span>
              <strong>Lecture perchée dans le Filet Suspendu, Goûter Chic &amp; Objet rapporté chez soi</strong>
              <p>Retrouvailles dans le filet en mezzanine autour de beaux livres, goûter maison gourmand et départ avec la création réalisée par chaque enfant.</p>
            </div>
          </div>
        </div>
        <p className="small muted" style={{ marginTop: '.85rem', fontSize: '.78rem', textAlign: 'right' }}>
          * Photographies d’illustration non contractuelles : selon les dates, la journée peut être organisée dans une autre villa de charme avec jacuzzi/spa sur le Bassin d’Arcachon de confort équivalent.
        </p>
      </Reveal>

      {lightboxIdx !== null && (
        <div
          className="villa-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={MOTHER_CHILD_PHOTOS[lightboxIdx].title}
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            className="villa-lb-close"
            aria-label="Fermer"
            onClick={() => setLightboxIdx(null)}
          >
            <X size={24} />
          </button>
          <button type="button" className="villa-lb-nav prev" aria-label="Précédent" onClick={prev}>
            <ChevronLeft size={28} />
          </button>
          <div className="villa-lb-content" onClick={(e) => e.stopPropagation()}>
            <img src={MOTHER_CHILD_PHOTOS[lightboxIdx].src} alt={MOTHER_CHILD_PHOTOS[lightboxIdx].title} />
            <div className="villa-lb-caption">
              <strong>{MOTHER_CHILD_PHOTOS[lightboxIdx].title}</strong>
              <p>{MOTHER_CHILD_PHOTOS[lightboxIdx].caption}</p>
              <small>{lightboxIdx + 1} / {CORSICA_DUMMY ? 4 : MOTHER_CHILD_PHOTOS.length}</small>
            </div>
          </div>
          <button type="button" className="villa-lb-nav next" aria-label="Suivant" onClick={next}>
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="mc-embedded" id="atelier-mere-enfant">{content}</div>;
  }

  return (
    <section className="section mc-section" id="atelier-mere-enfant">
      <div className="wrap">{content}</div>
    </section>
  );
}
const CORSICA_DUMMY = false;
