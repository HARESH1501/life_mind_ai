/**
 * SecurityTab Component - Production Grade
 * Password management and security settings
 */

import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import { Loader, AlertCircle, Lock, Eye, EyeOff, CheckCircle2, LogOut, Zap } from 'lucide-react';

const PASSWORD_REQUIREMENTS = [
  { text: 'At least 8 characters', id: 'length' },
  { text: 'Contains uppercase letter', id: 'uppercase' },
  { text: 'Contains lowercase letter', id: 'lowercase' },
  { text: 'Contains number', id: 'number' },
];

export default function SecurityTab({ onSuccess }) {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [securitySettings, setSecuritySettings] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updating2FA, setUpdating2FA] = useState(false);

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSecurity();
      setSecuritySettings(data);
    } catch (err) {
      console.error('Error loading security settings:', err);
      setError('Failed to load security settings');
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const checkPasswordRequirements = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'new_password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
      setError('All fields are required');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    const requirements = checkPasswordRequirements(formData.new_password);
    if (!Object.values(requirements).every(Boolean)) {
      setError('Password does not meet all requirements');
      return;
    }

    try {
      setChanging(true);
      setError(null);
      await settingsService.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      setSuccess('Password changed successfully');
      setFormData({ current_password: '', new_password: '', confirm_password: '' });
      setPasswordStrength(0);
      onSuccess?.();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      setUpdating2FA(true);
      setError(null);
      await settingsService.logoutAllDevices();
      setSuccess('Logged out from all devices successfully');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to logout from all devices');
    } finally {
      setUpdating2FA(false);
    }
  };

  const toggle2FA = async () => {
    try {
      setUpdating2FA(true);
      setError(null);
      await settingsService.updateSecurity({
        two_factor_enabled: !securitySettings?.two_factor_enabled,
      });
      setSecuritySettings((prev) => ({
        ...prev,
        two_factor_enabled: !prev?.two_factor_enabled,
      }));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update 2FA settings');
    } finally {
      setUpdating2FA(false);
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

  const requirements = checkPasswordRequirements(formData.new_password);
  const strengthColor = passwordStrength <= 25 ? 'red' : passwordStrength <= 50 ? 'orange' : passwordStrength <= 75 ? 'yellow' : 'green';
  const strengthLabel = passwordStrength <= 25 ? 'Weak' : passwordStrength <= 50 ? 'Fair' : passwordStrength <= 75 ? 'Good' : 'Strong';

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Security Settings</h2>
        <p>Manage your password and security preferences</p>
      </div>

      <form onSubmit={handleChangePassword} className="settings-form">
        {/* Change Password Section */}
        <div className="form-group border-2 border-red-100 rounded-lg p-6 bg-red-50">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-red-500" />
            <h3 className="form-label text-lg font-semibold">Change Password</h3>
          </div>

          {/* Current Password */}
          <div className="mb-4">
            <label className="form-label" htmlFor="current_password">
              Current Password
            </label>
            <div className="relative">
              <input
                id="current_password"
                type={showPasswords.current ? 'text' : 'password'}
                name="current_password"
                value={formData.current_password}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                className="form-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="form-label" htmlFor="new_password">
              New Password
            </label>
            <div className="relative">
              <input
                id="new_password"
                type={showPasswords.new ? 'text' : 'password'}
                name="new_password"
                value={formData.new_password}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                className="form-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength */}
            {formData.new_password && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Password Strength</span>
                  <span className={`text-xs font-semibold text-${strengthColor}-600`}>{strengthLabel}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all bg-${strengthColor}-500`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            {formData.new_password && (
              <div className="mt-4 space-y-2">
                {PASSWORD_REQUIREMENTS.map((req) => {
                  const isMet = requirements[req.id];
                  return (
                    <div key={req.id} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isMet ? 'bg-green-100' : 'bg-gray-200'}`}>
                        {isMet && <CheckCircle2 size={16} className="text-green-600" />}
                      </div>
                      <span className={`text-sm ${isMet ? 'text-green-700' : 'text-gray-600'}`}>{req.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="form-label" htmlFor="confirm_password">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm_password"
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handlePasswordChange}
                placeholder="Re-enter your new password"
                className="form-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={changing || !formData.current_password || !formData.new_password || !formData.confirm_password}
            className="btn btn-primary"
          >
            {changing ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="form-group border-2 border-purple-100 rounded-lg p-6 bg-purple-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} className="text-purple-500" />
                <h3 className="form-label text-lg font-semibold">Two-Factor Authentication</h3>
              </div>
              <p className="form-description">Add an extra layer of security to your account</p>
            </div>
            <label className="toggle-switch flex-shrink-0 ml-4">
              <input
                type="checkbox"
                checked={securitySettings?.two_factor_enabled || false}
                onChange={toggle2FA}
                disabled={updating2FA}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          {securitySettings?.two_factor_enabled && (
            <p className="text-xs text-purple-700 mt-3 p-2 bg-white rounded">
              ✓ Two-Factor Authentication is enabled. You'll need to verify your identity on login.
            </p>
          )}
        </div>

        {/* Logout All Devices */}
        <div className="form-group border-2 border-orange-100 rounded-lg p-6 bg-orange-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <LogOut size={20} className="text-orange-500" />
                <h3 className="form-label text-lg font-semibold">Logout All Devices</h3>
              </div>
              <p className="form-description">Sign out from all devices except this one</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogoutAllDevices}
            disabled={updating2FA}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {updating2FA ? 'Processing...' : 'Logout All Devices'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="form-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 text-green-800">
            <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            For your security, you will need to log in again after changing your password.
          </p>
        </div>
      </form>
    </div>
  );
}
