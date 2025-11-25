const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Flashcard = require('../models/Flashcard');

// Create
router.post('/', auth, async (req, res) => {
  const { question, answer, category } = req.body;
  try {
    const newCard = new Flashcard({ user: req.user.id, question, answer, category });
    const saved = await newCard.save();
    res.json(saved);
  } catch (err) {
    console.error('Create flashcard error:', err);
    res.status(500).send('Server error');
  }
});

// Read all for user
router.get('/', auth, async (req, res) => {
  try {
    const cards = await Flashcard.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    console.error('Get flashcards error:', err);
    res.status(500).send('Server error');
  }
});

// Update
router.put('/:id', auth, async (req, res) => {
  const { question, answer, category } = req.body;
  try {
    const card = await Flashcard.findById(req.params.id);
    if (!card) return res.status(404).json({ msg: 'Card not found' });
    if (card.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    card.question = question !== undefined ? question : card.question;
    card.answer = answer !== undefined ? answer : card.answer;
    card.category = category !== undefined ? category : card.category;
    await card.save();
    res.json(card);
  } catch (err) {
    console.error('Update flashcard error:', err);
    res.status(500).send('Server error');
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const card = await Flashcard.findById(req.params.id);
    if (!card) return res.status(404).json({ msg: 'Card not found' });
    if (card.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });


    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Card removed' });
  } catch (err) {
    console.error('Delete flashcard error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
