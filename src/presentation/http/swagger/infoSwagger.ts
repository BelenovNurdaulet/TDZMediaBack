/**
 * @swagger
 * tags:
 *   - name: Info
 *     description: Справочная информация
 *
 * components:
 *   schemas:
 *     RoleItem:
 *       type: object
 *       required: [id, code, name]
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         code:
 *           type: string
 *           example: USER
 *         name:
 *           type: string
 *           example: Пользователь
 *
 *     InfoResponse:
 *       type: object
 *       required: [roles]
 *       properties:
 *         roles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoleItem'
 *           example:
 *             - id: 1
 *               code: USER
 *               name: Пользователь
 *             - id: 2
 *               code: ADMIN
 *               name: Администратор
 *
 *     Error400:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: Некорректный запрос
 *
 * /api/info:
 *   get:
 *     tags: [Info]
 *     summary: Получить справочную информацию
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InfoResponse'
 */
