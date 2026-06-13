import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;
    // Get registered user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("registeredUser") || "{}");

    // Check login credentials (email or phone matches + password)
    const isEmailMatch = storedUser.email === login;
    const isPhoneMatch = storedUser.phone === login;
    const isPasswordMatch = storedUser.password === password;

    if ((isEmailMatch || isPhoneMatch) && isPasswordMatch) {
      // Success
      setError(null);
      alert("Login successful!");
      navigate("/dashboard");
    } else {
      setError("Invalid email/phone or password.");
    }
  };

  return (
    <form className="space-y-6 max-w-md mx-auto mt-10 mb-10" onSubmit={handleLogin}>
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {error && (
        <p className="text-red-600 text-center font-medium">{error}</p>
      )}

      <input
        name="login"
        type="text"
        placeholder="Email or Mobile Number"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
