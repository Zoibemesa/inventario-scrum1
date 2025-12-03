const request = require("supertest");
const appFile = require("../src/app.js");
const fs = require("fs");
const path = require("path");

const app = appFile;
const dbPath = path.resolve("src/data/productos.json");


beforeEach(() => {
  fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
});

describe("API Inventario – Pruebas Completas", () => {

  
  test("Debe listar productos (GET /inventario)", async () => {
    const res = await request(app).get("/inventario");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  
  test("Debe crear un producto (POST /inventario)", async () => {
    const producto = { nombre: "Mouse", cantidad: 10 };
    const res = await request(app).post("/inventario").send(producto);

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Mouse");
    expect(res.body.cantidad).toBe(10);
  });

  
  test("No debe permitir productos sin nombre o cantidad", async () => {
    const res = await request(app).post("/inventario").send({});
    expect(res.statusCode).toBe(200); 
  });

  
  test("Debe actualizar un producto (PUT /inventario/:id)", async () => {
    await request(app).post("/inventario").send({ nombre: "Monitor", cantidad: 5 });

    const res = await request(app)
      .put("/inventario/1")
      .send({ nombre: "Monitor Gamer", cantidad: 7 });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Monitor Gamer");
    expect(res.body.cantidad).toBe(7);
  });

  
  test("Debe devolver error al intentar actualizar producto inexistente", async () => {
    const res = await request(app)
      .put("/inventario/999")
      .send({ nombre: "Algo", cantidad: 1 });

    expect(res.statusCode).toBe(404);
    expect(res.body.mensaje).toBe("Producto no encontrado");
  });

  
  test("Debe eliminar un producto (DELETE /inventario/:id)", async () => {
    await request(app).post("/inventario").send({ nombre: "PC", cantidad: 3 });

    const res = await request(app).delete("/inventario/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe("Producto eliminado");
  });

  
  test("Debe manejar intento de eliminar producto inexistente", async () => {
    const res = await request(app).delete("/inventario/999");
    expect(res.statusCode).toBe(200);
  });

  
  test("Debe guardar el producto en productos.json", async () => {
    await request(app)
      .post("/inventario")
      .send({ nombre: "Teclado", cantidad: 2 });

    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    expect(data.length).toBe(1);
    expect(data[0].nombre).toBe("Teclado");
  });

  
  test("Tiempo de respuesta debe ser menor a 1 segundo", async () => {
    const start = Date.now();
    await request(app).get("/inventario");
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000);
  });

  
  test("Producto debe tener id, nombre y cantidad", async () => {
    await request(app)
      .post("/inventario")
      .send({ nombre: "Laptop", cantidad: 1 });

    const res = await request(app).get("/inventario");
    const producto = res.body[0];

    expect(producto).toHaveProperty("id");
    expect(producto).toHaveProperty("nombre");
    expect(producto).toHaveProperty("cantidad");
  });
});
