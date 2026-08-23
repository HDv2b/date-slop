import Form from "@/libs/form/Form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-zinc-50 font-sans">
      <main className="h-fit-content flex w-full max-w-3xl grow flex-col items-center justify-start bg-white px-8 py-8 sm:items-start">
        <div className="flex flex-col justify-center">
          <h1 className="mb-4 text-4xl leading-none font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Da.i.te Slop
          </h1>
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

        {/*            <a href="https://www.linkedin.com/in/husseinduvigneau/"
               className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Linked In
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
            <a href="https://badux.lol/"
               className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Bad UX website with other people's entries
                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>*/}
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
              aria-label="GitHub"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M12 2C6.477 2 2 6.58 2 12.218c0 4.512 2.865 8.34 6.839 9.694.5.093.683-.218.683-.484 0-.236-.009-1.024-.014-1.86-2.782.607-3.369-1.342-3.369-1.342-.455-1.16-1.11-1.468-1.11-1.468-.908-.622.069-.61.069-.61 1.004.071 1.533 1.033 1.533 1.033.892 1.53 2.341 1.088 2.91.833.091-.648.349-1.089.635-1.338-2.221-.253-4.555-1.113-4.555-4.955 0-1.094.39-1.989 1.029-2.689-.103-.253-.446-1.275.098-2.656 0 0 .84-.269 2.75 1.026A9.57 9.57 0 0 1 12 6.844c.85.004 1.705.115 2.505.338 1.909-1.295 2.748-1.026 2.748-1.026.546 1.381.203 2.403.1 2.656.64.7 1.028 1.595 1.028 2.689 0 3.85-2.337 4.699-4.566 4.947.359.31.679.92.679 1.854 0 1.338-.012 2.416-.012 2.747 0 .27.18.58.688.481A10.02 10.02 0 0 0 22 12.218C22 6.58 17.523 2 12 2Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/husseinduvigneau/"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.025-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.961v5.706h-3v-11h2.881v1.494h.041c.401-.759 1.381-1.56 2.841-1.56 3.041 0 3.601 2 3.601 4.601v6.465z" />
              </svg>
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
