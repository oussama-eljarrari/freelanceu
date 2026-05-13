import logoV2 from "@/assets/Logo_final.png"

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-primary shadow-lg shadow-primary/20">
        <img src={logoV2} alt="FreelanceU logo" className="h-full w-full object-cover" />
      </div>
      <div>
        <p className="font-jakarta text-sm font-bold uppercase tracking-[0.28em] text-muted-foreground">
          FreelanceU
        </p>
      </div>
    </div>
  )
}