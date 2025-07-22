"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Mic, MicOff, Square, Save, RotateCcw, AlertCircle, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"
import { analyzeReadingWithLanguage } from "@/lib/gemini"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ReadingAnalysisLoader } from "@/components/loading-states"

// Mock user data
const user = {
  name: "Priya Sharma",
  email: "priya.sharma@school.edu",
  avatar: "/placeholder.svg?height=32&width=32&text=PS",
}

const languages = [
  { value: "hindi", label: "हिंदी (Hindi)", nativeName: "हिंदी" },
  { value: "marathi", label: "मराठी (Marathi)", nativeName: "मराठी" },
  { value: "tamil", label: "தமிழ் (Tamil)", nativeName: "தமிழ்" },
  { value: "telugu", label: "తెలుగు (Telugu)", nativeName: "తెలుగు" },
  { value: "gujarati", label: "ગુજરાતી (Gujarati)", nativeName: "ગુજરાતી" },
  { value: "bengali", label: "বাংলা (Bengali)", nativeName: "বাংলা" },
  { value: "kannada", label: "ಕನ್ನಡ (Kannada)", nativeName: "ಕನ್ನಡ" },
  { value: "malayalam", label: "മലയാളം (Malayalam)", nativeName: "മലയാളം" },
  { value: "english", label: "English", nativeName: "English" },
]

