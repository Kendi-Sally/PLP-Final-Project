import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function StudyMode() {
  const { token } = useAuth();
  const [cards,setCards] = useState([]);
  const [index,setIndex] = useState(0);
  const [flipped,setFlipped] = useState(false);
  const [shuffle,setShuffle] = useState(false);

  useEffect(()=>{
    const fetch = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/flashcards', { headers: { Authorization: `Bearer ${token}` }});
        setCards(res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [token]);

  useEffect(() => {
    if (shuffle && cards.length) {
      const s = [...cards].sort(() => Math.random()-0.5);
      setCards(s);
      setIndex(0);
      setShuffle(false);
    }
  }, [shuffle]);

  if (!cards.length) return (<div><Navbar /><div className="page"><p>No flashcards yet. Add some in Dashboard.</p></div></div>);

  const cur = cards[index];
  const next = () => { setFlipped(false); setIndex(i => (i+1) % cards.length); };
  const prev = () => { setFlipped(false); setIndex(i => (i-1+cards.length) % cards.length); };

  return (
    <div>
      <Navbar />
      <div className="page">
        <h2>Study Mode</h2>
        <div className={`study-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(s => !s)}>
          <div className="inner">
            <div className="side front">{cur.question}</div>
            <div className="side back">{cur.answer}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn" onClick={prev}>Previous</button>
          <div>{index+1} / {cards.length}</div>
          <button className="btn" onClick={next}>Next</button>
          <button className="btn" onClick={() => setShuffle(true)}>Shuffle</button>
        </div>
      </div>
    </div>
  );
}
