# TimeChat One-on-One Chat Test Plan

## Application Overview

One-on-one chat in the TimeChat Flutter web app (BASE_URL from .env.example). UI below was observed live on the dev environment on 2026-10-19, logged in as TEST_PHONE=1234567890 / TEST_OTP=123456. Nothing was sent during exploration. Locators are role/name based (Flutter semantics tree); allow about 8s for the first load.

Observed UI:
- **Chats home:** heading "Messages"; buttons "New chat", "Chats", "Groups", "Todos", "Profile"; textbox "Search People, Messages, Groups..."; banner "Turn on desktop notifications" with buttons "Turn on" and "Dismiss"; the chat list is a group of buttons named by contact (e.g. "Ajitha", "Kavin").
- **New Chat dialog:** heading "New Chat"; button "Close"; textbox "Search by name or username"; rows are buttons such as "AJ Ajitha @aji" and "CR CreatorPeer @creatorpeer_<hash>". There are many duplicate "CreatorPeer" names, so select by @username.
- **Conversation:** heading "View <name> details <initials> <name>"; buttons "Search in conversation" and "Chat options"; textbox "Message input Message…"; button "Emoji"; button "Send message" (disabled while the composer is empty). A cleared chat shows "You cleared this chat. Other participants still have their copies. New messages will appear here."
- **Chat options menu:** menuitems "Pin chat" and "Clear chat" only.
- **Message actions (observed 2026-10-19, read-only):** right-clicking a message shows buttons "Reply", "Forward", "Copy", "Edit", "Create Todo", "Delete", "Select", plus a reaction bar "React 👍", "React ❤️", "React 😂", "React 😮", "React 😢", "React 🙏" and a "more" button. Hovering a message shows "Message options" and "Add reaction".
- **Forward dialog:** title "Forward to"; preview card of the message; textbox "Search chats"; rows for people (name + @username) and groups (name + members); a selected row shows a blue check; counter "N of 3 selected"; a round send button. Selecting a 4th chat shows the toast "You can forward to up to 3 chats".
- **Forwarded label:** a forwarded message is shown in the recipient chat as `Forwarded from <original sender> <original date/time>` above the text (e.g. `Forwarded from Magic 16/10/26 2:14 am Hi`).

Test-data rules:
- Message text is unique per run (e.g. `auto-<timestamp>`) because dev data is shared and persistent.
- Sending scenarios use a dedicated user 2 (TEST_PHONE_2 / TEST_OTP_2), never the real contacts in the list.
- Destructive scenarios (Clear chat) run only against the dedicated user 2 chat.
- `@two-user` scenarios need a second browser context logged in as user 2.

Prerequisites before automating (not part of this plan):
- Add `TEST_PHONE_2` / `TEST_OTP_2` to `.env.example` and `src/test/js/support/config.js`.
- Expose the browser on the World (`this.browser`) in `hooks.js` so a second `newContext()` can be created.
- Add a `ChatPage` page object and a `NewChatDialog` section (in `HomePage` or its own class).

Not yet explored (all UNCONFIRMED): attachments, reply/delete/forward on a message, read receipts and delivery ticks, typing indicator, header details panel, message length limit, timestamps and date separators.

## Test Scenarios

### 1. Chat list (Chats tab)

**Seed:** `src/test/js/agents/seed.spec.js`

#### 1.1. Chat list shows existing conversations `@smoke`

**Steps:**
  1. Log in with the test credentials
    - expect: Chats home is visible with "Messages", "Chats", "Groups" and the search box
    - expect: The list contains contact buttons (e.g. "Ajitha")

#### 1.2. Search filters the chat list `@regression`

**Steps:**
  1. Type an existing contact name into "Search People, Messages, Groups..."
    - expect: Matching contact is shown
  2. Clear the search, then type a string that matches nothing (e.g. `zzzz-no-match`)
    - expect: No chat rows are shown; empty-state text UNCONFIRMED
    - expect: Clearing the box restores the full list

#### 1.3. Search matches message text `@regression`

**Steps:**
  1. Type the text of a known sent message into the search box
    - expect: The chat containing the message is listed (UNCONFIRMED how the match is displayed)

#### 1.4. Dismiss hides the notification banner `@regression`

