# LGYM APP API v2

Backend API dla aplikacji LGYM do autoryzacji, planów treningowych, treningów, ćwiczeń, siłowni, rekordów, pomiarów, rankingu ELO i konfiguracji wersji aplikacji mobilnej.

## Produkcyjny URL

- Base URL: `https://lgym-app-api-v2.vercel.app/api`
- Przykładowy endpoint: `https://lgym-app-api-v2.vercel.app/api/login`

## Stack technologiczny

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Passport (`local` + `jwt`)
- JSON Web Token
- Vercel

## Główne funkcje

- rejestracja i logowanie użytkowników
- autoryzacja JWT
- zarządzanie planami i dniami planu
- zapis treningów i wyników serii
- rekordy siłowe i pomiary
- ranking użytkowników i historia ELO
- konfiguracja wersji aplikacji mobilnej

## Struktura projektu

```text
src/
├── config/          # konfiguracja Passport
├── controllers/     # logika endpointów
├── enums/           # enumy i komunikaty
├── helpers/         # helpery
├── interfaces/      # typy request/response
├── middlewares/     # auth i rate limiting
├── models/          # modele Mongoose
└── routes/          # definicje endpointów
```

## Wymagania

- Node.js 18+
- npm
- dostęp do MongoDB

## Zmienne środowiskowe

Utwórz `.env` w katalogu głównym projektu:

```env
MONGO_CONNECT=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=4000
```

### Opis

- `MONGO_CONNECT` - connection string do MongoDB
- `JWT_SECRET` - sekret do podpisywania i weryfikacji JWT
- `PORT` - lokalny port serwera, domyślnie `4000`

## Instalacja

```bash
npm install
```

## Uruchomienie

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

### Uruchomienie buildu lokalnie

```bash
npm run serve
```

## Skrypty npm

- `npm run dev` - uruchamia serwer przez `nodemon` i `ts-node`
- `npm run build` - czyści `dist` i buduje projekt
- `npm run build:dev` - kompiluje TypeScript
- `npm run serve` - uruchamia `npm run build:dev`, a potem `dist/index.js`
- `npm run ts.check` - sprawdza typy
- `npm test` - placeholder, obecnie zwraca błąd
- `npm run add-build` - dodaje `dist` do gita
- `npm run pre-commit` - uruchamia `ts.check`, `build` i `add-build`

## Deployment

Projekt jest przygotowany pod Vercel, a `vercel.json` kieruje cały ruch do `dist/index.js`.

## Autoryzacja

Używaj Bearer tokena:

```http
Authorization: Bearer <token>
```

### Publiczne endpointy

- `POST /api/register`
- `POST /api/login`

### Chronione endpointy

Wszystkie pozostałe endpointy pod `/api` wymagają ważnego JWT.

### Rate limiting

- ogólny limit API to `10` żądań na minutę na użytkownika
- `login` i `register` są pomijane przez ten limiter
- niepoprawny lub wygasły token zwraca `401`

## Modele danych

### User

| Pole | Typ | Opis |
|---|---|---|
| `name` | `string` | nazwa użytkownika |
| `admin` | `boolean` | flaga administratora |
| `email` | `string` | e-mail |
| `plan` | `ObjectId \| Plan` | aktywny plan |
| `profileRank` | `string` | ranga profilu |
| `avatar` | `string?` | avatar |
| `isDeleted` | `boolean` | miękkie usunięcie |
| `isTester` | `boolean` | flaga testera |
| `isVisibleInRanking` | `boolean` | widoczność w rankingu |
| `createdAt` / `updatedAt` | `Date` | znaczniki czasu |

### Plan

| Pole | Typ | Opis |
|---|---|---|
| `user` | `ObjectId \| User` | właściciel planu |
| `name` | `string` | nazwa planu |
| `isActive` | `boolean` | aktywność planu |

### PlanDay

| Pole | Typ | Opis |
|---|---|---|
| `name` | `string` | nazwa dnia |
| `plan` | `ObjectId \| Plan` | plan nadrzędny |
| `isDeleted` | `boolean` | miękkie usunięcie |
| `exercises[].series` | `number` | liczba serii |
| `exercises[].reps` | `string` | liczba powtórzeń |
| `exercises[].exercise` | `ObjectId \| Exercise` | ćwiczenie |

### Training

| Pole | Typ | Opis |
|---|---|---|
| `user` | `ObjectId \| User` | właściciel treningu |
| `type` | `ObjectId \| PlanDay` | typ treningu / dzień planu |
| `exercises` | `Array` | powiązania do wyników serii |
| `createdAt` | `Date` | data treningu |
| `gym` | `ObjectId \| Gym` | siłownia |

### Exercise

| Pole | Typ | Opis |
|---|---|---|
| `name` | `string` | nazwa ćwiczenia |
| `bodyPart` | `string` | partia mięśniowa |
| `description` | `string?` | opis |
| `image` | `string?` | obraz lub URL |
| `user` | `ObjectId \| User?` | właściciel prywatnego ćwiczenia |
| `isDeleted` | `boolean` | miękkie usunięcie |

### ExerciseScores

| Pole | Typ | Opis |
|---|---|---|
| `exercise` | `ObjectId \| Exercise` | ćwiczenie |
| `user` | `ObjectId \| User` | użytkownik |
| `reps` | `number` | powtórzenia |
| `series` | `number` | numer serii |
| `weight` | `number` | ciężar |
| `unit` | `string` | jednostka |
| `training` | `ObjectId \| Training` | trening nadrzędny |
| `createdAt` / `updatedAt` | `Date` | znaczniki czasu |

### MainRecords

| Pole | Typ | Opis |
|---|---|---|
| `user` | `ObjectId \| User` | użytkownik |
| `exercise` | `ObjectId \| Exercise` | ćwiczenie |
| `weight` | `number` | rekordowy ciężar |
| `date` | `Date` | data rekordu |
| `unit` | `string` | jednostka |
| `createdAt` / `updatedAt` | `Date` | znaczniki czasu |

### Measurements

| Pole | Typ | Opis |
|---|---|---|
| `user` | `ObjectId \| User` | użytkownik |
| `bodyPart` | `string` | mierzona część ciała |
| `unit` | `string` | jednostka pomiaru |
| `value` | `number` | wartość |
| `createdAt` / `updatedAt` | `Date` | znaczniki czasu |

### Gym

| Pole | Typ | Opis |
|---|---|---|
| `name` | `string` | nazwa siłowni |
| `user` | `ObjectId \| User` | właściciel |
| `address` | `ObjectId \| Address?` | adres |
| `isDeleted` | `boolean` | miękkie usunięcie |

### Address

| Pole | Typ | Opis |
|---|---|---|
| `city` | `string?` | miasto |
| `country` | `string?` | kraj |
| `district` | `string?` | dzielnica |
| `formattedAddress` | `string?` | pełny adres |
| `isoCountryCode` | `string?` | kod kraju |
| `name` | `string?` | nazwa lokalizacji |
| `postalCode` | `string?` | kod pocztowy |
| `region` | `string?` | region |
| `street` | `string?` | ulica |
| `streetNumber` | `string?` | numer budynku |
| `subregion` | `string?` | subregion |
| `latitude` | `number` | szerokość geograficzna |
| `longitude` | `number` | długość geograficzna |

### EloRegistry

| Pole | Typ | Opis |
|---|---|---|
| `user` | `ObjectId \| User` | użytkownik |
| `date` | `Date` | data wpisu |
| `elo` | `number` | liczba punktów ELO |
| `training` | `ObjectId \| Training?` | powiązany trening |

### AppConfig

| Pole | Typ | Opis |
|---|---|---|
| `platform` | `ANDROID \| IOS` | platforma |
| `minRequiredVersion` | `string` | minimalna wymagana wersja |
| `latestVersion` | `string` | najnowsza wersja |
| `forceUpdate` | `boolean` | wymuszenie aktualizacji |
| `updateUrl` | `string` | link do aktualizacji |
| `releaseNotes` | `string?` | opis zmian |
| `createdAt` / `updatedAt` | `Date` | znaczniki czasu |