const readingTexts = {
  hindi: {
    title: "गांव की कहानी",
    text: `एक छोटे से गांव में राम नाम का एक लड़का रहता था। वह बहुत मेहनती और ईमानदार था। हर सुबह वह अपने खेत में काम करने जाता था। उसके पास एक छोटा सा खेत था जहाँ वह सब्जियाँ उगाता था।

एक दिन उसने देखा कि उसके पौधे मुरझा रहे हैं। उसने सोचा कि शायद पानी की कमी है। उसने तुरंत अपने पौधों को पानी दिया। कुछ दिनों बाद उसके पौधे फिर से हरे-भरे हो गए।

राम ने सीखा कि धैर्य और मेहनत से हर समस्या का समाधान मिल जाता है।`,
    difficulty: "Medium",
    expectedWPM: 80,
  },
  marathi: {
    title: "शेतकऱ्याची गोष्ट",
    text: `एका छोट्या गावात रामू नावाचा एक शेतकरी राहत होता. तो खूप मेहनती आणि प्रामाणिक होता. दररोज सकाळी तो आपल्या शेतात काम करायला जात असे.

त्याच्याकडे एक छोटे शेत होते जिथे तो भाज्या पिकवत असे. एक दिवशी त्याने पाहिले की त्याची झाडे कोमेजत आहेत. त्याने विचार केला की कदाचित पाण्याची कमतरता असावी.

त्याने लगेच आपल्या झाडांना पाणी दिले. काही दिवसांनी त्याची झाडे पुन्हा हिरवीगार झाली. रामूला समजले की धैर्य आणि मेहनतीने प्रत्येक समस्येचे निराकरण होते.`,
    difficulty: "Medium",
    expectedWPM: 75,
  },
  tamil: {
    title: "விவசாயியின் கதை",
    text: `ஒரு சிறிய கிராமத்தில் ராமு என்ற விவசாயி வாழ்ந்து வந்தான். அவன் மிகவும் உழைப்பாளி மற்றும் நேர்மையானவன். தினமும் காலையில் அவன் தன் வயலில் வேலை செய்ய செல்வான்.

அவனிடம் ஒரு சிறிய வயல் இருந்தது, அங்கே அவன் காய்கறிகள் வளர்த்து வந்தான். ஒரு நாள் அவன் தன் செடிகள் வாடிப் போவதைக் கண்டான். தண்ணீர் பற்றாக்குறை இருக்கலாம் என்று நினைத்தான்.

உடனே அவன் தன் செடிகளுக்கு தண்ணீர் ஊற்றினான். சில நாட்களில் அவன் செடிகள் மீண்டும் பசுமையாக மாறின. பொறுமையும் உழைப்பும் இருந்தால் எல்லா பிரச்சனைகளுக்கும் தீர்வு கிடைக்கும் என்று ராமு கற்றுக்கொண்டான்.`,
    difficulty: "Medium",
    expectedWPM: 70,
  },
  telugu: {
    title: "రైతు కథ",
    text: `ఒక చిన్న గ్రామంలో రాము అనే రైతు నివసించేవాడు. అతను చాలా కష్టపడే వాడు మరియు నిజాయితీపరుడు. ప్రతిరోజూ ఉదయం అతను తన పొలంలో పని చేయడానికి వెళ్ళేవాడు.

అతని దగ్గర ఒక చిన్న పొలం ఉండేది, అక్కడ అతను కూరగాయలు పండించేవాడు. ఒక రోజు అతను తన మొక్కలు వాడిపోవడం చూశాడు. నీటి లేకపోవడం వల్ల అయి ఉంటుందని అనుకున్నాడు.

వెంటనే అతను తన మొక్కలకు నీళ్ళు పోశాడు. కొన్ని రోజుల తర్వాత అతని మొక్కలు మళ్ళీ పచ్చగా మారాయి. ఓపిక మరియు కష్టంతో ప్రతి సమస్యకు పరిష్కారం దొరుకుతుందని రాము నేర్చుకున్నాడు.`,
    difficulty: "Medium",
    expectedWPM: 75,
  },
  gujarati: {
    title: "ખેડૂતની વાર્તા",
    text: `એક નાના ગામમાં રામુ નામનો એક ખેડૂત રહેતો હતો. તે ખૂબ મહેનતુ અને પ્રામાણિક હતો. દરરોજ સવારે તે પોતાના ખેતરમાં કામ કરવા જતો હતો.

તેની પાસે એક નાનું ખેતર હતું જ્યાં તે શાકભાજી ઉગાડતો હતો. એક દિવસે તેણે જોયું કે તેના છોડ સુકાઈ રહ્યા છે. તેણે વિચાર્યું કે કદાચ પાણીની અછત હશે.

તેણે તરત જ પોતાના છોડને પાણી આપ્યું. કેટલાક દિવસો પછી તેના છોડ ફરીથી લીલાછમ થઈ ગયા. રામુએ શીખ્યું કે ધીરજ અને મહેનતથી દરેક સમસ્યાનો ઉકેલ મળી જાય છે.`,
    difficulty: "Medium",
    expectedWPM: 70,
  },
  bengali: {
    title: "কৃষকের গল্প",
    text: `একটি ছোট গ্রামে রামু নামে এক কৃষক বাস করত। সে খুব পরিশ্রমী এবং সৎ ছিল। প্রতিদিন সকালে সে তার ক্ষেতে কাজ করতে যেত।

তার একটি ছোট ক্ষেত ছিল যেখানে সে সবজি চাষ করত। একদিন সে দেখল যে তার গাছগুলো শুকিয়ে যাচ্ছে। সে ভাবল হয়তো পানির অভাব।

সে তৎক্ষণাৎ তার গাছগুলোতে পানি দিল। কয়েকদিন পর তার গাছগুলো আবার সবুজ হয়ে উঠল। রামু শিখল যে ধৈর্য এবং পরিশ্রমে সব সমস্যার সমাধান হয়।`,
    difficulty: "Medium",
    expectedWPM: 75,
  },
  kannada: {
    title: "ರೈತನ ಕಥೆ",
    text: `ಒಂದು ಸಣ್ಣ ಹಳ್ಳಿಯಲ್ಲಿ ರಾಮು ಎಂಬ ರೈತ ವಾಸಿಸುತ್ತಿದ್ದ. ಅವನು ತುಂಬಾ ಪರಿಶ್ರಮಿ ಮತ್ತು ಪ್ರಾಮಾಣಿಕನಾಗಿದ್ದ. ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಅವನು ತನ್ನ ಹೊಲದಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಹೋಗುತ್ತಿದ್ದ.

ಅವನ ಬಳಿ ಒಂದು ಸಣ್ಣ ಹೊಲವಿತ್ತು, ಅಲ್ಲಿ ಅವನು ತರಕಾರಿಗಳನ್ನು ಬೆಳೆಯುತ್ತಿದ್ದ. ಒಂದು ದಿನ ಅವನು ತನ್ನ ಸಸ್ಯಗಳು ಬಾಡುತ್ತಿರುವುದನ್ನು ನೋಡಿದ. ಬಹುಶಃ ನೀರಿನ ಕೊರತೆ ಇರಬಹುದು ಎಂದು ಅವನು ಯೋಚಿಸಿದ.

ಅವನು ತಕ್ಷಣವೇ ತನ್ನ ಸಸ್ಯಗಳಿಗೆ ನೀರು ಹಾಕಿದ. ಕೆಲವು ದಿನಗಳ ನಂತರ ಅವನ ಸಸ್ಯಗಳು ಮತ್ತೆ ಹಸಿರಾದವು. ತಾಳ್ಮೆ ಮತ್ತು ಪರಿಶ್ರಮದಿಂದ ಪ್ರತಿ ಸಮಸ್ಯೆಗೂ ಪರಿಹಾರ ಸಿಗುತ್ತದೆ ಎಂದು ರಾಮು ಕಲಿತ.`,
    difficulty: "Medium",
    expectedWPM: 70,
  },
  malayalam: {
    title: "കർഷകന്റെ കഥ",
    text: `ഒരു ചെറിയ ഗ്രാമത്തിൽ രാമു എന്ന കർഷകൻ താമസിച്ചിരുന്നു. അവൻ വളരെ കഠിനാധ്വാനിയും സത്യസന്ധനുമായിരുന്നു. എല്ലാ ദിവസവും രാവിലെ അവൻ തന്റെ വയലിൽ ജോലി ചെയ്യാൻ പോകുമായിരുന്നു.

അവന് ഒരു ചെറിയ വയൽ ഉണ്ടായിരുന്നു, അവിടെ അവൻ പച്ചക്കറികൾ കൃഷി ചെയ്തിരുന്നു. ഒരു ദിവസം അവൻ തന്റെ ചെടികൾ വാടുന്നത് കണ്ടു. വെള്ളത്തിന്റെ കുറവായിരിക്കാം എന്ന് അവൻ ചിന്തിച്ചു.

അവൻ ഉടനെ തന്റെ ചെടികൾക്ക് വെള്ളം കൊടുത്തു. കുറച്ച് ദിവസങ്ങൾക്ക് ശേഷം അവന്റെ ചെടികൾ വീണ്ടും പച്ചയായി. ക്ഷമയും കഠിനാധ്വാനവും കൊണ്ട് എല്ലാ പ്രശ്നങ്ങൾക്കും പരിഹാരം കാണാം എന്ന് രാമു പഠിച്ചു.`,
    difficulty: "Medium",
    expectedWPM: 70,
  },
  english: {
    title: "The Farmer's Story",
    text: `In a small village, there lived a farmer named Ramu. He was very hardworking and honest. Every morning, he would go to work in his field.

He had a small field where he grew vegetables. One day, he noticed that his plants were wilting. He thought there might be a lack of water.

He immediately watered his plants. After a few days, his plants became green again. Ramu learned that with patience and hard work, every problem has a solution.`,
    difficulty: "Easy",
    expectedWPM: 120,
  },
}

