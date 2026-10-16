Feature: Login

  Background:
    Given I open the TimeChat app

  @smoke
  Scenario: Continue is disabled until a phone number is entered
    Then Continue should be disabled

  @smoke
  Scenario: Login with phone number and OTP
    When I enter the test phone number
    Then Continue should be enabled
    When I tap Continue
    Then I should see the verification code field
    When I enter the test OTP
    Then I should land on the Chats home screen

  # ---------------------------------------------------------------- Phone entry

  @regression
  Scenario: Initial login screen layout
    Then I should see the text "Enter Phone Number"
    And I should see the text "We'll send you a verification code"
    And I should see the text "Terms of Service"
    And I should see the text "Privacy Policy"
    And Continue should be disabled

  @regression
  Scenario Outline: Phone field strips non-numeric characters and Continue stays disabled
    When I type "<typed>" into the phone field
    Then the phone field should contain "<value>"
    And Continue should be disabled

    Examples:
      | typed    | value  |
      | abc123   | 123    |
      | 12ab34   | 1234   |
      | !@#$%    |        |
      | 12 34 56 | 123456 |

  @regression
  Scenario: Phone field strips spaces
    When I type "98765 43210" into the phone field
    Then the phone field should contain "9876543210"
    And Continue should be enabled

  @regression
  Scenario Outline: Continue stays disabled for fewer than 10 digits
    When I type "<typed>" into the phone field
    Then Continue should be disabled

    Examples:
      | typed     |
      | 123       |
      | 12345     |
      | 123456789 |

  @regression
  Scenario: Continue is enabled at exactly 10 digits
    When I type "1234567890" into the phone field
    Then Continue should be enabled

  @regression
  Scenario Outline: Phone field caps input at 10 digits
    When I type "<typed>" into the phone field
    Then the phone field should contain "1234567890"
    And Continue should be enabled

    Examples:
      | typed           |
      | 12345678901     |
      | 123456789012345 |

  # Documents current behavior: a typed country code is not recognised and corrupts the number.
  @regression @known-behavior
  Scenario: Typing a +91 prefix corrupts the phone number
    When I type "+91 1234567890" into the phone field
    Then the phone field should contain "9112345678"
    And Continue should be enabled

  @regression
  Scenario: Enter key submits a valid phone number
    When I type "1234567890" into the phone field
    And I press Enter in the phone field
    Then I should see the verification code field

  # ------------------------------------------------------------ OTP verification

  @regression
  Scenario: OTP screen shows the entered number and actions
    When I enter the test phone number
    And I tap Continue
    Then I should see the text "Enter the 6-digit code sent to"
    And I should see the text "+911234567890"
    And I should see the verification code field
    And the Verify Code button should be visible
    And the Change number button should be visible
    And Resend should be disabled

  @regression
  Scenario Outline: OTP field strips non-numeric characters
    When I enter the test phone number
    And I tap Continue
    And I type "<typed>" into the verification code field
    Then the verification code field should contain "<value>"
    And I should see the verification code field

    Examples:
      | typed | value |
      | abc   |       |
      | 12a45 | 1245  |

  @regression
  Scenario: Fewer than 6 digits shows a validation message
    When I enter the test phone number
    And I tap Continue
    And I type "123" into the verification code field
    And I tap Verify Code
    Then I should see the text "Enter the complete 6-digit code"
    And I should see the verification code field

  @regression @known-behavior
  Scenario: Only the first 6 digits of a longer OTP are used
    When I enter the test phone number
    And I tap Continue
    And I type "1234567" into the verification code field
    Then I should land on the Chats home screen

  # Keep wrong-OTP attempts to one per run: lockout behavior is unconfirmed.
  @regression @wrong-otp
  Scenario: Wrong OTP shows an error and stays on the OTP screen
    When I enter the test phone number
    And I tap Continue
    And I type "000000" into the verification code field
    Then I should see the text "Incorrect code."
    And I should see the verification code field

  @regression
  Scenario: Change number returns to an empty phone entry screen
    When I enter the test phone number
    And I tap Continue
    And I tap Change number
    Then I should see the phone entry screen
    And the phone field should contain ""
    And Continue should be disabled

  @regression
  Scenario: Reloading on the OTP step returns to phone entry
    When I enter the test phone number
    And I tap Continue
    And I reload the app
    Then I should see the phone entry screen
    And the phone field should contain ""

  # Resend is disabled for roughly 50-60 seconds; exact duration is unconfirmed.
  @regression @slow
  Scenario: Resend becomes enabled after the countdown
    When I enter the test phone number
    And I tap Continue
    Then Resend should be disabled
    And Resend should become enabled within 70 seconds
    When I tap Resend
    Then Resend should be disabled
    And I should see the verification code field

  # ----------------------------------------------------- Session and logout

  @regression
  Scenario: Session persists after reloading the app
    When I log in with the test credentials
    And I reload the app
    Then I should land on the Chats home screen

  @regression
  Scenario: Cancelling logout keeps the user on the Profile screen
    When I log in with the test credentials
    And I open the Profile tab
    And I tap Log out
    Then I should see the text "Log out?"
    When I cancel the logout
    Then I should see the text "+911234567890"

  @regression
  Scenario: Logging out returns to phone entry and can log in again
    When I log in with the test credentials
    And I open the Profile tab
    And I tap Log out
    And I confirm the logout
    Then I should see the phone entry screen
    And the phone field should contain ""
    And Continue should be disabled
    When I log in with the test credentials
    Then I should land on the Chats home screen

  # ----------------------------------------------- Unconfirmed (see specs/login-plan.md §4)

  @ignore
  Scenario: Unregistered number flow
    # UNCONFIRMED: may create an account or send a real SMS. Clarify with the team first.
    When I type "9999999999" into the phone field
    Then Continue should be enabled

  @ignore
  Scenario: Terms of Service and Privacy Policy links open
    # UNCONFIRMED: link target (new tab vs in-app) not explored.
    Then I should see the text "Terms of Service"
