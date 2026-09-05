# Friendship Audit

Build a polished, mobile-first web app called CAUGHT™.



TAGLINE:

Your friends have been audited.



CAUGHT™ is a humorous friendship-audit app. A user creates an accusation about a friend, answers a few fast evidence questions, receives a dramatic official-looking “friendship audit receipt,” and can share it with the accused person.



The goal is NOT to build a social network. The goal is to make the receipt so funny and polished that users want to screenshot and share it.



CORE FLOW



Welcome

→ Home

→ Create Audit

→ Choose Offence

→ Who Did It?

→ Evidence

→ Calculating

→ Official Receipt

→ Share / Defend Yourself

→ Defence

→ Final Verdict



TECHNICAL REQUIREMENTS



Build this as a responsive mobile-first web app.



For this MVP:



- No login

- No signup

- No backend

- No database

- No AI API

- No external paid APIs

- Use localStorage for saved audits

- All scoring must happen client-side

- Generate case numbers locally

- Use browser/device sharing where supported

- Provide a fallback copy/share action if native sharing isn't available

- Every button must work

- Don't create placeholder buttons

- Keep the architecture clean so more offences can easily be added later



Use a modern component-based architecture and reusable components.



VISUAL STYLE



The app should feel like a real viral consumer product.



Dark premium interface.



Use:



- Near-black background

- White/off-white typography

- Red for guilty

- Yellow/orange for suspicious

- Green for innocent

- Large bold headings

- Rounded cards

- Subtle borders

- Strong contrast

- Smooth transitions

- Small playful animations

- Tactile buttons

- Dramatic reveal moments



Do NOT make it look like a generic SaaS dashboard.



It should feel like:

government paperwork + courtroom drama + internet humor.



WELCOME



Large centered logo:



CAUGHT™



Subtitle:



Your friends have been audited.



Copy:



Somebody did something suspicious.

Document the evidence.



Primary button:



LET'S AUDIT THEM →



Small text:



No account required.



HOME



Header:



CAUGHT™



Primary action:



+ New Audit



Hero card:



🧾 WHO ARE WE AUDITING?



Create an audit about someone who has committed suspicious friendship behaviour.



Button:



CREATE AN AUDIT



Recent Audits section.



Show sample local-history cards initially:



Rahul

“47-minute quick call”

🔴 GUILTY



Mom

“Asked when I'm getting married”

🟡 REPEAT OFFENDER



Aisha

“Stole my fries”

🔴 GUILTY



Allow completed audits to be reopened.



Don't add complicated bottom navigation for this MVP.



CHOOSE OFFENCE



Header:



← Back



Title:



What did they do?



Display large offence cards.



⏰ TIME CRIMES



Came late

“5 minutes away”

Ghosted

Cancelled last minute



💸 MONEY CRIMES



Didn't pay me

Borrowed money

“I'll send it tomorrow”



💬 CHAT CRIMES



Left me on read

Replied after 3 days

Sent “K”

Saw my story but didn't reply



🍟 FOOD CRIMES



Stole my food

Didn't share

Took the last piece



🧑‍💼 WORK CRIMES



“Quick call”

Took credit

Sent work at 11:59 PM



🤨 OTHER



Something else



For this first version, fully implement:



Came Late / Chronic Lateness



Other offences can display as “Coming soon” or be prepared structurally for later implementation.



WHO DID IT?



Title:



Who are we auditing?



Input:



Name



Then:



What are you to them?



Buttons:



Friend

Partner

Sibling

Parent

Coworker

Other



Primary button:



CONTINUE →



Don't require an account.



EVIDENCE — CHRONIC LATENESS



Make this extremely fast.



Avoid long text fields.



Question:



How late were they?



Buttons:



5 min

15 min

30 min

1 hr

2+ hrs



Question:



Did they say they were coming?



YES

NO



Question:



Did they say “5 minutes”?



Unfortunately, yes

No



Question:



Previous offences?



0

1–2

3–5

I've lost count



Question:



Did they apologize?



Genuine apology

“My bad”

Blamed traffic

No apology



Primary CTA:



CALCULATE DAMAGES →



SCORING ENGINE



Create reusable deterministic scoring logic.



Late:

5 min = +10

15 min = +20

30 min = +35

1 hr = +55

2+ hrs = +75



Said they were coming:

+5



Said “5 minutes”:

+15



Previous offences:

0 = +0

1–2 = +10

3–5 = +20

I've lost count = +30



Apology:

Genuine apology = -10

“My bad” = +5

Blamed traffic = +10

No apology = +20



Clamp score between 0 and 100.



Verdicts:



0–29:

INNOCENT



30–49:

SUSPICIOUS



50–69:

GUILTY



70–84:

VERY GUILTY



85–100:

EXTREMELY GUILTY



CALCULATING SCREEN



After clicking Calculate Damages, show a dramatic dark screen for approximately 1 second.



Text changes through these stages:



AUDIT IN PROGRESS...



Analyzing evidence...



Calculating damages...



Reviewing previous offences...



Then reveal:



