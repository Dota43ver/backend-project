const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Producto } = require('../db');
const { Router } = require('express');
const jwt = require("jsonwebtoken");

router.post("/productos", async (req, res) => {
    const { codigo, nombre, precio, existencias, isbn, autor, editorial } = req.body;
  
    try {
      const producto = await Producto.create({
        codigo,
        nombre,
        precio,
        existencias,
        isbn,
        autor,
        editorial,
      });
  
      res.status(201).json(producto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al agregar el producto" });
    }
  });

  router.patch('/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { existencias } = req.body;
  
    try {
      const producto = await Producto.findByPk(id);
  
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      producto.existencias = existencias;
      await producto.save();
  
      res.status(200).json(producto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar las existencias del producto' });
    }
  });

  router.get("/productos/all", async (req, res) => {
    try {
      const productos = await Producto.findAll({ attributes: ["nombre", "existencias"] });
      res.status(200).json(productos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });


module.exports = router;