import React from 'react';
import { Link } from 'react-router-dom';
import { Photo, Reveal } from '../components/ui.jsx';

export default function Story() {
  return (
    <section className="section page">
      <div className="wrap narrow">
        <p className="eyebrow">Notre histoire</p>
        <h1>Émilie &amp; Virginie</h1>
        <Reveal><Photo src="/img/emilie-virginie-marrakech.jpg" label="Émilie et Virginie à Marrakech" theme="sand" className="portrait" /></Reveal>
        <Reveal>
          <p>Complices d’ailleurs est né de notre harmonie évidente à toutes les deux. Nous sommes deux femmes simples, authentiques et passionnées par l’humain. Notre souhait le plus cher est d’offrir aux femmes une parenthèse vraie, loin des injonctions du quotidien, où chacune peut venir déposer ses bagages, livrer ses soucis en toute confiance et repartir le cœur et l’esprit plus légers.</p>
          <ul className="plain">
            <li><strong>Émilie</strong> — esthéticienne diplômée, experte en soins haute technologie et massages, elle anime également la méditation, les cercles de femmes et les ateliers pour vous aider à déposer vos soucis.</li>
            <li><strong>Virginie</strong> — esthéticienne diplômée et professeure de yoga diplômée, elle enseigne les séances de Yin Yoga et de Hatha Yoga avec douceur et bienveillance.</li>
          </ul>
          <blockquote>Ici, tout est simple : on dépose ce qui pèse, on se laisse choyer et l’on repart plus légère.</blockquote>
          <Link to="/experiences/arcachon-entre-femmes" className="btn btn-blue">Découvrir l’expérience Bassin d’Arcachon</Link>
        </Reveal>
      </div>
    </section>
  );
}
