// controllers/chatbotController.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderItem = require("../models/OrderItem");
const InventoryItem = require("../models/InventoryItem");

exports.handleChatMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Please enter a message." });
  }

  const lowerMsg = message.toLowerCase();

  try {
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
      return res.json({ reply });
    }

    // 2️⃣ Check status of order
    if (lowerMsg.includes("order") && lowerMsg.includes("status")) {
      const orderIdMatch = message.match(/\d+/);
      if (!orderIdMatch) return res.json({ reply: "Please provide your order ID." });

      const orderId = parseInt(orderIdMatch[0]);
      const order = await Order.findOne({ order_id: orderId });

      if (!order) return res.json({ reply: `No order found with ID ${orderId}.` });

      let reply = `Your order ${orderId} is currently *${order.status}*.`;
      if (order.delivered_at) reply += ` Delivered on ${new Date(order.delivered_at).toDateString()}.`;
      else if (order.shipped_at) reply += ` Shipped on ${new Date(order.shipped_at).toDateString()}.`;
      return res.json({ reply });
    }

    // 3️⃣ Stock left for a product name
    if (lowerMsg.includes("how many") && lowerMsg.includes("left in stock")) {
      const productMatch = message.match(/how many (.+) are left/i);
      if (!productMatch) return res.json({ reply: "Please specify the product name." });

      const productName = productMatch[1].replace("are left in stock", "").trim();

      const count = await InventoryItem.countDocuments({
        product_name: { $regex: productName, $options: "i" },
        sold_at: null
      });

      return res.json({ reply: `🧾 There are ${count} "${productName}" items left in stock.` });
    }
    // Intent: Check Order Status
    if (lowerMsg.includes("where is my order") || lowerMsg.includes("order status")) {
      const orderIdMatch = message.match(/\d+/);
      if (!orderIdMatch) {
        return res.json({ reply: "Please provide your order ID." });
      }
      const orderId = orderIdMatch[0];
      const order = await Order.findOne({ order_id: orderId });

      if (!order) {
        return res.json({ reply: `Sorry, I couldn't find order ID ${orderId}.` });
      }

      let reply = `Your order ${orderId} is currently *${order.status}*.`;
      if (order.delivered_at) {
        reply += ` It was delivered on ${new Date(order.delivered_at).toDateString()}.`;
      } else if (order.shipped_at) {
        reply += ` It was shipped on ${new Date(order.shipped_at).toDateString()}.`;
      }
      return res.json({ reply });
    }

    // Intent: Ask about product
    if (lowerMsg.includes("product") || lowerMsg.includes("tell me about")) {
      const productNameMatch = message.match(/about (.+)/i);
      if (!productNameMatch) {
        return res.json({ reply: "Which product would you like info on?" });
      }

      const nameQuery = productNameMatch[1].trim();
      const product = await Product.findOne({ name: { $regex: nameQuery, $options: "i" } });

      if (!product) {
        return res.json({ reply: `Sorry, I couldn't find product "${nameQuery}".` });
      }

      return res.json({
        reply: `🧥 *${product.name}* by ${product.brand} costs ₹${product.retail_price}. It belongs to the "${product.department}" department.`
      });
    }

    // Fallback response
    return res.json({ reply: "I'm not sure how to help with that. You can ask about your order status or product info." });

  } catch (err) {
    console.error("Chatbot error:", err);
    return res.status(500).json({ reply: "Internal server error. Try again later." });
  }
};
