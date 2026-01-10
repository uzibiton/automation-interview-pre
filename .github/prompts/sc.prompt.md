---
agent: edit
model: GPT-5 mini (copilot)
---

# SC — Save & Compact (State Snapshot)

Trigger: `sc`

Purpose:
Create a minimal **state snapshot** so the conversation can be compacted or reset
without losing operational context.

---

## Core rules

- Save **state**, not chat history.
- Write only information required to continue work.
- Use short bullet points.
- No explanations, no discussion, no repetition.
- If information is uncertain — state it explicitly.

### Guard rule

If no meaningful or reusable state was produced, reply exactly with:

> No snapshot needed.

---

## Save file

- Path: `contexts/YYYYMMDD_HHMMSS_[topic].md`
- Topic:
  - 2–5 words
  - kebab-case
  - reflects current work focus

---

## Snapshot template

## State Snapshot

- Goal:
- Current state:
- Decisions locked:
- Constraints:

## Open tasks (priority order)

1.
2.
3.

## Files touched

- path/to/file.ext — one-line description

## Next action

- Next command or code change to perform

## Notes (optional)

- Risks / assumptions:
- Deferred items:

**Action:** Create the file at `contexts/YYYYMMDD_HHMMSS_[topic].md` using the template above, replacing placeholders with actual session state.
