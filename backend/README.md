# Fit-Smart Backend

Backend API Fit-Smart menggunakan Express, Prisma, PostgreSQL, JWT, dan Zod.

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

## Endpoint utama

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Profile
- `GET /api/profile`
- `POST /api/profile`
- `PUT /api/profile`

### Progress
- `GET /api/progress`
- `GET /api/progress/today`
- `POST /api/progress`
- `PUT /api/progress`
- `DELETE /api/progress/:id`

### Food
- `GET /api/foods?q=&category=`
- `GET /api/foods/:id`
- `POST /api/foods`
- `PUT /api/foods/:id`
- `DELETE /api/foods/:id`

### Meal
- `GET /api/meals?date=&startDate=&endDate=`
- `GET /api/meals/:id`
- `POST /api/meals`
- `PUT /api/meals/:id`
- `POST /api/meals/:id/foods`
- `DELETE /api/meals/:id/foods/:mealFoodId`
- `DELETE /api/meals/:id`

### Workout
- `GET /api/workouts/exercises`
- `POST /api/workouts/exercises`
- `GET /api/workouts/sessions`
- `POST /api/workouts/sessions`
- `POST /api/workouts/sessions/:id/exercises`

### Recommendation
- `GET /api/recommendations/foods`
- `POST /api/recommendations/foods/generate`
- `GET /api/recommendations/workouts`
- `POST /api/recommendations/workouts/generate`

### Food Photo Analysis
- `GET /api/photos`
- `POST /api/photos` multipart form-data field `image`, atau JSON `imageUrl`
- `PUT /api/photos/:id`
- `DELETE /api/photos/:id`

Semua endpoint selain register/login membutuhkan header:

```http
Authorization: Bearer <token>
```
