import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const ProfileDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet /> {/* This is where nested route content appears */}
      </main>
    </div>
  );
};

export default ProfileDashboard;
