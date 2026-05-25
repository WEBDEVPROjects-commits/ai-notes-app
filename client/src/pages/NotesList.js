import React, { useState, useEffect } from 'react';
import * as noteService from '../services/api';
import NoteCard from '../components/NoteCard';
import './NotesList.css';

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await noteService.getAllNotes();
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchNotes();
      return;
    }

    try {
      setLoading(true);
      const response = await noteService.searchNotes(searchQuery);
      setNotes(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.deleteNote(id);
        setNotes(notes.filter(note => note._id !== id));
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  return (
    <div className="notes-list-container">
      <div className="header">
        <h1>My Notes</h1>
        <a href="/create" className="create-button">+ New Note</a>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
        {searchQuery && (
          <button 
            type="button" 
            onClick={() => {
              setSearchQuery('');
              fetchNotes();
            }}
          >
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <div className="loading">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <p>No notes yet. <a href="/create">Create your first note</a></p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={() => handleDelete(note._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
