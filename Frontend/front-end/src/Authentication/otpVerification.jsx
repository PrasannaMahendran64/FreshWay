// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const OtpVerification = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(30);
//   const inputRefs = useRef([]);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     const pendingEmail = location.state?.email || localStorage.getItem("pendingEmail");
//     if (!pendingEmail) {
//       toast.error("❌ Email not found. Please login again.");
//       setTimeout(() => navigate("/login"), 1000);
//       return;
//     }
//     setEmail(pendingEmail);

//     timerRef.current = setInterval(() => {
//       setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timerRef.current);
//   }, [navigate, location.state]);

//   const handleOtpChange = (index, value) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < otp.length - 1) inputRefs.current[index + 1].focus();
//     }
//   };

//   const verifyOtp = async (enteredOtp) => {
//     if (enteredOtp.length < 6) {
//       toast.error("⚠️ Enter full OTP");
//       return;
//     }
//     setLoading(true);
//     try {
//       const { data } = await axios.post("http://localhost:4000/verifyotp", { email, otp: enteredOtp });
//       if (data?.data?.token) {
//         localStorage.setItem("token", data.data.token);
//         localStorage.setItem("user", JSON.stringify(data.data.user));
//         localStorage.removeItem("pendingEmail");

//         // ✅ Dispatch login event
//         window.dispatchEvent(new Event("login"));

//         toast.success("✅ OTP Verified!");
//         navigate("/", { replace: true });
//       } else {
//         toast.error("❌ Invalid OTP");
//         setOtp(["", "", "", "", "", ""]);
//         inputRefs.current[0].focus();
//       }
//     } catch {
//       toast.error("❌ OTP verification failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 px-4">
//       <div className="w-full sm:w-[40%] bg-white p-6 rounded-2xl shadow text-center">
//         <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
//         <div className="flex justify-center gap-3 mb-6">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               type="text"
//               maxLength="1"
//               ref={(el) => (inputRefs.current[index] = el)}
//               value={digit}
//               onChange={(e) => handleOtpChange(index, e.target.value)}
//               className="w-12 h-12 border rounded text-center text-xl"
//             />
//           ))}
//         </div>
//         <button
//           onClick={() => verifyOtp(otp.join(""))}
//           disabled={loading}
//           className={`w-full py-3 text-white rounded-lg ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
//         >
//           {loading ? "Verifying..." : "Verify"}
//         </button>
//         <p
//           className={`mt-4 ${resendTimer > 0 ? "text-gray-400" : "text-blue-500 cursor-pointer"}`}
//           onClick={() => resendTimer === 0 && window.location.reload()}
//         >
//           {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
//         </p>
//       </div>
//       <ToastContainer autoClose={3000} />
//     </div>
//   );
// };

// export default OtpVerification;
