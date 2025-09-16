import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, CheckCircle, User, Music, Camera } from 'lucide-react';

const KYC = () => {
  const { user, userProfile, updateProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    stage_name: '',
    distributor_id: '',
    id_number: '',
    profile_photo_url: ''
  });
  const [distributors, setDistributors] = useState([]);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    // Redirect if already completed KYC
    if (userProfile?.is_kyc_complete) {
      navigate('/dashboard');
      return;
    }

    // Fetch distributors for creators
    if (userProfile?.role === 'creator') {
      fetchDistributors();
    }
  }, [userProfile, navigate]);

  const fetchDistributors = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setDistributors(data || []);
    } catch (error) {
      console.error('Error fetching distributors:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      const { supabase } = await import('../lib/supabase');
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      setFormData({
        ...formData,
        profile_photo_url: urlData.publicUrl
      });
      setPhotoPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    // Validation
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      setSubmitLoading(false);
      return;
    }

    if (!formData.id_number.trim()) {
      setError('ID number is required');
      setSubmitLoading(false);
      return;
    }

    if (userProfile?.role === 'creator' && !formData.distributor_id) {
      setError('Please select your distributor');
      setSubmitLoading(false);
      return;
    }

    // Prepare profile data
    const profileData = {
      full_name: formData.full_name.trim(),
      id_number: formData.id_number.trim(),
      profile_photo_url: formData.profile_photo_url || null,
    };

    // Add creator-specific fields
    if (userProfile?.role === 'creator') {
      profileData.stage_name = formData.stage_name.trim() || null;
      profileData.distributor_id = formData.distributor_id;
    }

    const { error } = await updateProfile(profileData);

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }

    setSubmitLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            {userProfile.role === 'creator' ? (
              <Music className="w-8 h-8 text-primary-600" />
            ) : (
              <User className="w-8 h-8 text-primary-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Complete Your Profile
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            We need some additional information to verify your identity and set up your{' '}
            <span className="font-medium text-primary-600">{userProfile.role}</span> account.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Account Created</span>
                  <span className="text-primary-600 font-medium">Profile Setup</span>
                  <span className="text-neutral-400">Ready to Use</span>
                </div>
                <div className="mt-2 bg-neutral-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
                    {photoPreview || formData.profile_photo_url ? (
                      <img
                        src={photoPreview || formData.profile_photo_url}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-neutral-400" />
                    )}
                  </div>
                  <div>
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-lg shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Photo
                      </div>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                    <p className="mt-1 text-xs text-neutral-500">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full legal name"
                />
              </div>

              {/* Stage Name (Creator only) */}
              {userProfile.role === 'creator' && (
                <div>
                  <label htmlFor="stage_name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Stage/Artist Name
                  </label>
                  <input
                    id="stage_name"
                    name="stage_name"
                    type="text"
                    value={formData.stage_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your professional/stage name"
                  />
                  <p className="mt-1 text-sm text-neutral-500">
                    The name you perform or publish under (optional)
                  </p>
                </div>
              )}

              {/* Distributor Selection (Creator only) */}
              {userProfile.role === 'creator' && (
                <div>
                  <label htmlFor="distributor_id" className="block text-sm font-medium text-neutral-700 mb-1">
                    Music Distributor *
                  </label>
                  <select
                    id="distributor_id"
                    name="distributor_id"
                    required
                    value={formData.distributor_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select your distributor</option>
                    {distributors.map((distributor) => (
                      <option key={distributor.id} value={distributor.id}>
                        {distributor.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-neutral-500">
                    Choose the platform where you distribute your music
                  </p>
                </div>
              )}

              {/* ID Number */}
              <div>
                <label htmlFor="id_number" className="block text-sm font-medium text-neutral-700 mb-1">
                  Government ID Number *
                </label>
                <input
                  id="id_number"
                  name="id_number"
                  type="text"
                  required
                  value={formData.id_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="National ID, passport, or driver's license number"
                />
                <p className="mt-1 text-sm text-neutral-500">
                  Required for identity verification and compliance
                </p>
              </div>

              {/* Email Display */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600">
                  {user.email}
                </div>
              </div>

              {/* Role Display */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Account Type
                </label>
                <div className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600 capitalize">
                  {userProfile.role}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Setting Up Profile...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Profile Setup
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Your Information is Secure
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                All personal information is encrypted and stored securely. We use this data solely for identity verification and regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYC;
