import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, X, Sparkles, Gem } from 'lucide-react';
import { Photo, Reveal, STATUS, Price, AlmaLogo } from '../components/ui.jsx';
import ArcachonCommercialPlaque from '../components/ArcachonCommercialPlaque.jsx';
import MarrakechFlightModule from '../components/MarrakechFlightModule.jsx';
import MarrakechExperienceShowcase from '../components/MarrakechExperienceShowcase.jsx';
import VillaShowcase from '../components/VillaShowcase.jsx';
import MotherChildShowcase from '../components/MotherChildShowcase.jsx';
import KidsWorkshopShowcase from '../components/KidsWorkshopShowcase.jsx';
import CorsicaShowcase from '../components/CorsicaShowcase.jsx';
import FriendsDayShowcase from '../components/FriendsDayShowcase.jsx';
import { useData, euro } from '../data/store.js';
import { seatsLeft } from '../lib/booking.js';

const COND_LABELS = {
  exclusivite: 'Exclusif & Inédit',
  imputation: 'Imputation de la pré-réservation sur le prix final',
  remboursement: 'Remboursement',
  garantiePlace: 'Garantie de place',
  dates: 'Dates',
  capacite: 'Capacité',
  trancheAge: 'Tranche d’âge',
  encadrement: 'Encadrement',
};

