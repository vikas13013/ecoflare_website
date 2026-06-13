import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBranch, updateBranch } from '../features/auth/authThunk';
import { RootState, AppDispatch } from '../app/store';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const UpdateBranchPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const branches = useSelector((state: RootState) => {
    const value = state.auth.branches?.data;
    return Array.isArray(value) ? value : [];
  });

  const [formData, setFormData] = useState({
    legal_name: '',
    trading_name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    zip_code: '',
    contact_person_name: '',
    contact_person_phone: '',
    website: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getUserBranch()).unwrap();
      } catch (error) {
        toast.error("Failed to load branch data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const branch = branches.find((b: any) => b.id === Number(id));
    if (branch) {
      // Filter out unnecessary fields
      const { id: _, user_id: __, created_at: ___, is_verified_branch: ____, ...rest } = branch;
      setFormData(rest);
    }
  }, [branches, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(updateBranch({ id, data: formData })).unwrap();
      toast.success("Branch updated successfully!");
      navigate('/branches');
    } catch (err: any) {
      toast.error(err.message || "Failed to update branch");
    } finally {
      setIsLoading(false);
    }
  };

  // Fields to display with their labels and types
  const fields = [
    { name: 'legal_name', label: 'Legal Name', type: 'text' },
    { name: 'trading_name', label: 'Trading Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'country', label: 'Country', type: 'text' },
    { name: 'zip_code', label: 'ZIP Code', type: 'text' },
    { name: 'contact_person_name', label: 'Contact Person', type: 'text' },
    { name: 'contact_person_phone', label: 'Contact Phone', type: 'tel' },
    { name: 'website', label: 'Website URL', type: 'url' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/branches')} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="text-gray-600" size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Update Branch Information</h1>
      </div>

      {isLoading && !formData.legal_name ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading branch details...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData] || ''}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData] || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateBranchPage;