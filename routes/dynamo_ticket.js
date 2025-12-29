const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { ddb } = require("../config/dynamo");
const {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  try {
    let { title, description, active } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: "Title & description is mandatory",
      });
    }
    if (!active) {
      active = "active";
    }
    const issue = [title, description, active];
    const tickets = {
      ticketId: uuidv4(),
      title,
      description,
      active: active || "active",
      createdAt: new Date().toISOString(),
    };
    await ddb.send(
      new PutCommand({
        TableName: "Tickets",
        Item: tickets,
      })
    );
    return res.status(200).json(tickets);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: "Tickets",
      })
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

// Get specific tickets

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const result = await ddb.send(
      new ScanCommand({
        TableName: "Tickets",
        FilterExpression: "contains(title, :q) or contains(description, :q)",
        ExpressionAttributeValues: {
          ":q": query,
        },
      })
    );
    console.log(result);
    if (result.Count === 0) {
      res.status(200).json({ mgs: "data not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await ddb.send(
      new GetCommand({
        TableName: "Tickets",
        Key: { ticketId: id },
      })
    );
    if (result.Item) {
      res.status(200).json(result.Item);
    } else {
      res.status(400).send("Given ID not found");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, active } = req.body;
    const result = await ddb.send(
      new GetCommand({
        TableName: "Tickets",
        Key: { ticketId: id },
      })
    );

    if (result.Item) {
      const data = await ddb.send(
        new UpdateCommand({
          TableName: "Tickets",
          Key: { ticketId: id },
          UpdateExpression: "set title = :t, description = :d, active = :a",
          ExpressionAttributeValues: {
            ":t": title,
            ":d": description,
            ":a": active,
          },
          ReturnValues: "ALL_NEW",
        })
      );
      console.log(data);
      if (!data) {
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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ddb.send(
      new GetCommand({
        TableName: "Tickets",
        Key: { ticketId: id },
      })
    );
    if (!result.Item) {
      res.status(400).send("Given ID not found");
    } else {
      const del = await ddb.send(
        new DeleteCommand({
          TableName: "Tickets",
          Key: { ticketId: id },
        })
      );
      if (!del) {
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
