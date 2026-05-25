const express = require('express');
const Note = require('../models/Note');
const { generateSummary, generateTitle } = require('../services/aiService');

const router = express.Router();

// Get all notes for user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    console.error('Get note error:', err);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Create note
router.post('/', async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = new Note({
      userId: req.user.id,
      title,
      content,
      tags: tags || [],
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags !== undefined ? tags : note.tags;
    note.updatedAt = Date.now();

    await note.save();
    res.json(note);
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Generate summary for note
router.post('/:id/generate-summary', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const summary = await generateSummary(note.content);
    note.summary = summary;
    await note.save();

    res.json({ summary });
  } catch (err) {
    console.error('Generate summary error:', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Generate title for note
router.post('/generate-title', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const title = await generateTitle(content);
    res.json({ title });
  } catch (err) {
    console.error('Generate title error:', err);
    res.status(500).json({ error: 'Failed to generate title' });
  }
});

// Search notes
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const notes = await Note.find(
      { $text: { $search: q }, userId: req.user.id },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.json(notes);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
