const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Usuario , Producto, Carrito } = require('../db');
const { Router } = require('express');
const jwt = require("jsonwebtoken");
const sequelize = require("../db");
const { Sequelize } = require('sequelize');
require("dotenv").config();



router.post('/usuarios', async (req, res) => {
  const { email, nombre, password, direccion, foto } = req.body;

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el usuario con la contraseña encriptada
  try {
    const usuario = await Usuario.create({
      email,
      nombre,
      password: hashedPassword,
      direccion,
      foto,
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});





router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

router.put('/usuarios/:id', async (req, res) => {
  const { direccion, foto } = req.body;
  const id = req.params.id;

  try {
    // Buscar el usuario por ID
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar dirección y foto de perfil
    usuario.direccion = direccion;
    usuario.foto = foto;

    await usuario.save();

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

router.post("/:usuarioId/carrito/:productoId", async (req, res) => {
  try {
    const { cantidad } = req.body;
    const usuario = await Usuario.findByPk(req.params.usuarioId);
    const producto = await Producto.findByPk(req.params.productoId);

    if (!usuario) {
      return res.status(404).send("El usuario no existe");
    }

    if (!producto) {
      return res.status(404).send("El producto no existe");
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No se ha proporcionado un token de autenticación" });
    }

    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (decodedToken.email !== usuario.email) {
      return res.status(401).json({ error: "No está autorizado para agregar productos a este carrito" });
    }

    const [carrito, created] = await Carrito.findOrCreate({
      where: {
        usuario_id: usuario.id,
        producto_id: producto.id,
      },
    });
    
    if(cantidad + carrito.cantidad <= producto.existencias){
      carrito.cantidad = created ? cantidad : carrito.cantidad + cantidad;
    } else {
      return res.status(500).json({error:'No hay la cantidad necesaria disponible'})
    }
    
    return res.send(carrito);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al agregar el producto al carrito");
  }
});

router.post("/:usuarioId/compra", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.usuarioId);

    if (!usuario) {
      return res.status(404).send("El usuario no existe");
    }

    const carrito = await Carrito.findAll({
      where: {
        usuario_id: usuario.id,
      },
      include: [{
        model: Producto,
        as: 'productos', // este es el nombre de la asociación en el modelo Carrito
      },],
    });

    if (carrito.length === 0) {
      return res.status(400).send("El carrito está vacío");
    }

    const productosNoDisponibles = carrito.filter(
      (item) =>  !item.productos ||item.cantidad > item.productos.existencias
    );

    if (productosNoDisponibles.length > 0) {
      const productos = productosNoDisponibles
        .map((item) => item.productos.nombre)
        .join(", ");
      return res
        .status(400)
        .send(`No hay suficientes existencias para los productos: ${productos}`);
    }

    await sequelize.transaction(async (t) => {
      await Compra.create(
        {
          usuario_id: usuario.id,
          productos: carrito.map((item) => ({
            producto_id: item.Productos.id,
            cantidad: item.cantidad,
            precio: item.productos.precio,
          })),
        },
        { transaction: t }
      );

      await Carrito.destroy({
        where: {
          usuario_id: usuario.id,
        },
        transaction: t,
      });

      await Promise.all(
        carrito.map((item) =>
          Producto.update(
            {
              existencias: item.productos.existencias - item.cantidad,
            },
            {
              where: {
                id: item.productos_id,
              },
              transaction: t,
            }
          )
        )
      );
    });

    return res.send("Compra realizada exitosamente");
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error al realizar la compra");
  }
});

module.exports = router;

// router.get("/perfil", authMiddleware, async (req, res) => {
//   try {
//     const usuario = await Usuario.findByPk(req.usuario.id, {
//       attributes: { exclude: ["password"] },
//     });

//     res.json(usuario);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al obtener el perfil del usuario" });
//   }
// });

// router.put("/perfil", authMiddleware, async (req, res) => {
//   const { direccion, foto } = req.body;

//   try {
//     const usuario = await Usuario.findByPk(req.usuario.id);

//     if (!usuario) {
//       return res.status(404).json({ error: "Usuario no encontrado" });
//     }

//     usuario.direccion = direccion;
//     usuario.foto = foto;

//     await usuario.save();

//     res.json(usuario);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al actualizar el perfil del usuario" });
//   }
// });


module.exports = router;