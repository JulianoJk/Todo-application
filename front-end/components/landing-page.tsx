"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  CheckIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  ListTodoIcon,
  ArrowRightIcon,
  GithubIcon,
  TwitterIcon,
  InstagramIcon,
  CalendarIcon,
  BellIcon,
  SmartphoneIcon,
  PaletteIcon,
  BarChartIcon,
  StarIcon,
} from "lucide-react"

export function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Wait for theme to be available
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-slate-900/90 backdrop-blur-md shadow-md"
              : "bg-white/90 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <ListTodoIcon className={`h-7 w-7 ${isDark ? "text-violet-400" : "text-violet-700"}`} />
              <span className={`ml-2 text-xl font-bold ${isDark ? "text-violet-400" : "text-violet-700"}`}>
                Planyze
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="#features"
                className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 border border-violet-600 dark:border-violet-500 text-violet-600 dark:text-violet-400 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-violet-600 dark:bg-violet-700 text-white rounded-lg hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-current transform transition-transform duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
                ></span>
                <span
                  className={`block h-0.5 bg-current transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`block h-0.5 bg-current transform transition-transform duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white dark:bg-slate-900 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden pt-20`}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
          <Link
            href="/login"
            className="w-full px-4 py-3 border border-violet-600 dark:border-violet-500 text-violet-600 dark:text-violet-400 rounded-lg text-center hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
            onClick={closeMenu}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="w-full px-4 py-3 bg-violet-600 dark:bg-violet-700 text-white rounded-lg text-center hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors"
            onClick={closeMenu}
          >
            Sign Up Free
          </Link>
          <Link
            href="#features"
            className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-center transition-colors"
            onClick={closeMenu}
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-center transition-colors"
            onClick={closeMenu}
          >
            Testimonials
          </Link>
        </div>
      </div>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 md:pt-40 md:pb-32 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 relative overflow-hidden">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
                  Organize your tasks with <span className="text-violet-600 dark:text-violet-400">Planyze</span>
                </h1>

                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                  A modern task management app that helps you stay organized and productive. Create, manage, and
                  complete tasks with ease.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="px-6 py-3 bg-violet-600 dark:bg-violet-700 text-white rounded-full hover:bg-violet-700 dark:hover:bg-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-200 dark:hover:shadow-violet-900/30 hover:-translate-y-1"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3 border border-violet-600 dark:border-violet-500 text-violet-600 dark:text-violet-400 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors group flex items-center gap-2"
                  >
                    Try Demo
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="flex gap-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-300">
                    10,000+ Users
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                    4.8/5 Rating
                  </span>
                </div>
              </div>

              <div className="relative animate-fade-in">
                <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">Create tasks and organize your day</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">Track your progress and stay motivated</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">Access your tasks from any device</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">Simple and intuitive interface</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-violet-100 dark:bg-violet-900/50 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">Light and dark mode support</span>
                    </li>
                  </ul>

                  <div className="mt-8 relative">
                    <div className="h-[200px] rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 dark:from-violet-600 dark:to-indigo-800 p-4 shadow-lg perspective-card perspective-card-initial">
                      <div className="h-6 flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-white/20 rounded-full w-3/4 animate-pulse-slow"></div>
                        <div className="h-4 bg-white/20 rounded-full w-1/2"></div>
                        <div className="h-4 bg-white/20 rounded-full w-5/6"></div>
                        <div className="h-4 bg-white/20 rounded-full w-2/3"></div>
                        <div className="h-4 bg-white/20 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-violet-600/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-indigo-600/5 rounded-full blur-2xl"></div>
              </div>
            </div>

            <div className="mt-20 flex justify-center">
              <a
                href="#features"
                className="animate-bounce-light p-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronDownIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </a>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-violet-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-3xl"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why choose <span className="text-violet-600 dark:text-violet-400">Planyze</span>?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover how Planyze can transform your productivity and help you achieve more every day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <ListTodoIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
                  title: "Simple Task Management",
                  description:
                    "Create, organize, and prioritize your tasks with ease. Keep everything in order with our intuitive interface.",
                },
                {
                  icon: <CalendarIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
                  title: "Time Planning",
                  description:
                    "Schedule your tasks, set deadlines, and manage your time effectively with our intuitive calendar view.",
                },
                {
                  icon: <BellIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
                  title: "Smart Reminders",
                  description:
                    "Never miss a deadline with customizable reminders and notifications for your important tasks.",
                },
                {
                  icon: <SmartphoneIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
                  title: "Cross-Platform Access",
                  description:
                    "Access your tasks from any device with our responsive design. Your data syncs automatically across all platforms.",
                },
                {
                  icon: <PaletteIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
                  title: "Customizable Themes",
                  description:
                    "Personalize your experience with light and dark modes. Choose the theme that works best for you.",
                },
                {
                  icon: <BarChartIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
                  title: "Progress Analytics",
                  description:
                    "Track your productivity with visual analytics. See your progress and identify areas for improvement.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/50 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-20 px-4 bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950"
        >
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What our users say</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join thousands of satisfied users who have transformed their productivity with Planyze.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  initials: "JD",
                  name: "John Doe",
                  role: "Product Manager",
                  text: "Planyze has completely transformed how I manage my tasks. The interface is intuitive, and the analytics help me stay on track with my goals.",
                  bgColor: "bg-violet-100 dark:bg-violet-900",
                  textColor: "text-violet-600 dark:text-violet-400",
                },
                {
                  initials: "SJ",
                  name: "Sarah Johnson",
                  role: "Freelance Designer",
                  text: "As a freelancer, keeping track of multiple projects is essential. Planyze makes it easy to organize my tasks and meet deadlines consistently.",
                  bgColor: "bg-blue-100 dark:bg-blue-900",
                  textColor: "text-blue-600 dark:text-blue-400",
                },
                {
                  initials: "MT",
                  name: "Michael Thompson",
                  role: "Software Engineer",
                  text: "The dark mode is perfect for late-night coding sessions, and the cross-platform sync ensures I never miss a task, whether I'm at my desk or on the go.",
                  bgColor: "bg-green-100 dark:bg-green-900",
                  textColor: "text-green-600 dark:text-green-400",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center ${testimonial.textColor} font-bold`}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic">"{testimonial.text}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get organized?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Join thousands of users who have improved their productivity with Planyze.
              </p>
              <div>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 dark:bg-violet-700 text-white rounded-full hover:bg-violet-700 dark:hover:bg-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-200 dark:hover:shadow-violet-900/30 hover:-translate-y-1"
                >
                  Get Started for Free
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-slate-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ListTodoIcon className={`h-6 w-6 ${isDark ? "text-violet-400" : "text-violet-700"}`} />
                <span className={`ml-2 text-lg font-bold ${isDark ? "text-violet-400" : "text-violet-700"}`}>
                  Planyze
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                A modern task management application to help you stay organized and productive.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/login"
                    className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <TwitterIcon className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Planyze. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
