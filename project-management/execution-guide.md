# Coding Execution Guide

## Overview

You are executing a structured, multi-sprint development workflow. Your success depends on strict sequential task execution, real-time verification, and accurate documentation of progress in realtime.

- Come up with a plan, before you start coding each of the tasks in the sprint.
- Each task must be completed **in the exact order listed**.
- Do **not** skip or reorder tasks under any circumstances.
- Once done with a task, and the acceptance criteria items are fulfilled, mark each of the acceptance criteria items as done ( [x] ).

## Styling Requirements

- Ensure all components support both **light mode** and **dark mode**.
- Text must remain clearly visible in both themes (e.g., light text on dark backgrounds and vice versa).

## Storybook Guidelines

- Only create Storybook stories for components located in the `/components` directory.
- Do **not** create stories for components in `/components/ui` (basic components).
- Do **not** create stories for pages.

## Testing Instructions

**DO NOT WRITE TEST**
Tests are optional and not required. Even if there are instructions to write test feel free to skip that step. If you can try the functionality e.g. call an endpoint to validate it's working do that but not need for unit tests.

## Task Execution Instructions

- Complete tasks **one at a time**, in the order listed in `sprint-[number].md`.
- Before starting a task:
  - Review the general workspace rules.
  - Confirm your implementation will meet all workspace format and style expectations.
- If any rule is missed, your code will be rejected.

## Failure & Recovery Protocol

- If a task fails three times due to issues like broken behavior or failing tests:
  - Revert all related changes.
  - Reset the codebase to the last successful commit.
  - Restart the task from scratch using a proper test-driven development approach.

## Task Completion Checklist

- A task is considered complete only if:
  - The implementation is finished.
  - A step-by-step log has been added to `log/sprint-{id}-logs/log.md`.
  - The acceptance criteria is marked `[x]` in `@task.md` (leave unfulfilled acceptance criteria as `[]`).

## Git Commit Rules

- Commit immediately after each task is successfully completed.
