/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Пользователи
 *
 * components:
 *   schemas:
 *     Error400:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: Некорректный запрос
 *
 *     PublicUser:
 *       type: object
 *       required: [id, firstName, lastName, surName, email, skills, role, createdAt, updatedAt]
 *       properties:
 *         id:
 *           type: number
 *           example: 123
 *         firstName:
 *           type: string
 *           example: string
 *         lastName:
 *           type: string
 *           nullable: true
 *           example: string
 *         surName:
 *           type: string
 *           nullable: true
 *           example: string
 *         email:
 *           type: string
 *           example: user@gmail.com
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           example: ["string"]
 *         role:
 *           type: string
 *           example: USER
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-12-30T10:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-12-30T10:00:00Z
 *
 *     UsersListResponse:
 *       type: object
 *       required: [items, total]
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PublicUser'
 *         total:
 *           type: number
 *           example: 123
 *
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: string
 *         lastName:
 *           type: string
 *           nullable: true
 *           example: string
 *         surName:
 *           type: string
 *           nullable: true
 *           example: string
 *         email:
 *           type: string
 *           example: user@gmail.com
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           example: ["string"]
 *         role:
 *           type: string
 *           example: USER
 *
 *     DeleteUserResponse:
 *       type: object
 *       required: [success]
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Получить список пользователей
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *           example: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           example: desc
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           example: USER
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *       - in: query
 *         name: createdFrom
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-12-30
 *       - in: query
 *         name: createdTo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-12-30
 *       - in: query
 *         name: updatedFrom
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-12-30
 *       - in: query
 *         name: updatedTo
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-12-30
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Получить текущего пользователя
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUser'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Получить пользователя по id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *           example: 123
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUser'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 *   patch:
 *     tags: [Users]
 *     summary: Обновить пользователя по id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUser'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 *   delete:
 *     tags: [Users]
 *     summary: Удалить пользователя по id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *           example: 123
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ChangePasswordRequest:
 *       type: object
 *       required: [oldPassword, newPassword]
 *       properties:
 *         oldPassword:
 *           type: string
 *           example: Str1ng!Pass
 *         newPassword:
 *           type: string
 *           example: Str1ng!Pass
 *
 *     ResetPasswordResponse:
 *       type: object
 *       required: [success]
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 * /api/users/{id}/password/reset:
 *   patch:
 *     tags: [Users]
 *     summary: Сбросить пароль пользователя (для ADMIN или для себя)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *           example: 123
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 * /api/users/me/password/change:
 *   patch:
 *     tags: [Users]
 *     summary: Изменить пароль текущего пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 */

