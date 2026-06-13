import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { getUserProfile } from "../../features/auth/authThunk";
import { User } from "lucide-react";

const ProfileCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userprofile: userData, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  if (loading) return <div className="p-6 bg-white rounded-xl">Loading...</div>;

  if (!userData) return null;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center w-full">
      {userData.profile_picture ? (
        <img
          src={userData.profile_picture}
          alt="Profile"
          className="w-20 h-20 rounded-full mb-3"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
          <User className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h2 className="text-lg font-semibold">{userData.first_name} {userData.last_name}</h2>
      {/* <p className="text-gray-500">{userData.role || "Customer"}</p> */}
      {/* <button className="text-green-600 text-sm mt-2 hover:underline">
        Edit Profile
      </button> */}
    </div>
  );
};

export default ProfileCard;
