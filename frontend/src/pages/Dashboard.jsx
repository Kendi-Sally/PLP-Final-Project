import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Flashcard from "../components/Flashcard.jsx";
import FlashcardForm from "../components/FlashcardForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard(){
  const { token } = useAuth();
  const [cards,setCards] = useState([]);
  const [editing,setEditing] = useState(null);
  const [search,setSearch] = useState('');
  const [categoryFilter,setCategoryFilter]=useState('');

  const fetchCards = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/flashcards', { headers: { Authorization: `Bearer ${token}` }});
      setCards(res.data);
    } catch (err) {
      console.error('Error fetching flashcards:', err);
      if (err?.response?.status === 401) alert('Session expired. Please login again.');
    }
  };

  useEffect(()=>{ fetchCards(); }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this flashcard?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/flashcards/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      setCards(prev => prev.filter(c => c._id !== id));
    } catch (err) { console.error(err); alert('Delete failed'); }
  };

  const filtered = cards.filter(c => {
    const s = search.toLowerCase();
    const matchesSearch = (c.question||'').toLowerCase().includes(s) || (c.answer||'').toLowerCase().includes(s);
    const matchesCategory = categoryFilter ? c.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Navbar />
      <div className="page">
        <h2>Create New Flashcards</h2>

        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
          <input className="input" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="input" value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {[...new Set(cards.map(c=>c.category).filter(Boolean))].map((cat,i)=><option key={i} value={cat}>{cat}</option>)}
          </select>
        </div>

        <FlashcardForm onSuccess={fetchCards} editingCard={editing} onCancel={() => setEditing(null)} />

        <div className="cards-grid" style={{ marginTop: 10 }}>
          {filtered.length ? filtered.map(c => <Flashcard key={c._id || c._id} card={c} onEdit={setEditing} onDelete={handleDelete} />) : <p>No flashcards found.</p>}
        </div>
      </div>
    </div>
  );
}
