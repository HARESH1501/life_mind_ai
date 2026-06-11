/**
 * ProfileTab Component
 * Manage user profile information and picture
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import settingsService from '../../services/settingsService';
import { Upload, Loader } from 'lucide-react';

export default function ProfileTab({ onSuccess }) {
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: '',
    profile_picture_url: user?.profile_picture_url || null,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const profile = await settingsService.getProfile();
      setFormData((prev) => ({
        ...prev,
        full_name: profile.full_name || '',
      }));
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      setError(null);
      const response = await settingsService.uploadProfilePicture(file);
      setFormData((prev) => ({
        ...prev,
        profile_picture_url: response.url,
      }));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await settingsService.updateProfile({
        full_name: formData.full_name,
        bio: formData.bio,
        profile_picture_url: formData.profile_picture_url,
      });
      setUser(response);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h2>Profile Information</h2>
        <p>Update your personal information and profile picture</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Profile Picture */}
        <div className="form-group">
          <label className="form-label">Profile Picture</label>
          <div className="profile-picture-section">
            <div className="profile-preview">
              {previewImage || formData.profile_picture_url ? (
                <img
                  src={previewImage || formData.profile_picture_url}
                  alt="Profile"
                  className="preview-image"
                />
              ) : (
                <div className="preview-placeholder">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="upload-section">
              <label htmlFor="profile-picture" className="upload-button">
                {uploading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Choose Image</span>
                  </>
                )}
              </label>
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">
                JPG, PNG, GIF or WebP. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="full_name">
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="form-input"
            maxLength={100}
          />
        </div>

        {/* Bio */}
        <div className="form-group">
          <label className="form-label" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            className="form-input form-textarea"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="form-error">
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
