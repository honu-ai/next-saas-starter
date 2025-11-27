# 🎯 Trello Board Manager Playbook

Last Updated: 2025-08-12 · Version: 1.0

A comprehensive guide for managing software development projects using our standardized Trello Board system.

## 📋 Table of Contents

- [Overview](#overview)
- [States & Gates](#states--gates)
  - [Definition of Ready (DoR) — To Do](#definition-of-ready-dor--to-do)
  - [QA Gate (Ready for QA)](#qa-gate-ready-for-qa)
  - [Definition of Done (DoD) — Moving to Done](#definition-of-done-dod--moving-to-done)
- [Labels & Classification](#labels--classification)
  - [Task Types](#task-types-primary-labels)
  - [Priority Levels](#priority-levels)
  - [Stack Labels](#stack-labels)
  - [Special Labels](#special-labels)
  - [Sprint Types](#sprint-types)
- [Dependency Management](#dependency-management)
- [Blocker & Expedite Policy](#blocker--expedite-policy)
- [Board Operations](#board-operations)
  - [Create/Refine a Backlog Card](#createrefine-a-backlog-card)
  - [Promote Backlog → To Do](#promote-backlog--to-do)
  - [Choose the Next Task](#choose-the-next-task)
  - [Start Work](#start-work)
  - [Submit for Code Review](#submit-for-code-review)
  - [Handoff to QA](#handoff-to-qa)
  - [Maintenance](#maintenance)
- [Communication Protocol](#communication-protocol)
- [Good Card Guidelines](#good-card-guidelines)
- [Board Ceremonies](#board-ceremonies)
  - [Backlog Refinement](#backlog-refinement)
  - [Replenishment](#replenishment)
- [Templates](#templates)
- [Quick Reference](#quick-reference)
- [Healthy Board Checklist](#healthy-board-checklist)

---

## 🧭 Overview

Purpose: Give the Agent clear, concise rules to operate the Trello Kanban board.

Roles: Agent (executes), User (approves, clarifies, performs final QA sign-off).

Conventions: We refer to Definition of Ready as DoR and Definition of Done as DoD after first mention. List names are written exactly as: "To Do", "In Progress", "Code Review", "QA", "Done", "On Hold".

Kanban columns:

| Column                  | Purpose                          | When to Use                                |
| ----------------------- | -------------------------------- | ------------------------------------------ |
| **Sprint Descriptions** | High-level sprint overview cards | Store sprint metadata and goals            |
| **Backlog**             | Future work not yet prioritized  | Ideas and long-term tasks                  |
| **To Do**               | Ready-to-start tasks             | Work that's been planned and prioritized   |
| **In Progress**         | Currently active work            | Tasks being actively developed (limit WIP) |
| **Code Review**         | Completed implementation         | Code ready for peer review                 |
| **QA**                  | Reviewed code ready for testing  | Tasks undergoing quality assurance         |
| **Done**                | Completed and deployed           | Successfully finished work                 |
| **On Hold**             | Temporarily paused work          | Blocked or deprioritized tasks             |

---

Workflow:

```
To Do → In Progress → Code Review → QA → Done
           ↓
        On Hold (if blocked)
```

Rules:

- WIP limit: 2–3 tasks in In Progress
- One-task focus; finish before starting new
- Manual tasks first when they unblock others
- Blocked tasks stay in To Do

---

## ✅ States & Gates

### Definition of Ready (DoR) — To Do

A card may enter the `To Do` list only if ALL are present:

- Clear title describing the work only.
- Description includes: Context, Scope/Out of Scope, and a filled **Dependencies** checklist.
- Acceptance Criteria: bullet list using verifiable statements.
- QA Steps: explicit steps the User will execute to verify.
- Labels: exactly one Sprint label, one Type, one Priority, optional Stack.

Rules:

- Do not move items from `Backlog` to `To Do` unless they meet the above.
- If information is missing or unclear, ask in chat AND comment on the card tagging its creator/owner.

### QA Gate (Ready for QA)

Before moving a card to `QA`, the Agent MUST:

1. Read all Acceptance Criteria and confirm they are implemented.
2. Tick off each Acceptance Criterion on the card (or link evidence if applicable).
3. Update the description/checkboxes with any relevant notes, links, or screenshots.
4. Add a comment summarizing what was done and tag the card owner.

After moving the card to `QA`, the Agent pauses execution and assists the User through the QA Steps (answer questions, provide test data, reproduce steps). The Agent must not move a card to `Done`; the User confirms and moves it after QA passes.

---

### Definition of Done (DoD) — Moving to Done

A card may only be moved to `Done` after it has passed QA and ALL are true. The User performs the final move; the Agent assists verification.

- [ ] All Acceptance Criteria are ticked.
- [ ] Code merged and deployed to the target environment.
- [ ] QA approved by card owner or designated QA.
- [ ] Dependent cards updated (dependency checklist items ticked).
- [ ] User sign-off recorded in a comment.

---

## 🗂️ Labels & Classification

### Task Types (Primary Labels)

| Label         | When to Use                               | Example                                  |
| ------------- | ----------------------------------------- | ---------------------------------------- |
| **Manual**    | Setup, configuration, or human-only tasks | Environment setup, API key configuration |
| **Feature**   | New functionality or enhancements         | New UI components, API endpoints         |
| **Bug**       | Fixing broken functionality               | Error handling, UI fixes                 |
| **Chore**     | Maintenance and housekeeping              | Documentation, refactoring               |
| **Tech Debt** | Improving code quality                    | Performance optimization, code cleanup   |

### Priority Levels

| Label               | Meaning                        |
| ------------------- | ------------------------------ |
| **Priority High**   | Critical path, blocking others |
| **Priority Medium** | Standard priority              |
| **Priority Low**    | Nice to have, non-urgent       |

### Stack Labels

| Label         | Team/Skill Focus           |
| ------------- | -------------------------- |
| **Frontend**  | UI/UX, client-side code    |
| **Backend**   | Server, API, database      |
| **Fullstack** | Both frontend and backend  |
| **DevOps**    | Infrastructure, deployment |

### Special Labels

| Label                   | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| **Needs Clarification** | Requires more information before starting |

Applying labels:

- Use: `[Sprint] + [Type] + [Priority] + [Stack]`.
- Exactly one Sprint label is REQUIRED.
- Add `Needs Clarification` when requirements are unclear.

Sprint label creation:

- For Feature Sprints: create a unique sprint label (e.g., `Sprint 2: User Profiles`) during Sprint Planning.
- For Kanban Sprints: ensure a standing sprint label exists (e.g., `Q4-Bugs-Chores`). Create it if missing.
- All cards MUST have exactly one sprint label before entering `To Do`.

### Sprint Types

To categorize all work while staying agile, use two sprint label styles:

1. Feature Sprints

- Examples: `Sprint 1: Content Discovery`, `Sprint 2: User Profiles`
- Use for large, planned initiatives delivering cohesive value
- Always initiated via Sprint Planning and linked to a Sprint Description card

2. Kanban Sprints

- Examples: `Q4-Bugs-Chores`, `October-Maintenance`, `Ongoing-Improvements`
- Use for one-off bugs, chores, tech debt, small improvements
- No formal user journey or Sprint Planning required

---

## 🔗 Dependency Management

### Understanding Dependencies

Every task can have a **Dependencies** checklist that tracks what must be completed before the task can start.

### Dependency Types

1. **Manual Task Dependencies**
   - Format: `Manual Sprint Setup - https://trello.com/c/cardid`
   - Must be completed before regular development tasks

2. **Task Dependencies**
   - Format: `URL Input Form - https://trello.com/c/cardid`
   - One task depends on another's completion

3. **External Dependencies**
   - Format: `Database Configuration`
   - Non-Trello dependencies (APIs, third-party services)

---

## 🛑 Blocker & Expedite Policy

Defines how to handle blocked or urgent tasks without disrupting flow.

### Blocker Management

- When a task in `To Do` or `In Progress` cannot proceed, move it to `On Hold`.
- Comment the reason, what is needed, and tag the responsible owner.
- Agent monitors and notifies the User; during maintenance, ask for updates on `On Hold` items.

### Expedite Process

- User flags an urgent card by prefixing title with `[EXPEDITE]`.
- The card jumps to the top of `To Do`.
- Agent must ask permission to pause current work before starting the expedited item.
- WIP limit may be exceeded temporarily only with explicit User approval.

---

## 🚀 Board Operations

### Create/Refine a Backlog Card

- Clarify context and scope; add Dependencies checklist.
- Add Acceptance Criteria and QA Steps that are verifiable and concise.
- Split large/ambiguous items into vertical slices that each meet DoR. Optionally create a parent Epic linking to children.
- When unclear, ask in chat AND comment on the card tagging its creator/owner.
- The User and collaborators may add items directly to `Backlog`. The Agent may also propose and add future improvement items, but MUST ask the User for permission first.

### Promote Backlog → To Do

- Only promote when the card meets the Definition of Ready.
- Ensure labels are set (exactly one Sprint label, one Type, one Priority, optional Stack).

### Choose the Next Task

#### Step 1: Get All Tasks from To Do

- Gets all cards from the "To Do" list
- Tasks are already in priority order

#### Step 2: Split Tasks into Two Groups

- **Manual tasks**: Any task with the **Manual** label
- **Regular tasks**: All other development tasks

#### Step 3: Try to Find an Available Regular Task

- Goes through regular tasks one by one, in order
- For each task, asks: "Can this task be started right now?"

#### Step 4: Check if Task is Blocked (The Smart Part)

- Looks for a "Dependencies" checklist on the task card
- Uses AI analysis to determine: "Does this task need any incomplete manual work first?"
- AI considers:
  - What dependencies are listed
  - What manual tasks are still not done
  - Whether this task can start without waiting

#### Step 5: Make the Decision

- ✅ **If task is available**: Pick it! Move to "In Progress"
- ❌ **If task is blocked**: Skip it, check the next task
- Continue until finding first available task

#### Step 6: If ALL Regular Tasks are Blocked

- **Smart suggestion**: Analyze which manual task would unblock the most regular tasks
- **Recommendation**: "Do this manual task first because it will unblock 3 other tasks"

#### Step 7: If Only Manual Tasks Exist

- **Simple recommendation**: "Do the first manual task in the list"

#### 🎯 The Key Insight

The system picks the **FIRST available task in priority order**, not just any available task. This ensures high-priority work gets done first while respecting dependencies.

##### Example Flow:

- **Task A** (high priority) → Blocked by manual setup
- **Task B** (medium priority) → Blocked by manual setup
- **Task C** (lower priority) → ✅ Available!

**Result**: Pick Task C (even though lower priority, it's the first one that CAN be done)

### Start Work

- Ask permission from the User. If granted, move the card from `To Do` to `In Progress` and leave a brief progress comment.

### Submit for Code Review

- Open a PR and link it in the card; request review.
- Ensure CI/tests pass and perform a self-review before requesting others.
- Security quick-check: auth paths, input validation, secrets, error handling. Note Security Risk: Low/Med/High and whether human review is needed before merge.

### Handoff to QA

- If the task has a QA list (typically a checklist in the description) and all Acceptance Criteria are checked, move it to the QA column. Add a comment tagging the owner and be ready to assist them through the QA steps.
- After transferring to QA, propose any QA steps the Agent can execute themselves (e.g., smoke tests, basic flows). Ask for permission; if granted, perform them and tick off the completed QA steps with brief evidence links.

### Maintenance

- From time to time, to tidy up the board, check the following:
  - If cards are stuck in QA for more than 24h tag the owner of the card, or the person responsible for QA and ask them to have a look or update the status.
  - For cards in the Done column that have been moved there in the last 24h, double check if any of the cards in the To Do column had any dependencies on them; if so, tick off the dependency.
  - Reorder the Tasks in the To Do column based on priority and sprint labels.
- **Always** suggest a plan and ask for permission before doing any of the actions above. THIS IS VERY IMPORTANT — NEVER DO ANY CLEANUP BEFORE YOU ASK THE USER.
  - For cards in `Done` older than 7 days, propose archiving to keep the board clean.

---

## 💬 Communication Protocol

- When requirements are unclear: ask clarifying questions in chat AND on the card, tagging the creator/owner.
- Keep a brief progress comment when changing status (start, code review, QA handoff).
- Record blockers and proposed next actions.

---

## 🪴 Good Card Guidelines

Keep every card small, testable, and unambiguous.

- Title: describes the work only; no sprint info in title.
- Description: context + explicit scope/out of scope.
- Dependencies: checklist linking manual/tasks/external items.
- Acceptance Criteria: verifiable statements, each a checkbox.
- QA Steps: clear steps the User (or Agent with permission) can follow; include test data if relevant.
- Labels: exactly one Sprint, one Type, one Priority; optional Stack; add Needs Clarification if anything is unclear.
- Links: PR/branch/reference designs when available.
- Size: if too large for one flow, split into vertical slices and link via a parent Epic.

Cards that meet the above are considered DoR-ready.

---

## 🗓️ Board Ceremonies

Structured interactions that keep the board healthy. The User can initiate at any time. The Agent may propose and run them, but MUST ask for permission first.

### Backlog Refinement

- When to invoke: backlog items missing DoR elements, or before replenishment.
- Start: Agent requests permission to start refinement and lists candidates needing work.
- Process: For each candidate, the Agent asks clarifying questions, updates Description, Dependencies, Acceptance Criteria, QA Steps, and Labels until DoR is met.
- End: Mark refined items as DoR-ready and tag the creator/owner with a summary comment.

### Replenishment

- When to invoke: `To Do` is running low or at the start of a new cycle.
- Start: Agent requests permission to replenish and proposes DoR-ready candidates to move.
- Process: Move approved items from `Backlog` to `To Do`, then order by priority and sprint.
- End: Post a brief summary comment listing moved cards and next steps.

---

## 📄 Templates

Copy this into the card description when creating/refining a task:

```md
Title: [Description only]
Description: Context + Scope/Out of Scope.
Dependencies:

- [ ] [Manual/Task/External] ...
      Acceptance Criteria:
- [ ] [verifiable criterion]
      QA Steps:

1. [step 1]
   Labels: Sprint X; [Type]; [Priority]; [Stack]
```

---

## 🧾 Quick Reference

- **DoR (To Do)**: Title, Description (context/scope), Dependencies checklist, Acceptance Criteria, QA Steps, Labels (1 Sprint, 1 Type, 1 Priority, optional Stack).
- **Task order**: Pick the first available task in priority order. Respect dependencies; suggest the manual task that unblocks most if all are blocked.
- **QA Gate (DoD)**: Check off all Acceptance Criteria, move to QA, comment + tag owner, then pause and assist the user with QA steps. User moves to Done.
- **Backlog → To Do**: Only after it meets DoR. Split large items into smaller DoR-ready cards.
- **Backlog ownership**: User/collaborators may add items. Agent may propose/add improvements only after user approval.
- **Communication**: Ask clarifying questions in chat and on card (tag creator). Comment on status changes and blockers.
- **Cleanup**: Never tidy or reorganize without proposing a plan and getting approval.

---

## 🌿 Healthy Board Checklist

- To Do contains only DoR-ready cards, each with one Sprint label, one Type, one Priority, and optional Stack.
- In Progress respects WIP limits (2–3) and has brief progress comments.
- Code Review and QA contain only cards truly at that stage with linked PRs and ticked Acceptance Criteria.
- On Hold contains only blocked cards with a comment explaining why and who is tagged to unblock.
- Done is reviewed daily; dependencies updated; items older than 7 days are proposed for archive.
- Backlog is coherent: large items are split into vertical slices; unclear items are tagged Needs Clarification; future improvements may exist but were added with user permission.
