import React from "react";
import { ArrowLeft, ClipboardList, RefreshCcw, ShoppingCart } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const StepProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { type } = location.state || { type: "Unknown" };
  const steps = [
    {
      id: "STEP 01",
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Create a Produce Request",
      description: "Fill out a short form listing a wish list spot or contract purchase you need.",
    },
    {
      id: "STEP 02",
      icon: <RefreshCcw className="w-8 h-8" />,
      title: "Compare Responses",
      description:
        "Responses from our wide network of vetted suppliers will arrive in your inbox allowing you to pick the details that suit you.",
    },
    {
      id: "STEP 03",
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Purchase",
      description: "Select a response to purchase or request modifications.",
    },
  ];

  return (
    <section className="py-8 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-50">
            <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
      <div className="max-w-6xl mx-auto">
  
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ecoflare is here to help you find the produce you need
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple three-step process connects you with quality suppliers in minutes
          </p>
        </div>

        <div className="relative">
          {/* Progress line */}
          {/* <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gray-200">
            <div className="z-50 absolute top-0 left-0 h-full bg-primary animate-progress-grow" style={{ width: '100%' }}></div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="group relative z-10 flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2"
              >
                {/* Step indicator for mobile */}
                <div className="md:hidden absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Step circle */}
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {React.cloneElement(step.icon, { className: "w-8 h-8 text-primary group-hover:text-white" })}
                </div>
                
                <span className="text-xs font-semibold text-primary mb-2 tracking-wider">{step.id}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {/* Step number for desktop */}
                <div className="hidden md:block absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-green-900 transition-colors duration-300 shadow-md hover:shadow-lg">
            Get Started Now
          </button>
          <p className="mt-4 font-semibold">You started a <span className="font-semibold">{type}</span></p>
        </div>
      </div>
    </section>
  );
};

export default StepProcess;