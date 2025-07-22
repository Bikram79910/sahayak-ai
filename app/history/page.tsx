"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, ImageIcon, Mic, Search, Filter, Trash2, Download, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"
import { getLibraryItems, deleteLibraryItem } from "@/lib/firestore"
import { LoadingSpinner } from "@/components/loading-states"

// Mock user data
const user = {
  name: "Priya Sharma",
  email: "priya.sharma@school.edu",
  avatar: "/placeholder.svg?height=32&width=32&text=PS",
}

const typeIcons = {
  story: BookOpen,
  worksheet: FileText,
  "visual-aid": ImageIcon,
  "reading-assessment": Mic,
}

const typeColors = {
  story: "bg-green-100 text-green-800",
  worksheet: "bg-blue-100 text-blue-800",
  "visual-aid": "bg-purple-100 text-purple-800",
  "reading-assessment": "bg-orange-100 text-orange-800",
}

export default function HistoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, filterType])

  const loadItems = async () => {
    try {
      setIsLoading(true)
      const libraryItems = await getLibraryItems()
      setItems(libraryItems)
    } catch (error) {
      toast({
        title: "Error loading history",
        description: "Failed to load your saved items.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType)
    }

    setFilteredItems(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteLibraryItem(id)
      setItems(items.filter((item) => item.id !== id))
      toast({
        title: "Item deleted",
        description: "The item has been removed from your library.",
      })
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: "Failed to delete the item.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (item: any) => {
    const blob = new Blob([item.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${item.title.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Your content is being downloaded.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation user={user} />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner message="Loading your library..." />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
            <p className="text-lg text-gray-600">Access all your saved stories, worksheets, and visual aids</p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search your library..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="story">Stories</SelectItem>
                      <SelectItem value="worksheet">Worksheets</SelectItem>
                      <SelectItem value="visual-aid">Visual Aids</SelectItem>
                      <SelectItem value="reading-assessment">Reading Assessments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterType !== "all" ? "No items found" : "Your library is empty"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start creating content to build your library"}
                </p>
                {!searchTerm && filterType === "all" && (
                  <Button onClick={() => (window.location.href = "/dashboard")}>Go to Dashboard</Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const Icon = typeIcons[item.type as keyof typeof typeIcons]
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <Badge className={typeColors[item.type as keyof typeof typeColors]}>
                            {item.type.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <CardDescription className="text-sm">
                        Created {item.createdAt.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">{item.content.substring(0, 150)}...</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownload(item)}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
