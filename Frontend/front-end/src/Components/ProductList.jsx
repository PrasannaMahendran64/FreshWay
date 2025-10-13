import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useOutletContext, useNavigate, Link } from "react-router";
import LoaderPage from "./Loaders/LoaderPage";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Get cart state and functions from Layout
  const { cartItems, addToCart, decreaseFromCart } = useOutletContext();

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/get-product");
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        setProducts(data.slice(0, 4)); // ✅ show only first 4 products
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <LoaderPage />
      </div>
    );
  }

  return (
    <>
    <div className="text-center mb-5">
        <h1 className="text-3xl font-bold">Popular Products for Daily Shopping</h1>
        <p className="text-gray-600 mt-3">
          See all our popular products in this week. You can choose your daily needs <br /> products from this list and get some special offer with free shipping.
        </p>
      </div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product._id || product.id || index}
            product={product}
            cartItems={cartItems}
            addToCart={addToCart}
            decreaseFromCart={decreaseFromCart}
          />
        ))}
      </div>

      {/* ✅ View All Button */}
      <div className="flex justify-center mt-10">
       <Link to="/products/latest">
  <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Latest Products</button>
</Link>

<Link to="/products/discount">
  <button className="bg-pink-500 text-white px-4 py-2 rounded-lg ml-2">Discount Products</button>
</Link>

      </div>
    </>
  );
};

export default ProductList;
