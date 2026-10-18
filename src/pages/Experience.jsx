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
                  <h2 id="soins">Les soins en détail</h2>
                  <p>Deux esthéticiennes diplômées vous accompagnent avec des technologies esthétiques haut de gamme, transportées sur place.</p>
                  <ul className="ticks">
                    <li><Check size={14} /> Massage relaxant — inclus</li>
                    <li><Check size={14} /> Soin du visage au choix : rituel jeunesse ou soin Glow</li>
                    <li><Check size={14} /> Luminothérapie LED</li>
                    <li><Check size={14} /> Soins ciblés</li>
                    <li><Check size={14} /> Jacuzzi — selon le lieu confirmé</li>
                  </ul>
                  <p className="small">Il s’agit de soins de bien-être et de beauté ; aucune promesse médicale n’est faite.</p>
                  <h2>Yoga &amp; reconnexion</h2>
                  <p>Yin Yoga et Hatha Yoga avec une professeure diplômée, respiration et méditation.</p>
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
