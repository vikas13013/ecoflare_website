import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Edit2, ArrowRight, ArrowLeft, Clock, Calendar, User, Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const BookingTimePicker = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(13);
  const [duration, setDuration] = useState('30 Mins');
  const [selectedTime, setSelectedTime] = useState('22:45');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('UTC +05:30 New Delhi, Mumbai, Calcutta');

  const times = ['02:30', '03:00', '03:30', '04:00', '04:30', '22:45'];
  const durations = ['15 Mins', '30 Mins', '1 Hour'];
  const timezones = [
    'UTC +05:30 New Delhi, Mumbai, Calcutta',
    'UTC -05:00 New York, Toronto',
    'UTC +00:00 London, Dublin',
    'UTC +08:00 Singapore, Hong Kong'
  ];

  const selectedDateFormatted = `Thursday, 13 March 2025 ${selectedTime}`;
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

  const handleConfirm = () => {
    if (!firstName || !lastName || !email) {
      alert('Please fill in all required fields');
      return;
    }
    setBookingConfirmed(true);
  };

  const handleBackClick = () => {
    navigate("/request");
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-6">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md text-center border-2 border-green-100 transform transition-all duration-300 hover:shadow-xl">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-green-800 mb-3">Booking Confirmed!</h2>
          <p className="text-gray-700 mb-4">
            You're booked with <span className="font-semibold text-green-700">David Chambers</span>. An invitation has been sent to your email.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-6 inline-block">
            <p className="text-sm font-medium text-gray-800">{selectedDateFormatted}</p>
          </div>

          <button 
            onClick={handleBackClick} 
            className="mt-6 px-6 py-2.5 border border-primary text-green-700 rounded-full text-sm flex items-center gap-2 mx-auto transition-all hover:bg-green-50 hover:shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="text-center mb-8 md:mb-10">
          <div className="flex justify-center items-center gap-4 md:gap-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 mx-auto" style={{ width: 'calc(100% - 80px)' }}>
              <div 
                className={`h-full bg-primary transition-all duration-500 ease-in-out ${step === 1 ? 'w-1/2' : 'w-full'}`}
                style={{ width: step === 1 ? '50%' : '100%' }}
              ></div>
            </div>
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center gap-2 bg-white p-1 rounded-full">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step === stepNumber ? 'bg-primary text-white shadow-md' : step > stepNumber ? 'bg-green-100 text-green-800' : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {step === stepNumber && (
                  <p className={`text-sm font-semibold hidden md:block ${
                    step === stepNumber ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {stepNumber === 1 ? 'Choose Time' : 'Your Info'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-0">
              {/* Calendar Section */}
              <div className="p-5 md:p-6 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    March 2025
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 text-center gap-2 text-sm text-gray-600 mb-3">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                    <div key={d} className="font-medium text-gray-500">{d}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 text-center gap-2">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === selectedDate;
                    return (
                      <button
                        key={day}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                          isSelected 
                            ? 'bg-primary text-white shadow-md transform scale-105' 
                            : 'hover:bg-green-50 hover:text-green-700'
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection Section */}
              <div className="p-5 md:p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Duration
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((label) => (
                      <button
                        key={label}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          duration === label 
                            ? 'bg-primary text-white shadow-md' 
                            : 'border border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-700'
                        }`}
                        onClick={() => setDuration(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Available Times</h3>
                  <p className="text-sm text-gray-600 mb-3">Showing times for: {selectedDate} March 2025</p>
                  
                  <div className="relative mb-4">
                    <button 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm flex justify-between items-center hover:border-green-400 transition-colors"
                      onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                    >
                      <span>{timezone}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showTimezoneDropdown ? 'transform rotate-180' : ''}`} />
                    </button>
                    {showTimezoneDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {timezones.map((tz) => (
                          <button
                            key={tz}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 ${
                              timezone === tz ? 'bg-green-100 text-green-700' : 'text-gray-700'
                            }`}
                            onClick={() => {
                              setTimezone(tz);
                              setShowTimezoneDropdown(false);
                            }}
                          >
                            {tz}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {times.map((time) => (
                      <button
                        key={time}
                        className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time 
                            ? 'bg-primary text-white shadow-md' 
                            : 'border border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-700'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)} 
                  className="w-full bg-primary hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-5 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Information</h2>
                <div className="flex justify-center items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p className="text-sm">{selectedDateFormatted}</p>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-primary hover:text-green-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-primary hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  Confirm Booking <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTimePicker;