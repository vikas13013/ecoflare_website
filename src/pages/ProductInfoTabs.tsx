import { useState } from "react";
import { ChevronDown, Info, Package, Ruler, Truck } from "lucide-react";

const tabs = [
  { name: "Description", icon: Info },
  { name: "Conversion Chart", icon: Package }
];

const ProductInfoTabs = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Food Safety": false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Description":
        return (
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 text-sm sm:text-base">
              <div className="font-medium text-gray-700 space-y-2">
                <p>Produce Description</p>
                <p>Color</p>
                <p>Country of Origin</p>
                <p>Organic</p>
                <p>Non-GMO</p>
                <p>Food Safety</p>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <p>
                  High Quality Certified Red Habanero Pepper produced in Hydroponic System inside Greenhouses
                  with No Use of Agrochemicals in 8lb. presentation for bulk sale.
                </p>
                <p>Orange-Red</p>
                <p>Mexico</p>
                <p>No</p>
                <p>No</p>
                <div>
                  <button 
                    onClick={() => toggleSection("Food Safety")}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Available by request
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${expandedSections["Food Safety"] ? "rotate-180" : ""}`} 
                    />
                  </button>
                  {expandedSections["Food Safety"] && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                      <p className="font-medium mb-1">Food Safety Documentation:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>GFSI Certification</li>
                        <li>HACCP Compliance</li>
                        <li>Third-party Audit Reports</li>
                      </ul>
                      <button className="mt-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors">
                        Request Documents
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

        return (
          <div className="py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specification</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tolerance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600">Size</td>
                    <td className="px-4 py-3 text-sm text-gray-600">2-3 inches</td>
                    <td className="px-4 py-3 text-sm text-gray-600">±0.5 inches</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600">Weight</td>
                    <td className="px-4 py-3 text-sm text-gray-600">8-10g per pepper</td>
                    <td className="px-4 py-3 text-sm text-gray-600">±1g</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600">Color Uniformity</td>
                    <td className="px-4 py-3 text-sm text-gray-600">90% uniform</td>
                    <td className="px-4 py-3 text-sm text-gray-600">±5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Conversion Chart":
        return (
          <div className="py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peppers</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600">1 Pepper</td>
                    <td className="px-4 py-3 text-sm text-gray-600">8-10g</td>
                    <td className="px-4 py-3 text-sm text-gray-600">1</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600">1 Carton</td>
                    <td className="px-4 py-3 text-sm text-gray-600">8lb</td>
                    <td className="px-4 py-3 text-sm text-gray-600">~450</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-600">1 Pallet</td>
                    <td className="px-4 py-3 text-sm text-gray-600">1,200lb</td>
                    <td className="px-4 py-3 text-sm text-gray-600">~67,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-3 flex items-start  gap-2 text-sm font-medium transition-colors ${
                activeTab === tab.name
                  ? "text-green-700 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">{renderContent()}</div>
    </div>
  );
};

export default ProductInfoTabs;