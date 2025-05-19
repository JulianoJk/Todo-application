"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SunIcon, MoonIcon, ListTodoIcon, ArrowLeftIcon, Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const { theme, setTheme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  })

  // Wait for theme to be available
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  const toggleColorScheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    try {
      const result = await registerUser(data.username, data.email, data.password, data.passwordConfirm)
      if (!(result instanceof Error)) {
        router.push("/dashboard")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-slate-900">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="flex items-center">
            <ListTodoIcon className={`h-6 w-6 ${isDark ? "text-violet-400" : "text-violet-700"}`} />
            <span className={`ml-2 text-lg font-bold ${isDark ? "text-violet-400" : "text-violet-700"}`}>Planyze</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleColorScheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-center mb-6">Create your Planyze account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="johndoe"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                  ${
                    errors.username
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500"
                  }
                  bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100
                `}
                {...register("username")}
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                  ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500"
                  }
                  bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100
                `}
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                        : "border-gray-300 dark:border-gray-600 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500"
                    }
                    bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100
                  `}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                    ${
                      errors.passwordConfirm
                        ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                        : "border-gray-300 dark:border-gray-600 focus:ring-violet-200 dark:focus:ring-violet-800 focus:border-violet-500 dark:focus:border-violet-500"
                    }
                    bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100
                  `}
                  {...register("passwordConfirm")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
              {errors.passwordConfirm && <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-200 dark:focus:ring-violet-800 flex justify-center items-center"
            >
              {loading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-600 dark:text-violet-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
