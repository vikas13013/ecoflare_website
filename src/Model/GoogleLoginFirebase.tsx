import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { googleLogin } from "../features/auth/authThunk";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleLoginFirebase = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const res = await dispatch(googleLogin()).unwrap();

      if (res.user.roles === "Seller") {
        navigate("/dashboard/seller");
      } else if (res.user.roles === "BulkBuyer") {
        navigate("/dashboard/buyer");
      } else {
        navigate("/userdashboard");
      }

      toast.success("Login successful!", {
        autoClose: 50,
        position: "top-right",
      });
    } catch (err: any) {
      toast.error(
        err?.message || "Google login failed. Please try again."
      );
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded w-full"
    >
      Continue with Google
    </button>
  );
};

export default GoogleLoginFirebase;
