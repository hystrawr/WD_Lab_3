import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Supplies } from "../types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Supplies>(
      `SELECT * FROM supplies`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.get("/vendor/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query<Supplies>(
      `SELECT * FROM supplies WHERE vendor_id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplies not found" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.put("/:vendorId/:productId", async (req: Request, res: Response) => {
  const { vendorId, productId } = req.params;
  const { stock_quantity }: Partial<Supplies> = req.body;

  if (stock_quantity === undefined) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    const result = await pool.query<Supplies>(
      `UPDATE supplies
       SET stock_quantity = $1
       WHERE vendor_id = $2
         AND product_id = $3
       RETURNING *`,
      [stock_quantity, vendorId, productId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplies not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

export default router;