import React from 'react';
import { useData } from '../data/store.js';

export default function Faq() {
  const { faq } = useData();
  return (
    <div className="faq">
      {faq.map((f, i) => (
        <details key={i}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
