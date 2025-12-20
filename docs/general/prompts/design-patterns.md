# Design Patterns Prompts

## Create High-Level Design Document

**Use Case**: Create a comprehensive HLD document for a new feature following the HLD-### template.

**Prompt Template**:

```
Create a high-level design document for [FEATURE_NAME] based on [REQ-ID].

Follow the structure in docs/dev/HLD_TEMPLATE.md and include:

1. **Overview**
   - Feature summary
   - Business objectives
   - Link to requirements document

2. **Architecture Decisions**
   - Technology choices with rationale
   - Design patterns used (MVC, Repository, etc.)
   - Trade-offs considered

3. **System Components**
   - Frontend components and their responsibilities
   - Backend services and APIs
   - Database schema changes
   - External integrations

4. **Data Flow**
   - User interaction flow
   - API request/response flow
   - Database operations
   - Include sequence diagrams if complex

5. **API Design**
   - Endpoint specifications
   - Request/response formats
   - Authentication/authorization
   - Error handling strategy

6. **Database Design**
   - New tables or schema changes
   - Relationships and constraints
   - Migration strategy
   - Indexing considerations

7. **Non-Functional Considerations**
   - Performance (response times, throughput)
   - Security (authentication, data protection)
   - Scalability (load handling)
   - Monitoring and logging

8. **Implementation Plan**
   - Development phases
   - Dependencies
   - Testing strategy
   - Rollout approach

Reference existing designs in docs/dev/designs/ for consistency with project patterns.
```

---

**Tips**:

- Reference existing system architecture
- Include diagrams for complex flows
- Consider backwards compatibility
- Document migration paths for schema changes
