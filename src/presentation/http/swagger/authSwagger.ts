/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Авторизация и токены
 *
 * components:
 *   schemas:
 *     Error400:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: Заполните все поля
 *
 *     TokenPair:
 *       type: object
 *       required: [accessToken, refreshToken]
 *       properties:
 *         accessToken:
 *           type: string
 *           example: string
 *         refreshToken:
 *           type: string
 *           example: string
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
 *     RegisterRequest:
 *       type: object
 *       required: [firstName, email, password]
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
 *         password:
 *           type: string
 *           example: Str1ng!Pass
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           example: ["string"]
 *         role:
 *           type: string
 *           example: USER
 *
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: user@gmail.com
 *         password:
 *           type: string
 *           example: Str1ng!Pass
 *
 *     RefreshRequest:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: string
 *
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Регистрация пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Создано
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
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Вход (возвращает access/refresh токены)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenPair'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Обновить пару токенов (берёт refreshToken из cookie или из body)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenPair'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Выход (очистка cookie)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 */
