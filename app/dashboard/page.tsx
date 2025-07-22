"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, ImageIcon, Mic, History, Users, Bot } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

const recentHistory = [
  { id: 1, type: "story", title: "Story about Water Cycle in Marathi", date: "2 hours ago" },
  { id: 2, type: "worksheet", title: "Math Worksheets for Grade 3-5", date: "1 day ago" },
  { id: 3, type: "story", title: "Farmers and Soil Types Story", date: "2 days ago" },
]

const stats = [
  { icon: BookOpen, label: "Stories Created", value: "24", change: "+3 this week" },
  { icon: FileText, label: "Worksheets Generated", value: "18", change: "+5 this week" },
  { icon: ImageIcon, label: "Visual Aids", value: "12", change: "+2 this week" },
  { icon: Users, label: "Students Helped", value: "150", change: "+12 this month" },
]

// Mock user data
const user = {
  name: "Priya Sharma",
  email: "priya.sharma@school.edu",
  avatar: "/placeholder.svg?height=32&width=32&text=PS",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-lg text-gray-600">Ready to create amazing learning experiences for your students?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-green-600">{stat.change}</p>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* AI Assistant */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/ai-assistant">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <Bot className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AI Assistant</CardTitle>
                    <CardDescription>Chat with SAHAYAK for any teaching help</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Get instant help with lesson planning, content creation, and teaching strategies through our AI chat.
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Generate Local Story */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/generate-story">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Generate Local Story</CardTitle>
                    <CardDescription>Create culturally relevant stories and explanations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Transform any topic into engaging stories that resonate with your students' cultural background.
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Create Multigrade Worksheet */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/multigrade-worksheet">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Create Multigrade Worksheet</CardTitle>
                    <CardDescription>Upload textbook images, get instant worksheets</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Simply upload a textbook page and get customized worksheets for different grade levels.
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Visual Aid Generator */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/visual-aid">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <ImageIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Visual Aid Generator</CardTitle>
                    <CardDescription>Create images, diagrams and videos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Generate AI-powered visual aids, educational diagrams, and animated videos for better learning.
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Reading Assessment */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/reading-assessment">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Mic className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Reading Assessment</CardTitle>
                    <CardDescription>Multi-language reading evaluation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Record student reading sessions and get detailed analysis with feedback in 9 languages.
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent History Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${item.type === "story" ? "bg-green-100" : "bg-blue-100"}`}>
                      {item.type === "story" ? (
                        <BookOpen className={`h-4 w-4 ${item.type === "story" ? "text-green-600" : "text-blue-600"}`} />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
