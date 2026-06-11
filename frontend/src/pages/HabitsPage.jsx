/**
 * Habits Page
 * Track and manage daily habits
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, CheckCircle } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import '../styles/HabitsPage.css';

export default function HabitsPage() {
  const { habits, createHabit, deleteHabit, logHabit, fetchHabits, isLoading, error } = useHabitStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily',
    description: '',
  });

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    try {
      await createHabit({
        name: formData.name,
        frequency: formData.frequency,
        description: formData.description,
      });
      
      setFormData({ name: '', frequency: 'daily', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating habit:', error);
      // Error is already handled in the store
    }
  };

  const handleLogHabit = async (habitId) => {
    await logHabit(habitId);
  };

  const handleDeleteHabit = async (habitId) => {
    await deleteHabit(habitId);
  };

  return (
    <div className="habits-container">
      <motion.div
        className="habits-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>Habits</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          New Habit
        </button>
      </motion.div>

      {showForm && (
        <motion.form
          className="habit-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error && (
            <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label>Habit Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Morning Exercise"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Frequency</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Why is this habit important?"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Create Habit
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

      <div className="habits-grid">
        {habits.length === 0 ? (
          <p className="empty-state">No habits yet. Create one to start building!</p>
        ) : (
          habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              className={`habit-card ${habit.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="habit-header">
                <h3>{habit.name}</h3>
                <div className="habit-actions">
                  <button
                    className="habit-toggle"
                    onClick={() => handleLogHabit(habit.id)}
                    title="Log habit completion"
                  >
                    <CheckCircle size={24} />
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteHabit(habit.id)}
                    title="Delete habit"
                  >
                    ×
                  </button>
                </div>
              </div>

              <p className="habit-frequency">{habit.frequency}</p>
              {habit.description && (
                <p className="habit-description">{habit.description}</p>
              )}

              <div className="habit-streak">
                <Flame size={20} />
                <span>{habit.streak} day streak</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
