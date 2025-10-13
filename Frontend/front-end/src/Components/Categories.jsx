import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router";
import LoaderPage from "./Loaders/LoaderPage";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/get-categories");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="text-center"><LoaderPage/></p>;
  if (categories.length === 0) return <p className="text-center">No categories available.</p>;

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-3xl font-bold">Featured Categories</h1>
        <p className="text-gray-600 mt-2">
          Choose your necessary products from these featured categories.
        </p>
      </div>

      {/* Categories Slider */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={5}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        className="px-4"
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat._id || cat.id}>
            <div className="flex flex-col items-center text-center cursor-pointer">
              <Link to={`/categories/${cat.slug}`} className="flex flex-col items-center">
                <div className="w-18 h-18 rounded-full shadow-md flex items-center justify-center overflow-hidden bg-white transition-transform duration-300 ease-in-out hover:scale-110">
                  {cat.image ? (
                    <img
                      src={`http://localhost:4000/files/${cat.image}`}
                      alt={cat.name}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">No Image</span>
                  )}
                </div>
                <h2 className="mt-3 text-sm font-medium text-gray-800">{cat.name}</h2>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Categories;
