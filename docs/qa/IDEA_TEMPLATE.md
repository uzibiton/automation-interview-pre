# Idea Template

Use this template when documenting a new idea in `docs/general/IDEAS.md`.

**For GitHub Issues**: Use the [Idea/Investigation issue template](../../.github/ISSUE_TEMPLATE/template-idea.md) which automatically applies the `type:idea` label.

---

## 💡 [Idea Title]

**Current State**: Describe what exists today and what problem or limitation you've observed

**Idea**: Brief description of the concept (2-3 sentences)

- Key points or approaches
- Main features or capabilities
- Target outcome or goal

**Why Explore This**:

- Problem it solves or opportunity it creates
- Benefit to users/project/team
- Learning opportunities or technical growth
- Strategic alignment with project goals

**Research Needed**:

- [ ] Technical feasibility question 1
- [ ] Question about alternatives or trade-offs
- [ ] Integration or compatibility concerns
- [ ] Performance/scalability considerations
- [ ] Security/privacy implications

**Related Resources**:

- [Documentation or article](url)
- [Similar implementation example](url)
- [Library or tool](url)

**Effort Estimate**: _(Small / Medium / Large / Unknown)_

**Value/Impact**: _(Low / Medium / High / Unknown)_

**Dependencies**:

- Prerequisite features or infrastructure
- External libraries or services
- Team skills or knowledge needed

**Risks & Concerns**:

- Technical risks
- Maintenance overhead
- Breaking changes or migration complexity

**Success Criteria**:

- How will we know this idea succeeded?
- What metrics or outcomes validate the approach?

**Status**: 🔵 Idea

**GitHub Issue**: [#XXX](link) _(when created)_

**Last Updated**: YYYY-MM-DD

---

## Status Legend

- 🔵 **Idea** - Initial concept, needs research
- 🟡 **Researching** - Actively investigating feasibility
- 🟢 **Ready** - Validated, can create implementation issue
- ⚪ **Implemented** - Completed, see linked issue/PR
- 🔴 **Rejected** - Not pursuing, reason documented

---

## Usage Notes

### For IDEAS.md

- Keep descriptions concise (can expand as you research)
- Update status as you progress
- Link to GitHub issues when created
- Move to archive section when resolved

### For GitHub Issues

When an idea is mature enough to become an issue:

1. Go to [New Issue](https://github.com/uzibiton/automation-interview-pre/issues/new/choose)
2. Select "Idea / Investigation" template
3. Fill in the template with research findings from IDEAS.md
4. The `type:idea` label is automatically applied
5. Add to project board if appropriate
6. Link back to IDEAS.md section

### Transitioning from Idea to Feature

When ready to implement:

1. Change label from `type:idea` to `type:feature`
2. Create detailed requirements using ../product/REQUIREMENTS_TEMPLATE.md
3. Update status in IDEAS.md to ⚪ Implemented
4. Link to implementation PR/issues
