import React, { useState } from 'react';

export default function Newsletter() {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);
  if (done) return <p role="status">Merci ! (mode démo : aucune inscription réelle enregistrée.)</p>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
      <h2>Restez complices</h2>
      <p>Recevez nos prochaines expériences, sans spam.</p>
      <div className="inline-form">
        <label className="sr" htmlFor="nl-email">Email</label>
        <input id="nl-email" type="email" required placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn btn-terra" disabled={!ok}>Je m’inscris</button>
      </div>
      <label className="check"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /> J’accepte de recevoir les actualités de Complices d’ailleurs et peux me désinscrire à tout moment.</label>
    </form>
  );
}
