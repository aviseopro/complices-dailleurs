import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Photo, Reveal, STATUS, Price } from '../components/ui.jsx';
import VillaShowcase from '../components/VillaShowcase.jsx';
import MotherChildShowcase from '../components/MotherChildShowcase.jsx';
import { useData, euro } from '../data/store.js';
import { seatsLeft } from '../lib/booking.js';

const COND_LABELS = {
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
  const e = experiences.find((x) => x.slug === slug);
  if (!e) return <section className="section"><div className="wrap"><h1>Séjour introuvable</h1><Link to="/">Retour</Link></div></section>;
  const arca = e.slug === 'arcachon-entre-femmes';
  const arcaMereEnfant = e.slug === 'arcachon-mere-enfant';
  const left = seatsLeft(e, bookings);
  const sellable = e.kind !== 'future' && e.status !== 'soon' && (e.pricePerPerson != null || e.depositPerPlace != null);
  document.title = `${e.title} — Complices d’ailleurs`;

  return (
    <article className={`page theme-${e.theme}`}>
      <header className="page-hero">
        <Photo label={e.title} theme={e.theme} src={e.image || (e.theme === 'arcachon' ? settings.heroImage : undefined)} className="ph-hero" />
        <div className="wrap page-hero-in">
          <span className={`pill ${e.status}`}>{STATUS[e.status]}</span>
          <h1>{e.title}</h1>
          <p className="lead">{e.short}</p>
        </div>
      </header>

      <div className="wrap detail">
        <div>
          <Reveal><p className="big">{e.intro}</p></Reveal>

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

              {arca && (
                <Reveal>
                  <div className="premium-banner" style={{ margin: '2rem 0' }}>
                    <div className="premium-banner-head">
                      <span className="premium-tag">✨ Plus de 300 € de soins &amp; rituels inclus sur place</span>
                      <h2 id="soins" style={{ marginTop: '.4rem' }}>Une parenthèse au cœur du féminin, avec la valeur d’une véritable cure en Spa &amp; Institut</h2>
                      <p>Parce que prendre soin de sa féminité, c’est s’accorder le meilleur sans compter : Émilie et Virginie vous entourent de bienveillance et déplacent leurs <strong>machines esthétiques dernier cri</strong> directement sur notre lieu de séjour autour du Bassin d’Arcachon :</p>
                    </div>
                    <div className="premium-grid">
                      <div className="premium-card">
                        <span className="premium-badge">Soin Signature · Inclus</span>
                        <h4>Soin du visage Haute Technologie</h4>
                        <p>Rituel Jeunesse ou Soin Glow sur-mesure réalisé avec nos machines esthétiques dernier cri pour sublimer votre éclat.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Modelage Expert · Inclus</span>
                        <h4>Massage relaxant sur-mesure</h4>
                        <p>Massage enveloppant par nos esthéticiennes diplômées pour déposer la charge mentale et relâcher le corps.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Atelier Féminin · Inclus</span>
                        <h4>Cours d’auto-massage &amp; LED</h4>
                        <p>Un moment complice entre femmes pour apprendre les gestes liftants du visage, combiné à une séance de luminothérapie LED professionnelle.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Reconnexion · Inclus</span>
                        <h4>Yoga, méditation &amp; cercle de femmes</h4>
                        <p>Yin Yoga et Hatha Yoga enseignés par Virginie, professeure diplômée ; méditation, cercles de parole et ateliers guidés par Émilie.</p>
                      </div>
                    </div>
                    <p className="premium-summary">
                      💎 <strong>Plus de 300 € de prestations Haute Beauté &amp; Bien-être incluses sur place :</strong> en institut et spa sur le Bassin d’Arcachon, l’ensemble de ces soins et séances (soin visage haute technologie, massage relaxant, luminothérapie LED professionnelle, cours d’auto-massage facial et yoga) représente à lui seul plus de 300 € de prestations — ici intégralement compris dans votre week-end entre femmes avec l’hébergement de charme et la pension complète végétarienne.
                    </p>
                    <p className="small" style={{ marginTop: '.6rem', marginBottom: 0 }}>Il s’agit de soins de bien-être et de beauté ; aucune promesse médicale n’est faite.</p>
                  </div>
                </Reveal>
              )}

              {e.slug === 'trek-compostelle' && (
                <Reveal>
                  <div className="premium-banner" style={{ margin: '2rem 0', borderColor: 'rgba(63,90,62,.3)' }}>
                    <div className="premium-banner-head">
                      <span className="premium-tag" style={{ background: 'linear-gradient(135deg,#5d7a5c,#3f5a3e)' }}>🌿 Parenthèse Exclusive de 2 à 3 jours · Oser enfin partir entre femmes</span>
                      <h2 style={{ marginTop: '.5rem', color: '#3f5a3e' }}>La philosophie de la marche : du rire partagé au silence habité, jusqu’au feu de bivouac</h2>
                      <p>
                        Combien de femmes se disent que le trekking <em>« n’est pas fait pour elles »</em>, que c’est trop exigeant, ou renoncent faute de trouver quelqu’un avec qui partir ? Ici, vous partez avec d’autres femmes qui ne se connaissent pas au départ, dans une bienveillance totale, pour découvrir ce que les plus beaux livres sur la marche appellent <strong>la mouvance du chemin</strong> :
                      </p>
                    </div>
                    <div className="premium-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
                      <div className="premium-card">
                        <span className="premium-badge" style={{ background: '#e7eddc', color: '#3f5a3e', borderColor: 'rgba(63,90,62,.3)' }}>1 · L’Élan du Groupe (à 5 ou 6)</span>
                        <h4>Rire, vibrer &amp; briser la glace</h4>
                        <p>Parfois, le groupe marche d’un même pas : on est 5 ou 6 à parler et rire en même temps, portées par l’énergie collective et la joie simple d’être dehors ensemble.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge" style={{ background: '#e7eddc', color: '#3f5a3e', borderColor: 'rgba(63,90,62,.3)' }}>2 · La Présence à Soi (Seule)</span>
                        <h4>Le silence habité &amp; le dépouillement</h4>
                        <p>Parfois, le pas s’étire naturellement : on marche seule avec soi-même. Dans cette lenteur retrouvée, le tumulte intérieur s’apaise, le souffle s’ouvre et l’esprit se déleste.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge" style={{ background: '#e7eddc', color: '#3f5a3e', borderColor: 'rgba(63,90,62,.3)' }}>3 · La Résonance à Deux (Côte à côte)</span>
                        <h4>La parole libérée pas à pas</h4>
                        <p>Puis, sans même y penser, deux rythmes s’accordent : marcher à deux, épaule contre épaule, affranchit de la pudeur du face-à-face et fait naître des confidences d’une rare profondeur.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge" style={{ background: '#e7eddc', color: '#3f5a3e', borderColor: 'rgba(63,90,62,.3)' }}>4 · Bivouac, Feu de Camp &amp; Cuisine</span>
                        <h4>Veillée en montagne &amp; listes fournies</h4>
                        <p>Le soir, nous bivouaquons en montagne, apprenons à cuisiner ensemble et discutons toutes réunies autour du feu. Toutes les listes (courses alimentaires précises &amp; matériel) vous sont remises à l’avance.</p>
                      </div>
                    </div>
                    <p className="premium-summary" style={{ borderLeftColor: '#3f5a3e', background: 'linear-gradient(90deg,rgba(231,237,220,.8),rgba(241,236,220,.85))' }}>
                      🧘‍♀️ <strong>Le duo Yoga &amp; Marche avec Virginie (professeure diplômée) :</strong>
                      <br />
                      • <strong>Le matin avant de partir : Éveil articulaire, Hatha doux &amp; Pranayama</strong> — lubrifier les articulations (chevilles, genoux, bassin), activer la sangle posturale et installer la respiration consciente (<em>Pranayama</em>) pour marcher avec souffle et fluidité.
                      <br />
                      • <strong>En fin d’étape, avant le dîner au bivouac : Yin Yoga de récupération &amp; relâchement myofascial</strong> — pratiqué à l’arrivée au campement (l’estomac léger avant de cuisiner ensemble), ce rituel décompresse les lombaires et les épaules du poids du sac, étire en profondeur le psoas, les mollets et les ischio-jambiers, et draine les jambes pour repartir fraîche et en pleine forme le lendemain matin.
                    </p>
                    <p className="premium-summary" style={{ marginTop: '.75rem', borderLeftColor: '#3f5a3e', background: 'linear-gradient(90deg,rgba(231,237,220,.8),rgba(241,236,220,.85))' }}>
                      🎒 <strong>Une organisation rassurante de A à Z :</strong> avant le départ, nous vous transmettons <strong>la liste complète de courses</strong> (pour que chacune amène exactement ce qu’il faut pour préparer sa nourriture et cuisiner ensemble au bivouac) ainsi que <strong>la liste détaillée du matériel</strong> pour profiter pleinement de ces 2 à 3 jours de connexion profonde avec la nature.
                    </p>
                  </div>
                </Reveal>
              )}

              <Reveal>
                <h2>Programme</h2>
                <ol className="program">
                  {e.program.map((d, i) => (
                    <li key={i}><strong>{d.day} — {d.title}</strong><ul>{d.items.map((it) => <li key={it}>{it}</li>)}</ul></li>
                  ))}
                </ol>
                <p className="small">Programme modulable, susceptible d’évoluer.</p>
              </Reveal>

              <Reveal className="incl">
                <div><h3>Inclus</h3><ul className="ticks">{e.included.map((x) => <li key={x}><Check size={14} /> {x}</li>)}</ul></div>
                <div><h3>Non inclus</h3><ul className="plain">{e.excluded.map((x) => <li key={x}><X size={13} /> {x}</li>)}</ul></div>
              </Reveal>

              {e.conditions && Object.keys(e.conditions).length > 0 && (
                <Reveal>
                  <h2>Conditions</h2>
                  <dl className="conds">
                    {Object.entries(e.conditions).map(([k, v]) => (
                      <React.Fragment key={k}><dt>{COND_LABELS[k] || k}</dt><dd>{v ?? 'À confirmer — conditions en cours de validation'}</dd></React.Fragment>
                    ))}
                  </dl>
                </Reveal>
              )}
            </>
          )}
        </div>

        {e.kind !== 'future' && (
          <aside className="booking-card" aria-label="Réservation">
            <h2>{e.kind === 'preorder' ? 'Pré-réservation' : 'Réservation'}</h2>
            <dl>
              <dt>Durée</dt><dd>{e.duration}</dd>
              <dt>Lieu</dt><dd>{e.location}</dd>
              {e.lodging && <><dt>Hébergement</dt><dd>{e.lodging}</dd></>}
              <dt>Dates</dt><dd>{e.dates.length ? e.dates.map((d) => d.label).join(' · ') : 'À confirmer'}</dd>
              <dt>Tarif / personne</dt><dd><Price value={e.pricePerPerson} /></dd>
              {e.minParticipants && <><dt>Maintien du séjour</dt><dd>Dès {e.minParticipants} participantes</dd></>}
              {e.kind === 'preorder' && <><dt>Pré-réservation</dt><dd>{euro(e.depositPerPlace)} d’acompte</dd></>}
              <dt>Places</dt><dd>{left == null ? 'Nombre à confirmer' : `${left} restantes`}</dd>
            </dl>
            {sellable ? (
              <Link to={`/reserver/${e.slug}`} className="btn btn-blue block">{e.kind === 'preorder' ? `Pré-réserver — ${e.depositPerPlace} € d’acompte` : 'Réserver'}</Link>
            ) : arcaMereEnfant ? (
              <Link to="/contact" className="btn btn-terra block">Réserver ou privatiser une journée</Link>
            ) : (
              <Link to="/contact" className="btn btn-ghost block">Être prévenue de l’ouverture</Link>
            )}
          </aside>
        )}
      </div>
    </article>
  );
}
