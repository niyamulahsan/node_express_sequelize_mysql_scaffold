const route = require("express").Router();
const userValidation = require("./user.validation");
const userController = require("./user.controller");
const authentication = require("../../middleware/authentication");
const { validation } = require("../../middleware/errorhandler");
const role = require("../../middleware/role");

/**
 * @swagger
 * tags: Users
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: primary key int unsigned
 *        name:
 *          type: string
 *          description: type name
 *        email:
 *          type: string
 *          description: test@mail.com
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
 *  /api/user:
 *    get:
 *      operationId: all_user
 *      summary: get all user
 *      tags: [Users]
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: number
 *        - in: query
 *          name: size
 *          schema:
 *            type: number
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The list of Users
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
route.get("/user", authentication, role(["admin"]), userController.index);


/**
 * @swagger
 * paths:
 *  /api/user:
 *    post:
 *      operationId: add_user
 *      summary: create user
 *      tags: [Users]
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
 *                  required: true
 *                email:
 *                  type: string
 *                  example: "jhondoe@mail.com"
 *                  required: true
 *                password:
 *                  type: string
 *                  example: "123456"
 *                  required: true
 *                confirm_password:
 *                  type: string
 *                  example: "123456"
 *                  required: true
 *                role_id:
 *                  type: number
 *                  example: 2
 *                  required: true
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
route.post("/user", authentication, role(["admin"]), userValidation.storeschema, validation, userController.store);


/**
 * @swagger
 * paths:
 *   /api/user/{id}:
 *     get:
 *       operationId: single_user
 *       summery: single user fetch
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: number
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
route.get("/user/:id", authentication, role(["admin"]), userController.show);


/**
 * @swagger
 * paths:
 *  /api/user/{id}:
 *    put:
 *      operationId: update_user
 *      summary: update user
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: number
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
 *                  example: "123456"
 *                confirm_password:
 *                  type: string
 *                  example: "123456"
 *                role_id:
 *                  type: number
 *                  example: "2"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
route.put("/user/:id", authentication, role(["admin", "user"]), userValidation.updatechema, validation, userController.update);


/**
 * @swagger
 * paths:
 *   /api/user/{id}:
 *     delete:
 *       operationId: single_user_delete
 *       summery: single user delete
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: array
 *             items:
 *               type: number
 *           description: Comma-separated list of type IDs to delete
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
route.delete("/user/:id", authentication, role(["admin"]), userController.delete);

/**
 * @swagger
 * paths:
 *  /api/user/status/{id}:
 *    put:
 *      operationId: update_user_status
 *      summary: update user status
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: number
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: "0"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
route.put("/user/status/:id", authentication, role(["admin"]), userValidation.statusschema, validation, userController.status);

module.exports = route;