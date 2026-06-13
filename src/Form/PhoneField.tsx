import React from "react";
import Select from "react-select";
import countryCodes, { CountryCodeOption } from "../constants/countryData";
import { useTranslation } from "react-i18next";

interface Props {
  selectedCountry: CountryCodeOption;
  setSelectedCountry: (val: CountryCodeOption) => void;
  phone: string;
  setPhone: (val: string) => void;
}

const PhoneField: React.FC<Props> = ({
  selectedCountry,
  setSelectedCountry,
  phone,
  setPhone,
}) => {

  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Country Code Dropdown */}
      <div className="w-1/3">
        <Select
          value={selectedCountry}
          onChange={(option) => {
            if (option) setSelectedCountry(option as CountryCodeOption);
          }}
          options={countryCodes}
          getOptionLabel={(e) => e.label}
          getOptionValue={(e) => e.code}
          className="text-sm"
        />
      </div>

      {/* Phone Input */}
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={t("phone_number")}
        className="w-2/3 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
};

export default PhoneField;
