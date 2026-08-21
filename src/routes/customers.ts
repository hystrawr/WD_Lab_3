import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

//get
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM customer");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM customer WHERE customer_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

//post
router.post("/", async (req: Request, res: Response) => {
  const { customer_id, customer_name, city, membership_level } = req.body;

  if (!customer_id || !customer_name) {
    return res.status(400).json({
      error: "Missing required fields."
    });
  }
  try {
    const result = await pool.query(
      `INSERT INTO customer (customer_id, customer_name, city, membership_level)
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [customer_id, customer_name, city, membership_level]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

//put
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { city, membership_level } = req.body;

  if (city === undefined && membership_level === undefined) {
    return res.status(400).json({
      error: "Missing required fields.",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE customer
       SET city = COALESCE($1, city),
           membership_level = COALESCE($2, membership_level)
       WHERE customer_id = $3
       RETURNING *`,
      [city ?? null, membership_level ?? null, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

//delete
router.delete("/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM customer WHERE customer_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

export default router;