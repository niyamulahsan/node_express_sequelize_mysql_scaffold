"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("users", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT.UNSIGNED, // sqlite -> Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING(100), // sqlite -> Sequelize.TEXT
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(255), // sqlite -> Sequelize.TEXT
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING, // sqlite -> Sequelize.TEXT
          allowNull: false,
        },
        forget_password: {
          type: Sequelize.STRING, // sqlite -> Sequelize.TEXT
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM(["0", "1"]),
          defaultValue: "1",
          comment: "Active: 1, Inactive: 0",
        },
        role_id: {
          type: Sequelize.BIGINT.UNSIGNED, // sqlite -> Sequelize.INTEGER
          allowNull: true,
          references: {
            model: "roles",
            key: "id",
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
        password_changed_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
        password_reset_token: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        password_reset_token_expires: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        queryInterface.addIndex("users", ["name", "email"]);
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
