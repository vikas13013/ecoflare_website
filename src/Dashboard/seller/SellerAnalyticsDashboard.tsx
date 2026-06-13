import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart,
  Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Package,
  ShoppingCart, Users, BarChart2, PieChart as PieChartIcon,
  Calendar, Download, Filter, RefreshCw,
  Award, Star, TrendingUp as TrendingUpIcon,
  Clock, CheckCircle, XCircle, Percent,
  ArrowUpRight, ArrowDownRight, CreditCard,
  IndianRupee, BadgeDollarSign, Landmark, Wallet
} from 'lucide-react';
import { analyticsService, SellerAnalyticsData } from '../../services/analyticsService';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useTranslation } from "react-i18next";



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

const SellerAnalyticsDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem('accessToken');
  
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<SellerAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<'revenue' | 'products' | 'categories'>('revenue');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { t } = useTranslation();

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
      const result = await analyticsService.getSellerAnalytics(year, token);
      console.log(result);
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log( data, 'analytics data' );
  

  // Prepare monthly revenue data for chart
  const getMonthlyRevenueData = () => {
    if (!data) return [];
    
    return data.data.monthly_breakdown.map(month => ({
      name: month.month_name.substring(0, 3),
      fullName: month.month_name,
      month: month.month,
      revenue: month.payment_summary.total_amount,
      paid: month.payment_summary.paid_amount,
      unpaid: month.payment_summary.unpaid_amount,
      orders: month.products_sold.reduce((sum, product) => sum + product.orders, 0)
    }));
  };

  // Prepare top products data
  const getTopProductsData = () => {
    if (!data) return [];
    
    const productMap = new Map();
    
    data.data.monthly_breakdown.forEach(month => {
      month.products_sold.forEach(product => {
        const existing = productMap.get(product.product_id) || {
          id: product.product_id,
          name: product.product_name,
          revenue: 0,
          quantity: 0,
          orders: 0
        };
        
        existing.revenue += product.revenue;
        existing.quantity += product.quantity_sold;
        existing.orders += product.orders;
        
        productMap.set(product.product_id, existing);
      });
    });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Prepare category data
  const getCategoryData = () => {
    if (!data) return [];
    
    const categoryMap = new Map();
    
    data.data.monthly_breakdown.forEach(month => {
      month.category_wise_orders.forEach(category => {
        const existing = categoryMap.get(category.category_id) || {
          id: category.category_id,
          name: category.category_name,
          revenue: 0,
          orders: 0
        };
        
        existing.revenue += category.total_revenue;
        existing.orders += category.total_orders;
        
        categoryMap.set(category.category_id, existing);
      });
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => b.revenue - a.revenue);
  };

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (!data) return 0;
    
    const monthlyData = data.data.monthly_breakdown;
    if (monthlyData.length < 2) return 0;
    
    const currentRevenue = monthlyData[0]?.payment_summary.total_amount || 0;
    const previousRevenue = monthlyData[1]?.payment_summary.total_amount || 0;
    
    if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0;
    
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  };

  // Get selected month data
  const getSelectedMonthData = () => {
    if (!selectedMonth || !data) return null;
    return data.data.monthly_breakdown.find(month => month.month === selectedMonth);
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!data) return { orders: 0, products: 0 };
    
    const orders = data.data.monthly_breakdown.reduce((sum, month) => 
      sum + month.products_sold.reduce((prodSum, product) => prodSum + product.orders, 0), 0
    );
    
    const products = data.data.monthly_breakdown.reduce((sum, month) => 
      sum + month.products_sold.length, 0
    );
    
    return { orders, products };
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
          <p className="mt-6 text-lg font-medium text-gray-700">{t("loading_analytics")}</p>
          <p className="text-sm text-gray-500 mt-2">{t("preparing_business_insights")}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("unable_load_analytics")}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("go_back")}
            </button>
            <button
              onClick={fetchData}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {t("try_again")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const monthlyRevenueData = getMonthlyRevenueData();
  const topProductsData = getTopProductsData();
  const categoryData = getCategoryData();
  const selectedMonthData = getSelectedMonthData();
  const growth = calculateGrowth();
  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 py-6 md:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t("seller_analytics")}
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  {data?.data.seller_info.business_name || t("your_business")} • {t("year")} {year}
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
          {/* Total Revenue */}
          <div 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-emerald-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredCard('revenue')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t("total_revenue")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data ? formatCurrency(data.data.yearly_summary.total_amount) : 'CA$0.00'}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    growth >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{formatPercent(growth)}</span>
                  </div>
                  <span className="text-xs text-gray-500">{t("vs_last_month")}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                hoveredCard === 'revenue' ? 'from-emerald-500 to-teal-500 scale-110' : 'from-emerald-100 to-teal-100'
              } flex items-center justify-center transition-all duration-300`}>
                <BadgeDollarSign className={`w-6 h-6 ${
                  hoveredCard === 'revenue' ? 'text-white' : 'text-emerald-600'
                } transition-colors`} />
              </div>
            </div>
          </div>

          {/* Paid Amount */}
          <div 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-blue-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredCard('paid')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t("paid_amount")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data ? formatCurrency(data.data.yearly_summary.paid_amount) : 'CA$0.00'}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>{data && data.data.yearly_summary.total_amount > 0 
                      ? `${((data.data.yearly_summary.paid_amount / data.data.yearly_summary.total_amount) * 100).toFixed(1)}%`
                      : '0%'
                    }</span>
                  </div>
                  <span className="text-xs text-gray-500">{t("collected")}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                hoveredCard === 'paid' ? 'from-blue-500 to-indigo-500 scale-110' : 'from-blue-100 to-indigo-100'
              } flex items-center justify-center transition-all duration-300`}>
                <CheckCircle className={`w-6 h-6 ${
                  hoveredCard === 'paid' ? 'text-white' : 'text-blue-600'
                } transition-colors`} />
              </div>
            </div>
          </div>

          {/* Unpaid Amount */}
          <div 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-yellow-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredCard('unpaid')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t("unpaid_amount")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data ? formatCurrency(data.data.yearly_summary.unpaid_amount) : 'CA$0.00'}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{data && data.data.yearly_summary.total_amount > 0 
                      ? `${((data.data.yearly_summary.unpaid_amount / data.data.yearly_summary.total_amount) * 100).toFixed(1)}%`
                      : '0%'
                    }</span>
                  </div>
                  <span className="text-xs text-gray-500">{t("pending")}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                hoveredCard === 'unpaid' ? 'from-yellow-500 to-amber-500 scale-110' : 'from-yellow-100 to-amber-100'
              } flex items-center justify-center transition-all duration-300`}>
                <Clock className={`w-6 h-6 ${
                  hoveredCard === 'unpaid' ? 'text-white' : 'text-yellow-600'
                } transition-colors`} />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-purple-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setHoveredCard('orders')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t("total_orders")}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(totals.orders)}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    <Package className="w-3 h-3" />
                    <span>{totals.products} {t("products")}</span>
                  </div>
                  <span className="text-xs text-gray-500">{t("this_year")}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                hoveredCard === 'orders' ? 'from-purple-500 to-pink-500 scale-110' : 'from-purple-100 to-pink-100'
              } flex items-center justify-center transition-all duration-300`}>
                <ShoppingCart className={`w-6 h-6 ${
                  hoveredCard === 'orders' ? 'text-white' : 'text-purple-600'
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
                  {activeChart === 'revenue' && <DollarSign className="w-5 h-5 text-white" />}
                  {activeChart === 'products' && <Package className="w-5 h-5 text-white" />}
                  {activeChart === 'categories' && <BarChart2 className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeChart === 'revenue' && 'Monthly Revenue Analysis'}
                    {activeChart === 'products' && 'Top Products Performance'}
                    {activeChart === 'categories' && 'Category Distribution'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {activeChart === 'revenue' && 'Revenue trends and payment status'}
                    {activeChart === 'products' && 'Revenue vs quantity sold'}
                    {activeChart === 'categories' && 'Revenue by category'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3 sm:mt-0 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveChart('revenue')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeChart === 'revenue'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Revenue
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
                {activeChart === 'revenue' ? (
                  <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `CA$${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), '']}
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
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                      name="Total Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="paid"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorPaid)"
                      strokeWidth={2}
                      name="Paid Amount"
                    />
                  </AreaChart>
                ) : activeChart === 'products' ? (
                  <BarChart data={topProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                      tickFormatter={(value) => `CA$${(value/1000).toFixed(0)}k`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#6b7280"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
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
                      dataKey="revenue"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="Revenue"
                      barSize={30}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="quantity"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Quantity Sold"
                      barSize={30}
                    />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="revenue"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={chartColors[index % chartColors.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Chart Legend/Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-lg font-bold text-gray-900">
                  {data ? formatCurrency(data.data.yearly_summary.total_amount) : 'CA$0.00'}
                </p>
              </div>
              <div className="text-center border-x border-gray-200">
                <p className="text-sm text-gray-500">Avg Monthly</p>
                <p className="text-lg font-bold text-gray-900">
                  {monthlyRevenueData.length > 0 
                    ? formatCurrency(monthlyRevenueData.reduce((sum, m) => sum + m.revenue, 0) / monthlyRevenueData.length)
                    : 'CA$0.00'
                  }
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Peak Month</p>
                <p className="text-lg font-bold text-gray-900">
                  {monthlyRevenueData.length > 0 
                    ? (() => {
                        const peak = [...monthlyRevenueData].sort((a, b) => b.revenue - a.revenue)[0];
                        return peak ? peak.name : 'N/A';
                      })()
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Top Products Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top Products</h2>
                <p className="text-sm text-gray-500">Best performing items</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {topProductsData.length > 0 ? (
                topProductsData.map((product, index) => (
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
                          {formatNumber(product.quantity)} units • {product.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-green-600">
                        {formatCurrency(product.revenue / product.quantity)}/unit
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No products sold yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start selling to see analytics</p>
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Avg Order Value</p>
                <p className="text-lg font-bold text-gray-900">
                  {topProductsData.length > 0 
                    ? formatCurrency(topProductsData.reduce((sum, p) => sum + p.revenue, 0) / 
                        (topProductsData.reduce((sum, p) => sum + p.orders, 0) || 1))
                    : 'CA$0.00'
                  }
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Total Units</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatNumber(topProductsData.reduce((sum, p) => sum + p.quantity, 0))}
                </p>
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
              <h2 className="text-xl font-bold text-gray-900">Monthly Performance</h2>
              <p className="text-sm text-gray-500">Click on any month to see detailed breakdown</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.data.monthly_breakdown.map((month, idx) => (
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
                      month.payment_summary.total_amount > 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {month.payment_summary.total_amount > 0 ? 'Active' : 'No Sales'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t("revenue")}</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(month.payment_summary.total_amount)}
                      </p>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-xs text-gray-500">{t("orders")}</p>
                        <p className="font-semibold text-gray-900">
                          {formatNumber(month.products_sold.reduce((sum, product) => sum + product.orders, 0))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{t("products")}</p>
                        <p className="font-semibold text-gray-900">
                          {formatNumber(month.products_sold.length)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar for Payment Collection */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t("collection")}</span>
                        <span className="font-medium text-gray-700">
                          {((month.payment_summary.paid_amount / (month.payment_summary.total_amount || 1)) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${(month.payment_summary.paid_amount / (month.payment_summary.total_amount || 1)) * 100}%` }}
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
                    {selectedMonthData.month_name} {t("performance")}
                  </h2>
                  <p className="text-sm text-gray-500">{t("monthly_breakdown")}</p>
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
              {/* Products Sold */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  {t("products_sold")}
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {selectedMonthData.products_sold.length > 0 ? (
                    selectedMonthData.products_sold.map((product, index) => (
                      <div key={index} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-white transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                              {product.product_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatNumber(product.quantity_sold)} {product.unit} • {product.orders} orders
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                          <p className="text-xs text-green-600">
                            {formatCurrency(product.revenue / product.quantity_sold)} per {product.unit}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">{t("no_products_this_month")}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Category Performance & Payment Summary */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-purple-600" />
                    {t("category_performance")}
                  </h3>
                  <div className="space-y-3">
                    {selectedMonthData.category_wise_orders.map((category, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-500/30 transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{category.category_name}</span>
                          <span className="font-bold text-gray-900">{formatCurrency(category.total_revenue)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{category.total_orders} orders</span>
                          <span>{formatCurrency(category.total_revenue / category.total_orders)} avg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Payment Summary Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    {t("payment_summary")}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">{t("total_amount")}</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(selectedMonthData.payment_summary.total_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">{t("paid_amount")}</span>
                      <span className="font-bold text-lg flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {formatCurrency(selectedMonthData.payment_summary.paid_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">{t("unpaid_amount")}</span>
                      <span className="font-bold text-lg flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatCurrency(selectedMonthData.payment_summary.unpaid_amount)}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/80">{t("collection_rate")}</span>
                        <span className="font-medium">
                          {((selectedMonthData.payment_summary.paid_amount / 
                             (selectedMonthData.payment_summary.total_amount || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full"
                          style={{ 
                            width: `${(selectedMonthData.payment_summary.paid_amount / 
                                    (selectedMonthData.payment_summary.total_amount || 1)) * 100}%` 
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
                <Landmark className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{t("verified_blockchain_data")}</h3>
                <p className="text-sm text-gray-400">{t("blockchain_transactions")}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-400">{t("total_transactions")}</p>
                <p className="text-xl font-bold text-white">
                  {data?.data.monthly_breakdown.reduce((sum, m) => sum + m.products_sold.length, 0) || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">{t("last_updated")}</p>
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

export default SellerAnalyticsDashboard;