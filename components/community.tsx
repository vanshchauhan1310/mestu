"use client"

import type React from "react"
import { useState, useEffect } from "react"
import ThreadDetail from "./thread-detail"
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { ThumbsUp, MessageCircle, Plus, Search, Sparkles, Filter, Hash, MoreHorizontal, Clock, Heart, Share2 } from "lucide-react"

interface CommunityProps {
  user: any
}

export default function Community({ user }: CommunityProps) {
  const [threads, setThreads] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
  })

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        replies: doc.data().replies || []
      }))
      setThreads(posts)
    }, (error) => {
      console.error("Error fetching posts:", error)
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser || !user) {
      alert("You must be logged in to post.")
      return
    }

    try {
      const newPost = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author: user.name || "Anonymous",
        avatar: "user",
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: []
      }

      await addDoc(collection(db, "posts"), newPost)
      setFormData({ title: "", content: "", category: "general" })
      setShowForm(false)
    } catch (error) {
      console.error("Error posting:", error)
      alert("Failed to post discussion.")
    }
  }

  const filteredThreads = threads.filter((thread) => {
    const matchesCategory = selectedCategory === "all" || thread.category === selectedCategory
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return "Just now"
    const d = new Date(isoString);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000; // seconds
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32">
      {/* Hero / Header Section - Tier 1 Gradient */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-xl overflow-hidden mb-[-3rem]">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Community</h1>
          <p className="text-purple-100/90 text-sm font-medium">Safe space to share, ask, and heal.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-20">

        {/* Actions Bar (Search + Post) */}
        <div className="bg-white rounded-2xl p-2 shadow-lg shadow-purple-900/5 mb-6 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-transparent text-sm font-medium text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 transition-transform active:scale-95 shadow-lg shadow-gray-900/20 flex items-center gap-2"
          >
            {showForm ? <Plus className="w-5 h-5 rotate-45 transition-transform" /> : <Plus className="w-5 h-5" />}
            <span className="hidden sm:inline text-sm font-bold">{showForm ? "Cancel" : "Post"}</span>
          </button>
        </div>

        {/* New Thread Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-purple-900/10 mb-6 animate-in slide-in-from-top-4 fade-in duration-300 border border-purple-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Start a Discussion
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-100 outline-none font-semibold text-gray-800 placeholder-gray-400"
                placeholder="Title: What's on your mind?"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-100 outline-none text-sm font-medium text-gray-600"
              >
                <option value="general">General Support</option>
                <option value="pcos">PCOS Warriors</option>
                <option value="endo">Endometriosis</option>
                <option value="pmdd">PMDD Support</option>
                <option value="tips">Wellness Tips</option>
              </select>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-100 outline-none min-h-[120px] text-gray-600 text-sm"
                placeholder="Share your story or ask a question..."
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-[0.98]"
              >
                Post to Community
              </button>
            </form>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-2 no-scrollbar px-1">
          {[
            { id: "all", label: "All" },
            { id: "general", label: "General" },
            { id: "pcos", label: "PCOS" },
            { id: "endo", label: "Endo" },
            { id: "pmdd", label: "PMDD" },
            { id: "tips", label: "Tips" },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${selectedCategory === category.id
                ? "bg-gray-900 text-white border-gray-900 shadow-gray-900/20"
                : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50"
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No discussions found yet.</p>
              <button onClick={() => setShowForm(true)} className="text-purple-600 font-bold text-sm mt-2 hover:underline">Start one?</button>
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className="group bg-white rounded-2xl p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-purple-100 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Decorative bg blob */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full transition-transform group-hover:scale-150 group-hover:bg-purple-50/50 duration-500"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-sm font-bold text-indigo-700 shadow-inner">
                        {thread.author?.charAt(0) || "A"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{thread.author}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatDate(thread.timestamp)}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider ${thread.category === 'pcos' ? 'bg-purple-100 text-purple-700' :
                      thread.category === 'endo' ? 'bg-pink-100 text-pink-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      {thread.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-purple-700 transition-colors">
                    {thread.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {thread.content}
                  </p>

                  <div className="flex items-center gap-4 border-t border-gray-50 pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const newLikes = (thread.likes || 0) + 1
                        // Optimistic Update
                        const updated = threads.map(t => t.id === thread.id ? { ...t, likes: newLikes } : t)
                        setThreads(updated)
                        // Fire & Forget (or handle error silently)
                        updateDoc(doc(db, "posts", thread.id), { likes: newLikes }).catch(console.error)
                      }}
                      className="group/like flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      <div className={`p-1.5 rounded-full group-hover/like:bg-pink-50 transition-colors`}>
                        <Heart className={`w-5 h-5 ${thread.likes > 0 ? "fill-pink-500 text-pink-500" : "text-gray-400"}`} />
                      </div>
                      <span className={thread.likes > 0 ? "text-pink-600" : ""}>{thread.likes || 0}</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      {thread.replies?.length || 0}
                    </button>

                    <button className="ml-auto text-gray-400 hover:text-gray-600">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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
