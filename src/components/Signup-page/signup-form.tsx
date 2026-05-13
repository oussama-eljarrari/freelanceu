import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Landing-Page/Logo"
import loginSide from "@/assets/login-side.png"
import { useAuth } from "@/Context/AuthContext"

const inputClassName =
  "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

export function SignupForm() {

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { signup } = useAuth()
  
  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault()

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }


    try {
      await signup(fullName, email, password)
    } catch (error: any) {
      setError(error.message || "Failed to create account")
    }
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-lg shadow-primary/5">
        <div className="grid md:grid-cols-2">
          <form className="flex flex-col justify-center p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex justify-center">
                  <Logo />
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-bold text-foreground">
                    Create an account
                  </h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    Join FreelanceU and start your journey
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium leading-none text-foreground"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    className={inputClassName}
                  />
                </div>

                <Button type="submit" className="w-full font-semibold">
                  Create account
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline underline-offset-4"
                >
                  Log in
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src={loginSide}
              alt="FreelanceU Platform"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
