import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
    LayoutDashboard,
    History,
    Heart,
    ShoppingCart,
    Settings,
    User,
    CreditCard,
    Package,
    LogOut,
    ChevronLeft,
    ChevronRight,
    X,
    Menu,
    Bell,
    Search,
    DollarSign,
    TrendingUp,
    Calendar,
} from "lucide-react";
import OrderHistoryTable from "./OrderHistoryTable";
import Setting from "./Setting";
import LogoutButton from "../../components/LogoutButton";
import Wishlist from "../../components/Wishlist";
import Cart from "../../pages/Cart";
import ProfileCard from "./ProfileCard";
import BillingCard from "./BillingCard";
import { RootState } from "../../app/store";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { getOrder } from "../../features/order/orderThunk";
import { getCart } from "../../features/cart/cartThunk";
import { fetchWishlist } from "../../features/wishlist/wishlistThunk";
import { useTranslation } from "react-i18next";

// ====================== SIDEBAR COMPONENT ======================
interface SidebarProps {
    active: string;
    setActive: (item: string) => void;
    isOpen: boolean;
    toggleSidebar: () => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    user: any;
    orderCount: number;
    wishlistCount: number;
    cartCount: number;
}

const SidebarNavigation: React.FC<SidebarProps> = ({
    active,
    setActive,
    isOpen,
    toggleSidebar,
    isCollapsed,
    toggleCollapse,
    user,
    orderCount,
    wishlistCount,
    cartCount,
}) => {
    const { t } = useTranslation();
   const menuItems = [
  { name: t("dashboard"), icon: <LayoutDashboard size={20} /> },
  { name: t("order_history"), icon: <History size={20} />, badge: orderCount },
  { name: t("wishlist"), icon: <Heart size={20} />, badge: wishlistCount },
  { name: t("shopping_cart"), icon: <ShoppingCart size={20} />, badge: cartCount },
  { name: t("settings"), icon: <Settings size={20} /> },
];

   const quickActions = [
  { name: t("profile"), icon: <User size={16} /> },
  { name: t("billing"), icon: <CreditCard size={16} /> },
];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed md:relative inset-y-0 left-0 
                    h-screen
                    bg-gradient-to-b from-white to-gray-50
                    border-r border-gray-200
                    shadow-xl md:shadow-lg
                    transform transition-all duration-300 ease-in-out
                    flex flex-col
                    ${isOpen ? "translate-x-0 z-50" : "-translate-x-full md:translate-x-0"}
                    ${isCollapsed ? "w-20" : "w-64"}
                `}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                        {!isCollapsed && (
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <LayoutDashboard size={20} className="text-white" />
                                </div>
                                <span className="ml-3 text-lg font-bold text-gray-800">{t("dashboard")}</span>
                            </div>
                        )}
                        
                        {/* Desktop collapse button */}
                        <button
                            onClick={toggleCollapse}
                            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                            title={isCollapsed ? "Expand" : "Collapse"}
                        >
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="p-4 border-b border-gray-100">
                    <div className={`flex ${isCollapsed ? "justify-center" : "items-center space-x-3"}`}>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-blue-100 overflow-hidden border-2 border-white shadow-sm">
                                <div className="w-full h-full flex items-center justify-center">
                                    <User size={20} className="text-green-600" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        
                        {!isCollapsed && user && (
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 truncate">
                                    {user.first_name} {user.last_name}
                                </h3>
                                <p className="text-sm text-gray-500 truncate capitalize">{user.roles}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = active === item.name;
                            return (
                                <div
                                    key={item.name}
                                    className={`
                                        relative group
                                        ${isCollapsed ? "flex justify-center" : ""}
                                    `}
                                >
                                    <button
                                        onClick={() => setActive(item.name)}
                                        className={`
                                            w-full flex items-center ${isCollapsed ? "justify-center px-3" : "px-4"}
                                            py-3 rounded-xl transition-all duration-200
                                            ${isActive
                                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm"
                                                : "hover:bg-gray-50 hover:border hover:border-gray-100"
                                            }
                                        `}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        <div className="relative">
                                            <div className={`
                                                transition-colors
                                                ${isActive ? "text-green-600" : "text-gray-500 group-hover:text-green-600"}
                                            `}>
                                                {item.icon}
                                            </div>
                                            {item.badge && item.badge > 0 && (
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {!isCollapsed && (
                                            <>
                                                <span className={`
                                                    ml-3 font-medium
                                                    ${isActive ? "text-green-700" : "text-gray-700"}
                                                `}>
                                                    {item.name}
                                                </span>
                                                
                                                {isActive && (
                                                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                )}
                                            </>
                                        )}
                                    </button>
                                    
                                    {/* Active indicator */}
                                    {isActive && !isCollapsed && (
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-green-500 rounded-r-md"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    {!isCollapsed && (
                        <div className="mt-8">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                                {t("quick_actions")}
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.name}
                                        className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        onClick={() => setActive(action.name)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                            {action.icon}
                                        </div>
                                        <span className="text-xs text-gray-600">{action.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    {isCollapsed ? (
                        <div className="flex justify-center">
                            <button className="p-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 text-red-600 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <Bell size={16} className="text-green-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700">Notifications</p>
                                        <p className="text-xs text-gray-500">3 unread</p>
                                    </div>
                                </div>
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div> */}
                            
                            <LogoutButton
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 text-red-700 font-medium transition-all duration-200 flex items-center justify-center"
                                iconClassName="mr-2"
                            />
                        </div>
                    )}
                    
                    {!isCollapsed && (
                        <p className="text-xs text-gray-500 text-center mt-4">
                            © {new Date().getFullYear()} EcoFlare Dashboard v1.0
                        </p>
                    )}
                </div>

                {/* Mobile close button */}
                <button
                    className="absolute top-4 right-4 md:hidden w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
                    onClick={toggleSidebar}
                >
                    <X size={18} />
                </button>
            </div>
        </>
    );
};

// ====================== STATS CARD COMPONENT ======================
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, subtitle }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            {/* {trend && (
                <div className="mt-4">
                    <div className="flex items-center text-sm text-green-600">
                        <TrendingUp size={14} />
                        <span className="ml-1">{trend}</span>
                        <span className="ml-2 text-gray-500">from last month</span>
                    </div>
                </div>
            )} */}
        </div>
    );
};





// ====================== MAIN DASHBOARD COMPONENT ======================
const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
        const { t } = useTranslation();
    
    // State
    const [active, setActive] = React.useState<string>("Dashboard");
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);

    // Redux Data
    const { user } = useSelector((state: RootState) => state.auth);
    const orderData = useSelector((state: RootState) => state.order?.order?.data || []);
    const cartData = useSelector((state: RootState) => state.cart?.items || []);
    const wishlistData = useSelector((state: RootState) => state.wishlist?.items || []);
    
    // Calculate stats
    const orderCount = Array.isArray(orderData) ? orderData.length : 0;
    const cartCount = Array.isArray(cartData) ? cartData.length : 0;
    const wishlistCount = Array.isArray(wishlistData) ? wishlistData.length : 0;
    
    // Calculate total spent
    const totalSpent = Array.isArray(orderData) 
        ? orderData.reduce((sum: number, item: any) => {
            const amount = parseFloat(item.item_payment_amount || item.total_price || 0);
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0)
        : 0;

    // Calculate cart total
    const cartTotal = Array.isArray(cartData)
        ? cartData.reduce((sum: number, item: any) => {
            const amount = parseFloat(item.final_price || 0);
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0)
        : 0;

    // Get latest order
    const latestOrder = Array.isArray(orderData) && orderData.length > 0 
        ? orderData[0]
        : null;

    // Fetch initial data
    useEffect(() => {
        dispatch(getOrder());
        dispatch(getCart());
        dispatch(fetchWishlist());
    }, [dispatch]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const closeModal = () => setSelectedOrder(null);

    // Render content based on active tab
    const renderContent = () => {

        const contentMap = {
            "Dashboard": (
                <div className="space-y-6 animate-fadeIn">
                    {/* Welcome Header */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {t("welcome_back", { name: user?.first_name || "User" })}
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    {t("dashboard_summary")}
                                </p>
                                <div className="flex items-center gap-2 mt-3 text-sm">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                        {user?.roles || "Buyer"}
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-600">{user?.email}</span>
                                </div>
                            </div>
                            {/* <div className="mt-4 md:mt-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search dashboard..."
                                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                           title={t("total_orders")}
                            value={orderCount}
                            icon={<ShoppingCart size={24} className="text-blue-600" />}
                            color="bg-blue-100"
                            trend="↑ 12%"
                        />
                        
                        <StatCard
                            title={t("wishlist_items")}
                            value={wishlistCount}
                            icon={<Heart size={24} className="text-pink-600" />}
                            color="bg-pink-100"
                            trend="↑ 5%"
                        />
                        
                        <StatCard
                            title={t("cart_items")}
                            value={cartCount}
                            icon={<ShoppingCart size={24} className="text-orange-600" />}
                            color="bg-orange-100"
                            trend="↑ 8%"
                            subtitle={`Total: $${cartTotal.toFixed(2)}`}
                        />
                        
                        <StatCard
                            title={t("total_spent")}
                            value={`CAD ${totalSpent.toFixed(2)}`}
                            icon={<DollarSign size={24} className="text-green-600" />}
                            color="bg-green-100"
                            trend="↑ 15%"
                        />
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <ProfileCard />
                            
                            {/* Latest Order Summary */}
                            {latestOrder && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Package size={18} />
                                        {t("latest_order")}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-700">
                                                    Order #{latestOrder.sub_order_number}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {latestOrder.product?.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">
                                                    CAD {parseFloat(latestOrder.item_payment_amount || latestOrder.total_price || 0).toFixed(2)}
                                                </p>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                    latestOrder.item_order_status === 'Confirmed' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {latestOrder.item_order_status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 p-3 rounded">
                                            <div>
                                                <span className="text-gray-600">{t("quantity")}:</span>
                                                <span className="font-medium ml-2">{latestOrder.quantity}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">{t("order_date")}:</span>
                                                <span className="font-medium ml-2">
                                                    {new Date(latestOrder.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">{t("status")}:</span>
                                                <span className="font-medium ml-2">{latestOrder.item_payment_status}</span>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => setActive("Order History")}
                                            className="w-full py-2 text-center text-green-600 hover:text-green-800 font-medium border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                                        >
                                           {t("view_all_orders")} →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-6">
                            <BillingCard />
                        </div>
                    </div>

                    {/* Monthly Summary */}
                    {/* <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">Monthly Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-blue-600" size={20} />
                                    <div>
                                        <p className="text-sm text-blue-800">This Month</p>
                                        <p className="text-xl font-bold text-blue-900">3 Orders</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="text-green-600" size={20} />
                                    <div>
                                        <p className="text-sm text-green-800">Total Spent</p>
                                        <p className="text-xl font-bold text-green-900">${totalSpent.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="text-purple-600" size={20} />
                                    <div>
                                        <p className="text-sm text-purple-800">Avg. Order Value</p>
                                        <p className="text-xl font-bold text-purple-900">
                                            ${orderCount > 0 ? (totalSpent / orderCount).toFixed(2) : "0.00"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            ),
            "Order History": <OrderHistoryTable />,
            "Wishlist": <Wishlist />,
            "Shopping Cart": <Cart />,
            "Settings": <Setting />,
            "Profile": <ProfileCard />,
            "Billing": <BillingCard />,
        };

        return contentMap[active as keyof typeof contentMap] || null;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar for Mobile */}
            <div className="md:hidden bg-white shadow-sm p-4 border-b">
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">{t("dashboard")}</h1>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100">
                            <Bell size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex">
                {/* Sidebar */}
                <SidebarNavigation
                    active={active}
                    setActive={setActive}
                    isOpen={isOpen}
                    toggleSidebar={toggleSidebar}
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                    user={user}
                    orderCount={orderCount}
                    wishlistCount={wishlistCount}
                    cartCount={cartCount}
                />

                {/* Main Content */}
                <main className={`
                    flex-1 transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'md:ml-20' : 'md:ml-1'}
                    min-h-screen
                `}>
                    <div className="p-4 md:p-6 lg:p-8">
                        {/* Breadcrumb for non-Dashboard pages */}
                        {active !== "Dashboard" && (
                            <div className="mb-6">
                                <div className="flex items-center text-sm text-gray-500">
                                    <button
                                        onClick={() => setActive("Dashboard")}
                                        className="hover:text-green-600 transition-colors"
                                    >
                                        {t("dashboard")}
                                    </button>
                                    <ChevronRight size={16} className="mx-2" />
                                    <span className="font-medium text-gray-700">{active}</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800 mt-2">{active}</h1>
                            </div>
                        )}

                        {/* Content */}
                        <div className="bg-white max-h-[calc(100vh-170px)] overflow-hidden overflow-y-auto rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
                            {renderContent()}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-center text-sm text-gray-500">
                            <p>{t("support_contact")}</p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add CSS for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;