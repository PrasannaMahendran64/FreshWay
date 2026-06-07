import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import LoaderPage from "./Loaders/LoaderPage";
import { useOutletContext, useParams, useSearchParams } from "react-router";
import { Filter, SlidersHorizontal, RefreshCw } from "lucide-react";

export default function ProductDisplayPage() {
  const { type } = useParams(); // e.g. "latest", "discount", "all"
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter states
  const [search, setSearch] = useState(searchQuery);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [available, setAvailable] = useState("");
  const [discounted, setDiscounted] = useState(type === "discount" ? "true" : "");
  const [featured, setFeatured] = useState("");
  const [newArrival, setNewArrival] = useState(type === "latest" ? "true" : "");
  const [sort, setSort] = useState("newest");

  // Auxiliary states
  const [categories, setCategories] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { cartItems, addToCart, decreaseFromCart } = useOutletContext() || {};

  // Fetch categories for filtering
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get("/api/get-categories");
        setCategories(data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Sync route URL search query with state
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "8");
      params.append("sort", sort);

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (brand) params.append("brand", brand);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (rating) params.append("rating", rating);
      if (available) params.append("available", available);
      if (discounted) params.append("discounted", discounted);
      if (featured) params.append("featured", featured);
      if (newArrival) params.append("newArrival", newArrival);

      const res = await axios.get(`/api/get-product?${params.toString()}`);
      setProducts(res.data?.data || []);
      setTotalPages(res.data?.pages || 1);
      setTotalProducts(res.data?.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sort, type, category, brand, rating, available, discounted, featured, newArrival]);

  const handleApplyFiltersSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setAvailable("");
    setDiscounted("");
    setFeatured("");
    setNewArrival("");
    setSort("newest");
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/35">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 capitalize">
            {type === "discount" ? "💸 Discount Offers" : type === "latest" ? "🌿 New Arrivals" : "🛍️ Shop Supermarket"}
          </h2>
          <p className="text-gray-400 text-xs mt-1">Found {totalProducts} premium products matching filters.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Mobile Filter toggle button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl md:hidden text-gray-600 bg-white hover:bg-gray-50 flex-1 text-sm font-semibold"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-gray-700 font-semibold"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="oldest">Oldest First</option>
            <option value="best_selling">Best Selling</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm shrink-0 h-max sticky top-36">
          <FilterForm
            onSubmit={handleApplyFiltersSubmit}
            onReset={handleResetFilters}
            categories={categories}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            rating={rating}
            setRating={setRating}
            available={available}
            setAvailable={setAvailable}
            discounted={discounted}
            setDiscounted={setDiscounted}
            featured={featured}
            setFeatured={setFeatured}
            newArrival={newArrival}
            setNewArrival={setNewArrival}
          />
        </aside>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end md:hidden">
            <div className="bg-white w-80 h-full p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-lg flex items-center gap-1.5"><Filter size={18} /> Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 font-bold hover:text-gray-800">Close</button>
                </div>
                <FilterForm
                  onSubmit={(e) => {
                    handleApplyFiltersSubmit(e);
                    setShowMobileFilters(false);
                  }}
                  onReset={() => {
                    handleResetFilters();
                    setShowMobileFilters(false);
                  }}
                  categories={categories}
                  search={search}
                  setSearch={setSearch}
                  category={category}
                  setCategory={setCategory}
                  brand={brand}
                  setBrand={setBrand}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  rating={rating}
                  setRating={setRating}
                  available={available}
                  setAvailable={setAvailable}
                  discounted={discounted}
                  setDiscounted={setDiscounted}
                  featured={featured}
                  setFeatured={setFeatured}
                  newArrival={newArrival}
                  setNewArrival={setNewArrival}
                />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center mt-20"><LoaderPage /></div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">
              <SlidersHorizontal size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-bold">No products found matching filters.</p>
              <button
                onClick={handleResetFilters}
                className="text-green-600 hover:underline mt-2 text-xs font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    cartItems={cartItems}
                    addToCart={addToCart}
                    decreaseFromCart={decreaseFromCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition font-semibold"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-500 font-bold">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition font-semibold"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Filter Form component
const FilterForm = ({
  onSubmit,
  onReset,
  categories,
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
  available,
  setAvailable,
  discounted,
  setDiscounted,
  featured,
  setFeatured,
  newArrival,
  setNewArrival,
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    {/* Text Search */}
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Search</label>
      <input
        type="text"
        placeholder="Keyword..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none"
      />
    </div>

    {/* Categories */}
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-gray-700"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    {/* Brand */}
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Brand</label>
      <input
        type="text"
        placeholder="e.g. FreshWay, Tata"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none"
      />
    </div>

    {/* Price Range */}
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Price Range (₹)</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
        <span className="text-gray-300">-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>
    </div>

    {/* Rating */}
    <div>
      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Minimum Rating</label>
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="w-full border border-gray-200 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-green-400 focus:outline-none bg-white text-gray-700"
      >
        <option value="">Any Rating</option>
        <option value="4">⭐⭐⭐⭐ & Up</option>
        <option value="3">⭐⭐⭐ & Up</option>
        <option value="2">⭐⭐ & Up</option>
      </select>
    </div>

    {/* Checkbox filters */}
    <div className="space-y-2.5 pt-2 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="availCheck"
          checked={available === "true"}
          onChange={(e) => setAvailable(e.target.checked ? "true" : "")}
          className="rounded text-green-600 focus:ring-green-400"
        />
        <label htmlFor="availCheck" className="text-xs font-semibold text-gray-600 cursor-pointer">
          In Stock Only
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="discCheck"
          checked={discounted === "true"}
          onChange={(e) => setDiscounted(e.target.checked ? "true" : "")}
          className="rounded text-green-600 focus:ring-green-400"
        />
        <label htmlFor="discCheck" className="text-xs font-semibold text-gray-600 cursor-pointer">
          Special Discounts
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featCheck"
          checked={featured === "true"}
          onChange={(e) => setFeatured(e.target.checked ? "true" : "")}
          className="rounded text-green-600 focus:ring-green-400"
        />
        <label htmlFor="featCheck" className="text-xs font-semibold text-gray-600 cursor-pointer">
          Featured Products
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="newCheck"
          checked={newArrival === "true"}
          onChange={(e) => setNewArrival(e.target.checked ? "true" : "")}
          className="rounded text-green-600 focus:ring-green-400"
        />
        <label htmlFor="newCheck" className="text-xs font-semibold text-gray-600 cursor-pointer">
          New Arrivals
        </label>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex gap-2 pt-3">
      <button
        type="button"
        onClick={onReset}
        className="w-1/3 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition"
      >
        Clear
      </button>
      <button
        type="submit"
        className="w-2/3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow"
      >
        Filter
      </button>
    </div>
  </form>
);
