import React, { useState } from "react";
import AddressPage from "../../pages/address/AddressPage";
import ProfilSetting from "../user/ProfileSetting";
import ChangePasswordPage from "../../Model/ChangePasswordPage";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile"); // default: profile

  return (
    <div className="w-full max-w-4xl mx-auto ">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("address")}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === "address"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Address
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
            activeTab === "password"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === "profile" && <ProfilSetting />}
        {activeTab === "address" && <AddressPage />}
        {activeTab === "password" && <ChangePasswordPage />}
      </div>
    </div>
  );
};

export default Setting;
