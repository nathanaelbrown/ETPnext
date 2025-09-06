export default function InlineCTA({
  heading = "How much could you save?",
  body = "Check your potential property tax savings in minutes.",
  button = "Estimate Your Savings",
  href = "/",
}: {
  heading?: string
  body?: string
  button?: string
  href?: string
}) {
  return (
    <div className="my-10 rounded-2xl border bg-gradient-to-br from-blue-50 to-emerald-50 p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h3 className="text-xl font-semibold">{heading}</h3>
          <p className="mt-1 text-neutral-700">{body}</p>
        </div>
        <a
          href={href}
          className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-white font-medium shadow hover:opacity-90"
        >
          {button}
        </a>
      </div>
    </div>
  )
}

