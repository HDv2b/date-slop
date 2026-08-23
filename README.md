# Date Slop

An AI-powered date picker that makes entering your date of birth unnecessarily difficult. 🤖

**[Try the live demo](https://date-slop.hdv.dev)**

<!-- Replace with a real screenshot or GIF -->

![Date Slop screenshot](./docs/date-slop-screenshot.png)

Date Slop was built as an entry for the **Bad UX World Cup**. Instead of letting you simply enter your date of birth, the date field is hijacked by an AI assistant that insists on working it out for you.

It asks questions. You give it vague clues. It makes guesses. Eventually, if all goes well, it figures out your birthday and fills in the field itself.

The result is intentionally frustrating.

## 💡 Why I built it

The premise was simple: take something that should be extremely easy — entering a date — and replace it with an unnecessarily complicated AI interaction.

The interesting part was finding the balance between **bad UX and unusable UX**.

Making the interaction annoying was easy. Making it annoying enough to be funny, while still giving users a realistic chance of reaching the end, required considerably more iteration.

The AI needed to:

* ask questions that could genuinely narrow down a date;
* understand indirect clues based on history, culture, technology and personal context;
* reject attempts to simply provide the date directly;
* make enough mistakes to support the joke without becoming completely incoherent;
* recognise when it had enough information to make a final guess;
* return control to the conventional form once it had decided on a date.

Much of the work therefore involved experimenting with the model's instructions and interaction flow to constrain a probabilistic system into a deliberately awkward — but still playable — experience.

## ⚙️ How it works

1. The user fills in the ordinary parts of the form.
2. Clicking the date-of-birth field opens the AI interface instead of a normal date picker.
3. The assistant asks questions intended to determine the user's birth date.
4. The user responds with indirect clues rather than simply typing the date.
5. If the user tries to give the date directly, the assistant rejects it and asks another question.
6. The conversation continues until the assistant believes it can identify a specific date.
7. Its final guess is written back into the original form.

The OpenAI API is accessed through the Next.js backend, keeping the API key on the server rather than exposing it to the browser.

## 🛠️ Tech

* **Next.js 16**
* **React 19**
* **TypeScript**
* **OpenAI API**
* **React Hook Form**
* **Tailwind CSS**

## 🎮 How to play

1. Open the [live demo](https://date-slop.hdv.dev).
2. Fill in your name and location.
3. Click the date-of-birth field.
4. Answer the assistant's questions using clues rather than explicit dates.
5. Keep going until it finally works out your birthday.

Trying to give it your date of birth directly won’t help — the assistant will reject it and keep asking questions.

## 🏆 Competition context

Date Slop was created for the **Bad UX World Cup**, a competition built around deliberately terrible user experiences.

The original competition website is no longer online, but the judging session has been preserved on YouTube:

**[Watch the Bad UX World Cup judging video](https://www.youtube.com/watch?v=PGpwoWGXBK0)**

Date Slop didn’t make the finals — apparently the UX wasn’t bad enough.

## 🚀 Running locally

This project uses `pnpm`.

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the OpenAI API key

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the development server

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Production

Build and run the application with:

```bash
pnpm build
pnpm start
```

The `OPENAI_API_KEY` must be supplied as a server-side environment variable in the production environment.

⚠️ Reminder: Do not commit API keys to source control.
