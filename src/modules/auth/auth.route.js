const route = require("express").Router();
const authValidation = require("./auth.validation");
const authController = require("./auth.controller");
const authentication = require("../../middleware/authentication");
const { validation } = require("../../middleware/errorhandler");

/**
 * @swagger
 * tags: Auth
 * components:
 *  schemas:
 *    Auth:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: primary key int unsigned
 *        email:
 *          type: string
 *          description: auth email
 *        password:
 *          type: string
 *          description: auth password
 *        confirm_password:
 *          type: string
 *          description: retype password
 *        createdAt:
 *          type: string
 *          description: auto generated date time
 *        updatedAt:
 *          type: string
 *          description: auto generated date time
 */

/**
 * @swagger
 * paths:
 *  /api/register:
 *    post:
 *      operationId: user_register
 *      summary: user_register
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Jhon Doe"
 *                email:
 *                  type: string
 *                  example: "jhondoe@mail.com"
 *                password:
 *                  type: string
 *                  example: "123"
 *                confirm_password:
 *                  type: string
 *                  example: "123"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Auth'
 */
route.post(
  "/register",
  authValidation.storeschema,
  validation,
  authController.register
);

/**
 * @swagger
 * paths:
 *  /api/login:
 *    post:
 *      operationId: login_user
 *      summary: login user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: "user@mail.com"
 *                password:
 *                  type: string
 *                  example: "123"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Auth'
 */
route.post("/login", authController.login);

/**
 * @swagger
 * paths:
 *  /api/logout:
 *    delete:
 *      operationId: logout_user
 *      summary: user logout endpoint
 *      tags: [Auth]
 *      responses:
 *        200:
 *          description: remove token from database and cookie
 */
route.delete("/logout", authentication, authController.logout);

/**
 * @swagger
 * paths:
 *  /api/me:
 *    get:
 *      operationId: me
 *      summary: me router
 *      tags: [Auth]
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Auth'
 */
route.get("/me", authentication, authController.me);

/**
 * @swagger
 * paths:
 *  /api/forgetpassword:
 *    post:
 *      operationId: forgetpassword_user
 *      summary: forgetpassword user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: "jhondoe@mail.com"
 *                  required: true
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Auth'
 */
route.post("/forgetpassword", authValidation.forgetschema, validation, authController.forgetPassword);

/**
 * @swagger
 * paths:
 *  /api/resetpassword/{token}:
 *    patch:
 *      operationId: resetpassword_user
 *      summary: resetpassword user
 *      tags: [Auth]
 *      parameters:
 *        - in: path
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                  example: "123"
 *                  required: true
 *                confirm_password:
 *                  type: string
 *                  example: "123"
 *                  required: true
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Auth'
 */
route.patch("/resetpassword/:token", authValidation.resetschema, validation, authController.resetPassword);

module.exports = route;
