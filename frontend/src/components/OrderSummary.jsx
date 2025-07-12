// import { motion } from "framer-motion";
// import { useCartStore } from "../stores/useCartStore";
// import { Link } from "react-router-dom";
// import { MoveRight } from "lucide-react";
// import { loadStripe } from "@stripe/stripe-js";
// import axios from "../lib/axios";

// const stripePromise = loadStripe(
// 	"pk_test_51KZYccCoOZF2UhtOwdXQl3vcizup20zqKqT9hVUIsVzsdBrhqbUI2fE0ZdEVLdZfeHjeyFXtqaNsyCJCmZWnjNZa00PzMAjlcL"
// );

// const OrderSummary = () => {
// 	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

// 	const savings = subtotal - total;
// 	const formattedSubtotal = subtotal.toFixed(2);
// 	const formattedTotal = total.toFixed(2);
// 	const formattedSavings = savings.toFixed(2);

// 	const handlePayment = async () => {
// 		const stripe = await stripePromise;
// 		const res = await axios.post("/payments/create-checkout-session", {
// 			products: cart,
// 			couponCode: coupon ? coupon.code : null,
// 		});

// 		const session = res.data;
// 		const result = await stripe.redirectToCheckout({
// 			sessionId: session.id,
// 		});

// 		if (result.error) {
// 			console.error("Error:", result.error);
// 		}
// 	};

// 	return (
// 		<motion.div
// 			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
// 			initial={{ opacity: 0, y: 20 }}
// 			animate={{ opacity: 1, y: 0 }}
// 			transition={{ duration: 0.5 }}
// 		>
// 			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

// 			<div className='space-y-4'>
// 				<div className='space-y-2'>
// 					<dl className='flex items-center justify-between gap-4'>
// 						<dt className='text-base font-normal text-gray-300'>Original price</dt>
// 						<dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
// 					</dl>

// 					{savings > 0 && (
// 						<dl className='flex items-center justify-between gap-4'>
// 							<dt className='text-base font-normal text-gray-300'>Savings</dt>
// 							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
// 						</dl>
// 					)}

// 					{coupon && isCouponApplied && (
// 						<dl className='flex items-center justify-between gap-4'>
// 							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
// 							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
// 						</dl>
// 					)}
// 					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
// 						<dt className='text-base font-bold text-white'>Total</dt>
// 						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
// 					</dl>
// 				</div>

// 				<motion.button
// 					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
// 					whileHover={{ scale: 1.05 }}
// 					whileTap={{ scale: 0.95 }}
// 					onClick={handlePayment}
// 				>
// 					Proceed to Checkout
// 				</motion.button>

// 				<div className='flex items-center justify-center gap-2'>
// 					<span className='text-sm font-normal text-gray-400'>or</span>
// 					<Link
// 						to='/'
// 						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
// 					>
// 						Continue Shopping
// 						<MoveRight size={16} />
// 					</Link>
// 				</div>
// 			</div>
// 		</motion.div>
// 	);
// };
// export default OrderSummary;



import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../lib/axios";

const loadRazorpayScript = () => {
	return new Promise((resolve) => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});
};

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		const res = await loadRazorpayScript();

		if (!res) {
			alert("Failed to load Razorpay. Are you online?");
			return;
		}

		try {
			const { data } = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon?.code || null,
			});

			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID, // or process.env if not Vite
				amount: data.amount * 100, // in paise
				currency: "INR",
				name: "My Store",
				description: "Order Payment",
				order_id: data.orderId,
				handler: async function (response) {
					try {
						const verify = await axios.post("/payments/checkout-success", {
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
						});

						if (verify.data.success) {
							alert("Payment Successful!");
							// Redirect or clear cart if needed
						} else {
							alert("Payment verification failed.");
						}
					} catch (err) {
						console.error("Verification Error", err);
						alert("Something went wrong after payment.");
					}
				},
				prefill: {
					name: "John Doe",
					email: "john@example.com",
				},
				theme: {
					color: "#10B981",
				},
			};

			const paymentObject = new window.Razorpay(options);
			paymentObject.open();
		} catch (error) {
			console.error("Payment error:", error);
			alert("Failed to create Razorpay order.");
		}
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>${formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-${formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>
								Coupon ({coupon.code})
							</dt>
							<dd className='text-base font-medium text-emerald-400'>
								-{coupon.discountPercentage}%
							</dd>
						</dl>
					)}

					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>${formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};

export default OrderSummary;
