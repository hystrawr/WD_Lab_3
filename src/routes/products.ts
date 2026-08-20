import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let result;
    if (category) {
      result = await pool.query(
        "SELECT * FROM product WHERE category = $1",
        [category]
      );
    } else {
      result = await pool.query("SELECT * FROM product");
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM product WHERE product_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { product_id, product_name, category, unit_price } = req.body;
    const result = await pool.query(
      `INSERT INTO product (product_id, product_name, category, unit_price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_id, product_name, category, unit_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

router.patch("/:id/price", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { unit_price } = req.body;
    const result = await pool.query(
      `UPDATE product SET unit_price = $1
       WHERE product_id = $2 RETURNING *`,
      [unit_price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;