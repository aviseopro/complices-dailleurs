import React, { useState } from 'react';

// Analytics : volontairement NON chargés tant que l'utilisatrice n'a pas accepté.
export default function CookieBanner() {
  const [choice, setChoice] = useState(() => localStorage.getItem('cda-consent'));
  if (choice) return null;
  const set = (v) => {
    localStorage.setItem('cda-consent', v);
    setChoice(v);
  };
  return (
    <div className="cookie" role="dialog" aria-label="Cookies">
      <p>Nous utilisons uniquement une mesure d’audience respectueuse, et seulement avec votre accord.</p>
      <div>
        <button className="btn btn-sm btn-ghost" onClick={() => set('refused')}>Refuser</button>
        <button className="btn btn-sm btn-blue" onClick={() => set('accepted')}>Accepter</button>
      </div>
    </div>
  );
}
