# Documentation Prompts

## Generate API Endpoint Documentation

**Use Case**: Create comprehensive API documentation for new or updated endpoints.

**Prompt Template**:

```
Generate API documentation for [ENDPOINT_NAME] following the format in docs/dev/API_REFERENCE.md.

Endpoint Details:
- Method: [GET/POST/PUT/DELETE]
- Path: [/api/v1/resource]
- Service: [auth-service/api-service]
- Related Requirement: [REQ-ID]

Documentation Needed:

1. **Overview**
   - Purpose and use case
   - Authentication requirements
   - Rate limiting

2. **Request Specification**
   - Path parameters with types and validation rules
   - Query parameters with types and defaults
   - Request body schema with required/optional fields
   - Headers required

3. **Response Specification**
   - Success response (200, 201, etc.) with example JSON
   - Error responses (400, 401, 403, 404, 500) with error codes
   - Response headers

4. **Examples**
   - cURL command example
   - JavaScript/TypeScript fetch example
   - Success response example
   - Error response example

5. **Notes**
   - Business logic details
   - Common gotchas
   - Related endpoints

Use OpenAPI 3.0 format where applicable. Include realistic example data.
```

**Example**:

```
Generate API documentation for the create expense endpoint following the format in docs/dev/API_REFERENCE.md.

Endpoint Details:
- Method: POST
- Path: /api/v1/expenses
- Service: api-service
- Related Requirement: REQ-001

[continues as above]
```

---

**Tips**:

- Include realistic example data
- Document all possible error codes
- Show authentication token usage
- Link to related endpoints
