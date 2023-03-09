const { DataTypes } = require("sequelize");

module.exports = (sequelize, config) => {
  const Producto = sequelize.define(
    "Producto",
    {
      codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      existencias: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      autor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      editorial: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      ...config,
      timestamps: true,
      paranoid: true,
      deletedAt: "fecha_borrado",
    }
  );

  Producto.associate = (models) => {
    Producto.hasMany(models.Compra, { as: "compras" });
    Producto.hasMany(models.Carrito, { as: "items" });
    Producto.belongsToMany(models.Carrito, { through: 'carrito_producto', as: 'carritos', foreignKey: 'producto_id' });
  };

  return Producto;
};
