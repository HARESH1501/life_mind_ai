/**
 * Tasks Page
 * Manage productivity tasks
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import '../styles/TasksPage.css';

export default function TasksPage() {
  const { tasks, createTask, deleteTask, updateTask, fetchTasks, isLoading } = useTaskStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    description: '',
  });

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    await createTask({
      title: formData.title,
      priority: formData.priority,
      description: formData.description,
    });
    
    setFormData({ title: '', priority: 'medium', description: '' });
    setShowForm(false);
  };

  const handleToggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: newStatus });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="tasks-container">
      <motion.div
        className="tasks-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>Tasks</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          New Task
        </button>
      </motion.div>

      {showForm && (
        <motion.form
          className="task-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What do you need to do?"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Create Task
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

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Create one to get started!</p>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                className="task-checkbox"
                onClick={() => handleToggleTask(task)}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <Circle size={24} />
                )}
              </button>

              <div className="task-info">
                <h3>{task.title}</h3>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
              </div>

              <div className={`task-priority ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </div>

              <button
                className="btn-icon delete"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
