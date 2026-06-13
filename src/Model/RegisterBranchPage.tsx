import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { registerBranch , getgetprovinces} from "../features/auth/authThunk";   

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterBranchPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user,provinces } = useSelector((state: RootState) => state.auth);
  console.log(user);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    
    dispatch(getgetprovinces());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    legal_name: "",
    trading_name: "",
    description: "",
    vat_number: "",
    business_license_number: "",
    business_category: "Retail",
    cfia_license: "",
    address: "",
    city: "",
    province: "",
    country: "Canada",
    zip_code: "",
    contact_person_name: "",
    contact_person_phone: "",
    website: "",
    is_verified_branch: false,
  });

  const businessCategories = [
    "Retail",
    "Wholesale",
    "Manufacturer",
    "Distributor",
    "Farm",
    "Restaurant",
    "Other"
  ];

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const branchData = {
      ...formData,
      user: user?.id,
      province: Number(formData.province),
    };

    await dispatch(registerBranch(branchData)).unwrap();

    toast.success("Branch registered successfully!");
    navigate("/branch/pending-approval");
  } catch (err: any) {
    if (typeof err === "object") {
      // API ke error object ko dikhana
      Object.values(err).forEach((messages: any) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => toast.error(msg));
        } else {
          toast.error(messages);
        }
      });
    } else {
      toast.error(err || "Error registering branch");
    }
    console.log("Error:", err);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Register New Branch</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Business Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="legal_name" className="block text-sm font-medium text-gray-700">
                Legal Name*
              </label>
              <input
                id="legal_name"
                name="legal_name"
                type="text"
                value={formData.legal_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="trading_name" className="block text-sm font-medium text-gray-700">
                Trading Name
              </label>
              <input
                id="trading_name"
                name="trading_name"
                type="text"
                value={formData.trading_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="business_category" className="block text-sm font-medium text-gray-700">
                Business Category*
              </label>
              <select
                id="business_category"
                name="business_category"
                value={formData.business_category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {businessCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Legal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Legal Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="vat_number" className="block text-sm font-medium text-gray-700">
                VAT Number
              </label>
              <input
                id="vat_number"
                name="vat_number"
                type="text"
                value={formData.vat_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="business_license_number" className="block text-sm font-medium text-gray-700">
                Business License Number*
              </label>
              <input
                id="business_license_number"
                name="business_license_number"
                type="text"
                value={formData.business_license_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cfia_license" className="block text-sm font-medium text-gray-700">
                CFIA License
              </label>
              <input
                id="cfia_license"
                name="cfia_license"
                type="text"
                value={formData.cfia_license}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Location Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Location Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address*
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City*
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                Province*
              </label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
                Postal Code*
              </label>
              <input
                id="zip_code"
                name="zip_code"
                type="text"
                value={formData.zip_code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="contact_person_name" className="block text-sm font-medium text-gray-700">
                Contact Person Name*
              </label>
              <input
                id="contact_person_name"
                name="contact_person_name"
                type="text"
                value={formData.contact_person_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contact_person_phone" className="block text-sm font-medium text-gray-700">
                Contact Person Phone*
              </label>
              <input
                id="contact_person_phone"
                name="contact_person_phone"
                type="tel"
                value={formData.contact_person_phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center pt-2">
              <input
                id="is_verified_branch"
                name="is_verified_branch"
                type="checkbox"
                checked={formData.is_verified_branch}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_verified_branch" className="ml-2 block text-sm text-gray-700">
                Is Verified Branch
              </label>
            </div>
          </div>
          
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBranchPage;