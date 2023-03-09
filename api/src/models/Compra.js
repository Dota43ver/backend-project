const { DataTypes } = require("sequelize");

module.exports = (sequelize, config) => {
  const Compra = sequelize.define(
    "Compra",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distribuidor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      ...config,
      timestamps: true, // Generar campos createdAt y updatedAt
      paranoid: true, // Habilitar soft-delete (borrado lógico)
      deletedAt: "fecha_borrado", // Renombrar campo de borrado lógico
    }
  );

  return Compra;
};