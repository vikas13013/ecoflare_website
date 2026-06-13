// BranchListPage.tsx
import React, { useEffect, useState } from 'react';
import { getUserBranch, deleteBranch } from '../features/auth/authThunk';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiChevronRight, FiX, FiGlobe, FiPhone, FiMapPin, FiCheck, FiXCircle } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BranchListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const branches = useSelector((state: RootState) => {
    const value = state.auth.branches?.data;
    return Array.isArray(value) ? value : [];
  });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        await dispatch(getUserBranch()).unwrap();
      } catch (error) {
        // toast.error('Failed to load branches');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranches();
    
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteBranch(selectedBranch?.id)).unwrap();
      toast.success('Branch deleted successfully!');
      dispatch(getUserBranch());
    } catch (err: any) {
      toast.error(err.message || 'Error deleting branch');
    }
    setShowConfirm(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Branches</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? 'Loading...' : `Showing ${branches.length} ${branches.length === 1 ? 'branch' : 'branches'}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/register-branch')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <FiPlus className="text-lg" />
          <span>Add New Branch</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <Skeleton height={25} width="70%" className="mb-4" />
              <Skeleton count={5} className="mb-2" />
              <div className="flex gap-2 mt-4">
                <Skeleton width={70} height={30} />
                <Skeleton width={70} height={30} />
              </div>
            </div>
          ))}
        </div>
      ) : branches.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMapPin className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No branches yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first branch location</p>
            <button
              onClick={() => navigate('/register-branch')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition flex items-center gap-2 mx-auto"
            >
              <FiPlus />
              <span>Add Branch</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch: any) => (
            <div 
              key={branch.id} 
              className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={() => navigate(`/update-branch/${branch.id}`)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition"
                  aria-label="Edit branch"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    setSelectedBranch(branch);
                    setShowConfirm(true);
                  }}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition"
                  aria-label="Delete branch"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{branch.trading_name}</h2>
                  <p className="text-sm text-gray-500">{branch.legal_name}</p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiMapPin className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm">
                    {branch.address}, {branch.city}, {branch.country} {branch.zip_code}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <FiPhone className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm">{branch.contact_person_phone}</span>
                </div>

                {branch.website && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiGlobe className="text-gray-400 flex-shrink-0" />
                    <a 
                      href={branch.website} 
                      className="text-sm text-blue-600 hover:underline truncate"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {branch.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-700">
                  {branch.is_verified_branch ? (
                    <FiCheck className="text-green-500 flex-shrink-0" />
                  ) : (
                    <FiXCircle className="text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-sm">
                    {branch.is_verified_branch ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Added {formatDate(branch.created_at)}
                </span>
                {/* <button
                  onClick={() => navigate(`/branch-details/${branch.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View details <FiChevronRight size={14} />
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
              <button 
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete the branch <strong className="text-gray-900">"{selectedBranch?.trading_name}"</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. All associated data will be permanently removed.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <FiTrash2 size={16} />
                Delete Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchListPage;