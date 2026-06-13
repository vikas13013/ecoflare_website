// BranchDetailsPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { FiArrowLeft, FiEdit, FiTrash2, FiMapPin, FiPhone, FiMail, FiGlobe, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import  { useEffect, useState } from 'react';
import { getUserBranch  } from '../features/auth/authThunk';
import { RootState, AppDispatch } from '../app/store';

const BranchDetailsPage = () => {
      const dispatch = useDispatch<AppDispatch>();
      const [isLoading, setIsLoading] = useState(true);
    
  const { id } = useParams();
  console.log(id);
  
  const navigate = useNavigate();
  
  const branch = useSelector((state: RootState) => 
    state.auth.branches?.data?.find((b: any) => b.id === id)
  );
  console.log(branch);
  useEffect(() => {
      const fetchBranches = async () => {
        try {
          await dispatch(getUserBranch()).unwrap();
        } catch (error) {
          toast.error('Failed to load branches');
        } finally {
          setIsLoading(false);
        }
      };
      fetchBranches();
    }, [dispatch]);
  

  if (!branch) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Branch not found</h2>
          <button 
            onClick={() => navigate('/branches')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <FiArrowLeft /> Back to Branches
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/update-branch/${branch.id}`);
  };

  const handleDelete = () => {
    // Implement delete logic or redirect to confirmation
    toast.warning('Delete functionality should be implemented');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/branches')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft /> Back to all branches
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{branch.trading_name}</h1>
              <p className="text-gray-500">{branch.legal_name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                aria-label="Edit branch"
              >
                <FiEdit size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                aria-label="Delete branch"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-800">{branch.description || 'No description provided'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
              <div className="flex items-start gap-2 text-gray-800">
                <FiMapPin className="mt-1 text-gray-400 flex-shrink-0" />
                <div>
                  <p>{branch.address}</p>
                  <p>{branch.city}, {branch.country}</p>
                  <p>Postal Code: {branch.zip_code}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-800">
                  <FiPhone className="text-gray-400 flex-shrink-0" />
                  <span>{branch.contact_person_phone}</span>
                </div>
                {branch.contact_person_email && (
                  <div className="flex items-center gap-2 text-gray-800">
                    <FiMail className="text-gray-400 flex-shrink-0" />
                    <span>{branch.contact_person_email}</span>
                  </div>
                )}
                {branch.website && (
                  <div className="flex items-center gap-2 text-gray-800">
                    <FiGlobe className="text-gray-400 flex-shrink-0" />
                    <a 
                      href={branch.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {branch.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <div className="flex items-center gap-2">
                {branch.is_verified_branch ? (
                  <>
                    <FiCheck className="text-green-500" />
                    <span className="text-green-700">Verified</span>
                  </>
                ) : (
                  <>
                    <FiX className="text-red-500" />
                    <span className="text-red-700">Not Verified</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Registration Date</h3>
              <p className="text-gray-800">
                {new Date(branch.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailsPage;