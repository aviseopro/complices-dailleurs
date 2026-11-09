import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Photo, Reveal } from '../components/ui.jsx';
import HeroCinemagraph from '../components/HeroCinemagraph.jsx';
import Faq from '../components/Faq.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { useData } from '../data/store.js';

function useParallax() {
  const ref = useRef(null);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (m.matches) return;
    const onScroll = () => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(0, ${Math.min(40, window.scrollY * 0.1)}px, 0)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return ref;
}

const arcachonMoments = [
  {
    title: 'Un soin du visage avec Émilie',
    text: 'Un temps pour soi et un soin esthétique adapté à sa peau.',
    img: '/img/arcachon-soin-visage-net.jpg',
  },
  {
    title: 'Du yoga avec Virginie',
    text: 'Des séances guidées pour bouger, respirer et ralentir.',
    img: '/img/arcachon-yoga-net.jpg',
  },
  {
    title: 'Du temps sur le Bassin d’Arcachon',
    text: 'Le spa, les balades et les repas partagés.',
    img: '/img/villa-jacuzzi.jpg',
  },
];

function ExperienceCardActions({ exp, defaultDiscoverLabel = 'Découvrir l’expérience' }) {
  const hasConfirmedBooking =
    exp &&
    exp.status === 'open' &&
    exp.pricePerPerson != null &&
    exp.depositPerPlace != null;

  return (
    <div className="home-card-actions">
      <Link to={`/experiences/${exp.slug}`} className="btn btn-terra btn-sm">
        {defaultDiscoverLabel}
      </Link>
      {hasConfirmedBooking ? (
        <Link to={`/reserver/${exp.slug}`} className="btn btn-ghost btn-sm">
          Réserver
        </Link>
      ) : (
        <Link to={`/contact?sejour=${exp.slug}`} className="btn btn-ghost btn-sm">
          Être prévenue des prochaines dates
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { settings, experiences, testimonials } = useData();
  const px = useParallax();
  const arca = experiences.find((e) => e.slug === 'arcachon-entre-femmes');
  const corse = experiences.find((e) => e.slug === 'corse');
  const trek = experiences.find((e) => e.slug === 'trek-compostelle');
  const mkFemmes = experiences.find((e) => e.slug === 'marrakech-entre-femmes');
  const arcaMereEnfant = experiences.find((e) => e.slug === 'arcachon-mere-enfant');
  const atelierEnfant = experiences.find((e) => e.slug === 'atelier-enfant');
  const journeeCopines = experiences.find((e) => e.slug === 'journee-entre-copines');

  const validatedDates =
    arca?.dates && arca.dates.length > 0
      ? arca.dates.map((d) => d.label).filter(Boolean).join(' · ')
      : 'Du 29 au 31 janvier 2027';

  return (
    <>
      {/* 1. PREMIER ÉCRAN DYNAMIQUE (CINEMAGRAPH / VIDÉO PLEINE LARGEUR SUR LE BASSIN D'ARCACHON) */}
      <section className="hero hero-clean">
        <div className="hero-bg">
          <HeroCinemagraph
            containerRef={px}
            src={settings.heroImage || '/img/hero-arcachon-net.jpg'}
            videoSrc={settings.heroVideo}
            alt="Sur le Bassin d’Arcachon, cabane sur l’eau, pinasses et dune"
          />
        </div>
        <div className="hero-shade hero-shade-soft" />
        <div className="wrap home-wrap hero-in hero-single">
          <div className="hero-header-row">
            <div className="hero-content-box">
              <div className="hero-kicker-row">
                <p className="hero-kicker">SUR LE BASSIN D’ARCACHON · WEEK-END ENTRE FEMMES</p>
              </div>

              <h1>Un week-end où l’on prend soin de vous.</h1>

              <p className="hero-presentation">
                Un soin du visage avec Émilie, du yoga avec Virginie, du temps au spa et de bons repas autour d’une même table. Nous vous accueillons dans un loft privatisé sur le Bassin d’Arcachon, en petit groupe de huit femmes maximum. Vous pouvez venir seule ou avec une amie.
              </p>

              <p className="hero-pro-booking-hook">
                <Calendar size={15} />
                <span>
                  Réservez votre parenthèse pour notre prochain week-end <strong>sur le Bassin d’Arcachon</strong>, <strong>du 29 au 31 janvier 2027</strong>.
                </span>
              </p>

              <div className="hero-cta-stack">
                <div className="hero-cta-buttons-inline">
                  <Link to="/experiences/arcachon-entre-femmes" className="btn btn-terra hero-main-btn">
                    Découvrir le week-end
                  </Link>
                  <Link to="/reserver/arcachon-entre-femmes" className="btn btn-light hero-book-btn">
                    Réserver · 29 au 31 janv. 2027
                  </Link>
                </div>
                <p className="hero-price-under-btn">
                  {arca?.pricePerPerson || 450} € par personne · Hébergement, repas et programme bien-être inclus
                </p>
              </div>
            </div>

            {/* Petit rond élégant dans le Header avec les dates du prochain week-end */}
            <Link
              to="/reserver/arcachon-entre-femmes"
              className="hero-date-circle"
              aria-label={`Réserver notre prochain week-end sur le Bassin d’Arcachon, ${validatedDates}`}
            >
              <span className="hdc-ring" aria-hidden="true" />
              <span className="hdc-eyebrow">Prochaine édition</span>
              <strong className="hdc-days">29 — 31</strong>
              <span className="hdc-month">Janvier 2027</span>
              <span className="hdc-loc">Sur le Bassin d’Arcachon</span>
              <span className="hdc-cta">Réserver →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOC LÉGER ET COMPACT JUSTE EN DESSOUS DU PREMIER ÉCRAN */}
      <section className="arca-value-bar-wrap" aria-label="Prestations incluses et tarif du week-end Bassin d'Arcachon">
        <div className="wrap home-wrap">
          <div className="arca-light-value-box">
            <div className="alv-left">
              <span className="alv-tag">Prestations incluses dans le programme</span>
              <h2>Plus de 300 € de soins et de yoga inclus dans le week-end</h2>
              <p>
                Soins du visage (dont soin hydrafacial selon la formule) et massages réalisés par Émilie et Virginie, toutes deux esthéticiennes diplômées, cours d’auto-massage du visage et séance de luminothérapie LED, atelier créatif avec Émilie, séances de Yin et de Hatha Yoga avec Virginie et accès au spa et au sauna du loft.
              </p>
            </div>

            <div className="alv-divider" aria-hidden="true" />

            <div className="alv-right">
              <span className="alv-price-label">Tarif du séjour tout compris</span>
              <strong className="alv-price-figure">
                {arca?.pricePerPerson || 450} € <span>/ personne</span>
              </strong>
              <p className="alv-price-note">
                Hébergement en loft privatisé, repas et soins inclus · Réservation avec {arca?.depositPerPlace || 150} € d’acompte (ou 3 × 150 €)
              </p>
              <div className="alv-actions">
                <Link to="/experiences/arcachon-entre-femmes" className="alv-link">
                  Voir le programme <ArrowRight size={14} />
                </Link>
                <Link to="/reserver/arcachon-entre-femmes" className="btn btn-terra btn-sm">
                  Réserver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CE QUE L'ON VIT SUR LE BASSIN D'ARCACHON */}
      <section className="section home-moments-section" id="arcachon">
        <div className="wrap home-wrap">
          <Reveal className="section-head-clean">
            <p className="eyebrow">Sur le Bassin d’Arcachon · L’esprit du week-end</p>
            <h2>Ce que l’on vit sur le Bassin d’Arcachon</h2>
          </Reveal>

          <div className="moments-grid3">
            {arcachonMoments.map((m, i) => (
              <Reveal key={m.title} delay={i * 90}>
                <Link to="/experiences/arcachon-entre-femmes" className="moment-card">
                  <div className="moment-img-wrap">
                    <img src={m.img} alt={m.title} loading="lazy" />
                  </div>
                  <div className="moment-body">
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="section-foot-link">
            <Link to="/experiences/arcachon-entre-femmes" className="btn btn-ghost">
              Découvrir le loft, le programme jour par jour et toutes les prestations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ÉMILIE ET VIRGINIE */}
      <section className="section sand" id="histoire">
        <div className="wrap home-wrap founders-clean">
          <Reveal>
            <Photo
              src="/img/emilie-virginie-marrakech.jpg"
              label="Émilie et Virginie — Complices d’ailleurs"
              theme="sand"
              className="portrait zoom"
            />
          </Reveal>

          <Reveal delay={100} className="founders-text-col">
            <p className="eyebrow">Qui sommes-nous</p>
            <h2>Émilie et Virginie</h2>
            <p className="founders-intro">
              <strong>Émilie et Virginie sont toutes les deux esthéticiennes diplômées et réalisent les soins du visage et les massages</strong> lors de vos séjours et journées. Chacune vous accompagne ensuite avec sa spécialité complémentaire : <strong>le yoga avec Virginie</strong> et <strong>les ateliers créatifs avec Émilie</strong>.
            </p>

            <div className="founder-voice-card">
              <h3>Émilie · Esthéticienne diplômée &amp; ateliers créatifs</h3>
              <p>
                « Je suis esthéticienne diplômée. Avec Virginie, nous réalisons les soins du visage — dont les soins hydrafacial selon l’expérience — et les massages bien-être. J’anime également les ateliers créatifs : j’aime proposer des moments où l’on prend le temps de faire quelque chose de ses mains, de laisser aller son imagination et de retrouver le plaisir de créer. »
              </p>
            </div>

            <div className="founder-voice-card">
              <h3>Virginie · Esthéticienne diplômée &amp; professeure de yoga</h3>
              <p>
                « Je suis moi aussi esthéticienne diplômée et je réalise les soins du visage et les massages à vos côtés. Je suis également professeure de yoga diplômée : je vous guide dans des séances de Yin et de Hatha Yoga, avec une attention au rythme de chacune. »
              </p>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/notre-histoire" className="btn btn-ghost">
                Découvrir notre histoire <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. NOS ESCAPADES */}
      <section className="section" id="escapades">
        <div className="wrap home-wrap">
          <Reveal className="section-head-clean">
            <p className="eyebrow">Séjours en petit groupe</p>
            <h2>Nos escapades</h2>
            <p className="section-sub-clean">
              Des parenthèses accompagnées par Émilie et Virginie, sur le Bassin d’Arcachon, en Corse, à Marrakech et sur le chemin de Compostelle.
            </p>
          </Reveal>

          <div className="escapades-grid">
            {/* Carte 1 : Bassin d'Arcachon entre femmes */}
            {arca && (
              <Reveal>
                <article className="escapade-card featured">
                  <Link to="/experiences/arcachon-entre-femmes" className="escapade-img-link">
                    <img src={arca.image} alt={arca.title} loading="lazy" />
                    <span className="escapade-status-pill open">Du 29 au 31 janv. 2027 · 8 femmes max</span>
                  </Link>
                  <div className="escapade-body">
                    <span className="escapade-loc">Sur le Bassin d’Arcachon</span>
                    <h3>Week-end entre femmes sur le Bassin d’Arcachon</h3>
                    <p>
                      Week-end en loft privatisé avec spa et sauna : soins du visage et massages avec Émilie et Virginie (toutes deux esthéticiennes diplômées), Yin et Hatha Yoga avec Virginie, atelier créatif avec Émilie, balades et repas partagés.
                    </p>
                    <p className="escapade-meta">
                      <strong>Du 29 au 31 janvier 2027</strong> · <strong>450 € / pers.</strong> · Acompte 150 € (ou 3 × 150 €)
                    </p>
                    <ExperienceCardActions exp={arca} defaultDiscoverLabel="Découvrir l’expérience" />
                  </div>
                </article>
              </Reveal>
            )}

            {/* Carte 2 : Corse du Sud */}
            {corse && (
              <Reveal delay={80}>
                <article className="escapade-card">
                  <Link to="/experiences/corse" className="escapade-img-link">
                    <img src={corse.image} alt={corse.title} loading="lazy" />
                    <span className="escapade-status-pill soon">3 à 4 jours · Dates à confirmer</span>
                  </Link>
                  <div className="escapade-body">
                    <span className="escapade-loc">Sartène · Porto-Vecchio · Bonifacio</span>
                    <h3>Corse du Sud entre femmes</h3>
                    <p>
                      Villa de charme, soins esthétiques et massages avec Émilie et Virginie, yoga sur la plage et yoga aérien (avec tissus) avec Virginie, sortie en canoë vers l’île de Piana et bain sonore.
                    </p>
                    <p className="escapade-meta">
                      Groupe de 8 femmes · Dates et tarif définitif à venir
                    </p>
                    <ExperienceCardActions exp={corse} />
                  </div>
                </article>
              </Reveal>
            )}

            {/* Carte 3 : Marrakech (Une carte unique avec deux liens : Entre femmes & Mère-enfant) */}
            <Reveal delay={140}>
              <article className="escapade-card">
                <Link to="/experiences/marrakech-entre-femmes" className="escapade-img-link">
                  <img
                    src={mkFemmes?.image || '/img/marrakech-femmes-net.jpg'}
                    alt="Marrakech avec Complices d’ailleurs"
                    loading="lazy"
                  />
                  <span className="escapade-status-pill soon">2 formules · Dates à confirmer</span>
                </Link>
                <div className="escapade-body">
                  <span className="escapade-loc">Maroc · Riad dans la médina</span>
                  <h3>Marrakech</h3>
                  <p>
                    Riad de charme, yoga avec Virginie, ateliers créatifs (mosaïque) et bien-être avec Émilie, couleurs des souks et temps pour soi :
                  </p>

                  <div className="marrakech-dual-links" aria-label="Choisir votre séjour à Marrakech">
                    <Link to="/experiences/marrakech-entre-femmes" className="mk-dual-btn">
                      <div>
                        <strong>Entre femmes</strong>
                        <span>4 jours / 3 nuits · Yoga, massage &amp; atelier mosaïque</span>
                      </div>
                      <ArrowRight size={16} />
                    </Link>

                    <Link to="/experiences/marrakech-mere-enfant" className="mk-dual-btn">
                      <div>
                        <strong>Mère-enfant</strong>
                        <span>Ateliers créatifs, activités partagées, souks &amp; temps mamans</span>
                      </div>
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  <div className="home-card-actions">
                    <Link to="/contact?sejour=marrakech" className="btn btn-ghost btn-sm">
                      Être prévenue des prochaines dates
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Carte 4 : Trek au féminin sur le chemin de Compostelle */}
            {trek && (
              <Reveal delay={200}>
                <article className="escapade-card">
                  <Link to="/experiences/trek-compostelle" className="escapade-img-link">
                    <img src={trek.image} alt={trek.title} loading="lazy" />
                    <span className="escapade-status-pill soon">2 à 3 jours · Dates à confirmer</span>
                  </Link>
                  <div className="escapade-body">
                    <span className="escapade-loc">Chemin de Compostelle</span>
                    <h3>Trek au féminin sur le chemin de Compostelle</h3>
                    <p>
                      Oser partir marcher entre femmes pendant 2 à 3 jours : éveil corporel et Yin Yoga de récupération avec Virginie, cuisine en pleine nature et veillées au bivouac avec Émilie.
                    </p>
                    <p className="escapade-meta">
                      Petit groupe de 6 à 10 femmes · Listes fournies en amont
                    </p>
                    <ExperienceCardActions exp={trek} />
                  </div>
                </article>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* 5. NOS JOURNÉES & ATELIERS */}
      <section className="section sand" id="ateliers">
        <div className="wrap home-wrap">
          <Reveal className="section-head-clean">
            <p className="eyebrow">Près de Bordeaux &amp; sur le Bassin d’Arcachon</p>
            <h2>Nos journées &amp; ateliers</h2>
            <p className="section-sub-clean">
              Une journée entre copines à la carte près de Bordeaux, des journées mère-enfant à partager ensemble et des rendez-vous créatifs pour les enfants.
            </p>
          </Reveal>

          <div className="ateliers-grid2">
            {/* Carte 1 : Une journée entre copines */}
            <Reveal>
              <article className="escapade-card atelier-card featured">
                <Link to="/experiences/journee-entre-copines" className="escapade-img-link">
                  <img
                    src={journeeCopines?.image || '/img/villa-jacuzzi.jpg'}
                    alt="Une journée entre copines"
                    loading="lazy"
                  />
                  <span className="escapade-status-pill open">À la carte · Bordeaux &amp; environs</span>
                </Link>
                <div className="escapade-body">
                  <span className="escapade-loc">Soins, yoga et détente à la carte près de Bordeaux</span>
                  <h3>Une journée entre copines</h3>
                  <p>
                    Enfin une journée où l’on prend le temps de se retrouver : soins du visage et massages réalisés par Émilie et Virginie (toutes deux esthéticiennes diplômées), yoga avec Virginie, atelier créatif avec Émilie et détente au jacuzzi ou au sauna selon le loft retenu.
                  </p>
                  <p className="escapade-meta">
                    Bordeaux &amp; environs · Lieu, déroulé et tarif adaptés à votre groupe
                  </p>
                  <div className="home-card-actions">
                    <Link to="/experiences/journee-entre-copines" className="btn btn-terra btn-sm">
                      Découvrir la journée
                    </Link>
                    <Link to="/experiences/journee-entre-copines#organiser" className="btn btn-ghost btn-sm">
                      Organiser notre journée
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Carte 2 : Journées mère-enfant sur le Bassin */}
            {arcaMereEnfant && (
              <Reveal delay={70}>
                <article className="escapade-card atelier-card">
                  <Link to="/experiences/arcachon-mere-enfant" className="escapade-img-link">
                    <img src={arcaMereEnfant.image} alt="Journées mère-enfant sur le Bassin" loading="lazy" />
                    <span className="escapade-status-pill soon">À la journée · Bassin d’Arcachon</span>
                  </Link>
                  <div className="escapade-body">
                    <span className="escapade-loc">Duo Maman &amp; Enfant</span>
                    <h3>Journées mère-enfant sur le Bassin</h3>
                    <p>
                      Un moment à vivre ensemble au loft : yoga ludique en duo avec Virginie, initiation au massage réciproque maman-enfant, lecture perchée dans le filet suspendu — puis temps au spa pour les mamans pendant l’atelier créatif des enfants avec Émilie.
                    </p>
                    <p className="escapade-meta">
                      Mercredis, samedis ou vacances scolaires · Déjeuner et goûter inclus
                    </p>
                    <ExperienceCardActions exp={arcaMereEnfant} />
                  </div>
                </article>
              </Reveal>
            )}

            {/* Carte 3 : Ateliers créatifs pour enfants */}
            {atelierEnfant && (
              <Reveal delay={120}>
                <article className="escapade-card atelier-card">
                  <Link to="/experiences/atelier-enfant" className="escapade-img-link">
                    <img src={atelierEnfant.image} alt="Ateliers créatifs pour enfants" loading="lazy" />
                    <span className="escapade-status-pill soon">Demi-journée · Dès 5 ans</span>
                  </Link>
                  <div className="escapade-body">
                    <span className="escapade-loc">Argile · Mosaïque · Pâte Fimo</span>
                    <h3>Ateliers créatifs pour enfants</h3>
                    <p>
                      Un rendez-vous créatif animé par Émilie autour du modelage de l’argile (vide-poches, petits plats décoratifs), de la mosaïque ou des bijoux en pâte Fimo. Chaque enfant repart fier avec sa création.
                    </p>
                    <p className="escapade-meta">
                      Petit groupe de 6 à 10 enfants · Matériel créatif et goûter maison inclus
                    </p>
                    <ExperienceCardActions exp={atelierEnfant} />
                  </div>
                </article>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section">
          <div className="wrap home-wrap">
            <p className="eyebrow">Elles racontent</p>
            <h2>Témoignages</h2>
            <div className="testi">
              {testimonials.map((t, i) => (
                <blockquote key={i}>
                  <p>« {t.text} »</p>
                  <cite>— {t.author}</cite>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <Faq />
      <Newsletter />
    </>
  );
}
