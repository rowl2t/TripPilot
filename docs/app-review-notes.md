# App Review Notes (Draft)

## Test account
- Email: reviewer+ios@trippilot.example
- Password: TripPilotReview!2026
- Role: standard user

## Subscription test
- Sandbox subscription products are configured via RevenueCat.
- Use in-app paywall test flow; no external card charge in sandbox.

## AI feature explanation
- AI creates itinerary drafts and booking checklists from user inputs.
- Outputs are schema-validated before rendering.

## External booking links
- TripPilot does not directly process travel bookings in-app.
- Users are redirected to external partner pages.
- Price/availability can change after redirect.

## SNS link analysis policy
- We analyze only publicly accessible metadata or user-provided content.
- No login bypass, DRM bypass, or unauthorized scraping.

## Privacy handling
- Data is scoped to user account and trip collaboration access.
- Deletion/export requests are supported through in-app support flow.
