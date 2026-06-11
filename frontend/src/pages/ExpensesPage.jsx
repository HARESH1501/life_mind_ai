/**
 * Expenses Page
 * Manage and view all expenses
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useExpenseStore } from '../store/expenseStore';
import '../styles/ExpensesPage.css';

const CATEGORIES = [
  'food',
  'transport',
  'entertainment',
  'utilities',
  'health',
  'shopping',
  'education',
  'savings',
  'other',
];

export default function ExpensesPage() {
  const { expenses, createExpense, deleteExpense, fetchExpenses, isLoading, error } =
    useExpenseStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food',
    description: '',
  });
  const [localError, setLocalError] = useState(null);

  // Fetch expenses on component mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        await fetchExpenses();
      } catch (err) {
        console.error('Failed to load expenses:', err);
        setLocalError('Failed to load expenses');
      }
    };
    loadExpenses();
  }, [fetchExpenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!formData.title.trim()) {
      setLocalError('Title is required');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setLocalError('Amount must be greater than 0');
      return;
    }

    try {
      console.log('Creating expense with data:', {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
      });
      
      await createExpense({
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
      });
      
      console.log('✅ Expense created successfully');
      setFormData({ title: '', amount: '', category: 'food', description: '' });
      setShowForm(false);
      setLocalError(null);
      
      // Refresh expenses list
      await fetchExpenses();
    } catch (err) {
      console.error('❌ Failed to create expense:', err);
      setLocalError(err.response?.data?.detail || 'Failed to create expense');
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
      } catch (err) {
        console.error('Failed to delete expense:', err);
      }
    }
  };

  return (
    <div className="expenses-container">
      <motion.div
        className="expenses-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>Expenses</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          Add Expense
        </button>
      </motion.div>

      {showForm && (
        <motion.form
          className="expense-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {(localError || error) && (
            <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem' }}>
              {localError || error}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Expense title"
                required
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Add Expense
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

      <div className="expenses-list">
        {expenses.length === 0 ? (
          <p className="empty-state">No expenses yet. Add one to get started!</p>
        ) : (
          expenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              className="expense-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="expense-info">
                <h3>{expense.title}</h3>
                <p className="expense-category">{expense.category}</p>
                {expense.description && (
                  <p className="expense-description">{expense.description}</p>
                )}
              </div>
              <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
              <div className="expense-actions">
                <button className="btn-icon">
                  <Edit2 size={18} />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
