import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as noteService from '../services/api';
import './NoteEditor.css';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await noteService.getNote(id);
      const note = response.data;
      setTitle(note.title);
      setContent(note.content);
      setSummary(note.summary || '');
      setTags(note.tags?.join(', ') || '');
    } catch (err) {
      console.error('Failed to fetch note:', err);
      alert('Failed to load note');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setGeneratingSummary(true);
      const response = await noteService.generateSummary(id);
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      alert('Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    try {
      setSaving(true);
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      await noteService.updateNote(id, title, content, tagArray);
      navigate('/notes');
    } catch (err) {
      console.error('Failed to update note:', err);
      alert('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading note...</div>;
  }

  return (
    <div className="note-editor-container">
      <div className="editor-header">
        <h1>Edit Note</h1>
        <a href="/notes" className="back-link">← Back to Notes</a>
      </div>

      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />

        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="content-textarea"
          rows="15"
        />

        {summary && (
          <div className="summary-section">
            <h3>AI Summary</h3>
            <p>{summary}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerateSummary}
          disabled={generatingSummary || !content.trim()}
          className="ai-button"
        >
          {generatingSummary ? '⏳ Generating...' : '✨ Generate Summary'}
        </button>

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="tags-input"
        />

        <div className="button-group">
          <button type="submit" disabled={saving} className="save-button">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/notes')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
