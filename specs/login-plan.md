# TimeChat Login Flow Test Plan

## Application Overview

Login flow of the TimeChat Flutter web app (BASE_URL from .env.example). Two-step phone + OTP login. Behavior below was observed live on the dev environment on 2026-10-16 starting from a cleared (unauthenticated) browser. Test creds: TEST_PHONE=1234567890, TEST_OTP=123456. Notes: Flutter semantics tree; locators are role/name based (textbox "Phone number 98765 43210", button "Continue", textbox "Verification code", buttons "Verify Code", "Resend", "Change number"). Already covered elsewhere (not repeated): Continue disabled when empty; phone+OTP lands on Chats home. Wrong-OTP attempts must stay minimal (max 2 per run) to avoid possible lockout (lockout behavior UNCONFIRMED). Console shows 2-3 errors on load (content not analysed, UNCONFIRMED relevance).

## Test Scenarios

### 1. Phone number entry

**Seed:** `src/test/js/agents/seed.spec.js`

#### 1.1. Initial login screen layout

**File:** `tests/login/initial-screen.spec.js`

**Steps:**
  1. Open BASE_URL in a fresh context (no storage). Do NOT use seed login; login scenarios start from fresh unauthenticated state.
    - expect: Heading 'Enter Phone Number' and subtext 'We'll send you a verification code' are visible
    - expect: Flag and '+91' prefix visible; phone textbox placeholder '98765 43210'
    - expect: Continue button is disabled
    - expect: Footer text 'By continuing, you agree to our Terms of Service and Privacy Policy' visible

#### 1.2. Phone field rejects non-numeric characters

**File:** `tests/login/phone-non-numeric.spec.js`

**Steps:**
  1. Type 'abc123' into phone field
    - expect: Field value is '123' (letters stripped)
    - expect: Continue stays disabled
  2. Clear and type '12ab34'
    - expect: Value '1234'; Continue disabled
  3. Clear and type '!@#$%'
    - expect: Value is empty; Continue disabled

#### 1.3. Phone field strips spaces

**File:** `tests/login/phone-spaces.spec.js`

**Steps:**
  1. Type '98765 43210'
    - expect: Value becomes '9876543210' (space removed); Continue enabled
  2. Type '12 34 56'
    - expect: Value '123456'; Continue disabled (only 6 digits)

#### 1.4. Continue enable boundary: fewer than 10 digits

**File:** `tests/login/phone-too-short.spec.js`

**Steps:**
  1. Type '123', then '12345', then '123456789' (clearing between)
    - expect: Continue disabled each time, no error message shown (no inline validation text observed)
  2. Type '1234567890'
    - expect: Continue becomes enabled at exactly 10 digits

#### 1.5. Phone field caps input at 10 digits

**File:** `tests/login/phone-too-long.spec.js`

**Steps:**
  1. Type '12345678901' then '123456789012345'
    - expect: Value is truncated to '1234567890'; Continue enabled

#### 1.6. Phone entered with +91 prefix typed in

**File:** `tests/login/phone-plus-prefix.spec.js`

**Steps:**
  1. Type '+91 1234567890' into the field
    - expect: Observed value '9112345678' ('+' and space stripped, truncated to 10 digits); Continue enabled. Documents that pasted/typed country codes are NOT recognised and corrupt the number

#### 1.7. Country code picker is not interactive (UNCONFIRMED)

**File:** `tests/login/country-picker.spec.js`

**Steps:**
  1. Click the flag and the '+91' prefix (semantic click and real mouse click at prefix coordinates)
    - expect: Observed: no picker/dialog/list opened and no semantics change; prefix appears fixed at +91. UNCONFIRMED: may require different gesture; verify with devs whether a picker is intended

#### 1.8. Enter key submits valid phone

**File:** `tests/login/phone-enter-key.spec.js`

**Steps:**
  1. Fill '1234567890' and press Enter
    - expect: App advances to OTP screen without clicking Continue
  2. With empty/short phone press Enter
    - expect: UNCONFIRMED: not tested; expected no navigation

### 2. OTP verification

**Seed:** `src/test/js/agents/seed.spec.js`

#### 2.1. OTP screen content after valid phone

**File:** `tests/login/otp-screen.spec.js`

**Steps:**
  1. Enter 1234567890 and click Continue
    - expect: Text 'Enter the 6-digit code sent to' and '+911234567890' shown
    - expect: Textbox 'Verification code' with six digit boxes (OTP digit 1-6)
    - expect: Buttons 'Verify Code', 'Resend' (disabled), 'Change number'; text 'Didn't receive code?'

#### 2.2. OTP field rejects non-numeric input

**File:** `tests/login/otp-non-numeric.spec.js`

**Steps:**
  1. On OTP screen type 'abc'
    - expect: Field remains empty
  2. Clear and type '12a45'
    - expect: Value '1245' (letter stripped); no auto-submit

