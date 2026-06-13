import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaLeaf, FaBox, FaChevronRight, FaInfoCircle, FaRegCalendarAlt, FaSearch } from "react-icons/fa";
import BuyerResponse from "../components/BuyerResponse";
interface BuyerRequest {
  id: number;
  title: string;
  image: string;
  created: string;
  quantity: string;
  method: string;
  packaging: string;
  deliveryDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  responses: number;
  supplier: string;
  isOrganic: boolean;
}

const BuyerRequestsList: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const requests: BuyerRequest[] = [
    
    {
      id: 2,
      title: "Orange, Conventional",
      image: "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8b3JhbmdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      created: "Created 4 days ago",
      quantity: "40,000 lbs",
      method: "Conventional",
      packaging: "Bins",
      deliveryDate: "Sep 10, 2025",
      status: "approved",
      responses: 5,
      supplier: "Sunshine Growers",
      isOrganic: false
    },
    {
      id: 3,
      title: "Carrots, Conventional",
      image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnJvdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      created: "Created 5 days ago",
      quantity: "25,000 lbs",
      method: "Conventional",
      packaging: "Bags, Bins",
      deliveryDate: "Sep 08, 2025",
      status: "rejected",
      responses: 2,
      supplier: "Fresh Harvest Inc.",
      isOrganic: false
    },
    {
      id: 4,
      title: "Strawberries, Organic",
      image: "https://images.unsplash.com/photo-1543528176-61b239494933?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c3RyYXdiZXJyeXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      created: "Created today",
      quantity: "15,000 lbs",
      method: "Organic",
      packaging: "Clamshells",
      deliveryDate: "Sep 03, 2025",
      status: "completed",
      responses: 8,
      supplier: "Berry Best Farms",
      isOrganic: true
    },
    
  ];

  const filteredRequests = activeFilter === "all" 
    ? requests 
    : requests.filter(req => req.status === activeFilter);

  const searchedRequests = filteredRequests.filter(req => 
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewRequest = (req: BuyerRequest) => {
    navigate(`/buyer/request/${req.id}`, { state: req });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Pending</span>;
      case "approved":
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Approved</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Rejected</span>;
      case "completed":
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Completed</span>;
      default:
        return null;
    }
  };

  const getStatusCount = (status: string) => {
    return requests.filter(req => req.status === status).length;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Requests</h1>
            <p className="text-gray-600 mt-2">Track and manage your quote requests</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-4 py-3 rounded-lg">
              <FaInfoCircle className="mr-2" />
              <span>You have {requests.filter(r => r.status === "pending").length} pending requests</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search requests or suppliers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-600 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "all" ? "bg-green-700 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
              onClick={() => setActiveFilter("all")}
            >
              All Requests ({requests.length})
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "pending" ? "bg-yellow-500 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
              onClick={() => setActiveFilter("pending")}
            >
              Pending ({getStatusCount("pending")})
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "approved" ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
              onClick={() => setActiveFilter("approved")}
            >
              Approved ({getStatusCount("approved")})
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "completed" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
              onClick={() => setActiveFilter("completed")}
            >
              Completed ({getStatusCount("completed")})
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {searchedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <div className="relative">
                <img 
                  src={req.image} 
                  alt={req.title} 
                  className="w-full h-48 object-cover" 
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(req.status)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="font-bold text-xl text-white">{req.title}</h2>
                  <p className="text-sm text-gray-200">{req.supplier}</p>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm text-gray-500">{req.created}</span>
                  {req.isOrganic && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      <FaLeaf className="mr-1" /> Organic
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">QUANTITY</p>
                    <p className="text-sm font-semibold">{req.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">PACKAGING</p>
                    <p className="text-sm font-semibold flex items-center">
                      <FaBox className="text-gray-400 mr-1" /> {req.packaging}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">DELIVERY DATE</p>
                    <p className="text-sm font-semibold">{req.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">RESPONSES</p>
                    <p className="text-sm font-semibold">{req.responses} quotes</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleViewRequest(req)}
                  className="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  View Details <FaChevronRight className="ml-1 text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {searchedRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FaRegCalendarAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm ? 'No matching requests found' : `No ${activeFilter !== "all" ? activeFilter : ""} requests`}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No requests found for "${searchTerm}". Try a different search term.`
                : `There are currently no ${activeFilter !== "all" ? activeFilter : ""} requests to display.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerRequestsList;