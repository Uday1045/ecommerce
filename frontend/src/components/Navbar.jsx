import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();

	return (
		<header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-40 border-b border-indigo-200">
			<div className="container mx-auto px-4 py-3">
				<div className="flex flex-wrap justify-between items-center">
					<Link
						to="/"
						className="text-3xl font-extrabold bg-gradient-to-r bg-cyan-700 bg-clip-text text-transparent tracking-tight flex items-center gap-2"
					>
						Dribblr 
					</Link>

					<nav className="flex flex-wrap items-center gap-4">
						<Link
							to="/"
							className="text-gray-700 hover:text-indigo-600 font-medium transition duration-300"
						>
							Home
						</Link>

						{user && (
							<Link
								to="/cart"
								className="relative text-gray-700 hover:text-indigo-600 transition font-medium"
							>
								<ShoppingCart className="inline-block mr-1" size={20} />
								<span className="hidden sm:inline">Cart</span>
								{cart.length > 0 && (
									<span className="absolute -top-2 -left-3 bg-pink-500 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow">
										{cart.length}
									</span>
								)}
							</Link>
						)}

						{isAdmin && (
							<Link
								to="/secret-dashboard"
								className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-semibold transition flex items-center"
							>
								<Lock className="mr-2" size={18} />
								<span className="hidden sm:inline">Dashboard</span>
							</Link>
						)}

						{user ? (
							<button
								onClick={logout}
								className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center transition"
							>
								<LogOut size={18} />
								<span className="hidden sm:inline ml-2">Log Out</span>
							</button>
						) : (
							<>
								<Link
									to="/signup"
									className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center transition hover:brightness-105"
								>
									<UserPlus className="mr-2" size={18} />
									Sign Up
								</Link>
								<Link
									to="/login"
									className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center transition"
								>
									<LogIn className="mr-2" size={18} />
									Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
