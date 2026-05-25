import React from 'react';
import { Link } from 'react-router-dom';
import './NoteCard.css';

const NoteCard = ({ note, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const preview = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <Link to={`/edit/${note._id}`} className="edit-btn">Edit</Link>
          <button onClick={onDelete} className="delete-btn">Delete</button>
        </div>
      </div>
      
      <p className="note-preview">{preview}</p>

      {note.summary && (
        <div className="note-summary">
          <strong>Summary:</strong> {note.summary}
        </div>
      )}

      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="note-meta">
        <span className="date">{formatDate(note.createdAt)}</span>
      </div>
    </div>
  );
};

export default NoteCard;
