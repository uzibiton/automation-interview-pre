# Future Ideas & Investigations

This document captures ideas that are currently out of scope but worth investigating. These are not tasks or features yet - they're concepts to explore and validate before committing to implementation.

**How to use this file:**

1. Add ideas as they come up (use the template below)
2. Research and expand on promising ideas
3. When an idea matures, create a GitHub issue using the [Idea/Investigation template](../../.github/ISSUE_TEMPLATE/template-idea.md)
4. Link the issue back to this document
5. Archive implemented ideas at the bottom

---

## 🔄 Offline-First Architecture

**Current State**: Application requires internet connection for all operations

**Idea**: Implement local-first data synchronization

- Use PouchDB for local storage with CouchDB/remote sync
- Enable offline expense tracking and management
- Option to run completely standalone (local-only mode) for expense data
- Authentication still requires remote (at least initially)

**Why Explore This**:

- Better user experience in poor connectivity
- Faster app performance (local reads)
- Privacy option (data stays on device)
- Learning opportunity: offline-first patterns, conflict resolution

**Research Needed**:

- [ ] PouchDB vs other local DB options (IndexedDB, Dexie.js)
- [ ] Sync conflict resolution strategies
- [ ] Auth token management in offline mode
- [ ] Initial sync performance with large datasets
- [ ] Migration strategy from current architecture

**Related Resources**:

- [PouchDB Documentation](https://pouchdb.com/)
- [Offline First Principles](https://offlinefirst.org/)

**Status**: 🔵 Idea

---

## 📱 Native Mobile Application

**Current State**: PWA provides mobile access but limited native features

**Idea**: Create native mobile apps (iOS/Android) aligned with PWA design

- React Native or Flutter for cross-platform development
- Share design system and business logic with web
- Leverage native features: biometric auth, push notifications, camera
- Maintain feature parity with PWA

**Why Explore This**:

- App store presence and discoverability
- Better mobile UX with native navigation patterns
- Access to platform-specific APIs
- Offline-first easier with native storage

**Research Needed**:

- [ ] React Native vs Flutter vs native
- [ ] Code sharing strategy with existing React codebase
- [ ] Build and deployment pipeline (Fastlane, App Center)
- [ ] App store submission requirements
- [ ] Maintenance overhead vs PWA benefits

**Related Resources**:

- [React Native Documentation](https://reactnative.dev/)
- [Expo for easier RN development](https://expo.dev/)

**Status**: 🔵 Idea

---

## 🤖 Automated Maintenance Reminders

**Current State**: Manual tracking of maintenance tasks in MAINTENANCE.md

**Idea**: GitHub Actions workflow to automatically create monthly maintenance issues

- Scheduled workflow runs on 1st of each month
- Creates issue with full maintenance checklist
- Auto-assigns to repository owner
- Labels with `maintenance` and `priority:medium`
- Links back to MAINTENANCE.md for tracking

**Why Explore This**:

- Never forget monthly maintenance tasks
- Trackable in GitHub's issue system
- Can discuss maintenance items in issue comments
- History of maintenance work visible in closed issues
- Learning opportunity: scheduled GitHub Actions workflows

**Research Needed**:

- [ ] GitHub Actions schedule syntax and reliability
- [ ] Issue template formatting in workflow scripts
- [ ] Notification settings (email, Slack integration)
- [ ] How to handle when tasks not completed (carry over?)
- [ ] Integration with project boards

**Related Resources**:

- [GitHub Actions Schedule Events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [github-script action](https://github.com/actions/github-script)
- [Creating issues via API](https://docs.github.com/en/rest/issues/issues#create-an-issue)

**Effort Estimate**: Small

**Value/Impact**: Medium (convenience, consistency)

**Status**: 🔵 Idea

---

## Template for New Ideas

When adding a new idea, copy and fill out this template:

```markdown
## 💡 [Idea Title]

**Current State**: Describe what exists today

**Idea**: Brief description of the concept

- Key points
- Main features or approaches
- Target outcome

**Why Explore This**:

- Problem it solves
- Benefit to users/project
- Learning opportunities

**Research Needed**:

- [ ] Question 1
- [ ] Question 2
- [ ] Question 3

**Related Resources**:

- [Link 1](url)
- [Link 2](url)

**Status**: 🔵 Idea

**GitHub Issue**: [#XXX](link) _(when created)_
```

**Status Legend**:

- 🔵 Idea - Initial concept, needs research
- 🟡 Researching - Actively investigating feasibility
- 🟢 Ready - Validated, can create implementation issue
- ⚪ Implemented - Completed, see linked issue/PR
- 🔴 Rejected - Not pursuing, reason documented

---

## 📋 Workflow: Idea → Feature

1. **Capture Idea**: Add to this file using template above
2. **Research**: Update with findings, mark status as 🟡 Researching
3. **Validate**: Prototype if needed, assess effort/value
4. **Create Issue**: When ready, use [Idea/Investigation issue template](../../.github/ISSUE_TEMPLATE/template-idea.md)
   - Template automatically applies `type:idea` label
   - Reference this IDEAS.md section
   - Include research findings and proposed approach
5. **Implement**: Issue becomes part of normal workflow
6. **Archive**: Mark as ⚪ Implemented with links

---

## 📦 Implemented Ideas Archive

_(Ideas that have been implemented will be moved here with links to relevant PRs/issues)_

---

## 🗑️ Rejected Ideas Archive

_(Ideas that were investigated but decided against, with rationale)_
