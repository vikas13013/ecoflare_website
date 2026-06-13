import { Routes, Route } from "react-router-dom";
import Login from "../pages/LoginForm";
// import Register from "../pages/Register";
import Dashboard from "../Dashboard/buyer/BuyerDashboard";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import About from "../pages/About";
// import Marketplace from "../pages/Marketplace";
import ProductDetail from "@/pages/ProductDetail";
import ProductCategoryPage from "@/pages/products/ProductCategoryPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/about" element={<About />} />
    {/* <Route path="/marketplace" element={<Marketplace/>} /> */}
    <Route path="/product-details" element={<ProductDetail />} />

    {/* <Route path="/register" element={<Register />} /> */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/marketplace"
      element={
        <ProtectedRoute allowedRoles={["Buyer"]}>
          <ProductCategoryPage />
        </ProtectedRoute>
      }
    />

  </Routes>
);

export default AppRoutes;
