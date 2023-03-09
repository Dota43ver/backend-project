const { DataTypes } = require("sequelize");

module.exports = (sequelize, config) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      ...config,
      timestamps: false, // No generar campos createdAt y updatedAt
    }
  );

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Carrito, { as: "productos", foreignKey: "usuario_id" });
  };

  return Usuario;
};