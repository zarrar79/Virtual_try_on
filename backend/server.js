const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const bcrypt = require("bcrypt");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const Order = require("./models/Order");
const Wishlist = require("./models/Wishlist");
const Review = require("./models/Review");
const fs = require("fs");
const path = require("path");
const { InferenceClient } = require("@huggingface/inference");
require("dns").setDefaultResultOrder("ipv4first");

const User = require("./models/User");
const Product = require("./models/Product");
const Admin = require("./models/Admin");
const authMiddleware = require("./middleware/authMiddleWare");
const { log } = require("console");

dotenv.config();



const app = express();

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        'whsec_d9c6070523b2506347cd4e8f5105d2bd65834ce2e7610ed263adec56024701a9'
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("✅ Event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const cart = metadata.cart ? JSON.parse(metadata.cart) : [];

      const order = new Order({
        user: metadata.userId,
        userName: metadata.userName,
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalAmount: session.amount_total / 100, // Stripe amounts are in cents
        currency: session.currency,
        status: "paid",
        paymentMethod: "Card",
      });

      try {
        await order.save();
        console.log("✅ Order saved after payment success");
      } catch (err) {
        console.error("❌ Order save failed:", err);
      }
    }

    // Always acknowledge Stripe
    res.json({ received: true });
  }
);

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "10mb" })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Serve static files (uploaded images)
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

const BASE_IP_ADD = "192.168.1.11";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ========================= Multer Setup ========================= //

const upload = multer({ dest: "uploads/" });
const hf = new InferenceClient(process.env.HF_TOKEN);

// ========================= User Routes ========================= //
app.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Something went wrong  " });
  }
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ========================= Admin Routes =========================== //

app.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Admin.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Admin({ name, email, password: hashedPassword });
    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Something went wrong  " });
  }
});

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ========================= Review Routes ========================= //

app.get("/all-reviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({ path: "user", select: "name email" }) // populate user name and email
      .populate({ path: "product", select: "name brand category" }) // populate product name, brand, etc.
      .populate({ path: "order", select: "status createdAt" }); // optional: populate order info

    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/review", async (req, res) => {
  try {
    const { userId, productId, orderId, rating, comment } = req.body;

    // check if order exists & delivered
    const order = await Order.findOne({ _id: orderId, user: userId, status: "delivered" });
    if (!order) return res.status(400).json({ message: "Order not delivered or not found." });

    // check if product belongs to that order
    const itemExists = order.items.some((item) => item.productId.toString() === productId);
    if (!itemExists) return res.status(400).json({ message: "Product not in this order." });

    // create review
    const review = await Review.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Review already exists for this product." });
    }
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/product/:productId
app.get("/review/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/check/:orderId/:productId/:userId
app.get("/review/check/:orderId/:productId/:userId", async (req, res) => {
  try {
    const { orderId, productId, userId } = req.params;
    const review = await Review.findOne({ order: orderId, product: productId, user: userId });
    res.json({ reviewed: !!review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ========================= Product Routes ========================= //

// CREATE product with image
app.post("/products", authMiddleware, async (req, res) => {
  try {
    const { image, name, brand, category, price, quantity, description } =
      req.body;
    console.log(req.body);

    // Check for required fields
    if (!image || !name || !category || !quantity) {
      return res.status(400).json({
        error: "Missing required fields: name, category, quantity, image",
      });
    }

    // Extract base64 data from data URI
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Define filename and path
    const filename = `${Date.now()}.png`; // or jpg
    const uploadPath = path.join(__dirname, "uploads", filename);

    // Save file to disk
    fs.writeFileSync(uploadPath, buffer);

    // Create image URL path
    const imageUrl = `/backend/uploads/${filename}`; // this path should match how your frontend accesses the file

    // Save product to DB
    const product = new Product({
      name,
      brand,
      category,
      price: Number(price),
      quantity: Number(quantity),
      description,
      imageUrl,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong: " + err.message });
  }
});

// READ all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single product
app.get("/products/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
app.put("/products/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const updateData = { name, description, price };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE product
app.delete("/products/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    console.log(deleted);

    if (!deleted)
      return res.status(404).json({ message: "Product not found " });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================= Stripe Endpoints ======================= //

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart, userId, user_name } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.map((item) => ({
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      })),
      success_url: `exp://${BASE_IP_ADD}:8081/--/redirects/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `exp://${BASE_IP_ADD}:8081/--/redirects/cancel`,
      metadata: {
        userId,
        userName: user_name,
        cart: JSON.stringify(cart), // attach cart info so webhook can use it
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 👇 mount webhook BEFORE any error handlers, AFTER json but override with raw

// ========================= Wishlist Endpoints ======================= //

// Add product to wishlist
app.post("/wishlist/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    // console.log("REQ BODY:", req.body);

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get wishlist of a user
app.post("/wishlist/get", async (req, res) => {
  try {
    const { userId } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );
    res.status(200).json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove product from wishlist
app.post("/wishlist/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear wishlist
app.post("/wishlist/clear", async (req, res) => {
  try {
    const { userId } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================= Order Endpoint ======================= //

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find(); // you can also .populate("user") if needed
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      user: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    // convert Mongoose documents to plain JSON automatically
    console.log(orders, "---->orders");

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

app.post("/order/cod", async (req, res) => {
  try {
    const { userId, user_name, cart } = req.body;
    console.log("REQ BODY:", req.body);

    if (!userId || !user_name || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    const order = new Order({
      user: userId,
      userName: user_name,
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        size: item.selectedSize || null,
        color: item.selectedColor || null,
      })),
      totalAmount,
      currency: "PKR",
      status: "pending",
      paymentMethod: "COD",
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully with Cash on Delivery",
      order,
    });
  } catch (error) {
    console.error("COD Order Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========================= Forget Password Endpoint ======================= //
// ✅ Step 1: Forgot Password (Send reset link)
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Generate JWT reset token (valid 15 mins)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `http://${BASE_IP_ADD}:5000/reset-password/${token}`;

    // Gmail transporter (587 STARTTLS)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    // console.log(transporter,'--->transporter');

    // Verify connection before sending
    // await transporter.sendMail({
    //   from: `"Test App" <${process.env.EMAIL_USER}>`,
    //   to: "shahzarrar79@gmail.com",
    //   subject: "Test Email",
    //   text: "Hello, this is a test email from Nodemailer + Gmail",
    // });

    transporter.verify((err, success) => {
      if (err) {
        console.error("❌ Verify failed:", err);
      } else {
        console.log("✅ Gmail SMTP is ready");
      }
    });

    // Send mail
    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click the link to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ msg: "Password reset email sent" });
  } catch (err) {
    console.error("❌ Forgot-password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.send("<h3>Invalid or expired link</h3>");
    }

    // ✅ Serve a simple HTML reset form
    res.send(`
      <html>
        <head>
          <title>Reset Password</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
            .container { max-width: 400px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            input { width: 100%; padding: 10px; margin: 10px 0; }
            button { padding: 10px; width: 100%; background: #007BFF; color: white; border: none; border-radius: 5px; }
            button:hover { background: #0056b3; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Reset Your Password</h2>
            <form method="POST" action="/reset-password/${token}">
              <input type="password" name="password" placeholder="Enter new password" required />
              <button type="submit">Update Password</button>
            </form>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.send("<h3>Invalid or expired link</h3>");
  }
});

app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
});

// ========================= Model Endpoint ======================= //

// ========================= Server Start ========================= //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port a  ${PORT}`));
