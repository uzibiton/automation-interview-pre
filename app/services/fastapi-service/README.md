# FastAPI Expense Service

A modern, high-performance Python microservice for expense management built with FastAPI.

## Features

- **FastAPI Framework**: Modern, fast, and high-performance Python web framework
- **Async/Await**: Full async support with SQLAlchemy 2.0 and asyncpg
- **JWT Authentication**: Secure JWT-based authentication integrated with auth-service
- **Type Safety**: Pydantic v2 models for request/response validation
- **Auto Documentation**: Interactive OpenAPI/Swagger UI at `/api/docs`
- **PostgreSQL**: Async database connectivity
- **CORS Support**: Configured for frontend integration

## API Endpoints

### Health Check
- `GET /api/health` - Service health check

### Expenses
- `GET /api/expenses` - Get all expenses (authenticated)
- `POST /api/expenses` - Create a new expense (authenticated)
- `GET /api/expenses/{id}` - Get expense by ID (authenticated)
- `PUT /api/expenses/{id}` - Update expense (authenticated)
- `DELETE /api/expenses/{id}` - Delete expense (authenticated)

### Documentation
- `GET /api/docs` - Interactive Swagger UI
- `GET /api/redoc` - ReDoc documentation
- `GET /api/openapi.json` - OpenAPI schema

## Development

### Local Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn app.main:app --host 0.0.0.0 --port 3003 --reload
```

### Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app
```

### Docker

```bash
# Build image
docker build -t fastapi-service .

# Run container
docker run -p 3003:3003 fastapi-service
```

## Technology Stack

- **FastAPI** 0.115.5 - Web framework
- **Uvicorn** 0.32.1 - ASGI server
- **SQLAlchemy** 2.0.36 - ORM with async support
- **Pydantic** 2.10.3 - Data validation
- **PostgreSQL** - Database
- **PyJWT** - JWT authentication
- **pytest** - Testing framework

## Configuration

Environment variables:
- `PORT` - Service port (default: 3003)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name
- `JWT_SECRET` - JWT secret key