## Dokumentacja endpointów

Wszystkie ścieżki poniżej są względem: `https://lgym-app-api-v2.vercel.app/api`

### Auth / Users

| Method | Path | Description |
|---|---|---|
| POST | `/register` | rejestracja użytkownika |
| POST | `/login` | logowanie i zwrot JWT |
| GET | `/:id/isAdmin` | sprawdza, czy użytkownik wskazany w parametrze `:id` jest adminem |
| GET | `/checkToken` | zwraca dane użytkownika z JWT |
| GET | `/getUsersRanking` | zwraca ranking użytkowników |
| GET | `/userInfo/:id/getUserEloPoints` | zwraca bieżące ELO użytkownika |
| GET | `/deleteAccount` | anonimizuje i oznacza konto jako usunięte |
| POST | `/changeVisibilityInRanking` | zmienia widoczność w rankingu |

```json
{
  "name": "john",
  "email": "john@example.com",
  "password": "secret123",
  "cpassword": "secret123",
  "isVisibleInRanking": true
}
```

### Plans

| Method | Path | Description |
|---|---|---|
| POST | `/:id/createPlan` | tworzy plan użytkownika |
| POST | `/:id/updatePlan` | aktualizuje nazwę planu |
| GET | `/:id/getPlanConfig` | zwraca aktywny plan |
| GET | `/:id/checkIsUserHavePlan` | sprawdza, czy użytkownik ma aktywny plan z dniami |
| GET | `/:id/getPlansList` | lista planów użytkownika |
| POST | `/:id/setNewActivePlan` | ustawia nowy aktywny plan |

### Plan Days

| Method | Path | Description |
|---|---|---|
| POST | `/planDay/:id/createPlanDay` | tworzy dzień planu (`id` = `planId`) |
| POST | `/planDay/updatePlanDay` | aktualizuje dzień planu |
| GET | `/planDay/:id/getPlanDay` | szczegóły dnia planu |
| GET | `/planDay/:id/getPlanDays` | wszystkie dni planu |
| GET | `/planDay/:id/getPlanDaysTypes` | typy dni aktywnego planu (`id` = `userId`) |
| GET | `/planDay/:id/deletePlanDay` | miękkie usunięcie dnia planu |
| GET | `/planDay/:id/getPlanDaysInfo` | skrót informacji o dniach planu |

### Trainings

| Method | Path | Description |
|---|---|---|
| POST | `/:id/addTraining` | zapisuje trening, wyniki serii i przelicza ELO |
| GET | `/:id/getLastTraining` | ostatni trening użytkownika |
| POST | `/:id/getTrainingByDate` | treningi z wybranego dnia |
| GET | `/:id/getTrainingDates` | wszystkie daty treningów |

```json
{
  "type": "planDayId",
  "createdAt": "2026-05-28T10:00:00.000Z",
  "gym": "gymId",
  "exercises": [
    {
      "exercise": "exerciseId",
      "series": 1,
      "reps": 8,
      "weight": 80,
      "unit": "kg"
    }
  ]
}
```

### Exercises

| Method | Path | Description |
|---|---|---|
| POST | `/exercise/addExercise` | tworzy globalne ćwiczenie |
| POST | `/exercise/:id/addUserExercise` | tworzy prywatne ćwiczenie użytkownika |
| POST | `/exercise/:id/deleteExercise` | miękko usuwa ćwiczenie |
| POST | `/exercise/updateExercise` | aktualizuje ćwiczenie |
| GET | `/exercise/:id/getAllExercises` | wszystkie ćwiczenia globalne i prywatne użytkownika; obecna implementacja nie filtruje `isDeleted` |
| POST | `/exercise/:id/getExerciseByBodyPart` | filtr po partii mięśniowej |
| GET | `/exercise/getAllGlobalExercises` | wszystkie globalne ćwiczenia |
| GET | `/exercise/:id/getAllUserExercises` | wszystkie prywatne ćwiczenia użytkownika |
| GET | `/exercise/:id/getExercise` | pobiera pojedyncze ćwiczenie |
| POST | `/exercise/:id/getLastExerciseScores` | ostatnie wyniki serii dla ćwiczenia |
| POST | `/exercise/getExerciseScoresFromTrainingByExercise` | historia wyników ćwiczenia |

