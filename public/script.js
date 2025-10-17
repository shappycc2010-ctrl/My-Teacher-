import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { aiRouter } from "./ai.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/", aiRouter);

app.get("/", (req, res) => {
  res.send("✅ Mr. Kelly AI server is running fine!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
