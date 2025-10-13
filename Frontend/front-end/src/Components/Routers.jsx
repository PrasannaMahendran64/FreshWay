import { Route, Routes } from "react-router"
import HomePage from "./Homepage"
import LoginPage from "../Authentication/Loginpage"
import AboutUs from "./SiteInformation/AboutUs"
import ContactUs from "./SiteInformation/ContactUs"
import PrivacyPolicy from "./SiteInformation/PrivacyPolicy"
import TermsCondition from "./SiteInformation/Conditions"
import Layout from "./Layout"
// import OtpVerification from "../Authentication/otpVerification"

import { ProductDetails } from "./ProductDetails"
import { ScrollToTop } from "./Loaders/ScrollToTop"

import Register from "../Authentication/SignupPage"
import ForgotPassword from "../Authentication/Forget"
import ResetPassword from "../Authentication/Reset"
import CheckoutPage from "./Checkout"

import OrderInvoicePage from "./ordersinvoice"
import CategoriesPage from "./CategoriesPage"
import ErrorPage from "./Loaders/404page"
import ProtectedRoute from "./ProtectedRoute"
import CategoryProductsPage from "./CategoryProductsPage"
import MyAccountPage from "./MyAccountPage"
import MyOrdersPage from "./MyOrdersPage"
import MyReviewsPage from "./MyReviewsPage"
import MyAccountLayout from "./MyAccountPage"
import AccountDashboard from "./AccountDashboard"
import ProfilePage from "./ProfilePage"
import UpdateProfilePage from "./UpdateProfilePage"
import ChangePasswordPage from "./ChangePasswordPage"
import ProductsPage from "./ProductPage"
import OffersPage from "./OffersPage"



const Routers = () => {


    const getUserFromStorage = () => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr || userStr === "undefined") return null;
            return JSON.parse(userStr);
        } catch (err) {
            console.error("Error parsing user from localStorage:", err);
            return null;
        }
    };




    return (
        <>
            <ScrollToTop />

            <Routes>

                <Route path="/" element={<Layout />}>

                    <Route path="/" element={<HomePage />} />

                    <Route path="/about-us" element={<AboutUs />} />

                    <Route path="/contact-us" element={<ContactUs />} />

                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                    <Route path="/terms-condition" element={<TermsCondition />} />

                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/signup" element={<Register />} />

                    <Route path="/forget" element={<ForgotPassword />} />

                    <Route path="/resetpassword" element={<ResetPassword />} />

                    {/* <Route path="/otp-verification" element={<OtpVerification/>}/> */}

                    <Route path="/product/:slug" element={<ProductDetails />} />

                    <Route path="categories" element={<CategoriesPage />} />

                    <Route path="/categories/:slug" element={<CategoryProductsPage />} />

                    <Route path="/products/:type" element={<ProductsPage />} />

                    <Route path="/offers" element={<OffersPage/>}/>

                    <Route path="/myaccount" element={<MyAccountLayout />}>
                        <Route index element={<AccountDashboard />} />
                        <Route path="myorders" element={<MyOrdersPage />} />
                        <Route path="myreviews" element={<MyReviewsPage />} />
                        <Route path="myprofile" element={<ProfilePage />} />
                        <Route path="myupdate-profile" element={<UpdateProfilePage />} />
                        <Route path="change-password" element={<ChangePasswordPage />} />
                    </Route>




                    <Route path="/checkout" element={
                        <ProtectedRoute user={getUserFromStorage()}>
                            <CheckoutPage />
                        </ProtectedRoute>} />


                    <Route path="/order-invoice/:orderId" element={<OrderInvoicePage />} />

                </Route>
                <Route path="*" element={<ErrorPage />} />



            </Routes>
        </>
    )

}
export default Routers







