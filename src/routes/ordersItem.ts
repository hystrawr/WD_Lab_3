import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await pool.query(
      "SELECT * FROM order_item WHERE order_id = $1",
      [orderId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { order_id, product_id, quantity, discount } = req.body;
    const result = await pool.query(
      `INSERT INTO order_item (order_id, product_id, quantity, discount)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [order_id, product_id, quantity, discount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;