---
name: user-flow-mapping
description: Map user flows as Mermaid diagrams with happy paths, error states, and edge cases. Use when designing features, documenting user journeys, or analyzing task completion paths.
---

# User Flow Mapping

Generate comprehensive user flow diagrams from feature descriptions. Outputs Mermaid flowcharts with annotated happy paths, decision points, error states, and edge cases.

---

## Input Requirements

| Parameter | Type | Required | Description |
|---|---|---|---|
| `feature` | `string` | Yes | Natural language description of the feature or user task |
| `userRole` | `string` | No | Who the user is (e.g., "new user", "admin", "returning customer") |
| `entryPoints` | `string[]` | No | How users arrive (e.g., "homepage CTA", "email link", "deep link") |
| `constraints` | `string[]` | No | Business rules or technical constraints to incorporate |
| `existingFlows` | `string[]` | No | Related flows to connect to or avoid duplicating |

### Example Input

```json
{
  "feature": "User signs up for an account using email, verifies their email, and completes onboarding",
  "userRole": "new user",
  "entryPoints": ["homepage CTA", "pricing page", "invite link"],
  "constraints": [
    "Email must be verified before accessing paid features",
    "Onboarding can be skipped but shows on next login"
  ]
}
```

---

## Process

### Step 1: Identify Entry Points

Determine every way a user can begin this flow:
- Direct navigation (typed URL, bookmark)
- Internal link (from another page/feature)
- External link (email, notification, ad, shared link)
- Deep link (mobile, specific state)

For each entry point, note any context the user carries (e.g., invite code, referral source, pre-filled data).

### Step 2: Map the Happy Path

The primary success flow — the most common, shortest path to the desired outcome:

1. Identify the **goal state** (what "success" looks like)
2. Work backwards from goal to entry
3. List each step as a discrete user action or system response
4. Minimize steps — challenge every one ("is this step necessary?")

### Step 3: Identify Decision Points

At each step, ask:
- Does the user make a choice here? (→ diamond node)
- Does the system branch based on data? (→ diamond node)
- Can the user take an alternative action? (→ additional path)

Label every decision edge. No unlabeled arrows.

### Step 4: Map Error States

For each step, identify what can go wrong:

| Error Category | Examples |
|---|---|
| **Validation errors** | Invalid email, weak password, required field empty |
| **System errors** | Network failure, timeout, service unavailable |
| **Business logic errors** | Account already exists, trial expired, rate limited |
| **Permission errors** | Unauthorized, email not verified, account suspended |

For each error state, define:
1. What triggers it
2. What the user sees
3. How the user recovers (→ recovery path back into the flow)

### Step 5: Identify Edge Cases

Edge cases that affect the flow:
- User refreshes mid-flow — is state preserved?
- User navigates away and returns — where do they resume?
- User has multiple tabs open
- User is on a slow/intermittent connection
- User uses browser back/forward buttons
- Session expires during the flow
- User was invited (different entry data than organic signup)

Annotate these as notes on the relevant nodes.

### Step 6: Generate Mermaid Diagram

Assemble the complete flow using Mermaid syntax.

---

## Mermaid Diagram Standards

### Node Types

```
([Stadium])     → Entry and exit points
[Rectangle]     → User actions / System responses
{Diamond}       → Decision points
[[Subroutine]]  → Subprocess (link to another flow)
```

### Styling

```mermaid
flowchart TD
    classDef entry fill:#dbeafe,stroke:#2563eb,color:#1e3a5f
    classDef action fill:#f0fdf4,stroke:#16a34a,color:#14532d
    classDef decision fill:#fef9c3,stroke:#ca8a04,color:#713f12
    classDef error fill:#fee2e2,stroke:#dc2626,color:#991b1b
    classDef success fill:#d1fae5,stroke:#059669,color:#064e3b
    classDef subprocess fill:#f3e8ff,stroke:#7c3aed,color:#3b0764
```

### Complete Example