🚨 SUSPICIOUS ACTIVITY DETECTED



Automatically transition to the receipt.



OFFICIAL RECEIPT



This is the most important screen.



Make it visually exceptional.



It should resemble an absurd official government/business receipt.



Display:



CAUGHT™



OFFICIAL FRIENDSHIP AUDIT



CASE #[random case number]



SUBJECT



[NAME]



OFFENCE



CHRONIC LATENESS



EVIDENCE



Expected arrival

7:00 PM



Actual arrival

8:47 PM



Excuse provided

“Bro, almost there.”



Previous offences

[number]



DAMAGES



[number] MINUTES

OF YOUR LIFE



VERDICT



🚨 [SCORE]% GUILTY



OFFENCE SEVERITY



Show a visual severity bar.



SENTENCE



Generate a funny sentence based on the score.



Possible sentences:



BUY EVERYONE CHAI ☕



OWE THE GROUP SNACKS 🍟



SEND A SINCERE APOLOGY



YOU ARE FORBIDDEN FROM SAYING “5 MINUTES”



ARRIVE 30 MINUTES EARLY NEXT TIME



CASE #[number]



CAUGHT™



Make this receipt easy to screenshot.



Add subtle receipt/document texture or visual details without making it cluttered.



Buttons:



SHARE RECEIPT



LET THEM DEFEND THEMSELVES



The “LET THEM DEFEND THEMSELVES” button should be highly visible.



PERSONALITIES



Before generating the final wording, allow the user to select one of three free personalities:



👩 INDIAN MOM



“I raised you better than this.”



⚖️ STRICT JUDGE



“Zero tolerance for nonsense.”



🧑‍⚖️ CHAOTIC JUDGE



“I have reviewed the evidence and I'm already disappointed.”



The selected personality should influence verdict copy and sentence copy.



Keep the personalities modular so more can be added later.



SHARE CARD



When the user taps Share Receipt, create a beautiful shareable card.



Content:



🚨 YOU'VE BEEN AUDITED



[NAME] has been found:



[SCORE]% GUILTY



Crime:

Chronic lateness



Sentence:

[funny sentence]



Think the verdict is wrong?



👉 DEFEND YOURSELF



CAUGHT™



Use the browser/device Web Share API when available.



If unavailable, provide a fallback that copies the share text and/or allows the receipt to be saved/shared.



DEFEND YOURSELF



Create a defendant view.



Show:



🚨 YOU'VE BEEN ACCUSED



[ACCUSER NAME] says you:



Were [lateness amount] late.



Their evidence:



“Bro said 5 minutes.”



Then:



WHAT'S YOUR DEFENCE?



Options:



🚗 Traffic was insane

😴 I overslept

🤷 Not my fault

😤 They're exaggerating

🧑‍⚖️ I plead guilty

✍️ My defence



Allow one selection.



COUNTER-EVIDENCE



Show:



Do you have evidence?



📸 Upload screenshot

💬 Add a message

❌ I have nothing



For MVP, do NOT perform OCR or image analysis.



If a screenshot is uploaded, simply attach/store it locally and display that evidence in the final result.



FINAL VERDICT



Show:



⚖️ AUDIT COMPLETE



[ACCUSER] vs [DEFENDANT]



INITIAL VERDICT



[initial score]% GUILTY



DEFENCE



[selected defence]



FINAL VERDICT



[final score]% GUILTY



Defence modifiers:



Traffic was insane = -10

I overslept = -5

Not my fault = -15

They're exaggerating = -8

I plead guilty = +5



Clamp between 0 and 100.



Explain the change:



“The defendant successfully reduced the charge by 15%.”



Then:



OFFICIAL SENTENCE



Examples:



ONE SNACK + ONE SINCERE APOLOGY 🍟



BUY EVERYONE CHAI ☕



YOU OWE THE GROUP DESSERT



Buttons:



SHARE FINAL VERDICT



NEW AUDIT



LOCAL HISTORY



Store completed audits in localStorage.



Each audit should contain:



- id

- case number

- subject name

- relationship

- offence

- evidence

- personality

- initial score

- initial verdict

- defence

- final score

- final verdict

- created date



Home should show the most recent audits.



IMPORTANT UX PRINCIPLE



The app should require very little typing.



The faster someone can go from:



“I know exactly who deserves this”



to:



“😂 LOOK WHAT CAUGHT™ JUST SAID”



the better.



Use large tap targets and short screens.



PRODUCT PRIORITY



Do NOT spend time building unnecessary infrastructure.



Priority order:



1. Smooth audit creation

2. Excellent evidence interaction

3. Funny scoring

4. Beautiful receipt

5. Share flow

6. Defence flow

7. Final verdict

8. Local history

9. Polish



The receipt is the hero feature.



The emotional reaction we want is:



“WAIT 😂 LOOK WHAT THIS APP JUST SAID ABOUT YOU.”



Build the working MVP now. Prioritize a complete end-to-end Chronic Lateness audit over implementing every offence.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/09d8398a-4690-4628-b214-5ad0880d61a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
