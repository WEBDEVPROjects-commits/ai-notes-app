import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as noteService from '../services/api';
import './NoteEditor.css';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const navigate = useNavigate();

  const handleGenerateTitle = async () => {
    if (!content.trim()) {
      alert('Please write some content first');
      return;
    }

    try {
      setGeneratingTitle(true);
      const response = await noteService.generateTitle(content);
      setTitle(response.data.title);
    } catch (err) {
      console.error('Failed to generate title:', err);
      alert('Failed to generate title');
    } finally {
      setGeneratingTitle(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      await noteService.createNote(title, content, tagArray);
      navigate('/notes');
    } catch (err) {
      console.error('Failed to create note:', err);
      alert('Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-editor-container">
      <div className="editor-header">
        <h1>Create New Note</h1>
        <a href="/notes" className="back-link">← Back to Notes</a>
      </div>

      <form onSubmit={handleSubmit} className="note-form">
        <div className="title-section">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
          />
          <button
            type="button"
            onClick={handleGenerateTitle}
            disabled={generatingTitle || !content.trim()}
            className="ai-button"
          >
            {generatingTitle ? '⏳ Generating...' : '✨ AI Title'}
          </button>
        </div>

        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="content-textarea"
          rows="15"
        />

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="tags-input"
        />

        <div className="button-group">
          <button type="submit" disabled={loading} className="save-button">
            {loading ? 'Saving...' : 'Save Note'}
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

export default CreateNote;
