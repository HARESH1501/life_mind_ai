/**
 * AccountTab Component - Production Grade
 * Account management, data export, and account deletion
 */

import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import { Loader, AlertCircle, Trash2, Download, Info, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function AccountTab({ onSuccess, onLogout }) {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Delete account state
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    loadAccountInfo();
  }, []);

  const loadAccountInfo = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getAccountInfo();
      setAccountInfo(data);
    } catch (err) {
      console.error('Error loading account info:', err);
      setError('Failed to load account information');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      setError(null);
      await settingsService.exportData();
      setSuccess('Data export initiated. Check your email for the download link.');
      setTimeout(() => setSuccess(null), 6000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deletePassword) {
      setError('Please enter your password');
      return;
    }

    if (!deleteConfirmation) {
      setError('Please confirm account deletion');
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      await settingsService.deleteAccount({
        password: deletePassword,
        confirmation: deleteConfirmation,
      });
      setSuccess('Account deleted successfully');
      setTimeout(() => {
        onLogout?.();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete account');
    } finally {
      setDeleting(false);
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
        <h2>Account Settings</h2>
        <p>Manage your account and personal data</p>
      </div>

      <div className="settings-form space-y-6">
        {/* Account Information */}
        <div className="form-group border-2 border-blue-100 rounded-lg p-6 bg-blue-50">
          <div className="flex items-center gap-2 mb-4">
            <Info size={20} className="text-blue-500" />
            <h3 className="form-label text-lg font-semibold">Account Information</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Email Address</p>
              <p className="text-sm font-medium text-gray-900">{accountInfo?.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Username</p>
              <p className="text-sm font-medium text-gray-900">{accountInfo?.username}</p>
            </div>
            {accountInfo?.full_name && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{accountInfo.full_name}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Account Created</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(accountInfo?.created_at).toLocaleDateString()}
              </p>
            </div>
            {accountInfo?.last_login && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Last Login</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(accountInfo.last_login).toLocaleString()}
                </p>
              </div>
            )}
            {accountInfo?.last_password_change && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Last Password Change</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(accountInfo.last_password_change).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Data Export */}
        <div className="form-group border-2 border-green-100 rounded-lg p-6 bg-green-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Download size={20} className="text-green-500" />
                <h3 className="form-label text-lg font-semibold">Export Your Data</h3>
              </div>
              <p className="form-description">Download a copy of all your data in JSON format</p>
              <p className="text-xs text-green-700 mt-2">
                This includes all your habits, tasks, expenses, moods, and settings.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {exporting ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Export Data</span>
              </>
            )}
          </button>
        </div>

        {/* Delete Account */}
        <div className="form-group border-4 border-red-200 rounded-lg p-6 bg-red-50">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="form-label text-lg font-semibold text-red-900">Danger Zone: Delete Account</h3>
              <p className="form-description text-red-800 mt-1">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>

          {!showDeleteForm ? (
            <button
              type="button"
              onClick={() => setShowDeleteForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 size={16} />
              <span>Delete Account</span>
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-4 mt-4">
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-900 font-medium mb-4">
                  ⚠️ Please enter your password and confirm to permanently delete your account.
                </p>

                {/* Password Input */}
                <div className="mb-4">
                  <label className="form-label" htmlFor="delete_password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="delete_password"
                      type={showPassword ? 'text' : 'password'}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="form-input pr-10"
                      disabled={deleting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirmation Checkbox */}
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.checked)}
                      disabled={deleting}
                      className="w-4 h-4 rounded border-gray-300 text-red-600"
                    />
                    <span className="text-sm text-red-900 font-medium">
                      I understand this action is permanent and irreversible
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={deleting || !deletePassword || !deleteConfirmation}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteForm(false);
                      setDeletePassword('');
                      setDeleteConfirmation(false);
                      setError(null);
                    }}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
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
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm">{success}</span>
          </div>
        )}
      </div>
    </div>
  );
}
