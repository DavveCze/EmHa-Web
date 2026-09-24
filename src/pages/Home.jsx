function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          EmHa
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your React project is ready.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-slate-300">
          Start building your next page in <code className="text-cyan-300">src/pages</code>.
        </p>
      </div>
    </main>
  )
}

export default Home
