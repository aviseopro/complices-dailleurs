import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData, update, resetData } from '../data/store.js';
import { setStatus, toCsv, seatsLeft } from '../lib/booking.js';

const num = (v) => (v === '' ? null : Number(v));
const lines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);

function Bookings() {
  const { bookings, experiences } = useData();
  const csv = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + toCsv(bookings)], { type: 'text/csv;charset=utf-8' }));
    a.download = 'inscriptions.csv';
    a.click();
  };
  const act = (ref, status, note) => update((s) => { s.bookings = setStatus(s.bookings, ref, status, note); return s; });
  return (
    <>
      <p><button className="btn btn-sm btn-terra" onClick={csv}>Exporter en CSV</button></p>
      {bookings.length === 0 && <p>Aucune inscription pour le moment.</p>}
      <div className="table-wrap"><table>
        <thead><tr><th>Réf.</th><th>Séjour</th><th>Nom / email</th><th>Places</th><th>Montant</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>{bookings.map((b) => (
          <tr key={b.reference}>
            <td>{b.reference}</td><td>{experiences.find((e) => e.slug === b.exp)?.title}</td>
            <td>{b.name}<br /><small>{b.email}</small></td><td>{b.places}</td><td>{b.amount ?? '—'}</td>
            <td>{b.status}<details><summary>journal</summary>{b.log.map((l, i) => <div key={i}><small>{l.at.slice(0, 16)} · {l.status} {l.note}</small></div>)}</details></td>
            <td>
              <button onClick={() => act(b.reference, 'paid', 'Marqué payé')}>Payé</button>{' '}
              <button onClick={() => act(b.reference, 'cancelled', 'Annulé')}>Annuler</button>{' '}
              <button onClick={() => confirm('Marquer comme remboursé ? (le remboursement réel se fait chez le prestataire de paiement)') && act(b.reference, 'refunded', 'Remboursement')}>Rembourser</button>
            </td>
          </tr>))}</tbody>
      </table></div>
    </>
  );
}

function Experiences() {
  const { experiences, bookings } = useData();
  const edit = (slug, fn) => update((s) => { fn(s.experiences.find((e) => e.slug === slug)); return s; });
  return experiences.map((e) => (
    <details key={e.slug} className="adm-card">
      <summary><strong>{e.title}</strong> — {e.status}</summary>
      <div className="grid2">
        <label>Statut<select value={e.status} onChange={(ev) => edit(e.slug, (x) => (x.status = ev.target.value))}><option value="open">Ouverte</option><option value="waitlist">Liste d’attente</option><option value="soon">Bientôt</option></select></label>
        <label>Titre<input value={e.title} onChange={(ev) => edit(e.slug, (x) => (x.title = ev.target.value))} /></label>
        <label>Tarif / personne (€)<input type="number" value={e.pricePerPerson ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.pricePerPerson = num(ev.target.value)))} /></label>
        {e.kind === 'preorder' && <label>Pré-réservation / place (€)<input type="number" value={e.depositPerPlace ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.depositPerPlace = num(ev.target.value)))} /></label>}
        <label>Lien de paiement Stripe (ex: https://buy.stripe.com/...)<input value={e.paymentLink || ''} placeholder="https://buy.stripe.com/..." onChange={(ev) => edit(e.slug, (x) => (x.paymentLink = ev.target.value))} /></label>
        <label>Capacité globale (vide = non communiquée)<input type="number" value={e.capacity ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.capacity = num(ev.target.value)))} /></label>
        <label>Participantes minimum pour maintenir le séjour<input type="number" value={e.minParticipants ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.minParticipants = num(ev.target.value)))} /></label>
        <label>Durée<input value={e.duration || ''} onChange={(ev) => edit(e.slug, (x) => (x.duration = ev.target.value))} /></label>
        <label>Hébergement<input value={e.lodging || ''} onChange={(ev) => edit(e.slug, (x) => (x.lodging = ev.target.value || null))} /></label>
        <label>Lieu<input value={e.location || ''} onChange={(ev) => edit(e.slug, (x) => (x.location = ev.target.value))} /></label>
      </div>
      <label>Présentation<textarea rows="3" value={e.intro || ''} onChange={(ev) => edit(e.slug, (x) => (x.intro = ev.target.value))} /></label>
      <div className="grid2">
        <label>Inclus (1 par ligne)<textarea rows="5" defaultValue={e.included.join('\n')} onBlur={(ev) => edit(e.slug, (x) => (x.included = lines(ev.target.value)))} /></label>
        <label>Non inclus (1 par ligne)<textarea rows="5" defaultValue={e.excluded.join('\n')} onBlur={(ev) => edit(e.slug, (x) => (x.excluded = lines(ev.target.value)))} /></label>
      </div>
      <h4>Programme jour par jour</h4>
      {e.program.map((d, i) => (
        <div key={i} className="grid2">
          <label>Jour / titre<input value={`${d.day} | ${d.title}`} onChange={(ev) => edit(e.slug, (x) => { const [a, ...b] = ev.target.value.split('|'); x.program[i].day = a.trim(); x.program[i].title = b.join('|').trim(); })} /></label>
          <label>Activités (1 par ligne)<textarea rows="3" defaultValue={d.items.join('\n')} onBlur={(ev) => edit(e.slug, (x) => (x.program[i].items = lines(ev.target.value)))} /></label>
        </div>
      ))}
      <button onClick={() => edit(e.slug, (x) => x.program.push({ day: `Jour ${x.program.length + 1}`, title: 'Titre', items: [] }))}>+ Ajouter un jour</button>
      {e.conditions && Object.keys(e.conditions).length > 0 && <>
        <h4>Conditions (vide = « à confirmer »)</h4>
        {Object.keys(e.conditions).map((k) => <label key={k}>{k}<input value={e.conditions[k] ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.conditions[k] = ev.target.value || null))} /></label>)}
      </>}
      <h4>Dates &amp; quotas</h4>
      {e.dates.map((d, i) => (
        <div key={d.id} className="grid2">
          <label>Libellé<input value={d.label} onChange={(ev) => edit(e.slug, (x) => (x.dates[i].label = ev.target.value))} /></label>
          <label>Capacité (restantes : {seatsLeft(e, bookings, d.id) ?? '—'})<input type="number" value={d.capacity ?? ''} onChange={(ev) => edit(e.slug, (x) => (x.dates[i].capacity = num(ev.target.value)))} /></label>
          <button onClick={() => edit(e.slug, (x) => x.dates.splice(i, 1))}>Supprimer la date</button>
        </div>
      ))}
      <button onClick={() => edit(e.slug, (x) => x.dates.push({ id: `d${Date.now()}`, label: 'Nouvelle date', capacity: null }))}>+ Ajouter une date</button>
    </details>
  ));
}

