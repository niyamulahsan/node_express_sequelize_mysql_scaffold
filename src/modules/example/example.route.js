const route = require("express").Router();
const exampleValidation = require("./example.validation");
const exampleController = require("./example.controller");
const authentication = require("../../middleware/authentication");
const { validation } = require("../../middleware/errorhandler");
const role = require("../../middleware/role");

/**
 * @swagger
 * tags: Examples
 * components:
 *  schemas:
 *    Example:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: primary key int unsigned
 *        name:
 *          type: string
 *          description: type name in english
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
 *  /api/example:
 *    get:
 *      operationId: all_example
 *      summary: get all example
 *      tags: [Examples]
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
 *          description: The list of Example
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Example'
 */
route.get("/example", exampleController.index);

/**
 * @swagger
 * paths:
 *  /api/example:
 *    post:
 *      operationId: add_example
 *      summary: create example
 *      tags: [Examples]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Regular
 *                  required: true
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Example'
 */
route.post(
  "/example",
  exampleValidation.storeschema,
  validation,
  exampleController.store
);

/**
 * @swagger
 * paths:
 *   /api/example/{id}:
 *     get:
 *       operationId: single_example
 *       summery: single example fetch
 *       tags: [Examples]
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
 *                 $ref: '#/components/schemas/Example'
 */
route.get("/example/:id", exampleController.show);

/**
 * @swagger
 * paths:
 *  /api/example/{id}:
 *    put:
 *      operationId: update_example
 *      summary: update example
 *      tags: [Examples]
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
 *                  example: Irregular
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Example'
 */
route.put(
  "/example/:id",
  exampleValidation.updatechema,
  validation,
  exampleController.update
);

/**
 * @swagger
 * paths:
 *   /api/example/{id}:
 *     delete:
 *       operationId: single_example_delete
 *       summery: single example delete
 *       tags: [Examples]
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
 *                 $ref: '#/components/schemas/Example'
 */
route.delete("/example/:id", exampleController.delete);

module.exports = route;