**Steps:**
  1. On Chats home, click "Dismiss" on "Turn on desktop notifications"
    - expect: The banner and its "Turn on" button are gone
    - expect: Do NOT click "Turn on" (opens a browser permission prompt)

### 2. Start a new chat

#### 2.1. New Chat dialog layout and close `@smoke`

**Steps:**
  1. Click "New chat"
    - expect: Dialog with heading "New Chat", "Close" button and textbox "Search by name or username" is visible
    - expect: A list of people rows (name and @username) is shown
  2. Click "Close"
    - expect: Dialog closes and Chats home is visible again

#### 2.2. Search people by name and by username `@regression`

**Steps:**
  1. Open New Chat and type `Ajitha`
    - expect: Row "AJ Ajitha @aji" is shown
  2. Clear and type `aji`
    - expect: Same row is shown (matched by username)

#### 2.3. No matching people `@regression`

**Steps:**
  1. Open New Chat and type `zzzz-no-match`
    - expect: No person rows; empty-state text UNCONFIRMED

#### 2.4. Selecting a person opens the conversation `@smoke`

**Steps:**
  1. Open New Chat, search for user 2 by @username, click the row
    - expect: Dialog closes and the conversation opens
    - expect: Header heading shows user 2's name
    - expect: Composer "Message input" is visible and "Send message" is disabled

#### 2.5. Selecting an existing contact reuses the thread `@regression`

**Steps:**
  1. Open New Chat and select a person who already has a chat in the list
    - expect: The existing conversation (with its history) opens
    - expect: The chat list still has exactly one row for that person

#### 2.6. Starting a chat with yourself `@known-behavior`

**Steps:**
  1. Open New Chat and search for the logged-in user's own name or username
    - expect: UNCONFIRMED: either not listed or blocked; record the actual behavior

### 3. Conversation screen

#### 3.1. Conversation layout `@smoke`

**Steps:**
  1. Open a chat from the list (e.g. "Ajitha")
    - expect: Heading "View Ajitha details AJ Ajitha"
    - expect: Buttons "Search in conversation" and "Chat options"
    - expect: Textbox "Message input" with placeholder "Message…", button "Emoji"
    - expect: "Send message" is disabled

#### 3.2. Send is disabled for empty or whitespace-only input `@regression`

**Steps:**
  1. Open a chat and click into the composer
    - expect: "Send message" disabled
  2. Type three spaces
    - expect: "Send message" still disabled (UNCONFIRMED)
  3. Type `hello`
    - expect: "Send message" enabled
  4. Delete the text
    - expect: "Send message" disabled again

#### 3.3. Header opens the details view `@regression`

**Steps:**
  1. Click the header "View <name> details"
    - expect: Details view opens (content UNCONFIRMED, explore before automating)

#### 3.4. Returning to the list keeps it intact `@regression`

**Steps:**
  1. Open a chat, then click "Chats"
    - expect: Chat list is shown with all rows

#### 3.5. Reloading keeps the session and conversation list `@regression`

**Steps:**
  1. Open a chat and reload the app; wait for boot
    - expect: User remains logged in (see login "Session persists after reloading")
    - expect: Whether the open chat is restored is UNCONFIRMED

### 4. Sending messages (single user)

Chat partner is user 2. Message text is unique per run.

#### 4.1. Send a text message with the Send button `@smoke`

**Steps:**
  1. Open the chat with user 2 and type `auto-<timestamp>`
    - expect: "Send message" is enabled
  2. Click "Send message"
    - expect: The message appears in the conversation
    - expect: Composer is empty and "Send message" is disabled

#### 4.2. Enter key sends the message `@regression`

**Steps:**
  1. Type `auto-enter-<timestamp>` and press Enter
    - expect: Message appears; composer is cleared

#### 4.3. Chat moves to the top with a preview `@regression`

**Steps:**
  1. Send a message in a chat that is not at the top of the list, then go back to the list
    - expect: That chat is the first row
    - expect: Preview shows the message text (UNCONFIRMED)

#### 4.4. Multiple messages keep order `@regression`

**Steps:**
  1. Send `auto-1-<ts>`, `auto-2-<ts>`, `auto-3-<ts>` in turn
    - expect: They appear in the same order, oldest first

#### 4.5. Long message `@regression`

**Steps:**
  1. Send a 1000-character message
    - expect: Message is sent and wraps; the composer stays usable
    - expect: A length limit, if any, is UNCONFIRMED

#### 4.6. Special characters render literally `@regression`

**Steps:**
  1. Send `<b>bold</b> & "quotes" 'single' é ü 日本語 😀`
    - expect: Text appears exactly as typed with no markup interpretation
  2. Send `<script>alert(1)</script>`
    - expect: Appears as plain text; no dialog is triggered

#### 4.7. Emoji picker inserts an emoji `@regression`

**Steps:**
  1. Click "Emoji" and choose an emoji
    - expect: Emoji is added to the composer and "Send message" is enabled (picker contents UNCONFIRMED)

#### 4.8. Sent message persists after reload `@regression`

**Steps:**
  1. Send `auto-persist-<ts>`, reload the app, open the same chat
    - expect: Message is still shown

#### 4.9. Rapid double-click on Send sends once `@regression`

**Steps:**
  1. Type text and double-click "Send message"
    - expect: Exactly one copy of the message appears

### 5. Two-user flow `@two-user`

User A is TEST_PHONE; user B is TEST_PHONE_2 in a second browser context.

#### 5.1. Recipient sees the message in an open chat `@smoke`

**Steps:**
  1. User B opens the chat with user A; user A opens the chat with user B
  2. User A sends `auto-a2b-<ts>`
    - expect: User B sees the message within a few seconds, without reloading

#### 5.2. Recipient's list reflects a new message `@regression`

**Steps:**
  1. User B stays on Chats home; user A sends `auto-list-<ts>`
    - expect: User B's list shows the chat at the top (preview/unread indicator UNCONFIRMED)

#### 5.3. Reply round trip `@regression`

**Steps:**
  1. A sends `auto-ping-<ts>`; B sees it and replies `auto-pong-<ts>`
    - expect: A sees the reply; both screens show the same order

#### 5.4. History matches on both sides after reload `@regression`

**Steps:**
  1. Reload both contexts and open the chat
    - expect: Both show the same messages in the same order

### 6. In-conversation search

#### 6.1. Search finds a message `@regression`

**Steps:**
  1. In a chat with a known message, click "Search in conversation" and type a word from it
    - expect: The message is found/highlighted (UNCONFIRMED UI)

#### 6.2. No match and close `@regression`

**Steps:**
  1. Search for `zzzz-no-match`
    - expect: No results shown
  2. Close the search
    - expect: The conversation returns to normal

### 7. Chat options

#### 7.1. Options menu contents `@smoke`

**Steps:**
  1. Click "Chat options"
    - expect: menuitems "Pin chat" and "Clear chat" are shown

#### 7.2. Pin chat `@regression`

**Steps:**
  1. Click "Chat options" > "Pin chat" in the user 2 chat
    - expect: The chat is pinned to the top of the list (UNCONFIRMED)
    - expect: The menu now offers an unpin action (UNCONFIRMED label)
  2. Unpin to restore state
    - expect: Pin is removed

#### 7.3. Clear chat `@regression` `@two-user`

**Steps:**
  1. User A sends `auto-clear-<ts>`, then chooses "Chat options" > "Clear chat" (confirm if a dialog appears; UNCONFIRMED)
    - expect: A sees "You cleared this chat. Other participants still have their copies. New messages will appear here."
  2. User B opens the chat
    - expect: B still sees the full history including `auto-clear-<ts>`
  3. B replies
    - expect: A sees only the new message

### 8. Negative and edge cases

#### 8.1. Sending while offline `@regression`

**Steps:**
  1. Open a chat, go offline, send a message
    - expect: UNCONFIRMED: failed/pending state; record the actual behavior
  2. Go back online
    - expect: UNCONFIRMED: whether it retries automatically

#### 8.2. Chat requires login `@regression`

**Steps:**
  1. In a fresh context, open BASE_URL without logging in
    - expect: Phone entry screen is shown; no chat list is visible

### 9. Message actions menu

Groups 9-14 use user A (TEST_PHONE) and user B (TEST_PHONE_2) in two browser contexts. Use unique text `auto-<feature>-<timestamp>` and delete created messages when done. Forward only to dedicated test users or groups, never to real contacts on dev. Edit, delete and multi-select UI details not yet observed are UNCONFIRMED.

#### 9.1. Actions menu on own message `@smoke`

