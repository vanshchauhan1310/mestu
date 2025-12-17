"use client"

import type React from "react"

import { useState } from "react"
import ThreadDetail from "./thread-detail"

interface CommunityProps {
  user: any
}

const SAMPLE_THREADS = [
  {
    id: 1,
    title: "Tips for managing PCOS symptoms",
    content:
      "I found that regular exercise and dietary changes really helped me manage my PCOS symptoms. I started doing low-impact cardio 3 times a week and cut back on processed foods. My energy levels have improved significantly!",
    category: "pcos",
    author: "Sarah M.",
    avatar: "👩",
    timestamp: "2 days ago",
    likes: 24,
    replies: [
      {
        id: 101,
        author: "Jessica K.",
        avatar: "👩‍🦰",
        content: "Thanks for sharing! I've been struggling with PCOS too. Did you make any specific dietary changes?",
        timestamp: "1 day ago",
        likes: 5,
        liked: false,
      },
      {
        id: 102,
        author: "Alex R.",
        avatar: "👨",
        content: "This is really helpful. I'm going to try the exercise routine you mentioned.",
        timestamp: "1 day ago",
        likes: 3,
        liked: false,
      },
    ],
  },
  {
    id: 2,
    title: "Endometriosis pain management",
    content:
      "Has anyone found relief with heat therapy? I've been using a heating pad and it helps so much with the pain. I also started taking magnesium supplements which seem to help.",
    category: "endo",
    author: "Emma L.",
    avatar: "👩‍🦱",
    timestamp: "1 day ago",
    likes: 18,
    replies: [
      {
        id: 201,
        author: "Maria S.",
        avatar: "👩",
        content: "Heat therapy is a lifesaver for me too! I also recommend trying gentle yoga.",
        timestamp: "12 hours ago",
        likes: 8,
        liked: false,
      },
    ],
  },
  {
    id: 3,
    title: "First time tracking my cycle - any tips?",
    content:
      "I just started using a cycle tracker and I'm amazed at how much it helps me understand my body. I'm noticing patterns I never saw before. Any tips for someone just starting out?",
    category: "general",
    author: "Lisa T.",
    avatar: "👩‍🦳",
    timestamp: "3 days ago",
    likes: 31,
    replies: [
      {
        id: 301,
        author: "Rachel M.",
        avatar: "👩",
        content:
          "Great to hear! I recommend tracking not just your period but also symptoms and mood. It really helps identify patterns.",
        timestamp: "2 days ago",
        likes: 12,
        liked: false,
      },
    ],
  },
]

export default function Community({ user }: CommunityProps) {
  const [threads, setThreads] = useState<any[]>(SAMPLE_THREADS)
  const [showForm, setShowForm] = useState(false)
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newThread = {
      id: Date.now(),
      ...formData,
      author: "You",
      avatar: "👤",
      timestamp: "just now",
      likes: 0,
      replies: [],
    }
    setThreads([newThread, ...threads])
    setFormData({ title: "", content: "", category: "general" })
    setShowForm(false)
  }

  const filteredThreads = threads.filter((thread) => {
    const matchesCategory = selectedCategory === "all" || thread.category === selectedCategory
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Community Forums</h2>
        <p className="text-muted-foreground">Connect with others and share experiences</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* New Thread Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-smooth"
      >
        {showForm ? "Cancel" : "+ Start Discussion"}
      </button>

      {/* New Thread Form */}
      {showForm && (
        <div className="bg-white border border-border rounded-lg p-6 mb-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What's on your mind?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="general">General Support</option>
                <option value="pcos">PCOS</option>
                <option value="endo">Endometriosis</option>
                <option value="pmdd">PMDD</option>
                <option value="tips">Tips & Tricks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Share your thoughts..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-smooth"
            >
              Post Discussion
            </button>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: "all", label: "All" },
          { id: "general", label: "General" },
          { id: "pcos", label: "PCOS" },
          { id: "endo", label: "Endometriosis" },
          { id: "pmdd", label: "PMDD" },
          { id: "tips", label: "Tips & Tricks" },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full font-semibold transition-smooth ${
              selectedCategory === category.id ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No discussions found. Be the first to start one!</p>
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-smooth cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="text-3xl">{thread.avatar}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full capitalize">
                        {thread.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mt-2">{thread.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{thread.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{thread.content}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">By {thread.author}</span>
                    <div className="flex gap-4 text-muted-foreground">
                      <span>👍 {thread.likes}</span>
                      <span>💬 {thread.replies.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Thread Detail Modal */}
      {selectedThread && (
        <ThreadDetail
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
          onAddReply={(reply) => {
            setSelectedThread({ ...selectedThread, replies: [...selectedThread.replies, reply] })
          }}
        />
      )}
    </div>
  )
}
