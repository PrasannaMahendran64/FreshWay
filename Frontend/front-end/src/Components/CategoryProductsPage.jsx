import { useParams, useNavigate, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import LoaderPage from "./Loaders/LoaderPage";

const CategoryProductsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Access cart context safely from Layout
  const context = useOutletContext() || {};
  const { cartItems, addToCart, decreaseFromCart } = context;

  // ✅ Fetch products by category slug
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`http://localhost:4000/products/category/${slug}`);
        console.log("Category API Response:", res.data);

        // ✅ Uniform response: expect data inside res.data.data
        if (res.data.success && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else {
          setProducts([]);
          setError(res.data.message || "No products found.");
        }
      } catch (err) {
        console.error("Error fetching products for category:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  // ✅ Format slug to human-readable name
  const formatCategoryName = (slug) =>
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-3xl font-semibold capitalize text-center sm:text-left">
          {formatCategoryName(slug)} Products
        </h2>

        {/* Back Button */}
        <button
          onClick={() => navigate("/categories")}
          className="mt-3 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md transition"
        >
          ← Back to Categories
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center mt-16">
          <LoaderPage />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 mt-10">{error}</p>
      ) : products.length > 0 ? (
        // ✅ Product Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product._id || index}
              product={product}
              cartItems={cartItems}
              addToCart={addToCart}
              decreaseFromCart={decreaseFromCart}
            />
          ))}
        </div>
      ) : (
        // Empty state
        <p className="text-center text-gray-500 mt-10">
          No products found for this category.
        </p>
      )}
    </div>
  );
};

export default CategoryProductsPage;