### Exercise Scores

| Method | Path | Description |
|---|---|---|
| POST | `/exerciseScores/:id/getExerciseScoresChartData` | dane wykresu progresu 1RM |

### Main Records

| Method | Path | Description |
|---|---|---|
| POST | `/mainRecords/:id/addNewRecord` | dodaje nowy rekord |
| GET | `/mainRecords/:id/getMainRecordsHistory` | historia rekordów |
| GET | `/mainRecords/:id/getLastMainRecords` | najnowszy rekord dla każdego ćwiczenia |
| GET | `/mainRecords/:id/deleteMainRecord` | usuwa rekord po ID |
| POST | `/mainRecords/:id/updateMainRecords` | endpoint aktualizacji rekordu; obecna implementacja używa `:id` w zapytaniu aktualizującym |
| POST | `/mainRecords/getRecordOrPossibleRecordInExercise` | rekord lub możliwy rekord z historii serii |

### Measurements

| Method | Path | Description |
|---|---|---|
| POST | `/measurements/add` | deklarowany endpoint dodawania pomiaru; w obecnym kodzie route jest podpięty do funkcji-wrappera |
| GET | `/measurements:/:id/getMeasurementDetail` | deklarowany endpoint szczegółów pomiaru; obecny route również używa wrappera |
| GET | `/measurements/:id/getHistory` | deklarowany endpoint historii pomiarów; obecny route również używa wrappera |

> Ścieżka `measurements:/` zawiera dwukropek dokładnie tak, jak jest obecnie zdefiniowana w kodzie. Dodatkowo endpointy `measurements` są obecnie podpięte do funkcji-wrapperów, więc ich realne zachowanie wymaga poprawki w kodzie.

### Gyms

| Method | Path | Description |
|---|---|---|
| POST | `/gym/:id/addGym` | dodaje siłownię |
| POST | `/gym/:id/deleteGym` | miękko usuwa siłownię |
| GET | `/gym/:id/getGyms` | lista siłowni użytkownika |
| GET | `/gym/:id/getGym` | szczegóły siłowni |
| POST | `/gym/editGym` | aktualizuje siłownię |

### ELO Registry

| Method | Path | Description |
|---|---|---|
| GET | `/eloRegistry/:id/getEloRegistryChart` | historia ELO do wykresu |

### App Config

| Method | Path | Description |
|---|---|---|
| POST | `/appConfig/getAppVersion` | zwraca konfigurację wersji aplikacji |
| POST | `/appConfig/createNewAppVersion/:id` | tworzy nowy wpis wersji, jeśli użytkownik wskazany przez `:id` jest adminem |

```json
{
  "platform": "ANDROID",
  "minRequiredVersion": "1.0.0",
  "latestVersion": "1.2.0",
  "forceUpdate": false,
  "updateUrl": "https://example.com/app",
  "releaseNotes": "Bugfixes and improvements"
}
```

## Przykład użycia

### Login

```bash
curl -X POST "https://lgym-app-api-v2.vercel.app/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "john",
    "password": "secret123"
  }'
```

### Sprawdzenie tokena

```bash
curl "https://lgym-app-api-v2.vercel.app/api/checkToken" \
  -H "Authorization: Bearer <token>"
```

## Typowe odpowiedzi

- `Created`
- `Updated`
- `Deleted!`
- `Didnt find!`
- `Invalid JWT Token`
- `Token expired`
- `Unauthorized`
- `Forbidden`
- `All fields required`

## Uwagi implementacyjne

- wszystkie trasy są montowane pod prefiksem `/api`
- JWT jest generowany z czasem ważności `30d`
- usunięcie konta jest logiczne przez anonimizację i `isDeleted=true`
- ranking pomija konta usunięte, testerów i użytkowników ukrytych
- zapis treningu może aktualizować ELO i rangę profilu
