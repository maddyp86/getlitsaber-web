# Rebate emails — HubSpot workflow copy

Copy for the "Show It Off, Get $5 Off" rebate (`/show-it-off`). Brand-voice
compliant: no em-dashes, no exclamation marks, no superlatives. Personalization
token `{{ contact.firstname }}` falls back to a plain greeting if empty (set a
default of "there" in HubSpot).

Two emails. Email A is the one that was decided (fires when the rebate is
granted). Email B is an optional immediate acknowledgment.

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

## Setup notes

- **Sender:** use the standard Litsaber support from-name and reply-to so replies
  reach the team.
- **Personalization default:** set `{{ contact.firstname }}` default to "there"
  so an empty first name reads "Hey there,".
- **One-per-customer:** the rebate is one per customer. If you enable Email B,
  make sure the workflow does not re-enroll a contact who submits a second time.
- **Compliance footer:** keep the standard 21+ / address footer from the Litsaber
  email template.
