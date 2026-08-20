import { Router } from "express";
import type { Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/vendors", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM vendor");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/supplies/vendor/:vendorId", async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const result = await pool.query(
      "SELECT * FROM supplies WHERE vendor_id = $1",
      [vendorId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/supplies/:vendorId/:productId", async (req: Request, res: Response) => {
  try {
    const { vendorId, productId } = req.params;
    const { stock_quantity } = req.body;
    const result = await pool.query(
      `UPDATE supplies SET stock_quantity = $1
       WHERE vendor_id = $2 AND product_id = $3 RETURNING *`,
      [stock_quantity, vendorId, productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supply record not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;