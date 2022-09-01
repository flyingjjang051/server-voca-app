const path = require("path");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
app.set("port", process.env.PORT || 8099);
const PORT = app.get("port");
app.use(cors());
// mongodb관련 모듈
const MongoClient = require("mongodb").MongoClient;

let db = null;
MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true }, (err, client) => {
  console.log("db 연결");
  if (err) {
    console.log(err);
  } else {
    console.log("voca-app 연결");
  }
  db = client.db("voca-app");
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("hello voca-app");
});
app.post("/day/add", (req, res) => {
  db.collection("counter").findOne({ name: "count" }, (err, result) => {
    const insertData = {
      day: req.body.day,
      id: result.daysTotal,
    };
    db.collection("days").insertOne(insertData, (err, result) => {
      db.collection("counter").updateOne({ name: "count" }, { $inc: { daysTotal: 1 } }, (err, result) => {
        if (err) {
          console.log(err);
        }
        res.json({ insert: "ok" });
      });
    });
  });
  //res.json({ test: "ok" });
});

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 대기중`);
});
