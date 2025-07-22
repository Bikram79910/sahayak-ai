"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ImageIcon,
  Download,
  Save,
  Loader2,
  AlertCircle,
  Wand2,
  Video,
  ImageIcon as ImageIconLucide,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"
import { generateImagePrompt } from "@/lib/gemini"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VisualAidGenerationLoader } from "@/components/loading-states"
import { saveToLibrary } from "@/lib/firestore"

// Mock user data
const user = {
  name: "Priya Sharma",
  email: "priya.sharma@school.edu",
  avatar: "/placeholder.svg?height=32&width=32&text=PS",
}

const visualTypes = [
  { value: "diagram", label: "Educational Diagram", icon: "📊" },
  { value: "flowchart", label: "Process Flowchart", icon: "🔄" },
  { value: "infographic", label: "Infographic", icon: "📈" },
  { value: "illustration", label: "Concept Illustration", icon: "🎨" },
  { value: "map", label: "Mind Map", icon: "🗺️" },
  { value: "timeline", label: "Timeline", icon: "⏰" },
]

export default function VisualAidPage() {
  const [topic, setTopic] = useState("")
  const [visualType, setVisualType] = useState("diagram")
  const [generatedImage, setGeneratedImage] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const generatePlaceholderImage = (prompt: string, type: string): string => {
    // Create a more specific placeholder based on the topic and type
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 50))
    const typeEmoji = visualTypes.find((v) => v.value === type)?.icon || "📊"
    return `/placeholder.svg?height=400&width=600&text=${typeEmoji}+${encodedPrompt}`
  }

  const handleGenerateVisualAid = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a topic to generate a visual aid.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setError("")
    setGeneratedImage("")
    setImagePrompt("")

    try {
      // Step 1: Generate optimized image prompt
      const prompt = await generateImagePrompt(`${topic} - ${visualType}`)
      setImagePrompt(prompt)

      // Step 2: Generate placeholder image (in real implementation, use DALL-E, Midjourney, or Stable Diffusion)
      const imageUrl = generatePlaceholderImage(topic, visualType)

      // Simulate image generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setGeneratedImage(imageUrl)

      toast({
        title: "Visual aid generated!",
        description: "Your educational visual has been created successfully.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate visual aid"
      setError(errorMessage)
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadImage = () => {
    if (generatedImage) {
      // In real implementation, download the actual image
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = `visual-aid-${topic.replace(/\s+/g, "-").toLowerCase()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download started",
        description: "Visual aid image is being downloaded.",
      })
    }
  }

  const handleSaveVisualAid = async () => {
    try {
      await saveToLibrary({
        type: "visual-aid",
        title: `Visual Aid: ${topic}`,
        content: imagePrompt || `Visual aid for ${topic}`,
        metadata: { topic, visualType, imageUrl: generatedImage },
      })

      toast({
        title: "Visual aid saved",
        description: "The visual aid has been saved to your library.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save visual aid to library.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateVideo = () => {
    // TODO: Implement video generation
    toast({
      title: "Video Generation",
      description: "Video generation feature coming soon! This will create animated explanations.",
    })
  }

  const exampleTopics = [
    "Water Cycle Process",
    "Solar System Planets",
    "Plant Photosynthesis",
    "Human Digestive System",
    "Food Chain Ecosystem",
    "Weather Formation",
    "Rock Cycle Stages",
    "Mathematical Fractions",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Navigation user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Warning */}
        {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Demo Mode:</strong> Using placeholder images. Add your Gemini API key and image generation service
              for real visual aids.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Create Visual Aid</CardTitle>
              <CardDescription>
                Generate educational images, diagrams, and videos to enhance your teaching.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Enter topic for visual aid</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Water Cycle, Solar System, Plant Parts"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visualType">Visual Type</Label>
                <Select value={visualType} onValueChange={setVisualType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visual type" />
                  </SelectTrigger>
                  <SelectContent>
                    {visualTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleGenerateVisualAid} disabled={isGenerating} className="flex-1" size="lg">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIconLucide className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>

                <Button onClick={handleGenerateVideo} variant="outline" size="lg">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
              </div>

              {/* Example Topics */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Examples:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {exampleTopics.map((example) => (
                    <Button
                      key={example}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopic(example)}
                      className="text-xs justify-start"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Image Prompt Display */}
              {imagePrompt && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Generated Image Prompt:</Label>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">{imagePrompt}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Visual Aid</CardTitle>
              <CardDescription>Your AI-generated educational visual will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {isGenerating ? (
                <VisualAidGenerationLoader />
              ) : generatedImage ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt={`Visual aid for ${topic}`}
                      className="w-full h-auto rounded-lg shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=400&width=600&text=Visual+Aid+${topic}`
                      }}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleDownloadImage} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button onClick={handleSaveVisualAid} variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save to History
                    </Button>
                    <Button onClick={handleGenerateVideo} variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Create Video
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <p>
                      <strong>Topic:</strong> {topic}
                    </p>
                    <p>
                      <strong>Type:</strong> {visualTypes.find((v) => v.value === visualType)?.label}
                    </p>
                    <p>
                      <strong>Format:</strong> Educational diagram optimized for classroom use
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Your generated visual aid will appear here</p>
                  <p className="text-sm mt-2">Select a topic and visual type to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Visual Aid Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ImageIconLucide className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">AI-Generated Images</h4>
                <p className="text-sm text-gray-600">
                  Create custom educational diagrams, illustrations, and infographics using AI
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Video className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Animated Videos</h4>
                <p className="text-sm text-gray-600">
                  Generate animated explanations and process videos for complex concepts
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Wand2 className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Multiple Formats</h4>
                <p className="text-sm text-gray-600">
                  Choose from diagrams, flowcharts, infographics, timelines, and more
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">🚀 Coming Soon</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Integration with DALL-E 3 and Stable Diffusion for high-quality image generation</li>
                <li>• Animated video creation with voice narration</li>
                <li>• Interactive diagrams with clickable elements</li>
                <li>• 3D models and AR visualization support</li>
                <li>• Collaborative editing and sharing features</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
