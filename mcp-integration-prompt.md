# MCP Server Integration Planning Prompt for Claude

You are helping me plan the integration of an MCP (Model Context Protocol) server into my interview automation application. Here's the context:

## Source Repository: basic-mcp-server

**Repository:** https://github.com/uzibiton-portfolio/basic-mcp-server

### Overview

A production-ready MCP server built with Node.js + TypeScript + Express that demonstrates:

- Building MCP servers with Node.js, TypeScript, and Express
- Per-client session management using cookies
- Deployment to Google Cloud Run
- Connection to ChatGPT, Claude, and other AI platforms

### Key Features & Architecture

- **Framework:** Express.js with raw body parsing for MCP protocol
- **Language:** TypeScript
- **Deployment:** Google Cloud Run ready (includes Dockerfile)
- **Session Management:** Cookie-based for multi-client support
- **Available Tools:**
  - `get_a_random_quote` - Get random inspirational quotes
  - `get_a_quote_by_author` - Get quotes by specific author
  - `get_a_quote_by_category` - Get quotes by category
  - `get_chatgpt_completion` - Get ChatGPT completions

### Current Structure

```
basic-mcp-server/
├── src/
│   ├── index.ts          # Server entry point
│   ├── tools.ts          # Tool implementations
│   └── chatgpt.ts        # ChatGPT integration
├── docs/                 # Comprehensive documentation
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Technical Stack

- Node.js 18+
- TypeScript 5.0+
- Express.js
- MCP Protocol (via raw JSON-RPC handling)
- Environment-based configuration (.env)

### Key Dependencies

- Express for HTTP server
- API Ninjas for quotes API
- OpenAI SDK (optional, for ChatGPT integration)

---

## Target Repository: automation-interview-pre

**Repository:** https://github.com/uzibiton/automation-interview-pre

**Context:** This is an interview automation/preparation application. The exact purpose and structure needs to be determined, but it likely involves automating interview processes or helping with interview preparation.

---

## Integration Goal

Integrate the basic-mcp-server as a dependency or service in the automation-interview-pre project to provide:

- Tool access for interview automation workflows
- Session management capabilities
- Extensible tool framework for adding custom interview-specific functionality

---

## Questions for Planning (Help me think through these)

### 1. Integration Approach

- Should the MCP server be embedded as a library/module within automation-interview-pre?
- Should it run as a separate microservice that automation-interview-pre communicates with?
- Should it be included as a git submodule?
- Or should we fork and customize the basic-mcp-server specifically for this project?

### 2. Use Cases in Interview Automation

- What specific tools/functionality does automation-interview-pre need from the MCP server?
- Should we customize the existing tools (quotes) or add new interview-specific tools?
- What data needs to be session-managed?
- Are there specific AI capabilities (ChatGPT, Claude) we need to integrate?

### 3. Deployment Strategy

- Will both services run on the same instance/container?
- Do they need separate scaling strategies?
- What are the environment configuration needs for both projects?
- Should they share the same database/session store?

### 4. Development Workflow

- How should developers set up both projects locally?
- What are the inter-service communication patterns?
- Are there API contracts to define between the two projects?
- How should we handle versioning and compatibility?

### 5. Extensibility & Customization

- Which parts of the MCP server should remain standard?
- Which parts should be customized for interview automation?
- Should we create a custom tools module specific to interview workflows?
- How do we handle future tool additions?

### 6. Dependencies & Conflicts

- Are there conflicting dependencies between the two projects?
- How do we manage package.json conflicts?
- What about TypeScript configurations?
- Node.js version compatibility?

### 7. Testing & Quality

- How should we test the integration?
- Are there specific MCP protocol validations needed?
- Should we write integration tests?
- Performance requirements?

### 8. Documentation

- What documentation needs to be created?
- API/contract documentation between services?
- Setup and development guide?
- Deployment guide?

---

## What I Need From You

Please help me create a comprehensive integration plan that includes:

1. **Recommended Architecture**
   - Pros and cons of different approaches
   - Clear recommendation based on best practices

2. **Step-by-Step Integration Plan**
   - Specific tasks in logical order
   - Code examples where relevant
   - Configuration changes needed

3. **Custom Tools for Interview Automation**
   - Suggested tools to add (beyond quotes)
   - Implementation approach
   - Data structures needed

4. **Setup & Development Guide**
   - How to set up both projects locally
   - How to test the integration
   - Troubleshooting guide

5. **Deployment Strategy**
   - How to deploy the integrated solution
   - Environment configuration
   - Scaling considerations

6. **API Contract/Documentation**
   - How the projects communicate
   - Tool specifications
   - Session management details

7. **Timeline & Dependencies**
   - What can be done in parallel
   - Critical path items
   - Risk mitigation

---

## Additional Context You Should Consider

- The basic-mcp-server is explicitly designed as a template for building custom MCP servers
- It includes comprehensive documentation and deployment guides
- The MCP Protocol is designed for multi-client support with proper session management
- Both TypeScript projects can share configuration and build tools
- Consider the learning curve and maintainability of the integrated solution

---

## Format for Response

Please structure your response as:

1. **Recommended Architecture** (with diagram/explanation)
2. **Detailed Integration Plan** (numbered steps with code examples)
3. **Custom Tool Specifications** (for interview automation)
4. **Setup Guide** (for local development)
5. **Deployment Strategy** (with configuration)
6. **Implementation Timeline** (with dependencies)
7. **Risk Mitigation** (potential issues and solutions)

Include code snippets and configuration examples where applicable. Assume a developer with good TypeScript/Node.js knowledge but who may be new to MCP servers.
