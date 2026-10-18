import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Photo, Reveal, STATUS, Price } from '../components/ui.jsx';
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
  const arca = e.theme === 'arcachon';
  const left = seatsLeft(e, bookings);
  const sellable = e.kind !== 'future' && e.status !== 'soon';
  document.title = `${e.title} — Complices d’ailleurs`;

  return (
    <article className={`page theme-${e.theme}`}>
      <header className="page-hero">
        <Photo label={e.title} theme={e.theme} src={e.image || (arca ? settings.heroImage : undefined)} className="ph-hero" />
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

              {arca && (
                <Reveal>
                  <div className="premium-banner" style={{ margin: '2rem 0' }}>
                    <div className="premium-banner-head">
                      <span className="premium-tag">✨ Plus de 300 € de soins &amp; pratiques inclus sur place</span>
                      <h2 id="soins" style={{ marginTop: '.4rem' }}>La valeur d’une cure Haute Beauté &amp; Bien-être incluse dans votre séjour</h2>
                      <p>Émilie et Virginie, toutes deux esthéticiennes diplômées, déplacent leurs <strong>machines esthétiques dernier cri</strong> directement sur notre lieu d’exception autour du Bassin d’Arcachon :</p>
                    </div>
                    <div className="premium-grid">
                      <div className="premium-card">
                        <span className="premium-badge">Soin Signature · Inclus</span>
                        <h4>Soin du visage Haute Technologie</h4>
                        <p>Rituel Jeunesse ou Soin Glow sur-mesure réalisé avec nos machines esthétiques dernier cri.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Modelage Expert · Inclus</span>
                        <h4>Massage relaxant sur-mesure</h4>
                        <p>Massage complet par nos esthéticiennes diplômées pour un relâchement profond du corps et de l’esprit.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Atelier &amp; LED · Inclus</span>
                        <h4>Cours d’auto-massage &amp; LED</h4>
                        <p>Apprentissage des gestes liftants d’auto-massage du visage combiné à une séance de luminothérapie LED professionnelle.</p>
                      </div>
                      <div className="premium-card">
                        <span className="premium-badge">Pratique Guidée · Inclus</span>
                        <h4>Yoga, respiration &amp; méditation</h4>
                        <p>Séances de Yin Yoga et Hatha Yoga enseignées par Virginie, professeure de yoga diplômée.</p>
                      </div>
                    </div>
                    <p className="premium-summary">
                      💎 <strong>Plus de 300 € de prestations Haute Beauté &amp; Bien-être incluses sur place :</strong> en institut et spa sur le Bassin d’Arcachon, l’ensemble de ces soins et séances (soin visage haute technologie, massage relaxant, luminothérapie LED professionnelle, cours d’auto-massage facial et yoga) représente à lui seul plus de 300 € de prestations — ici intégralement compris dans votre séjour avec l’hébergement de charme et la pension complète végétarienne.
                    </p>
                    <p className="small" style={{ marginTop: '.6rem', marginBottom: 0 }}>Il s’agit de soins de bien-être et de beauté ; aucune promesse médicale n’est faite.</p>
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
              {e.kind === 'preorder' && <><dt>Pré-réservation</dt><dd>{euro(e.depositPerPlace)} / place</dd></>}
              <dt>Places</dt><dd>{left == null ? 'Nombre à confirmer' : `${left} restantes`}</dd>
            </dl>
            {sellable ? (
              <Link to={`/reserver/${e.slug}`} className="btn btn-blue block">{e.kind === 'preorder' ? `Pré-réserver — ${e.depositPerPlace} €` : 'Réserver'}</Link>
            ) : (
              <Link to="/contact" className="btn btn-ghost block">Être prévenue de l’ouverture</Link>
            )}
          </aside>
        )}
      </div>
    </article>
  );
}
