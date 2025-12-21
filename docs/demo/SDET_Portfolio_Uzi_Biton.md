# Uzi Biton

## Senior QA Automation Engineer / SDET

**Portfolio Repository:** github.com/uzibiton/automation-interview-pre

**GitHub:** github.com/uzibiton | **LinkedIn:** linkedin.com/in/uzibiton

---

## PROFESSIONAL SUMMARY

Senior QA Automation Engineer specializing in **scalable test infrastructure** across web, API, and cloud-native applications. Expert in **CI/CD pipeline architecture** with GitHub Actions, automating deployment workflows to **Google Cloud Run**. Proven track record building **multi-layered testing strategies** (Unit → Integration → Contract → E2E → Non-Functional). Strong advocate for **quality by design**, shift-left testing, and infrastructure-as-code with **Docker containerization**.

---

## CORE TECHNICAL SKILLS

### Automation & Frameworks

- **E2E Testing:** Playwright, Cucumber (BDD)
- **Unit/Integration:** Jest, Pact (Contract Testing)
- **API Testing:** Postman, Newman
- **Performance:** Locust, k6, JMeter

### Testing Strategy

- End-to-End • Integration • Contract • Unit
- Performance • Security (OWASP ZAP)
- Accessibility (WCAG) • Visual Regression

### DevOps & Infrastructure

- **CI/CD:** GitHub Actions, Google Cloud Run
- **Containerization:** Docker, Docker Compose
- **Cloud:** Cloud Build, Artifact Registry

### Languages & Tools

- **Languages:** TypeScript/JavaScript, Python, Node.js
- **Frameworks:** NestJS, React
- **Databases:** PostgreSQL, Firestore
- **Other:** Git, Allure Reports, OAuth 2.0

---

## AUTOMATION & TESTING PHILOSOPHY

**🔺 Testing Strategy:** Multi-layered approach prioritizing fast unit tests, strategic integration tests, and focused E2E scenarios for critical paths
**\* Shift-Left:** Early testing integration in development cycle with unit and integration tests catching issues before deployment
**\* Shift-Right:** Production monitoring and synthetic testing to validate real-world behavior and user experience
**\* CI/CD Integration:** All tests integrated into automated pipelines for continuous feedback and validation on every commit
**🔗 Traceability:** Bidirectional linking between requirements, design documents, test cases, and implementation for complete coverage visibility
**📊 Quality Metrics That Matter:** Focus on defect escape rate, mean time to detection, and deployment frequency over vanity metrics
**🔧 Maintainability:** Page object models, reusable components, self-healing locators, clear naming conventions

---

## PROJECT SHOWCASE

### Multi-Environment Test Automation Infrastructure

**Problem:**  
Expense tracking microservices application needed comprehensive QA strategy with testing across 4 environments (local, Docker, staging, production)

**Solution:**

- Architected **multi-tier testing strategy** with comprehensive coverage across unit, integration, and E2E tests - **200+ test scenarios**
- Built **Playwright E2E framework** with environment-agnostic configuration for seamless multi-environment execution
- Designed **Docker-based test infrastructure** with service profiles (unit, integration, e2e, performance, security)
- Implemented **contract testing with Pact** and **BDD with Cucumber** for stakeholder-readable specifications

**Tech Stack:** Playwright • Jest • TypeScript • Docker Compose • GitHub Actions • PostgreSQL • Firestore

**Outcomes:**

- - **15+ test types** implemented (E2E, Integration, Contract, Performance, Security, Accessibility)
- - **Environment parity** achieved with single test codebase running across all environments
- - **Complete CI/CD pipeline** with automated quality gates

---

### Cloud-Native CI/CD Pipeline with Multi-Environment Deployment

**Problem:**  
Microservices application (Auth, API, Frontend) required automated deployment pipeline to Google Cloud Run with environment isolation and quality gates

**Solution:**

- Designed **GitHub Actions CI/CD workflow** with parallel job execution: quality gates → build → deploy
- Implemented **4-environment strategy**: Auto-deploy to develop on main push, manual staging/production, PR-based ephemeral environments
- Built **Docker multi-stage builds** optimizing image size and caching for 3 microservices
- Created **tag-based test suites** (smoke, sanity, regression, nightly) for flexible execution based on deployment stage

**Tech Stack:** GitHub Actions • Docker • Google Cloud Run • Cloud Build • PostgreSQL • Firestore • OAuth 2.0

**Outcomes:**

- - **Automated deployment pipeline** with <15 min total execution time
- - **Zero manual deployments** for develop environment
- - **Environment-specific secrets** management via GitHub Actions
- - **PR preview environments** with automatic cleanup

---

## CI/CD & QUALITY GATES EXPERIENCE

**🏗️ Pipeline Architecture:** Implemented parallel job execution (Prettier, ESLint, TypeScript, Security) running simultaneously for fast feedback
**\* Performance Testing:** Built non-functional test suite with k6, Locust, JMeter for load testing and Lighthouse for performance metrics
**🔒 Security Scanning:** Integrated OWASP ZAP for dynamic security testing and Bandit/Safety for Python dependency scanning
**🚀 Multi-Environment Deployment:** Orchestrated Google Cloud Run deployments across develop, staging, production with conditional triggers
**\* Infrastructure as Code:** Maintained Docker Compose profiles for isolated test execution and environment-specific configurations
**📊 Documentation & Traceability:** Created bidirectional traceability (REQ → HLD → TEST → Implementation) with structured issue templates

---

## NOTABLE ACHIEVEMENTS

- **🚀 Complete Testing Infrastructure:** Architected from scratch with 200+ test scenarios across 15+ test types
- **📁 Organized Structure:** 44 testing directories with clear separation: unit, component, integration, contract, E2E, non-functional, BDD
- **🔧 Docker-Based Environment:** Service profiles enabling isolated test execution without full stack
- **📊 Professional Documentation:** Requirements traceability, test plans, and execution reports
- **🌐 Multi-Environment Testing:** Same test suite runs across local, Docker, staging, and production

---

## TECHNICAL FOCUS & CONTINUOUS LEARNING

- - **Cloud-Native Testing** - GCP Cloud Run, Docker containerization, microservices architectures
- - **Modern Automation Frameworks** - Playwright, Jest, Cucumber, comprehensive multi-layered testing approach
- 🔍 **Currently exploring:** AI-assisted test generation, Model Context Protocol (MCP) for intelligent testing, synthetic monitoring

---

## KEY PROJECT HIGHLIGHTS

**This portfolio showcases:**

- **Complete GitHub repository** with comprehensive testing infrastructure
- **Live deployed application** on Google Cloud Run (Develop, Staging, Production)
- **Professional documentation** including requirements, HLD, test plans, traceability matrix
- **Multi-tier test strategy** with 15+ test types and 200+ scenarios
- **CI/CD automation** with GitHub Actions and Docker containerization
- **Real-world problem solving** from issue creation to deployment

**📊 View Complete Documentation:** [Table of Contents](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/TABLE_OF_CONTENTS.md)

---

## CONTACT & LINKS

- **GitHub:** [github.com/uzibiton](https://github.com/uzibiton)
- **LinkedIn:** [linkedin.com/in/uzibiton](https://linkedin.com/in/uzibiton)
- **Live Portfolio:** [Expense Tracker Demo](https://expense-tracker-buuath6a3q-uc.a.run.app)

---

_Portfolio generated: December 2025_
