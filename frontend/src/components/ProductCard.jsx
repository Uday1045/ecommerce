import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		}
		addToCart(product);
	};

	return (
		<div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-transform hover:scale-[1.01]">
			<div className="relative h-64 w-full overflow-hidden">
				<img
					src={product.image}
					alt="product"
					className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
				/>
				{/* Gradient overlay */}
				{/* <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-purple-500/20 to-indigo-500/10" /> */}
			</div>

			<div className="p-5">
				<h5 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h5>

				<div className="mt-3 mb-4">
					<p className="text-2xl font-bold text-pink-600">₹{product.price}</p>
				</div>

				<button
					onClick={handleAddToCart}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-400"
				>
					<ShoppingCart size={20} />
					Add to cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
