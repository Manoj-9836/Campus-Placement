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
- Set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` to different random values of at least 32 characters.
- Add the frontend URL to `CORS_ORIGINS` if it is not `http://localhost:5173`.

The Atlas database user must have read/write permissions, and the machine running the API must be allowed in Atlas Network Access. Do not commit `.env`.

## Authentication Routes

Base URL: `http://localhost:5000/api/v1`

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | No | Create a student account and receive tokens |
| `POST` | `/auth/login` | No | Authenticate and receive tokens |
| `POST` | `/auth/refresh` | No | Rotate a refresh token and receive new tokens |
| `POST` | `/auth/logout` | No | Revoke one refresh token |
| `POST` | `/auth/logout-all` | Bearer | Revoke every refresh token for the current user |
| `GET` | `/auth/me` | Bearer | Return the authenticated user's public profile |
| `GET` | `/health` | No | Check API health |

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
