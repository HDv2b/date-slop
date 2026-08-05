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
        <p>
          This is a parody demo built by{" "}
          <a
            target="_blank"
            href="https://github.com/HDv2b"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            Hussein Duvigneau
          </a>{" "}
          for the{" "}
          <a
            target="_blank"
            href="https://badux.lol/"
            className="0 inline-flex items-center text-blue-600 hover:underline"
          >
            Bad UX World Cup
          </a>
          .
        </p>
        <p>
          No personal data nor analytics are collected. If you're still unsure,
          please feel free to play with fake details.
        </p>
      </footer>
    </div>
  );
}
