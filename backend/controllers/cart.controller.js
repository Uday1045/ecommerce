import User from "../models/user.model.js";

import Product from "../models/product.model.js";

// 🛒 1. Get Cart Products
export const getCartProducts = async (req, res) => {
	try {
		const cartItems = await Promise.all(
			req.user.cartItems.map(async (item) => {
				const product = await Product.findById(item.product);
				if (!product) return null;

				return {
					...product.toJSON(),
					 _id: item._id,
					 product:item.product,
					quantity: item.quantity,
					size: item.size,
				};
			})
		);

		res.json(cartItems.filter(Boolean)); // filter out nulls
	} catch (error) {
		console.error("Error in getCartProducts:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		// check if same product + size already exists
		const existingItem = user.cartItems.find(
	item => item.product && item.product.toString() === productId
);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({
				product: productId,
				quantity: 1,
			});
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.error("Error in addToCart:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// ❌ 3. Remove All From Cart or One Product
export const removeAllFromCart = async (req, res) => {
	try {
const cartItemId = req.params.id;
    const user = await User.findById(req.user._id);
 if (!user) return res.status(404).json({ message: "User not found" });

  user.cartItems = user.cartItems.filter(
  (item) => item._id.toString() !== cartItemId
);

    await user.save();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Cart remove error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuantity = async (req, res) => {
	try {
		const cartItemId = req.params.id;
		const { quantity } = req.body;
		const user = req.user;

		const item = user.cartItems.find(
  (item) => item._id.toString() === cartItemId
);

		if (!item) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		if (quantity === 0) {
			user.cartItems = user.cartItems.filter(
  (item) => item._id.toString() === cartItemId
			);
		} else {
			item.quantity = quantity;
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.error("Error in updateQuantity:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateSize = async (req, res) => {
	try {
		const cartItemId = req.params.id;
		const { newSize } = req.body;

		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ message: "User not found" });
		

		const item = user.cartItems.find(
  (item) => item._id.toString() === cartItemId
);

		if (!item) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		item.size = newSize;
		await user.save();

		res.status(200).json({ message: "Cart item size updated" });
	} catch (error) {
		console.error("Update size error:", error);
		res.status(500).json({ message: "Server error" });
	}
};