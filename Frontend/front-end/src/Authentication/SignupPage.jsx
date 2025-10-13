import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Phone, Lock } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:4000/register", {
        name,
        email,
        mobilenumber,
        password,
      });

      toast.success("✅ Registration successful! Redirecting...", { position: "top-right" });
      console.log("Register Response:", data);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      toast.error(`❌ ${err.response?.data?.message || "Something went wrong"}`, { position: "top-right" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200">
      <ToastContainer autoClose={3000} />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Mobile Number */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={mobilenumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Mobile Number"
              required
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (6-16 characters)"
              required
              minLength={6}
              maxLength={16}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}



































































































































// import { User, Phone, Mail,LockKeyhole } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";
// import { Link } from "react-router";
// import axios from "axios";

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobilenumber: "",
//     password:""

//   });

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.mobilenumber || !formData.email ||!formData.password) {
//       toast.error("⚠️ Please fill all fields!");
//       return;
//     }
//     try {
//       await axios.post("http://localhost:4000/register", formData)
//       toast.success("🎉 Signup successful!");
//       setFormData({
//         name: "",
//         mobilenumber: "",
//         email: "",
//         password:""
//       });


//     } catch (error) {
//       console.error(error);
//     }


//   };

//   return (
//     <>
//       <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 px-4">
//         {/* Card with shadow */}
//         <div className="w-full sm:w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%] bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
//           <h1 className="font-bold text-2xl text-center">SignUp Form</h1>

//           <form
//             className="flex flex-col mx-auto my-8 space-y-5"
//             onSubmit={handleSubmit}
//           >
//             {/* Name Input */}
//             <div className="flex items-center border border-green-500 rounded p-2">
//               <User className="text-green-500 mr-2" size={20} />
//               <input
//                 type="text"
//                 name="name"
//                 className="w-full outline-none"
//                 placeholder="Enter Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Mobile Number Input */}
//             <div className="flex items-center border border-green-500 rounded p-2">
//               <Phone className="text-green-500 mr-2" size={20} />
//               <input
//                 type="number"
//                 name="mobilenumber"
//                 className="w-full outline-none"
//                 placeholder="Enter Mobile Number"
//                 value={formData.mobilenumber}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Email Input */}
//             <div className="flex items-center border border-green-500 rounded p-2">
//               <Mail className="text-green-500 mr-2" size={20} />
//               <input
//                 type="email"
//                 name="email"
//                 className="w-full outline-none"
//                 placeholder="Enter Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             {/* Email Input */}
//             <div className="flex items-center border border-green-500 rounded p-2">
//               <LockKeyhole className="text-green-500 mr-2" size={20} />
//               <input
//                 type="password"
//                 name="password"
//                 className="w-full outline-none"
//                 placeholder="Enter Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Checkbox */}
//             <div className="flex flex-row space-x-2 items-start">
//               <input type="checkbox" required className="mt-1" />
//               <p className="text-sm">
//                 By continuing, you agree to{" "}
//                 <span className="text-blue-500">Terms of Use</span> and{" "}
//                 <span className="text-blue-500">Privacy Policy</span>.
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="flex gap-3 justify-center">
//               <button
//                 type="submit"
//                 className="px-7 py-3 text-white bg-green-500 rounded hover:bg-green-600 shadow-md w-full sm:w-auto"
//               >
//                 SignUp
//               </button>
//             </div>
//           </form>

//           {/* Login redirect */}
//           <div className="text-center">
//             <p>
//               Already have an account?{" "}
//               <Link to="/login">
//                 <span className="font-bold hover:text-green-500 cursor-pointer">
//                   Login
//                 </span>
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Toast Container */}
//         <ToastContainer position="top-right" autoClose={3000} />
//       </div>
//     </>
//   );
// };

// export default SignUpPage;
