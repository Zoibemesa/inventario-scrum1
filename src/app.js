const express = require("express");
const inventoryRoutes = require("./routes/inventoryRoutes.js");

const app = express();
app.use(express.json());
app.use("/inventario", inventoryRoutes);

module.exports = app;
