import React, { useState } from 'react';
import { useData } from '../data/store.js';
import Newsletter from '../components/Newsletter.jsx';

export default function Contact() {
  const { settings } = useData();
  const [sent, setSent] = useState(false);
  return (
    <section className="section"><div className="wrap narrow">
      <h1>Contact</h1>
      {sent ? <p role="status">Merci, votre message est noté (mode démo : non envoyé).</p> : (
        <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label>Nom<input required /></label>
          <label>Email<input type="email" required /></label>
          <label>Message<textarea rows="5" required /></label>
          <label className="check"><input type="checkbox" required /> J’accepte que mes données soient utilisées pour répondre à ma demande.</label>
          <button className="btn btn-terra">Envoyer</button>
        </form>
      )}
      <p>Instagram : <a href={settings.instagram} target="_blank" rel="noreferrer">@complicesdailleurs</a> · {settings.contactEmail}</p>
      <hr /><Newsletter />
    </div></section>
  );
}
