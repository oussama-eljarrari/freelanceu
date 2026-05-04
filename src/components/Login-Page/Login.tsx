import { LoginForm } from "./login-form"
import bgImage from "@/assets/background.png"
export function LoginPage() {
  return (
    
    <div className="flex min-h-screen flex-col items-center justify-center bg-background/50 p-6 md:p-10">

      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}/>   

      <div className="w-full max-w-[800px]">

        <LoginForm />

      </div>

    </div>

  )
}
