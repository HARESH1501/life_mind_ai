/**
 * AppearanceTab Component
 * Theme and color preferences
 */

import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import { Loader } from 'lucide-react';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', description: 'Bright and clean interface' },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
  { value: 'system', label: 'System', description: 'Follow device settings' },
];

const ACCENT_COLORS = [
  { value: 'blue', label: 'Blue', hex: '#3B82F6' },
  { value: 'purple', label: 'Purple', hex: '#A855F7' },
  { value: 'green', label: 'Green', hex: '#10B981' },
  { value: 'red', label: 'Red', hex: '#EF4444' },
  { value: 'pink', label: 'Pink', hex: '#EC4899' },
  { value: 'orange', label: 'Orange', hex: '#F97316' },
  { value: 'amber', label: 'Amber', hex: '#FBBF24' },
  { value: 'cyan', label: 'Cyan', hex: '#06B6D4' },
];

export default function AppearanceTab({ onSuccess, theme: initialTheme, accentColor: initialColor, onThemeChange, onColorChange, settings }) {
  const [theme, setTheme] = useState(initialTheme || 'system');
  const [accentColor, setAccentColor] = useState(initialColor || 'blue');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialTheme) setTheme(initialTheme);
    if (initialColor) setAccentColor(initialColor);
  }, [initialTheme, initialColor]);

  useEffect(() => {
    if (!initialTheme && !initialColor) {
      loadAppearanceSettings();
    }
  }, [initialTheme, initialColor]);

  const loadAppearanceSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getAppearance();
      setTheme(data.theme || 'system');
      setAccentColor(data.accent_color || 'blue');
    } catch (err) {
      console.error('Error loading appearance settings:', err);
      setError('Failed to load appearance settings');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    try {
      setSaving(true);
      setError(null);
      await settingsService.updateAppearance({
        theme: newTheme,
        accent_color: accentColor,
      });
      setTheme(newTheme);
      onThemeChange?.(newTheme);
      
      // Update DOM
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = async (newColor) => {
    try {
      setSaving(true);
      setError(null);
      await settingsService.updateAppearance({
        theme,
        accent_color: newColor,
      });
      setAccentColor(newColor);
      onColorChange?.(newColor);
      
      // Update CSS variable for accent color
      document.documentElement.style.setProperty('--accent-color', 
        ACCENT_COLORS.find(c => c.value === newColor)?.hex || '#3B82F6'
      );
      localStorage.setItem('accentColor', newColor);
      
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update color');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-tab">
        <div className="flex items-center justify-center h-64">
          <Loader size={24} className="animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Appearance</h2>
        <p>Customize how LifeMind looks and feels</p>
      </div>

      <form className="settings-form">
        {/* Theme Selection */}
        <div className="form-group">
          <label className="form-label">Theme</label>
          <p className="form-description">Choose your preferred color scheme</p>
          
          <div className="theme-selector">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleThemeChange(option.value)}
                disabled={saving}
                className={`theme-option ${theme === option.value ? 'active' : ''}`}
              >
                <div className="theme-preview">
                  {option.value === 'light' && (
                    <div className="w-full h-full bg-white border-2 border-gray-200 rounded" />
                  )}
                  {option.value === 'dark' && (
                    <div className="w-full h-full bg-gray-900 border-2 border-gray-700 rounded" />
                  )}
                  {option.value === 'system' && (
                    <div className="w-full h-full flex">
                      <div className="flex-1 bg-white border-l-2 border-t-2 border-b-2 border-gray-200 rounded-l" />
                      <div className="flex-1 bg-gray-900 border-r-2 border-t-2 border-b-2 border-gray-700 rounded-r" />
                    </div>
                  )}
                </div>
                <div className="theme-info">
                  <span className="font-medium">{option.label}</span>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color Selection */}
        <div className="form-group">
          <label className="form-label">Accent Color</label>
          <p className="form-description">Choose your preferred accent color</p>
          
          <div className="color-selector">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorChange(color.value)}
                disabled={saving}
                className={`color-option ${accentColor === color.value ? 'active' : ''}`}
                title={color.label}
              >
                <div
                  className="color-swatch"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-medium">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="form-group">
          <label className="form-label">Preview</label>
          <div className="preview-box">
            <div className="preview-content">
              <button className="btn btn-primary" disabled>
                Sample Button
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Changes are applied instantly
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="form-error">
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
