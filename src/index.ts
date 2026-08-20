import express from "express";
import dotenv from "dotenv";
import customerRoutes from "./routes/customers";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import orderItemRoutes from "./routes/ordersItem";
import vendorRoutes from "./routes/vendors";
 
dotenv.config();
 
const app = express();
app.use(express.json());
 
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/order-items", orderItemRoutes);
app.use("/api/v1", vendorRoutes);
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 