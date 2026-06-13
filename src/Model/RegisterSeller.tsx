// Updated RegisterSeller.tsx with complete address functionality
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { registerAsseller } from '../features/auth/authThunk';
import { fetchAddresses, createAddress } from '../features/address/addressThunk';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
//   FiBuilding,
  FiHash,
  FiMapPin,
  FiHome,
  FiPlusCircle,
  FiCheck,
  FiChevronDown,
  FiGlobe,
  FiEdit2,
  FiX,
  FiLoader
} from 'react-icons/fi';

interface Address {
  id: number;
  address: string;
  city: string;
  province: number;
  country: string;
  postal_code: string;
  is_primary: boolean;
  is_rural: boolean;
  user: number;
}

const RegisterSeller: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { addresses, loading: addressesLoading, error: addressError } = useSelector((state: RootState) => state.address);
  
  const [loading, setLoading] = useState(false);
  const [creatingAddress, setCreatingAddress] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    user: user?.id || '',
    business_name: '',
    business_number: '',
    has_multiple_branches: false,
    business_type: '',
    address_id: '' as string | number,
  });

  const [newAddressData, setNewAddressData] = useState({
    address: '',
    city: '',
    province: 1,
    country: 'India',
    postal_code: '',
    is_primary: false,
    is_rural: false,
    user: user?.id || '',
  });

  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({ ...prev, user: user.id }));
      setNewAddressData(prev => ({ ...prev, user: user.id }));
      dispatch(fetchAddresses());
    }
  }, [user, dispatch]);

  useEffect(() => {
    // Auto-select primary address if available
    if (addresses && addresses.length > 0 && !formData.address_id) {
      const primaryAddress = addresses.find(addr => addr.is_primary);
      if (primaryAddress) {
        setFormData(prev => ({ ...prev, address_id: primaryAddress.id }));
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (addressError) {
      toast.error('Failed to load addresses');
    }
  }, [addressError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleNewAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? checked : value;
    setNewAddressData({ ...newAddressData, [name]: val });
  };

  const getProvinceName = (id: number) => {
    const provinces = {
      1: 'Madhya Pradesh',
      2: 'Uttar Pradesh',
      3: 'Maharashtra',
      4: 'Rajasthan',
      5: 'Gujarat'
    };
    return provinces[id as keyof typeof provinces] || 'Unknown Province';
  };

  const formatAddress = (address: Address) => {
    return `${address.address}, ${address.city}, ${getProvinceName(address.province)} - ${address.postal_code}`;
  };

  const validateNewAddress = () => {
    if (!newAddressData.address.trim()) {
      toast.error('Please enter street address');
      return false;
    }
    if (!newAddressData.city.trim()) {
      toast.error('Please enter city');
      return false;
    }
    if (!newAddressData.postal_code.trim()) {
      toast.error('Please enter postal code');
      return false;
    }
    if (newAddressData.postal_code.length < 6) {
      toast.error('Postal code must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleAddNewAddress = () => {
    if (!validateNewAddress()) {
      return;
    }

    setCreatingAddress(true);
    
    // If setting as primary, unset other primary addresses
    const addressData = {
      ...newAddressData,
      is_primary: newAddressData.is_primary
    };

    dispatch(createAddress(addressData))
      .unwrap()
      .then((response) => {
        const newAddress = response; // API response should contain the new address with id
        toast.success('New address added successfully!');
        
        // Auto-select the new address
        setFormData(prev => ({ ...prev, address_id: newAddress.id }));
        setShowNewAddressForm(false);
        
        // Reset form
        setNewAddressData({
          address: '',
          city: '',
          province: 1,
          country: 'India',
          postal_code: '',
          is_primary: false,
          is_rural: false,
          user: user?.id || '',
        });
        
        // Refresh addresses list
        dispatch(fetchAddresses());
      })
      .catch((error) => {
        toast.error(error.detail || 'Failed to add new address. Please try again.');
      })
      .finally(() => {
        setCreatingAddress(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address_id) {
      toast.error('Please select or add an address for your business');
      return;
    }

    if (!formData.business_name.trim()) {
      toast.error('Please enter business name');
      return;
    }

    if (!formData.business_number.trim()) {
      toast.error('Please enter business number');
      return;
    }

    if (!formData.business_type) {
      toast.error('Please select business type');
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const payload = {
        ...formData,
        address_id: parseInt(formData.address_id as string)
      };
      
      await dispatch(registerAsseller(payload)).unwrap();
      toast.success('Seller registered successfully!');
      setMessage({ text: 'Seller registered successfully!', type: 'success' });
      
      // Navigate after a short delay
    setTimeout(() => {
  navigate("/request-success", {
    state: { type: "seller" },
  });
}, 1500);

      
    } catch (err: any) {
      const errorMessage = err.detail || err.message || 'Failed to register as seller.';
      toast.error(errorMessage);
      setMessage({ 
        text: errorMessage, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedAddress = addresses?.find(addr => addr.id === parseInt(formData.address_id as string));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-6 shadow-lg">
            {/* <FiBuilding className="text-white text-3xl" /> */}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Register Your Business
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your seller profile to start selling on our platform. Your business address will be used for verification and logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Business Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                  <div className="flex items-center">
                    <FiCheck className={`mr-3 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
                    <span>{message.text}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    {/* <FiBuilding className="mr-2 text-primary" /> */}
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                    placeholder="Enter your business name"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">Legal name of your business</p>
                </div>

                {/* Business Number & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FiHash className="mr-2 text-primary" />
                      Business Number *
                    </label>
                    <input
                      type="text"
                      name="business_number"
                      value={formData.business_number}
                      onChange={handleChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                      placeholder="e.g., 123456789RT0001"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300 bg-white"
                      required
                    >
                      <option value="">Select Business Type</option>
                      <option value="corporation">Corporation</option>
                      <option value="partnership">Partnership</option>
                      <option value="sole_proprietorship">Sole Proprietorship</option>
                      <option value="non_profit">Non-profit</option>
                      <option value="llc">LLC (Limited Liability Company)</option>
                      <option value="individual">Individual/Self-employed</option>
                    </select>
                  </div>
                </div>

                {/* Multiple Branches Toggle */}
                {/* <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="has_multiple_branches"
                        checked={formData.has_multiple_branches}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`block w-12 h-6 rounded-full transition-colors duration-300 ${formData.has_multiple_branches ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform ${formData.has_multiple_branches ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-3 font-medium text-gray-700">Has Multiple Branches/Locations</span>
                  </label>
                  <p className="mt-2 text-sm text-gray-600 ml-16">
                    Check this if your business operates from multiple locations
                  </p>
                </div> */}

                {/* Address Selection Section */}
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <label className="block text-lg font-bold text-gray-800 mb-1 flex items-center">
                        <FiMapPin className="mr-2 text-primary" />
                        Business Address *
                      </label>
                      <p className="text-gray-600">Select or add your business address</p>
                    </div>
                    
                    {!showNewAddressForm && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <FiPlusCircle />
                        Add New Address
                      </button>
                    )}
                  </div>

                  {/* Existing Addresses Dropdown */}
                  {!showNewAddressForm && (
                    <div className="mb-6">
                      {addressesLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <FiLoader className="animate-spin h-8 w-8 text-primary" />
                          <span className="ml-3 text-gray-600">Loading addresses...</span>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
                              className="w-full p-4 border-2 border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-primary transition-colors"
                            >
                              <div className="flex-1">
                                {selectedAddress ? (
                                  <div>
                                    <div className="font-medium text-gray-800">{formatAddress(selectedAddress)}</div>
                                    {selectedAddress.is_primary && (
                                      <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                        <FiCheck className="mr-1" /> Primary
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">Select an address</span>
                                )}
                              </div>
                              <FiChevronDown className={`transform transition-transform ${addressDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {addressDropdownOpen && addresses && addresses.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                                {addresses.map((address) => (
                                  <div
                                    key={address.id}
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, address_id: address.id }));
                                      setAddressDropdownOpen(false);
                                    }}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${formData.address_id === address.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                                  >
                                    <div className="font-medium text-gray-800">{formatAddress(address)}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      {address.is_primary && (
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                          Primary
                                        </span>
                                      )}
                                      {address.is_rural && (
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                          Rural
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {addresses && addresses.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                              <FiHome className="mx-auto h-12 w-12 text-gray-400" />
                              <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses saved</h3>
                              <p className="mt-1 text-sm text-gray-500">Add an address to continue</p>
                            </div>
                          )}

                          {selectedAddress && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-2">Selected Address:</h4>
                              <p className="text-gray-800">{selectedAddress.address}</p>
                              <p className="text-gray-600">{selectedAddress.city}, {getProvinceName(selectedAddress.province)}</p>
                              <p className="text-gray-600">{selectedAddress.country} - {selectedAddress.postal_code}</p>
                              {selectedAddress.is_rural && (
                                <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                  Rural Area
                                </span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* New Address Form */}
                  {showNewAddressForm && (
                    <div className="border-2 border-primary/30 rounded-xl p-6 bg-blue-50/30">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                          <FiPlusCircle className="mr-2 text-primary" />
                          Add New Address
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewAddressForm(false);
                            setNewAddressData({
                              address: '',
                              city: '',
                              province: 1,
                              country: 'India',
                              postal_code: '',
                              is_primary: false,
                              is_rural: false,
                              user: user?.id || '',
                            });
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                          <input
                            type="text"
                            name="address"
                            value={newAddressData.address}
                            onChange={handleNewAddressChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter street address"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input
                              type="text"
                              name="city"
                              value={newAddressData.city}
                              onChange={handleNewAddressChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="City"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input
                              type="text"
                              name="postal_code"
                              value={newAddressData.postal_code}
                              onChange={handleNewAddressChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="Postal code"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                            <select
                              name="province"
                              value={newAddressData.province}
                              onChange={handleNewAddressChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              required
                            >
                              <option value={1}>Madhya Pradesh</option>
                              <option value={2}>Uttar Pradesh</option>
                              <option value={3}>Maharashtra</option>
                              <option value={4}>Rajasthan</option>
                              <option value={5}>Gujarat</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                              type="text"
                              name="country"
                              value={newAddressData.country}
                              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-6 pt-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_primary"
                              checked={newAddressData.is_primary}
                              onChange={handleNewAddressChange}
                              className="h-4 w-4 text-primary rounded focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-gray-700">Set as primary address</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_rural"
                              checked={newAddressData.is_rural}
                              onChange={handleNewAddressChange}
                              className="h-4 w-4 text-primary rounded focus:ring-primary"
                            />
                            <span className="ml-2 text-sm text-gray-700">Rural area</span>
                          </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={handleAddNewAddress}
                            disabled={creatingAddress}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {creatingAddress ? (
                              <>
                                <FiLoader className="animate-spin" />
                                Adding Address...
                              </>
                            ) : (
                              <>
                                <FiCheck />
                                Save & Use Address
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowNewAddressForm(false)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={creatingAddress}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading || !formData.address_id}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center ${loading || !formData.address_id ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'} text-white`}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin mr-3" />
                        Processing Registration...
                      </>
                    ) : (
                      <>
                        <FiCheck className="mr-2" />
                        Complete Seller Registration
                      </>
                    )}
                  </button>
                  
                  {!formData.address_id && (
                    <p className="mt-2 text-sm text-red-600 text-center">
                      Please select or add a business address to continue
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Information */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-primary to-secondary rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6">Why We Need Your Address</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiCheck className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Verification</h4>
                    <p className="text-white/80 text-sm">Required for seller identity verification and compliance</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiMapPin className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Logistics</h4>
                    <p className="text-white/80 text-sm">Used for shipping calculations and order fulfillment</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiGlobe className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Legal Compliance</h4>
                    <p className="text-white/80 text-sm">Required for tax purposes and business registration</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiHome className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Business Location</h4>
                    <p className="text-white/80 text-sm">Displayed to customers for trust and transparency</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-white/90 text-sm">
                  <strong>Note:</strong> Your address will be kept confidential and only used for operational purposes. It won't be publicly displayed unless you choose to.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">Need Help?</h4>
              <p className="text-gray-600 text-sm mb-4">
                If you're having issues with address verification or need to use a different address, please contact our support team.
              </p>
              <button
                onClick={() => navigate('/help/seller-registration')}
                className="w-full py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            By registering as a seller, you agree to our{' '}
            <a href="/terms/seller" className="text-primary hover:underline">Seller Terms & Conditions</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSeller;