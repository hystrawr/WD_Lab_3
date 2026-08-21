import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

//get
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.get("/customer/:customerId", async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE customer_id = $1",
      [customerId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

//post
router.post("/", async (req: Request, res: Response) => {
  const { order_id, customer_id, order_date, shipping_city } = req.body;
  if(!order_id || !customer_id || !order_date || !shipping_city) {
    return res.status(400).json({
      error: "Missing required fields."
    });
  }
  try {
    const result = await pool.query(
      `INSERT INTO orders (order_id, customer_id, order_date, shipping_city)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [order_id, customer_id, order_date, shipping_city]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

//delete
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE order_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

export default router;