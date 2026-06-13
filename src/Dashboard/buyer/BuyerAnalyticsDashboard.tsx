import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Package,
  ShoppingCart, CreditCard, BarChart2, PieChart as PieChartIcon,
  Calendar, Download, Filter, RefreshCw,
  Award, Star, TrendingUp as TrendingUpIcon,
  Clock, CheckCircle, XCircle, Percent,
  ArrowUpRight, ArrowDownRight, MapPin,
  Truck, Shield, Award as AwardIcon, Wallet,
  BadgeDollarSign, Landmark, IndianRupee
} from 'lucide-react';
import { analyticsService, BuyerAnalyticsData } from '../../services/analyticsService';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

// Currency formatter for CAD
const formatCurrency = (amount: number) => {
  if (amount === undefined || amount === null) return 'CAD 0.00';
  return `CAD ${amount.toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Number formatter with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-CA').format(num);
};

// Format percentage
const formatPercent = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const BuyerAnalyticsDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('accessToken');
  
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<BuyerAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<'spending' | 'products' | 'categories'>('spending');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Enhanced color palette
  const colors = {
    primary: {
      light: '#d1fae5',
      DEFAULT: '#10b981',
      dark: '#059669',
      gradient: 'from-emerald-500 to-teal-500'
    },
    secondary: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
      gradient: 'from-blue-500 to-indigo-500'
    },
    accent: {
      light: '#ede9fe',
      DEFAULT: '#8b5cf6',
      dark: '#7c3aed',
      gradient: 'from-purple-500 to-pink-500'
    },
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    dark: '#1f2937',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  };

  const chartColors = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', 
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#a855f7'
  ];

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyticsService.getBuyerAnalytics(year, token);
      console.log("Buyer Analytics:", result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare monthly spending data
  const getMonthlySpendingData = () => {
    if (!data) return [];
    
    return data.data.monthly_breakdown.map(month => ({
      name: month.month_name.substring(0, 3),
      fullName: month.month_name,
      month: month.month,
      spent: month.spending_summary.total_spent,
      orders: month.spending_summary.total_orders,
      quantity: month.spending_summary.total_quantity_purchased,
      shipping: month.spending_summary.total_shipping_paid,
      avgOrderValue: month.spending_summary.average_order_value
    }));
  };

  // Prepare purchased products data
  const getPurchasedProductsData = () => {
    if (!data) return [];
    
    const productMap = new Map();
    
    data.data.monthly_breakdown.forEach(month => {
      month.products_purchased.forEach(product => {
        if (!product.product_id) return;
        
        const key = product.product_id;
        const existing = productMap.get(key) || {
          name: product.product_name,
          category: product.category,
          amount: 0,
          quantity: 0,
          orders: 0
        };
        
        existing.amount += product.amount_spent;
        existing.quantity += product.quantity_purchased;
        existing.orders += product.orders;
        
        productMap.set(key, existing);
      });
    });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  // Prepare category spending data
  const getCategoryData = () => {
    if (!data) return [];
    
    const categoryMap = new Map();
    
    data.data.monthly_breakdown.forEach(month => {
      month.products_purchased.forEach(product => {
        if (!product.category) return;
        
        const existing = categoryMap.get(product.category) || {
          name: product.category,
          amount: 0,
          orders: 0
        };
        
        existing.amount += product.amount_spent;
        existing.orders += product.orders || 0;
        
        categoryMap.set(product.category, existing);
      });
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);
  };

  // Calculate savings from shipping
  const calculateShippingSavings = () => {
    if (!data) return 0;
    
    return data.data.monthly_breakdown.reduce((sum, month) => {
      const freeShippingThreshold = 100; // Assuming free shipping over $100
      const potentialShipping = month.spending_summary.total_orders * 10; // Assuming $10 shipping per order
      return sum + (potentialShipping - month.spending_summary.total_shipping_paid);
    }, 0);
  };

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (!data) return 0;
    
    const monthlyData = data.data.monthly_breakdown;
    if (monthlyData.length < 2) return 0;
    
    const currentSpent = monthlyData[0]?.spending_summary.total_spent || 0;
    const previousSpent = monthlyData[1]?.spending_summary.total_spent || 0;
    
    if (previousSpent === 0) return currentSpent > 0 ? 100 : 0;
    
    return ((currentSpent - previousSpent) / previousSpent) * 100;
  };

  // Get selected month data
  const getSelectedMonthData = () => {
    if (!selectedMonth || !data) return null;
    
    return data.data.monthly_breakdown.find(month => month.month === selectedMonth);
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!data) return { totalProducts: 0, uniqueProducts: 0 };
    
    const uniqueProducts = new Set();
    data.data.monthly_breakdown.forEach(month => {
      month.products_purchased.forEach(product => {
        if (product.product_id) uniqueProducts.add(product.product_id);
      });
    });
    
    return {
      totalProducts: data.data.yearly_summary.total_quantity_purchased,
      uniqueProducts: uniqueProducts.size
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <RefreshCw className="w-8 h-8 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading your purchase analytics...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your spending insights</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Analytics</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={fetchData}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const monthlySpendingData = getMonthlySpendingData();
  const purchasedProductsData = getPurchasedProductsData();
  const categoryData = getCategoryData();
  const selectedMonthData = getSelectedMonthData();
  const growth = calculateGrowth();
  const shippingSavings = calculateShippingSavings();
  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Purchase Analytics
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  {user?.first_name || 'Your Purchases'} • Year {year}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-emerald-500 transition-colors" />
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/50 backdrop-blur-sm hover:bg-white transition-all appearance-none cursor-pointer"
                >
                  {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y} className="bg-white">{y}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={fetchData}
                className="p-2.5 border border-gray-200 rounded-xl hover:bg-white hover:border-emerald-500 hover:text-emerald-600 transition-all group"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards with Enhanced UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Spent */}
          <div 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-emerald-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredCard('spent')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data ? formatCurrency(data.data.yearly_summary.total_spent) : 'CAD 0.00'}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    growth >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{formatPercent(growth)}</span>
                  </div>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                hoveredCard === 'spent' ? 'from-emerald-500 to-teal-500 scale-110' : 'from-emerald-100 to-teal-100'
              } flex items-center justify-center transition-all duration-300`}>
                <BadgeDollarSign className={`w-6 h-6 ${
                  hoveredCard === 'spent' ? 'text-white' : 'text-emerald-600'
                } transition-colors`} />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-blue-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredCard('orders')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(data?.data.yearly_summary.total_orders || 0)}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    <ShoppingCart className="w-3 h-3" />
                    <span>{data && data.data.yearly_summary.total_spent > 0 
                      ? formatCurrency(data.data.yearly_summary.total_spent / data.data.yearly_summary.total_orders)
                      : 'CAD 0.00'
                    }</span>
                  </div>
                  <span className="text-xs text-gray-500">avg/order</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                hoveredCard === 'orders' ? 'from-blue-500 to-indigo-500 scale-110' : 'from-blue-100 to-indigo-100'
              } flex items-center justify-center transition-all duration-300`}>
                <ShoppingCart className={`w-6 h-6 ${
                  hoveredCard === 'orders' ? 'text-white' : 'text-blue-600'
                } transition-colors`} />
              </div>
            </div>
          </div>

          {/* Quantity Purchased */}
          <div 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-purple-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredCard('quantity')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity Purchased</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(data?.data.yearly_summary.total_quantity_purchased || 0)}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    <Package className="w-3 h-3" />
                    <span>{totals.uniqueProducts} unique</span>
                  </div>
                  <span className="text-xs text-gray-500">products</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                hoveredCard === 'quantity' ? 'from-purple-500 to-pink-500 scale-110' : 'from-purple-100 to-pink-100'
              } flex items-center justify-center transition-all duration-300`}>
                <Package className={`w-6 h-6 ${
                  hoveredCard === 'quantity' ? 'text-white' : 'text-purple-600'
                } transition-colors`} />
              </div>
            </div>
          </div>

          {/* Shipping Savings */}
          <div 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-yellow-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredCard('shipping')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Shipping Savings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(shippingSavings)}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    <Truck className="w-3 h-3" />
                    <span>Free Shipping</span>
                  </div>
                  <span className="text-xs text-gray-500">benefits</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                hoveredCard === 'shipping' ? 'from-yellow-500 to-amber-500 scale-110' : 'from-yellow-100 to-amber-100'
              } flex items-center justify-center transition-all duration-300`}>
                <Truck className={`w-6 h-6 ${
                  hoveredCard === 'shipping' ? 'text-white' : 'text-yellow-600'
                } transition-colors`} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section with Enhanced UI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  {activeChart === 'spending' && <DollarSign className="w-5 h-5 text-white" />}
                  {activeChart === 'products' && <Package className="w-5 h-5 text-white" />}
                  {activeChart === 'categories' && <BarChart2 className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeChart === 'spending' && 'Monthly Spending Analysis'}
                    {activeChart === 'products' && 'Top Products by Spend'}
                    {activeChart === 'categories' && 'Category Distribution'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {activeChart === 'spending' && 'Your spending pattern over time'}
                    {activeChart === 'products' && 'Products you spend the most on'}
                    {activeChart === 'categories' && 'Spending by category'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3 sm:mt-0 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveChart('spending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeChart === 'spending'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Spending
                </button>
                <button
                  onClick={() => setActiveChart('products')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeChart === 'products'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveChart('categories')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeChart === 'categories'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Categories
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'spending' ? (
                  <ComposedChart data={monthlySpendingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `CAD ${(value/1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'spent') return [formatCurrency(value), 'Amount Spent'];
                        if (name === 'shipping') return [formatCurrency(value), 'Shipping'];
                        if (name === 'avgOrderValue') return [formatCurrency(value), 'Avg Order'];
                        return [formatNumber(value), name];
                      }}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="spent"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="Amount Spent"
                      barSize={30}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#3b82f6' }}
                      name="Number of Orders"
                    />
                  </ComposedChart>
                ) : activeChart === 'products' ? (
                  <BarChart data={purchasedProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `CAD ${(value/1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'amount') return [formatCurrency(value), 'Amount Spent'];
                        if (name === 'quantity') return [formatNumber(value), 'Quantity'];
                        return [value, name];
                      }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="amount"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="Amount Spent"
                      barSize={30}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="quantity"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Quantity"
                      barSize={30}
                    />
                  </BarChart>
                ) : (
                  <RadarChart outerRadius={90} data={categoryData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 'dataMax']}
                      tickFormatter={(value) => `CAD ${(value/1000).toFixed(0)}k`}
                    />
                    <Radar
                      name="Amount Spent"
                      dataKey="amount"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'amount') return [formatCurrency(value), 'Amount Spent'];
                        return [value, name];
                      }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                    <Legend />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Chart Legend/Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-lg font-bold text-gray-900">
                  {data ? formatCurrency(data.data.yearly_summary.total_spent) : 'CAD 0.00'}
                </p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-sm text-gray-500">Avg Monthly</p>
                <p className="text-lg font-bold text-gray-900">
                  {monthlySpendingData.length > 0 
                    ? formatCurrency(monthlySpendingData.reduce((sum, m) => sum + m.spent, 0) / monthlySpendingData.length)
                    : 'CAD 0.00'
                  }
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Peak Month</p>
                <p className="text-lg font-bold text-gray-900">
                  {monthlySpendingData.length > 0 
                    ? (() => {
                        const peak = [...monthlySpendingData].sort((a, b) => b.spent - a.spent)[0];
                        return peak ? peak.name : 'N/A';
                      })()
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Top Purchases Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top Purchases</h2>
                <p className="text-sm text-gray-500">Your most spent products</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {purchasedProductsData.length > 0 ? (
                purchasedProductsData.map((product, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-lg font-bold text-emerald-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.category} • {formatNumber(product.quantity)} units
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(product.amount)}</p>
                      <p className="text-xs text-gray-500">{product.orders} purchases</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No purchases yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start shopping to see analytics</p>
                </div>
              )}
            </div>
            
            {/* Purchase Insights */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Purchase Insights
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Favorite Category</span>
                  <span className="font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {categoryData[0]?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Order Value</span>
                  <span className="font-bold text-emerald-600">
                    {data && data.data.yearly_summary.total_orders > 0
                      ? formatCurrency(data.data.yearly_summary.total_spent / data.data.yearly_summary.total_orders)
                      : 'CAD 0.00'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most Purchased</span>
                  <span className="font-medium truncate max-w-[150px]" title={purchasedProductsData[0]?.name}>
                    {purchasedProductsData[0]?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">{formatNumber(totals.totalProducts)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown with Enhanced UI */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Monthly Breakdown</h2>
              <p className="text-sm text-gray-500">Click on any month to see detailed breakdown</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.data.monthly_breakdown.map((month) => (
              <div
                key={month.month}
                className={`group relative border rounded-xl p-5 transition-all cursor-pointer overflow-hidden ${
                  selectedMonth === month.month
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-emerald-500 hover:shadow-md'
                }`}
                onClick={() => setSelectedMonth(selectedMonth === month.month ? null : month.month)}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-2xl"></div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {month.month_name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      month.spending_summary.total_spent > 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {month.spending_summary.total_spent > 0 ? 'Active' : 'No Purchases'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Spent</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(month.spending_summary.total_spent)}
                      </p>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Orders</p>
                        <p className="font-semibold text-gray-900">
                          {formatNumber(month.spending_summary.total_orders)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Items</p>
                        <p className="font-semibold text-gray-900">
                          {formatNumber(month.spending_summary.total_quantity_purchased)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar for Spending vs Average */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">vs Avg</span>
                        <span className="font-medium text-gray-700">
                          {monthlySpendingData.length > 0 
                            ? `${((month.spending_summary.total_spent / 
                                (monthlySpendingData.reduce((sum, m) => sum + m.spent, 0) / monthlySpendingData.length)) * 100).toFixed(0)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ 
                            width: `${Math.min(100, (month.spending_summary.total_spent / 
                              (monthlySpendingData.reduce((sum, m) => sum + m.spent, 0) / monthlySpendingData.length) * 100))}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Month Details */}
        {selectedMonthData && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-500/30 p-6 mb-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedMonthData.month_name} Details
                  </h2>
                  <p className="text-sm text-gray-500">Your spending breakdown for this month</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMonth(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Products Purchased */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  Products Purchased
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {selectedMonthData.products_purchased.length > 0 ? (
                    selectedMonthData.products_purchased.map((product, index) => (
                      <div key={index} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-white transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                              {product.product_name || 'Unknown Product'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.category || 'General'} • {formatNumber(product.quantity_purchased)} {product.unit || 'units'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(product.amount_spent)}</p>
                          <p className="text-xs text-gray-500">{product.orders || 1} purchase(s)</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No products purchased this month</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Spending Summary & Savings */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Spending Summary
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Total Spent Card */}
                    <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Total Spent</span>
                        <span className="text-2xl font-bold">
                          {formatCurrency(selectedMonthData.spending_summary.total_spent)}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 mt-1">
                        {selectedMonthData.spending_summary.total_orders} orders
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Avg. Order</p>
                        <p className="font-bold text-gray-900">
                          {formatCurrency(selectedMonthData.spending_summary.average_order_value)}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Shipping</p>
                        <p className="font-bold text-gray-900">
                          {formatCurrency(selectedMonthData.spending_summary.total_shipping_paid)}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Items</p>
                        <p className="font-bold text-gray-900">
                          {formatNumber(selectedMonthData.spending_summary.total_quantity_purchased)}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Orders</p>
                        <p className="font-bold text-gray-900">
                          {formatNumber(selectedMonthData.spending_summary.total_orders)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Savings Summary */}
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-5 text-white">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping Savings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Potential Cost</span>
                      <span className="font-bold">
                        {formatCurrency(selectedMonthData.spending_summary.total_orders * 10)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">You Paid</span>
                      <span className="font-bold">
                        {formatCurrency(selectedMonthData.spending_summary.total_shipping_paid)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/20">
                      <span className="text-white/90 font-medium">Total Saved</span>
                      <span className="text-xl font-bold">
                        {formatCurrency((selectedMonthData.spending_summary.total_orders * 10) - selectedMonthData.spending_summary.total_shipping_paid)}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full"
                          style={{ 
                            width: `${Math.min(100, (selectedMonthData.spending_summary.total_shipping_paid / 
                                    (selectedMonthData.spending_summary.total_orders * 10 || 1)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Info Footer */}
        <div className="mt-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Verified Purchase Data</h3>
                <p className="text-sm text-gray-400">All transactions are recorded on blockchain</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Transactions</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(data?.data.yearly_summary.total_orders || 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-white">
                  {new Date().toLocaleDateString('en-CA')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BuyerAnalyticsDashboard;