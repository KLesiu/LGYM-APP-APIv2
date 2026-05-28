# LGYM APP API v2

Backend API for the LGYM application covering authentication, workout plans, trainings, exercises, gyms, records, measurements, ELO ranking, and mobile app version configuration.

## Production URL

- Base URL: `https://lgym-app-api-v2.vercel.app/api`
- Example endpoint: `https://lgym-app-api-v2.vercel.app/api/login`

## Tech stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Passport (`local` + `jwt`)
- JSON Web Token
- Vercel

## Main features

- user registration and login
- JWT authentication
- plan and plan-day management
- training and set score persistence
- strength records and measurements
- user ranking and ELO history
- mobile app version configuration

## Project structure

```text
src/
├── config/          # Passport configuration
├── controllers/     # Endpoint logic
├── enums/           # Enums and messages
├── helpers/         # Helpers
├── interfaces/      # Request/response typings
├── middlewares/     # Auth and rate limiting
├── models/          # Mongoose models
└── routes/          # Route definitions
```

## Requirements

- Node.js 18+
- npm
- access to MongoDB

## Environment variables

Create `.env` in the project root:

```env
MONGO_CONNECT=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=4000
```

### Description

- `MONGO_CONNECT` - MongoDB connection string
- `JWT_SECRET` - secret used to sign and verify JWT tokens
- `PORT` - local server port, defaults to `4000`

## Installation

```bash
npm install
```

## Running the project

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type check

```bash
npm run ts.check
```

### Run built app locally

```bash
npm run serve
```

## npm scripts

- `npm run dev` - starts the server with `nodemon` and `ts-node`
- `npm run build` - cleans `dist` and builds the project
- `npm run build:dev` - compiles TypeScript
- `npm run serve` - runs `npm run build:dev`, then starts `dist/index.js`
- `npm run ts.check` - runs TypeScript type checking
- `npm test` - placeholder, currently returns an error
- `npm run add-build` - adds `dist` to git
- `npm run pre-commit` - runs `ts.check`, `build`, and `add-build`

## Deployment

The project is prepared for Vercel, and `vercel.json` routes all traffic to `dist/index.js`.

## Authentication

Use a Bearer token:

```http
Authorization: Bearer <token>
```

### Public endpoints

- `POST /api/register`
- `POST /api/login`

### Protected endpoints

All other `/api` endpoints require a valid JWT.

### Rate limiting

- the general API limit is `10` requests per minute per user
- `login` and `register` are skipped by this limiter
- invalid or expired token returns `401`

## Data models

### User

| Field | Type | Description |
|---|---|---|
| `name` | `string` | username |
| `admin` | `boolean` | admin flag |
| `email` | `string` | email |
| `plan` | `ObjectId \| Plan` | active plan |
| `profileRank` | `string` | profile rank |
| `avatar` | `string?` | avatar |
| `isDeleted` | `boolean` | soft delete |
| `isTester` | `boolean` | tester flag |
| `isVisibleInRanking` | `boolean` | ranking visibility |
| `createdAt` / `updatedAt` | `Date` | timestamps |

### Plan

| Field | Type | Description |
|---|---|---|
| `user` | `ObjectId \| User` | plan owner |
| `name` | `string` | plan name |
| `isActive` | `boolean` | whether the plan is active |

### PlanDay

| Field | Type | Description |
|---|---|---|
| `name` | `string` | day name |
| `plan` | `ObjectId \| Plan` | parent plan |
| `isDeleted` | `boolean` | soft delete |
| `exercises[].series` | `number` | number of sets |
| `exercises[].reps` | `string` | reps |
| `exercises[].exercise` | `ObjectId \| Exercise` | exercise |

### Training

| Field | Type | Description |
|---|---|---|
| `user` | `ObjectId \| User` | training owner |
| `type` | `ObjectId \| PlanDay` | training type / plan day |
| `exercises` | `Array` | links to saved exercise scores |
| `createdAt` | `Date` | training date |
| `gym` | `ObjectId \| Gym` | gym |

### Exercise

| Field | Type | Description |
|---|---|---|
| `name` | `string` | exercise name |
| `bodyPart` | `string` | body part |
| `description` | `string?` | description |
| `image` | `string?` | image or URL |
| `user` | `ObjectId \| User?` | private exercise owner |
| `isDeleted` | `boolean` | soft delete |

### ExerciseScores

| Field | Type | Description |
|---|---|---|
| `exercise` | `ObjectId \| Exercise` | exercise |
| `user` | `ObjectId \| User` | user |
| `reps` | `number` | reps |
| `series` | `number` | set number |
| `weight` | `number` | weight |
| `unit` | `string` | unit |
| `training` | `ObjectId \| Training` | parent training |
| `createdAt` / `updatedAt` | `Date` | timestamps |

### MainRecords

| Field | Type | Description |
|---|---|---|
| `user` | `ObjectId \| User` | user |
| `exercise` | `ObjectId \| Exercise` | exercise |
| `weight` | `number` | record weight |
| `date` | `Date` | record date |
| `unit` | `string` | unit |
| `createdAt` / `updatedAt` | `Date` | timestamps |

### Measurements

| Field | Type | Description |
|---|---|---|
| `user` | `ObjectId \| User` | user |
| `bodyPart` | `string` | measured body part |
| `unit` | `string` | measurement unit |
| `value` | `number` | value |
| `createdAt` / `updatedAt` | `Date` | timestamps |

### Gym

| Field | Type | Description |
|---|---|---|
| `name` | `string` | gym name |
| `user` | `ObjectId \| User` | owner |
| `address` | `ObjectId \| Address?` | address |
| `isDeleted` | `boolean` | soft delete |

### Address

| Field | Type | Description |
|---|---|---|
| `city` | `string?` | city |
| `country` | `string?` | country |
| `district` | `string?` | district |
| `formattedAddress` | `string?` | formatted address |
| `isoCountryCode` | `string?` | ISO country code |
| `name` | `string?` | place name |
| `postalCode` | `string?` | postal code |
| `region` | `string?` | region |
| `street` | `string?` | street |
| `streetNumber` | `string?` | building number |
| `subregion` | `string?` | subregion |
| `latitude` | `number` | latitude |
| `longitude` | `number` | longitude |

### EloRegistry

| Field | Type | Description |
|---|---|---|
| `user` | `ObjectId \| User` | user |
| `date` | `Date` | entry date |
| `elo` | `number` | ELO points |
| `training` | `ObjectId \| Training?` | related training |

### AppConfig

| Field | Type | Description |
|---|---|---|
| `platform` | `ANDROID \| IOS` | platform |
| `minRequiredVersion` | `string` | minimum required version |
| `latestVersion` | `string` | latest version |
| `forceUpdate` | `boolean` | force update |
| `updateUrl` | `string` | update URL |
| `releaseNotes` | `string?` | release notes |
| `createdAt` / `updatedAt` | `Date` | timestamps |

## Endpoint documentation

All paths below are relative to: `https://lgym-app-api-v2.vercel.app/api`

### Auth / Users

| Method | Path | Description |
|---|---|---|
| POST | `/register` | registers a new user |
| POST | `/login` | logs in and returns a JWT |
| GET | `/:id/isAdmin` | checks whether the user identified by `:id` is an admin |
| GET | `/checkToken` | returns authenticated user data from JWT |
| GET | `/getUsersRanking` | returns public user ranking |
| GET | `/userInfo/:id/getUserEloPoints` | returns current user ELO |
| GET | `/deleteAccount` | anonymizes and marks an account as deleted |
| POST | `/changeVisibilityInRanking` | changes ranking visibility |

### Plans

| Method | Path | Description |
|---|---|---|
| POST | `/:id/createPlan` | creates a user plan |
| POST | `/:id/updatePlan` | updates a plan name |
| GET | `/:id/getPlanConfig` | returns active plan config |
| GET | `/:id/checkIsUserHavePlan` | checks if user has an active plan with plan days |
| GET | `/:id/getPlansList` | list of user plans |
| POST | `/:id/setNewActivePlan` | sets a new active plan |

### Plan Days

| Method | Path | Description |
|---|---|---|
| POST | `/planDay/:id/createPlanDay` | creates a plan day (`id` = `planId`) |
| POST | `/planDay/updatePlanDay` | updates a plan day |
| GET | `/planDay/:id/getPlanDay` | returns plan day details |
| GET | `/planDay/:id/getPlanDays` | returns all plan days |
| GET | `/planDay/:id/getPlanDaysTypes` | returns active plan day types (`id` = `userId`) |
| GET | `/planDay/:id/deletePlanDay` | soft deletes a plan day |
| GET | `/planDay/:id/getPlanDaysInfo` | returns summarized plan-day info |

### Trainings

| Method | Path | Description |
|---|---|---|
| POST | `/:id/addTraining` | saves training, exercise scores, and recalculates ELO |
| GET | `/:id/getLastTraining` | returns the latest training |
| POST | `/:id/getTrainingByDate` | trainings for a selected date |
| GET | `/:id/getTrainingDates` | all training dates |

### Exercises

| Method | Path | Description |
|---|---|---|
| POST | `/exercise/addExercise` | creates a global exercise |
| POST | `/exercise/:id/addUserExercise` | creates a user-specific exercise |
| POST | `/exercise/:id/deleteExercise` | soft deletes an exercise |
| POST | `/exercise/updateExercise` | updates an exercise |
| GET | `/exercise/:id/getAllExercises` | all global and user-specific exercises; current implementation does not filter `isDeleted` |
| POST | `/exercise/:id/getExerciseByBodyPart` | filters by body part |
| GET | `/exercise/getAllGlobalExercises` | all global exercises |
| GET | `/exercise/:id/getAllUserExercises` | all user-specific exercises |
| GET | `/exercise/:id/getExercise` | gets a single exercise |
| POST | `/exercise/:id/getLastExerciseScores` | latest set scores for an exercise |
| POST | `/exercise/getExerciseScoresFromTrainingByExercise` | training history for an exercise |

### Exercise Scores

| Method | Path | Description |
|---|---|---|
| POST | `/exerciseScores/:id/getExerciseScoresChartData` | chart data for 1RM progression |

### Main Records

| Method | Path | Description |
|---|---|---|
| POST | `/mainRecords/:id/addNewRecord` | adds a new main record |
| GET | `/mainRecords/:id/getMainRecordsHistory` | main records history |
| GET | `/mainRecords/:id/getLastMainRecords` | latest record for each exercise |
| GET | `/mainRecords/:id/deleteMainRecord` | deletes a record by ID |
| POST | `/mainRecords/:id/updateMainRecords` | record update endpoint; current implementation uses `:id` in the update query |
| POST | `/mainRecords/getRecordOrPossibleRecordInExercise` | existing or possible record based on set history |

### Measurements

| Method | Path | Description |
|---|---|---|
| POST | `/measurements/add` | declared measurement creation endpoint; in the current code the route is attached to a wrapper function |
| GET | `/measurements:/:id/getMeasurementDetail` | declared measurement details endpoint; the current route also uses a wrapper |
| GET | `/measurements/:id/getHistory` | declared measurement history endpoint; the current route also uses a wrapper |

> The `measurements:/` path includes the colon exactly as currently defined in the code. Additionally, the `measurements` endpoints are currently bound to wrapper functions, so their real runtime behavior needs a code fix.

### Gyms

| Method | Path | Description |
|---|---|---|
| POST | `/gym/:id/addGym` | adds a gym |
| POST | `/gym/:id/deleteGym` | soft deletes a gym |
| GET | `/gym/:id/getGyms` | returns user gyms |
| GET | `/gym/:id/getGym` | returns gym details |
| POST | `/gym/editGym` | updates a gym |

### ELO Registry

| Method | Path | Description |
|---|---|---|
| GET | `/eloRegistry/:id/getEloRegistryChart` | ELO history formatted for charts |

### App Config

| Method | Path | Description |
|---|---|---|
| POST | `/appConfig/getAppVersion` | returns app version configuration |
| POST | `/appConfig/createNewAppVersion/:id` | creates a new version entry if the user identified by `:id` is an admin |

## Usage example

### Login

```bash
curl -X POST "https://lgym-app-api-v2.vercel.app/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "john",
    "password": "secret123"
  }'
```

### Check token

```bash
curl "https://lgym-app-api-v2.vercel.app/api/checkToken" \
  -H "Authorization: Bearer <token>"
```

## Common responses

- `Created`
- `Updated`
- `Deleted!`
- `Didnt find!`
- `Invalid JWT Token`
- `Token expired`
- `Unauthorized`
- `Forbidden`
- `All fields required`

## Implementation notes

- all routes are mounted under `/api`
- JWT expiration is `30d`
- account deletion is logical via anonymization and `isDeleted=true`
- ranking excludes deleted users, testers, and hidden users
- saving a training may update ELO and profile rank
