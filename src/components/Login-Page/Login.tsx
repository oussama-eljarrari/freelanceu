import { LoginForm } from "./login-form"

export function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background/50 p-6 md:p-10">
      
      {/* Background styling to match the Landing Page hero vibe */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(244,109,42,0.14),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(31,42,74,0.1),_transparent_28%)]" />
      
      <div className="w-full max-w-[800px]">
        <LoginForm />
      </div>
    </div>
  )
}
