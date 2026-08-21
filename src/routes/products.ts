import { Router, Request, Response } from "express";
import { pool } from "../db";
import { Product } from '../types'

const router = Router();

//get
router.get("/", async (req: Request, res: Response) => {
  const { category } = req.query;

  try {
    let queryText = "SELECT * FROM product";
    const queryParams: string[] = [];

    if (category && typeof category === "string") {
      queryText += " WHERE category ILIKE $1";
      queryParams.push(`%${category}%`);
    }

    queryText += " ORDER BY product_id ASC";

    const result = await pool.query<Product>(queryText, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query<Product>(
      "SELECT * FROM product WHERE product_id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

//post
router.post("/", async (req: Request, res: Response) => {
  const { product_id, product_name, category, unit_price }: Product =
    req.body;

  if (
    !product_id ||
    !product_name ||
    !category ||
    unit_price === undefined
  ) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    const result = await pool.query<Product>(
      `INSERT INTO product (product_id, product_name, category, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [product_id, product_name, category, unit_price],
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Product ID already exists" });
    }
    res.status(500).json({ error: "Internal Server Error." });
  }
});

//patch
router.patch("/:id/price", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { unit_price }: Partial<Product> = req.body;

  if (unit_price === undefined) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    const result = await pool.query<Product>(
      `UPDATE product
       SET unit_price = $1
       WHERE product_id = $2
       RETURNING *`,
      [unit_price, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

export default router;