import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { getUserProfile, updateUserProfile } from '../../features/auth/authThunk';
import { FiEdit, FiSave, FiX, FiUser, FiMail, FiPhone, FiSmartphone, FiInstagram, FiFacebook } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
const ProfileHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { userprofile: userData, loading } = useSelector((state: RootState) => state.auth);
  const user = userData;
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    other_mobile_number: '',
    whatsapp_number: '',
    instagram_profile: '',
    facebook_profile: '',
    gender: '',
    user: '',
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        other_mobile_number: user.other_mobile_number || '',
        whatsapp_number: user.whatsapp_number || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formPayload.append(key, String(value));
        }
      });

      if (profileImage) {
        formPayload.append("profile_picture", profileImage);
      }

      const result = await dispatch(updateUserProfile(formPayload)).unwrap();
      
      setIsEditing(false);
      setProfileImage(null);
      setImagePreview(null);
      toast.success("Profile updated successfully!");
      
      // Refresh user data
      dispatch(getUserProfile());

    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error || "Failed to update profile");
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t("my_profile")}</h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? t("update_personal_information"): t("view_profile_details")}
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          variant={isEditing ? 'outline' : 'default'}
          className={`flex items-center gap-2 ${!isEditing && 'bg-[#1F4E3D] hover:bg-[#0F3D2E]'}`}
        >
          {isEditing ? (
            <>
              <FiX size={18} />
              {t("cancel")}
            </>
          ) : (
            <>
              <FiEdit size={18} />
              {t("edit_profile")}
            </>
          )}
        </Button>
      </div>

      {/* Profile Picture Section */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-[#1F4E3D]/20">
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
                <FiUser className="text-gray-400 text-5xl" />
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
                  className="absolute bottom-0 right-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <FiEdit className="text-[#1F4E3D]" />
                </label>
              </>
            )}
          </div>
          <h2 className="text-xl font-semibold mt-4 text-gray-900">
            {user?.first_name} {user?.last_name}
          </h2>
        </div>
      </Card>

      {/* Rest of your form remains the same */}
      {/* Main Form Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 border-b pb-2">
          {t("personal_information")}
        </h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Your existing form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-1">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  {t("first_name")}
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  {t("last_name")}
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>

              {/* Email - disabled */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t("email")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Phone Number - disabled */}
              <div className="space-y-1">
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  {t("phone_number")}
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
                    className="flex-1 rounded-l-none bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Alternate Number */}
              <div className="space-y-1">
                <label htmlFor="other_mobile_number" className="block text-sm font-medium text-gray-700">
                  {t("alternate_number")}
                </label>
                <Input
                  id="other_mobile_number"
                  name="other_mobile_number"
                  type="tel"
                  value={formData.other_mobile_number}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Enter alternate number"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1">
                <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
                  {t("whatsapp_number")}
                </label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  type="tel"
                  value={formData.whatsapp_number}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Enter WhatsApp number"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  {t("gender")}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1F4E3D] focus:border-[#1F4E3D]"
                >
                  <option value="">{t("select_gender")}</option>
                  <option value="Male">{t("male")}</option>
                  <option value="Female">{t("female")}</option>
                  <option value="Other">{t("other")}</option>
                </select>
              </div>

              {/* Instagram */}
              <div className="space-y-1">
                <label htmlFor="instagram_profile" className="block text-sm font-medium text-gray-700">
                  {t("instagram_profile")}
                </label>
                <Input
                  id="instagram_profile"
                  name="instagram_profile"
                  value={formData.instagram_profile}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Instagram username or URL"
                />
              </div>

              {/* Facebook */}
              <div className="space-y-1">
                <label htmlFor="facebook_profile" className="block text-sm font-medium text-gray-700">
                  Facebook Profile
                </label>
                <Input
                  id="facebook_profile"
                  name="facebook_profile"
                  value={formData.facebook_profile}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Facebook username or URL"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-[#1F4E3D] hover:bg-[#0F3D2E] flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ClipLoader color="#ffffff" size={18} />
                    Saving...
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
            <ProfileField label="First Name" value={user?.first_name} icon={<FiUser />} />
            <ProfileField label="Last Name" value={user?.last_name} icon={<FiUser />} />
            <ProfileField label="Email" value={user?.email} icon={<FiMail />} />
            <ProfileField label="Phone Number" value={user?.phone_number} icon={<FiPhone />} />
            <ProfileField label="Alternate Number" value={user?.other_mobile_number} icon={<FiSmartphone />} />
            <ProfileField label="WhatsApp Number" value={user?.whatsapp_number} icon={<FiSmartphone />} />
            <ProfileField label="Gender" value={user?.gender} />
            <ProfileField label="Instagram" value={user?.instagram_profile} icon={<FiInstagram />} />
            <ProfileField label="Facebook" value={user?.facebook_profile} icon={<FiFacebook />} />
          </div>
        )}
      </Card>
    </div>
  );
};

const ProfileField = ({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{label}</span>
    </div>
    <p className="text-gray-900 font-medium break-words">
      {value && value !== 'null' && value !== 'undefined' ? value : <span className="text-gray-400">Not provided</span>}
    </p>
  </div>
);

export default ProfileHeader;