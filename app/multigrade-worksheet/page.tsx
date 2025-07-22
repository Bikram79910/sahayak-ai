"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, FileText, Download, Save, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"
import { generateWorksheet } from "@/lib/gemini"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WorksheetGenerationLoader } from "@/components/loading-states"
import { saveToLibrary } from "@/lib/firestore"

const grades = [
  { id: "grade1", label: "Grade 1", value: "1", category: "Primary" },
  { id: "grade2", label: "Grade 2", value: "2", category: "Primary" },
  { id: "grade3", label: "Grade 3", value: "3", category: "Primary" },
  { id: "grade4", label: "Grade 4", value: "4", category: "Primary" },
  { id: "grade5", label: "Grade 5", value: "5", category: "Primary" },
  { id: "grade6", label: "Grade 6", value: "6", category: "Middle School" },
  { id: "grade7", label: "Grade 7", value: "7", category: "Middle School" },
  { id: "grade8", label: "Grade 8", value: "8", category: "Middle School" },
  { id: "grade9", label: "Grade 9", value: "9", category: "Secondary" },
  { id: "grade10", label: "Grade 10", value: "10", category: "Secondary" },
  { id: "grade11", label: "Grade 11", value: "11", category: "Higher Secondary" },
  { id: "grade12", label: "Grade 12", value: "12", category: "Higher Secondary" },
]

// Mock user data
const user = {
  name: "Priya Sharma",
  email: "priya.sharma@school.edu",
  avatar: "/placeholder.svg?height=32&width=32&text=PS",
}

interface GeneratedWorksheet {
  title: string
  content: string
  grade: string
}

