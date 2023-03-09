const { DataTypes } = require("sequelize");

module.exports = (sequelize, config) => {
  const Carrito = sequelize.define(
    "Carrito",
    {
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      ...config,
      timestamps: true,
    }
  );

  Carrito.associate = (models) => {
    Carrito.belongsTo(models.Usuario, { foreignKey: "usuario_id" });
    Carrito.belongsTo(models.Producto, { foreignKey: "producto_id" });
    Carrito.belongsToMany(models.Producto, { through: 'carrito_producto', as: 'productos', foreignKey: 'carrito_id' });
  };

  return Carrito;
};