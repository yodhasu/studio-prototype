# Specialist Commentary & Fix Plan

Date: 2026-04-22 (Asia/Jakarta)
Target: `fe/` in `studio-prototype`

## Executive assessment
The frontend currently behaves like a **high-fidelity concept demonstrator** with uneven interaction contracts. The visual shell is strong, but interaction reliability is below the threshold required for SaaS-grade workflow continuity.

In practical terms:
- Users can perceive product intent quickly.
- Users cannot consistently complete core workflows (project creation, scheduling action, collaborative editing) via predictable UI behavior.

## Root-cause categories

## 1) Contract drift between UI and state layer
Symptoms:
- UI implies actions exist, but handlers/store capabilities do not consistently align.
- Boot and card-model inconsistencies indicate API/state contracts are not enforced centrally.

Impact:
- Feature regressions hide behind visual completeness.

## 2) Semantic/action affordance mismatch
Symptoms:
- Visually prominent controls are hard to address as stable interactive targets.
- Some pages expose minimal semantic action structure despite rich visual composition.

Impact:
- Automation and accessibility suffer; real users get ambiguous click paths.

## 3) Prototype debt accumulation
Symptoms:
- High lint/type debt
- Mixed package-manager artifacts
- Mock-first state without hardened boundaries

Impact:
- Team velocity appears high short-term, but reliability and maintenance cost scale poorly.

## Fix plan (priority-ordered)

## Phase 0 — Stabilize foundation (1-2 days)
1. Standardize package manager (keep `pnpm`, remove `package-lock.json`).
2. Fix hard type errors (`CardNode.vue` TS2769 and related path).
3. Enforce CI gate:
   - `typecheck` must pass
   - lint errors must be reduced to 0 in touched files

Deliverable: green baseline pipeline for FE.

## Phase 1 — Lock domain contracts (2-4 days)
1. Define typed domain contracts for:
   - Project management entities
   - Schedule entities
   - Workspace card/edge entities
2. Remove model drift (`content` vs card schema fields).
3. Reconcile boot flow/store API (e.g., `fetchProjects` contract consistency).

Deliverable: one source of truth for UI-state contracts.

## Phase 2 — Make killer features executable (4-7 days)

### Project management
- Ensure project list item has explicit primary action button/link.
- Implement deterministic “Create Project” modal flow with validation + success state.

### Scheduling
- Expose one canonical “Create/Schedule Event” action.
- Add visible post-action state (new row/card or confirmation event item).

### Collaborative workspace
- Ensure card nodes are addressable and draggable via stable handlers.
- Implement explicit “Add Card” action and visual confirmation.

Deliverable: each killer feature supports at least one end-to-end successful user path.

## Phase 3 — UX hardening (3-5 days)
1. Improve contrast/readability for secondary text.
2. Normalize action hierarchy (primary, secondary, destructive).
3. Add robust empty/loading/error/success states across modules.
4. Reduce cognitive crowding on dense dashboard cards.

Deliverable: UX consistency pass aligned to enterprise + individual usage contexts.

## Phase 4 — Test architecture and quality gates (2-4 days)
1. Add deterministic E2E scenarios:
   - Create project
   - Schedule event
   - Add/drag workspace card
2. Add stress smoke (`n` route transitions + core action retries).
3. Track pass/fail via machine-readable reports in CI artifacts.

Deliverable: repeatable confidence layer for frontend changes.

## Minimum acceptance criteria before calling FE “ready shell”
1. 100% pass on 3 killer feature happy-path E2E tests.
2. Typecheck passes with no blocking TS errors.
3. Lint errors reduced to near-zero in core feature files.
4. Explicit feedback state after every primary action.
5. Single source of truth contracts for project/schedule/workspace entities.

## Implementation stance
Do not rewrite wholesale. Refactor in thin vertical slices:
- one feature path at a time,
- contract first,
- interaction second,
- polish third,
- tests always.

This preserves visual momentum while converting shell fidelity into operational reliability.

System state recommendation: **Refactor-and-harden, not redesign.**
