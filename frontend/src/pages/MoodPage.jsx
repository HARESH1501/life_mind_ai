/**
 * Mood & Wellness Page
 * Track mood and wellness metrics
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useMoodStore } from '../store/moodStore';
import '../styles/MoodPage.css';

const MOODS = [
  { name: 'Happy', emoji: '😊', color: 'yellow' },
  { name: 'Sad', emoji: '😢', color: 'blue' },
  { name: 'Neutral', emoji: '😐', color: 'gray' },
  { name: 'Anxious', emoji: '😰', color: 'orange' },
  { name: 'Excited', emoji: '🤩', color: 'pink' },
  { name: 'Tired', emoji: '😴', color: 'purple' },
];

export default function MoodPage() {
  const { moodEntries, logMood, fetchMoodEntries, isLoading } = useMoodStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mood: 'Happy',
    energy_level: 5,
    stress_level: 5,
    notes: '',
  });

  // Fetch mood entries on component mount
  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMoodSelect = (mood) => {
    setFormData((prev) => ({ ...prev, mood }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await logMood({
      mood: formData.mood,
      energy_level: parseInt(formData.energy_level),
      stress_level: parseInt(formData.stress_level),
      notes: formData.notes,
    });
    
    setFormData({
      mood: 'Happy',
      energy_level: 5,
      stress_level: 5,
      notes: '',
    });
    setShowForm(false);
  };

  return (
    <div className="mood-container">
      <motion.div
        className="mood-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>Wellness & Mood</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          Log Mood
        </button>
      </motion.div>

      {showForm && (
        <motion.form
          className="mood-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="form-group">
            <label>How are you feeling?</label>
            <div className="mood-selector">
              {MOODS.map((mood) => (
                <button
                  key={mood.name}
                  type="button"
                  className={`mood-btn ${
                    formData.mood === mood.name ? 'selected' : ''
                  }`}
                  onClick={() => handleMoodSelect(mood.name)}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Energy Level: {formData.energy_level}/10</label>
              <input
                type="range"
                name="energy_level"
                min="1"
                max="10"
                value={formData.energy_level}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Stress Level: {formData.stress_level}/10</label>
              <input
                type="range"
                name="stress_level"
                min="1"
                max="10"
                value={formData.stress_level}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="What's on your mind?"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Log Entry
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="mood-entries">
        {moodEntries.length === 0 ? (
          <p className="empty-state">No mood entries yet. Start tracking your wellness!</p>
        ) : (
          moodEntries.map((entry, index) => {
            const mood = MOODS.find((m) => m.name === entry.mood);
            return (
              <motion.div
                key={entry.id}
                className="mood-entry"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="entry-emoji">{mood?.emoji}</div>
                <div className="entry-info">
                  <h3>{entry.mood}</h3>
                  <p className="entry-date">{new Date(entry.date).toLocaleDateString()}</p>
                  <div className="entry-metrics">
                    <span>Energy: {entry.energy_level}/10</span>
                    <span>Stress: {entry.stress_level}/10</span>
                  </div>
                  {entry.notes && (
                    <p className="entry-notes">{entry.notes}</p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
