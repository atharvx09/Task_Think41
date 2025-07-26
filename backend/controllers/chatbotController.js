const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderItem = require("../models/OrderItem");
const InventoryItem = require("../models/InventoryItem");
const User = require("../models/User");

exports.handleChatMessage = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "❗ Please enter a valid message." });
  }

  const lowerMsg = message.toLowerCase();
  const userId = req.user?.userId;

  try {
    // 🧑 Personalized greeting
    let userProfile = null;
    let greet = "";
    if (userId) {
      userProfile = await User.findOne({ id: userId });
      if (userProfile) {
        greet = `Hi ${userProfile.first_name}, `;
      }
    }

    // 1️⃣ Top 5 most sold products
    if (lowerMsg.includes("top 5") && lowerMsg.includes("sold")) {
      const topProducts = await OrderItem.aggregate([
        { $group: { _id: "$product_id", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "id",
            as: "product"
          }
        },
        { $unwind: "$product" }
      ]);

      const reply = topProducts.map((p, i) => `#${i + 1}: ${p.product.name} (sold ${p.count} times)`).join("\n");
      return res.json({ reply: greet + reply });
    }

    // 2️⃣ Order status by order ID
    if ((lowerMsg.includes("order") && lowerMsg.includes("status")) || lowerMsg.includes("where is my order")) {
      const orderIdMatch = message.match(/\d+/);
      if (!orderIdMatch) {
        return res.json({ reply: "❓ Please provide your order ID to check the status." });
      }

      const orderId = parseInt(orderIdMatch[0]);
      const order = await Order.findOne({ order_id: orderId });

      if (!order) {
        return res.json({ reply: `⚠️ No order found with ID ${orderId}.` });
      }

      let reply = `📦 Your order ${orderId} is currently *${order.status}*.`;
      if (order.delivered_at) {
        reply += ` Delivered on ${new Date(order.delivered_at).toDateString()}.`;
      } else if (order.shipped_at) {
        reply += ` Shipped on ${new Date(order.shipped_at).toDateString()}.`;
      }

      return res.json({ reply: greet + reply });
    }

    // 3️⃣ Inventory stock check
    if (lowerMsg.includes("how many") && lowerMsg.includes("left in stock")) {
      const productMatch = message.match(/how many (.+?) (are|is)? left/i);
      if (!productMatch || !productMatch[1]) {
        return res.json({ reply: "🛒 Please specify the product name to check stock." });
      }

      const productName = productMatch[1].trim();

      const count = await InventoryItem.countDocuments({
        product_name: { $regex: productName, $options: "i" },
        sold_at: null,
      });

      return res.json({
        reply: greet + `📦 There are *${count}* "${productName}" items left in stock.`
      });
    }

    // 4️⃣ Product info
    if (lowerMsg.includes("product") || lowerMsg.includes("tell me about")) {
      const productNameMatch = message.match(/about (.+)/i);
      if (!productNameMatch || !productNameMatch[1]) {
        return res.json({ reply: "🧾 Please specify the product you'd like to know about." });
      }

      const nameQuery = productNameMatch[1].trim();
      const product = await Product.findOne({ name: { $regex: nameQuery, $options: "i" } });

      if (!product) {
        return res.json({ reply: `❌ Sorry, I couldn't find any product named "${nameQuery}".` });
      }

      return res.json({
        reply: greet + `🧥 *${product.name}* by ${product.brand} costs ₹${product.retail_price}. It belongs to the *${product.department}* department.`
      });
    }

    // 🔚 Fallback Response
    return res.json({
      reply: greet + `🤖 I'm not sure how to help with that. You can ask me:
• “Top 5 most sold products”
• “What is the status of order ID 12345?”
• “How many classic T-shirts are left in stock?”
• “Tell me about blue denim jeans”`
    });

  } catch (err) {
    console.error("❌ Chatbot error:", err);
    return res.status(500).json({ reply: "🚨 Internal server error. Please try again later." });
  }
};
