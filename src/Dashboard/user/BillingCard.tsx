import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchAddresses } from "../../features/address/addressThunk";
import { useTranslation } from "react-i18next";

const BillingCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const { addresses, loading, error } = useSelector(
    (state: RootState) => state.address
  );

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  if (loading)
    return (
      <div className="p-6 bg-white rounded-xl">
        {t("loading")}
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-100 rounded-xl">
        {t("error")}: {error}
      </div>
    );

  if (!addresses || addresses.length === 0)
    return (
      <div className="p-6 bg-white rounded-xl">
        {t("no_address_found")}
      </div>
    );

  const address = addresses[0];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <h3 className="text-gray-700 font-semibold mb-3">
        {t("billing_address")}
      </h3>

      <p className="font-medium">{address.fullName}</p>

      <p className="text-gray-600 text-sm">
        {address.city}, {address.address}, {address.country} - {address.postal_code}
      </p>

      <p className="text-gray-600 text-sm mt-1">{address.email}</p>
      <p className="text-gray-600 text-sm">{address.phone}</p>
    </div>
  );
};

export default BillingCard;