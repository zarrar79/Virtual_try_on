const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const bcrypt = require("bcrypt");
const Stripe = require("stripe");
const jwt = require("jsonwebtoken");
const Order = require("./models/Order");
const fs = require("fs");
const path = require("path");
const { InferenceClient } = require("@huggingface/inference");

const User = require("./models/User");
const Product = require("./models/Product");
const Admin = require("./models/Admin");
const authMiddleware = require("./middleware/authMiddleWare");
const { log } = require("console");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "10mb" })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads"));

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
    console.log(userId, "userId");

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // ✅ Log cart to verify structure

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.map((item) => ({
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100 * 10), // ×10 for testing
        },
        quantity: item.quantity,
      })),

      success_url: "exp://192.168.1.22:8081/--/redirects/success",
      cancel_url: "exp://192.168.1.22:8081/--/redirects/cancel",
    });
    const order = new Order({
      user: userId,
      userName: user_name,
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      totalAmount: session.amount_total / 100, // convert from cents
      currency: session.currency,
      status: "paid",
    });

    await order.save();
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
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

// ========================= Model Endpoint ======================= //

// ========================= Server Start ========================= //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port a  ${PORT}`));
