const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let total = 0;

  const orderItems = cart.items.map((item) => {
    total += item.product.price * item.quantity;

    return {
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      images: item.product.images,
    };
  });

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    totalAmount: total,
    paymentMethod: "COD",
  });

  // clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};
