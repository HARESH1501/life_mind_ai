/**
 * Redesigned Premium Dashboard Page
 * Integrates Recharts, SVG circular scores, streaks, and LLaMA 3.3 AI suggestions
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Wallet,
  Target,
  Smile,
  Flame,
  Brain,
  Sparkles,
  Zap,
  DollarSign
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import { useAnalyticsStore } from '../store/analyticsStore';
import '../styles/Dashboard.css';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];

export default function DashboardPage() {
  const {
    dashboardData,
    aiSuggestions,
    aiExpenses,
    aiWellness,
    aiPlanner,
    fetchDashboardData,
    fetchAISuggestions,
    fetchAIExpenses,
    fetchAIWellness,
    fetchAIPlanner,
    isLoading
  } = useAnalyticsStore();

  const [aiTab, setAiTab] = useState('suggestions');

  useEffect(() => {
    fetchDashboardData();
    // Pre-fetch AI suggestions on mount
    fetchAISuggestions();
  }, []);

  // Fetch AI content dynamically when changing tabs if not already fetched
  const handleAiTabChange = (tab) => {
    setAiTab(tab);
    if (tab === 'suggestions' && !aiSuggestions) fetchAISuggestions();
    if (tab === 'expenses' && !aiExpenses) fetchAIExpenses();
    if (tab === 'wellness' && !aiWellness) fetchAIWellness();
    if (tab === 'planner' && !aiPlanner) fetchAIPlanner();
  };

  const stats = dashboardData || {
    total_spent: 0,
    average_expense: 0,
    highest_expense: 0,
    total_expenses: 0,
    category_breakdown: {},
    habit_streaks: [],
    productivity_score: 75,
    wellness_score: 75,
    mood_stats: {
      average_energy: 0,
      average_stress: 0,
      most_common_mood: 'none',
      total_mood_logs: 0
    }
  };

  const cards = [
    {
      title: 'Total Spent',
      value: `₹${stats.total_spent.toFixed(2)}`,
      icon: Wallet,
      color: 'blue',
    },
    {
      title: 'Average Expense',
      value: `₹${stats.average_expense.toFixed(2)}`,
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Highest Expense',
      value: `₹${stats.highest_expense.toFixed(2)}`,
      icon: Target,
      color: 'orange',
    },
    {
      title: 'Total Expenses',
      value: stats.total_expenses,
      icon: Smile,
      color: 'purple',
    },
  ];

  // Format Recharts Pie Chart Data
  const pieData = Object.entries(stats.category_breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value,
  }));

  // Format Recharts Bar Chart Data for Expenses vs Budget or simple comparison
  const barData = Object.entries(stats.category_breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    Amount: value,
  }));

  const renderRadialScore = (score, strokeColor) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - score / 100);

    return (
      <div className="radial-progress-container">
        <svg width="100" height="100">
          <circle cx="50" cy="50" r={radius} className="radial-progress-bg" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="radial-progress-bar"
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="score-text">{score}%</span>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here is your life optimization overview.</p>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="dashboard-grid">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              className={`dashboard-card ${card.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="card-header">
                <h3>{card.title}</h3>
                <Icon size={22} />
              </div>
              <div className="card-value">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Coach Console */}
      <motion.div
        className="ai-coach-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="ai-coach-header">
          <Brain size={24} style={{ color: '#4f46e5' }} />
          <h2>AI Performance Coach Suggestions</h2>
        </div>

        <div className="ai-coach-tabs">
          <button
            className={`ai-coach-tab ${aiTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => handleAiTabChange('suggestions')}
          >
            Habit Recs
          </button>
          <button
            className={`ai-coach-tab ${aiTab === 'expenses' ? 'active' : ''}`}
            onClick={() => handleAiTabChange('expenses')}
          >
            Finance Coach
          </button>
          <button
            className={`ai-coach-tab ${aiTab === 'wellness' ? 'active' : ''}`}
            onClick={() => handleAiTabChange('wellness')}
          >
            Wellness AI
          </button>
          <button
            className={`ai-coach-tab ${aiTab === 'planner' ? 'active' : ''}`}
            onClick={() => handleAiTabChange('planner')}
          >
            Daily Planner
          </button>
        </div>

        <div className="ai-content">
          {isLoading ? (
            <div style={{ fontStyle: 'italic', color: '#9ca3af' }}>AI Coach is thinking...</div>
          ) : (
            <div style={{ width: '100%' }}>
              {aiTab === 'suggestions' && (
                <div>
                  {aiSuggestions && aiSuggestions.length > 0 ? (
                    aiSuggestions.map((rec, i) => (
                      <div key={i} className="ai-recommendation-item">
                        <span className="ai-rec-name">💡 {rec.name}</span>
                        <div className="ai-rec-desc">{rec.reason}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#6b7280' }}>No specific suggestions. Set habits to get recommendations.</div>
                  )}
                </div>
              )}
              {aiTab === 'expenses' && (
                <div style={{ fontWeight: 550 }}>{aiExpenses || 'Generate finance advice by logging expenses!'}</div>
              )}
              {aiTab === 'wellness' && (
                <div style={{ fontWeight: 550 }}>{aiWellness || 'Log your mood wellness to get insights!'}</div>
              )}
              {aiTab === 'planner' && (
                <div style={{ fontWeight: 550 }}>{aiPlanner || 'Plan output will schedule tasks dynamically!'}</div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Scores Grid */}
      <div className="scores-grid">
        <motion.div
          className="score-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="score-info">
            <h2>Productivity Index</h2>
            <p>Composite of your task completion rates and habit streaks.</p>
          </div>
          {renderRadialScore(stats.productivity_score, '#4f46e5')}
        </motion.div>

        <motion.div
          className="score-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="score-info">
            <h2>Wellness Balance</h2>
            <p>Mood metrics, energy stability, and stress level checks.</p>
          </div>
          {renderRadialScore(stats.wellness_score, '#10b981')}
        </motion.div>
      </div>

      {/* Analytics Charts & Details Layout */}
      <div className="dashboard-layout-grid">
        {/* Left Column: Recharts financial visualizer */}
        <motion.div
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2>Expense Distribution</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
            <div style={{ width: '100%', height: 260, minWidth: 280, flex: 1 }}>
              {pieData.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9ca3af', lineHeight: '260px', fontStyle: 'italic' }}>
                  No expense records to plot.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={{ width: '100%', height: 260, minWidth: 280, flex: 1 }}>
              {pieData.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9ca3af', lineHeight: '260px', fontStyle: 'italic' }}>
                  No data logs available.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    <Bar dataKey="Amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Active Habit Streaks */}
        <motion.div
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2>Habit Streaks</h2>
          <div className="streaks-list">
            {stats.habit_streaks.length === 0 ? (
              <p className="empty-state">No habits created yet. Go to Habits page!</p>
            ) : (
              stats.habit_streaks.map((habit) => (
                <div key={habit.id} className="streak-item">
                  <div>
                    <div className="streak-name">{habit.name}</div>
                    <div className="streak-freq">{habit.frequency}</div>
                  </div>
                  <div className="streak-badge">
                    <Flame size={16} fill="#f97316" />
                    <span>{habit.streak}d</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
