"use strict";
const { Model } = require("sequelize");
const crypto = require("crypto");
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role }) {
      // define association here
      this.belongsTo(Role, { as: "role", foreignKey: "role_id" });
    }

    toJSON() {
      return { ...this.get(), password: undefined, forget_password: undefined };
    }

    // user instance method which directly we call with User model
    createResetPpasswordToken() {
      const resetToken = crypto.randomBytes(32).toString("hex");
      this.password_reset_token = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      this.password_reset_token_expires = moment(
        moment.now() + 10 * 60 * 1000
      ).format("YYYY-MM-DD hh:mm:ss");

      return resetToken;
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED, // sqlite -> Sequelize.INTEGER
      },
      name: {
        type: DataTypes.STRING(100), // sqlite -> Sequelize.TEXT
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255), // sqlite -> Sequelize.TEXT
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING, // sqlite -> Sequelize.TEXT
        allowNull: false,
      },
      forget_password: {
        type: DataTypes.STRING, // sqlite -> Sequelize.TEXT
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(["0", "1"]),
        defaultValue: "1",
        comment: "Active: 1, Inactive: 0",
      },
      role_id: {
        type: DataTypes.BIGINT.UNSIGNED, // sqlite -> Sequelize.INTEGER
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      password_changed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      password_reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );

  return User;
};
