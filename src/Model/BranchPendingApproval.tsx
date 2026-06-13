import React from "react";
import { Link } from "react-router-dom";
// import { Card } from "../components/ui/card"; 
// import { Button } from "../components/ui/button"; 

const BranchPendingApproval = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* If using UI components */}
      {/* <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Branch Registration Under Review
        </h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for submitting your branch registration. Your application is currently being reviewed by our team. 
          Please wait for approval notification which you'll receive via email.
        </p>
        
        <p className="text-gray-500 text-sm mb-6">
          Typically this process takes 1-2 business days.
        </p>
        
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Back to Dashboard
        </Button>
      </Card> */}

      {/* Alternative without UI components */}
      
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Branch Registration Under Review
        </h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for submitting your branch registration. Your application is currently being reviewed by our team. 
          Please wait for approval notification which you'll receive via email.
        </p>
        
        <p className="text-gray-500 text-sm mb-6">
          Typically this process takes 1-2 business days.
        </p>
        
        <Link to="/profiledashboard" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Back to Dashboard
        </Link>
      </div>
     
    </div>
  );
};

export default BranchPendingApproval;