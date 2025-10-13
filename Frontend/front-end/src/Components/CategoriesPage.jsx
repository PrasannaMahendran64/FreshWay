import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import LoaderPage from "./Loaders/LoaderPage";
import { useOutletContext } from "react-router";
import { Link } from "react-router";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart, decreaseFromCart } = useOutletContext();

  // Hardcoded categories (or fetch from backend)
  const allCategories = [
   
    { name: "Fruits & Vegetable", slug: "fruits-vegetable", icon: "🥬" },
    { name: "Cooking Essentials", slug: "cooking-essentials", icon: "🍳" },
     { name: "Fish & Meat", slug: "fish-meat", icon: "🐟" },
    { name: "Biscuits & Cakes", slug: "biscuits-cakes", icon: "🍪" },
    { name: "Household Tools", slug: "household-tools", icon: "🧴" },
    { name: "Pet Care", slug: "pet-care", icon: "🐕" },
    { name: "Beauty & Healths", slug: "beauty-healths", icon: "💄" },
    { name: "Jam & Jelly", slug: "jam-jelly", icon: "🍯" },
    { name: "Milk & Dairy", slug: "milk-dairy", icon: "🥛" },
    { name: "Drinks", slug: "drinks", icon: "🥤" },
  ];

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/get-product");
      const allProducts = res.data?.data || [];

      const grouped = {};
      allCategories.forEach((cat) => {
        grouped[cat.slug] = allProducts.filter((p) => {
          if (!p.category) return false;

          if (typeof p.category === "string") {
            return p.category.toLowerCase() === cat.name.toLowerCase();
          }

          if (typeof p.category === "object" && p.category.name) {
            return p.category.name.toLowerCase() === cat.name.toLowerCase();
          }

          return false;
        });
      });

      setProductsByCategory(grouped);
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


  if (loading) return <div className="text-center mt-10"><LoaderPage /></div>;

  return (
    <div className="p-6 space-y-12">
      {categories.map((cat) => {
        const catProducts = productsByCategory[cat.slug] || [];

        return (
          <div key={cat.slug} className="space-y-4">
            {/* Category Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {cat.icon} {cat.name}
              </h2>

              {catProducts.length > 4 && (
                <Link
                  to={`/categories/${cat.slug}`}
                  className="text-green-600 font-semibold hover:underline"
                >
                  View All
                </Link>
              )}
            </div>

            {/* Products Grid (show first 4 products) */}
            {catProducts.length === 0 ? (
              <p className="text-gray-500">No products in this category.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {catProducts.slice(0, 4).map((product, idx) => (
                  <ProductCard
                    key={product._id || idx}
                    product={product}
                    cartItems={cartItems}
                    addToCart={addToCart}
                    decreaseFromCart={decreaseFromCart}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
