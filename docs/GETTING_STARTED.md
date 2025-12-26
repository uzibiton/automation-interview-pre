# Getting Started

Quick onboarding guide for contributors.

---

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Docker Desktop** ([download](https://www.docker.com/products/docker-desktop/))
- **Git** ([download](https://git-scm.com/))

---

## Quick Setup

```bash
git clone https://github.com/uzibiton/automation-interview-pre.git
cd automation-interview-pre
npm install
cp .env.example .env
docker-compose up -d
```

**Detailed setup**: [RUN_LOCALLY.md](dev/RUN_LOCALLY.md)

---

## Run Tests

```bash
npm run test:e2e:local     # E2E tests
npm run test:unit          # Unit tests
npm run test               # All tests
```

**Detailed testing guide**: [E2E_TESTING_GUIDE.md](qa/E2E_TESTING_GUIDE.md)

---

## Contributing

1. Find an issue: [GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues)
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes + add tests
4. Submit PR against `main`

**Detailed workflow**: [PR_WORKFLOW_GUIDE.md](qa/PR_WORKFLOW_GUIDE.md)

---

## Key Files

| What | Where |
|------|-------|
| Documentation index | [TABLE_OF_CONTENTS.md](TABLE_OF_CONTENTS.md) |
| Testing strategy | [TEST_STRATEGY.md](qa/TEST_STRATEGY.md) |
| CI/CD pipeline | [CI_CD_GUIDE.md](devops/CI_CD_GUIDE.md) |
| Roadmap | [TODO.md](TODO.md) |

---

## Conventions

- **Branches**: `feature/`, `fix/`, `docs/`
- **Commits**: Conventional (`feat:`, `fix:`, `docs:`)
- **Docs**: `REQ-###`, `HLD-###`, `TEST-###`, `TASKS-###`

See [TRACEABILITY_MATRIX.md](product/TRACEABILITY_MATRIX.md) for document relationships.

---

## Need Help?

- [TABLE_OF_CONTENTS.md](TABLE_OF_CONTENTS.md) - Full documentation
- [QUICK_FIX.md](dev/QUICK_FIX.md) - Common problems
- [GitHub Issues](https://github.com/uzibiton/automation-interview-pre/issues) - Ask questions