#### 2.3. Fewer than 6 digits shows validation message

**File:** `tests/login/otp-short.spec.js`

**Steps:**
  1. Type '123' then click Verify Code (Verify Code appears always enabled)
    - expect: Inline message 'Enter the complete 6-digit code' appears; stays on OTP screen
  2. Type '12' then press Enter
    - expect: Observed: no navigation, no message seen after 1.2s (message on Enter UNCONFIRMED)

#### 2.4. OTP auto-submits at 6 digits and rejects extra digits

**File:** `tests/login/otp-autosubmit.spec.js`

**Steps:**
  1. Type '123456' (TEST_OTP) without pressing Verify
    - expect: App auto-submits and loads Chats home (Messages, Chats, Groups, Todos, Profile tabs, chat list)
  2. (Separate run) Type '1234567' (7 digits)
    - expect: Observed: first 6 digits '123456' auto-submitted and logged in; 7th digit not captured

#### 2.5. Wrong OTP shows error (max 1-2 attempts)

**File:** `tests/login/otp-wrong.spec.js`

**Steps:**
  1. Enter valid phone, then type '000000' on OTP screen
    - expect: Error text 'Incorrect code.' appears within ~300ms; user remains on OTP screen
  2. Check OTP field state after error
    - expect: UNCONFIRMED whether digits are cleared or can be edited; UNCONFIRMED whether repeated wrong attempts lock the account (not tested to avoid lockout)
  3. Enter valid OTP 123456 afterward
    - expect: UNCONFIRMED recovery login succeeds; verify

#### 2.6. Resend button timer

**File:** `tests/login/otp-resend-timer.spec.js`

**Steps:**
  1. Arrive on OTP screen and poll Resend state every 5s
    - expect: Resend disabled for first ~50s; enabled by ~50-55s (observed enabled at 55s; exact duration, likely 60s countdown, UNCONFIRMED; no visible countdown text found in semantics)
  2. Click Resend once enabled
    - expect: Stays on OTP screen and Resend becomes disabled again; no visible confirmation toast captured (UNCONFIRMED)

#### 2.7. Change number returns to phone entry

**File:** `tests/login/change-number.spec.js`

**Steps:**
  1. On OTP screen click 'Change number'
    - expect: Phone entry screen shown; phone field empty (previous number not preserved); Continue disabled
  2. Enter a different 10-digit number
    - expect: UNCONFIRMED: OTP screen shows new number. Use only a safe test number

#### 2.8. Browser reload on OTP step loses progress

**File:** `tests/login/reload-otp-step.spec.js`

**Steps:**
  1. Reach OTP screen, reload page
    - expect: App returns to 'Enter Phone Number' screen (OTP step not persisted); phone field empty

### 3. Session persistence and logout

**Seed:** `src/test/js/agents/seed.spec.js`

#### 3.1. Session persists after reload

**File:** `tests/login/reload-persistence.spec.js`

**Steps:**
  1. Log in with 1234567890 / 123456, then reload BASE_URL and wait ~5-8s for Flutter to boot
    - expect: User remains logged in on Chats home (no login screen); initial load briefly shows only the timechat logo

#### 3.2. Logout with confirmation dialog

**File:** `tests/login/logout.spec.js`

**Steps:**
  1. Log in, open Profile, click 'Log out' (under DANGER ZONE)
    - expect: Dialog 'Log out?' with Cancel and Log out buttons
  2. Click Cancel
    - expect: Dialog closes; remains on Profile (shows phone +911234567890, Version v2.9.1)
  3. Click Log out then confirm 'Log out'
    - expect: Returns to 'Enter Phone Number' screen with empty field and Continue disabled
  4. Reload after logout
    - expect: UNCONFIRMED: login screen remains (session cleared)

#### 3.3. Re-login after logout

**File:** `tests/login/relogin.spec.js`

**Steps:**
  1. After logout, enter 1234567890, continue, enter 123456
    - expect: Chats home loads again

### 4. Unconfirmed / not explored

**Seed:** `src/test/js/agents/seed.spec.js`

#### 4.1. Unregistered number flow (UNCONFIRMED)

**File:** `tests/login/unregistered-number.spec.js`

**Steps:**
  1. Enter a number other than the test number
    - expect: UNCONFIRMED behavior (may create account or send real SMS); not tested to avoid side effects. Clarify with team before automating

#### 4.2. Lockout after repeated wrong OTP (UNCONFIRMED)

**File:** `tests/login/otp-lockout.spec.js`

**Steps:**
  1. Not executed
    - expect: UNCONFIRMED whether rate limiting exists; needs approval from dev team and a disposable account

#### 4.3. Terms of Service / Privacy Policy links (UNCONFIRMED)

**File:** `tests/login/legal-links.spec.js`

**Steps:**
  1. Click Terms of Service and Privacy Policy on login screen
    - expect: UNCONFIRMED target (new tab/in-app); not explored
