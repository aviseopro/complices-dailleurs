import React from 'react';
import { useData } from '../data/store.js';

export default function Legal() {
  const { settings } = useData();
  return (
    <section className="section"><div className="wrap narrow legal">
      <h1>Mentions légales, CGV &amp; confidentialité</h1>
      <p className="notice">Gabarit à compléter et faire valider avant mise en production : ne constitue pas un avis juridique.</p>
      <h2>Éditeur</h2><p>Complices d’ailleurs — [raison sociale, forme juridique, SIRET, adresse, responsable de publication : à fournir].</p>
      <h2>Vente de voyages</h2><p>[Immatriculation Atout France / garantie financière / assurance responsabilité civile professionnelle / régime du forfait touristique : à vérifier et renseigner par le professionnel avant d’activer la vente.]</p>
      <h2>Conditions générales de vente</h2><p>Voir la page <a href="/cgv">Conditions générales de vente</a>.</p>
      <h2>Politique d’annulation</h2><p>{settings.cancellationPolicy}</p>
      <h2 id="confidentialite">Confidentialité &amp; cookies</h2>
      <p>Les données (nom, email, téléphone optionnel, nombre de places) servent uniquement à gérer votre réservation. Aucune donnée de carte n’est stockée. Mesure d’audience uniquement après consentement. Droits d’accès, rectification, suppression : {settings.contactEmail}.</p>
    </div></section>
  );
}
