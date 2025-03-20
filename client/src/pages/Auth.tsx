import { LoginForm } from "@/components/login-form"

export default function Auth() {
  // In a real app, you would check if the user is authenticated
  // If authenticated, redirect to dashboard
  // const isAuthenticated = false
  // if (isAuthenticated) {
  //   redirect("/dashboard")
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
