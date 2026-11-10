import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../data/store.js';

export default function Legal() {
  const { settings } = useData();
  const contactEmail = settings.contactEmail || 'complicesdailleurs@gmail.com';

  return (
    <section className="section">
      <div className="wrap narrow legal">
        <h1>Mentions légales, Conditions d’utilisation &amp; Politique de confidentialité (RGPD)</h1>
        <p className="notice">
          Informations légales et charte de protection des données personnelles de <strong>Complices d’ailleurs</strong>.
        </p>

        <h2>1. Éditeur &amp; Responsables du traitement</h2>
        <p>
          <strong>Complices d’ailleurs</strong> — Escapades, journées bien-être, soins visage, yoga et ateliers créatifs au féminin, co-fondé par <strong>Émilie et Virginie</strong>.<br />
          Contact officiel : <a href={`mailto:${contactEmail}`}>{contactEmail}</a> · Téléphone / WhatsApp : 06 29 84 96 53.
        </p>

        <h2>2. Conditions générales de vente &amp; Politique d’annulation</h2>
        <p>
          Consultez l’intégralité de nos <Link to="/cgv">Conditions générales de vente (CGV)</Link>.
        </p>
        <p>{settings.cancellationPolicy}</p>

        <h2 id="confidentialite">3. Politique de confidentialité &amp; Protection des données personnelles (RGPD)</h2>
        <p>
          Dans le cadre de vos réservations, de votre inscription à l’espace membre <strong>« Mon espace Complice — Mon Carnet d’Ailleurs »</strong> et de votre participation éventuelle au <strong>« Concours Complices d’ailleurs »</strong>, Complices d’ailleurs s’engage à protéger la confidentialité de vos données conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679).
        </p>

        <h3>A. Données collectées et finalités</h3>
        <ul>
          <li>
            <strong>Création et gestion de votre compte « Mon espace Complice » :</strong> prénom, nom, adresse e-mail (obligatoires), numéro de téléphone et date de naissance (facultatifs). Ces données servent uniquement à authentifier votre espace personnel et à personnaliser votre accueil.
          </li>
          <li>
            <strong>Questionnaire « Quelle escapade est faite pour vous ? » et favoris :</strong> vos réponses et vos escapades sauvegardées sont enregistrées dans votre profil afin de vous proposer les expériences Complices d’ailleurs les plus adaptées à vos envies et de permettre à Émilie et Virginie de mieux connaître les attentes de leur communauté.
          </li>
          <li>
            <strong>Carnet bien-être « Mes rituels pour moi » (strictement privé) :</strong> vos préférences de soins, routines cochées et défis bien-être sont enregistrés de manière strictement personnelle pour votre propre suivi. Ces informations n’ont aucun caractère médical, ne constituent pas un diagnostic dermatologique et ne sont jamais consultables dans l’administration ni partagées.
          </li>
          <li>
            <strong>Communications par e-mail (Opt-in facultatif) :</strong> uniquement si vous avez coché la case dédiée (non précochée par défaut), vous recevrez nos actualités, offres d’escapades et conseils bien-être. Vous pouvez retirer ce consentement à tout moment en un clic depuis l’onglet « Mon profil &amp; RGPD » de votre Carnet d’Ailleurs.
          </li>
          <li>
            <strong>Participation aux jeux-concours Instagram :</strong> votre participation au « Concours Complices d’ailleurs » est distincte de l’inscription à la newsletter commerciale. Seuls les comptes uniques disposant d’une adresse e-mail vérifiée participent au tirage au sort aléatoire et horodaté.
          </li>
        </ul>

        <h3>B. Sécurité et destinataires des données</h3>
        <ul>
          <li>Les mots de passe ne sont jamais stockés en clair (hachage cryptographique salé SHA-256 / Supabase Auth).</li>
          <li>Les données personnelles d’une utilisatrice ne sont jamais visibles par une autre utilisatrice.</li>
          <li>Seules les deux co-fondatrices, <strong>Émilie et Virginie</strong>, via leurs accès administrateurs nominatifs sécurisés, ont accès au répertoire des membres. Aucune donnée n’est vendue ni cédée à des tiers.</li>
          <li>Aucune donnée bancaire n’est stockée sur notre site : les règlements s’effectuent exclusivement sur les pages sécurisées de notre prestataire <strong>Stripe</strong>.</li>
        </ul>

        <h3>C. Vos droits (accès, rectification, opposition, suppression)</h3>
        <p>
          Vous disposez à tout moment d’un droit d’accès, de rectification, de portabilité, de retrait de votre consentement marketing et de suppression définitive de votre compte :
        </p>
        <ul>
          <li>
            <strong>Directement en autonomie :</strong> connectez-vous à <Link to="/mon-espace">Mon espace Complice</Link> (rubrique <em>« Mon profil &amp; RGPD »</em>) pour modifier vos informations, gérer votre abonnement aux e-mails ou supprimer définitivement votre compte en un clic.
          </li>
          <li>
            <strong>Par e-mail :</strong> en écrivant à Émilie et Virginie à l’adresse <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </li>
        </ul>
      </div>
    </section>
  );
}