**Steps:**
  1. A sends `auto-menu-<ts>` and right-clicks it
    - expect: Buttons "Reply", "Forward", "Copy", "Edit", "Create Todo", "Delete", "Select" are visible
    - expect: Reaction bar shows 👍 ❤️ 😂 😮 😢 🙏 and a "more" button
  2. Press Escape or click outside
    - expect: Menu closes and nothing changes

#### 9.2. Actions menu on the other user's message `@regression` `@two-user`

**Steps:**
  1. B right-clicks the message received from A
    - expect: "Reply", "Forward", "Copy", "Select" are present
    - expect: "Edit" and "Delete" are absent or disabled (UNCONFIRMED; record actual)

### 10. Edit message `@two-user`

#### 10.1. Edit own message `@smoke`

**Steps:**
  1. A sends `auto-edit-<ts>`; B has the chat open and sees it
  2. A right-clicks the message, clicks "Edit", changes the text to `auto-edit-<ts>-v2` and saves (Enter or the send button; UNCONFIRMED)
    - expect: A sees the new text and an "Edited" marker (UNCONFIRMED)
    - expect: B sees `auto-edit-<ts>-v2` without reloading, and the old text is gone
  3. Reload both contexts and open the chat
    - expect: Both still show the edited text

#### 10.2. Cancel edit keeps the original `@regression`

**Steps:**
  1. A starts editing a message, changes the text, then cancels (Escape or cancel control; UNCONFIRMED)
    - expect: Original text remains on A and B

#### 10.3. Empty edit is rejected `@regression`

**Steps:**
  1. A edits a message and clears the text
    - expect: Save is disabled or the edit is rejected; message text is unchanged on A and B (UNCONFIRMED)

#### 10.4. Edit updates chat-list preview `@regression`

**Steps:**
  1. A edits the latest message in the chat
    - expect: The chat-list preview on A and B shows the edited text (UNCONFIRMED)

### 11. Delete message `@two-user`

#### 11.1. Delete own message `@smoke`

**Steps:**
  1. A sends `auto-del-<ts>`; B sees it
  2. A right-clicks it, clicks "Delete" and confirms if asked (UNCONFIRMED)
    - expect: The message is removed from A's conversation, or replaced by a "deleted" placeholder (UNCONFIRMED)
    - expect: B no longer sees `auto-del-<ts>` (or sees the placeholder) without reloading
  3. Reload both contexts
    - expect: The message stays deleted on both

#### 11.2. Cancel delete keeps the message `@regression`

**Steps:**
  1. A clicks "Delete" and cancels the confirmation (UNCONFIRMED)
    - expect: Message still shown on A and B

#### 11.3. Deleting one of several keeps the others in order `@regression`

**Steps:**
  1. A sends `auto-1-<ts>`, `auto-2-<ts>`, `auto-3-<ts>` and deletes the second
    - expect: A and B show the first and third in the original order

#### 11.4. Delete updates chat-list preview `@regression`

**Steps:**
  1. A deletes the latest message
    - expect: The chat-list preview on A and B shows the previous message or the placeholder (UNCONFIRMED)

### 12. Multi-select `@two-user`

#### 12.1. Select mode and selection count `@smoke`

**Steps:**
  1. A sends three messages, right-clicks the first and clicks "Select"
    - expect: Selection mode starts with that message selected and a top toolbar with action icons is shown (reply, forward, copy, edit, todo, delete icons seen on 2026-10-19; accessible names UNCONFIRMED)
  2. Click the second and third messages
    - expect: All three show as selected; the count (if shown) reads 3
  3. Click the second message again
    - expect: It is unselected; the count is 2

#### 12.2. Exit selection mode `@regression`

**Steps:**
  1. Enter selection mode, select two messages, then exit (Escape or close control; UNCONFIRMED)
    - expect: No messages are selected and the normal composer returns

#### 12.3. Bulk delete only the selected messages `@regression`

**Steps:**
  1. A selects two of three messages and deletes them
    - expect: Only those two are removed on A and B; the third remains

#### 12.4. Bulk copy `@regression`

**Steps:**
  1. A selects two messages and clicks copy
    - expect: Clipboard contains both texts in order (UNCONFIRMED format)

#### 12.5. Multi-select across both users' messages `@regression`

**Steps:**
  1. A selects one own and one received message
    - expect: Edit and Delete behave per ownership rules (UNCONFIRMED: disabled or hidden for mixed selection)

