// Mock Firestore implementation - replace with actual Firebase when ready
interface SavedItem {
  id: string
  type: "story" | "worksheet" | "visual-aid" | "reading-assessment"
  title: string
  content: string
  metadata: Record<string, any>
  createdAt: Date
  userId: string
}

// Mock storage - in production, use Firebase Firestore
let mockStorage: SavedItem[] = [
  {
    id: "1",
    type: "story",
    title: "Water Cycle Story in Hindi",
    content: "एक छोटे से गांव में...",
    metadata: { language: "hindi", topic: "water cycle" },
    createdAt: new Date(Date.now() - 86400000 * 2),
    userId: "user1",
  },
  {
    id: "2",
    type: "worksheet",
    title: "Grade 4 Mathematics Worksheet",
    content: "Name: _______ Date: _______\n\nMATHEMATICS WORKSHEET...",
    metadata: { grade: "4", subject: "mathematics" },
    createdAt: new Date(Date.now() - 86400000),
    userId: "user1",
  },
  {
    id: "3",
    type: "visual-aid",
    title: "Solar System Diagram",
    content: "Educational diagram showing planets...",
    metadata: { topic: "solar system", visualType: "diagram" },
    createdAt: new Date(Date.now() - 86400000 * 3),
    userId: "user1",
  },
]

export async function saveToLibrary(item: Omit<SavedItem, "id" | "createdAt" | "userId">): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newItem: SavedItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date(),
    userId: "user1", // In production, get from auth
  }

  mockStorage.push(newItem)
  return newItem.id
}

export async function getLibraryItems(userId = "user1"): Promise<SavedItem[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mockStorage
    .filter((item) => item.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function deleteLibraryItem(id: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  mockStorage = mockStorage.filter((item) => item.id !== id)
}

export async function getLibraryItem(id: string): Promise<SavedItem | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return mockStorage.find((item) => item.id === id) || null
}
