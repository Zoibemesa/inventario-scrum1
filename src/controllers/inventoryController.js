const fs = require("fs");
const path = require("path");

const dbPath = path.resolve("src/data/productos.json");

const leerDB = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

const guardarDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const listarProductos = (req, res) => {
  const productos = leerDB();
  res.json(productos);
};

const crearProducto = (req, res) => {
  const productos = leerDB();
  const nuevo = {
    id: productos.length + 1,
    ...req.body,
  };
  productos.push(nuevo);
  guardarDB(productos);
  res.json(nuevo);
};

const actualizarProducto = (req, res) => {
  const productos = leerDB();
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  productos[index] = { ...productos[index], ...req.body };
  guardarDB(productos);
  res.json(productos[index]);
};

const eliminarProducto = (req, res) => {
  let productos = leerDB();
  const id = parseInt(req.params.id);
  productos = productos.filter(p => p.id !== id);
  guardarDB(productos);
  res.json({ mensaje: "Producto eliminado" });
};

module.exports = {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
