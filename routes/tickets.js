const express = require("express");
const router = express.Router();
const query = require("../utils/queryPromise");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    let { title, description, active } = req.body;
    console.log(req.body);
    if (!title || !description) {
      return res.status(400).json({
        message: "Title & description is mandatory",
      });
    }
    if (!active) {
      active = "active";
    }
    const issue = [title, description, active];
    const sql =
      "INSERT INTO tickets (title, description, active) VALUES (?, ?, ?)";
    const result = await query.queryPromise(sql, issue);
    return res.status(200).json({ id: result.insertId, title, description });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json(e.message);
  }
});

// Get tickets

router.get("/", auth, async (req, res) => {
  try {
    const sql = "Select * from tickets";
    const result = await query.queryPromise(sql, []);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

// Get specific tickets

router.get("/search", auth, async (req, res) => {
  try {
    const query = req.query.q;
    const sql =
      "select * from tickets where title like ? or description like ?";
    const result = await query.queryPromise(sql, [`%${query}%`, `%${query}%`]);
    if (result.length === 0) {
      res.status(200).json({ mgs: "data not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const SQL = "Select * from tickets where id=" + req.params.id;
    const result = await query.queryPromise(SQL, []);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(400).send("Given ID not found");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, active } = req.body;
    const SQL = "Select * from tickets where id= ?";
    const result = await query.queryPromise(SQL, [id]);
    if (result.length > 0) {
      const u1 =
        "Update tickets set title = ?, description = ?, active = ? where id = ?";
      const update = await query.queryPromise(u1, [
        title,
        description,
        active,
        id,
      ]);
      if (update.affectedRows == 0) {
        res.status(404).json("unable to find matching ticket");
      } else {
        res.status(200).json({
          id: id,
          title: title,
          description: description,
          active: active,
        });
      }
    } else {
      res.status(400).send("Given ID not found");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const SQL = "Select * from tickets where id= ?";
    const result = await query.queryPromise(SQL, [id]);
    if (result.length === 0) {
      res.status(400).send("Given ID not found");
    } else {
      const d = "Delete from tickets where id = ?";
      const del = await query.queryPromise(d, [id]);
      console.log(del);
      if (del.affectedRows === 0) {
        res.status(200).json("Cannot update given data");
      } else {
        res.status(200).json(del);
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
});

module.exports = router;
