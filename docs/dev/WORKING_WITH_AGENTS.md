# Working with AI Coding Agents

## Workflow

1. **Request** - Ask the agent to implement/fix something
2. **Implementation** - Agent writes the code
3. **Review** - You check the changes locally
4. **Iterate** - Request modifications if needed
5. **Commit** - You commit & push when satisfied

## Best Practices

### Clear Requests

```
✅ "Add sorting to the expenses table with column headers"
❌ "Make the table better"
```

### Incremental Changes

- Request one feature at a time
- Test after each implementation
- Easier to review and revert if needed

### Code Review

- Read all changes before committing
- Test functionality locally
- Understand the implementation
- You own the code, not the agent

### Git Operations

- Agent can suggest rebase/merge, but ask first
- You control when to commit
- Review diffs before pushing

## When to Ask Agent

✅ Implement new features
✅ Fix bugs
✅ Refactor code
✅ Write tests
✅ Update documentation

❌ Design decisions (collaborate)
❌ Architecture choices (discuss first)
❌ Breaking changes (plan together)

## Communication

- Be specific about requirements
- Provide context when needed
- Ask questions if unclear
- Request explanations for complex code
