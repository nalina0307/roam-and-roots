
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Convert empty values to null
const optionalNumber = (value) =>
  value === "" || value === undefined || value === null
    ? null
    : Number(value);

// GET - Check backend and database
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.json({ message: "Backend and PostgreSQL connected!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Fetch all hotels
app.get("/api/hotels", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, name, city, description, price,
        original_price AS "originalPrice",
        website,
        rating, image, category, latitude, longitude,
        gallery_images AS "galleryImages"
      FROM hotels
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Add a hotel
app.post("/api/hotels", async (req, res) => {
  try {
    const {
      name, city, description, price, originalPrice,
      rating, image, category, latitude, longitude,
      galleryImages,website
    } = req.body;

    const result = await pool.query(
      `INSERT INTO hotels (
        name, city, description, price, original_price,
        rating, image, category, latitude, longitude,
        gallery_images,website
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        name, city, description,
        optionalNumber(price),
        optionalNumber(originalPrice),
        optionalNumber(rating),
        image, category,
        optionalNumber(latitude),
        optionalNumber(longitude),
        JSON.stringify(galleryImages || []),website || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update a hotel
app.put("/api/hotels/:id", async (req, res) => {
  try {
    const {
      name, city, description, price, originalPrice,
      rating, image, category, latitude, longitude,
      galleryImages,website
    } = req.body;

    const result = await pool.query(
      `UPDATE hotels SET
        name=$1, city=$2, description=$3, price=$4,
        original_price=$5, rating=$6, image=$7,
        category=$8, latitude=$9, longitude=$10,
        gallery_images=$11,website=$12
      WHERE id=$13
      RETURNING *`,
      [
        name, city, description,
        optionalNumber(price),
        optionalNumber(originalPrice),
        optionalNumber(rating),
        image, category,
        optionalNumber(latitude),
        optionalNumber(longitude),
        JSON.stringify(galleryImages || []),website || null,
        req.params.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remove a hotel
app.delete("/api/hotels/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM hotels WHERE id=$1 RETURNING id",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json({ message: "Hotel deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
