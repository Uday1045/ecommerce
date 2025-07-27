import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ClubsPage from "./pages/ClubsPage";
import ClubDetailPage from "./pages/ClubDetailPage";
import CountriesPage from "./pages/CountriesPage";
import CountriesDetailPage from "./pages/CountriesDetailPage";
import CategoryPage from "./pages/CategoryPage"; 
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;
		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className="min-h-screen bg-white text-gray-800 relative overflow-hidden">
			{/* Soft gradient background overlay */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[140%] h-[140%] bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 opacity-40 rounded-full blur-3xl" />
			</div>

			<div className="relative z-50">
				<Navbar />
			</div>

			<div className="relative z-10">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
					<Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
					<Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />} />
					<Route path="/clubs" element={<ClubsPage />} />
					<Route path="/clubs/:slug" element={<ClubDetailPage />} />
					<Route path="/club/:category" element={<CategoryPage />} />
					<Route path="/countries" element={<CountriesPage />} />
					<Route path="/countries/:slug" element={<CountriesDetailPage />} />
					<Route path="/country/:category" element={<CategoryPage />} />
					<Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
					<Route path="/purchase-success" element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />} />
					<Route path="/purchase-cancel" element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />} />
				</Routes>
			</div>

			<Toaster />
		</div>
	);
}

export default App;
