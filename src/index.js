const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productsRouter = require("./routes/productsRouter.js");
const ordersRouter = require("./routes/ordersRouter.js");

const app = express();
const PORT = process.env.PORT || 4000;
const api = "/api";
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// use router
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to API Seleksi Tenaga Ahli Diskominfo Jatim",
  });
});
app.use(api, productsRouter);
app.use(api, ordersRouter);

// Running server
app.listen(PORT, () => {
  console.log(`💡 listening on http://localhost:${PORT}`);
});
