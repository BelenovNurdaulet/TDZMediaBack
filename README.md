# TDZ Media Backend

Backend API проекта **TDZ Media**.  
Реализован на **Node.js + TypeScript + Prisma + PostgreSQL**.  
Запуск и окружение — через **Docker Compose**.

---

## 📦 Технологический стек

- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL 16
- Docker / Docker Compose
- JWT (Access / Refresh tokens)

---

## ⚙️ Требования

Для запуска проекта необходимо установить:

- Docker
- Docker Compose

Проверка установки:
```bash
docker -v
docker compose version
```
---
## 🚀Запуск проекта
```bash
   docker compose up --build
```
При запуске автоматически выполняется:
- генерация Prisma Client
- применение миграций
- сидинг базы данных
- запуск API сервера
---
## 👤 Тестовые пользователи
После выполнения seed-скрипта в базе создаются пользователи с ролями:
- ADMIN (admin1@gmail.com - admin25@gmail.com)
- USER (user1@gmail.com - user75@gmail.com)

Общий пароль для всех:
- 123456
---
## 🔗 Связанные репозитории

Frontend проекта:
👉 TDZ Media Frontend
https://github.com/BelenovNurdaulet/TDZMediaFront