import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function FlashcardForm({ onSuccess, editingCard, onCancel }) {
  const { token } = useAuth();
  const [question, setQuestion] = useState(editingCard ? editingCard.question : "");
  const [answer, setAnswer] = useState(editingCard ? editingCard.answer : "");
  const [category, setCategory] = useState(editingCard ? editingCard.category || "" : "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuestion(editingCard ? editingCard.question : "");
    setAnswer(editingCard ? editingCard.answer : "");
    setCategory(editingCard ? editingCard.category || "" : "");
  }, [editingCard]);

  const api = "http://localhost:5000/api/flashcards";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return alert("Fill question and answer");
    setLoading(true);
    try {
      if (editingCard) {
        await axios.put(`${api}/${editingCard._id}`, { question, answer, category }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(api, { question, answer, category }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setQuestion(''); setAnswer(''); setCategory('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || 'Error saving flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flashcard-form" onSubmit={handleSubmit}>
      <input className="input" placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} />
      <input className="input" placeholder="Answer" value={answer} onChange={e => setAnswer(e.target.value)} />
      <input className="input" placeholder="Category (optional)" value={category} onChange={e => setCategory(e.target.value)} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" type="submit" disabled={loading}>{editingCard ? 'Save' : 'Add'}</button>
        {editingCard && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
