"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Copy, Save, Loader2, BookOpen, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"
import { generateStory } from "@/lib/gemini"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StoryGenerationLoader } from "@/components/loading-states"

const languages = [
  { value: "marathi", label: "मराठी (Marathi)", nativeName: "मराठी" },
  { value: "hindi", label: "हिंदी (Hindi)", nativeName: "हिंदी" },
  { value: "tamil", label: "தமிழ் (Tamil)", nativeName: "தமிழ்" },
  { value: "telugu", label: "తెలుగు (Telugu)", nativeName: "తెలుగు" },
  { value: "gujarati", label: "ગુજરાતી (Gujarati)", nativeName: "ગુજરાતી" },
  { value: "bengali", label: "বাংলা (Bengali)", nativeName: "বাংলা" },
  { value: "kannada", label: "ಕನ್ನಡ (Kannada)", nativeName: "ಕನ್ನಡ" },
  { value: "malayalam", label: "മലയാളം (Malayalam)", nativeName: "മലയാളം" },
]

// Mock user data
const user = {
  name: "Priya Sharma",
  email: "priya.sharma@school.edu",
  avatar: "/placeholder.svg?height=32&width=32&text=PS",
}

export default function GenerateStoryPage() {
  const [prompt, setPrompt] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")
  const [generatedStory, setGeneratedStory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleGenerateStory = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a topic or question to generate a story.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError("")
    setGeneratedStory("")

    try {
      const selectedLang = languages.find((lang) => lang.value === selectedLanguage)
      const story = await generateStory(prompt, selectedLang?.nativeName || "Hindi")

      setGeneratedStory(story)
      toast({
        title: "Story generated successfully!",
        description: `Your story has been created in ${selectedLang?.label}.`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate story"
      setError(errorMessage)
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyStory = () => {
    navigator.clipboard.writeText(generatedStory)
    toast({
      title: "Copied to clipboard",
      description: "The story has been copied to your clipboard.",
    })
  }

  const handleSaveStory = () => {
    // TODO: Implement actual saving to database
    toast({
      title: "Story saved",
      description: "The story has been saved to your history.",
    })
  }

  const selectedLangLabel = languages.find((lang) => lang.value === selectedLanguage)?.label || "Hindi"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Warning */}
        {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Demo Mode:</strong> To use real AI generation, add your Gemini API key to environment variables.
              Get your free API key from{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-orange-900"
              >
                Google AI Studio
              </a>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Story</CardTitle>
              <CardDescription>
                Enter a topic or question and we'll generate a culturally relevant story in your selected language.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Select Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Selected: {selectedLangLabel}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Enter your topic or question</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Create a story about farmers to explain soil types"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button onClick={handleGenerateStory} disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Story...
                  </>
                ) : (
                  "Generate Story"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Story</CardTitle>
              <CardDescription>Your AI-generated story will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <StoryGenerationLoader />
              ) : generatedStory ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-medium text-gray-800 leading-relaxed">
                      {generatedStory}
                    </pre>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCopyStory} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={handleSaveStory} variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save to History
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Your generated story will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Example Prompts */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Example Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => setPrompt("Create a story about farmers to explain different types of soil")}
              >
                <p className="text-sm font-medium text-green-800">Soil Types Story</p>
                <p className="text-xs text-green-600">
                  Create a story about farmers to explain different types of soil
                </p>
              </div>
              <div
                className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => setPrompt("Explain the water cycle through a story about a village")}
              >
                <p className="text-sm font-medium text-blue-800">Water Cycle Story</p>
                <p className="text-xs text-blue-600">Explain the water cycle through a story about a village</p>
              </div>
              <div
                className="p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => setPrompt("Create a story about local festivals to teach about seasons")}
              >
                <p className="text-sm font-medium text-purple-800">Seasons & Festivals</p>
                <p className="text-xs text-purple-600">Create a story about local festivals to teach about seasons</p>
              </div>
              <div
                className="p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                onClick={() => setPrompt("Tell a story about local animals to explain food chains")}
              >
                <p className="text-sm font-medium text-orange-800">Food Chain Story</p>
                <p className="text-xs text-orange-600">Tell a story about local animals to explain food chains</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