export default function Experience() {
  const { slug } = useParams();
  const { experiences, bookings, settings } = useData();
  if (slug === 'journee-entre-copines') {
    document.title = 'Une journée entre copines — Complices d’ailleurs';
    return <FriendsDayShowcase />;
  }
  const e = experiences.find((x) => x.slug === slug);
  if (!e)
    return (
      <section className="section">
        <div className="wrap">
          <h1>Séjour introuvable</h1>
          <Link to="/">Retour</Link>
        </div>
      </section>
    );

  const arca = e.slug === 'arcachon-entre-femmes';
  const arcaMereEnfant = e.slug === 'arcachon-mere-enfant';
  const isAtelierEnfant = e.slug === 'atelier-enfant';
  const isCorse = e.slug === 'corse';
  const isMarrakechFemmes = e.slug === 'marrakech-entre-femmes';
  const isMarrakech = e.slug?.startsWith('marrakech');
  const left = seatsLeft(e, bookings);
  document.title = `${e.title} — Complices d’ailleurs`;

  return (
    <article className={`page theme-${e.theme}`}>
      <header className="page-hero">
        <Photo
          label={e.title}
          theme={e.theme}
          src={e.image || (e.theme === 'arcachon' ? settings.heroImage : undefined)}
          className="ph-hero"
        />
        <div className="wrap page-hero-in">
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '.6rem', marginBottom: '.4rem' }}>
            <span className={`pill ${e.status}`}>{STATUS[e.status]}</span>
            {(arca || isCorse) && (
              <span className="exclu-300-hero-badge">
                <Gem size={14} />{' '}
                {isCorse
                  ? 'Plus de 300 € de soins esthétiques & cours de Yoga Aérien (avec tissus) inclus'
                  : 'Plus de 300 € de soins et de yoga inclus dans le week-end'}
              </span>
            )}
          </div>
          <h1>{e.title}</h1>
          <p className="lead">{e.short}</p>
          {arca && <ArcachonCommercialPlaque e={e} variant="hero" />}
        </div>
      </header>

      <div className="wrap detail">
        <div>
          <Reveal>
            <p className="big">{e.intro}</p>
          </Reveal>

          {e.kind === 'future' ? (
            <p>Cette destination est en préparation. Elle n’est pas encore réservable.</p>
          ) : (
            <>
              {arca ? (
                <VillaShowcase embedded />
              ) : arcaMereEnfant ? (
                <>
                  <MotherChildShowcase embedded />
                  <VillaShowcase embedded />
                </>
              ) : isAtelierEnfant ? (
                <KidsWorkshopShowcase embedded />
              ) : isCorse ? (
                <CorsicaShowcase embedded />
              ) : isMarrakechFemmes ? (
                <MarrakechExperienceShowcase embedded />
              ) : (
                <Reveal>
                  <h2>Galerie</h2>
                  <div className="gallery">
                    {e.gallery.map((g, idx) => {
                      const src = typeof g === 'object' ? g.src : null;
                      const label = typeof g === 'object' ? g.label : g;
                      return <Photo key={idx} src={src} label={label} theme={e.theme} className="zoom sq" />;
                    })}
                  </div>
                </Reveal>
              )}

              {isMarrakech && !isMarrakechFemmes && (
                <div style={{ margin: '2.5rem 0' }}>
                  <MarrakechFlightModule />
                </div>
              )}

              {arca && (
                <Reveal>
                  <div className="premium-banner" style={{ margin: '2rem 0' }}>
                    <div className="premium-banner-head">
                      <span className="premium-tag">Plus de 300 € de soins, de yoga et d’ateliers inclus</span>
                      <h2 id="soins" style={{ marginTop: '.4rem' }}>
                        Les soins, le yoga et les ateliers créatifs prévus durant votre week-end
                      </h2>
                      <p>
                        Tout au long du week-end dans notre loft sur le Bassin d’Arcachon, Émilie et Virginie vous accompagnent à travers quatre temps forts complémentaires, déjà compris dans votre séjour :
                      </p>
                    </div>
                    <div className="premium-grid">
                      <div className="premium-card">
                        <span className="premium-badge">Avec Émilie · Inclus</span>
                        <h4>Soin du visage (dont hydrafacial) &amp; LED</h4>
                        <p>
                          Un temps pour soi avec un soin du visage adapté à votre peau (soin hydrafacial / haute technologie), complété par un cours d’auto-massage du visage et une séance de luminothérapie LED.
                        </p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Avec Émilie · Inclus</span>
                        <h4>Ateliers créatifs</h4>
                        <p>
                          Un vrai moment pour faire quelque chose de ses mains, laisser aller son imagination et retrouver le plaisir simple de créer ensemble autour de la table.
                        </p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Avec Virginie · Inclus</span>
                        <h4>Séances de Yin &amp; Hatha Yoga</h4>
                        <p>
                          Des séances guidées par Virginie, professeure de yoga diplômée, en salle ou en plein air selon la météo, avec une attention portée au rythme de chacune.
                        </p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Bien-être &amp; Bassin · Inclus</span>
                        <h4>Massage, spa, balades &amp; repas partagés</h4>
                        <p>
                          Un massage relaxant individuel, l’accès libre au spa 7 places, au sauna et à la piscine chauffée du loft, les balades sur le Bassin et les repas conviviaux.
                        </p>
                      </div>
                    </div>
                    <p className="premium-summary">
                      <strong>Plus de 300 € de soins et de yoga inclus dans le week-end :</strong> soin du visage haute technologie (dont hydrafacial selon votre peau), massage relaxant, cours d’auto-massage facial et séance LED, ateliers créatifs avec Émilie et séances de Yin et de Hatha Yoga avec Virginie sont compris dans le tarif de <strong>450 € par personne</strong> (hébergement et repas inclus).
                    </p>
                    <p className="small" style={{ marginTop: '.6rem', marginBottom: 0 }}>
                      Il s’agit de soins de bien-être et de beauté ; aucune promesse médicale n’est faite.
                    </p>
                  </div>
                  <ArcachonCommercialPlaque e={e} variant="section" className="arca-inpage-banner" />
                </Reveal>
              )}

              {e.slug === 'trek-compostelle' && (
                <Reveal>
                  <div className="premium-banner" style={{ margin: '2rem 0', borderColor: 'rgba(63,90,62,.3)' }}>
                    <div className="premium-banner-head">
                      <span className="premium-tag" style={{ background: 'linear-gradient(135deg,#5d7a5c,#3f5a3e)' }}>
                        Parenthèse de 2 à 3 jours · Oser partir entre femmes
                      </span>
                      <h2 style={{ marginTop: '.5rem', color: '#3f5a3e' }}>
                        La philosophie de la marche : du rire partagé au silence habité, jusqu’au feu de bivouac
                      </h2>
                      <p>
                        Ici, vous partez avec d’autres femmes dans une bienveillance totale, accompagnées par Émilie et Virginie, pour vivre les différents rythmes du chemin :
                      </p>
                    </div>
                    <div className="premium-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
                      <div className="premium-card">
                        <span className="premium-badge" style={{ background: '#e7eddc', color: '#3f5a3e', borderColor: 'rgba(63,90,62,.3)' }}>
                          1 · L’Élan du Groupe
                        </span>
                        <h4>Rire, vibrer &amp; briser la glace</h4>
                        <p>
                          Parfois, le groupe marche d’un même pas : on est 5 ou 6 à parler et rire en même temps, portées par l’énergie collective et la joie simple d’être dehors ensemble.
                        </p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge" style={{ background: '#e7eddc', color: '#3f5a3e', borderColor: 'rgba(63,90,62,.3)' }}>
                          2 · La Présence à Soi
                        </span>
                        <h4>Le silence habité &amp; l’apaisement</h4>
                        <p>
                          Parfois, le pas s’étire naturellement : on marche seule avec soi-même. Dans cette lenteur retrouvée, le tumulte intérieur s’apaise et le souffle s’ouvre.
                        </p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge" style={{ background: '#e7eddc', color: '#3f5a3e', borderColor: 'rgba(63,90,62,.3)' }}>
                          3 · La Résonance à Deux
                        </span>
                        <h4>La parole libérée pas à pas</h4>
                        <p>
                          Puis, deux rythmes s’accordent : marcher à deux, épaule contre épaule, fait naître des échanges naturels et sincères.
                        </p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge" style={{ background: '#e7eddc', color: '#3f5a3e', borderColor: 'rgba(63,90,62,.3)' }}>
                          4 · Bivouac &amp; Feu de Camp
                        </span>
                        <h4>Veillée en montagne &amp; listes fournies</h4>
                        <p>
                          Le soir, nous bivouaquons en montagne, cuisinons ensemble et échangeons autour du feu. Toutes les listes (courses alimentaires précises &amp; matériel) vous sont remises à l’avance.
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Présentation harmonisée d'Émilie et Virginie sur chaque fiche */}
              <Reveal>
                <div className="exp-founders-harmonized">
                  <div className="exp-founders-photo-col">
                    <img
                      src="/img/emilie-virginie-marrakech.jpg"
                      alt="Émilie et Virginie — Complices d’ailleurs"
                      className="exp-founders-avatar"
                    />
                    <strong>Émilie &amp; Virginie</strong>
                    <span>Toutes deux esthéticiennes diplômées</span>
                  </div>
                  <div className="exp-founders-voices">
                    <p className="founders-common-lead">
                      <strong>Émilie et Virginie sont toutes les deux esthéticiennes diplômées et réalisent les soins du visage et les massages.</strong> Elles vous accompagnent ensuite chacune avec leur spécialité complémentaire : <strong>le yoga avec Virginie</strong> et <strong>les ateliers créatifs avec Émilie</strong>.
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
                  </div>
                </div>
              </Reveal>

              {!isMarrakechFemmes && (
                <>
                  <Reveal>
                    <h2>Programme</h2>
                    <ol className="program">
                      {e.program.map((d, i) => (
                        <li key={i}>
                          <strong>
                            {d.day} — {d.title}
                          </strong>
                          <ul>
                            {d.items.map((it) => (
                              <li key={it}>{it}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ol>
                    <p className="small">Programme modulable, susceptible d’évoluer.</p>
                  </Reveal>

                  <Reveal className="incl">
                    <div>
                      <h3>Inclus</h3>
                      <ul className="ticks">
                        {e.included.map((x) => (
                          <li key={x}>
                            <Check size={14} /> {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3>Non inclus</h3>
                      <ul className="plain">
                        {e.excluded.map((x) => (
                          <li key={x}>
                            <X size={13} /> {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>

                  {e.conditions && Object.keys(e.conditions).length > 0 && (
                    <Reveal>
                      <h2>Conditions</h2>
                      <dl className="conds">
                        {Object.entries(e.conditions).map(([k, v]) => (
                          <React.Fragment key={k}>
                            <dt>{COND_LABELS[k] || k}</dt>
                            <dd>{v ?? 'À confirmer — conditions en cours de validation'}</dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    </Reveal>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {e.kind !== 'future' && (
          <aside className="booking-card" aria-label="Réservation">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.75rem',
                paddingBottom: '.9rem',
                marginBottom: '.9rem',
                borderBottom: '1px solid var(--sand2)',
              }}
            >
              <img
                src="/img/emilie-virginie-marrakech.jpg"
                alt="Émilie et Virginie"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: '50% 25%',
                  border: '2px solid var(--sand2)',
                  flexShrink: 0,
                }}
              />
              <div>
                <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                  {isMarrakechFemmes ? 'Séjour intimiste' : 'Inscription & Réservation'}
                </h2>
                <small style={{ color: 'var(--terra)', fontWeight: 500 }}>
                  Avec Émilie &amp; Virginie · Confirmation par mail
                </small>
              </div>
            </div>

            {(arca || isCorse) && (
              <div className="exclu-300-card-box">
                <span className="exclu-300-card-tag">
                  <Gem size={13} /> Prestations incluses
                </span>
                <strong>Plus de 300 € de soins et de yoga inclus</strong>
                {isCorse && (
                  <small>
                    Dont séances de <strong>Yoga Aérien (avec tissus)</strong> avec Virginie
                  </small>
                )}
              </div>
            )}

            {arca && (
              <div className="bk-arca-highlight">
                <span className="bk-arca-tag">
                  <Sparkles size={13} /> Tarif du séjour
                </span>
                <div className="bk-arca-dep">
                  Réservation avec <strong>{e.depositPerPlace || 100} € d’acompte (Carte bancaire)</strong>, <strong>3 fois sans frais avec Klarna</strong>, ou <strong>paiement en une fois ({euro(e.pricePerPerson || 450)} par Carte bancaire)</strong>
                </div>
                <div className="bk-arca-total">
                  Séjour complet tout compris : <strong className="bk-new-price">{euro(e.pricePerPerson || 450)}</strong>
                </div>
              </div>
            )}

            {isMarrakechFemmes && (
              <div
                className="bk-arca-highlight"
                style={{
                  background: 'linear-gradient(135deg, rgba(168,85,58,.12), rgba(212,143,56,.12))',
                  borderColor: 'rgba(168,85,58,.3)',
                }}
              >
                <span className="bk-arca-tag" style={{ background: 'linear-gradient(135deg, #a8553a, #c75c2c)' }}>
                  <Sparkles size={13} /> 4 jours / 3 nuits · 6 à 8 participantes max
                </span>
                <div className="bk-arca-dep" style={{ color: 'var(--navy)' }}>
                  Hypothèse de travail : <strong>790 €</strong>
                  <div style={{ fontSize: '.82rem', fontWeight: 400, color: 'var(--muted)', marginTop: '.2rem' }}>
                    Hors vols personnels · Tarif définitif à confirmer
                  </div>
                </div>
              </div>
            )}

            <dl>
              <dt>Durée</dt>
              <dd>{e.duration}</dd>
              <dt>Lieu</dt>
              <dd>{e.location}</dd>
              {e.lodging && (
                <>
                  <dt>Hébergement</dt>
                  <dd>{e.lodging}</dd>
                </>
              )}
              <dt>Dates</dt>
              <dd>{e.dates.length ? e.dates.map((d) => d.label).join(' · ') : 'À confirmer'}</dd>
              {!arca && !isMarrakechFemmes && (
                <>
                  <dt>Tarif / personne</dt>
                  <dd>
                    <Price value={e.pricePerPerson} />
                  </dd>
                </>
              )}
              {isMarrakechFemmes && (
                <>
                  <dt>Budget estimé</dt>
                  <dd>
                    <strong>790 €</strong> <span className="small">(hypothèse indicative hors vols)</span>
                  </dd>
                </>
              )}
              {arca && (
                <>
                  <dt>Modes de règlement</dt>
                  <dd>
                    <strong>1. Acompte de {euro(e.depositPerPlace || 100)} par Carte bancaire</strong> (puis solde de 350 € en 1 fois ou en 3 fois avec Klarna)
                    <br />
                    <strong>
                      2. Je paye en 3 fois sans frais avec <AlmaLogo height={15} />
                    </strong>{' '}
                    (3 × 150 € sur 450 €, ou 3 × 116,67 € sur les 350 € restants)
                    <br />
                    <strong>3. Je paye en une fois ({euro(e.pricePerPerson || 450)}) par Carte bancaire</strong>
                  </dd>
                </>
              )}
              {e.minParticipants && (
                <>
                  <dt>Maintien</dt>
                  <dd>Dès {e.minParticipants} participantes</dd>
                </>
              )}
              <dt>Groupe</dt>
              <dd>
                {left == null ? `${e.capacity || 8} participantes maximum` : `${left} restantes (${e.capacity || 8} max)`}
              </dd>
            </dl>

            <div style={{ marginTop: '1.1rem', display: 'grid', gap: '.55rem' }}>
              {e.status === 'open' && e.pricePerPerson != null && e.depositPerPlace != null ? (
                <>
                  <Link to={`/reserver/${e.slug}`} className="btn btn-terra block">
                    Réserver
                  </Link>
                  <Link
                    to={`/reserver/${e.slug}?pay=klarna`}
                    className="btn btn-ghost block"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '.45rem' }}
                  >
                    <span>Je paye en 3 fois sans frais avec</span> <AlmaLogo height={15} />
                  </Link>
                </>
              ) : (
                <>
                  <Link to={`/contact?sejour=${e.slug}`} className="btn btn-terra block">
                    Être prévenue des prochaines dates
                  </Link>
                  {e.status === 'open' && (
                    <Link to={`/reserver/${e.slug}`} className="btn btn-ghost block">
                      Pré-inscription en ligne
                    </Link>
                  )}
                </>
              )}
              <Link to="/contact" className="btn btn-ghost block">
                Poser une question à Émilie &amp; Virginie
              </Link>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
