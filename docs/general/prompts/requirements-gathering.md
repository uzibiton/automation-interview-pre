# Requirements Gathering Prompts

## Convert Idea to Requirements Document

**Use Case**: Transform a feature idea into a structured requirements document following the REQ-### template.

**Prompt Template**:

```
I need to create a requirements document for [FEATURE_NAME].

Context:
- User need: [DESCRIBE THE PROBLEM OR NEED]
- Target users: [WHO WILL USE THIS]
- Success criteria: [HOW WE'LL MEASURE SUCCESS]

Please create a requirements document following the structure in docs/product/requirements/REQ-TEMPLATE.md. Include:
1. Overview and business justification
2. Functional requirements with acceptance criteria
3. Non-functional requirements (performance, security, usability)
4. User stories in "As a [role], I want [action], so that [benefit]" format
5. Dependencies and constraints
6. Success metrics

Reference existing requirements docs in docs/product/requirements/ for style and format consistency.
```

**Example**:

```
I need to create a requirements document for expense receipt upload.

Context:
- User need: Users want to attach photos of receipts to their expenses for record-keeping and tax purposes
- Target users: Mobile and web users who track business expenses
- Success criteria: 80% of expenses have receipt attachments within 1 month of launch

Please create a requirements document following the structure in docs/product/requirements/REQ-TEMPLATE.md...
[continues as above]
```

---

**Tips**:

- Always reference the actual template file path
- Include specific metrics when possible
- Link to related requirements if they exist
- Request traceability matrix updates for new requirements
