# TASKS-003: AI Expense Input Implementation Tasks

## Overview

**Feature**: AI-Powered Conversational Expense Input & Comparative Analytics  
**Parent Issue**: [#68](https://github.com/uzibiton/automation-interview-pre/issues/68)  
**Requirements**: [REQ-003](../product/requirements/REQ-003-ai-expense-input.md)  
**Design**: [HLD-003](designs/HLD-003-ai-expense-input.md)  
**Test Plan**: [TEST-003](../qa/test-plans/TEST-003-ai-expense-input.md)

**GitHub Issues**: [View all TASK-003 issues](https://github.com/uzibiton/automation-interview-pre/issues?q=is%3Aissue+label%3ATASK-003+)

---

## Task Summary

| Phase              | Tasks  | Effort (days)  | Priority |
| ------------------ | ------ | -------------- | -------- |
| Phase 0: DB        | 4      | 2-3            | Critical |
| Phase 1: NLP       | 9      | 13-16          | Critical |
| Phase 2: UI        | 11     | 15-18          | High     |
| Phase 3: Analytics | 7      | 12-15          | Medium   |
| Phase 4: Test      | 9      | 14-17          | High     |
| **Total**          | **40** | **56-69 days** | -        |

**Estimated Total Timeline**: 11-14 weeks (56-69 working days for complete feature)

---

## Phase 0: Database Schema (2-3 days) 🔴 CRITICAL

### TASK-003-001: Create Chat Messages and Conversations Tables

**Priority**: Critical | **Effort**: 1 day | **Dependencies**: None

**Requirements**: FR-002 (Conversational AI Interface), US-006 (Chat History & Context)  
**Design**: HLD-003 Section 4.1 (Database Schema)

**Description**: Create database migrations for conversational chat storage with encryption support

**Acceptance Criteria**:

- [ ] Migration file created: `YYYYMMDDHHMMSS-CreateChatTables.ts`
- [ ] Tables created:
  - [ ] `conversations` (id, user_id, status, started_at, last_message_at, message_count, expenses_created)
  - [ ] `chat_messages` (id, user_id, conversation_id, role, content_encrypted, created_at, metadata)
- [ ] Status enum enforced: CHECK (status IN ('active', 'completed', 'abandoned'))
- [ ] Role enum enforced: CHECK (role IN ('user', 'assistant', 'system'))
- [ ] Foreign keys configured:
  - [ ] chat_messages.user_id → users.id ON DELETE CASCADE
  - [ ] chat_messages.conversation_id → conversations.id ON DELETE CASCADE
- [ ] Indexes created:
  - [ ] `idx_conversation` (conversation_id, created_at)
  - [ ] `idx_user_conversations` (user_id, created_at DESC)
  - [ ] `idx_user_messages` (user_id, created_at DESC)
- [ ] Metadata column JSONB for flexible storage (expenseId, tokens, cost)
- [ ] Migration tested: up and down

**Files**:

- `app/services/api-service/src/migrations/YYYYMMDDHHMMSS-CreateChatTables.ts`

**Labels**: `TASK-003`, `phase-0-db`, `priority-critical`, `backend`, `database`

---

### TASK-003-002: Add User Financial Context Fields

**Priority**: Critical | **Effort**: 0.5 days | **Dependencies**: None

**Requirements**: FR-003 (Financial Consultation Engine), US-003 (Expense Consultation)  
**Design**: HLD-003 Section 4.1 (User Financial Context)

**Description**: Extend users table with financial profile fields for AI consultation context

**Acceptance Criteria**:

- [ ] Migration created: `YYYYMMDDHHMMSS-AddUserFinancialContext.ts`
- [ ] Columns added to `users` table:
  - [ ] `monthly_income` DECIMAL(10,2) NULLABLE
  - [ ] `savings_balance` DECIMAL(10,2) NULLABLE
  - [ ] `credit_card_debt` DECIMAL(10,2) NULLABLE
  - [ ] `credit_limit` DECIMAL(10,2) NULLABLE
- [ ] Constraints enforced:
  - [ ] CHECK (monthly_income >= 0 OR monthly_income IS NULL)
  - [ ] CHECK (savings_balance >= 0 OR savings_balance IS NULL)
  - [ ] CHECK (credit_card_debt >= 0 OR credit_card_debt IS NULL)
  - [ ] CHECK (credit_limit >= 0 OR credit_limit IS NULL)
- [ ] Default values: NULL (user provides during setup)
- [ ] Migration tested: up and down

**Files**:

- `app/services/api-service/src/migrations/YYYYMMDDHHMMSS-AddUserFinancialContext.ts`

**Labels**: `TASK-003`, `phase-0-db`, `priority-critical`, `backend`, `database`

---

### TASK-003-003: Create AI Usage Tracking Table

**Priority**: High | **Effort**: 0.5 days | **Dependencies**: None

**Requirements**: NFR-004 (Cost Monitoring), FR-001 (NLP Parsing)  
**Design**: HLD-003 Section 4.1 (AI Usage Tracking)

**Description**: Create table for tracking AI API usage, costs, and performance metrics

**Acceptance Criteria**:

- [ ] Migration created: `YYYYMMDDHHMMSS-CreateAIUsageLogs.ts`
- [ ] Table created: `ai_usage_logs`
  - [ ] id UUID PRIMARY KEY
  - [ ] user_id UUID REFERENCES users(id) ON DELETE SET NULL
  - [ ] service VARCHAR(50) NOT NULL ('nlp_parser', 'consultation', 'analytics')
  - [ ] provider VARCHAR(20) NOT NULL ('openai', 'claude', 'gemini')
  - [ ] prompt_tokens INT
  - [ ] completion_tokens INT
  - [ ] cost_usd DECIMAL(10,6)
  - [ ] latency_ms INT
  - [ ] success BOOLEAN
  - [ ] error_message TEXT NULLABLE
  - [ ] created_at TIMESTAMP DEFAULT NOW()
- [ ] Indexes created:
  - [ ] `idx_user_usage` (user_id, created_at DESC)
  - [ ] `idx_cost_tracking` (created_at DESC, cost_usd)
  - [ ] `idx_service_performance` (service, created_at DESC)
- [ ] Migration tested: up and down

**Files**:

- `app/services/api-service/src/migrations/YYYYMMDDHHMMSS-CreateAIUsageLogs.ts`

**Labels**: `TASK-003`, `phase-0-db`, `priority-high`, `backend`, `database`, `monitoring`

---

### TASK-003-004: Create AI Insights Cache Table

**Priority**: Medium | **Effort**: 0.5 days | **Dependencies**: None

**Requirements**: FR-004 (Personal AI Analytics), US-004 (Spending Pattern Insights)  
**Design**: HLD-003 Section 3.5 (Analytics Engine)

**Description**: Create table for caching AI-generated insights to reduce API costs

**Acceptance Criteria**:

- [ ] Migration created: `YYYYMMDDHHMMSS-CreateAIInsightsCache.ts`
- [ ] Table created: `ai_insights_cache`
  - [ ] id UUID PRIMARY KEY
  - [ ] user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
  - [ ] insight_type VARCHAR(50) ('pattern', 'trend', 'prediction', 'anomaly', 'recommendation')
  - [ ] title VARCHAR(200)
  - [ ] description TEXT
  - [ ] severity VARCHAR(20) ('info', 'warning', 'critical')
  - [ ] recommendation TEXT NULLABLE
  - [ ] metadata JSONB (percentages, amounts, dates)
  - [ ] expires_at TIMESTAMP NOT NULL
  - [ ] created_at TIMESTAMP DEFAULT NOW()
- [ ] Indexes created:
  - [ ] `idx_user_insights` (user_id, created_at DESC)
  - [ ] `idx_expiration` (expires_at)
- [ ] Constraint: CHECK (severity IN ('info', 'warning', 'critical'))
- [ ] Migration tested: up and down

**Files**:

- `app/services/api-service/src/migrations/YYYYMMDDHHMMSS-CreateAIInsightsCache.ts`

**Labels**: `TASK-003`, `phase-0-db`, `priority-medium`, `backend`, `database`, `performance`

---

## Phase 1: NLP Backend (13-16 days) 🔴 CRITICAL

### TASK-003-005: Create AI Provider Adapter Interface and Configuration

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: None

**Requirements**: FR-001 (NLP), FR-003 (Consultation)  
**Design**: HLD-003 Section 3.3 (AI Provider Adapter)

**Description**: Create abstraction layer for AI providers (OpenAI, Claude, Gemini) with configuration management

**Acceptance Criteria**:

- [ ] Interface created: `AIProviderAdapter`
  - [ ] `complete(prompt, options?)` method
  - [ ] `stream(prompt, onChunk)` method
  - [ ] `estimateCost(prompt)` method
- [ ] Configuration service created:
  - [ ] Load API keys from Google Secret Manager
  - [ ] Support multiple providers via environment variable
  - [ ] Fallback provider configuration
- [ ] Types defined:
  - [ ] `CompletionOptions` (maxTokens, temperature, stop, systemPrompt)
  - [ ] `AIProvider` enum ('openai', 'claude', 'gemini')
- [ ] Environment variables:
  - [ ] `AI_PROVIDER` (default: 'openai')
  - [ ] `AI_API_KEY_SECRET` (Secret Manager path)
  - [ ] `AI_MAX_TOKENS` (default: 500)
  - [ ] `AI_TEMPERATURE` (default: 0.3)
- [ ] Unit tests: Interface contract, configuration loading
- [ ] Test coverage: >90%

**Files**:

- `app/services/api-service/src/ai/providers/ai-adapter.interface.ts`
- `app/services/api-service/src/ai/providers/ai-config.service.ts`
- `app/services/api-service/src/ai/providers/ai-config.service.spec.ts`
- `app/services/api-service/src/ai/types/completion-options.type.ts`

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-critical`, `backend`, `architecture`

---

### TASK-003-006: Implement OpenAI Provider Adapter

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: TASK-003-005

**Requirements**: FR-001 (NLP Parsing)  
**Design**: HLD-003 Section 3.3 (OpenAI Implementation)

**Description**: Implement AIProviderAdapter interface for OpenAI GPT-4

**Acceptance Criteria**:

- [ ] Class created: `OpenAIAdapter implements AIProviderAdapter`
- [ ] OpenAI SDK integrated: `npm install openai@^4.0.0`
- [ ] Methods implemented:
  - [ ] `complete()` using `client.chat.completions.create()`
  - [ ] `stream()` using streaming API
  - [ ] `estimateCost()` using tiktoken for token counting
- [ ] Model selection: GPT-4-turbo (configurable)
- [ ] Error handling: Rate limits, API errors, timeouts
- [ ] Circuit breaker pattern: Stop after 3 consecutive failures
- [ ] Response validation: JSON parsing, schema validation
- [ ] Unit tests: All methods, error scenarios, timeout handling
- [ ] Integration test: Real API call (in CI, with test key)
- [ ] Test coverage: >95%

**Files**:

- `app/services/api-service/src/ai/providers/openai.adapter.ts`
- `app/services/api-service/src/ai/providers/openai.adapter.spec.ts`
- `app/services/api-service/package.json` (update dependencies)

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-critical`, `backend`, `integration`

---

### TASK-003-007: Implement Claude and Gemini Adapters (Optional Fallback)

**Priority**: Medium | **Effort**: 2 days | **Dependencies**: TASK-003-005, TASK-003-006

**Requirements**: NFR-003 (Reliability - Fallback)  
**Design**: HLD-003 Section 3.3 (Provider Implementations)

**Description**: Implement alternative AI providers for redundancy and cost optimization

**Acceptance Criteria**:

- [ ] Class created: `ClaudeAdapter implements AIProviderAdapter`
  - [ ] Anthropic SDK: `npm install @anthropic-ai/sdk`
  - [ ] Model: Claude 3 Sonnet
  - [ ] Methods: complete(), stream(), estimateCost()
- [ ] Class created: `GeminiAdapter implements AIProviderAdapter`
  - [ ] Google Generative AI SDK: `npm install @google/generative-ai`
  - [ ] Model: Gemini Pro
  - [ ] Methods: complete(), stream(), estimateCost()
- [ ] Provider factory: Select adapter based on configuration
- [ ] Cost comparison: Log cost differences between providers
- [ ] Unit tests: Both adapters, all methods
- [ ] Integration tests: Real API calls (optional, CI only)
- [ ] Test coverage: >90%

**Files**:

- `app/services/api-service/src/ai/providers/claude.adapter.ts`
- `app/services/api-service/src/ai/providers/claude.adapter.spec.ts`
- `app/services/api-service/src/ai/providers/gemini.adapter.ts`
- `app/services/api-service/src/ai/providers/gemini.adapter.spec.ts`
- `app/services/api-service/src/ai/providers/provider.factory.ts`

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-medium`, `backend`, `reliability`

---

### TASK-003-008: Create NLP Parser Service with Prompt Engineering

**Priority**: Critical | **Effort**: 2.5 days | **Dependencies**: TASK-003-006

**Requirements**: FR-001 (NLP Parsing), US-001 (Natural Language Entry)  
**Design**: HLD-003 Section 3.1 (NLP Parser Service)

**Description**: Core service for parsing natural language expense input using AI

**Acceptance Criteria**:

- [ ] Service created: `NLPParserService`
- [ ] Methods implemented:
  - [ ] `parseExpense(input, context)` - Main parsing logic
  - [ ] `classifyCategory(description, merchant)` - Category inference
  - [ ] `inferDate(naturalDate)` - Date parsing
  - [ ] `anonymize(input)` - PII removal before sending to AI
- [ ] Prompt templates created:
  - [ ] System prompt: Define role, output format (JSON), constraints
  - [ ] Few-shot examples: 5-10 example inputs/outputs
  - [ ] Output schema: Strict JSON structure
- [ ] Date parsing supports:
  - [ ] "today", "yesterday", "tomorrow"
  - [ ] "last Monday", "next Friday"
  - [ ] "Dec 15", "12/15", "2025-12-15"
- [ ] PII anonymization:
  - [ ] Replace names with "User"
  - [ ] Remove emails
  - [ ] Remove exact addresses (keep city/region)
- [ ] Validation:
  - [ ] Amount > 0
  - [ ] Category exists in system
  - [ ] Date not in future (unless explicit)
- [ ] Unit tests: Parsing accuracy, date inference, PII removal
- [ ] Integration test: Real AI calls with test cases
- [ ] Test coverage: >90%
- [ ] Parsing accuracy target: ≥80% on test dataset

**Files**:

- `app/services/api-service/src/ai/nlp-parser.service.ts`
- `app/services/api-service/src/ai/nlp-parser.service.spec.ts`
- `app/services/api-service/src/ai/prompts/parse-expense.prompt.ts`
- `app/services/api-service/src/ai/types/parsed-expense.type.ts`

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-critical`, `backend`, `ai-ml`

---

### TASK-003-009: Create Conversation Manager Service

**Priority**: Critical | **Effort**: 2 days | **Dependencies**: TASK-003-001, TASK-003-008

**Requirements**: FR-002 (Conversational AI), US-002 (Multi-Turn Conversation)  
**Design**: HLD-003 Section 3.4 (Chat History Service)

**Description**: Manage multi-turn conversations with context retention and clarification logic

**Acceptance Criteria**:

- [ ] Service created: `ConversationManagerService`
- [ ] Methods implemented:
  - [ ] `startConversation(userId)` - Create new conversation
  - [ ] `addMessage(conversationId, role, content)` - Add message with encryption
  - [ ] `getConversationHistory(conversationId, limit)` - Retrieve messages
  - [ ] `needsClarification(parsedExpense)` - Determine if clarification needed
  - [ ] `generateClarificationQuestion(parsedExpense)` - Ask for missing data
  - [ ] `completeConversation(conversationId)` - Mark as completed
- [ ] Encryption:
  - [ ] Encrypt message content using AES-256
  - [ ] Load encryption key from Secret Manager
  - [ ] Decrypt on retrieval
- [ ] Context management:
  - [ ] Maintain context for up to 10 minutes
  - [ ] Include last 5 messages in context window
  - [ ] Clear context after expense creation
- [ ] Clarification logic:
  - [ ] Required fields: amount, description, date
  - [ ] Maximum 3 clarification questions
  - [ ] Fallback to manual form after 3 failed attempts
- [ ] Unit tests: All methods, encryption/decryption, context handling
- [ ] Integration test: Full conversation flow
- [ ] Test coverage: >90%

**Files**:

- `app/services/api-service/src/ai/conversation-manager.service.ts`
- `app/services/api-service/src/ai/conversation-manager.service.spec.ts`
- `app/services/api-service/src/ai/utils/encryption.util.ts`
- `app/services/api-service/src/ai/types/conversation-context.type.ts`

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-critical`, `backend`, `security`

---

### TASK-003-010: Create Financial Consultation Engine

**Priority**: High | **Effort**: 2.5 days | **Dependencies**: TASK-003-002, TASK-003-006

**Requirements**: FR-003 (Financial Consultation), US-003 (Expense Consultation)  
**Design**: HLD-003 Section 3.2 (Consultation Engine)

**Description**: AI-powered financial advice based on user's financial context

**Acceptance Criteria**:

- [ ] Service created: `ConsultationEngineService`
- [ ] Methods implemented:
  - [ ] `getAdvice(query, userId)` - Generate financial advice
  - [ ] `analyzeBudgetImpact(amount, userId)` - Calculate budget impact
  - [ ] `suggestAlternatives(expense, context)` - Recommend alternatives
- [ ] Context gathering:
  - [ ] Fetch monthly income, savings, debt from user profile
  - [ ] Calculate last 3 months average spending
  - [ ] Get upcoming bills (if available)
- [ ] Prompt engineering:
  - [ ] System prompt: Financial advisor role, constraints
  - [ ] Include user context in prompt
  - [ ] Request structured output: advice + reasoning + alternatives
- [ ] Safety measures:
  - [ ] Always include disclaimer
  - [ ] No investment advice
  - [ ] No tax advice
  - [ ] No legal advice
  - [ ] Focus on budgeting only
- [ ] Response structure:
  - [ ] Advice text
  - [ ] Reasoning points
  - [ ] Alternatives list
  - [ ] Budget impact percentage
  - [ ] Disclaimer
- [ ] Unit tests: Advice generation, impact calculation, safety checks
- [ ] Integration test: Real AI consultation
- [ ] Test coverage: >90%

**Files**:

- `app/services/api-service/src/ai/consultation-engine.service.ts`
- `app/services/api-service/src/ai/consultation-engine.service.spec.ts`
- `app/services/api-service/src/ai/prompts/consultation.prompt.ts`
- `app/services/api-service/src/ai/types/consultation-response.type.ts`

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-high`, `backend`, `ai-ml`

---

### TASK-003-011: Create User Context Service

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-003-002

**Requirements**: FR-003 (Consultation), FR-004 (Analytics)  
**Design**: HLD-003 Section 3.2 (Context Gathering)

**Description**: Aggregate user financial data for AI context building

**Acceptance Criteria**:

- [ ] Service created: `UserContextService`
- [ ] Methods implemented:
  - [ ] `getFinancialContext(userId)` - Aggregate financial snapshot
  - [ ] `getSpendingPatterns(userId, months)` - Analyze spending history
  - [ ] `getCreditUtilization(userId)` - Calculate credit usage %
  - [ ] `updateFinancialProfile(userId, updates)` - Update income/debt/savings
- [ ] Financial context includes:
  - [ ] Monthly income
  - [ ] Total expenses (last 3 months average)
  - [ ] Savings balance
  - [ ] Credit card debt
  - [ ] Credit utilization %
  - [ ] Top spending categories
- [ ] Caching:
  - [ ] Cache context for 5 minutes
  - [ ] Invalidate on expense creation
- [ ] Privacy:
  - [ ] No PII in context (only aggregated numbers)
  - [ ] Anonymize before passing to AI
- [ ] Unit tests: All methods, calculations, caching
- [ ] Integration test: Full context aggregation
- [ ] Test coverage: >90%

**Files**:

- `app/services/api-service/src/ai/user-context.service.ts`
- `app/services/api-service/src/ai/user-context.service.spec.ts`
- `app/services/api-service/src/ai/types/financial-context.type.ts`

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-high`, `backend`, `data-aggregation`

---

### TASK-003-012: Create AI Controller with REST Endpoints

**Priority**: Critical | **Effort**: 2 days | **Dependencies**: TASK-003-008, TASK-003-009, TASK-003-010

**Requirements**: API-001 through API-005 in REQ-003  
**Design**: HLD-003 Section 4.2 (API Specifications)

**Description**: REST API endpoints for AI expense parsing and consultation

**Acceptance Criteria**:

- [ ] Controller created: `AIController`
- [ ] Endpoints implemented:
  - [ ] `POST /api/ai/parse-expense` - Parse natural language expense (API-001)
  - [ ] `POST /api/ai/consult` - Get financial advice (API-002)
  - [ ] `GET /api/ai/insights` - Get AI-generated insights (API-003)
  - [ ] `GET /api/ai/conversations/:id` - Get conversation history (API-004)
  - [ ] `POST /api/ai/conversations/:id/messages` - Add message to conversation (API-005)
- [ ] Request/Response DTOs:
  - [ ] `ParseExpenseDto` (input, conversationId)
  - [ ] `ParsedExpenseResponseDto` (parsed, needsClarification, preview)
  - [ ] `ConsultationDto` (query, conversationId)
  - [ ] `ConsultationResponseDto` (advice, reasoning, alternatives, disclaimer)
- [ ] Guards applied:
  - [ ] `@UseGuards(JwtAuthGuard)`
  - [ ] Rate limiting: 30 requests/minute per user
- [ ] Validation pipes: `@Body(ValidationPipe)`
- [ ] Error handling: Graceful fallback on AI failure
- [ ] Response formatting: Consistent structure
- [ ] Integration tests: All endpoints (Supertest)
- [ ] Test coverage: 100% of endpoints

**Files**:

- `app/services/api-service/src/ai/ai.controller.ts`
- `app/services/api-service/src/ai/ai.controller.spec.ts`
- `app/services/api-service/src/ai/dto/parse-expense.dto.ts`
- `app/services/api-service/src/ai/dto/consultation.dto.ts`

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-critical`, `backend`, `api`

---

### TASK-003-013: Implement AI Usage Tracking and Cost Monitoring

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-003-003, TASK-003-006

**Requirements**: NFR-004 (Cost Monitoring)  
**Design**: HLD-003 Section 4.1 (AI Usage Tracking)

**Description**: Track AI API usage, costs, and performance metrics

**Acceptance Criteria**:

- [ ] Service created: `AIUsageTrackingService`
- [ ] Methods implemented:
  - [ ] `logUsage(userId, service, provider, tokens, cost, latency, success)` - Log API call
  - [ ] `getUserUsage(userId, period)` - Get user's usage stats
  - [ ] `getTotalCosts(period)` - Get total costs for date range
  - [ ] `getPerformanceMetrics(service)` - Get latency/success rate
- [ ] Automatic tracking:
  - [ ] Wrap all AI provider calls
  - [ ] Log prompt tokens, completion tokens
  - [ ] Calculate cost based on provider pricing
  - [ ] Record latency (ms)
  - [ ] Log success/failure
- [ ] Cost calculation:
  - [ ] OpenAI: $0.01/1K input tokens, $0.03/1K output tokens
  - [ ] Claude: $0.008/1K input, $0.024/1K output
  - [ ] Gemini: $0.00025/1K input, $0.0005/1K output
- [ ] Alerts:
  - [ ] Log warning if user exceeds $5/day
  - [ ] Log error if total costs exceed $100/day
- [ ] Dashboard support:
  - [ ] Aggregate stats by user, service, provider
  - [ ] Cost trends over time
- [ ] Unit tests: Tracking logic, cost calculations
- [ ] Integration test: Full tracking flow
- [ ] Test coverage: >90%

**Files**:

- `app/services/api-service/src/ai/ai-usage-tracking.service.ts`
- `app/services/api-service/src/ai/ai-usage-tracking.service.spec.ts`
- `app/services/api-service/src/ai/interceptors/usage-tracking.interceptor.ts`

**Labels**: `TASK-003`, `phase-1-nlp`, `priority-high`, `backend`, `monitoring`, `cost-optimization`

---

## Phase 2: Frontend UI (10-13 days) 🔴 HIGH

### TASK-003-014: Create AI Chat Interface Component

**Priority**: High | **Effort**: 2.5 days | **Dependencies**: TASK-003-012

**Requirements**: FR-002 (Conversational AI), US-001 (Natural Language Entry), US-002 (Multi-Turn)  
**Design**: HLD-003 Section 5.1 (Chat Component Architecture)

**Description**: Build conversational chat interface for AI expense input

**Acceptance Criteria**:

- [ ] Component created: `AIExpenseChatModal.tsx`
- [ ] UI elements implemented:
  - [ ] Message list with auto-scroll
  - [ ] Message bubbles (user: right-aligned blue, AI: left-aligned gray)
  - [ ] Input field with send button
  - [ ] "New Expense" trigger button in header/sidebar
- [ ] Message types supported:
  - [ ] User text messages
  - [ ] AI text responses
  - [ ] AI clarification questions
  - [ ] Expense preview cards (embedded in chat)
  - [ ] Error messages
  - [ ] System messages ("Conversation started")
- [ ] Real-time features:
  - [ ] Typing indicator ("AI is thinking...")
  - [ ] Message timestamps
  - [ ] Auto-scroll to latest message
- [ ] Keyboard shortcuts:
  - [ ] Enter to send (Shift+Enter for newline)
  - [ ] Esc to close modal
- [ ] Accessibility:
  - [ ] ARIA labels for screen readers
  - [ ] Keyboard navigation support
  - [ ] Focus management
- [ ] Mobile responsive: Full-screen on mobile, modal on desktop
- [ ] Component tests: Render, send message, scroll behavior
- [ ] Test coverage: >85%

**Files**:

- `app/frontend/src/components/ai/AIExpenseChatModal.tsx`
- `app/frontend/src/components/ai/AIExpenseChatModal.test.tsx`
- `app/frontend/src/components/ai/MessageBubble.tsx`
- `app/frontend/src/components/ai/TypingIndicator.tsx`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-high`, `frontend`, `component`

---

### TASK-003-015: Create Expense Preview Card Component

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-003-014

**Requirements**: FR-001 (NLP Parsing), US-001 (Natural Language Entry)  
**Design**: HLD-003 Section 5.2 (Expense Preview)

**Description**: Display parsed expense data for user confirmation before creation

**Acceptance Criteria**:

- [ ] Component created: `ExpensePreviewCard.tsx`
- [ ] Display fields:
  - [ ] Amount (highlighted, large font)
  - [ ] Description/Merchant
  - [ ] Category (with icon)
  - [ ] Date (formatted)
  - [ ] Confidence score (if provided by AI)
- [ ] Visual indicators:
  - [ ] Green checkmark for confirmed fields
  - [ ] Yellow warning for low-confidence fields
  - [ ] Red exclamation for missing required fields
- [ ] Action buttons:
  - [ ] "Confirm & Create" (primary button)
  - [ ] "Edit" (opens inline form to modify)
  - [ ] "Cancel" (dismisses preview)
- [ ] Inline editing:
  - [ ] Click field to edit
  - [ ] Dropdown for category
  - [ ] Date picker for date
  - [ ] Auto-save on blur
- [ ] Loading state: Skeleton loader while AI is parsing
- [ ] Error state: Display parsing errors with retry option
- [ ] Component tests: Render, edit, confirm, cancel
- [ ] Test coverage: >85%

**Files**:

- `app/frontend/src/components/ai/ExpensePreviewCard.tsx`
- `app/frontend/src/components/ai/ExpensePreviewCard.test.tsx`
- `app/frontend/src/components/ai/ExpenseFieldEditor.tsx`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-high`, `frontend`, `component`

---

### TASK-003-016: Create Financial Consultation Widget

**Priority**: High | **Effort**: 2 days | **Dependencies**: TASK-003-014

**Requirements**: FR-003 (Financial Consultation), US-003 (Expense Consultation)  
**Design**: HLD-003 Section 5.3 (Consultation UI)

**Description**: Display AI-generated financial advice in chat interface

**Acceptance Criteria**:

- [ ] Component created: `ConsultationWidget.tsx`
- [ ] Display sections:
  - [ ] Advice summary (highlighted card)
  - [ ] Reasoning points (expandable list)
  - [ ] Budget impact visualization (progress bar or chart)
  - [ ] Alternative suggestions (if applicable)
  - [ ] Disclaimer text (always visible)
- [ ] Visual design:
  - [ ] Different styling based on severity (info/warning/critical)
  - [ ] Icons for each section
  - [ ] Collapsible reasoning section
- [ ] Interaction:
  - [ ] "See Alternatives" button (expands alternatives)
  - [ ] "Create Expense Anyway" button
  - [ ] "Go Back" button
  - [ ] Copy advice text button
- [ ] Budget impact display:
  - [ ] Percentage of monthly budget
  - [ ] Remaining budget after expense
  - [ ] Visual indicator (green/yellow/red)
- [ ] Accessibility: Screen reader friendly, keyboard navigation
- [ ] Component tests: Render all sections, expand/collapse
- [ ] Test coverage: >85%

**Files**:

- `app/frontend/src/components/ai/ConsultationWidget.tsx`
- `app/frontend/src/components/ai/ConsultationWidget.test.tsx`
- `app/frontend/src/components/ai/BudgetImpactBar.tsx`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-high`, `frontend`, `component`

---

### TASK-003-017: Create AI Store (Zustand) for State Management

**Priority**: Critical | **Effort**: 1.5 days | **Dependencies**: TASK-003-012

**Requirements**: FR-002 (Conversational AI), FR-003 (Consultation)  
**Design**: HLD-003 Section 5.4 (State Management)

**Description**: Global state management for AI chat and conversations

**Acceptance Criteria**:

- [ ] Store created: `useAIStore`
- [ ] State defined:
  ```typescript
  interface AIState {
    conversations: Map<string, Conversation>;
    currentConversationId: string | null;
    messages: Message[];
    isTyping: boolean;
    parseResult: ParsedExpense | null;
    consultationResult: ConsultationResponse | null;
    loading: boolean;
    error: string | null;
  }
  ```
- [ ] Actions implemented:
  - [ ] `startConversation()` - Initialize new conversation
  - [ ] `sendMessage(text)` - Send user message, get AI response
  - [ ] `parseExpense(text)` - Parse natural language expense
  - [ ] `getConsultation(query)` - Get financial advice
  - [ ] `confirmExpense(preview)` - Create expense from preview
  - [ ] `clearConversation()` - Reset conversation state
  - [ ] `loadConversationHistory(id)` - Load past conversation
- [ ] API integration:
  - [ ] Call `/api/ai/parse-expense`
  - [ ] Call `/api/ai/consult`
  - [ ] Call `/api/ai/conversations/:id/messages`
- [ ] Error handling: Network errors, API errors, timeout
- [ ] Optimistic updates: Show user message immediately
- [ ] Caching: Cache conversations for 10 minutes
- [ ] Unit tests: All actions, error scenarios
- [ ] Test coverage: >90%

**Files**:

- `app/frontend/src/stores/useAIStore.ts`
- `app/frontend/src/stores/useAIStore.test.ts`
- `app/frontend/src/types/AITypes.ts`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-critical`, `frontend`, `state-management`

---

### TASK-003-018: Implement Chat Message Streaming Support

**Priority**: Medium | **Effort**: 1.5 days | **Dependencies**: TASK-003-014, TASK-003-017

**Requirements**: NFR-002 (Performance), FR-002 (Conversational AI)  
**Design**: HLD-003 Section 5.5 (Streaming Implementation)

**Description**: Stream AI responses token-by-token for better UX

**Acceptance Criteria**:

- [ ] Streaming implemented using Server-Sent Events (SSE) or WebSocket
- [ ] Backend endpoint: `POST /api/ai/parse-expense?stream=true`
- [ ] Frontend:
  - [ ] Display tokens as they arrive
  - [ ] Smooth typing animation
  - [ ] Handle connection errors
  - [ ] Fallback to non-streaming if SSE unavailable
- [ ] Message state:
  - [ ] `streaming: boolean` flag
  - [ ] `partialContent: string` (accumulating tokens)
  - [ ] `complete: boolean` flag
- [ ] User experience:
  - [ ] Show "..." cursor while streaming
  - [ ] Disable input while streaming
  - [ ] "Stop" button to abort streaming
- [ ] Error handling:
  - [ ] Reconnect on connection loss
  - [ ] Display partial message on error
  - [ ] Graceful degradation to complete response
- [ ] Performance: No UI lag, smooth animation
- [ ] Integration tests: Stream complete message, handle errors
- [ ] Test coverage: >80%

**Files**:

- `app/frontend/src/hooks/useStreamingAI.ts`
- `app/frontend/src/hooks/useStreamingAI.test.ts`
- `app/frontend/src/utils/sse-client.ts`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-medium`, `frontend`, `performance`

---

### TASK-003-019: Create AI Insights Dashboard Widget

**Priority**: Medium | **Effort**: 2 days | **Dependencies**: TASK-003-004

**Requirements**: FR-004 (Personal AI Analytics), US-004 (Spending Pattern Insights)  
**Design**: HLD-003 Section 5.6 (Insights Display)

**Description**: Display AI-generated spending insights on dashboard

**Acceptance Criteria**:

- [ ] Component created: `AIInsightsDashboard.tsx`
- [ ] Widget sections:
  - [ ] Top 3 insights (highlighted cards)
  - [ ] Spending trends (chart + text summary)
  - [ ] Anomalies detected (if any)
  - [ ] Recommendations
- [ ] Insight card design:
  - [ ] Icon based on type (pattern/trend/prediction/anomaly)
  - [ ] Title (e.g., "Dining expenses increased 25%")
  - [ ] Description (detailed explanation)
  - [ ] Severity indicator (info/warning/critical)
  - [ ] "Learn More" button (expand details)
- [ ] Data fetching:
  - [ ] API call: `GET /api/ai/insights`
  - [ ] Cache for 5 minutes
  - [ ] Refresh button
- [ ] Empty state: "No insights yet, add more expenses"
- [ ] Loading state: Skeleton loaders
- [ ] Error state: Retry button
- [ ] Accessibility: Screen reader support
- [ ] Responsive: Stack vertically on mobile
- [ ] Component tests: Render insights, expand/collapse
- [ ] Test coverage: >85%

**Files**:

- `app/frontend/src/components/ai/AIInsightsDashboard.tsx`
- `app/frontend/src/components/ai/AIInsightsDashboard.test.tsx`
- `app/frontend/src/components/ai/InsightCard.tsx`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-medium`, `frontend`, `component`, `analytics`

---

### TASK-003-020: Implement Chat History Sidebar

**Priority**: Medium | **Effort**: 1.5 days | **Dependencies**: TASK-003-014, TASK-003-017

**Requirements**: US-006 (Chat History & Context)  
**Design**: HLD-003 Section 5.7 (History Management)

**Description**: Allow users to view and manage past AI conversations

**Acceptance Criteria**:

- [ ] Component created: `ChatHistorySidebar.tsx`
- [ ] Display:
  - [ ] List of past conversations (most recent first)
  - [ ] Each item shows: first message preview, timestamp, expense count
  - [ ] Active conversation highlighted
- [ ] Features:
  - [ ] Click conversation to load history
  - [ ] Search conversations by text
  - [ ] Delete individual conversations
  - [ ] "New Conversation" button
- [ ] API integration:
  - [ ] `GET /api/ai/conversations` (list all)
  - [ ] `GET /api/ai/conversations/:id` (load specific)
  - [ ] `DELETE /api/ai/conversations/:id` (delete)
- [ ] Pagination: Load 20 conversations at a time, infinite scroll
- [ ] Empty state: "No conversations yet"
- [ ] Loading state: Skeleton loaders
- [ ] Confirmation: Confirm before deleting conversation
- [ ] Responsive: Drawer on mobile, sidebar on desktop
- [ ] Component tests: List, load, delete conversations
- [ ] Test coverage: >80%

**Files**:

- `app/frontend/src/components/ai/ChatHistorySidebar.tsx`
- `app/frontend/src/components/ai/ChatHistorySidebar.test.tsx`
- `app/frontend/src/components/ai/ConversationListItem.tsx`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-medium`, `frontend`, `component`

---

### TASK-003-021: Create AI Error Handling and Fallback UI

**Priority**: High | **Effort**: 1 day | **Dependencies**: TASK-003-014

**Requirements**: US-007 (AI Fallback & Error Handling), NFR-003 (Reliability)  
**Design**: HLD-003 Section 5.8 (Error Handling)

**Description**: Graceful error handling with fallback to manual expense form

**Acceptance Criteria**:

- [ ] Error types handled:
  - [ ] AI service unavailable (503)
  - [ ] Parsing failure (AI can't understand input)
  - [ ] Rate limit exceeded (429)
  - [ ] Network timeout
  - [ ] Invalid response from AI
- [ ] Error messages:
  - [ ] User-friendly messages (no technical jargon)
  - [ ] Actionable suggestions ("Try rephrasing" or "Use manual form")
  - [ ] Retry button (for transient errors)
- [ ] Fallback mechanism:
  - [ ] "Switch to Manual Entry" button always visible
  - [ ] One-click transition to traditional expense form
  - [ ] Preserve entered data (if any)
- [ ] Circuit breaker:
  - [ ] After 3 consecutive AI failures, auto-suggest manual mode
  - [ ] Show banner: "AI temporarily unavailable, use manual entry"
- [ ] Error tracking:
  - [ ] Log errors to frontend monitoring (Sentry/similar)
  - [ ] Include user ID, conversation ID, error type
- [ ] Component tests: All error scenarios, fallback flow
- [ ] Test coverage: >90%

**Files**:

- `app/frontend/src/components/ai/AIErrorBoundary.tsx`
- `app/frontend/src/components/ai/AIErrorBoundary.test.tsx`
- `app/frontend/src/utils/ai-error-handler.ts`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-high`, `frontend`, `reliability`, `error-handling`

---

### TASK-003-022: Integrate AI Chat with Expense List Page

**Priority**: High | **Effort**: 1 day | **Dependencies**: TASK-003-014, TASK-003-017

**Requirements**: FR-001 (NLP Parsing), FR-002 (Conversational AI)  
**Design**: HLD-003 Section 5.9 (Integration Points)

**Description**: Add AI chat trigger to existing expense management UI

**Acceptance Criteria**:

- [ ] Add "AI Quick Add" button to expense list header
  - [ ] Icon: Sparkle/stars icon
  - [ ] Text: "Ask AI" or "Quick Add"
  - [ ] Position: Next to "+ Add Expense" button
- [ ] Button click: Open `AIExpenseChatModal`
- [ ] After expense creation:
  - [ ] Close chat modal
  - [ ] Show success toast
  - [ ] Refresh expense list
  - [ ] Highlight newly created expense
- [ ] Keyboard shortcut: `Ctrl+K` or `Cmd+K` to open AI chat
- [ ] Feature discovery:
  - [ ] Tooltip on first visit: "Try AI-powered expense entry!"
  - [ ] Dismiss tooltip after first use
- [ ] Analytics tracking:
  - [ ] Track AI chat opens
  - [ ] Track successful expense creations
  - [ ] Track fallback to manual form usage
- [ ] Integration tests: Open chat, create expense, list refresh
- [ ] Test coverage: >85%

**Files**:

- `app/frontend/src/pages/ExpenseListPage.tsx` (update)
- `app/frontend/src/components/expenses/ExpenseListHeader.tsx` (update)
- `app/frontend/src/hooks/useKeyboardShortcuts.ts`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-high`, `frontend`, `integration`

---

### TASK-003-023: Add Loading States and Animations

**Priority**: Medium | **Effort**: 1 day | **Dependencies**: TASK-003-014, TASK-003-015

**Requirements**: NFR-002 (Performance - Perceived), FR-002 (Conversational AI)  
**Design**: HLD-003 Section 5.10 (UX Polish)

**Description**: Polished loading states and smooth animations for AI interactions

**Acceptance Criteria**:

- [ ] Loading states:
  - [ ] Typing indicator (animated dots "...")
  - [ ] Skeleton loaders for expense preview
  - [ ] Skeleton loaders for insights
  - [ ] Shimmer effect on loading cards
- [ ] Animations:
  - [ ] Fade-in for new messages
  - [ ] Slide-up for expense preview card
  - [ ] Smooth scroll to bottom when new message arrives
  - [ ] Pulse animation for "AI is thinking"
- [ ] Transitions:
  - [ ] Modal open/close animation
  - [ ] Sidebar slide-in/out
  - [ ] Button hover effects
- [ ] Timing:
  - [ ] Fast animations (150-300ms)
  - [ ] Reduced motion support (prefers-reduced-motion CSS)
- [ ] Performance:
  - [ ] Use CSS animations (not JavaScript)
  - [ ] Hardware acceleration (transform, opacity)
  - [ ] No animation lag or jank
- [ ] Accessibility: Respect user's motion preferences
- [ ] Visual tests: Screenshot comparisons (Playwright/Storybook)
- [ ] Test coverage: Verify animations render correctly

**Files**:

- `app/frontend/src/styles/ai-animations.css`
- `app/frontend/src/components/ai/SkeletonLoaders.tsx`
- `app/frontend/src/utils/animation-utils.ts`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-medium`, `frontend`, `ux`, `animations`

---

### TASK-003-024: Implement Mobile-Responsive AI Chat

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-003-014

**Requirements**: NFR-005 (Mobile Support), FR-002 (Conversational AI)  
**Design**: HLD-003 Section 5.11 (Mobile Optimization)

**Description**: Optimize AI chat experience for mobile devices

**Acceptance Criteria**:

- [ ] Mobile layout:
  - [ ] Full-screen modal (not dialog)
  - [ ] Fixed header with close button
  - [ ] Message list fills viewport
  - [ ] Input field fixed at bottom
  - [ ] Virtual keyboard doesn't cover input
- [ ] Touch interactions:
  - [ ] Tap to send message
  - [ ] Swipe to dismiss keyboard
  - [ ] Pull-to-refresh conversation
  - [ ] Long-press message for options (copy, delete)
- [ ] Mobile-specific features:
  - [ ] Large touch targets (min 44x44px)
  - [ ] Bottom sheet for expense preview
  - [ ] Native-like animations
- [ ] Responsive breakpoints:
  - [ ] Mobile: <768px (full-screen)
  - [ ] Tablet: 768-1024px (modal with padding)
  - [ ] Desktop: >1024px (centered modal)
- [ ] Performance:
  - [ ] Lazy load messages (virtualization)
  - [ ] Optimize for 3G networks
  - [ ] Image optimization (if any)
- [ ] Testing:
  - [ ] Test on iOS Safari, Android Chrome
  - [ ] Test with virtual keyboard open
  - [ ] Test orientation changes
- [ ] Test coverage: >80%

**Files**:

- `app/frontend/src/components/ai/AIExpenseChatModal.mobile.tsx`
- `app/frontend/src/styles/ai-mobile.css`
- `app/frontend/src/hooks/useViewportHeight.ts`

**Labels**: `TASK-003`, `phase-2-ui`, `priority-high`, `frontend`, `mobile`, `responsive`

---

## Phase 3: Analytics Engine (9-11 days) 🟡 MEDIUM

### TASK-003-025: Create Spending Pattern Detection Service

**Priority**: Medium | **Effort**: 2.5 days | **Dependencies**: TASK-003-004, TASK-003-011

**Requirements**: FR-004 (Personal AI Analytics), US-004 (Spending Pattern Insights)  
**Design**: HLD-003 Section 3.5 (Analytics Engine)

**Description**: Analyze user spending data to detect patterns and trends

**Acceptance Criteria**:

- [ ] Service created: `SpendingPatternService`
- [ ] Methods implemented:
  - [ ] `detectPatterns(userId, timeframe)` - Identify spending patterns
  - [ ] `analyzeCategoryTrends(userId)` - Category-wise trend analysis
  - [ ] `calculateAverageSpending(userId, category, months)` - Historical averages
  - [ ] `detectRecurringExpenses(userId)` - Find recurring expenses (subscriptions)
- [ ] Pattern types detected:
  - [ ] Category dominance (e.g., "40% on dining")
  - [ ] Time-based patterns (e.g., "Spending peaks on weekends")
  - [ ] Recurring subscriptions (same merchant, similar amount, monthly)
  - [ ] Budget cycles (spending early/late in month)
- [ ] Trend analysis:
  - [ ] Compare current month vs previous month
  - [ ] Calculate percentage changes
  - [ ] Identify increasing/decreasing trends
  - [ ] Project next month spending
- [ ] Data aggregation:
  - [ ] Query expenses for last 3-6 months
  - [ ] Group by category, merchant, date
  - [ ] Calculate totals, averages, percentages
- [ ] Caching:
  - [ ] Cache results for 1 hour
  - [ ] Invalidate on new expense creation
- [ ] Unit tests: Pattern detection accuracy, edge cases
- [ ] Integration tests: Full analysis flow
- [ ] Test coverage: >85%

**Files**:

- `app/services/api-service/src/analytics/spending-pattern.service.ts`
- `app/services/api-service/src/analytics/spending-pattern.service.spec.ts`
- `app/services/api-service/src/analytics/types/pattern.types.ts`

**Labels**: `TASK-003`, `phase-3-analytics`, `priority-medium`, `backend`, `analytics`

---

### TASK-003-026: Implement Anomaly Detection Service

**Priority**: Medium | **Effort**: 2 days | **Dependencies**: TASK-003-025

**Requirements**: FR-004 (Personal AI Analytics), US-004 (Spending Pattern Insights)  
**Design**: HLD-003 Section 3.5 (Anomaly Detection)

**Description**: Detect unusual or suspicious spending activity

**Acceptance Criteria**:

- [ ] Service created: `AnomalyDetectionService`
- [ ] Methods implemented:
  - [ ] `detectAnomalies(userId)` - Identify anomalous expenses
  - [ ] `calculateAnomalyScore(expense, history)` - Score how unusual an expense is
  - [ ] `getAnomalyReasons(expense)` - Explain why flagged as anomaly
- [ ] Anomaly types:
  - [ ] Amount anomaly (expense significantly higher than usual for category)
  - [ ] Frequency anomaly (too many transactions in short time)
  - [ ] Category anomaly (expense in rarely-used category)
  - [ ] Merchant anomaly (new/unusual merchant)
  - [ ] Time anomaly (purchase at unusual time)
- [ ] Detection algorithm:
  - [ ] Use statistical methods (Z-score, IQR)
  - [ ] Compare to user's historical data
  - [ ] Consider category-specific thresholds
  - [ ] Multi-factor scoring (combine multiple signals)
- [ ] Thresholds:
  - [ ] Amount: >2 standard deviations from mean
  - [ ] Frequency: >3x typical daily rate
  - [ ] Category: Used <5 times in 6 months
- [ ] Output:
  - [ ] Anomaly score (0-100)
  - [ ] Severity (low/medium/high)
  - [ ] Reasons (list of flags)
  - [ ] Recommendation (action to take)
- [ ] Unit tests: Detection accuracy, false positive rate
- [ ] Integration tests: Full anomaly detection pipeline
- [ ] Test coverage: >85%

**Files**:

- `app/services/api-service/src/analytics/anomaly-detection.service.ts`
- `app/services/api-service/src/analytics/anomaly-detection.service.spec.ts`
- `app/services/api-service/src/analytics/types/anomaly.types.ts`

**Labels**: `TASK-003`, `phase-3-analytics`, `priority-medium`, `backend`, `analytics`, `ml`

---

### TASK-003-027: Create Predictive Analytics Service

**Priority**: Medium | **Effort**: 2.5 days | **Dependencies**: TASK-003-025

**Requirements**: FR-004 (Personal AI Analytics), US-004 (Spending Pattern Insights)  
**Design**: HLD-003 Section 3.5 (Predictive Analytics)

**Description**: Forecast future spending and budget needs using AI

**Acceptance Criteria**:

- [ ] Service created: `PredictiveAnalyticsService`
- [ ] Methods implemented:
  - [ ] `predictNextMonthSpending(userId)` - Forecast total spending
  - [ ] `predictCategorySpending(userId, category)` - Category-specific forecast
  - [ ] `calculateBudgetRecommendation(userId)` - Suggest optimal budget
  - [ ] `predictBudgetOverrun(userId, daysRemaining)` - Risk of exceeding budget
- [ ] Prediction models:
  - [ ] Linear trend (simple moving average)
  - [ ] Seasonal adjustment (account for monthly patterns)
  - [ ] Growth rate extrapolation
  - [ ] AI-powered regression (optional: use OpenAI for complex patterns)
- [ ] Input features:
  - [ ] Last 3-6 months spending data
  - [ ] Category breakdown
  - [ ] Recurring expenses
  - [ ] Income (if available)
  - [ ] Seasonal factors (holidays, etc.)
- [ ] Output:
  - [ ] Predicted amount with confidence interval
  - [ ] Accuracy score (based on historical predictions)
  - [ ] Key drivers (what's influencing the prediction)
  - [ ] Recommendations (how to reduce spending)
- [ ] Validation:
  - [ ] Backtest predictions on historical data
  - [ ] Target accuracy: ≥70% within 10% margin
  - [ ] Improve model based on prediction errors
- [ ] Unit tests: Prediction accuracy, edge cases
- [ ] Integration tests: Full prediction pipeline
- [ ] Test coverage: >85%

**Files**:

- `app/services/api-service/src/analytics/predictive-analytics.service.ts`
- `app/services/api-service/src/analytics/predictive-analytics.service.spec.ts`
- `app/services/api-service/src/analytics/types/prediction.types.ts`

**Labels**: `TASK-003`, `phase-3-analytics`, `priority-medium`, `backend`, `analytics`, `ml`

---

### TASK-003-028: Implement Insights Generation Service

**Priority**: Medium | **Effort**: 2 days | **Dependencies**: TASK-003-025, TASK-003-026, TASK-003-027

**Requirements**: FR-004 (Personal AI Analytics), US-004 (Spending Pattern Insights)  
**Design**: HLD-003 Section 3.5 (Insights Generation)

**Description**: Generate natural language insights from analytics data using AI

**Acceptance Criteria**:

- [ ] Service created: `InsightsGenerationService`
- [ ] Methods implemented:
  - [ ] `generateInsights(userId)` - Create all insights
  - [ ] `prioritizeInsights(insights)` - Rank by importance
  - [ ] `formatInsight(insightData)` - Convert to natural language
  - [ ] `cacheInsights(userId, insights)` - Store in cache table
- [ ] Insight types:
  - [ ] Pattern insights ("You spend 40% on dining")
  - [ ] Trend insights ("Grocery spending up 20% this month")
  - [ ] Anomaly insights ("Unusual $200 shopping expense")
  - [ ] Prediction insights ("You'll likely exceed budget by $150")
  - [ ] Recommendation insights ("Consider reducing dining by 15%")
- [ ] AI-powered formatting:
  - [ ] Use OpenAI/Claude to generate human-friendly text
  - [ ] Include context (comparison to previous period)
  - [ ] Provide actionable recommendations
  - [ ] Keep language simple and non-technical
- [ ] Prioritization algorithm:
  - [ ] Score each insight (0-100)
  - [ ] Consider: severity, relevance, actionability
  - [ ] Return top 5 insights
- [ ] Output structure:
  - [ ] `title`: Short headline
  - [ ] `description`: Detailed explanation
  - [ ] `severity`: info/warning/critical
  - [ ] `recommendation`: What user should do
  - [ ] `metadata`: Raw data (amounts, percentages)
- [ ] Caching: Store in `ai_insights_cache` table, expire after 24 hours
- [ ] Unit tests: Insight generation, prioritization
- [ ] Integration tests: Full pipeline with AI calls
- [ ] Test coverage: >85%

**Files**:

- `app/services/api-service/src/analytics/insights-generation.service.ts`
- `app/services/api-service/src/analytics/insights-generation.service.spec.ts`
- `app/services/api-service/src/analytics/prompts/insights.prompt.ts`

**Labels**: `TASK-003`, `phase-3-analytics`, `priority-medium`, `backend`, `analytics`, `ai-ml`

---

### TASK-003-029: Create Analytics API Endpoints

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-003-025, TASK-003-026, TASK-003-027, TASK-003-028

**Requirements**: FR-004 (Personal AI Analytics)  
**Design**: HLD-003 Section 4.2 (API Specifications)

**Description**: REST API endpoints for accessing analytics and insights

**Acceptance Criteria**:

- [ ] Controller created: `AnalyticsController`
- [ ] Endpoints implemented:
  - [ ] `GET /api/analytics/insights` - Get AI-generated insights (API-003)
  - [ ] `GET /api/analytics/patterns` - Get spending patterns
  - [ ] `GET /api/analytics/predictions` - Get spending forecasts
  - [ ] `GET /api/analytics/anomalies` - Get detected anomalies
  - [ ] `GET /api/analytics/trends` - Get category trends
- [ ] Query parameters:
  - [ ] `timeframe`: '1m', '3m', '6m', '1y' (default: '3m')
  - [ ] `category`: Filter by category (optional)
  - [ ] `limit`: Number of results (default: 10)
- [ ] Response structure:
  ```typescript
  {
    insights: Insight[],
    patterns: Pattern[],
    predictions: Prediction[],
    anomalies: Anomaly[],
    metadata: {
      generatedAt: Date,
      expiresAt: Date,
      dataRange: { from: Date, to: Date }
    }
  }
  ```
- [ ] Guards applied: `@UseGuards(JwtAuthGuard)`
- [ ] Rate limiting: 10 requests/minute per user
- [ ] Caching: Return cached results if available (< 1 hour old)
- [ ] Error handling: Graceful fallback if analytics fail
- [ ] Integration tests: All endpoints
- [ ] Test coverage: 100% of endpoints

**Files**:

- `app/services/api-service/src/analytics/analytics.controller.ts`
- `app/services/api-service/src/analytics/analytics.controller.spec.ts`
- `app/services/api-service/src/analytics/dto/insights-query.dto.ts`

**Labels**: `TASK-003`, `phase-3-analytics`, `priority-high`, `backend`, `api`

---

### TASK-003-030: Implement Analytics Caching and Optimization

**Priority**: Medium | **Effort**: 1.5 days | **Dependencies**: TASK-003-028, TASK-003-029

**Requirements**: NFR-002 (Performance), NFR-004 (Cost Monitoring)  
**Design**: HLD-003 Section 3.5 (Caching Strategy)

**Description**: Optimize analytics performance with intelligent caching

**Acceptance Criteria**:

- [ ] Caching strategy:
  - [ ] Use `ai_insights_cache` table for insights
  - [ ] Use Redis for temporary pattern/prediction caching
  - [ ] Cache TTL: 1 hour for insights, 5 minutes for real-time data
- [ ] Cache invalidation:
  - [ ] Invalidate on new expense creation
  - [ ] Invalidate on expense deletion/update
  - [ ] Automatic expiration after TTL
- [ ] Cache warming:
  - [ ] Pre-generate insights for active users (background job)
  - [ ] Schedule: Daily at 2 AM
  - [ ] Priority: Users with expenses in last 7 days
- [ ] Performance optimizations:
  - [ ] Database indexes on expense queries
  - [ ] Aggregate queries (SUM, AVG) use proper indexes
  - [ ] Limit data fetching to necessary timeframes
- [ ] Background processing:
  - [ ] Queue analytics jobs (Bull/BullMQ)
  - [ ] Process heavy analytics asynchronously
  - [ ] Send push notification when insights ready
- [ ] Monitoring:
  - [ ] Log cache hit/miss rates
  - [ ] Track analytics generation time
  - [ ] Alert if generation time >10s
- [ ] Unit tests: Cache logic, invalidation
- [ ] Integration tests: Full caching flow
- [ ] Test coverage: >85%

**Files**:

- `app/services/api-service/src/analytics/analytics-cache.service.ts`
- `app/services/api-service/src/analytics/analytics-cache.service.spec.ts`
- `app/services/api-service/src/analytics/jobs/insights-warmup.job.ts`

**Labels**: `TASK-003`, `phase-3-analytics`, `priority-medium`, `backend`, `performance`, `caching`

---

### TASK-003-031: Create Comparative Analytics Service (Optional)

**Priority**: Low | **Effort**: 2 days | **Dependencies**: TASK-003-025

**Requirements**: FR-007 (Comparative Benchmarking), US-005 (Privacy-First Comparative)  
**Design**: HLD-003 Section 3.6 (Comparative Analytics)

**Description**: Compare user spending to anonymized aggregated cohorts

**Acceptance Criteria**:

- [ ] Service created: `ComparativeAnalyticsService`
- [ ] Methods implemented:
  - [ ] `getUserCohort(userId)` - Determine user's comparison cohort
  - [ ] `getAggregatedStats(cohort)` - Get anonymized cohort data
  - [ ] `compareToAverage(userId, cohort)` - Calculate percentile rank
  - [ ] `generateComparisons(userId)` - Create comparative insights
- [ ] Cohort definition:
  - [ ] Income bracket (opt-in, user provides)
  - [ ] Location (city/region)
  - [ ] Household size (optional)
  - [ ] Minimum cohort size: 50 users (privacy threshold)
- [ ] Anonymization:
  - [ ] No PII in aggregated data
  - [ ] Only statistical aggregates (mean, median, percentiles)
  - [ ] Differential privacy techniques (optional: add noise)
- [ ] Comparison metrics:
  - [ ] "You spend X% more/less than average in [category]"
  - [ ] Percentile ranking (e.g., "Top 25% spenders")
  - [ ] Category-wise comparisons
- [ ] Opt-in flow:
  - [ ] Explicit consent required
  - [ ] Granular controls (choose what to share)
  - [ ] Can opt-out anytime
  - [ ] Data deleted immediately on opt-out
- [ ] Privacy validation:
  - [ ] No reverse-engineering individual data
  - [ ] Security audit passed
- [ ] Unit tests: Cohort matching, anonymization
- [ ] Integration tests: Full comparison flow
- [ ] Test coverage: >85%

**Files**:

- `app/services/api-service/src/analytics/comparative-analytics.service.ts`
- `app/services/api-service/src/analytics/comparative-analytics.service.spec.ts`
- `app/services/api-service/src/analytics/types/cohort.types.ts`

**Labels**: `TASK-003`, `phase-3-analytics`, `priority-low`, `backend`, `analytics`, `privacy`

---

## Phase 4: Testing & QA (12-15 days) 🔴 HIGH

### TASK-003-032: Unit Testing for AI Services

**Priority**: Critical | **Effort**: 2.5 days | **Dependencies**: Phase 1 tasks

**Requirements**: NFR-006 (Testing), TEST-003 Section 4  
**Design**: TEST-003 Section 4.1 (Unit Test Strategy)

**Description**: Comprehensive unit tests for all AI backend services

**Acceptance Criteria**:

- [ ] Test coverage targets:
  - [ ] NLP Parser Service: >90%
  - [ ] Conversation Manager: >90%
  - [ ] Consultation Engine: >90%
  - [ ] AI Provider Adapters: >95%
  - [ ] User Context Service: >90%
- [ ] Test scenarios:
  - [ ] Happy paths (valid inputs)
  - [ ] Edge cases (empty inputs, special characters)
  - [ ] Error cases (API failures, timeout)
  - [ ] Boundary cases (max length, min values)
- [ ] Mocking:
  - [ ] Mock AI provider responses
  - [ ] Mock database calls
  - [ ] Mock encryption/decryption
- [ ] Test data:
  - [ ] Create fixture data for common expense inputs
  - [ ] 50+ test cases for NLP parsing
  - [ ] 20+ test cases for consultation
- [ ] Assertion types:
  - [ ] Parsing accuracy (expected vs actual)
  - [ ] Response structure validation
  - [ ] Error handling verification
  - [ ] Cost calculation correctness
- [ ] Performance tests:
  - [ ] Parsing completes in <2s
  - [ ] Consultation completes in <3s
- [ ] All tests passing in CI/CD pipeline

**Files**:

- `app/services/api-service/src/ai/**/*.spec.ts` (all existing test files)
- `app/services/api-service/test/fixtures/ai-test-data.ts`

**Labels**: `TASK-003`, `phase-4-test`, `priority-critical`, `backend`, `unit-tests`

---

### TASK-003-033: Integration Testing for AI API Endpoints

**Priority**: Critical | **Effort**: 2 days | **Dependencies**: Phase 1 tasks

**Requirements**: NFR-006 (Testing), TEST-003 Section 5  
**Design**: TEST-003 Section 5.1 (Integration Test Strategy)

**Description**: End-to-end API integration tests with real database

**Acceptance Criteria**:

- [ ] Test framework: Supertest + Jest
- [ ] Test scenarios:
  - [ ] TC-003-001: Parse simple expense "Coffee $5" ✅
  - [ ] TC-003-002: Parse complex expense with date/merchant ✅
  - [ ] TC-003-003: Multi-turn conversation with clarification ✅
  - [ ] TC-003-004: Financial consultation request ✅
  - [ ] TC-003-005: Get insights for user ✅
  - [ ] TC-003-006: Get conversation history ✅
  - [ ] TC-003-007: Invalid input handling ✅
  - [ ] TC-003-008: Rate limiting enforcement ✅
  - [ ] TC-003-009: Unauthorized access (401) ✅
  - [ ] TC-003-010: AI service failure (fallback) ✅
- [ ] Test database:
  - [ ] Use test database (separate from dev)
  - [ ] Seed test data before tests
  - [ ] Clean up after each test
- [ ] Authentication:
  - [ ] Generate test JWT tokens
  - [ ] Test with/without auth
- [ ] Assertions:
  - [ ] HTTP status codes
  - [ ] Response body structure
  - [ ] Database state changes
  - [ ] Side effects (conversation creation, expense creation)
- [ ] All integration tests passing
- [ ] Test coverage: 100% of API endpoints

**Files**:

- `tests/integration/ai/ai-controller.spec.ts`
- `tests/integration/ai/analytics-controller.spec.ts`
- `tests/integration/ai/setup.ts`

**Labels**: `TASK-003`, `phase-4-test`, `priority-critical`, `backend`, `integration-tests`

---

### TASK-003-034: E2E Testing for AI Chat Flow

**Priority**: High | **Effort**: 3 days | **Dependencies**: Phase 2 tasks

**Requirements**: NFR-006 (Testing), TEST-003 Section 6  
**Design**: TEST-003 Section 6.1 (E2E Test Strategy)

**Description**: End-to-end tests for complete AI expense creation flow

**Acceptance Criteria**:

- [ ] Test framework: Playwright
- [ ] Test scenarios:
  - [ ] TC-003-011: Open AI chat, enter expense, confirm creation ✅
  - [ ] TC-003-012: Multi-turn conversation with AI clarification ✅
  - [ ] TC-003-013: Edit expense preview before confirming ✅
  - [ ] TC-003-014: Request financial consultation ✅
  - [ ] TC-003-015: View AI insights on dashboard ✅
  - [ ] TC-003-016: Load conversation history ✅
  - [ ] TC-003-017: Delete conversation ✅
  - [ ] TC-003-018: Fallback to manual form on AI failure ✅
  - [ ] TC-003-019: Mobile responsive chat (viewport 375px) ✅
  - [ ] TC-003-020: Keyboard shortcuts (Ctrl+K opens chat) ✅
- [ ] Test environment:
  - [ ] Run against staging environment
  - [ ] Mock AI responses (for deterministic tests)
  - [ ] Use test user accounts
- [ ] Assertions:
  - [ ] UI elements visible
  - [ ] Messages displayed correctly
  - [ ] Expense created in database
  - [ ] Success toasts shown
- [ ] Visual regression:
  - [ ] Screenshot comparisons for chat UI
  - [ ] Detect layout changes
- [ ] Performance:
  - [ ] Chat opens in <1s
  - [ ] Messages render in <500ms
- [ ] All E2E tests passing in CI/CD

**Files**:

- `tests/e2e/ai/chat-flow.spec.ts`
- `tests/e2e/ai/consultation-flow.spec.ts`
- `tests/e2e/ai/insights-dashboard.spec.ts`
- `tests/e2e/ai/mobile-chat.spec.ts`

**Labels**: `TASK-003`, `phase-4-test`, `priority-high`, `frontend`, `e2e-tests`

---

### TASK-003-035: AI Accuracy Validation with Test Dataset

**Priority**: Critical | **Effort**: 2.5 days | **Dependencies**: TASK-003-008

**Requirements**: NFR-001 (Accuracy), TEST-003 Section 7  
**Design**: TEST-003 Section 7.1 (Accuracy Testing)

**Description**: Validate AI parsing accuracy against curated test dataset

**Acceptance Criteria**:

- [ ] Test dataset created:
  - [ ] 200+ natural language expense inputs
  - [ ] Variety: Simple, complex, ambiguous, edge cases
  - [ ] Ground truth: Expected output for each input
  - [ ] Categories: Amount extraction, date parsing, category inference, merchant extraction
- [ ] Accuracy metrics:
  - [ ] Overall parsing accuracy: ≥80% ✅
  - [ ] Amount extraction: ≥95% ✅
  - [ ] Date inference: ≥85% ✅
  - [ ] Category classification: ≥75% ✅
  - [ ] Merchant extraction: ≥80% ✅
- [ ] Test execution:
  - [ ] Automated script to run all test cases
  - [ ] Compare AI output to ground truth
  - [ ] Calculate accuracy per metric
  - [ ] Generate detailed report
- [ ] Error analysis:
  - [ ] Identify failure patterns
  - [ ] Categorize errors (amount wrong, category wrong, etc.)
  - [ ] Suggest prompt improvements
- [ ] Iterative improvement:
  - [ ] Update prompts based on failures
  - [ ] Re-run tests after changes
  - [ ] Track accuracy improvements over time
- [ ] Regression testing:
  - [ ] Run dataset tests in CI/CD
  - [ ] Fail if accuracy drops below threshold
- [ ] Documentation:
  - [ ] Test results report
  - [ ] Accuracy trends over time

**Files**:

- `tests/ai-accuracy/expense-parsing-dataset.json`
- `tests/ai-accuracy/run-accuracy-tests.ts`
- `tests/ai-accuracy/accuracy-report.md`
- `tests/ai-accuracy/error-analysis.md`

**Labels**: `TASK-003`, `phase-4-test`, `priority-critical`, `backend`, `ai-validation`

---

### TASK-003-036: Security Audit for AI Features

**Priority**: Critical | **Effort**: 2 days | **Dependencies**: Phase 1, Phase 2 tasks

**Requirements**: NFR-007 (Security), FR-005 (Privacy), TEST-003 Section 8  
**Design**: TEST-003 Section 8.1 (Security Testing)

**Description**: Comprehensive security testing for AI features

**Acceptance Criteria**:

- [ ] Security test scenarios:
  - [ ] TC-003-021: PII leakage to AI provider ✅ (None detected)
  - [ ] TC-003-022: Prompt injection attacks ✅ (Protected)
  - [ ] TC-003-023: Chat message encryption at rest ✅ (AES-256)
  - [ ] TC-003-024: API key exposure ✅ (Secure)
  - [ ] TC-003-025: Unauthorized access to conversations ✅ (403)
  - [ ] TC-003-026: SQL injection in analytics queries ✅ (Protected)
  - [ ] TC-003-027: XSS in AI-generated text ✅ (Sanitized)
  - [ ] TC-003-028: CSRF on AI endpoints ✅ (Protected)
  - [ ] TC-003-029: Rate limiting bypass ✅ (Enforced)
  - [ ] TC-003-030: Data export compliance (GDPR) ✅
- [ ] PII detection:
  - [ ] Scan AI request logs for emails, phone numbers, addresses
  - [ ] Verify anonymization before AI calls
  - [ ] Check encryption of stored conversations
- [ ] Penetration testing:
  - [ ] Automated scans (OWASP ZAP)
  - [ ] Manual testing of critical flows
  - [ ] Test against OWASP Top 10
- [ ] Vulnerability scanning:
  - [ ] Dependency scanning (npm audit, Snyk)
  - [ ] Code scanning (CodeQL, SonarQube)
  - [ ] Infrastructure scanning (Trivy)
- [ ] Audit logging:
  - [ ] All AI interactions logged
  - [ ] Includes user ID, timestamp, input/output
  - [ ] Logs encrypted and tamper-proof
- [ ] Compliance checks:
  - [ ] GDPR: Right to deletion, data export
  - [ ] CCPA: Opt-out of data sharing
  - [ ] SOC 2: Audit trails
- [ ] All security tests passing
- [ ] Zero critical/high vulnerabilities

**Files**:

- `tests/security/ai/pii-leakage.spec.ts`
- `tests/security/ai/prompt-injection.spec.ts`
- `tests/security/ai/encryption.spec.ts`
- `docs/qa/test-plans/EXEC-003-security-report.md`

**Labels**: `TASK-003`, `phase-4-test`, `priority-critical`, `security`, `compliance`

---

### TASK-003-037: Performance Testing for AI Features

**Priority**: High | **Effort**: 2 days | **Dependencies**: Phase 1, Phase 2 tasks

**Requirements**: NFR-002 (Performance), TEST-003 Section 9  
**Design**: TEST-003 Section 9.1 (Performance Testing)

**Description**: Load and performance testing for AI endpoints

**Acceptance Criteria**:

- [ ] Performance test scenarios:
  - [ ] TC-003-031: Parse expense response time <2s (p95) ✅
  - [ ] TC-003-032: Consultation response time <3s (p95) ✅
  - [ ] TC-003-033: Insights generation <5s (p95) ✅
  - [ ] TC-003-034: Conversation history load <1s ✅
  - [ ] TC-003-035: 50 concurrent users parsing expenses ✅
  - [ ] TC-003-036: 100 concurrent users viewing insights ✅
  - [ ] TC-003-037: Streaming response latency <500ms ✅
- [ ] Load testing (k6):
  - [ ] Ramp up to 100 concurrent users
  - [ ] Sustain load for 5 minutes
  - [ ] Measure response times, throughput, error rate
- [ ] Stress testing:
  - [ ] Find breaking point (max concurrent users)
  - [ ] Test with sustained load
  - [ ] Measure recovery time
- [ ] Metrics captured:
  - [ ] Response time (p50, p95, p99)
  - [ ] Throughput (requests/second)
  - [ ] Error rate (%)
  - [ ] AI API latency
  - [ ] Database query time
- [ ] Performance benchmarks:
  - [ ] All response time targets met
  - [ ] Error rate <1% under normal load
  - [ ] System stable under 100 concurrent users
- [ ] Optimization recommendations:
  - [ ] Identify bottlenecks
  - [ ] Suggest caching improvements
  - [ ] Database query optimizations
- [ ] HTML reports generated

**Files**:

- `tests/performance/ai/parse-expense-load.k6.js`
- `tests/performance/ai/consultation-load.k6.js`
- `tests/performance/ai/insights-load.k6.js`
- `tests/reports/performance-003.html`

**Labels**: `TASK-003`, `phase-4-test`, `priority-high`, `performance`

---

### TASK-003-038: Cost Monitoring Validation

**Priority**: High | **Effort**: 1.5 days | **Dependencies**: TASK-003-013

**Requirements**: NFR-004 (Cost Monitoring), TEST-003 Section 10  
**Design**: TEST-003 Section 10.1 (Cost Testing)

**Description**: Validate AI API cost tracking and budget enforcement

**Acceptance Criteria**:

- [ ] Cost tracking verification:
  - [ ] All AI calls logged in `ai_usage_logs` table
  - [ ] Tokens counted correctly (prompt + completion)
  - [ ] Cost calculated accurately per provider
  - [ ] Latency tracked per request
- [ ] Budget validation:
  - [ ] Per-user daily cost limit: $5 ✅
  - [ ] Per-user monthly cost limit: $50 ✅
  - [ ] System-wide daily limit: $100 ✅
  - [ ] Rate limiting enforced when limits approached
- [ ] Test scenarios:
  - [ ] TC-003-038: Track cost for 100 parse requests ✅
  - [ ] TC-003-039: User exceeds daily limit (rate limited) ✅
  - [ ] TC-003-040: System-wide cost alerting ✅
  - [ ] TC-003-041: Cost breakdown by service ✅
  - [ ] TC-003-042: Historical cost trends ✅
- [ ] Alerting:
  - [ ] Alert when user exceeds 80% of daily limit
  - [ ] Alert when system exceeds 80% of daily budget
  - [ ] Email notifications to admins
- [ ] Cost optimization tests:
  - [ ] Verify caching reduces AI calls
  - [ ] Test prompt size optimization
  - [ ] Compare provider costs (OpenAI vs Claude vs Gemini)
- [ ] Reporting:
  - [ ] Cost dashboard displays accurate data
  - [ ] Export cost reports (CSV)
  - [ ] Per-user cost breakdown
- [ ] All cost monitoring features working

**Files**:

- `tests/integration/ai/cost-tracking.spec.ts`
- `tests/e2e/ai/cost-monitoring-dashboard.spec.ts`
- `docs/qa/test-plans/EXEC-003-cost-report.md`

**Labels**: `TASK-003`, `phase-4-test`, `priority-high`, `monitoring`, `cost-optimization`

---

### TASK-003-039: Accessibility (A11y) Testing for AI UI

**Priority**: Medium | **Effort**: 1.5 days | **Dependencies**: Phase 2 tasks

**Requirements**: NFR-008 (Accessibility), TEST-003 Section 11  
**Design**: TEST-003 Section 11.1 (A11y Testing)

**Description**: Ensure AI chat interface is accessible to all users

**Acceptance Criteria**:

- [ ] Automated A11y testing:
  - [ ] axe-core integration in E2E tests
  - [ ] WCAG 2.1 Level AA compliance ✅
  - [ ] Zero critical/serious violations
- [ ] Manual A11y testing:
  - [ ] TC-003-043: Screen reader navigation (NVDA, JAWS) ✅
  - [ ] TC-003-044: Keyboard-only navigation ✅
  - [ ] TC-003-045: Focus management in chat modal ✅
  - [ ] TC-003-046: ARIA labels on all interactive elements ✅
  - [ ] TC-003-047: Color contrast ratios ≥4.5:1 ✅
  - [ ] TC-003-048: Text resizing up to 200% ✅
  - [ ] TC-003-049: Skip to content links ✅
- [ ] Keyboard navigation:
  - [ ] Tab through all interactive elements
  - [ ] Enter to send message
  - [ ] Esc to close modal
  - [ ] Arrow keys to navigate messages
- [ ] Screen reader support:
  - [ ] Announce new messages
  - [ ] Announce loading states
  - [ ] Announce errors
  - [ ] Meaningful ARIA labels
- [ ] Visual accessibility:
  - [ ] High contrast mode support
  - [ ] Focus indicators visible
  - [ ] No reliance on color alone
- [ ] Testing tools:
  - [ ] axe DevTools
  - [ ] Lighthouse accessibility audit
  - [ ] Pa11y
- [ ] All A11y tests passing
- [ ] Accessibility statement published

**Files**:

- `tests/e2e/ai/a11y-chat.spec.ts`
- `tests/a11y/ai-chat-audit.html`
- `docs/ACCESSIBILITY_STATEMENT.md`

**Labels**: `TASK-003`, `phase-4-test`, `priority-medium`, `frontend`, `accessibility`

---

### TASK-003-040: User Acceptance Testing (UAT) Preparation

**Priority**: High | **Effort**: 2 days | **Dependencies**: All Phase 1, 2, 3 tasks

**Requirements**: TEST-003 Section 12  
**Design**: TEST-003 Section 12.1 (UAT Plan)

**Description**: Prepare for user acceptance testing with stakeholders

**Acceptance Criteria**:

- [ ] UAT plan document:
  - [ ] Test objectives
  - [ ] Test scope (all AI features)
  - [ ] Test scenarios (20+ user stories)
  - [ ] Acceptance criteria
  - [ ] Success metrics
- [ ] Test environment setup:
  - [ ] Staging environment with production-like data
  - [ ] Test user accounts created
  - [ ] Sample data seeded
- [ ] UAT scenarios:
  - [ ] Create expense via AI chat (10 variations)
  - [ ] Get financial consultation (5 scenarios)
  - [ ] View AI insights dashboard
  - [ ] Review conversation history
  - [ ] Handle AI failures gracefully
  - [ ] Mobile experience testing
- [ ] Feedback collection:
  - [ ] UAT feedback form
  - [ ] Bug reporting template
  - [ ] Feature request form
- [ ] Success criteria:
  - [ ] ≥80% of scenarios pass
  - [ ] ≥4.0/5.0 user satisfaction
  - [ ] <5 critical bugs found
  - [ ] ≥70% prefer AI input over manual form
- [ ] Stakeholder demo:
  - [ ] Live demo of all features
  - [ ] Walkthrough of test scenarios
  - [ ] Q&A session
- [ ] Regression testing after UAT fixes:
  - [ ] Re-run all automated tests
  - [ ] Verify no new bugs introduced
- [ ] Go/no-go decision documented

**Files**:

- `docs/qa/test-plans/UAT-003-plan.md`
- `docs/qa/test-plans/UAT-003-scenarios.md`
- `docs/qa/test-plans/UAT-003-feedback-form.md`
- `docs/qa/test-plans/UAT-003-results.md`

**Labels**: `TASK-003`, `phase-4-test`, `priority-high`, `uat`, `stakeholder`

---

## Task Summary (Updated)

| Phase              | Tasks  | Effort (days)  | Priority |
| ------------------ | ------ | -------------- | -------- |
| Phase 0: DB        | 4      | 2-3            | Critical |
| Phase 1: NLP       | 9      | 13-16          | Critical |
| Phase 2: UI        | 11     | 15-18          | High     |
| Phase 3: Analytics | 7      | 12-15          | Medium   |
| Phase 4: Test      | 9      | 14-17          | High     |
| **Total**          | **40** | **56-69 days** | -        |

**Estimated Total Timeline**: 11-14 weeks (56-69 working days for complete feature)

---

## Updated Next Steps

---

## GitHub Issues Mapping

Existing issues #84-#108 (25 tasks) need to be updated to match this structure:

**Next Action**: Map existing GitHub issues to TASK-003-XXX numbering and add proper labels (TASK-003, phase-X-xxx, priority-xxx).

---

## Dependencies

### External Libraries

- `openai@^4.0.0` - OpenAI SDK
- `@anthropic-ai/sdk@^0.10.0` - Claude SDK (optional)
- `@google/generative-ai@^0.1.0` - Gemini SDK (optional)
- `tiktoken@^1.0.0` - Token counting for cost estimation
- Node.js `crypto` module - AES-256 encryption

### Infrastructure

- Google Secret Manager - API key storage
- PostgreSQL - Database for conversations and tracking
- Docker - Containerization
- Cloud Run - Production deployment

---

## Risk Mitigation

| Risk                       | Impact | Mitigation                                     |
| -------------------------- | ------ | ---------------------------------------------- |
| AI parsing accuracy < 80%  | High   | Extensive prompt engineering, fallback to form |
| API costs exceed budget    | High   | Usage tracking, rate limiting, caching         |
| AI provider outage         | Medium | Multi-provider fallback, circuit breaker       |
| PII leakage to AI provider | High   | Strict anonymization, audit logs               |
| Slow response time (>3s)   | Medium | Prompt optimization, caching, streaming        |

---

## Success Metrics

- **Parsing Accuracy**: ≥80% on test dataset
- **Response Time**: <2s for 95% of parse requests
- **Consultation Quality**: ≥4.0/5.0 user rating
- **Cost per User**: <$0.10/day average
- **Adoption Rate**: ≥30% of users try AI input within 2 weeks
- **Retention**: ≥50% of users continue using after first try
