"use client"

import type React from "react"
import { useState } from "react"

interface ThreadDetailProps {
  thread: any
  onClose: () => void
  onAddReply: (reply: any) => void
}

export default function ThreadDetail({ thread, onClose, onAddReply }: ThreadDetailProps) {
  const [replyContent, setReplyContent] = useState("")
  const [replies, setReplies] = useState(thread.replies || [])

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    const newReply = {
      id: Date.now(),
      author: "You",
      avatar: "👤",
      content: replyContent,
      timestamp: "just now",
      likes: 0,
      liked: false,
    }
    setReplies([...replies, newReply])
    setReplyContent("")
  }

  const toggleLike = (replyId: number) => {
    setReplies(
      replies.map((reply) =>
        reply.id === replyId
          ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
          : reply,
      ),
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-start">
          <div className="flex-1">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full capitalize">
              {thread.category}
            </span>
            <h2 className="text-2xl font-bold text-foreground mt-3">{thread.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 bg-muted text-muted-foreground hover:bg-border rounded-lg transition-smooth"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Original Post */}
          <div className="border-b border-border pb-6">
            <div className="flex gap-4">
              <div className="text-3xl">{thread.avatar || "👤"}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-foreground">{thread.author}</p>
                  <p className="text-xs text-muted-foreground">{thread.timestamp}</p>
                </div>
                <p className="text-foreground leading-relaxed">{thread.content}</p>
                <div className="flex gap-4 mt-4 text-sm">
                  <button className="text-muted-foreground hover:text-primary transition-smooth">
                    👍 {thread.likes || 0}
                  </button>
                  <button className="text-muted-foreground hover:text-primary transition-smooth">
                    💬 {replies.length}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Replies */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{replies.length} Replies</h3>
            <div className="space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="border-l-2 border-primary/20 pl-4">
                  <div className="flex gap-3">
                    <div className="text-2xl">{reply.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground text-sm">{reply.author}</p>
                        <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{reply.content}</p>
                      <button
                        onClick={() => toggleLike(reply.id)}
                        className={`text-xs mt-2 transition-smooth ${
                          reply.liked ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        👍 {reply.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Add Your Reply</h3>
            <form onSubmit={handleReplySubmit} className="space-y-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Share your thoughts..."
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-smooth"
              >
                Post Reply
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
