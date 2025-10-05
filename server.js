
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const aiRouter = require("./ai.js");
const paymentRouter = require("./payment.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/ai", aiRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Mr. Kelly is awake on port ${PORT}`);
});
