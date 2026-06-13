import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight, Filter, SortAsc, Search, Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import img1 from '../assets/new-images/slider1/3.jpg';
import img2 from '../assets/new-images/slider1/4.jpg';
import img3 from '../assets/new-images/slider1/5.jpg';
import img4 from '../assets/new-images/slider1/6.jpg';
import img5 from '../assets/new-images/slider1/7.jpg';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  pricingNote: string;
  location: string;
  availability: string;
  dateRange: string;
  image: string;
  category: string[];
};

const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Habanero Pepper",
    description: "Commercial 8-1/8lb carton",
    price: "TBD",
    pricingNote: "~ $5.49/lb CAD fob",
    location: "Toronto, ON",
    availability: "Available",
    dateRange: "Feb 15 2025 – Mar 05 2025",
    image: img1,
    category: ["vegetables", "seasonal"]
  },
  {
    id: 2,
    name: "Avocado",
    description: "Box of 10",
    price: "$18.99 CAD",
    pricingNote: "~ $1.90/ea CAD",
    location: "Vancouver, BC",
    availability: "Limited",
    dateRange: "Apr 01 2025 – Apr 10 2025",
    image: img2,
    category: ["fruits", "organic"]
  },
  {
    id: 3,
    name: "Green Grapes",
    description: "5lb bunch",
    price: "$11.50 CAD",
    pricingNote: "~ $2.30/lb CAD",
    location: "Kelowna, BC",
    availability: "Available",
    dateRange: "Apr 03 2025 – Apr 15 2025",
    image: img3,
    category: ["fruits", "seasonal"]
  },
  {
    id: 4,
    name: "Mangoes",
    description: "12 count box",
    price: "$14.00 CAD",
    pricingNote: "~ $1.16/ea CAD",
    location: "Montreal, QC",
    availability: "Coming Soon",
    dateRange: "Apr 20 2025 – Apr 30 2025",
    image: img4,
    category: ["fruits"]
  },
  {
    id: 5,
    name: "Tomatoes",
    description: "6lb box",
    price: "$8.50 CAD",
    pricingNote: "~ $1.42/lb CAD",
    location: "Calgary, AB",
    availability: "Available",
    dateRange: "Apr 10 2025 – Apr 18 2025",
    image: img5,
    category: ["vegetables", "organic"]
  },
];



// ... (keep the existing ProductCard and SectionHeader components as they are)
const SectionHeader = ({ title, onSeeAll }: { title: string; onSeeAll: () => void }) => (
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    <button
      className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium flex items-center"
      onClick={onSeeAll}
    >
      View all
      <ChevronRight className="w-4 h-4 ml-1" />
    </button>
  </div>
);


const Marketplace = () => {
  const navigate = useNavigate();
  const [allProducts] = useState<Product[]>(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const categories = [
    { id: "all", name: "All Produce" },
    { id: "fruits", name: "Fruits" },
    { id: "vegetables", name: "Vegetables" },
    { id: "organic", name: "Organic" },
    { id: "seasonal", name: "Seasonal" },
  ];

  const availabilityOptions = ["Available", "Limited", "Coming Soon"];
  const sortOptions = [
    { id: "default", name: "Default" },
    { id: "price-asc", name: "Price: Low to High" },
    { id: "price-desc", name: "Price: High to Low" },
    { id: "name-asc", name: "Name: A to Z" },
    { id: "name-desc", name: "Name: Z to A" },
  ];

  const sections = [
    { title: "Featured Produce", id: "featured" },
    { title: "New Arrivals", id: "new" },
    { title: "Almost Gone", id: "limited" },
  ];

  // Filter products based on search, category, availability, and price range
  const filteredProducts = allProducts.filter((product) => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = activeCategory === "all" || 
                          product.category.includes(activeCategory);
    
    // Availability filter
    const matchesAvailability = availabilityFilter.length === 0 || 
                              availabilityFilter.includes(product.availability);
    
    // Price filter (convert price to number for comparison)
    const productPrice = product.price === "TBD" ? 0 : 
                        parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price === "TBD" ? 0 : parseFloat(a.price.replace(/[^0-9.]/g, ''));
    const priceB = b.price === "TBD" ? 0 : parseFloat(b.price.replace(/[^0-9.]/g, ''));
    
    switch (sortOption) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Group products for different sections
  const featuredProducts = sortedProducts.filter(p => p.availability === "Available");
  const newArrivals = sortedProducts.filter(p => p.availability === "Coming Soon");
  const almostGone = sortedProducts.filter(p => p.availability === "Limited");

  const toggleAvailabilityFilter = (option: string) => {
    if (availabilityFilter.includes(option)) {
      setAvailabilityFilter(availabilityFilter.filter(item => item !== option));
    } else {
      setAvailabilityFilter([...availabilityFilter, option]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section (keep this the same) */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        {/* ... existing hero section code ... */}
      </div>

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <div className="relative">
              <Button variant="outline" className="flex items-center gap-2">
                <SortAsc className="w-4 h-4" /> Sort
              </Button>
              {showFilters && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`block w-full text-left px-4 py-2 text-sm rounded ${
                        sortOption === option.id
                          ? "bg-green-100 text-green-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSortOption(option.id);
                        setShowFilters(false);
                      }}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button onClick={() => navigate("/request-produce")} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Request Produce
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <h3 className="font-bold mb-3">Availability</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {availabilityOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleAvailabilityFilter(option)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    availabilityFilter.includes(option)
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <h3 className="font-bold mb-3">Price Range</h3>
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            <Button 
              onClick={() => {
                setAvailabilityFilter([]);
                setPriceRange([0, 100]);
              }}
              variant="outline"
              className="text-sm"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Product Sections */}
        <section className="mb-12">
          <SectionHeader
            title="Featured Produce"
            onSeeAll={() => navigate("/products")}
          />
          <ProductGrid products={featuredProducts} />
        </section>

        <section className="mb-12">
          <SectionHeader
            title="New Arrivals"
            onSeeAll={() => navigate("/products")}
          />
          <ProductGrid products={newArrivals} />
        </section>

        <section className="mb-12">
          <SectionHeader
            title="Almost Gone"
            onSeeAll={() => navigate("/products")}
          />
          <ProductGrid products={almostGone} />
        </section>
      </div>
    </div>
  );
};

// New component to display products in a grid with swiper
const ProductGrid = ({ products }: { products: Product[] }) => {
  if (products.length === 0) {
    return <p className="text-gray-500">No products found matching your criteria.</p>;
  }

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: `.swiper-button-next`,
          prevEl: `.swiper-button-prev`,
        }}
        spaceBetween={24}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5 },
          1280: { slidesPerView: 4.5 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="pb-2">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        className={`swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all duration-300 hidden md:flex items-center justify-center`}
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <button
        className={`swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all duration-300 hidden md:flex items-center justify-center`}
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default Marketplace;