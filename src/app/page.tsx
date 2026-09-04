import Form from "@/components/form/Form";
import GitHubIcon from "@/components/ui/GitHubIcon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-zinc-50 font-sans">
      <header className="flex w-full max-w-3xl items-center justify-between bg-white px-8 pt-6">
        <div className="flex flex-col justify-center">
          <h1 className="mb-4 text-4xl leading-none font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Da.i.te Slop
          </h1>
        </div>
        <a
          href="https://github.com/HDv2b/date-slop"
          target="_blank"
          rel="noreferrer"
          aria-label="View project on GitHub"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
        >
          <GitHubIcon className="h-5 w-5 fill-current" />
          <span>HDv2b/date-slop</span>
        </a>
      </header>
      <main className="h-fit-content flex w-full max-w-3xl grow flex-col items-center justify-start bg-white px-8 py-8 sm:items-start">
        <div className="flex flex-col justify-center">
          <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl">
            Welcome to <span className="italic">The DysFuture&trade;</span>,
            where automation is life, and even basic tasks like entering your
            date of birth must be done by LLM.
          </p>
          <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl">
            To embrace <span className="italic">The DysFuture&trade;</span>,
            please fill in your details below.
          </p>
        </div>

        <Form />
      </main>
      <footer className="flex flex-col gap-2 p-8 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <p className="m-0 leading-none">
            This is a parody demo built by{" "}
            <a
              href="https://hdv.dev"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              Hussein Duvigneau
            </a>{" "}
            for the{" "}
            <a
              href="https://www.youtube.com/watch?v=PGpwoWGXBK0"
              className="0 inline-flex items-center text-blue-600 hover:underline"
            >
              Bad UX World Cup
            </a>
            .
          </p>
          <div className="flex items-center gap-2 leading-none">
            <a
              href="https://github.com/HDv2b"
              rel="noreferrer"
              aria-label="HDv2b on GitHub"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
            >
              <GitHubIcon className="h-4 w-4 fill-current" />
              <span>HDv2b</span>
            </a>
            <a
              href="https://www.linkedin.com/in/hdv/"
              rel="noreferrer"
              aria-label="Hussein Duvigneau on LinkedIn"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.025-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.961v5.706h-3v-11h2.881v1.494h.041c.401-.759 1.381-1.56 2.841-1.56 3.041 0 3.601 2 3.601 4.601v6.465z" />
              </svg>
              <span>hdv</span>
            </a>
          </div>
        </div>
        <p>
          No personal data nor analytics are collected. If you're still unsure,
          please feel free to play with fake details.
        </p>
      </footer>
    </div>
  );
}
