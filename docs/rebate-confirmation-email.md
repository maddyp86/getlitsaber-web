# Rebate emails — HubSpot workflow copy

Copy for the "Show It Off, Get $5 Off" rebate (`/show-it-off`). Brand-voice
compliant: no em-dashes, no exclamation marks, no superlatives. Personalization
token `{{ contact.firstname }}` falls back to a plain greeting if empty (set a
default of "there" in HubSpot).

Three emails. Email A fires when the rebate is granted (ticket → Complete).
Email B is the immediate submission acknowledgment. Email C is the manual
"could not verify" rejection. Pipeline is **Pending → Complete**, plus a
**Rejected** stage (the "Approved" stage was dropped — approving and refunding
happen in one motion, so it added a step with no distinct customer message).

---

## Email A — Rebate confirmed (primary)

**Trigger:** HubSpot workflow, enrollment = rebate ticket enters the **Complete**
stage (pipeline `2430290680`). This is the "$5 is on the way" message.

**Subject:** Your $5 is on the way
**Preview text:** We spotted your Litsaber post. The rebate is headed back to you.

**Body:**

Hey {{ contact.firstname }},

We saw your Litsaber lit up. Thanks for showing it off.

Your $5 rebate is confirmed. We sent it back to the original payment method on
your order. It usually lands within 3 to 5 business days, depending on your bank.

There is nothing else to do on your end. If it has not shown up after 5 business
days, reply to this email and we will sort it out.

Keep tagging @getlitsaber and #Litsaber. We reshare our favorites.

The Litsaber team

---

## Email B — Submission received (acknowledgment)

**Trigger (simplest):** the HubSpot form's built-in **follow-up email** — enable
it on the rebate form itself so it sends immediately on submission. No workflow
or ticket needed. (Alternative: a workflow enrolled on rebate-ticket-created.)
This is the "we got your submission" acknowledgment.

**Subject:** We got your rebate submission
**Preview text:** We are reviewing your post. Here is what happens next.

**Body:**

Hey {{ contact.firstname }},

Thanks for sending your Litsaber post. We have it.

Here is what happens next. We check that the post is public and tagged with
@getlitsaber and #Litsaber, then refund $5 to the original payment method on your
order. That usually takes a few business days.

We will email you the moment the rebate goes out.

If you need to fix anything on your submission, just reply to this email.

The Litsaber team

---

## Email C — Could not verify (rejection)

**How to send (Starter plan — no 1:1 Templates/Snippets):** automate it with a
dropdown property + workflow, so the dropdown IS the chooser and the email sends
itself. Set up once:
1. Create a **dropdown property "Rebate rejection reason"** (on the CONTACT, so
   the email can tokenize it reliably) with the 6 reasons below as options.
2. Build the rejection email as a regular HubSpot **email asset**, with
   `{{ contact.rebate_rejection_reason }}` where `[REASON]` sits and
   `{{ contact.firstname }}` in the greeting.
3. **Workflow — trigger on the REASON, not the stage.** Enroll when
   "Rebate rejection reason **is known**" → actions: send the email to the
   contact, then set the ticket stage to **Rejected**.

   Trigger on the reason (not on "ticket entered Rejected") so it is impossible
   to send a blank reason: setting the reason is what fires the email. Triggering
   on the stage change risks someone moving the ticket first and the token
   rendering empty.

On review of a bad submission: pick the reason from the dropdown. That one action
sends the email with the reason filled in and moves the ticket to Rejected.

**No-automation fallback (any plan):** keep the reasons in an OS/browser text
expander (macOS System Settings → Keyboard → Text Replacements, or a free
extension) so typing e.g. `;rejprivate` in a normal 1:1 email expands to the
reason. No HubSpot feature required.

**Subject:** About your Litsaber rebate submission
**Preview text:** We could not confirm your post yet. Here is how to fix it.

**Body:**

Hey {{ contact.firstname }},

Thanks for sending your Litsaber post. We took a look and could not confirm it
for the $5 rebate yet.

Here is what we found: [REASON]

Once that is sorted, reply to this email with your updated post link and we will
take another look. The $5 rebate is still available to you.

