import { useState, type ComponentProps, type ReactNode } from "react"

import { Link } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"


import { Button } from "@/components/ui/button"

import { BrandMark } from "@/components/Landing-Page/BrandMark"

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

function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" type="button" className="w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
        Google
      </Button>
      <Button variant="outline" type="button" className="w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
          <path
            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
            fill="currentColor"
          />
        </svg>
        Apple
      </Button>
    </div>
  )
}

function LoginHeader() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex justify-center">
        <BrandMark />
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

  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
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
                  type="email"
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

                <Button type="submit" className="w-full font-semibold">
                  Login
                </Button>
              </div>
              <FormDivider />
              <SocialButtons />
              <SignupLink />
            </div>
          </form>
          <LoginSideImage />
        </div>
      </div>
    </div>
  )
}
