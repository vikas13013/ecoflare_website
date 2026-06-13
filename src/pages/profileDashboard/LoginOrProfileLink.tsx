import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { FiUser } from 'react-icons/fi';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoginOrProfileLink = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  const isLoggedIn = user && Object.keys(user).length > 0;
  // const isVerifiedSeller = user?.is_verified_seller === true;
  const isVerifiedSeller = user?.roles === "Seller";
  const isBulkBuyer = user?.roles === "BulkBuyer";

  // Decide target path based on role
  let targetPath = '/register';
  let label = t('login_register');
  let buttonClasses =
    'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800';

  if (isVerifiedSeller) {
    targetPath = '/dashboard/seller';
    label = t('');
    buttonClasses =
      'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700';
  } else if (isBulkBuyer) {
    targetPath = '/dashboard/buyer';
    label = t('');
    buttonClasses =
      'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
  } else if (isLoggedIn) {
    targetPath = '/userdashboard';
    label = t('');
    buttonClasses =
      'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800';
  }

  return (
    <div className="flex gap-3">
      {isLoggedIn && (
        <Link
          to={targetPath}
          className={`${buttonClasses} flex items-center text-white px-2 py-2 rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-lg group`}
        >
          <div className="p-1  rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <FiUser size={14} className="text-white" />
          </div>
          <span className="font-medium hidden md:block">{label}</span>
        </Link>
      )}

      {!isLoggedIn && (
        <Link
          to="/register"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center text-white px-5 py-2 rounded-full text-sm transition-all duration-200 shadow-md hover:shadow-lg group"
        >
          <div className="p-1 mr-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <FiUser size={14} className="text-white" />
          </div>
          <span className="hidden md:block font-medium">{t('login_register')}</span>
          <ArrowRight className="ml-2 hidden md:block w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      )}

      
    </div>
  );
};

export default LoginOrProfileLink;