```mermaid
flowchart TD
    START([User clicks "Sign Up"]):::entry
    START --> FORM[Display signup form<br/>Email, Password, Name]:::action

    FORM --> SUBMIT[User submits form]:::action
    SUBMIT --> VALIDATE{Valid input?}:::decision

    VALIDATE -->|No| SHOW_ERRORS[Show validation errors<br/>Highlight invalid fields]:::error
    SHOW_ERRORS --> FORM

    VALIDATE -->|Yes| CHECK_EXISTS{Account exists?}:::decision
    CHECK_EXISTS -->|Yes| EXISTS_ERROR[Show 'account exists' message<br/>Offer login link]:::error
    EXISTS_ERROR --> LOGIN_REDIRECT([Redirect to login]):::entry

    CHECK_EXISTS -->|No| CREATE[Create account<br/>Send verification email]:::action
    CREATE --> VERIFY_SCREEN[Show 'check your email' screen]:::action

    VERIFY_SCREEN --> WAIT{User clicks<br/>email link?}:::decision
    WAIT -->|Yes| VERIFIED[Mark email verified]:::action
    WAIT -->|No, resend| RESEND[Resend verification email]:::action
    RESEND --> VERIFY_SCREEN
    WAIT -->|No, timeout| TIMEOUT[Show resend option<br/>after 60 seconds]:::error
    TIMEOUT --> VERIFY_SCREEN

    VERIFIED --> ONBOARD[Display onboarding flow]:::action
    ONBOARD --> SKIP{Skip onboarding?}:::decision
    SKIP -->|No| COMPLETE_ONBOARD[Complete onboarding steps]:::action
    SKIP -->|Yes| SKIP_FLAG[Set 'show onboarding next login' flag]:::action

    COMPLETE_ONBOARD --> DASHBOARD([Dashboard — success]):::success
    SKIP_FLAG --> DASHBOARD

    %% Edge case annotations
    VERIFY_SCREEN -.- NOTE1>Edge: User refreshes page<br/>→ Show same screen, check verification status]
    ONBOARD -.- NOTE2>Edge: User navigates away<br/>→ Resume on next login]
```

---

## Output Format

### JSON Output

```json
{
  "flow": {
    "name": "User Signup and Onboarding",
    "feature": "...",
    "userRole": "new user",
    "entryPoints": ["homepage CTA", "pricing page", "invite link"],
    "steps": [
      {
        "id": "FORM",
        "type": "action",
        "description": "Display signup form",
        "nextSteps": ["SUBMIT"]
      }
    ],
    "decisionPoints": [
      {
        "id": "VALIDATE",
        "question": "Is input valid?",
        "branches": {
          "yes": "CHECK_EXISTS",
          "no": "SHOW_ERRORS"
        }
      }
    ],
    "errorStates": [
      {
        "id": "EXISTS_ERROR",
        "trigger": "Email already registered",
        "recovery": "LOGIN_REDIRECT"
      }
    ],
    "edgeCases": [
      "User refreshes during email verification → show same screen, poll verification status",
      "User navigates away from onboarding → flag for next login",
      "Invite link with pre-filled email → skip email field, mark as invited"
    ]
  },
  "mermaid": "flowchart TD\n    ..."
}
```

### Markdown Output

```markdown
# User Flow: <Feature Name>

## Overview
One-paragraph description of the flow.

## Entry Points
- **Homepage CTA**: User clicks "Sign Up" button
- **Pricing page**: User selects a plan and clicks "Start free trial"
- **Invite link**: User clicks invite link from email

## Flow Diagram

\`\`\`mermaid
<complete mermaid diagram>
\`\`\`

## Decision Points

| Decision | Yes Path | No Path |
|---|---|---|
| Valid input? | Check if account exists | Show validation errors |
| Account exists? | Show error, offer login | Create account |
| Skip onboarding? | Flag for next login | Complete onboarding |

## Error States

| Error | Trigger | User Sees | Recovery |
|---|---|---|---|
| Validation failure | Invalid email/password | Inline error messages | Fix and resubmit |
| Account exists | Email already registered | Error + login link | Click to log in |
| Verification timeout | No click within 5 min | Resend option | Click resend |

## Edge Cases

1. **Page refresh during verification** — Show same screen, poll verification status via API
2. **Multi-tab signup** — Use session token to prevent duplicate accounts
3. **Slow connection** — Show loading states, retry on timeout
4. **Browser back button** — Preserve form data, don't re-submit

## Metrics to Track
- Signup form → submission rate
- Submission → verification rate
- Verification → onboarding completion rate
- Drop-off points per step
```

---

## Quality Checks

Before returning output, verify:

- [ ] Every arrow has a label
- [ ] Every error state has a recovery path
- [ ] No dead ends (every node leads somewhere or is a terminal)
- [ ] Entry and exit points use stadium shape `([...])`
- [ ] Decision points use diamond shape `{...}`
- [ ] Error nodes use the `:::error` class
- [ ] Success exits use the `:::success` class
- [ ] Edge cases are annotated with note syntax
- [ ] Mermaid syntax is valid (parseable by Mermaid.js)
- [ ] Flow is understandable without reading the prose

---

Author: Charley Scholz, JLAI
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-23
