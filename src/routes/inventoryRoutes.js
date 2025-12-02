const express = require("express");
const {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require("../controllers/inventoryController.js");

const router = express.Router();

router.get("/", listarProductos);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

module.exports = router;