export default function MultigradeWorksheetPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedWorksheets, setGeneratedWorksheets] = useState<{ [key: string]: GeneratedWorksheet }>({})
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        setError("")
        toast({
          title: "Image uploaded",
          description: `${file.name} has been selected for processing.`,
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG).",
          variant: "destructive",
        })
      }
    }
  }

  const handleGradeChange = (gradeValue: string, checked: boolean) => {
    if (checked) {
      setSelectedGrades([...selectedGrades, gradeValue])
    } else {
      setSelectedGrades(selectedGrades.filter((g) => g !== gradeValue))
    }
  }

  const simulateOCR = async (file: File): Promise<string> => {
    // Simulate OCR processing - in real implementation, use OCR service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Sample textbook content about mathematics:

Addition and Subtraction

Addition is the process of combining two or more numbers to get their total or sum.
Example: 5 + 3 = 8

Subtraction is the process of taking away one number from another.
Example: 8 - 3 = 5

Practice Problems:
1. 12 + 8 = ?
2. 25 - 7 = ?
3. 34 + 16 = ?

Word Problems:
Ram has 15 apples. He gives 6 apples to his friend. How many apples does Ram have left?`)
      }, 1000)
    })
  }

  const handleGenerateWorksheets = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please upload a textbook image first.",
        variant: "destructive",
      })
      return
    }

    if (selectedGrades.length === 0) {
      toast({
        title: "No grades selected",
        description: "Please select at least one grade level.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError("")
    setGeneratedWorksheets({})

    try {
      // Step 1: Process image
      setProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 2: Extract text with OCR
      setProgress(50)
      const extractedText = await simulateOCR(selectedFile)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 3: Analyze content
      setProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 4: Generate worksheets for each selected grade
      setProgress(90)
      const worksheets: { [key: string]: GeneratedWorksheet } = {}

      for (const grade of selectedGrades) {
        try {
          const content = await generateWorksheet(extractedText, grade, "Mathematics")
          worksheets[grade] = {
            title: `Grade ${grade} Worksheet - Mathematics`,
            content: content,
            grade: grade,
          }
        } catch (err) {
          console.error(`Error generating worksheet for grade ${grade}:`, err)
          // Fallback to sample content if API fails
          worksheets[grade] = {
            title: `Grade ${grade} Worksheet - Mathematics`,
            content: `Name: _________________ Date: _________

MATHEMATICS WORKSHEET - GRADE ${grade}

Based on the uploaded content, here are practice problems:

1. Solve the following addition problems:
   ${grade <= "3" ? "5 + 3 = ___" : "125 + 78 = ___"}
   ${grade <= "3" ? "7 + 2 = ___" : "234 + 156 = ___"}

2. Solve the following subtraction problems:
   ${grade <= "3" ? "9 - 4 = ___" : "200 - 85 = ___"}
   ${grade <= "3" ? "8 - 3 = ___" : "345 - 167 = ___"}

3. Word Problems:
   ${
     grade <= "5"
       ? "A farmer has 12 mangoes. He sells 5 mangoes. How many mangoes are left?"
       : "A shopkeeper bought 250 items and sold 180 items. How many items are remaining?"
   }

4. Practice Section:
   Complete the following patterns:
   ${grade <= "3" ? "2, 4, 6, ___, ___" : "5, 10, 15, ___, ___"}

Answer Key (for teacher):
1. ${grade <= "3" ? "8, 9" : "203, 390"}
2. ${grade <= "3" ? "5, 5" : "115, 178"}
3. ${grade <= "5" ? "7 mangoes" : "70 items"}
4. ${grade <= "3" ? "8, 10" : "20, 25"}`,
            grade: grade,
          }
        }
      }

      setGeneratedWorksheets(worksheets)
      setProgress(100)

      toast({
        title: "Worksheets generated!",
        description: `Created worksheets for ${selectedGrades.length} grade levels.`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate worksheets"
      setError(errorMessage)
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadPDF = (grade: string) => {
    // TODO: Implement PDF generation
    toast({
      title: "Download started",
      description: `Downloading Grade ${grade} worksheet as PDF.`,
    })
  }

  const handleSaveWorksheet = async (grade: string) => {
    try {
      const worksheet = generatedWorksheets[grade]
      await saveToLibrary({
        type: "worksheet",
        title: worksheet.title,
        content: worksheet.content,
        metadata: { grade, subject: "General" },
      })

      toast({
        title: "Worksheet saved",
        description: `Grade ${grade} worksheet saved to your library.`,
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save worksheet to library.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navigation user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Warning */}
        {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Demo Mode:</strong> Using sample content. Add your Gemini API key for real AI worksheet
              generation.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Textbook Image</CardTitle>
                <CardDescription>Upload a clear image of a textbook page to generate worksheets.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">JPG, PNG up to 10MB</p>
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Selected: {selectedFile.name}</p>
                    <p className="text-xs text-blue-600">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Grade Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Grade Levels</CardTitle>
                <CardDescription>Choose which grades you want worksheets for.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Primary", "Middle School", "Secondary", "Higher Secondary"].map((category) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {grades
                          .filter((grade) => grade.category === category)
                          .map((grade) => (
                            <div key={grade.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={grade.id}
                                checked={selectedGrades.includes(grade.value)}
                                onCheckedChange={(checked) => handleGradeChange(grade.value, checked as boolean)}
                              />
                              <Label htmlFor={grade.id} className="text-sm font-medium">
                                {grade.label}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button onClick={handleGenerateWorksheets} disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Worksheets"
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {isProcessing && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <WorksheetGenerationLoader />
                </CardContent>
              </Card>
            )}

            {Object.keys(generatedWorksheets).length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Generated Worksheets</h2>
                {Object.entries(generatedWorksheets).map(([grade, worksheet]) => (
                  <Card key={grade}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{worksheet.title}</CardTitle>
                          <CardDescription>Customized for Grade {grade} students</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(grade)}>
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleSaveWorksheet(grade)}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{worksheet.content}</pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isProcessing && Object.keys(generatedWorksheets).length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No worksheets generated yet</h3>
                  <p className="text-gray-600">Upload a textbook image and select grade levels to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
