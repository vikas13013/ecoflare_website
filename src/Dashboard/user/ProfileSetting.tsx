import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { getUserProfile, updateUserProfile } from '../../features/auth/authThunk';
import { FiEdit, FiSave, FiX, FiUser, FiMail, FiPhone, FiSmartphone, FiInstagram, FiFacebook, FiCamera } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify'; // Don't forget to import toast

const ProfileHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userprofile: userData, loading } = useSelector((state: RootState) => state.auth);
  const user = userData;

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    other_mobile_number: '',
    whatsapp_number: '',
    occupation: '',
    instagram_profile: '',
    facebook_profile: '',
    gender: '',
    user: '',
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        other_mobile_number: user.other_mobile_number || '',
        whatsapp_number: user.whatsapp_number || '',
        occupation: user.occupation || '',
        instagram_profile: user.instagram_profile || '',
        facebook_profile: user.facebook_profile || '',
        gender: user.gender || '',
        user: user.id || '',
      });
      // Clear image preview when user data loads
      setImagePreview(null);
      setProfileImage(null);
    }
  }, [user]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create FormData object
      const formPayload = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formPayload.append(key, String(value));
        }
      });
      
      // Append profile image if selected
      if (profileImage) {
        formPayload.append('profile_picture', profileImage);
      }
      
      // Log FormData contents for debugging
      console.log('Submitting FormData:');
      for (let pair of formPayload.entries()) {
        if (pair[0] === 'profile_picture') {
          console.log(pair[0] + ': File - ' + (pair[1] as File).name);
        } else {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }
      
      // Dispatch with FormData
      await dispatch(updateUserProfile(formPayload)).unwrap();
      
      // Refresh user profile
      await dispatch(getUserProfile()).unwrap();
      
      // Reset states
      setIsEditing(false);
      setProfileImage(null);
      setImagePreview(null);
      
      toast.success('Profile updated successfully!');
      
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      
      // Handle specific error messages
      if (error?.errors?.profile_errors?.profile_picture) {
        toast.error('Profile picture upload failed. Please try again.');
      } else {
        toast.error(error?.message || 'Failed to update profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
    setImagePreview(null);
    // Reset form data to original user data
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        other_mobile_number: user.other_mobile_number || '',
        whatsapp_number: user.whatsapp_number || '',
        occupation: user.occupation || '',
        instagram_profile: user.instagram_profile || '',
        facebook_profile: user.facebook_profile || '',
        gender: user.gender || '',
        user: user.id || '',
      });
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#1F4E3D" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            {isEditing ? 'Update your personal information' : 'Manage your profile details and preferences'}
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          variant={isEditing ? 'outline' : 'default'}
          className={`flex items-center gap-2 ${!isEditing ? 'bg-[#1F4E3D] hover:bg-[#0F3D2E]' : ''} transition-colors duration-200`}
        >
          {isEditing ? (
            <>
              <FiX size={18} />
              Cancel
            </>
          ) : (
            <>
              <FiEdit size={18} />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <Card className="p-6 mb-6 lg:mb-0 shadow-lg rounded-xl border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="relative group mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1F4E3D] to-[#0F3D2E] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-white text-5xl" />
                  )}
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-2 right-2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <FiCamera className="text-[#1F4E3D]" size={16} />
                    </label>
                  </>
                )}
              </div>
              <h2 className="text-xl font-semibold mt-4 text-gray-900 text-center">
                {user?.first_name} {user?.last_name}
              </h2>
              
              <div className="w-full mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 mb-3">Social Profiles</h3>
                <div className="flex justify-center space-x-4">
                  {user?.instagram_profile ? (
                    <a href={user.instagram_profile} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
                      <FiInstagram size={20} />
                    </a>
                  ) : (
                    <FiInstagram size={20} className="text-gray-300" />
                  )}
                  
                  {user?.facebook_profile ? (
                    <a href={user.facebook_profile} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                      <FiFacebook size={20} />
                    </a>
                  ) : (
                    <FiFacebook size={20} className="text-gray-300" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Form Section */}
        <div className="lg:col-span-2">
          <Card className="p-6 shadow-lg rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <div className="hidden sm:block h-2 w-12 rounded-full bg-gradient-to-r from-[#1F4E3D] to-[#0F3D2E]"></div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full transition-colors focus:border-[#1F4E3D] focus:ring-[#1F4E3D]"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full transition-colors focus:border-[#1F4E3D] focus:ring-[#1F4E3D]"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-gray-50 text-gray-500"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1F4E3D] focus:border-[#1F4E3D] transition-colors"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                      Primary Phone Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        +91
                      </span>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        disabled
                        value={formData.phone_number}
                        className="flex-1 rounded-l-none bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Alternate Number */}
                  <div className="space-y-2">
                    <label htmlFor="other_mobile_number" className="block text-sm font-medium text-gray-700">
                      Alternate Number
                    </label>
                    <div className="relative">
                      <Input
                        id="other_mobile_number"
                        name="other_mobile_number"
                        type="tel"
                        value={formData.other_mobile_number}
                        onChange={handleInputChange}
                        className="w-full pl-10 transition-colors focus:border-[#1F4E3D] focus:ring-[#1F4E3D]"
                      />
                      <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* WhatsApp Number */}
                  <div className="space-y-2">
                    <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <Input
                        id="whatsapp_number"
                        name="whatsapp_number"
                        type="tel"
                        value={formData.whatsapp_number}
                        onChange={handleInputChange}
                        className="w-full pl-10 transition-colors focus:border-[#1F4E3D] focus:ring-[#1F4E3D]"
                      />
                      <FiSmartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="space-y-2">
                    <label htmlFor="instagram_profile" className="block text-sm font-medium text-gray-700">
                      Instagram Profile
                    </label>
                    <div className="relative">
                      <Input
                        id="instagram_profile"
                        name="instagram_profile"
                        value={formData.instagram_profile}
                        onChange={handleInputChange}
                        className="w-full pl-10 transition-colors focus:border-[#1F4E3D] focus:ring-[#1F4E3D]"
                        placeholder="https://instagram.com/username"
                      />
                      <FiInstagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="space-y-2">
                    <label htmlFor="facebook_profile" className="block text-sm font-medium text-gray-700">
                      Facebook Profile
                    </label>
                    <div className="relative">
                      <Input
                        id="facebook_profile"
                        name="facebook_profile"
                        value={formData.facebook_profile}
                        onChange={handleInputChange}
                        className="w-full pl-10 transition-colors focus:border-[#1F4E3D] focus:ring-[#1F4E3D]"
                        placeholder="https://facebook.com/username"
                      />
                      <FiFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <Button
                    type="submit"
                    className="bg-[#1F4E3D] hover:bg-[#0F3D2E] flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <ClipLoader color="#ffffff" size={18} />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FiSave size={18} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField label="First Name" value={user?.first_name} icon={<FiUser className="text-[#1F4E3D]" />} />
                <ProfileField label="Last Name" value={user?.last_name} icon={<FiUser className="text-[#1F4E3D]" />} />
                <ProfileField label="Email" value={user?.email} icon={<FiMail className="text-[#1F4E3D]" />} />
                <ProfileField label="Phone Number" value={user?.phone_number} icon={<FiPhone className="text-[#1F4E3D]" />} />
                <ProfileField label="Alternate Number" value={user?.other_mobile_number} icon={<FiSmartphone className="text-[#1F4E3D]" />} />
                <ProfileField label="WhatsApp Number" value={user?.whatsapp_number} icon={<FiSmartphone className="text-[#1F4E3D]" />} />
                <ProfileField label="Gender" value={user?.gender} />
                <ProfileField label="Instagram" value={user?.instagram_profile} icon={<FiInstagram className="text-[#1F4E3D]" />} />
                <ProfileField label="Facebook" value={user?.facebook_profile} icon={<FiFacebook className="text-[#1F4E3D]" />} />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) => (
  <div className="space-y-1 p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-gray-900 font-medium">
      {value || <span className="text-gray-400 italic">Not provided</span>}
    </p>
  </div>
);

export default ProfileHeader;