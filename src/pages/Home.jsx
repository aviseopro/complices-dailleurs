import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Photo, Reveal } from '../components/ui.jsx';
import Faq from '../components/Faq.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { useData } from '../data/store.js';

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
    title: 'Du temps sur le Bassin',
    text: 'Le spa, les balades et les repas partagés.',
    img: '/img/villa-jacuzzi.jpg',
  },
];

// Adapte les boutons d'une carte au statut réel de l'expérience
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
  const arca = experiences.find((e) => e.slug === 'arcachon-entre-femmes');
  const corse = experiences.find((e) => e.slug === 'corse');
  const trek = experiences.find((e) => e.slug === 'trek-compostelle');
  const mkFemmes = experiences.find((e) => e.slug === 'marrakech-entre-femmes');
  const mkMereEnfant = experiences.find((e) => e.slug === 'marrakech-mere-enfant');
  const arcaMereEnfant = experiences.find((e) => e.slug === 'arcachon-mere-enfant');
  const atelierEnfant = experiences.find((e) => e.slug === 'atelier-enfant');

  const validatedDates =
    arca?.dates && arca.dates.length > 0
      ? arca.dates.map((d) => d.label).filter(Boolean).join(' · ')
      : null;

  return (
    <>
      {/* 1. PREMIER ÉCRAN : PHOTO ACTUELLE DU BASSIN D'ARCACHON (CABANE SUR L'EAU, PINASSES & DUNE) */}
      <section className="hero hero-clean">
        <div className="hero-bg">
          <img
            src={settings.heroImage || '/img/hero-arcachon-net.jpg'}
            alt="Bassin d’Arcachon, cabane sur l’eau, pinasses et dune"
            className="hero-arcachon-photo"
          />
        </div>
        <div className="hero-shade hero-shade-soft" />
        <div className="wrap hero-in hero-single">
          <div className="hero-content-box">
            <div className="hero-kicker-row">
              <p className="hero-kicker">BASSIN D’ARCACHON · WEEK-END ENTRE FEMMES</p>
              {validatedDates && (
                <span className="hero-dates-pill">
                  <Calendar size={13} /> {validatedDates}
                </span>
              )}
            </div>

            <h1>Un week-end où l’on prend soin de vous.</h1>

            <p className="hero-presentation">
              Un soin du visage avec Émilie, du yoga avec Virginie, du temps au spa et de bons repas autour d’une même table. Nous vous accueillons dans un loft privatisé sur le Bassin, en petit groupe de huit femmes maximum. Vous pouvez venir seule ou avec une amie.
            </p>

            <div className="hero-cta-stack">
              <Link to="/experiences/arcachon-entre-femmes" className="btn btn-terra hero-main-btn">
                Découvrir le week-end
              </Link>
              <p className="hero-price-under-btn">
                {arca?.pricePerPerson || 450} € par personne · Hébergement, repas et programme bien-être inclus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOC LÉGER JUSTE EN DESSOUS DU PREMIER ÉCRAN : VALEUR DES PRESTATIONS VS TARIF DU SÉJOUR */}
      <section className="arca-value-bar-wrap" aria-label="Prestations incluses et tarif du week-end Bassin d'Arcachon">
        <div className="wrap">
          <div className="arca-light-value-box">
            <div className="alv-left">
              <span className="alv-tag">Prestations incluses dans le programme</span>
              <h2>Plus de 300 € de soins et de yoga inclus dans le week-end</h2>
              <p>
                Soin du visage haute technologie avec Émilie (rituel Jeunesse ou Glow), massage relaxant, cours d’auto-massage du visage et séance de luminothérapie LED, atelier créatif, ainsi que les séances de Yin et de Hatha Yoga avec Virginie et l’accès au spa et au sauna du loft.
              </p>
            </div>

            <div className="alv-divider" aria-hidden="true" />

            <div className="alv-right">
              <span className="alv-price-label">Tarif du séjour tout compris</span>
              <strong className="alv-price-figure">{arca?.pricePerPerson || 450} € <span>/ personne</span></strong>
              <p className="alv-price-note">
                Hébergement en loft privatisé, repas et soins inclus · Réservation avec {arca?.depositPerPlace || 95} € d’acompte
              </p>
              <div className="alv-actions">
                <Link to="/experiences/arcachon-entre-femmes" className="alv-link">
                  Voir le programme et le lieu <ArrowRight size={15} />
                </Link>
                <Link to="/reserver/arcachon-entre-femmes" className="btn btn-terra btn-sm">
                  Réserver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CE QUE L'ON VIT À ARCACHON (3 ENTRÉES COURTES ET VISUELLES) */}
      <section className="section home-moments-section" id="arcachon">
        <div className="wrap">
          <Reveal className="section-head-clean">
            <p className="eyebrow">Bassin d’Arcachon · L’esprit du week-end</p>
            <h2>Ce que l’on vit à Arcachon</h2>
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

      {/* 3. ÉMILIE ET VIRGINIE (VRAIE PHOTO + PRÉSENTATIONS À LA PREMIÈRE PERSONNE) */}
      <section className="section sand" id="histoire">
        <div className="wrap founders-clean">
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
              Nous vous accueillons toutes les deux sur chacune de nos expériences, avec l’envie de créer un cadre simple, chaleureux et soigné où chacune se sent immédiatement à l’aise.
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

            <div style={{ marginTop: '1.4rem' }}>
              <Link to="/notre-histoire" className="btn btn-ghost">
                Découvrir notre histoire <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. NOS ESCAPADES */}
      <section className="section" id="escapades">
        <div className="wrap">
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
                    <span className="escapade-status-pill open">Inscriptions ouvertes · 8 femmes max</span>
                  </Link>
                  <div className="escapade-body">
                    <span className="escapade-loc">Bassin d’Arcachon</span>
                    <h3>Bassin d’Arcachon entre femmes</h3>
                    <p>
                      Un week-end dans un loft privatisé avec piscine chauffée, spa et sauna : soin du visage et atelier créatif avec Émilie, Yin et Hatha Yoga avec Virginie, balades sous les pins et repas partagés.
                    </p>
                    <p className="escapade-meta">
                      <strong>450 € / personne</strong> · Acompte de 95 € · Plus de 300 € de soins et de yoga inclus
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
                      Villa de charme, soins esthétiques avec Émilie, séances de yoga sur la plage et de yoga aérien (avec tissus) avec Virginie, sortie en canoë vers l’île de Piana et bain sonore.
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
                    Riad de charme, yoga avec Virginie, ateliers créatifs (mosaïque) et bien-être avec Émilie, couleurs des souks et temps pour soi — décliné en deux séjours distincts :
                  </p>

                  <div className="marrakech-dual-links" aria-label="Choisir votre séjour à Marrakech">
                    <Link to="/experiences/marrakech-entre-femmes" className="mk-dual-btn">
                      <div>
                        <strong>Entre femmes</strong>
                        <span>4 jours / 3 nuits · Yoga, massage &amp; atelier mosaïque (6 à 8 femmes)</span>
                      </div>
                      <ArrowRight size={16} />
                    </Link>

                    <Link to="/experiences/marrakech-mere-enfant" className="mk-dual-btn">
                      <div>
                        <strong>Mère-enfant</strong>
                        <span>Ateliers créatifs, activités partagées, souks &amp; temps pour les mamans</span>
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
                      Petit groupe de 6 à 10 femmes · Listes de matériel et de courses fournies
                    </p>
                    <ExperienceCardActions exp={trek} />
                  </div>
                </article>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* 5. NOS ATELIERS (SECTION DISTINCTE) */}
      <section className="section sand" id="ateliers">
        <div className="wrap">
          <Reveal className="section-head-clean">
            <p className="eyebrow">Sur le Bassin d’Arcachon</p>
            <h2>Nos ateliers</h2>
            <p className="section-sub-clean">
              Des journées mère-enfant à partager ensemble et des rendez-vous créatifs où les enfants façonnent de leurs mains un objet qu’ils rapportent à la maison.
            </p>
          </Reveal>

          <div className="ateliers-grid2">
            {/* Atelier 1 : Journées mère-enfant sur le Bassin */}
            {arcaMereEnfant && (
              <Reveal>
                <article className="escapade-card atelier-card">
                  <Link to="/experiences/arcachon-mere-enfant" className="escapade-img-link">
                    <img src={arcaMereEnfant.image} alt="Journées mère-enfant sur le Bassin" loading="lazy" />
                    <span className="escapade-status-pill soon">À la journée · Bassin d’Arcachon</span>
                  </Link>
                  <div className="escapade-body">
                    <span className="escapade-loc">Duo Maman &amp; Enfant</span>
                    <h3>Journées mère-enfant sur le Bassin</h3>
                    <p>
                      Un vrai moment à vivre ensemble dans notre loft avec jardin et piscine : yoga ludique en duo avec Virginie, initiation au massage réciproque maman-enfant, lecture perchée dans le filet suspendu — puis un temps calme au spa pour les mamans pendant qu’Émilie anime l’atelier créatif des enfants.
                    </p>
                    <p className="escapade-meta">
                      Mercredis, samedis ou vacances scolaires · Déjeuner et goûter inclus
                    </p>
                    <ExperienceCardActions exp={arcaMereEnfant} />
                  </div>
                </article>
              </Reveal>
            )}

            {/* Atelier 2 : Ateliers créatifs pour enfants */}
            {atelierEnfant && (
              <Reveal delay={100}>
                <article className="escapade-card atelier-card">
                  <Link to="/experiences/atelier-enfant" className="escapade-img-link">
                    <img src={atelierEnfant.image} alt="Ateliers créatifs pour enfants" loading="lazy" />
                    <span className="escapade-status-pill soon">Demi-journée · Dès 5 ans</span>
                  </Link>
                  <div className="escapade-body">
                    <span className="escapade-loc">Argile · Mosaïque · Pâte Fimo</span>
                    <h3>Ateliers créatifs pour enfants</h3>
                    <p>
                      Un rendez-vous créatif animé par Émilie autour du modelage de l’argile (vide-poches, petits plats décoratifs), de la mosaïque ou de la création de bijoux en pâte Fimo. Tout le matériel et le goûter sont compris, et chaque enfant repart fier avec sa création.
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
          <div className="wrap">
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
