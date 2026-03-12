# Employer Web

## Project Conventions
- Wizard forms should preserve previous entries and allow reverting on step navigation
- Ensure consistent typography and spacing across all pages — match existing page conventions
- All dates must use dd/mm/yyyy format
- All currency amounts must display two decimal places (e.g., $100.00 not $100)
- Use "Alumable Service Fee" — never "Platform fee"

## Fee Breakdown (Post a Gig)
- Student payment (incl. super) = budget entered
- Alumable Service Fee = 12% of budget
- Processing fee = 1.7% of budget
- GST = 10% of (Service Fee + Processing fee)
- Total Gig Cost = sum of all above

## Gig Lifecycle
- Gig stages: POSTED → MATCHED → ACTIVE → DONE → CLOSED. Payment is a sub-layer (payment_status: NONE/AUTHORISED/CAPTURED/FAILED/REFUNDED), not a stage
- Display gig stage as primary badge, payment_status as secondary badge — never show payment as a gig stage
