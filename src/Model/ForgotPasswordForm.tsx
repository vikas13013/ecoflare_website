import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { forgetPasswordRequest, verifyOtp } from "../features/auth/authThunk";
import ResetPasswordForm from "./ResetPasswordForm";

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
    onSuccess: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onBackToLogin,
    onSuccess,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [verificationToken, setVerificationToken] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            await dispatch(forgetPasswordRequest({ email_or_phone: email })).unwrap();
            setMessage("Password reset OTP has been sent to your email");
            setShowOtpForm(true);
        } catch (err: any) {
            setError(err.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!otp) {
            setError("Please enter the OTP");
            return;
        }

        try {
            setLoading(true);
            const res = await dispatch(
                verifyOtp({
                    email_or_phone: email,
                    otp_code: otp,
                })
            ).unwrap();
            setVerificationToken(res.access); // Assuming your API returns a token
            setShowOtpForm(false);
            setShowResetForm(true);
        } catch (err: any) {
            setError(err.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetSuccess = () => {
        onSuccess();
    };

    const handleBackToOtp = () => {
        setShowResetForm(false);
        setShowOtpForm(true);
    };

    return (
        <>
            <div className="bg-green-100 p-6 text-center rounded-t-2xl">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {showResetForm
                        ? "Reset Password"
                        : showOtpForm
                            ? "Verify OTP"
                            : "Reset Your Password"}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                    {showResetForm
                        ? "Enter your new password"
                        : showOtpForm
                            ? "Enter the OTP sent to your email"
                            : "Enter your email to receive an OTP"}
                </p>
            </div>

            {loading ? (
                <div className="p-6 text-center">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-green-600 font-medium">Processing your request...</p>
                </div>
            ) : showResetForm ? (
                <ResetPasswordForm
                    email={email}
                    verificationToken={verificationToken}
                    onSuccess={() => {
                        // Optional: Any additional success handling
                        setShowResetForm(false);
                        onBackToLogin(); // If you want to go back to login
                    }}
                    onBack={() => {
                        setShowResetForm(false);
                        setShowOtpForm(true);
                    }}
                />
            ) : showOtpForm ? (
                <form onSubmit={handleOtpSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <input
                            name="otp"
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="rounded-full px-4 py-2 border w-full"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition font-medium"
                    >
                        Verify OTP
                    </button>

                    <div className="text-center pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowOtpForm(false);
                                setError("");
                                setMessage("");
                            }}
                            className="text-green-600 font-medium hover:underline"
                        >
                            Back to Email
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rounded-full px-4 py-2 border w-full"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition font-medium"
                    >
                        Send OTP
                    </button>

                    <div className="text-center pt-4">
                        <button
                            type="button"
                            onClick={onBackToLogin}
                            className="text-green-600 font-medium hover:underline"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            )}
        </>
    );
};

export default ForgotPasswordForm;