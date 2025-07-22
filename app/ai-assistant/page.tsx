"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, AlertCircle, Sparkles, Copy, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"
import { generateGeneralResponse } from "@/lib/gemini"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock user data
const user = {
  name: "Priya Sharma",
  email: "priya.sharma@school.edu",
  avatar: "/placeholder.svg?height=32&width=32&text=PS",
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickPrompts = [
  "Create a lesson plan for teaching fractions to Grade 4 students",
  "Explain photosynthesis in simple terms for primary school children",
  "Generate questions for a science quiz on the solar system",
  "Help me create a story about friendship for moral education",
  "Suggest activities for teaching English grammar to Grade 6",
  "Create a worksheet on Indian history for Grade 8 students",
  "Explain the water cycle with examples from Indian geography",
  "Help me plan a mathematics activity for teaching multiplication",
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: `Hello! I'm SAHAYAK, your AI Teaching Companion. I'm here to help you with:

• Creating lesson plans and educational content
• Generating worksheets and assignments  
• Explaining complex topics in simple terms
• Suggesting teaching activities and methods
• Answering questions about curriculum and pedagogy
• Providing educational resources and ideas

How can I assist you with your teaching today?`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      toast({
        title: "Please enter a message",
        description: "Type your question or request to get started.",
        variant: "destructive",
      })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setError("")

    try {
      const response = await generateGeneralResponse(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      toast({
        title: "Response generated!",
        description: "SAHAYAK has provided a helpful response.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate response"
      setError(errorMessage)

      // Add error message to chat
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I apologize, but I encountered an error while processing your request. Please try again or rephrase your question.

Error: ${errorMessage}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorResponse])

      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    })
  }

  const handleSaveConversation = () => {
    const conversation = messages
      .map((msg) => `${msg.type === "user" ? "You" : "SAHAYAK"}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([conversation], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sahayak-conversation-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Conversation saved",
      description: "Your conversation has been downloaded as a text file.",
    })
  }

  const clearConversation = () => {
    setMessages([
      {
        id: "1",
        type: "assistant",
        content: `Hello! I'm SAHAYAK, your AI Teaching Companion. How can I assist you with your teaching today?`,
        timestamp: new Date(),
      },
    ])
    toast({
      title: "Conversation cleared",
      description: "Chat history has been reset.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Navigation user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Warning */}
        {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Demo Mode:</strong> Add your Gemini API key for full AI assistant functionality.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Quick Prompts Sidebar */}
          <Card className="xl:col-span-1 order-2 xl:order-1">
            <CardHeader>
              <CardTitle className="text-lg">Quick Prompts</CardTitle>
              <CardDescription className="text-sm">Click to use these common requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full text-left justify-start h-auto p-3 text-xs leading-tight"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <Button onClick={handleSaveConversation} variant="outline" size="sm" className="w-full bg-transparent">
                  <Save className="h-4 w-4 mr-2" />
                  Save Chat
                </Button>
                <Button onClick={clearConversation} variant="outline" size="sm" className="w-full bg-transparent">
                  Clear History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Chat Interface */}
          <Card className="xl:col-span-4 order-1 xl:order-2">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>SAHAYAK AI Assistant</CardTitle>
                  <CardDescription>Your comprehensive AI teaching companion</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <ScrollArea className="h-[500px] w-full border rounded-lg p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.type === "user" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === "assistant" && (
                            <Bot className="h-5 w-5 mt-0.5 text-indigo-600 flex-shrink-0" />
                          )}
                          {message.type === "user" && <User className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed break-words">
                              {message.content}
                            </pre>
                            <div className="flex items-center justify-between mt-2">
                              <span
                                className={`text-xs ${message.type === "user" ? "text-indigo-200" : "text-gray-500"}`}
                              >
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {message.type === "assistant" && (
                                <Button
                                  onClick={() => handleCopyMessage(message.content)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 flex-shrink-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                          <div className="flex items-center space-x-1">
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                            <span className="text-sm text-gray-600">SAHAYAK is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask me anything about teaching, lesson planning, educational content, or any other topic..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="lg"
                    className="px-6 flex-shrink-0"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line. SAHAYAK can help with lesson planning, educational
                  content, and teaching strategies.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">What SAHAYAK Can Help You With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📚 Lesson Planning</h4>
                <p className="text-sm text-blue-700">Create detailed lesson plans for any subject and grade level</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">📝 Content Creation</h4>
                <p className="text-sm text-green-700">Generate worksheets, assignments, and educational materials</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">🎯 Teaching Strategies</h4>
                <p className="text-sm text-purple-700">Get suggestions for effective teaching methods and activities</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">❓ Q&A Support</h4>
                <p className="text-sm text-orange-700">Ask any educational question and get detailed explanations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
