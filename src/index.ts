import express from "express";
import dotenv from "dotenv";
import customerRoutes from "./routes/customers";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import orderItemRoutes from "./routes/orderItems";
import vendorRoutes from "./routes/vendors";
import supplyRoutes from "./routes/supplies";
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/order-items", orderItemRoutes)
app.use("/api/v1", vendorRoutes)
app.use("/api/v1/supplies", supplyRoutes)
 
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
 