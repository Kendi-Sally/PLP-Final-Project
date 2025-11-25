import React, { useState } from "react";

export default function Flashcard({ card, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
      <div className="flip-inner" onClick={() => setFlipped(s => !s)}>
        <div className="flip-front"><div className="q">{card.question}</div></div>
        <div className="flip-back"><div className="a">{card.answer}</div></div>
      </div>

      <div className="card-actions">
        <button className="btn small" onClick={() => onEdit && onEdit(card)}>Edit</button>
        <button className="btn small danger" onClick={() => onDelete && onDelete(card._id)}>Delete</button>
      </div>
    </div>
  );
}
