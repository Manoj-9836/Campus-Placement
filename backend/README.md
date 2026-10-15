# Campus Placement Backend

The backend uses Express, MongoDB Atlas through Mongoose, JWT access tokens, and rotated refresh tokens.

## Setup

From the `backend` directory:

```powershell
Copy-Item .env.example .env
npm install
npm start
```

Before starting, edit `.env`:

- Set `MONGODB_URI` to the MongoDB Atlas connection string.
- Set `MONGODB_DATABASE` to `campus_placement`. MongoDB creates this database and its collections on the first write.
- Set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to different random values of at least 32 characters.
- Add the frontend URL to `CORS_ORIGINS` if it is not `http://localhost:5173`.
- Set `CLERK_SECRET_KEY` for backend Clerk token verification. The frontend publishable key belongs in `app/.env` as `VITE_CLERK_PUBLISHABLE_KEY`.

The Atlas database user must have read/write permissions, and the machine running the API must be allowed in Atlas Network Access. Do not commit `.env`.

## Authentication Routes

Base URL: `http://localhost:5000/api/v1`

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create a student account and receive tokens |
| `POST` | `/auth/login` | No | Authenticate and receive tokens |
| `POST` | `/auth/clerk-sync` | Clerk bearer token | Verify a Clerk session and sync the current user |
| `POST` | `/auth/refresh` | No | Rotate a refresh token and receive new tokens |
| `POST` | `/auth/logout` | No | Revoke one refresh token |
| `POST` | `/auth/logout-all` | Bearer | Revoke every refresh token for the current user |
| `GET` | `/auth/me` | Bearer | Return the authenticated user's public profile |
| `GET` | `/health` | No | Check API health |

Google users are stored in the `google_users` collection, while password accounts are
stored in the `users` collection. Both collections use the same profile schema; only
password accounts store `passwordHash`. The first successful login creates the account,
and later logins update the existing record instead of creating another one.

Notes are stored in the `notes` collection. Every note contains the verified Clerk user ID
as its owner, and the notes endpoints only return or mutate notes owned by that user.

## Thunder Client Test Sequence

### Register

`POST http://localhost:5000/api/v1/auth/register`

```json
{
  "name": "Test Student",
  "email": "student@example.com",
  "password": "StrongPassword123!",
  "institution": "Campus Institute of Technology",
  "graduationYear": 2027
}
```

Save `tokens.accessToken` and `tokens.refreshToken` from the response.

### Login

`POST http://localhost:5000/api/v1/auth/login`

```json
{
  "email": "student@example.com",
  "password": "StrongPassword123!"
}
```

### Current user

`GET http://localhost:5000/api/v1/auth/me`

Header:

```text
Authorization: Bearer <accessToken>
```

### Refresh

`POST http://localhost:5000/api/v1/auth/refresh`

```json
{
  "refreshToken": "<refreshToken>"
}
```

Always replace the stored refresh token with the newly returned one. Refresh-token rotation invalidates the old token.

### Logout

`POST http://localhost:5000/api/v1/auth/logout`

```json
{
  "refreshToken": "<currentRefreshToken>"
}
```

## Security Notes

- Passwords are stored as bcrypt hashes and never returned.
- Access tokens expire quickly; refresh tokens are stored only as SHA-256 hashes in MongoDB.
- Reusing a rotated or revoked refresh token fails with `401`.
- Authentication endpoints are rate limited.
- Helmet, CORS, request-size limits, validation, and generic production error responses are enabled.
- Use HTTPS and a secret manager in production.
