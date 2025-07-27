import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product) => {
	try {
		await axios.post("/cart", { productId: product._id });
		toast.success("Product added to cart");

		// Refresh from backend to ensure correct `cart` IDs
		await get().getCartItems();
	} catch (error) {
		toast.error(error.response?.data?.message || "An error occurred");
	}
},

	removeFromCart: async (cartItemId) => {
	try {
		await axios.delete(`/cart/${cartItemId}`);

		set((prevState) => ({
			cart: prevState.cart.filter((item) => item._id !== cartItemId),
		}));

		get().calculateTotals();
	} catch (error) {
		console.error("Remove cart error:", error);
		toast.error("Failed to remove item from cart");
	}
},


	updateQuantity: async (cartItemId,quantity) => {
	if (quantity === 0) {
		get().removeFromCart(cartItemId);
		return;
	}

	await axios.put(`/cart/${cartItemId}`, { quantity});

	set((prevState) => ({
		cart: prevState.cart.map((item) =>
			item._id === cartItemId ? { ...item, quantity } : item
		),
	}));
	get().calculateTotals();
},
	updateSize: async (cartItemId, newSize) => {
	try {
		await axios.put(`/cart/size/${cartItemId}`, { newSize });
		await get().getCartItems(); // Refresh cart
		toast.success("Size updated successfully");	
	} catch (error) {
		toast.error(error.response?.data?.message || "Failed to update size");
	}
},


	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));