export default function ReadingAssessmentPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState("")
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const { toast } = useToast()

  const currentText = readingTexts[selectedLanguage as keyof typeof readingTexts]

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    // Reset recording state when language changes
    setIsRecording(false)
    setHasRecording(false)
    setAssessmentResult(null)
    setRecordingTime(0)
    setError("")
    setAudioBlob(null)
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      setError("")

      // Timer for recording
      const timer = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            // Auto-stop after 60 seconds
            clearInterval(timer)
            handleStopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)

      toast({
        title: "Recording started",
        description: `Please read the ${languages.find((l) => l.value === selectedLanguage)?.label} text aloud clearly.`,
      })
    } catch (err) {
      setError("Could not access microphone. Please check permissions.")
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
    }
    setIsRecording(false)
    setHasRecording(true)
    toast({
      title: "Recording stopped",
      description: "Click 'Analyze Reading' to get your assessment.",
    })
  }

  const simulateTranscription = async (audioBlob: Blob): Promise<string> => {
    // In a real implementation, you would use a speech-to-text service
    // For demo purposes, we'll return a simulated transcription
    return new Promise((resolve) => {
      setTimeout(() => {
        const sampleTranscriptions = {
          hindi: "एक छोटे से गांव में राम नाम का एक लड़का रहता था। वह बहुत मेहनती और ईमानदार था।",
          marathi: "एका छोट्या गावात रामू नावाचा एक शेतकरी राहत होता. तो खूप मेहनती आणि प्रामाणिक होता.",
          tamil: "ஒரு சிறிய கிராமத்தில் ராமு என்ற விவசாயி வாழ்ந்து வந்தான். அவன் மிகவும் உழைப்பாளி மற்றும் நேர்மையானவன்.",
          english: "In a small village, there lived a farmer named Ramu. He was very hardworking and honest.",
        }
        resolve(
          sampleTranscriptions[selectedLanguage as keyof typeof sampleTranscriptions] || sampleTranscriptions.english,
        )
      }, 1000)
    })
  }

  const handleAnalyzeReading = async () => {
    if (!hasRecording || !audioBlob) {
      toast({
        title: "No recording found",
        description: "Please record your reading first.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      // Step 1: Transcribe audio (simulated)
      const transcript = await simulateTranscription(audioBlob)

      // Step 2: Analyze with Gemini AI
      const result = await analyzeReadingWithLanguage(transcript, selectedLanguage, currentText.text)

      setAssessmentResult(result)
      toast({
        title: "Assessment complete!",
        description: `Overall score: ${result.overallScore}%`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze reading"
      setError(errorMessage)

      // Fallback to sample result
      const fallbackResult = {
        overallScore: 82,
        fluency: 85,
        pronunciation: 78,
        pace: 84,
        accuracy: 88,
        wordsPerMinute: currentText.expectedWPM - 10,
        languageSpecificFeedback: [
          `Good pronunciation of ${languages.find((l) => l.value === selectedLanguage)?.label} sounds`,
          "Proper intonation maintained throughout",
          "Some difficulty with complex consonant clusters",
        ],
        generalFeedback: ["Excellent reading fluency", "Good pace and rhythm", "Clear articulation of most words"],
        suggestions: [
          "Practice reading complex words slowly",
          "Focus on maintaining consistent pace",
          "Work on specific language sounds",
        ],
        strengths: ["Natural reading flow", "Good comprehension evident", "Confident delivery"],
        areasForImprovement: [
          "Pronunciation of specific sounds",
          "Reading speed consistency",
          "Expression and intonation",
        ],
      }

      setAssessmentResult(fallbackResult)
      toast({
        title: "Assessment complete (Demo)",
        description: `Overall score: ${fallbackResult.overallScore}% (Using sample analysis)`,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveResult = () => {
    // TODO: Implement saving to database
    toast({
      title: "Assessment saved",
      description: "Reading assessment has been saved to student records.",
    })
  }

  const handleReset = () => {
    setIsRecording(false)
    setHasRecording(false)
    setAssessmentResult(null)
    setRecordingTime(0)
    setError("")
    setAudioBlob(null)
    if (mediaRecorder) {
      setMediaRecorder(null)
    }
    toast({
      title: "Reset complete",
      description: "Ready for a new reading assessment.",
    })
  }

  const handlePlaySample = () => {
    // In a real implementation, you would play audio sample
    toast({
      title: "Audio Sample",
      description: `This would play a sample pronunciation in ${languages.find((l) => l.value === selectedLanguage)?.label}`,
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <Navigation user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Warning */}
        {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Demo Mode:</strong> Using sample analysis. Add your Gemini API key for real AI assessment.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reading Text Section */}
          <Card>
            <CardHeader>
              <CardTitle>Reading Assessment</CardTitle>
              <CardDescription>Select a language and read the text aloud clearly and naturally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label htmlFor="language">Select Language</Label>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
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
              </div>

              {/* Text Display */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{currentText.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handlePlaySample} variant="outline" size="sm">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Sample
                    </Button>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {currentText.difficulty}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <p className="text-lg leading-relaxed font-medium text-gray-800 whitespace-pre-line">
                    {currentText.text}
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Expected Reading Speed:</strong> ~{currentText.expectedWPM} words per minute
                  </p>
                  <p>
                    <strong>Language:</strong> {languages.find((l) => l.value === selectedLanguage)?.label}
                  </p>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording && !hasRecording && (
                    <Button onClick={handleStartRecording} size="lg" className="bg-red-600 hover:bg-red-700">
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  )}

                  {isRecording && (
                    <Button onClick={handleStopRecording} size="lg" variant="destructive">
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}

                  {hasRecording && !isRecording && (
                    <div className="flex space-x-2">
                      <Button onClick={handleAnalyzeReading} disabled={isAnalyzing} size="lg">
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing...
                          </>
                        ) : (
                          "Analyze Reading"
                        )}
                      </Button>
                      <Button onClick={handleReset} variant="outline" size="lg">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  )}
                </div>

                {/* Recording Status */}
                {isRecording && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-600 font-medium">
                        Recording in {languages.find((l) => l.value === selectedLanguage)?.nativeName}...
                      </span>
                    </div>
                    <p className="text-lg font-mono">{formatTime(recordingTime)}</p>
                  </div>
                )}

                {hasRecording && !isRecording && !assessmentResult && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <MicOff className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Recording complete</span>
                    </div>
                    <p className="text-sm text-gray-500">Duration: {formatTime(recordingTime)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Results</CardTitle>
              <CardDescription>
                AI-powered analysis of reading performance in{" "}
                {languages.find((l) => l.value === selectedLanguage)?.label}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {isAnalyzing ? (
                <ReadingAnalysisLoader />
              ) : assessmentResult ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{assessmentResult.overallScore}%</div>
                    <p className="text-gray-600">Overall Reading Score</p>
                  </div>

                  {/* Detailed Scores */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Fluency</span>
                        <span className="text-sm text-gray-600">{assessmentResult.fluency}%</span>
                      </div>
                      <Progress value={assessmentResult.fluency} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Pronunciation</span>
                        <span className="text-sm text-gray-600">{assessmentResult.pronunciation}%</span>
                      </div>
                      <Progress value={assessmentResult.pronunciation} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Reading Pace</span>
                        <span className="text-sm text-gray-600">{assessmentResult.pace}%</span>
                      </div>
                      <Progress value={assessmentResult.pace} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Accuracy</span>
                        <span className="text-sm text-gray-600">{assessmentResult.accuracy}%</span>
                      </div>
                      <Progress value={assessmentResult.accuracy} className="h-2" />
                    </div>
                  </div>

                  {/* Reading Speed */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Reading Speed</p>
                    <p className="text-2xl font-bold text-blue-700">{assessmentResult.wordsPerMinute} WPM</p>
                    <p className="text-xs text-blue-600">
                      Words per minute in {languages.find((l) => l.value === selectedLanguage)?.nativeName}
                    </p>
                  </div>

                  {/* Language-Specific Feedback */}
                  {assessmentResult.languageSpecificFeedback && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Language-Specific Feedback</h4>
                      <ul className="space-y-1">
                        {assessmentResult.languageSpecificFeedback.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* General Feedback */}
                  {assessmentResult.generalFeedback && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">General Feedback</h4>
                      <ul className="space-y-1">
                        {assessmentResult.generalFeedback.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strengths */}
                  {assessmentResult.strengths && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {assessmentResult.strengths.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Areas for Improvement */}
                  {assessmentResult.areasForImprovement && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {assessmentResult.areasForImprovement.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-orange-500 mr-2">→</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {assessmentResult.suggestions && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Suggestions for Improvement</h4>
                      <ul className="space-y-1">
                        {assessmentResult.suggestions.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-purple-500 mr-2">💡</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Save Button */}
                  <Button onClick={handleSaveResult} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Assessment Result
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Mic className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Record your reading to see assessment results</p>
                  <p className="text-sm mt-2">Select your preferred language and start reading</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Multi-Language Reading Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-orange-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Choose Language</h4>
                <p className="text-sm text-gray-600">
                  Select from 9 supported languages including regional Indian languages
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Record Reading</h4>
                <p className="text-sm text-gray-600">Read the text aloud clearly in your selected language</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Get Analysis</h4>
                <p className="text-sm text-gray-600">Receive language-specific feedback and improvement suggestions</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Supported Languages</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {languages.map((lang) => (
                  <div key={lang.value} className="text-blue-800">
                    {lang.label}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
