// AuthPage.tsx
import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

interface Props {
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthPage: React.FC<Props> = ({ setShowLoginModal }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return isLoginView ? (
    <LoginPage 
      setShowLoginModal={setShowLoginModal} 
      switchToRegister={() => setIsLoginView(false)} 
    />
  ) : (
    <RegisterPage 
      setShowLoginModal={setShowLoginModal} 
      switchToLogin={() => setIsLoginView(true)} 
    />
  );
};

export default AuthPage;