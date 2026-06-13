import React, { useState, useRef } from 'react';
import { Banknote, CheckCircle, Circle } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const currencies = ['CAD', 'EUR', 'GBP'] as const;

const CurrencySelector: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'CAD' | 'EUR' | 'GBP'>('CAD');
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={currencyRef}>
      <button
        onClick={() => setCurrencyDropdown(v => !v)}
        className="flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 group"
        aria-label="Currency selector"
        aria-expanded={currencyDropdown}
      >
        <div className="p-1.5 rounded-full transition-colors">
          <Banknote className="w-4 h-4 text-green-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">{selectedCurrency}</span>
        {currencyDropdown ? (
          <ChevronUp className="w-4 h-4 text-gray-500 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
        )}
      </button>

      {currencyDropdown && (
        <div className="absolute -right-10 mt-1.5 bg-white shadow-sm rounded-lg w-44 z-50 border border-gray-200 overflow-hidden animate-fade-in">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <Banknote className="w-4 h-4 text-gray-500" />
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Select Currency
            </p>
          </div>
          <div className="py-1">
            {currencies.map(cur => (
              <button
                key={cur}
                onClick={() => {
                  setSelectedCurrency(cur);
                  setCurrencyDropdown(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 transition-colors flex items-center gap-3 ${selectedCurrency === cur
                  ? 'text-green-700 font-medium bg-green-50'
                  : 'text-gray-700'
                  }`}
              >
                {selectedCurrency === cur ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300" />
                )}
                <span className="flex-1">{cur}</span>
                <span className="text-xs text-gray-500">
                  {cur === 'CAD' ? 'Canadian Dollar' :
                    cur === 'EUR' ? 'Euro' :
                      cur === 'GBP' ? 'Pound' : ''}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;