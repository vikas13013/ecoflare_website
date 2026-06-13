import React, { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
import { getUserProfile } from '../../features/auth/authThunk'; // adjust the path
import { RootState } from '../../app/store'; // for typed useSelector
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../../features/address/addressThunk';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiMapPin, FiHome, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AddressPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addresses, loading, error } = useAppSelector((state) => state.address);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [provinces, setProvinces] = useState<any[]>([]);
console.log(addresses);


  const { user: userData } = useSelector((state: RootState) => state.auth);
  const user = userData;

  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);




  const [editFormData, setEditFormData] = useState({
    address: '',
    city: '',
    province: 1,
    country: 'India',
    postal_code: '',
    is_primary: false,
    is_rural: false,
    user: user && user.id,
  });

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    province: 1,
    country: 'India',
    postal_code: '',
    is_primary: false,
    is_rural: false,
    user: user && user.id,
  });

  // Fetch addresses on mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
  const fetchProvinces = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch("https://api.ecoflaresolutions.com/account/provinces/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProvinces(data.data);
    } catch (err) {
      console.error("Province fetch error", err);
    }
  };

  fetchProvinces();
}, []);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === 'string' ? error : 'An error occurred');
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createAddress(formData))
      .unwrap()
      .then(() => {
        setFormData({
          address: '',
          city: '',
          province: 1,
          country: 'India',
          postal_code: '',
          is_primary: false,
          is_rural: false,
          user: user && user.id,
        });
        toast.success('Address created successfully!');
        dispatch(fetchAddresses());
      })
      .catch(() => {
        toast.error('Failed to create address. Please try again.');
      });
  };

  const startEditing = (address: any) => {
    setIsEditing(address.id);
    setEditFormData({
      address: address.address,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
      is_primary: address.is_primary,
      is_rural: address.is_rural,
      user: address.user,
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  const handleUpdate = (id: number) => {
    const payloadWithId = { ...editFormData, address_id: id };

    dispatch(updateAddress({ id, data: payloadWithId }))
      .unwrap()
      .then(() => {
        toast.success('Address updated successfully!');
        setIsEditing(null);
        dispatch(fetchAddresses());
      })
      .catch(() => {
        toast.error('Failed to update address.');
      });
  };


  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteAddress(id))
        .unwrap()
        .then(() => {
          toast.success('Address deleted successfully!');
          dispatch(fetchAddresses());
        })
        .catch(() => {
          toast.error('Failed to delete address.');
        });
    }
  };

  const handleSetPrimary = (id: number) => {
    dispatch(updateAddress({ id, data: { is_primary: true } }))
      .unwrap()
      .then(() => {
        toast.success('Primary address updated!');
      })
      .catch(() => {
        toast.error('Failed to update primary address.');
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Add Address Form */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiPlus className="mr-2" /> Add New Address
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="Postal code"
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {provinces.map((prov) => (
  <option key={prov.id} value={prov.id}>
    {prov.name}
  </option>
))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Primary Address</span>
                </label>
                {/* <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="is_rural"
                    checked={formData.is_rural}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Rural Area</span>
                </label> */}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiPlus className="mr-2" />
                )}
                Add Address
              </button>
            </form>
          </div>
        </div>

        {/* Address List */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiMapPin className="mr-2" /> Your Addresses
            </h2>

            {loading && !addresses?.length ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{typeof error === 'string' ? error : 'Failed to load addresses'}</p>
                  </div>
                </div>
              </div>
            ) : !addresses?.length ? (
              <div className="text-center py-12">
                <FiHome className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {addresses.map((addr) => (
                  <li key={addr.id} className="border rounded-lg overflow-hidden">
                    {isEditing === addr.id ? (
                      <div className="p-4 bg-gray-50">
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <FiEdit2 className="mr-2" /> Editing Address
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                              name="address"
                              value={editFormData.address}
                              onChange={handleEditChange}
                              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                              <input
                                name="city"
                                value={editFormData.city}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                              <input
                                name="postal_code"
                                value={editFormData.postal_code}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 pt-2">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                name="is_primary"
                                checked={editFormData.is_primary}
                                onChange={handleEditChange}
                                className="h-4 w-4 text-primary focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Primary</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                name="is_rural"
                                checked={editFormData.is_rural}
                                onChange={handleEditChange}
                                className="h-4 w-4 text-primary focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Rural</span>
                            </label>
                          </div>
                          <div className="flex justify-end space-x-3 pt-2">
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdate(addr.id)}
                              className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium flex items-center">
                              {addr.is_primary && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                  Primary
                                </span>
                              )}
                              {addr.city}, {addr.province?.name}
                            </h3>
                            <p className="text-gray-600 mt-1">{addr.address}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <FiGlobe className="mr-1" />
                              {addr.country}, {addr.postal_code}
                              {addr.is_rural && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Rural
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {/* {!addr.is_primary && (
                              <button
                                onClick={() => handleSetPrimary(addr.id)}
                                className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-full"
                                title="Set as primary"
                              >
                                <FiCheck />
                              </button>
                            )} */}
                            <button
                              onClick={() => startEditing(addr)}
                              className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(addr.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;