### 13. Emoji and reactions `@two-user`

#### 13.1. Quick reaction visible to both users `@smoke`

**Steps:**
  1. A sends `auto-react-<ts>`; B right-clicks it and clicks "React 👍"
    - expect: The 👍 reaction shows on the message for B and for A without reloading
  2. Repeat with ❤️, 😂, 😮, 😢, 🙏 on separate messages (Scenario Outline over the six emojis)
    - expect: Each emoji appears on its own message on both sides

#### 13.2. Same reaction again removes it `@regression`

**Steps:**
  1. B clicks "React 👍" on a message that already has B's 👍
    - expect: The reaction is removed on both sides (UNCONFIRMED toggle behavior)

#### 13.3. Changing a reaction replaces the old one `@regression`

**Steps:**
  1. B reacts 👍, then reacts ❤️ on the same message
    - expect: Only ❤️ from B is shown on both sides (UNCONFIRMED; one reaction per user)

#### 13.4. Both users react to the same message `@regression`

**Steps:**
  1. A and B both react to one message (different emoji)
    - expect: Both reactions are shown; a count or participants list is UNCONFIRMED

#### 13.5. Reaction from the full picker `@regression`

**Steps:**
  1. Open the reaction bar "more" button and choose an emoji not in the quick six
    - expect: The chosen emoji appears as a reaction on both sides (picker UI UNCONFIRMED)

#### 13.6. Reaction via hover "Add reaction" `@regression`

**Steps:**
  1. Hover a message and click "Add reaction"
    - expect: The reaction bar opens and a selection adds the reaction

#### 13.7. Reaction persists after reload `@regression`

**Steps:**
  1. React to a message and reload both contexts
    - expect: Reaction is still shown on both sides

#### 13.8. Composer emoji in a sent message `@regression`

**Steps:**
  1. A clicks the composer "Emoji" button, picks an emoji, adds text and sends
    - expect: B sees the message with the emoji rendered correctly

### 14. Forward `@two-user`

Forward only to dedicated test chats (user B and up to two other dedicated users/groups, called C and D). "Recipients" below means all chats the message was forwarded to.

#### 14.1. Forward a single message to one chat `@smoke`

**Steps:**
  1. A sends `auto-fwd-<ts>` in the chat with a dedicated user, right-clicks it and clicks "Forward"
    - expect: "Forward to" dialog opens with a preview card of the message and the textbox "Search chats"
  2. Select user B's chat and click the send button
    - expect: Dialog closes
  3. B opens the chat with A
    - expect: B sees `auto-fwd-<ts>` with the label "Forwarded from <A's name> <date/time>"

#### 14.2. Forward a single message to 2 and to exactly 3 chats `@regression`

**Steps:**
  1. A forwards `auto-fwd-<ts>` selecting two chats
    - expect: Counter reads "2 of 3 selected"
  2. Add a third chat
    - expect: Counter reads "3 of 3 selected"; send forwards to all three
  3. Open each recipient chat (B, C, D)
    - expect: Every recipient shows the message with the "Forwarded from" label

#### 14.3. Selecting a 4th chat is blocked `@smoke`

**Steps:**
  1. Open "Forward to" and select three chats
    - expect: Counter reads "3 of 3 selected"
  2. Click a fourth chat
    - expect: Toast "You can forward to up to 3 chats"
    - expect: Counter stays "3 of 3 selected"; the fourth is not checked; the first three stay checked
  3. Unselect one, then select the fourth
    - expect: Counter stays at 3 and the new selection is accepted

#### 14.4. Forward multiple messages to one chat `@regression`

**Steps:**
  1. A sends `auto-m1-<ts>`, `auto-m2-<ts>`, `auto-m3-<ts>`, enters "Select", selects all three and clicks forward in the top toolbar
    - expect: "Forward to" dialog opens (preview of multiple messages UNCONFIRMED)
  2. Select B's chat and send
    - expect: B sees all three in the original order, each with the "Forwarded from" label

#### 14.5. Forward multiple messages to exactly 3 chats `@regression`

**Steps:**
  1. Forward the three selected messages to B, C and D
    - expect: Counter reads "3 of 3 selected"
    - expect: All three recipients show all three messages in order, each with the "Forwarded from" label
  2. Try to add a fourth chat before sending
    - expect: Toast "You can forward to up to 3 chats"

