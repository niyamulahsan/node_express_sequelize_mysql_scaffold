const route = require("express").Router();
const roleValidation = require("./role.validation");
const roleController = require("./role.controller");
const authentication = require("../../middleware/authentication");
const { validation } = require("../../middleware/errorhandler");
const role = require("../../middleware/role");

/**
 * @swagger
 * tags: Roles
 * components:
 *  schemas:
 *    Role:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: primary key int unsigned
 *        name:
 *          type: string
 *          description: name will be string
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
 *  /api/role:
 *    get:
 *      operationId: all_role
 *      summary: get all role
 *      tags: [Roles]
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: number
 *        - in: query
 *          name: limit
 *          schema:
 *            type: number
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The list of Role
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Role'
 */
route.get("/role", authentication, role(['admin']), roleController.index);

/**
 * @swagger
 * paths:
 *   /api/role/{id}:
 *     get:
 *       operationId: single_role
 *       summery: single role fetch
 *       tags: [Roles]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Role'
 */
route.get("/role/:id", authentication, role(['admin']), roleController.show);

module.exports = route;
