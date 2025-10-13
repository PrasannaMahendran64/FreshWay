import {
  FaFacebookF,
  FaXTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import { Link } from "react-router";

const Footer = () => {
  return (
    <>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-green-100 items-center min-h-[70vh] px-6 py-10">

       
        <div className="flex justify-center">
          <img
            className="w-40 sm:w-56 md:w-64 lg:w-72 xl:w-80 rounded-2xl"
            src="Online Groceries.gif"
            alt="Groceries"
          />
        </div>

        
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1034] leading-tight">
            Get Your Daily Needs From Our
            <br />
            FreshWay
          </h2>
          <p className="mt-4 text-[#3c3c3c] text-sm sm:text-base md:text-lg leading-relaxed">
            There are many products you will find in our shop, Choose your
          
            daily necessary product from our FreshWay App and get some
            
            special offers.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
           
            <a
              className="bg-black rounded-md px-6 py-3 flex items-center gap-4 min-w-[160px] sm:min-w-[180px]"
              href="#"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 sm:w-10 sm:h-10 text-white flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 384 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M318.7 268.7c-.2-36.7 31.6-54.3 33-55.2-18-26.3-45.9-29.9-55.7-30.3-23.7-2.4-46.2
                 13.9-58.2 13.9-12 0-30.7-13.6-50.5-13.3-25.9.3-49.8 15-63.2 38.2-27 46.7-6.9 115.5 19.4 
                 153.3 12.9 19.8 28.3 42 48.5 41.2 19.4-.8 26.7-12.6 50-12.6 23.1 0 29.8 12.6 50.7 12.2 
                 20.7-.3 33.7-20.1 46.1-39.9 14.5-22.4 20.5-44.1 20.7-45.3-.5-.2-39.5-15.1-39.7-59.5zM259.7 
                 96c10.7-13 18-31.1 16-49-15.5.6-34.2 10.3-45.3 23.3-9.9 11.5-18.6 30-16.3 47.5 17.3 1.3 35-8.8 45.6-21.8z"></path>
              </svg>
              <div className="text-white text-left">
                <div className="text-xs">Available on the</div>
                <div className="text-base sm:text-lg font-normal">App Store</div>
              </div>
            </a>

            <a
              className="bg-black rounded-md px-6 py-3 flex items-center gap-4 min-w-[160px] sm:min-w-[180px]"
              href="#"
            >
              <img width="50" height="50" src="https://img.icons8.com/fluency/50/google-play.png" alt="google-play"/>
              <div className="text-white text-left">
                <div className="text-xs">Available on the</div>
                <div className="text-base sm:text-lg font-normal">Google Play</div>
              </div>
            </a>
          </div>
        </div>

       
        <div className="flex justify-center">
          <img
            className="w-40 sm:w-56 md:w-64 lg:w-72 xl:w-80 rounded-2xl"
            src="Online Groceries1.gif"
            alt="Groceries"
          />
        </div>
      </div>
      <div className=" mt-8 border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  flex flex-wrap justify-center sm:justify-between gap-4 text-sm text-[#0a1034]">
          <div className="flex items-center gap-4 border-r border-gray-300 pr-4">
            <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/40C057/free-shipping.png" alt="free-shipping"/>
            <span className="font-semibold">Free Shipping From €500.00</span>
          </div>
          <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
           <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/40C057/hotline.png" alt="hotline"/>
            <span className="font-semibold">Support 24/7 At Anytime</span>
          </div>
          <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
            <img width="50" height="50" src="https://img.icons8.com/ios-glyphs/50/40C057/security-checked.png" alt="security-checked"/>
            <span className="font-semibold">Secure Payment Totally Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <img width="50" height="50" src="https://img.icons8.com/ios-glyphs/50/40C057/discount.png" alt="discount"/>
            <span className="font-semibold">Latest Offer Upto 20% Off</span>
          </div>
        </div>
      </div>




      {/* Footer Section */}
      <footer className="bg-white border-t mt-10">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10">
          {/* Company */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/about-us" className="hover:text-green-600">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-green-600">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-green-600">Privacy Policy</Link></li>
              <li><Link to="/terms-condition" className="hover:text-green-600">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Latest News */}
          <div>
            <h3 className="font-bold mb-4">Latest News</h3>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/categories/fruits-vegetable" className="hover:text-green-600">Fruits & Vegetable</Link></li>
              <li><Link to="/categories/cooking-essentials" className="hover:text-green-600">Cooking Essentials</Link></li>
              <li><Link to="/categories/fish-meat" className="hover:text-green-600">Fish & Meat</Link></li>
              <li><Link to="/categories/biscuits-cakes" className="hover:text-green-600">Biscuits & Cakes</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="font-bold mb-4">My Account</h3>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/myaccount/" className="hover:text-green-600">Dashboard</Link></li>
              <li><Link to="/myaccount/myorders" className="hover:text-green-600">My Orders</Link></li>
              <li><Link to="/myaccount/myprofile" className="hover:text-green-600">My Account</Link></li>
              <li><Link to="/myaccount/myupdate-profile" className="hover:text-green-600">Update Profile</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link to="/">
              <img src="logo1.png" className="h-12 sm:h-14" alt="logo" /></Link>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              987 Pathoen Road , Egmore,Chennai,TamilNadu,India
            </p>
            <p className="text-gray-600 text-sm sm:text-base">Phone :6599887766</p>
            <p className="text-gray-600 text-sm sm:text-base">
              Email :{" "}
              <a href="mailto:ccruidk@test.com" className="hover:text-green-600">
                freshway@gmail.com
              </a>
            </p>
          </div>
        </div>

         {/* Bottom Footer */}
      <div className="border-t">
        <div className="px-6 md:px-12 lg:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Follow Us</span>
            <div className="flex gap-3 text-lg">
              <a href="#" className="text-blue-600"><FaFacebookF /></a>
              <a href="#" className="text-black"><FaXTwitter /></a>
              <a href="#" className="text-red-600"><FaPinterestP /></a>
              <a href="#" className="text-blue-700"><FaLinkedinIn /></a>
              <a href="#" className="text-green-500"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Call Us */}
          <div className="text-center">
            <p className="font-semibold text-gray-900">Call Us</p>
            <p className="text-green-600 font-bold text-lg">6599887766</p>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-3">
            <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" className="h-6" />
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6" />
            <img src="https://img.icons8.com/emoji/50/credit-card-emoji.png" alt="MasterCard" className="h-6" />
            <img src="https://img.icons8.com/color/50/card-security.png" alt="Maestro" className="h-6" />
          </div>
        </div>
      </div>

        {/* Bottom bar */}
        <div className="bg-gray-100 text-center py-4 text-xs sm:text-sm text-gray-500">
          © 2025 FreshWay. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
