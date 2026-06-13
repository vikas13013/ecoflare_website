import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store"; // adjust the path to your store
import { getUserProfile } from "../../features/auth/authThunk"; // adjust the path
import { RootState } from "../../app/store"; // for typed useSelector
import LogoutButton from "../../components/LogoutButton";
import { FiUser } from "react-icons/fi";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();

  const { user } = useSelector((state: RootState) => state.auth);
  
  console.log(user , "user from sidebar");

   const { userprofile: userData, loading } = useSelector(
      (state: RootState) => state.auth,
    );

    console.log(userData , "userdata");
    
  

  useEffect(() => {
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);
const links = [
  { name: "My Profile", path: "/profiledashboard" },
  { name: "Change Password", path: "/profiledashboard/change-password" },
  { name: "Address Management", path: "/profiledashboard/addressmanagement" },
];

if (user?.roles === "BulkBuyer") {
  links.push(
    { name: "Subscription", path: "/profiledashboard/subscription" },
    { name: "Marketplace", path: "/marketplace" }
  );
}

  return (
    <aside className="w-full md:w-64 bg-white p-4 border-r">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          {userData?.profile_picture ? (
            <img
              src={userData.profile_picture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-1 border-[#1F4E3D]/20">
              <FiUser className="text-gray-400 text-5xl" />
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold mt-4">
          {String(user?.first_name || "")} {String(user?.last_name || "")}
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          {String(user?.email || "")}
        </p>
        <p className="text-sm text-gray-600">
          {String(user?.phone_number || "")}
        </p>
      </div>
      <nav className="mt-6 space-y-2">
        {links.map((link) => (
          <Link
            to={link.path}
            key={link.name}
            className={`block px-3 py-2 rounded ${
              pathname === link.path
                ? "bg-gray-200 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {link.name}
          </Link>
        ))}
        <LogoutButton />
      </nav>
    </aside>
  );
};

export default Sidebar;