#### 14.6. Forwarded label on every recipient `@smoke`

**Steps:**
  1. After 14.2, open each recipient chat as the owning user (B in context 2; C and D in their own contexts)
    - expect: Each shows `Forwarded from <original sender> <original date/time>` before the message text
    - expect: The original message in A's source chat has no "Forwarded" label
    - expect: The original sender name and time in the label match the source message

#### 14.7. Forward dialog search `@regression`

**Steps:**
  1. In "Forward to", type a name into "Search chats"
    - expect: Only matching people and groups are listed; clearing restores the list
  2. Select a match from search results and send
    - expect: The message is forwarded to that chat

#### 14.8. Group as a forward target `@regression`

**Steps:**
  1. Select a dedicated test group in "Forward to" and send
    - expect: Group members see the message with the "Forwarded" label (UNCONFIRMED whether a group counts toward the 3-chat limit; record actual)

#### 14.9. Send with no chat selected `@regression`

**Steps:**
  1. Open "Forward to" without selecting any chat and click the send button
    - expect: Nothing is sent; the button is disabled or the dialog stays (UNCONFIRMED)

#### 14.10. Close the dialog without sending `@regression`

**Steps:**
  1. Open "Forward to", select a chat, click "Close"
    - expect: Dialog closes and no message appears in the target chat

#### 14.11. Forward a forwarded message `@known-behavior`

**Steps:**
  1. B forwards a message that carries the "Forwarded from A" label to C
    - expect: UNCONFIRMED: C sees the label naming the original sender (A) or B; record actual

#### 14.12. Forwarded message persists after reload `@regression`

**Steps:**
  1. Forward a message, reload the recipient context, open the chat
    - expect: The message and its "Forwarded from" label are still shown

## Live verification results (2026-10-19, dev, five test accounts, run via a multi-context Playwright script)

Accounts (OTP for all working accounts is 123456, as in TEST_OTP): A `1234567890` = **Magic @test_01**; B `2345678901` = **MagicNumber2 @testing2**; C `3456789012` = **Testing @testuser**; E `0123456789` = **Test00 @test_00**. D `4567890123` rejected OTP 123456 ("Incorrect code.") and was not used. Two throwaway groups made only of these accounts were created for the forward-limit tests: `auto-g1-<ts>` (A, B, C, E) and `auto-g2-<ts>` (A, B, C).

Legend: **CONFIRMED** = observed as written; **BUG?** = behavior that looks wrong or surprising and needs a product decision.

### Timing and test-harness notes
- Live updates reach another user's open chat after **about 8-20 s** (new message, edit, delete, reaction). Use waits of 20-30 s or poll; 3-6 s is not enough. A fresh login shows the current state immediately.
- Flutter composer: right after a first send in the same view, typed text is not registered (the Send button stays disabled and nothing sends, even with Enter). Opening another chat and coming back resets it. **BUG? (confirm manually; may be an automation artifact).** Automation also needs a ~700 ms pause after clicking the composer or the first character is dropped.
- Chat-list rows carry state in their name, e.g. `Magic, 1 unread`; a locator for a row must allow `,`.
- Forward send button and the "N of 3 selected" counter / toast are not exposed in the accessibility tree; verify them by screenshot and click the send button by coordinates.
- Logins failed late in the run: the verify request hung and the app showed "We couldn't load your account right now — please try again" (backend slowness; not retried further).

### Group 9. Actions menu (CONFIRMED)
- 9.1: own message menu = Reply, Forward, Copy, Edit, Create Todo, Delete, Select + reaction bar (React 👍 ❤️ 😂 😮 😢 🙏 and a "more" button).
- 9.2: a received message menu = Reply, Forward, Copy, Select (+ reaction bar). **No Edit, Delete or Create Todo** for the recipient.

### Group 10. Edit (CONFIRMED)
- 10.1: Edit shows banner `Editing message <text>`, the composer is prefilled, buttons `Cancel edit` and `Save edit`. After Save, the message shows the new text with an **`Edited`** marker (`<text> 11:34 AM Edited`). The recipient sees the new text after about 10 s without reload; the marker is visible after reload.- 10.2: Cancel edit keeps the original text and clears the composer.
- 10.3: Clearing the text disables `Save edit` (empty edit rejected).
- 10.4: Chat-list preview on the recipient side showed the pre-edit text (`auto-edit-…` without `-v2`) at the time checked. **BUG? (stale preview after edit; recheck after the delay).**

