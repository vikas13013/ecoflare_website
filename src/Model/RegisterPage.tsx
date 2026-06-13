// RegisterPage.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { registerUser } from "../features/auth/authThunk";
import { clearError } from "../features/auth/authSlice";
import PhoneField from "../Form/PhoneField";
import countryCodes, { CountryCodeOption } from "../constants/countryData";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface Props {
  setShowLoginModal?: React.Dispatch<React.SetStateAction<boolean>>;
  switchToLogin?: () => void;
}

const RegisterPage: React.FC<Props> = ({ switchToLogin }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [selectedCountry, setSelectedCountry] = useState<CountryCodeOption>(countryCodes[0]);
  const [phone, setPhone] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    // At least 8 chars, one lowercase, one uppercase, one digit, one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validatePhone = (phone: string) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error("You must accept the Terms & Conditions and Privacy Policy");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error(
        "Password must contain at least 8 characters, one uppercase, one lowercase, and one number and one special character"
      );
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    if (!selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: `${phone}`,
    };

    try {
      const result = await dispatch(registerUser(payload)).unwrap();

      if (result?.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
      }
      if (result?.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }

      toast.success("Registration successful!");
      if (switchToLogin) {
        switchToLogin();
      } else {
        navigate('/login');
      }
      dispatch(clearError());
    } catch (err: any) {
      console.error("Registration Error:", err);

      let errorMessage = "Registration failed. Please try again.";

      if (err?.email) {
        errorMessage = Array.isArray(err.email) ? err.email[0] : err.email;
      } else if (err?.phone_number) {
        errorMessage = Array.isArray(err.phone_number)
          ? `Phone number: ${err.phone_number[0]}`
          : `Phone number: ${err.phone_number}`;
      } else if (err?.data?.email) {
        errorMessage = Array.isArray(err.data.email)
          ? err.data.email[0]
          : err.data.email;
      } else if (err?.data?.phone_number) {
        errorMessage = Array.isArray(err.data.phone_number)
          ? `Phone number: ${err.data.phone_number[0]}`
          : `Phone number: ${err.data.phone_number}`;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      }

      dispatch(clearError());
      toast.error(errorMessage);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 py-6 px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white">{t("create_your_account")}</h2>
          <p className="mt-2 text-green-100">
            {t("join_us_to_get_started")}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-green-600 font-medium">{t("creating_your_account")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    name="firstName"
                    type="text"
                    placeholder={t("first_name")}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <input
                    name="lastName"
                    type="text"
                    placeholder={t("last_name")}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <input
                  name="email"
                  type="email"
                  placeholder={t("email_address")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <PhoneField
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  phone={phone}
                  setPhone={setPhone}
                />
              </div>

              <div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t("password")}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t("confirm_password")}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" target="_blank" className="text-green-600 hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>.
              </label>
            </div>


            {error && (
              <div className="text-red-500 text-sm text-center">
                {typeof error === 'string' ? error :
                  error?.message ||
                  error?.email?.[0] ||
                  error?.phone_number?.[0] ||
                  error?.data?.email?.[0] ||
                  error?.data?.phone_number?.[0] ||
                  'Registration failed. Please try again.'}
              </div>
            )}


            <div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={loading || !acceptTerms}
              >
                {loading ? t("registering....") : t("register")}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              {t("already_have_an_account")}{' '}
              <button
                type="button"
                onClick={switchToLogin || (() => navigate('/login'))}
                className="text-green-600 font-medium hover:underline focus:outline-none"
              >
                {t("sign_in")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;