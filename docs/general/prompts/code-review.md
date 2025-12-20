# Code Review Prompts

## Comprehensive PR Review

**Use Case**: Perform a thorough code review following the project's PR workflow guidelines.

**Prompt Template**:

```
Please review this code following the PR review checklist in docs/qa/PR_WORKFLOW_GUIDE.md.

Code Context:
- Feature: [FEATURE_NAME]
- Related Requirement: [REQ-ID]
- Files changed: [LIST KEY FILES]
- Type of change: [Feature/Bug Fix/Refactor/Documentation]

Review Focus Areas:

1. **Functionality**
   - Does the code meet the requirements?
   - Are edge cases handled?
   - Is error handling comprehensive?

2. **Code Quality**
   - Following project conventions and style?
   - Proper TypeScript types and interfaces?
   - Clear naming and structure?
   - Unnecessary complexity?

3. **Testing**
   - Adequate test coverage?
   - Tests follow existing patterns?
   - Both positive and negative cases tested?

4. **Security**
   - Input validation present?
   - SQL injection or XSS vulnerabilities?
   - Sensitive data properly handled?
   - Authentication/authorization checks?

5. **Performance**
   - Efficient queries and algorithms?
   - Resource leaks prevented?
   - Unnecessary API calls avoided?

6. **Documentation**
   - Complex logic commented?
   - API changes documented?
   - README updates if needed?

Provide specific feedback with line references and suggest improvements.
```

---

**Tips**:

- Focus on high-impact issues first
- Provide constructive suggestions, not just criticism
- Reference specific style guides and conventions
- Acknowledge good practices when you see them
