import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import LoaderPage from "./Loaders/LoaderPage";
import { useOutletContext, useParams } from "react-router";

export default function ProductDisplayPage() {
  const { type } = useParams(); // "latest" or "discount"
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart, decreaseFromCart } = useOutletContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/get-product");
        const allProducts = res.data?.data || [];

        let filtered = [];

        if (type === "latest") {
          filtered = allProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (type === "discount") {
          filtered = allProducts.filter((p) => p.discount && p.discount > 0);
        } else {
          filtered = allProducts;
        }

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]);

  if (loading) return <div className="text-center mt-10"><LoaderPage /></div>;

  const heading =
    type === "discount"
      ? { title: "💸 Discount Products", color: "border-pink-500" }
      : { title: "🌿 Latest Products", color: "border-green-600" };

  return (
    <div className="p-6">
      <h2
        className={`text-3xl font-bold mb-4 text-gray-800 border-l-4 pl-3 ${heading.color}`}
      >
        {heading.title}
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No {type} products available.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, visible).map((product, index) => (
              <ProductCard
                key={product._id || index}
                product={product}
                cartItems={cartItems}
                addToCart={addToCart}
                decreaseFromCart={decreaseFromCart}
              />
            ))}
          </div>

          {visible < products.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisible(visible + 8)}
                className={`${
                  type === "discount"
                    ? "bg-pink-500 hover:bg-pink-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white px-6 py-2 rounded-xl shadow transition`}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
