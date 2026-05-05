import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFound() {
	return (
		<main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
			<div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-background px-6 py-16 text-center shadow-sm sm:px-10">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
				<div className="relative mx-auto flex max-w-lg flex-col items-center gap-6">
					<span className="rounded-full border border-border bg-muted px-4 py-1 text-sm font-medium text-muted-foreground">
						404 - Page not found
					</span>
					<div className="space-y-3">
						<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
							Oups, cette page n'existe pas.
						</h1>
						<p className="text-base leading-7 text-muted-foreground sm:text-lg">
							Le lien que vous avez suivi est incorrect ou la page a été déplacée.
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button asChild className="rounded-full px-6">
							<Link to="/home">Retour à l'accueil</Link>
						</Button>
					</div>
				</div>
			</div>
		</main>
	)
}