### Group 11. Delete (CONFIRMED)
- 11.1: Delete opens an alert dialog: **"Delete for everyone? This message will be removed for all members. This cannot be undone."** with `Cancel` and `Delete`. After confirming, the sender sees `You deleted this message <time>`; the recipient sees **`This message was deleted <time>`** (about 12 s later). Both persist after reload.
- 11.2: Cancel keeps the message.
- 11.3: Deleting the middle of three messages keeps the other two in order, with a tombstone in the middle.
- 11.4: preview update not captured (UNCONFIRMED).

### Group 12. Multi-select (CONFIRMED)
- 12.1: `Select` starts selection mode with a top toolbar: `Close`, `Forward`, counter `N selected`, `Delete`. Clicking messages toggles them: 1 → 3 → 2 selected. Other toolbar icons (reply, pin, copy, todo, edit) are unnamed.
- 12.2: **Escape does not exit selection mode**; use `Close`. The selection mode ends automatically after a forward is sent.
- 12.3 / 12.5: On a selection of received messages the toolbar shows **"Only your own messages can be deleted"** and `Delete` is disabled. Bulk delete of own messages not run (UNCONFIRMED). Bulk copy not run.

### Group 13. Reactions (CONFIRMED)
- Reacting adds a chip (`Reaction 👍`) under the bubble; the message becomes a `group` with the chip as a child. **No count is shown**; the chip reads only the emoji.
- 13.1: all quick reactions are accepted; the other user sees it after a delay (not instant). Chat-list preview of the reacted-to user changes to `Reacted <emoji> to your message`; the reactor sees `You reacted <emoji> to "<text>"`.
- 13.2: clicking the same reaction again **removes** it.
- 13.3: reacting with a different emoji **replaces** the user's previous one (one reaction per user).
- 13.4: both users can react to the same message; after a fresh login both chips (`😂` from B, `🙏` from A) are shown on both sides.
- 13.5 (full picker via "more") and 13.8 (composer emoji) not run (UNCONFIRMED).
- 13.6: hovering a message shows `Message options` and `Add reaction` buttons.

### Group 14. Forward (CONFIRMED unless noted)
- The Forward dialog lists **existing conversations only** (people with a chat and groups), **excluding the chat you forward from**. A contact with no messages (e.g. Test00 before the first message) is not listed. The single-message dialog shows a preview card (sender, date/time, text); the multi-message dialog has **no preview card**.
- 14.2 / 14.3: selecting chats updates the counter `N of 3 selected`. Clicking a 4th shows the toast **"You can forward to up to 3 chats"**; the counter stays `3 of 3 selected`, the 4th row is not checked and the first 3 stay checked. Sending with 3 delivers to all 3.
- 14.1 / 14.6 / 14.7: **BUG? Forwarding your own message shows no "Forwarded" label** — A forwarded A's own message to C, E and g1: it arrived as a plain message for C, E, B (g1) and in A's own copy. Forwarding a message **received from another user** shows the label: B forwarded A's message to C, E and g1, and C, E and A (in g1) each saw an avatar, a forward arrow and **`Forwarded from Magic 19/10/26 12:03 pm`** (original sender and original date/time) above the text; the source message is unlabelled.
- 14.4 / 14.5: B forwarded three selected received messages (s1, s2, s3) to C, E and g2: C and A (in g2) received all three **in the original order, each with `Forwarded from Magic <original date/time>`**. E's chat list preview showed the last forwarded message; E's open chat was still loading when captured (UNCONFIRMED for E's labels; the same path worked for the single forward).
- 14.8: group as a target is allowed and counts toward the limit of 3 (g1/g2 were counted as chats).
- 14.5 (zero selected), 14.9 (close without sending) and 14.11 (forward a forwarded message) not run (UNCONFIRMED); closing the dialog without sending was exercised once in the earlier read-only pass with no message sent.

### Cleanup status
All test messages use the `auto-` prefix; some have the first letter dropped (`uto-…`). **The cleanup step did not complete** because logins started failing, so the messages and the two groups listed above are still on dev. Messages are deleted per chat as the sender (Delete for everyone leaves tombstones); the groups need to be left or deleted from the group options (UNCONFIRMED how).
