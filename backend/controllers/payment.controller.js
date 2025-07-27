import crypto from "crypto";
import Razorpay from "razorpay";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { createRazorpayInstance } from "../lib/razorpay.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    products.forEach((product) => {
      const amount = product.price * 100; // in paise
      totalAmount += amount * product.quantity;
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }

    const instance = createRazorpayInstance();

    const orderOptions = {
      amount: totalAmount, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            product: p.product, // <--- Use p.productId from the frontend request
            quantity: p.quantity,
            price: p.price,
            size: p.size,   // <--- INCLUDE p.size here
          }))
        ),
      },
    };

    const order = await instance.orders.create(orderOptions);

    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Fetch order from Razorpay to get notes
    const instance = createRazorpayInstance();
    const order = await instance.orders.fetch(razorpay_order_id);
    const notes = order.notes;

    if (notes?.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: notes.couponCode, userId: notes.userId },
        { isActive: false }
      );
    }

    const products = JSON.parse(notes.products);

    console.log('Parsed products:', products);


    const newOrder = new Order({
      user: notes.userId,
      products: products.map((product) => ({
        size: product.size,
        product: product.product, // Access the productId with the key 'product'
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: order.amount / 100,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });
    console.log('New Order:', newOrder);
    await newOrder.save();


    res.status(200).json({
      success: true,
      message: "Payment verified and order created.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Checkout Success Error:", error);
    res.status(500).json({ message: "Error completing checkout", error: error.message });
  }
};

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    userId,
  });

  await newCoupon.save();
  return newCoupon;
}