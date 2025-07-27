import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity, updateSize } = useCartStore();

	return (
		<div className='rounded-lg border p-4 shadow-sm border-gray-300 bg-white md:p-6'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				{/* Image */}
				<div className='shrink-0 md:order-1'>
					<img className='h-20 md:h-32 rounded object-cover' src={item.image} />
				</div>

				{/* Quantity and Price Controls */}
				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-2'>
						<button
							className='inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity - 1, item.size)}
						>
							<Minus className='text-gray-800' />
						</button>
						<p className='text-gray-800'>{item.quantity}</p>
						<button
							className='inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity + 1, item.size)}
						>
							<Plus className='text-gray-800' />
						</button>
					</div>

					<div className='text-end md:order-4 md:w-32'>
						<p className='text-base font-bold text-emerald-600'>₹{item.price}</p>
					</div>
				</div>

				{/* Product Info and Size Selector */}
				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<p className='text-base font-medium text-gray-900 hover:text-emerald-600 hover:underline'>
						{item.name}
					</p>
					<p className='text-sm text-gray-500'>{item.description}</p>

					{/* ✅ Size Dropdown */}
					<div className='flex flex-col gap-1'>
						<label htmlFor={`size-${item._id}`} className='text-sm text-gray-700'>
							Select Size:
						</label>
						<select
							id={`size-${item._id}`}
							value={item.size || ""}
							onChange={(e) => updateSize(item._id, e.target.value)}
							className='w-32 p-2 bg-white text-gray-900 rounded-md border border-gray-300 focus:ring-emerald-500 focus:outline-none'
						>
							<option value="" disabled>Select size</option>
							{["S", "M", "L", "XL", "XXL"].map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>

					{/* Remove Button */}
					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium text-red-500 hover:text-red-400 hover:underline'
							onClick={() => removeFromCart(item._id)}
						>
							<Trash />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
