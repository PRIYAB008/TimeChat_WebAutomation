# Specs

This is a directory for test plans.

## Workflow (Cucumber is the source of truth)
1. Planner writes plans here as Markdown (`specs/*.md`).
2. Plans are converted to Cucumber `.feature` files in `src/test/resources/features/`
   with steps in `src/test/js/step_definitions/` and page objects in `src/main/js/pages/`.
3. Healer is used on failures, then the fix is applied to the page objects / steps.
Generator-produced `*.spec.js` files are not part of the regression suite.
