import { Router } from "express";
import type { Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM customer");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM customer WHERE customer_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { customer_id, customer_name, city, membership_level } = req.body;
    const result = await pool.query(
      `INSERT INTO customer (customer_id, customer_name, city, membership_level)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [customer_id, customer_name, city, membership_level]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { city, membership_level } = req.body;
    const result = await pool.query(
      `UPDATE customer SET city = $1, membership_level = $2
       WHERE customer_id = $3 RETURNING *`,
      [city, membership_level, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM customer WHERE customer_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;