The Litsaber team

### Reason snippets (paste one into [REASON])

Turn each of these into a HubSpot **Snippet** (canned response) with a `#shortcut`
so, when sending, you type `#` at the `[REASON]` spot and pick from the list
instead of copy-pasting. Suggested shortcuts in parentheses.

- Your post is set to private, so we cannot see it. Set it to public and we can
  verify it.
- We could not find @getlitsaber or #Litsaber on the post. Add the tag and the
  hashtag so we can confirm it is yours.
- The order number did not match an order on our end. Check the number in your
  confirmation email and send us the exact one.
- We could not see a Litsaber in the post. The rebate needs your Litsaber in the
  photo or video.
- The link did not open a public post. Send us a direct link to the post itself.
- This looks like a second submission. The $5 rebate is one per customer.

---

## Email C — text-expander pack (manual sending, Starter-friendly)

Each shortcut below expands to the COMPLETE email with its reason already baked
in, so one shortcut = a finished email. Replace `[First]` with the customer's
first name before sending.

**Subject** (shortcut `;rejsubj`): About your Litsaber rebate submission

---
**`;rejprivate`** — post is private

Hey [First],

Thanks for sending your Litsaber post. We took a look and could not confirm it
for the $5 rebate yet.

Here is what we found: your post is set to private, so we cannot see it. Set it
to public and we can verify it.

Once that is sorted, reply to this email with your updated post link and we will
take another look. The $5 rebate is still available to you.

The Litsaber team

---
**`;rejtag`** — missing tag or hashtag

Hey [First],

Thanks for sending your Litsaber post. We took a look and could not confirm it
for the $5 rebate yet.

Here is what we found: we could not find @getlitsaber or #Litsaber on the post.
Add the tag and the hashtag so we can confirm it is yours.

Once that is sorted, reply to this email with your updated post link and we will
take another look. The $5 rebate is still available to you.

The Litsaber team

---
**`;rejorder`** — order number does not match

Hey [First],

Thanks for sending your Litsaber post. We took a look and could not confirm it
for the $5 rebate yet.

Here is what we found: the order number did not match an order on our end. Check
the number in your confirmation email and send us the exact one.

Once that is sorted, reply to this email with your updated post link and we will
take another look. The $5 rebate is still available to you.

The Litsaber team

---
**`;rejdevice`** — no Litsaber visible

Hey [First],

Thanks for sending your Litsaber post. We took a look and could not confirm it
for the $5 rebate yet.

Here is what we found: we could not see a Litsaber in the post. The rebate needs
your Litsaber in the photo or video.

Once that is sorted, reply to this email with your updated post link and we will
take another look. The $5 rebate is still available to you.

The Litsaber team

---
**`;rejlink`** — link does not open a public post

Hey [First],

Thanks for sending your Litsaber post. We took a look and could not confirm it
for the $5 rebate yet.

Here is what we found: the link did not open a public post. Send us a direct link
to the post itself.

Once that is sorted, reply to this email with your updated post link and we will
take another look. The $5 rebate is still available to you.

The Litsaber team

---
**`;rejdupe`** — duplicate submission

Hey [First],

Thanks for sending your Litsaber post. We took a look and could not confirm it
for the $5 rebate.

Here is what we found: this looks like a second submission. The $5 rebate is one
per customer.

Thanks for keeping the posts coming. We reshare our favorites.

The Litsaber team

---

## Setup notes

- **Sender:** use the standard Litsaber support from-name and reply-to so replies
  reach the team.
- **Personalization default:** set `{{ contact.firstname }}` default to "there"
  so an empty first name reads "Hey there,".
- **One-per-customer:** the rebate is one per customer. If you enable Email B,
  make sure the workflow does not re-enroll a contact who submits a second time.
- **Compliance footer:** keep the standard 21+ / address footer from the Litsaber
  email template.
- **Rejection reason dropdown:** add an "Other" option for cases the 6 snippets
  do not cover; for "Other" you would type the reason directly (or fall back to
  the text-expander method). Put the property on the CONTACT so the email token
  resolves; if you prefer it on the ticket, confirm your plan lets email tokens
  read ticket properties first.
