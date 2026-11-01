import React from 'react';
import { Plane, ExternalLink, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MarrakechFlightModule({ className = '' }) {
  return (
    <div className={`mk-flight-module ${className}`} aria-label="Réservation des vols pour Marrakech">
      <div className="mk-flight-header">
        <span className="mk-flight-badge">
          <Plane size={14} className="mk-plane-icon" /> Vols aller-retour · Réservation autonome directe
        </span>
        <h3>Réservez vos billets d’avion en direct auprès des compagnies</h3>
        <p>
          Pour vous offrir une liberté totale sur votre aéroport de départ (Bordeaux, Paris, Lyon, Nantes, Marseille, Toulouse…), vos dates et vos options de bagages, <strong>vous réservez directement votre vol en toute autonomie</strong> sur le site officiel de votre choix. Cliquez ci-dessous pour basculer directement sur le site de réservation :
        </p>
      </div>

      <div className="mk-airline-grid">
        {/* Carte EasyJet */}
        <div className="mk-airline-card easyjet-card">
          <div className="mk-airline-top">
            <div className="mk-brand-lockup easyjet-lockup">
              <span className="easyjet-logo-txt">easyJet</span>
            </div>
            <span className="mk-airline-tag">Vols directs &amp; Low-Cost</span>
          </div>
          <h4>EasyJet — Vols vers Marrakech (RAK)</h4>
          <p>
            Vols directs et réguliers au meilleur tarif depuis de nombreuses villes françaises. Idéal pour voyager léger ou moduler ses options bagages.
          </p>
          <ul className="mk-airline-points">
            <li><CheckCircle2 size={13} /> Nombreux départs quotidiens</li>
            <li><CheckCircle2 size={13} /> Tarifs accessibles &amp; réservation rapide</li>
          </ul>
          <a
            href="https://www.easyjet.com/fr"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-airline btn-easyjet"
            aria-label="Basculer sur le site EasyJet pour réserver votre vol"
          >
            <span>Réserver mon vol sur EasyJet</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Carte Royal Air Maroc */}
        <div className="mk-airline-card ram-card">
          <div className="mk-airline-top">
            <div className="mk-brand-lockup ram-lockup">
              <span className="ram-logo-txt">Royal Air Maroc</span>
            </div>
            <span className="mk-airline-tag ram-tag">Compagnie Nationale</span>
          </div>
          <h4>Royal Air Maroc — Confort &amp; Sérénité</h4>
          <p>
            Vols réguliers avec bagage en soute et collation à bord souvent inclus. Excellent confort pour démarrer votre voyage marrakchi en toute sérénité.
          </p>
          <ul className="mk-airline-points">
            <li><CheckCircle2 size={13} /> Bagage en soute &amp; service soigné</li>
            <li><CheckCircle2 size={13} /> Connexions fluides depuis la France</li>
          </ul>
          <a
            href="https://www.royalairmaroc.com/fr-fr"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-airline btn-ram"
            aria-label="Basculer sur le site Royal Air Maroc pour réserver votre vol"
          >
            <span>Réserver sur Royal Air Maroc</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="mk-flight-tips">
        <div className="mk-tip-item">
          <MapPin size={16} className="mk-tip-icon" />
          <div>
            <strong>Aéroport de destination :</strong> Marrakech-Ménara (code IATA : <code>RAK</code>), situé à seulement 15–20 minutes du Riad.
          </div>
        </div>
        <div className="mk-tip-item">
          <Clock size={16} className="mk-tip-icon" />
          <div>
            <strong>Coordination des navettes :</strong> Dès votre réservation effectuée, transmettez-nous vos horaires d’arrivée. Nous coordonnons votre transfert direct jusqu’aux portes du Riad.
          </div>
        </div>
        <div className="mk-tip-item">
          <Sparkles size={16} className="mk-tip-icon" />
          <div>
            <strong>Besoin d’un conseil d’horaires ?</strong> Émilie &amp; Virginie se tiennent à votre disposition pour vous indiquer les meilleurs créneaux selon votre ville d’origine.
          </div>
        </div>
      </div>
    </div>
  );
}
