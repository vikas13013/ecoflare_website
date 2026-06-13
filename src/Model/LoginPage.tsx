// LoginPage.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { loginUser } from "../features/auth/authThunk";
import { clearError } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import GoogleLoginFirebase from "../Model/GoogleLoginFirebase";

interface Props {
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  switchToRegister: () => void;
}

const LoginPage: React.FC<Props> = ({ setShowLoginModal, switchToRegister }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email_or_phone: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await dispatch(loginUser(formData)).unwrap();
      if (res.user.roles === "Seller") {
        navigate("/dashboard/seller" , { replace: true });
      } else if (res.user.roles === "BulkBuyer") {
        navigate("/dashboard/buyer", { replace: true });
      } else {
        navigate("/userdashboard", { replace: true });
      }
      toast.success("Login successful!", {
        autoClose: 50,
        position: "top-right",
        // theme: "colored",
      });

      dispatch(clearError());
    } catch (err: any) {
      console.error("Login Error:", err);

      // Extract error message from the error object
      let errorMessage = "Something went wrong. Please try again.";

      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.status === 1) {
        errorMessage = "Invalid email/phone or password";
      }

      // Dispatch clearError and show toast
      dispatch(clearError());
      toast.error(errorMessage);
    }
  };


  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="py-20 flex items-center justify-center">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-lg relative max-h-[100vh] overflow-y-auto">
        {showForgotPassword ? (
          <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
        ) : (
          <>
            <div className="bg-green-100 p-6 text-center rounded-t-2xl">
              <h2 className="text-2xl font-semibold text-gray-800">{t("login_to_your_account")}</h2>
              <p className="text-sm text-gray-600 mt-2">
                {t("welcome_back_please_enter_your_credentials")}
              </p>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-green-600 font-medium">{t("logging_you_in")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-4">
                  <input
                    name="email_or_phone"
                    type="text"
                    placeholder={t("email_or_phone")}
                    value={formData.email_or_phone}
                    onChange={handleChange}
                    required
                    className="rounded-full px-4 py-2 border w-full"
                  />
                  <div className="w-full">
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("password")}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="rounded-full px-4 py-2 border w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                      >
                        {showPassword ? t("hide") : t("show")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    {t("forgot_password")}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">
                    {typeof error === 'string' ? error :
                      error?.message || 'Login failed. Please try again.'}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition font-medium"
                >
                  {t("login")}
                </button>
                <div className="flex items-center my-4">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="mx-2 text-gray-500">{t("or")}</span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>
                <GoogleLoginFirebase />

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    {t("dont_have_an_account")}{" "}
                    <button
                      type="button"
                      onClick={switchToRegister}
                      className="text-green-600 font-medium hover:underline"
                    >
                      {t("register_here")}
                    </button>
                  </p>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;