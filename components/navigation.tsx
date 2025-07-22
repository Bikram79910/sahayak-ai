"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, BookOpen, FileText, ImageIcon, Mic, Menu, User, LogOut, Settings, History, Bot } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

const languages = [
  { value: "marathi", label: "मराठी (Marathi)" },
  { value: "hindi", label: "हिंदी (Hindi)" },
  { value: "tamil", label: "தமிழ் (Tamil)" },
  { value: "telugu", label: "తెలుగు (Telugu)" },
  { value: "gujarati", label: "ગુજરાતી (Gujarati)" },
  { value: "bengali", label: "বাংলা (Bengali)" },
  { value: "kannada", label: "ಕನ್ನಡ (Kannada)" },
  { value: "malayalam", label: "മലയാളം (Malayalam)" },
]

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Sparkles,
  },
  {
    name: "AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
  },
  {
    name: "Generate Story",
    href: "/generate-story",
    icon: BookOpen,
  },
  {
    name: "Multigrade Worksheet",
    href: "/multigrade-worksheet",
    icon: FileText,
  },
  {
    name: "Visual Aid",
    href: "/visual-aid",
    icon: ImageIcon,
  },
  {
    name: "Reading Assessment",
    href: "/reading-assessment",
    icon: Mic,
  },
]

interface NavigationProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function Navigation({ user }: NavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    // In a real app, clear auth tokens and redirect
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SAHAYAK</h1>
              <p className="text-xs text-gray-600 hidden sm:block">AI Teaching Companion</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            {user && (
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32 hidden md:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="flex items-center cursor-pointer">
                      <History className="mr-2 h-4 w-4" />
                      History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/get-started">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            {user && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigationItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive(item.href) ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
