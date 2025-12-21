<div style="text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px;">

# 🚀 Uzi Biton

## Senior QA Automation Engineer / SDET

📧 uzibiton@example.com | 🔗 [GitHub](https://github.com/uzibiton) | 💼 [LinkedIn](https://linkedin.com/in/uzibiton)

</div>

---

## 👤 PROFESSIONAL SUMMARY

<div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin: 10px 0;">

✦ Senior QA Automation Engineer specializing in **scalable test infrastructure** across web, API, and cloud-native applications  
✦ Expert in **CI/CD pipeline architecture** with GitHub Actions, automating deployment workflows to **Google Cloud Run**  
✦ Proven track record building **multi-layered testing strategies** (Unit → Integration → Contract → E2E → Non-Functional)  
✦ Strong advocate for **quality by design**, shift-left testing, and infrastructure-as-code with **Docker containerization**

</div>

---

## 🛠️ CORE TECHNICAL SKILLS

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">

<div style="background-color: #ecf0f1; padding: 12px; border-radius: 5px;">

**🎯 Automation & Frameworks**

- Playwright • Jest • Cucumber (BDD)
- Postman/Newman • Pact (Contract Testing)
- Locust • k6 • JMeter

</div>

<div style="background-color: #ecf0f1; padding: 12px; border-radius: 5px;">

**🧪 Testing Strategy**

- E2E • Integration • Contract • Unit
- Performance • Security (OWASP ZAP)
- Accessibility (WCAG) • Visual Regression

</div>

<div style="background-color: #ecf0f1; padding: 12px; border-radius: 5px;">

**⚙️ DevOps & Infrastructure**

- GitHub Actions • Google Cloud Run
- Docker • Docker Compose
- Cloud Build • Artifact Registry

</div>

<div style="background-color: #ecf0f1; padding: 12px; border-radius: 5px;">

**💻 Languages & Tools**

- TypeScript/JavaScript • Python • Node.js
- NestJS • React • PostgreSQL • Firestore
- Git • Allure Reports • OAuth 2.0

</div>

</div>

---

## 💡 AUTOMATION & TESTING PHILOSOPHY

<div style="background-color: #fff9e6; padding: 15px; border-left: 4px solid #f39c12; margin: 10px 0;">

🔺 **Test Pyramid in Practice:** Prioritize fast unit tests (70%), strategic integration tests (20%), focused E2E scenarios (10%)

⚡ **CI/CD First:** Every test should run in pipeline; if it doesn't run automatically, it doesn't exist

📊 **Quality Metrics That Matter:** Focus on defect escape rate, mean time to detection, and deployment frequency over vanity metrics

🔧 **Maintainability:** Page object models, reusable components, self-healing locators, clear naming conventions

</div>

---

## 📁 SELECTED PROJECTS

### 🎯 Project 1: Multi-Environment Test Automation Infrastructure

<div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #27ae60; margin: 10px 0;">

**❌ Problem:**  
Expense tracking microservices application needed **comprehensive QA strategy** with testing across **4 environments** (local, Docker, staging, production)

**✅ Solution:**

- Architected **multi-tier testing pyramid**: 60% unit, 30% integration, 10% E2E across **200+ test scenarios**
- Built **Playwright E2E framework** with environment-agnostic configuration for seamless **multi-environment execution**
- Designed **Docker-based test infrastructure** with service profiles (unit, integration, e2e, performance, security)
- Implemented **contract testing with Pact** and **BDD with Cucumber** for stakeholder-readable specifications

**🔧 Tech Stack:** `Playwright` • `Jest` • `TypeScript` • `Docker Compose` • `GitHub Actions` • `PostgreSQL` • `Firestore`

**📈 Outcomes:**  
✓ **15+ test types** implemented (E2E, Integration, Contract, Performance, Security, Accessibility)  
✓ **Environment parity** achieved with single test codebase running across all environments  
✓ **Complete CI/CD pipeline** with automated quality gates

**→** [View on GitHub](https://github.com/uzibiton/automation-interview-pre)

</div>

### 🎯 Project 2: Cloud-Native CI/CD Pipeline with Multi-Environment Deployment

<div style="background-color: #e3f2fd; padding: 15px; border-left: 4px solid #3498db; margin: 10px 0;">

**❌ Problem:**  
Microservices application (Auth, API, Frontend) required **automated deployment pipeline** to **Google Cloud Run** with **environment isolation** and **quality gates**

**✅ Solution:**

- Designed **GitHub Actions CI/CD workflow** with parallel job execution: quality gates → build → deploy
- Implemented **4-environment strategy**: Auto-deploy to develop on main push, manual staging/production, PR-based ephemeral environments
- Built **Docker multi-stage builds** optimizing image size and caching for **3 microservices**
- Created **tag-based test suites** (smoke, sanity, regression, nightly) for flexible execution based on deployment stage

**🔧 Tech Stack:** `GitHub Actions` • `Docker` • `Google Cloud Run` • `Cloud Build` • `PostgreSQL` • `Firestore` • `OAuth 2.0`

**📈 Outcomes:**  
✓ **Automated deployment pipeline** with <15 min total execution time  
✓ **Zero manual deployments** for develop environment  
✓ **Environment-specific secrets** management via GitHub Actions  
✓ **PR preview environments** with automatic cleanup

**→** [View on GitHub](https://github.com/uzibiton/automation-interview-pre)

</div>

---

## 🔄 CI/CD & QUALITY GATES EXPERIENCE

<div style="background-color: #f3e5f5; padding: 15px; border-left: 4px solid #9b59b6; margin: 10px 0;">

🏗️ **Pipeline Architecture:** Implemented **parallel job execution** (Prettier, ESLint, TypeScript, Security) running simultaneously for fast feedback

⚡ **Performance Testing:** Built **non-functional test suite** with k6, Locust, JMeter for load testing and Lighthouse for performance metrics

🔒 **Security Scanning:** Integrated **OWASP ZAP** for dynamic security testing and **Bandit/Safety** for Python dependency scanning

🚀 **Multi-Environment Deployment:** Orchestrated **Google Cloud Run deployments** across develop, staging, production with conditional triggers

☁️ **Infrastructure as Code:** Maintained **Docker Compose profiles** for isolated test execution and **environment-specific configurations**

📊 **Documentation & Traceability:** Created **bidirectional traceability** (REQ → HLD → TEST → Implementation) with structured issue templates

</div>

---

<div style="page-break-before: always;"></div>

## 🏆 NOTABLE ACHIEVEMENTS

<div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #e67e22; margin: 10px 0;">

🚀 Architected **complete testing infrastructure** from scratch with **200+ test scenarios** across **15+ test types**

📁 Organized **44 testing directories** with clear separation: unit, component, integration, contract, E2E, non-functional, BDD

🔧 Built **Docker-based testing environment** with service profiles enabling isolated test execution without full stack

📊 Implemented **professional documentation strategy** with requirements traceability, test plans, and execution reports

🌐 Achieved **true multi-environment testing** - same test suite runs across local, Docker, staging, and production

</div>

---

## 🎓 TECHNICAL FOCUS & CONTINUOUS LEARNING

<div style="background-color: #e8f8f5; padding: 15px; border-left: 4px solid #16a085; margin: 10px 0;">

✓ **Cloud-Native Testing** - GCP Cloud Run, Docker containerization, microservices architectures

✓ **Modern Automation Frameworks** - Playwright, Jest, Cucumber, comprehensive test pyramid implementation

🔍 **Currently exploring:** AI-assisted test generation, Model Context Protocol (MCP) for intelligent testing, synthetic monitoring

</div>

---

<div style="text-align: center; background-color: #2c3e50; color: white; padding: 20px; margin-top: 30px;">

## 📬 LET'S CONNECT

🔗 **GitHub:** [github.com/uzibiton](https://github.com/uzibiton)  
💼 **LinkedIn:** [linkedin.com/in/uzibiton](https://linkedin.com/in/uzibiton)  
📧 **Email:** uzibiton@example.com  
🌐 **Live Portfolio:** [Expense Tracker Demo](https://expense-tracker-buuath6a3q-uc.a.run.app)

</div>

---

---

## 📋 KEY PROJECT HIGHLIGHTS

<div style="background-color: #fef5e7; padding: 15px; border: 2px dashed #f39c12; margin: 10px 0;">

**This portfolio showcases:**

✓ **Complete GitHub repository** with comprehensive testing infrastructure  
✓ **Live deployed application** on Google Cloud Run (Develop, Staging, Production)  
✓ **Professional documentation** including requirements, HLD, test plans, traceability matrix  
✓ **Multi-tier test strategy** with 15+ test types and 200+ scenarios  
✓ **CI/CD automation** with GitHub Actions and Docker containerization  
✓ **Real-world problem solving** from issue creation to deployment

**📊 View Complete Documentation:** [Table of Contents](https://github.com/uzibiton/automation-interview-pre/blob/main/docs/TABLE_OF_CONTENTS.md)

</div>

---

<div style="text-align: center; color: #7f8c8d; font-size: 10pt; padding: 20px;">

💡 **Pro Tip:** Keep your GitHub repositories clean with detailed README files and commit history.  
Recruiters will click those links!

</div>
