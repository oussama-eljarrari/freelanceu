export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
        FU
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          FreelanceU
        </p>
        <p className="text-sm text-muted-foreground">Work on your terms</p>
      </div>
    </div>
  )
}