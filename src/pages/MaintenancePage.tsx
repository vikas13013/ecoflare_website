import { AlertTriangle } from "lucide-react";

const MaintenancePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-center px-4">
      <div className="max-w-md">
        <AlertTriangle className="mx-auto text-yellow-500 w-24 h-24 mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">We’re Under Maintenance</h1>
        <p className="text-lg text-gray-600">
          Sorry for the inconvenience. Our website is currently undergoing scheduled maintenance.
          We’ll be back shortly!
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
