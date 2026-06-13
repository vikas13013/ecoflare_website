import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState, lazy, Suspense } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-loading-skeleton/dist/skeleton.css";

// Components (not lazy-loaded)
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import VegetableLoader from "./components/VegetableLoader";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProfileHeader from "./pages/profileDashboard/ProfileHeader";
import BulkBuyerRegisterPage from "./Model/BulkBuyerRegisterPage";
import BuyerRequestsList from "./Dashboard/buyerSeller/BuyerRequestsList ";
import BuyerRequestDetails from "./Dashboard/buyer/components/BuyerRequestDetail";
import NegotiationDetails from "./Dashboard/buyerSeller/NegotiationDetails";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./Model/AuthPage"));
const About = lazy(() => import("./pages/About"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const MaintenancePage = lazy(() => import("./pages/MaintenancePage"));
const BlogDetails = lazy(() => import("./pages/BlogDetailsPage"));
const BuyersPage = lazy(() => import("./pages/BuyersPage"));
const SellerPage = lazy(() => import("./pages/SellerPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PricewiseLanding = lazy(() => import("./pages/PricewiseLanding"));
const BuyerDashboard = lazy(() => import("./Dashboard/buyer/BuyerDashboard"));
const Request = lazy(() => import("./components/ReviewRequest/Request"));
const PreOrderProduce = lazy(() => import("./pages/PreOrderProduce"));
const FlexibleBuying = lazy(() => import("./pages/FlexibleBuying"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TimePicker = lazy(() => import("./components/ReviewRequest/BookingTimePicker"));
const Gallery = lazy(() => import("./pages/newPages/Gallery"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductCategoryPage = lazy(() => import("./pages/products/ProductCategoryPage"));
const BranchPendingApproval = lazy(() => import("./Model/BranchPendingApproval"));
const UpdateBranchPage = lazy(() => import("./Model/UpdateBranchPage"));
const BranchDetailsPage = lazy(() => import("./Model/BranchDetailsPage"));
const RequestSuccess = lazy(() => import("./Dashboard/seller/RequestSuccess"));
const Wishlist = lazy(() => import("./components/Wishlist"));

// Buyer Pages
const OrderHistoryTable = lazy(() => import("./Dashboard/user/OrderHistoryTable"));

// Seller Dashboard Pages
const SellerDashboard = lazy(() => import("./Dashboard/seller/SellerDashboard"));
const InventoryDetailsPage = lazy(() => import("./Dashboard/seller/InventoryDetailsPage"));
const ManageInventoryPage = lazy(() => import("./Dashboard/seller/ManageInventoryPage"));
const AddProductPage = lazy(() => import("./Dashboard/seller/AddProductPage"));
const ProductTable = lazy(() => import("./Dashboard/seller/ProductTable"));
const EditProductPage = lazy(() => import("./Dashboard/seller/EditProductPage"));
const ProductDetailsPage = lazy(() => import("./Dashboard/seller/ProductDetailsPage"));
const QuoteRequests = lazy(() => import("./Dashboard/seller/QuoteRequests"));
const SubmitQuote  = lazy(() => import("./Dashboard/seller/SubmitQuote"));
const NegotiateTerms = lazy(() => import("./Dashboard/seller/pages/NegotiateTerms"));
const AllOrdersPage = lazy(() => import("./Dashboard/seller/AllOrdersPage"));
const OrderDetailsPage = lazy(() => import("./Dashboard/seller/OrderDetailsPage"));
const ProfileDashboard = lazy(() => import("./pages/profileDashboard/ProfileDashboard"));
const Pricing = lazy(() => import("./pages/profileDashboard/Pricing"));
const RegisterSeller = lazy(() => import("./Model/RegisterSeller"));
const RegisterBranch = lazy(() => import("./Model/RegisterBranchPage"));
const BranchListPage = lazy(() => import("./Model/BranchListPage"));

// buyer  seller 
const AgreementSuccess = lazy(() => import("./Dashboard/buyerSeller/AgreementSuccess"));
const TransactionDetails = lazy(() => import("./Dashboard/buyerSeller/TransactionDetails"));
const TransactionList = lazy(() => import("./Dashboard/buyerSeller/TransactionList"));

// user routes
const ChangePasswordPage = lazy(() => import("./Model/ChangePasswordPage"));
const AddressPage = lazy(() => import("./pages/address/AddressPage"));
const ProductDetails = lazy(() => import("./pages/products/ProductDetails"));
// user dashboard
const UserDashboard = lazy(() => import("./Dashboard/user/UserHomePage"));
const Checkout = lazy(() => import("./pages/Checkout"));

// Layout component
const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  const showNavbar =
    path === "/dashboard" ||
    path === "/marketplace" ||
    path === "/userdashboard" ||
    path === "/profiledashboard" ||
    path === "/cart" ||
    path === "/wishlist" ||
    path === "/request-produce" ||
    path.startsWith("/product/") ||
    path.startsWith("/marketplace/") ||
    path.startsWith("/products/") ||
    path.startsWith("/profiledashboard/") ||
    path.startsWith("/profiledashboard/") ||
    path.startsWith("/seller/") ||
    path.startsWith("/dashboard/");

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar ? <Navbar /> : <Header />}

      <main className="flex-grow">
        <Suspense fallback={<VegetableLoader />}>
          <Routes>

            {/* user publick routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            {/* <Route path="/register" element={<ComingSoon />} />
            <Route path="/login" element={<ComingSoon />} /> */}
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/preorderproduce" element={<PreOrderProduce />} />
            <Route path="/flexiblebuying" element={<FlexibleBuying />} />
            <Route path="/pricewise" element={<PricewiseLanding />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/seller" element={<SellerPage />} />
            <Route path="/buyer" element={<BuyersPage />} />
            <Route path="/marketplace" element={<ProductCategoryPage />} />
            <Route path="/products/details/:id" element={<ProductDetails />} />
            <Route path="/termsandconditions" element={<TermsAndConditions />} />
            <Route path="/request-success" element={<RequestSuccess />} />


            {/* user publick routes end here */}



            {/* user Routes protected routes */}
            <Route
              path="/register/bulk-buyer"
              element={
                <ProtectedRoute allowedRoles={["Buyer"]}>
                  <BulkBuyerRegisterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/orders"
              element={
                <ProtectedRoute allowedRoles={["Buyer","BulkBuyer"]}>
                  <OrderHistoryTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userdashboard"
              element={
                <ProtectedRoute allowedRoles={["Buyer"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="addressmanagement" element={<AddressPage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
              <Route index element={<ProfileHeader />} />
            </Route>
            <Route
              path="/profile/address"
              element={
                <ProtectedRoute>
                  <AddressPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={["Buyer"]}>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["Buyer", "BulkBuyer"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register/seller"
              element={
                <ProtectedRoute allowedRoles={["Buyer"]}>
                  <RegisterSeller />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-branch"
              element={
                <ProtectedRoute allowedRoles={["Buyer"]}>
                  <RegisterBranch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/pending-approval"
              element={
                <ProtectedRoute allowedRoles={["Buyer"]}>
                  <BranchPendingApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute allowedRoles={["Buyer", "BulkBuyer"]}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["Buyer", "BulkBuyer"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            

            {/* user protected Route end here */}

            {/* Protected Buyer Routes */}
            <Route
              path="/dashboard/buyer"
              element={
                <ProtectedRoute allowedRoles={["BulkBuyer"]}>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />
            {/* ye form hai jab negotiation first time create hota hai  */}

            <Route
              path="/negotiation-request"
              element={
                <ProtectedRoute allowedRoles={["BulkBuyer"]}>
                  <Request />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buyer/requests"
              element={
                <ProtectedRoute allowedRoles={["BulkBuyer"]}>
                  <BuyerRequestsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buyer/negotiation/:id"
              element={
                <ProtectedRoute allowedRoles={["BulkBuyer","seller"]}>
                  <NegotiationDetails />
                </ProtectedRoute>
              }
            />


            <Route
              path="/request/timepicker"
              element={
                <ProtectedRoute allowedRoles={["BulkBuyer"]}>
                  <TimePicker />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/buyer/requests"
              element={
                <ProtectedRoute allowedRoles={["BulkBuyer"]}>
                  <BuyerRequestsList  />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/buyer/request/:id"
              element={
                <ProtectedRoute allowedRoles={["BulkBuyer"]}>
                  <BuyerRequestDetails  />
                </ProtectedRoute>
              }
            />


            {/* Protected Buyer Routes End */}


            {/* Protected Seller Dashboard Routes */}
            <Route
              path="/dashboard/seller"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/branches"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <BranchListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch-details/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <BranchDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-branch/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <UpdateBranchPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/seller/add-product"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <AddProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <ProductTable />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/inventory/details/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <InventoryDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/inventory/manage/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <ManageInventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <EditProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products/details/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <ProductDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/orders"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <AllOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/orders/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller/requests"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <BuyerRequestsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/requests/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <NegotiateTerms  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/requests/submit/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SubmitQuote  />
                </ProtectedRoute>
              }
            />

            {/* Protected Seller Dashboard Routes end */}

            {/* protected buyer seller route */}

            <Route
              path="/agreement-success"
              element={
                <ProtectedRoute allowedRoles={["seller", "BulkBuyer"]}>
                  <AgreementSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transaction/:transactionId"
              element={
                <ProtectedRoute allowedRoles={["seller", "BulkBuyer"]}>
                  <TransactionDetails />
                </ProtectedRoute>
              }
            />

              <Route
                path="/transactions"
                element={
                  <ProtectedRoute allowedRoles={["seller", "BulkBuyer"]}>
                    <TransactionList />
                  </ProtectedRoute>
                }
              />

            {/* Protected Buyer Seller Routes end  */}


            <Route
              path="/profiledashboard"
              element={
                <ProtectedRoute allowedRoles={["BulkBuyer", "seller"]}>
                  <ProfileDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="addressmanagement" element={<AddressPage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
              <Route path="subscription" element={<Pricing />} />
              <Route index element={<ProfileHeader />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

// App Root Component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000); // Optional preloader
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ToastContainer />
        {isLoading ? <VegetableLoader /> : <Layout />}
      </Router>
    </AuthProvider>
  );
};

export default App;
