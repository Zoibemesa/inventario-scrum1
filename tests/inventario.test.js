const request = require("supertest");
const express = require("express");
const appFile = require("../src/app.js");
const app = appFile.default || appFile;

describe("API Inventario", () => {

  test("Debe listar productos", async () => {
    const res = await request(app).get("/inventario");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Debe crear un producto", async () => {
    const producto = { nombre: "Laptop", cantidad: 10 };
    const res = await request(app).post("/inventario").send(producto);
    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Laptop");
  });

});
