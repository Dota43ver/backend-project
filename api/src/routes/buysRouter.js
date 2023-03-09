const express = require('express');
const router = express.Router();
const { Compra } = require('../db');
const { Router } = require('express');


router.post("/compras", async (req, res) => {
    const {nombre, cantidad, distribuidor} = req.body;
  
    try {
      const compra = await Compra.create({
        nombre,
        cantidad,
        distribuidor
      });
  
      res.status(201).json(compra);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al agregar la compra" });
    }
  });

module.exports = router;