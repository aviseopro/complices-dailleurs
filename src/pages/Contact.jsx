import React, { useState } from 'react';
import { useData } from '../data/store.js';
import Newsletter from '../components/Newsletter.jsx';
import { formatWhatsAppUrl } from '../components/WhatsAppButton.jsx';

export default function Contact() {
  const { settings } = useData();
  const [sent, setSent] = useState(false);
  const waUrl = formatWhatsAppUrl(settings.whatsapp || '0629849653');

  return (
    <section className="section"><div className="wrap narrow">
      <h1>Contact</h1>

      <div style={{
        background: '#eef9f2',
        border: '1px solid #c2ebd0',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>💬</span>
          <strong style={{ fontSize: '1.1rem', color: '#1a5932' }}>Discuter directement sur WhatsApp</strong>
        </div>
        <p style={{ margin: 0, color: '#33523f', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Une question sur le séjour au Bassin d’Arcachon, les soins ou l’organisation ? Émilie et Virginie vous répondent directement au <strong>06 29 84 96 53</strong>.
        </p>
        <div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ background: '#25D366', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: 'none', fontWeight: 600 }}
          >
            Ouvrir la conversation WhatsApp
          </a>
        </div>
      </div>

      <p className="eyebrow">Ou par message écrit :</p>
      {sent ? <p role="status">Merci, votre message a bien été pris en compte. Nous vous répondrons dans les plus brefs délais.</p> : (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label>Nom<input required /></label>
          <label>Email<input type="email" required /></label>
          <label>Message<textarea rows="5" required /></label>
          <label className="check"><input type="checkbox" required /> J’accepte que mes données soient utilisées pour répondre à ma demande.</label>
          <button className="btn btn-terra">Envoyer</button>
        </form>
      )}
      <p style={{ marginTop: '1.5rem' }}>Instagram : <a href={settings.instagram} target="_blank" rel="noreferrer">@complicesdailleurs</a> · {settings.contactEmail}</p>
      <hr /><Newsletter />
    </div></section>
  );
}
