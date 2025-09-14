import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";
import { supabase } from "./supabaseClient";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./pages/UserDashboard";
import MyAccount from "./pages/MyAccount";
import Products from "./pages/Products";
import UploadProduct from "./pages/UploadProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import Cart from "./pages/Cart";
import MyStats from "./pages/MyStats";

import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";

// Wrapper component to handle recovery links
function AppWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") setUser(session?.user ?? null);
      else if (event === "SIGNED_OUT") setUser(null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Handle Supabase recovery redirect
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");

    if (type === "recovery" && location.pathname !== "/reset-password") {
      navigate("/reset-password", { replace: true });
    }
  }, [location, navigate]);

  if (loading) return <p>Loading...</p>;

  const ProtectedRoute = ({ children }) => (user ? children : <Navigate to="/login" />);
  const showNavbar = !location.pathname.startsWith("/user");

  return (
    <CartProvider>
      <UserProvider>
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/user" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/user" /> : <SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:productId" element={<Checkout />} />
          <Route path="/thank-you/:productId" element={<ThankYou />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/user" element={<ProtectedRoute><UserDashboard user={user} /></ProtectedRoute>}>
            <Route index element={<MyAccount user={user} />} />
            <Route path="products" element={<Products user={user} />} />
            <Route path="upload-product" element={<UploadProduct user={user} />} />
            <Route path="edit-product/:id" element={<EditProduct user={user} />} />
            <Route path="mystats" element={<MyStats user={user} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </UserProvider>
    </CartProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}


