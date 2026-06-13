import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaLeaf, FaBox, FaChevronRight, FaInfoCircle, FaRegCalendarAlt } from "react-icons/fa";

interface QuoteRequest {
  id: number;
  title: string;
  image: string;
  created: string;
  quantity: string;
  method: string;
  packaging: string;
  respondBy: string;
  pickupDate: string;
  isOrganic: boolean;
  status?: "new" | "urgent" | "normal";
}

const QuoteRequests: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  
  const requests: QuoteRequest[] = [
    
    {
      id: 2,
      title: "Orange, Conventional",
      image: "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8b3JhbmdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      created: "Created 4 days ago",
      quantity: "40,000 lbs",
      method: "Conventional",
      packaging: "Bins",
      respondBy: "Aug 26, 2025",
      pickupDate: "Aug 29, 2025",
      isOrganic: false,
      status: "urgent"
    },
    
    
    {
      id: 5,
      title: "Carrots, Conventional",
      image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnJvdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      created: "Created 5 days ago",
      quantity: "25,000 lbs",
      method: "Conventional",
      packaging: "Bags, Bins",
      respondBy: "Aug 25, 2025",
      pickupDate: "Aug 28, 2025",
      isOrganic: false,
      status: "urgent"
    },
    {
      id: 6,
      title: "Strawberries, Organic",
      image: "https://images.unsplash.com/photo-1543528176-61b239494933?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c3RyYXdiZXJyeXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      created: "Created today",
      quantity: "15,000 lbs",
      method: "Organic",
      packaging: "Clamshells",
      respondBy: "Aug 28, 2025",
      pickupDate: "Aug 31, 2025",
      isOrganic: true,
      status: "new"
    }
  ];

  const filteredRequests = activeFilter === "all" 
    ? requests 
    : requests.filter(req => req.status === activeFilter);

  const handleReviewSubmit = (req: QuoteRequest) => {
    navigate(`/seller/requests/${req.id}`, { state: req });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "new":
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">New</span>;
      case "urgent":
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Urgent</span>;
      default:
        return null;
    }
  };

  const getDaysUntilDeadline = (respondBy: string) => {
    const respondDate = new Date(respondBy);
    const today = new Date();
    const diffTime = respondDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quote Requests</h1>
            <p className="text-gray-600 mt-2">Review and respond to incoming quote requests</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-4 py-3 rounded-lg">
              <FaInfoCircle className="mr-2" />
              <span>You have {requests.filter(r => r.status === "urgent").length} urgent requests</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "all" ? "bg-green-700 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
            onClick={() => setActiveFilter("all")}
          >
            All Requests ({requests.length})
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "urgent" ? "bg-red-600 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
            onClick={() => setActiveFilter("urgent")}
          >
            Urgent ({requests.filter(r => r.status === "urgent").length})
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === "new" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"}`}
            onClick={() => setActiveFilter("new")}
          >
            New ({requests.filter(r => r.status === "new").length})
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((req) => {
            const daysUntilDeadline = getDaysUntilDeadline(req.respondBy);
            const isUrgent = daysUntilDeadline <= 2;
            
            return (
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
                    {getStatusBadge(req.status || "normal")}
                  </div>
                  {isUrgent && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {daysUntilDeadline === 0 ? "Last day" : `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="font-bold text-xl text-white">{req.title}</h2>
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
                      <p className="text-xs text-gray-500 font-medium">RESPOND BY</p>
                      <p className="text-sm font-semibold">{req.respondBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">PICKUP DATE</p>
                      <p className="text-sm font-semibold">{req.pickupDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button className="text-gray-500 hover:text-gray-700 text-lg font-medium py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                      Decline
                    </button>
                    <button
                      onClick={() => handleReviewSubmit(req)}
                      className="bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-lg font-medium flex items-center transition-colors"
                    >
                      Review Quote <FaChevronRight className="ml-1 text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FaRegCalendarAlt className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeFilter !== "all" ? activeFilter : ""} requests</h3>
            <p className="text-gray-500">There are currently no {activeFilter !== "all" ? activeFilter : ""} quote requests to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteRequests;