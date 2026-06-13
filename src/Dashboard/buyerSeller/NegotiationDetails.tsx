import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLeaf,
  FaClock,
  FaCalendarAlt,
  FaDollarSign,
  FaWeight,
  FaShippingFast,
  FaTag,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaEdit,
  FaPaperPlane,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaStore,
  FaShoppingCart,
  FaPercentage,
  FaTruck,
  FaStar,
  FaRegStar,
  FaCrown,
  FaCertificate,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import {
  getUserProfile,
  updateUserProfile,
} from "../../features/auth/authThunk";
import { useTranslation } from "react-i18next";
import { MapPin, Plus } from "lucide-react";
import { fetchAddresses } from "../../features/address/addressThunk";

interface Product {
  id: number;
  name: string;
  description: string;
  category: number;
  product_image: string | null;
  status: string;
  user: number;
  product_availability: number | null;
  organic_certified: boolean;
  is_negotiable: boolean;
  is_flexible_buying: boolean;
  is_bulk_buying: boolean;
  is_preorder_produce: boolean;
  canada_grade: string | null;
  currency: string;
  base_price: string;
  hst_included: boolean;
  stock_quantity: string;
  min_order_quantity: string;
  unit: string;
  growing_session: string;
  expiry_date: string | null;
  harvest_date: string | null;
  food_safety_certification: string | null;
  is_top_products: boolean;
  quantity_discounts: Array<{
    id: number;
    min_quantity: number;
    max_quantity: number;
    discount_percentage: string;
    shipping_charges: string;
  }>;
}

interface Negotiation {
  id: number;
  product: Product;
  buyer: number;
  seller: number;
  buying_type: string | null;
  status: "Open" | "Expired" | "Closed" | "Accepted" | "Rejected";
  buyer_accepted: boolean;
  seller_accepted: boolean;
  accepted_by_both_at: string | null;
  created_at: string;
  updated_at: string;
  seller_responded_at: string | null;
  expires_at: string | null;
  time_remaining: string | null;
  is_expired: boolean;
}

interface PriceNegotiation {
  id: number;
  negotiation: Negotiation;
  user: number;
  quantity: number;
  expected_quantity: number;
  unit: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected" | "Countered";
  frequency_of_deliveries: string;
  product_variety: string;
  product_type: string;
  grade: string;
  product_availability: number;
  location: number;
  ships_from: string;
  start_date: string | null;
  end_date: string | null;
  expected_price: string | null;
  expiry_date: string | null;
  harvest_date: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: number;
  message: string;
  total_items: number;
  page: number;
  current_page_size: number;
  total_pages_size: number;
  next: string | null;
  previous: string | null;
  data: PriceNegotiation[];
}

interface FormData {
  quantity: number;
  expected_quantity: number;
  unit: string;
  message: string;
  frequency_of_deliveries: string;
  product_variety: string;
  product_type: string;
  grade: string;
  product_availability: number;
  location: number;
  ships_from: string;
  expected_price: string;
  delivery_start_date: string;
  delivery_end_date: string;

  // Type-specific fields
  expiry_date: string;
  harvest_date: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_verified_seller: boolean;
  created_at: string;
  updated_at: string;
  user: number;
  profile_picture: string | null;
  gender: string;
  other_mobile_number: string;
  occupation: string;
  farm_type: string | null;
  whatsapp_number: string;
  instagram_profile: string;
  facebook_profile: string;
}

const NegotiationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  console.log(id, "negotiation id from params");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const { userprofile: userData } = useSelector(
  //   (state: RootState) => state.auth,
  // );
  const { user} = useSelector(
    (state: RootState) => state.auth,
  );
  // const user = userData;
  console.log(user , "userdata");
  
  const [showAgreementPopup, setShowAgreementPopup] = useState(false);
  const [showAcceptancePopup, setShowAcceptancePopup] = useState<{
    show: boolean;
    message: string;
    type: "buyer" | "seller";
  } | null>(null);
  console.log(showAgreementPopup, "setShowAgreementPopup");

  const [negotiations, setNegotiations] = useState<PriceNegotiation[]>([]);
  console.log(negotiations, "negotiations Data ");
  const buyerId = negotiations[0]?.negotiation?.buyer;
  const sellerId = negotiations[0]?.negotiation?.seller;
  const getLatestOffer = (userId) => {
    return negotiations
      .filter((n) => n.user === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  };

  const buyerLatestOffer = getLatestOffer(buyerId);
  const sellerLatestOffer = getLatestOffer(sellerId);

  const [loading, setLoading] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAcceptReject, setShowAcceptReject] = useState<number | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const [buyerProfile, setBuyerProfile] = useState<UserProfile | null>(null);
  // console.log(buyerProfile, "buyer profile data");
  const [sellerProfile, setSellerProfile] = useState<UserProfile | null>(null);
  // console.log(sellerProfile, "seller profile data");
  const [activeTab, setActiveTab] = useState<"conversation" | "details">(
    "conversation",
  );

  const [formData, setFormData] = useState<FormData>({
    quantity: 1,
    expected_quantity: 0,
    unit: "kg",
    message: "",
    frequency_of_deliveries: "",
    product_variety: "",
    product_type: "",
    grade: "",
    product_availability: 0,
    location: 1,
    ships_from: "",
    expected_price: "",

    // Delivery fields
    delivery_start_date: "",
    delivery_end_date: "",
    // Type-specific fields
    expiry_date: "",
    harvest_date: "",
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Fetch all negotiations for this conversation
  useEffect(() => {
    const fetchNegotiationDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `https://api.ecoflaresolutions.com/negotiation/price-negotiations/?negotiation_id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        console.log(data, "negotiation data from api response");

        if (data.status === 0) {
          // Sort by created_at ascending to show in chronological order
          const sortedData = data.data.sort(
            (a, b) =>
              new Date(b.created_at).getTime() - // DESCENDING order (latest first)
              new Date(a.created_at).getTime(),
          );
          setNegotiations(sortedData);

          // Pre-fill form with latest data if available
          if (sortedData.length > 0) {
            const latest = sortedData[sortedData.length - 1];
            setFormData({
              quantity: latest.quantity,
              expected_quantity: latest.expected_quantity,
              unit: latest.unit,
              message: "",
              frequency_of_deliveries: latest.frequency_of_deliveries || "",
              product_variety: latest.product_variety || "",
              product_type: latest.product_type || "",
              grade: latest.grade || "",
              product_availability: latest.product_availability || 0,
              location: latest.location || 1,

              ships_from: latest.ships_from || "",
              expected_price: latest.expected_price || "",
              expiry_date: latest.expiry_date || "",
              harvest_date: latest.harvest_date || "",
            });
          }
        } else {
          throw new Error(data.message || "Negotiation not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching negotiation details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNegotiationDetails();
    }
  }, [id]);

  // Fetch buyer and seller profiles
  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (negotiations.length === 0) return;

      try {
        setLoadingProfiles(true);
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const latestNegotiation = negotiations[0];
        const buyerId = latestNegotiation.negotiation.buyer;
        const sellerId = latestNegotiation.negotiation.seller;

        // Fetch buyer profile
        const buyerResponse = await fetch(
          `https://api.ecoflaresolutions.com/account/user-profile/?user_id=${buyerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (buyerResponse.ok) {
          const buyerData = await buyerResponse.json();
          // console.log(buyerData, "buyer data");

          if (buyerData.status === 0) {
            setBuyerProfile(buyerData.user);
          }
        }

        // Fetch seller profile
        const sellerResponse = await fetch(
          `https://api.ecoflaresolutions.com/account/user-profile/?user_id=${sellerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (sellerResponse.ok) {
          const sellerData = await sellerResponse.json();
          // console.log(sellerData, "seller data");
          if (sellerData.status === 0) {
            setSellerProfile(sellerData.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      } finally {
        setLoadingProfiles(false);
      }
    };

    if (negotiations.length > 0) {
      fetchUserProfiles();
    }
  }, [negotiations]);

  const currentUserId = user ? user.id : null;

  // Add these with other useSelector hooks
  const { addresses, loading: addressesLoading } = useSelector(
    (state: RootState) => state.address,
  );

  // Add useEffect to fetch addresses when component mounts
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, currentUserId]);

  // Check if negotiation is finalized (accepted or rejected by both)
  // Check if negotiation is finalized (accepted by both parties)
  const isNegotiationFinalized = () => {
    if (negotiations.length === 0) return false;
    const mainNegotiation = negotiations[0].negotiation;
    return mainNegotiation.buyer_accepted && mainNegotiation.seller_accepted;
  };

  // Check if current user can accept (hasn't accepted yet)
  const canUserAccept = () => {
    if (negotiations.length === 0) return false;
    const mainNegotiation = negotiations[0].negotiation;

    if (currentUserId === buyerProfile?.id) {
      return !mainNegotiation.buyer_accepted;
    }
    if (currentUserId === sellerProfile?.id) {
      return !mainNegotiation.seller_accepted;
    }
    return false;
  };

  // Check if other party has accepted
  const hasOtherPartyAccepted = () => {
    if (negotiations.length === 0) return false;
    const mainNegotiation = negotiations[0].negotiation;

    if (currentUserId === buyerProfile?.id) {
      return mainNegotiation.seller_accepted;
    }
    if (currentUserId === sellerProfile?.id) {
      return mainNegotiation.buyer_accepted;
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const payload = {
        user: currentUserId,
        negotiation_id: parseInt(id!),
        quantity: formData.quantity,
        expected_quantity: formData.expected_quantity,
        unit: formData.unit,
        message: formData.message,
        frequency_of_deliveries: formData.frequency_of_deliveries,
        product_variety: formData.product_variety,
        product_type: formData.product_type,
        grade: formData.grade,
        product_availability: formData.product_availability,
        location: formData.location,
        ships_from: formData.ships_from,
        expected_price: formData.expected_price,
        // Delivery fields
        delivery_start_date: formData.delivery_start_date || null,
        delivery_end_date: formData.delivery_end_date || null,
        expiry_date: formData.expiry_date || null,
        harvest_date: formData.harvest_date || null,
      };

      const response = await fetch(
        "https://api.ecoflaresolutions.com/negotiation/price-negotiations/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "data fromm submitting");

      if (data.status === 0) {
        // Refresh the negotiations list
        window.location.reload();
      } else {
        throw new Error(data.message || "Failed to submit negotiation");
      }
    } catch (err) {
      console.log(error, "error from submitt");

      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error submitting negotiation:", err);
    } finally {
      setSubmitting(false);
      setIsEditing(false);
    }
  };

  // Handle reject offer
  // Handle reject offer
  const handleReject = async (negotiationId: number) => {
    try {
      setRejecting(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `https://api.ecoflaresolutions.com/negotiation/price-negotiations/${negotiationId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: "Rejected" }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "data from rejecting");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error rejecting offer:", err);
    } finally {
      setRejecting(false);
      setShowAcceptReject(null);
    }
  };

  // yaha se code change hua hai

  const handleNegotiationAccept = async (negotiationId: number) => {
    try {
      setAccepting(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      // Get current negotiation state
      const mainNegotiation = negotiations[0]?.negotiation;

      // Determine if current user is buyer or seller
      const isBuyer = currentUserId === buyerProfile?.id;

      // Create payload based on user role and current state
      const payload = isBuyer
        ? { buyer_accepted: true, status: "Accepted" } // If buyer, accept as buyer
        : { seller_accepted: true, status: "Accepted" }; // If seller, accept as seller

      const response = await fetch(
        `https://api.ecoflaresolutions.com/negotiation/negotiations/${negotiationId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data, "data from accepting");

      // Refresh the page to show updated state
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error accepting offer:", err);
    } finally {
      setAccepting(false);
      setShowAcceptReject(null);
    }
  };

  const handleNegotiationReject = async (negotiationId: number) => {
    try {
      setRejecting(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      // Determine if current user is buyer or seller
      const isBuyer = currentUserId === buyerProfile?.id;

      // Create payload based on user role
      const payload = isBuyer
        ? { buyer_accepted: false, status: "Rejected" }
        : { seller_accepted: false, status: "Rejected" };

      const response = await fetch(
        `https://api.ecoflaresolutions.com/negotiation/negotiations/${negotiationId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error rejecting offer:", err);
    } finally {
      setRejecting(false);
      setShowAcceptReject(null);
    }
  };

  useEffect(() => {
    if (negotiations.length === 0) return;

    const mainNegotiation = negotiations[0].negotiation;

    // Check if both accepted - then negotiation is complete
    if (mainNegotiation.buyer_accepted && mainNegotiation.seller_accepted) {
      setShowAcceptancePopup(null);
      return;
    }

    // Check if only buyer accepted and current user is seller
    if (
      mainNegotiation.buyer_accepted &&
      !mainNegotiation.seller_accepted &&
      currentUserId === sellerProfile?.id
    ) {
      setShowAcceptancePopup({
        show: true,
        message: `${buyerProfile?.first_name} ${buyerProfile?.last_name} has accepted your offer. Please review and accept to complete the negotiation.`,
        type: "seller",
      });
      return;
    }

    // Check if only seller accepted and current user is buyer
    if (
      mainNegotiation.seller_accepted &&
      !mainNegotiation.buyer_accepted &&
      currentUserId === buyerProfile?.id
    ) {
      setShowAcceptancePopup({
        show: true,
        message: `${sellerProfile?.first_name} ${sellerProfile?.last_name} has accepted your offer. Please review and accept to complete the negotiation.`,
        type: "buyer",
      });
      return;
    }

    // If no relevant acceptance state, hide popup
    setShowAcceptancePopup(null);
  }, [negotiations, currentUserId, buyerProfile, sellerProfile]);

  // Auto-fill form with selected negotiation data
  const handleAutoFill = (negotiation: PriceNegotiation) => {
    console.log(negotiation, "negotiation from autofill");

    setFormData({
      quantity: negotiation.quantity,
      expected_quantity: negotiation.expected_quantity,
      unit: negotiation.unit,
      message: "",
      frequency_of_deliveries: negotiation.frequency_of_deliveries
        ? negotiation.frequency_of_deliveries.toLowerCase()
        : "",
      product_variety: negotiation.product_variety || "",
      product_type: negotiation.product_type || "",
      grade: negotiation.grade || "",
      product_availability: negotiation.product_availability || 0,
      ships_from: negotiation.ships_from || "",
      expected_price: negotiation.expected_price || "",
      location: negotiation.location?.id || 1,
      // Delivery fields
      delivery_start_date: negotiation.delivery_start_date || "",
      delivery_end_date: negotiation.delivery_end_date || "",
      // Type-specific fields
      expiry_date: negotiation.expiry_date || "",
      harvest_date: negotiation.harvest_date || "",
    });
    setIsEditing(true);
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper functions
  const getUserName = (userId: number): string => {
    if (userId === currentUserId) return "You";

    if (userId === buyerProfile?.id) {
      return `${buyerProfile?.first_name} ${buyerProfile?.last_name}`;
    }

    if (userId === sellerProfile?.id) {
      return `${sellerProfile?.first_name} ${sellerProfile?.last_name}`;
    }

    return `User ${userId}`;
  };

  const getUserRole = (userId: number): string => {
    if (userId === sellerProfile?.id && sellerProfile?.is_verified_seller) {
      return "Verified Seller";
    }
    if (userId === sellerProfile?.id) {
      return "Seller";
    }
    if (userId === buyerProfile?.id) {
      return buyerProfile?.occupation || "Buyer";
    }
    return "User";
  };

  const isUserVerified = (userId: number): boolean => {
    return (
      userId === sellerProfile?.id && sellerProfile?.is_verified_seller === true
    );
  };

  // Get default product image
  const getDefaultImage = (productName: string) => {
    const defaultImages: { [key: string]: string } = {
      banana:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      carrots:
        "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcnJvdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      tomato:
        "https://images.unsplash.com/photo-1546470427-e212b7d31075?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      cabbage:
        "https://images.unsplash.com/photo-1620236061022-2eab6bb1d175?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      avocado:
        "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    };

    const lowerName = productName.toLowerCase();
    return (
      defaultImages[lowerName] ||
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    );
  };

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <FaClock className="mr-1" size={10} /> Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <FaCheckCircle className="mr-1" size={10} /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <FaTimesCircle className="mr-1" size={10} /> Rejected
          </span>
        );
      case "countered":
        return (
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <FaTag className="mr-1" size={10} /> Counter Offer
          </span>
        );
      case "open":
        return (
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <FaClock className="mr-1" size={10} /> Open
          </span>
        );
      default:
        return null;
    }
  };

  // Grade options for dropdown
  const gradeOptions = [
    { value: "A", label: "Grade A" },
    { value: "B", label: "Grade B" },
    { value: "C", label: "Grade C" },
    { value: "D", label: "Grade D" },
   
  ];

  // Add this function in NegotiationDetails component
  const handleDateChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // Agar start date change ho rahi hai
      if (name === "delivery_start_date") {
        return {
          ...prev,
          [name]: value,
          delivery_end_date: "", // Clear end date
        };
      }

      // Agar harvest date change ho rahi hai
      if (name === "harvest_date") {
        return {
          ...prev,
          [name]: value,
          expiry_date: "", // Clear expiry date
        };
      }

      // Normal field update for other fields
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  const handleGoToAgreement = () => {
    if (!latestNegotiation) return;

    window.location.href = `https://pricewise.wizdigtech.com/buyer/agreement?negotiationId=${latestNegotiation.negotiation.id}`;
    // window.location.href = `http://localhost:5174/buyer/agreement?negotiationId=${latestNegotiation.negotiation.id}`;
  };
  const latestNegotiation = negotiations[0];

  // console.log(latestNegotiation, "latest negotiation data in main component");

  useEffect(() => {
    if (
      latestNegotiation?.negotiation?.buyer_accepted === true &&
      latestNegotiation?.negotiation?.seller_accepted === true
      // latestNegotiation?.negotiation?.status === "Accepted"
      // && currentUserId === buyerProfile?.id
    ) {
      setShowAgreementPopup(true);
    }
  }, [latestNegotiation, currentUserId, buyerProfile]);

  if (loading || loadingProfiles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-seconadary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaUser className="text-secondary" size={24} />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            {t("loading_conversation_details")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t("fetching_profiles_messages")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FaExclamationTriangle className="text-2xl text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("error_loading_negotiation")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t("go_back")}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (negotiations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FaInfoCircle className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Negotiation Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The requested negotiation could not be found.
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to List
          </button>
        </div>
      </div>
    );
  }

  const product = latestNegotiation.negotiation.product;
  const harvestField = latestNegotiation.negotiation.buying_type === "flexible_buying";
  const isFinalized = isNegotiationFinalized();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="flex items-center mr-6 
                     bg-white hover:bg-white
                     text-primary hover:text-black
                     p-2 rounded-lg transition-all"
              >
                <FaArrowLeft className="mr-2" />
                {t("back")}
              </button>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  {t("negotiation_conversation")}
                </h1>
                <p className="text-white/90 text-sm">ID: {id}</p>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white text-gray-800 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="font-medium text-gray-800">{t("status")}:</span>{" "}
              {getStatusBadge(latestNegotiation.negotiation.status)}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Product Info */}
            <div className="flex items-center gap-4 bg-white backdrop-blur-sm p-4 rounded-xl flex-1">
              <img
                src={product.product_image || getDefaultImage(product.name)}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 shadow-lg"
              />

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-xl text-gray-800">
                    {product.name}
                  </h2>

                  {product.organic_certified && (
                    <span className="inline-flex items-center bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                      <FaLeaf className="mr-1" /> {t("organic")}
                    </span>
                  )}
                </div>

                <p className="text-gray-800  mt-1">
                  {t("base_price")}{" "}
                  <span className="font-bold">
                    {product.base_price} {product.currency}/{product.unit}
                  </span>
                </p>

                <p className="text-sm text-gray-800 ">
                  {t("stock")}: {product.stock_quantity} {product.unit} •{" "}
                  {t("min_order")} {product.min_order_quantity} {product.unit}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-4">
              {/* Seller */}
              <div className="flex items-center gap-3 bg-white  backdrop-blur-sm px-4 py-3 rounded-xl min-w-[200px]">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                    {sellerProfile?.profile_picture ? (
                      <img
                        src={sellerProfile.profile_picture}
                        alt="Seller"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaStore className="text-white" size={20} />
                    )}
                  </div>

                  {sellerProfile?.is_verified_seller && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <FaCheckCircle size={12} className="text-green-600" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 ">
                      {sellerProfile
                        ? `${sellerProfile.first_name} ${sellerProfile.last_name}`
                        : "Loading..."}
                    </p>
                    {sellerProfile?.is_verified_seller && (
                      <FaCrown size={14} className="text-yellow-400" />
                    )}
                  </div>

                  <p className="text-xs text-gray-700 ">
                    {sellerProfile?.is_verified_seller
                      ? "Verified Seller"
                      : "Seller"}
                  </p>
                </div>
              </div>

              <div className="text-2xl font-bold text-white">⇄</div>

              {/* Buyer */}
              <div className="flex items-center gap-3 bg-white backdrop-blur-sm px-4 py-3 rounded-xl min-w-[200px]">
                <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  {buyerProfile?.profile_picture ? (
                    <img
                      src={buyerProfile.profile_picture}
                      alt="Buyer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaShoppingCart className="text-white" size={20} />
                  )}
                </div>

                <div>
                  <p className="font-bold text-gray-800 ">
                    {buyerProfile
                      ? `${buyerProfile.first_name} ${buyerProfile.last_name}`
                      : "Loading..."}
                  </p>
                  <p className="text-xs text-gray-700">
                    {buyerProfile?.occupation || "Buyer"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "conversation"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("conversation")}
          >
            <FaUser className="inline mr-2" /> {t("conversation")}
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            <FaInfoCircle className="inline mr-2" /> {t("product_details")}
          </button>
        </div>

        {activeTab === "conversation" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Conversation Thread */}
            <div className="lg:col-span-2">
              {/* Price Comparison Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  {t("price_comparison")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Base Price */}
                  <div className="border rounded-xl p-4 text-center bg-gradient-to-b from-gray-50 to-white">
                    <div className="text-gray-500 text-sm mb-2 flex items-center justify-center gap-2">
                      <FaStore /> {t("original_price")}
                    </div>
                    <div className="text-2xl font-bold text-gray-700">
                      CAD {product.base_price}/{product.unit}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {t("latest_buyer_offer")}
                    </div>
                  </div>

                  {/* Buyer Latest Offer */}
                  <div className="border-2 border-blue-200 rounded-xl p-4 text-center bg-gradient-to-b from-blue-50 to-white">
                    <div className="text-sm mb-2 flex items-center justify-center gap-2">
                      <FaShoppingCart className="text-blue-600" />
                      <span className="text-blue-700">
                        {buyerProfile?.first_name}'s Offer
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {buyerLatestOffer
                        ? `CAD ${buyerLatestOffer.expected_price}/${product.unit}`
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Latest buyer offer
                    </div>
                  </div>

                  {/* Seller Latest Offer */}
                  <div className="border-2 border-green-200 rounded-xl p-4 text-center bg-gradient-to-b from-green-50 to-white">
                    <div className="text-sm mb-2 flex items-center justify-center gap-2">
                      <FaStore className="text-green-600" />
                      <span className="text-green-700">
                        {sellerProfile?.first_name}'s Offer
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {sellerLatestOffer
                        ? `CAD ${sellerLatestOffer.expected_price}/${product.unit}`
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {sellerProfile?.is_verified_seller ? (
                        <span className="flex items-center justify-center gap-1 text-green-600">
                          <FaCheckCircle /> Verified Seller
                        </span>
                      ) : (
                        "Seller Offer"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    {t("conversation_history")}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {negotiations.length} {t("messages")}
                  </span>
                </div>

                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 conversation-thread">
                  {negotiations.map((negotiation, index) => (
                    <div
                      key={negotiation.id}
                      className={`relative p-5 rounded-xl shadow-sm ${
                        negotiation.user === currentUserId
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 ml-2"
                          : "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 mr-2"
                      }`}
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      {/* Message Header with User Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* User Avatar with Role */}
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                                negotiation.user === currentUserId
                                  ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                                  : "bg-gradient-to-br from-green-500 to-emerald-600"
                              }`}
                            >
                              {negotiation.user === currentUserId ? (
                                <FaShoppingCart
                                  size={18}
                                  className="text-white"
                                />
                              ) : (
                                <FaStore size={18} className="text-white" />
                              )}
                            </div>
                            {negotiation.user !== currentUserId &&
                              isUserVerified(negotiation.user) && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                  <FaCheckCircle
                                    size={10}
                                    className="text-white"
                                  />
                                </div>
                              )}
                          </div>

                          {/* User Details */}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-bold text-lg ${
                                  negotiation.user === currentUserId
                                    ? "text-blue-700"
                                    : "text-green-700"
                                }`}
                              >
                                {getUserName(negotiation.user)}
                              </span>

                              {/* Role Badge */}
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                  negotiation.user === currentUserId
                                    ? "bg-blue-100 text-blue-800"
                                    : negotiation.user === sellerProfile?.id
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {negotiation.user === currentUserId
                                  ? "You"
                                  : getUserRole(negotiation.user)}
                              </span>

                              {/* Offer Type Badge */}
                              {negotiation.expected_price && (
                                <span className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium">
                                  {negotiation.expected_price}/
                                  {negotiation.unit}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <FaClock size={10} />
                              {formatDate(negotiation.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Message Status */}
                        <div className="flex items-center gap-2">
                          {getStatusBadge(latestNegotiation.negotiation.status)}
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="pl-14">
                        {negotiation.message && (
                          <div
                            className={`p-4 rounded-lg mb-4 ${
                              negotiation.user === currentUserId
                                ? "bg-white border border-blue-200 shadow-sm"
                                : "bg-white border border-green-200 shadow-sm"
                            }`}
                          >
                            <p className="text-gray-800 leading-relaxed">
                              {negotiation.message}
                            </p>
                          </div>
                        )}

                        {/* Offer Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {negotiation.expected_quantity > 0 && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                              <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                <FaWeight size={10} /> Quantity
                              </div>
                              <div className="font-medium text-lg">
                                {negotiation.expected_quantity}{" "}
                                {negotiation.unit}
                              </div>
                            </div>
                          )}

                          {/* In the conversation thread, inside the message content section (after offer details) */}

                          {
                            negotiation.location && (
                              <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                  <MapPin size={10} /> Delivery Location
                                </div>
                                <div className="font-medium text-sm">
                                  {negotiation.location.address},{" "}
                                  {negotiation.location.city},{" "}
                                  {negotiation.location.postal_code},{" "}
                                  {negotiation.location.country}
                                  {negotiation.location.is_primary && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      Primary
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                          {negotiation.expected_price && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                              <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                Price
                              </div>
                              <div className="font-medium text-lg text-green-600">
                                CAD {negotiation.expected_price}/
                                {negotiation.unit}
                              </div>
                            </div>
                          )}

                          {/* {negotiation.product_variety && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                              <div className="text-gray-500 text-xs mb-1">
                                Product Variety
                              </div>
                              <div className="font-medium">
                                {negotiation.product_variety}
                              </div>
                            </div>
                          )} */}

                          {negotiation.frequency_of_deliveries && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                              <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                                <FaTruck size={10} /> Delivery Frequency
                              </div>
                              <div className="font-medium">
                                {negotiation.frequency_of_deliveries}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Only show for latest message */}
                      {/* Action Buttons - Sirf pehle message (index 0) ke liye */}
                      {index === 0 && // ← YEH CONDITION ADD KARO
                        // negotiation.user !== currentUserId &&
                        negotiation.status === "Pending" &&
                        !isNegotiationFinalized() && (
                          <div className="mt-5 pt-4 border-t border-gray-200 pl-14">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleAutoFill(negotiation)}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                              >
                                <FaEdit /> {t("reply_offer")}
                              </button>

                              {/* Show Accept button only if this user hasn't accepted yet */}
                              {((currentUserId === buyerProfile?.id &&
                                !latestNegotiation.negotiation
                                  .buyer_accepted) ||
                                (currentUserId === sellerProfile?.id &&
                                  !latestNegotiation.negotiation
                                    .seller_accepted)) && (
                                <button
                                  onClick={() =>
                                    handleNegotiationAccept(
                                      latestNegotiation.negotiation.id,
                                    )
                                  }
                                  disabled={accepting}
                                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                  <FaCheckCircle />{" "}
                                  {accepting ? "Accepting..." : "Accept Offer"}
                                </button>
                              )}

                              <button
                                onClick={() => handleReject(negotiation.id)}
                                disabled={rejecting}
                                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50"
                              >
                                <FaTimesCircle />{" "}
                                {rejecting ? "Rejecting..." : "Reject Offer"}
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quantity Discounts */}
              {product.quantity_discounts &&
                product.quantity_discounts.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaPercentage className="text-purple-600" /> Quantity
                      Discounts
                    </h3>

                    <div className="space-y-3">
                      {product.quantity_discounts.map((discount, index) => {
                        const effectivePrice =
                          parseFloat(product.base_price) *
                          (1 - parseFloat(discount.discount_percentage) / 100);
                        const isRecommended = negotiations.some(
                          (n) =>
                            n.expected_quantity >= discount.min_quantity &&
                            n.expected_quantity <= discount.max_quantity,
                        );

                        return (
                          <div
                            key={discount.id}
                            className={`p-4 rounded-lg border ${
                              isRecommended
                                ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="font-bold text-gray-900">
                                  {discount.min_quantity} -{" "}
                                  {discount.max_quantity} {product.unit}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Shipping: {discount.shipping_charges}{" "}
                                  {product.currency}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  isRecommended
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {discount.discount_percentage}% OFF
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">
                                Effective price:
                              </span>
                              <span className="font-bold">
                                {effectivePrice.toFixed(2)} {product.currency}/
                                {product.unit}
                              </span>
                            </div>
                            {isRecommended && (
                              <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                                <FaStar /> Recommended based on current offers
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Quick Actions */}
              {!isFinalized && (
                <div className="bg-gradient-to-r from-secondary to-secondary rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (negotiations.length > 0) {
                          handleAutoFill(negotiations[0]); // Pehle message ke liye auto-fill
                          // handleAutoFill(negotiations[negotiations.length - 1]);
                        }
                      }}
                      className="w-full bg-white text-secondary px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Make Counter Offer
                    </button>

                    {/* {currentUserId === buyerProfile?.id && ( */}
                    <>
                      <button
                        onClick={() =>
                          handleNegotiationAccept(
                            latestNegotiation.negotiation.id,
                          )
                        }
                        disabled={accepting}
                        className="w-full bg-gradient-to-r from-primary to-primary text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md"
                      >
                        <FaCheckCircle />{" "}
                        {accepting ? "Accepting..." : "Accept Offer"}
                      </button>

                      <button
                        onClick={() =>
                          handleNegotiationReject(
                            latestNegotiation.negotiation.id,
                          )
                        }
                        disabled={rejecting}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md"
                      >
                        <FaTimesCircle />{" "}
                        {rejecting ? "Rejecting..." : "Reject Offer"}
                      </button>
                    </>
                    {/* )} */}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Product Details Tab */
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Product Image */}
              <div className="lg:w-1/3">
                <img
                  src={product.product_image || getDefaultImage(product.name)}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Category</div>
                    <div className="font-bold">{product.category}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Unit</div>
                    <div className="font-bold">{product.unit}</div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-6">{product.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Features */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900">
                      {t("product_features")}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            product.organic_certified
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <FaLeaf size={12} />
                        </div>
                        <span
                          className={
                            product.organic_certified
                              ? "text-green-700 font-medium"
                              : "text-gray-600"
                          }
                        >
                          Organic Certified:{" "}
                          {product.organic_certified ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            product.is_negotiable
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <FaTag size={12} />
                        </div>
                        <span
                          className={
                            product.is_negotiable
                              ? "text-blue-700 font-medium"
                              : "text-gray-600"
                          }
                        >
                          Negotiable: {product.is_negotiable ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            product.is_bulk_buying
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <FaWeight size={12} />
                        </div>
                        <span
                          className={
                            product.is_bulk_buying
                              ? "text-purple-700 font-medium"
                              : "text-gray-600"
                          }
                        >
                          Bulk Buying: {product.is_bulk_buying ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            product.is_preorder_produce
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <FaCalendarAlt size={12} />
                        </div>
                        <span
                          className={
                            product.is_preorder_produce
                              ? "text-yellow-700 font-medium"
                              : "text-gray-600"
                          }
                        >
                          Pre-order Available:{" "}
                          {product.is_preorder_produce ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900">
                      {t("pricing_information")}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Base Price</span>
                        <span className="font-bold text-lg">
                          {product.base_price} {product.currency}/{product.unit}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tax Included</span>
                        <span className="font-medium">
                          {product.hst_included ? "Yes" : "No"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Currency</span>
                        <span className="font-medium">{product.currency}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Product Status</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            product.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">
                    {t("additional_information")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">
                        Growing Session
                      </div>
                      <div className="font-medium">
                        {product.growing_session || "Not specified"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">
                        Product Availability
                      </div>
                      <div className="font-medium">
                        {product.product_availability || "Available"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">
                        Flexible Buying
                      </div>
                      <div className="font-medium">
                        {product.is_flexible_buying ? "Yes" : "No"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Top Products</div>
                      <div className="font-medium">
                        {product.is_top_products ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {t("make_counter_offer")}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("your_message")} *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    rows={3}
                    placeholder="Enter your negotiation message..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("expected_quantity")}*
                    </label>
                    <input
                      type="number"
                      value={formData.expected_quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expected_quantity: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                      <option value="piece">piece</option>
                      <option value="box">box</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("expected_price")} ({product.currency})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.expected_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expected_price: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Variety
                    </label>
                    <input
                      type="text"
                      value={formData.product_variety}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product_variety: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Type
                    </label>
                    <input
                      type="text"
                      value={formData.product_type}
                      disabled
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product_type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  {/* Grade Field - Replace input with dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    >
                      <option value="">Select Grade</option>
                      {gradeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Frequency
                    </label>
                    <select
                      value={formData.frequency_of_deliveries}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          frequency_of_deliveries: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  {/* Address Selection - Add this after delivery frequency field */}
                  {user?.roles === "BulkBuyer" && 
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="inline mr-1" size={14} /> Delivery
                      Location *
                    </label>

                    {addressesLoading ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        Loading addresses...
                      </div>
                    ) : (
                      <select
                        value={formData.location || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      >
                        <option value="">Select delivery address</option>
                        {addresses && addresses.length > 0 ? (
                          addresses.map((address) => (
                            <option key={address.id} value={address.id}>
                              {address.address}, {address.city},{" "}
                              {address.postal_code}, {address.country}
                              {address.is_primary ? " (Primary)" : ""}
                            </option>
                          ))
                        ) : (
                          <option disabled>
                            No addresses found. Please add an address first.
                          </option>
                        )}
                      </select>
                    )}

                    {/* Display selected address preview */}
                    {formData.location &&
                      addresses &&
                      (() => {
                        const selectedAddr = addresses.find(
                          (a) => a.id === formData.location,
                        );
                        return selectedAddr ? (
                          <div className="mt-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {selectedAddr.address}, {selectedAddr.city} -{" "}
                            {selectedAddr.postal_code}
                          </div>
                        ) : null;
                      })()}
                  </div>
}
                  {/* Delivery Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("delivery_start_date")}
                    </label>
                    <input
                      type="date"
                      name="delivery_start_date" // ← name attribute add karo
                      value={formData.delivery_start_date}
                      onChange={handleDateChange} // ← common handler use karo
                      min={getTodayDate()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  {/* Delivery End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("delivery_end_date")}
                    </label>
                    <input
                      type="date"
                      name="delivery_end_date" // ← name attribute add karo
                      value={formData.delivery_end_date}
                      onChange={handleDateChange} // ← common handler use karo
                      min={formData.delivery_start_date || getTodayDate()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  {/* Type-specific fields for Pre-Order Produce */}
                  {!harvestField && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Harvest Date
                        </label>
                        <input
                          type="date"
                          name="harvest_date" // ← name attribute add karo
                          value={formData.harvest_date}
                          onChange={handleDateChange} // ← common handler use karo
                          min={getTodayDate()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          name="expiry_date" // ← name attribute add karo
                          value={formData.expiry_date}
                          onChange={handleDateChange} // ← common handler use karo
                          min={formData.harvest_date || getTodayDate()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <FaPaperPlane />
                    {submitting ? "Submitting..." : t("send_counter_offer")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAgreementPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="text-green-600 text-4xl mb-4">
              <FaCheckCircle />
            </div>

            <h2 className="text-2xl font-bold mb-2">
              🎉 {t("congratulations")}!
            </h2>

            <p className="text-gray-600 mb-6">
              The negotiation has been successfully accepted. You can now
              proceed to generate the agreement.
            </p>

            <button
              onClick={handleGoToAgreement}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
            >
              {t("go_to_agreement")}
            </button>
          </div>
        </div>
      )}

      {showAcceptancePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              {/* Icon based on type */}
              <div
                className={`text-4xl mb-4 ${
                  showAcceptancePopup.type === "buyer"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {showAcceptancePopup.type === "buyer" ? (
                  <FaShoppingCart />
                ) : (
                  <FaStore />
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {showAcceptancePopup.type === "buyer"
                  ? "Buyer Accepted!"
                  : "Seller Accepted!"}
              </h2>

              <p className="text-gray-600 mb-6">
                {showAcceptancePopup.message}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (showAcceptancePopup.type === "buyer") {
                      // If buyer accepted and current user is seller, show seller accept button
                      handleNegotiationAccept(latestNegotiation.negotiation.id);
                    } else {
                      // If seller accepted and current user is buyer, show buyer accept button
                      handleNegotiationAccept(latestNegotiation.negotiation.id);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
                >
                  Accept Now
                </button>

                <button
                  onClick={() => setShowAcceptancePopup(null)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Later
                </button>
              </div>

              {/* Optional: Show counter offer button */}
              <button
                onClick={() => {
                  setShowAcceptancePopup(null);
                  if (negotiations.length > 0) {
                    handleAutoFill(negotiations[negotiations.length - 1]);
                  }
                }}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Make Counter Offer Instead
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .conversation-thread::-webkit-scrollbar {
          width: 6px;
        }
        
        .conversation-thread::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .conversation-thread::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .conversation-thread::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default NegotiationDetails;
