export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-bold font-jakarta tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  )
}