function Faq() {
  const { faq, testimonials } = useData();
  return (
    <>
      <h3>FAQ</h3>
      {faq.map((f, i) => (
        <div key={i} className="adm-card">
          <input value={f.q} onChange={(ev) => update((s) => { s.faq[i].q = ev.target.value; return s; })} aria-label="Question" />
          <textarea rows="2" value={f.a} onChange={(ev) => update((s) => { s.faq[i].a = ev.target.value; return s; })} aria-label="Réponse" />
          <button onClick={() => update((s) => { s.faq.splice(i, 1); return s; })}>Supprimer</button>
        </div>
      ))}
      <button onClick={() => update((s) => { s.faq.push({ q: 'Nouvelle question', a: 'Réponse' }); return s; })}>+ Question</button>
      <h3>Témoignages (authentiques uniquement)</h3>
      {testimonials.map((t, i) => (
        <div key={i} className="adm-card">
          <textarea rows="2" value={t.text} onChange={(ev) => update((s) => { s.testimonials[i].text = ev.target.value; return s; })} />
          <input value={t.author} onChange={(ev) => update((s) => { s.testimonials[i].author = ev.target.value; return s; })} />
          <button onClick={() => update((s) => { s.testimonials.splice(i, 1); return s; })}>Supprimer</button>
        </div>
      ))}
      <button onClick={() => update((s) => { s.testimonials.push({ text: '', author: '' }); return s; })}>+ Témoignage</button>
    </>
  );
}

function Settings() {
  const { settings } = useData();
  const set = (k, v) => update((s) => { s.settings[k] = v; return s; });
  const T = ({ k, label }) => <label className="check"><input type="checkbox" checked={settings[k]} onChange={(e) => set(k, e.target.checked)} /> {label}</label>;
  const I = ({ k, label, type = 'text' }) => <label>{label}<input type={type} value={settings[k]} onChange={(e) => set(k, e.target.value)} /></label>;
  return (
    <>
      <T k="demoMode" label="Mode démo (aucune transaction réelle)" />
      <T k="salesEnabled" label="Vente officielle Marrakech activée (uniquement après validation légale)" />
      <T k="almaActive" label="Alma actif (uniquement si contrat et intégration validés)" />
      <I k="heroImage" label="Image du hero (chemin ou URL)" />
      <I k="heroVideo" label="Vidéo du hero (optionnelle : chemin .mp4 ou URL — sinon tableau vivant cinemagraph)" />
      <I k="whatsapp" label="Numéro WhatsApp (ex: 0629849653)" />
      <I k="instagram" label="Lien Instagram" />
      <I k="contactEmail" label="Email de contact" />
      <I k="adminPassword" label="Mot de passe admin (démo)" />
      <label>Politique d’annulation<textarea rows="4" value={settings.cancellationPolicy} onChange={(e) => set('cancellationPolicy', e.target.value)} /></label>
      <button onClick={() => confirm('Réinitialiser toutes les données de démo ?') && resetData()}>Réinitialiser les données de démo</button>
    </>
  );
}

export default function Admin() {
  const { settings } = useData();
  const [ok, setOk] = useState(() => sessionStorage.getItem('cda-admin') === '1');
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState('bookings');
  if (!ok)
    return (
      <section className="section"><div className="wrap narrow">
        <h1>Espace organisatrices</h1>
        <form className="form" onSubmit={(e) => { e.preventDefault(); if (pw === settings.adminPassword) { sessionStorage.setItem('cda-admin', '1'); setOk(true); } else alert('Mot de passe incorrect'); }}>
          <label>Mot de passe (démo : « demo »)<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
          <button className="btn btn-terra">Entrer</button>
        </form>
        <Link to="/">← Retour au site</Link>
      </div></section>
    );
  const tabs = { bookings: ['Inscriptions', Bookings], exps: ['Expériences', Experiences], faq: ['FAQ & avis', Faq], settings: ['Réglages', Settings] };
  const Cur = tabs[tab][1];
  return (
    <div className="admin wrap">
      <h1>Administration</h1>
      <p className="notice">Démo : les données sont enregistrées dans ce navigateur. En production, brancher un back-end (docs/DEPLOIEMENT.md).</p>
      <div className="tabs" role="tablist">{Object.entries(tabs).map(([k, [l]]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}<Link to="/">Voir le site</Link><button onClick={() => { sessionStorage.removeItem('cda-admin'); setOk(false); }}>Déconnexion</button></div>
      <Cur />
    </div>
  );
}
