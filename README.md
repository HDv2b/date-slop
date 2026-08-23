# Date Slop

This is a deliberately bad date-picker demo for a Bad UX competition. The date field is hijacked by an AI agent that insists on entering the date for you, even though it is bad at understanding dates. The agent asks you questions, and you have to answer with vague clues until it eventually guesses the right day.

You can see the [finalists presented on YouTube](https://www.youtube.com/watch?v=PGpwoWGXBK0). This entry did make it, so I guess it wasn't bad enough! 

The main challenge was tuning the agent prompts so the experience was frustrating enough to be amusing, but not so hard that the user gave up. The goal was to make it work for both people who know the usual LLM tricks and people who barely use technology at all.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root and add:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the app:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Hosting this demo

Deploy the app with the `OPENAI_API_KEY` environment variable set in your host.

### Option 1: Vercel (recommended)

- Push the project to GitHub
- Import it into Vercel
- Add `OPENAI_API_KEY` in project settings as an environment variable
- Redeploy the app

### Option 2: Any Node.js host

Use the same environment variable setup and run:

```bash
npm run build
npm run start
```

Keep the API key in the host environment only; do not commit it to source control.

## How to play

1. Fill in the name and location fields.
2. Click the date of birth field.
3. The date picker is hijacked by a chat window with an AI assistant.
4. The assistant asks questions and tries to guess your birthdate, but it is terrible at reading dates directly.
5. Answer with clues using context, history, culture, technology, or other indirect references instead of explicit dates or months.
6. If it guesses wrong, keep replying with more hints until it eventually lands on a date.
7. Once it is confident, it fills in the date field automatically.

This is intentionally frustrating UX: the agent is supposedly helping, but it cannot actually interpret dates well, which is the joke.
