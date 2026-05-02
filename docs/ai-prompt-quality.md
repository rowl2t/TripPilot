# AI Prompt Quality Improvements

## Version
- Planner prompt version updated to `v2.0.0`.

## System prompt upgrades
- Beginner-friendly practical planner persona.
- Enforces transit/rest/meal/check-in/check-out realism.
- Avoids overpacked timelines.
- Explicit budget and reservation awareness.

## Structured output upgrades
- Itinerary now carries:
  - daily schedule items
  - place options with pros/cons and confidence
  - daily budget estimate
  - reservation requirement, caution, alternatives, cost, confidence per item

## Critique/repair loop
- Added critique prompt requirements for:
  - density
  - routing efficiency
  - budget overflow
  - meal omissions
  - required booking omissions
  - saved link reflection
- Added repair prompt preserving user preferences and locked selections.

## Evaluation coverage
- Added 5 mock trip inputs:
  - Japan 3N4D
  - Jeju 2N3D
  - Europe 10D
  - Family travel
  - Budget travel
- Test validates schema compatibility and output generation.
