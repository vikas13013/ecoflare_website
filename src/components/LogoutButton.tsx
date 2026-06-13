import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Add a small delay for better UX (simulate async operation)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    dispatch(logout());
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`
        px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 
        transition-colors duration-300 flex items-center justify-center
        min-w-[100px] ${isLoggingOut ? 'opacity-75' : ''}
      `}
    >
      {isLoggingOut ? (
        <>
          <ClipLoader color="#ffffff" size={18} className="mr-2" />
          Logging out...
        </>
      ) : (
        "Logout"
      )}
    </button>
  );
};

export default LogoutButton;