import { useState, type ComponentProps, type ReactNode } from "react"

import { Link } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"


import { Button } from "@/components/ui/button"

import { Logo } from "@/components/Landing-Page/Logo"

import loginSide from "@/assets/login-side.png"


const inputClassName =
  "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

type FieldProps = {
  id: string
  label: string
  type?: string
  value: string
  placeholder?: string
  action?: ReactNode
  onChange: (value: string) => void
}

function Field({
  id,
  label,
  type = "text",
  value,
  placeholder,
  action,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-2">
      {action ? (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none text-foreground"
          >
            {label}
          </label>
          {action}
        </div>
      ) : (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none text-foreground"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
      {message}
    </div>
  )
}

function FormDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
  )
}

function LoginHeader() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex justify-center">
        <Logo />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Welcome back
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Login to your FreelanceU account
        </p>
      </div>
    </div>
  )
}

function SignupLink() {
  return (
    <div className="text-center text-sm text-muted-foreground">
      Dont have an account?{" "}
      <Link
        to="/signup"
        className="font-semibold text-primary hover:underline underline-offset-4"
      >
        Sign up
      </Link>
    </div>
  )
}

function LoginSideImage() {
  return (
    <div className="relative hidden bg-muted md:block">
      <img
        src={loginSide}
        alt="FreelanceU Platform"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9]"
      />
    </div>
  )
}

export function LoginForm(props: ComponentProps<"div">) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)


  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRedirecting) return
    setError(null)
    setIsRedirecting(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    }finally{
      setIsRedirecting(false)
    }
  }


  return (
    <div className="flex flex-col gap-6 font-sans" {...props}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-lg shadow-primary/5">
        <div className="grid p-0 md:grid-cols-2">
          <form className="flex flex-col justify-center p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <LoginHeader />

              {error && <ErrorBanner message={error} />}

              <div className="space-y-4">
                <Field
                  id="email"
                  label="Email"
                  // type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={setEmail}
                />

                <Field
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  action={
                    <a
                      href="#"
                      className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      Forgot your password?
                    </a>
                  }
                />

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={isRedirecting}
                >
                  {isRedirecting ? "Redirecting ....." : "Login"}
                </Button>
              </div>
              <FormDivider />
              <SignupLink />
            </div>
          </form>
          <LoginSideImage />
        </div>
      </div>
    </div>
  )
}
