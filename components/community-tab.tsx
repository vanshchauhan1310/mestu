"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Heart, Share2, MoreHorizontal, User, Shield, PenSquare, X, Send, Bookmark, Image as ImageIcon } from "lucide-react"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, deleteDoc, updateDoc, increment, getDocs } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "./auth-context"

type Post = {
    id: string
    user: string
    userId: string
    time: any
    createdAt?: any
    category: string
    content: string
    likes: number
    comments: number
    avatar: string | null
    isAnonymous: boolean
    imageUrl?: string
}

export default function CommunityTab() {
    const { user } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [filter, setFilter] = useState("All")
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [showPostModal, setShowPostModal] = useState(false)
    const [newPostContent, setNewPostContent] = useState("")
    const [newPostCategory, setNewPostCategory] = useState("PCOS")

    // Image Upload State
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // User interaction state
    const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set())
    const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set())

    const filters = ["All", "Diet", "Mental Health", "Periods", "Fitness", "PCOS", "Success Stories"]

    // Real-time Fetch Feed
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Post[]
            setPosts(fetchedPosts)
        })
        return () => unsubscribe()
    }, [])

    // Fetch User's Likes & Saves
    useEffect(() => {
        if (!user) return

        const fetchInteractions = async () => {
            // Fetch Likes
            const likesSnapshot = await getDocs(collection(db, "users", user.uid, "likes"))
            setLikedPostIds(new Set(likesSnapshot.docs.map(d => d.id)))

            // Fetch Saves
            const savesSnapshot = await getDocs(collection(db, "users", user.uid, "saved"))
            setSavedPostIds(new Set(savesSnapshot.docs.map(d => d.id)))
        }
        fetchInteractions()
    }, [user])

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleCreatePost = async () => {
        if (!newPostContent.trim() && !selectedImage) return

        setIsUploading(true)
        try {
            let imageUrl = ""

            if (selectedImage) {
                const storageRef = ref(storage, `posts/${Date.now()}_${selectedImage.name}`)
                const snapshot = await uploadBytes(storageRef, selectedImage)
                imageUrl = await getDownloadURL(snapshot.ref)
            }

            await addDoc(collection(db, "posts"), {
                content: newPostContent,
                category: newPostCategory,
                isAnonymous,
                user: isAnonymous ? "Anonymous" : (user?.displayName || "Community Member"), // Fallback if no specific name
                userId: user?.uid,
                avatar: isAnonymous ? null : (user?.photoURL || null),
                likes: 0,
                comments: 0,
                createdAt: serverTimestamp(), // Server timestamp for sorting
                imageUrl: imageUrl || null
            })
            setNewPostContent("")
            setSelectedImage(null)
            setImagePreview(null)
            setShowPostModal(false)
        } catch (error) {
            console.error("Error adding post: ", error)
            alert("Failed to post. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleLike = async (post: Post) => {
        if (!user) return
        const isLiked = likedPostIds.has(post.id)
        const postRef = doc(db, "posts", post.id)
        const userLikeRef = doc(db, "users", user.uid, "likes", post.id)

        try {
            if (isLiked) {
                // Unlike
                setLikedPostIds(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(post.id)
                    return newSet
                })
                await deleteDoc(userLikeRef)
                await updateDoc(postRef, { likes: increment(-1) })
            } else {
                // Like
                setLikedPostIds(prev => new Set(prev).add(post.id))
                // Save simplified post data for profile view
                await setDoc(userLikeRef, {
                    id: post.id,
                    content: post.content,
                    category: post.category,
                    user: post.user,
                    createdAt: post.time || serverTimestamp(), // Keep original timestamp if possible
                    likedAt: serverTimestamp(),
                    imageUrl: post.imageUrl || null
                })
                await updateDoc(postRef, { likes: increment(1) })
            }
        } catch (error) {
            console.error("Error toggling like:", error)
        }
    }

    const handleSave = async (post: Post) => {
        if (!user) return
        const isSaved = savedPostIds.has(post.id)
        const userSaveRef = doc(db, "users", user.uid, "saved", post.id)

        try {
            if (isSaved) {
                // Unsave
                setSavedPostIds(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(post.id)
                    return newSet
                })
                await deleteDoc(userSaveRef)
            } else {
                // Save
                setSavedPostIds(prev => new Set(prev).add(post.id))
                await setDoc(userSaveRef, {
                    id: post.id,
                    content: post.content,
                    category: post.category,
                    user: post.user,
                    createdAt: post.time || serverTimestamp(),
                    savedAt: serverTimestamp(),
                    imageUrl: post.imageUrl || null
                })
            }
        } catch (error) {
            console.error("Error toggling save:", error)
        }
    }

    // Helper to format timestamp (simplified)
    const formatTime = (timestamp: any) => {
        if (!timestamp) return "Just now"
        // Handle both Firestore Timestamp and JS Date (if passed from other sources)
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        const now = new Date()
        const diff = (now.getTime() - date.getTime()) / 1000 // seconds

        if (diff < 60) return "Just now"
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return `${Math.floor(diff / 86400)}d ago`
    }

    const filteredPosts = filter === "All" ? posts : posts.filter(p => p.category === filter)

    return (
        <div className="space-y-6 pb-24 relative">
            {/* Header & Check-in */}
            <div className="flex flex-col gap-4">
                <div className="bg-[#ede4d9] p-6 rounded-[2rem] relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-[#1a4d2e] mb-1">Community Support</h2>
                        <p className="text-xs text-[#1a4d2e]/70 mb-4">Connect, share, and support each other.</p>

                        <div className="flex gap-2">
                            <button className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-[#1a4d2e] flex items-center gap-2 hover:bg-white transition-colors">
                                <MessageCircle className="w-4 h-4" />
                                Public Chat
                            </button>
                            <button className="bg-[#1a4d2e] px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-green-900/10">
                                <Shield className="w-4 h-4" />
                                Annual Anonymous
                            </button>
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar pl-1">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold transition-all
                            ${filter === f
                                ? "bg-[#48A359] text-white shadow-md shadow-green-200"
                                : "bg-white text-gray-500 border border-gray-100"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Post Input Trigger */}
            <div
                onClick={() => setShowPostModal(true)}
                className="bg-white p-4 rounded-[2rem] flex items-center gap-3 shadow-sm border border-gray-50 cursor-pointer hover:border-[#48A359] transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-gray-400" />
                    )}
                </div>
                <div className="flex-1 bg-[#F8FAF9] h-10 rounded-full flex items-center px-4 text-gray-400 text-sm group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all">
                    What's on your mind? ...
                </div>
                <div className="w-10 h-10 rounded-full bg-[#F8FAF9] flex items-center justify-center text-gray-400 group-hover:text-[#48A359] group-hover:bg-[#E8F5E9] transition-all">
                    <PenSquare className="w-5 h-5" />
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-4 min-h-[300px]">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-10 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8 text-[#48A359] opacity-50" />
                        </div>
                        <p className="text-gray-400 text-sm mb-4">No posts yet in this category.</p>
                        <button
                            onClick={() => setShowPostModal(true)}
                            className="text-[#48A359] font-bold text-sm hover:underline"
                        >
                            Be the first to share!
                        </button>
                    </div>
                ) : (
                    filteredPosts.map(post => (
                        <div key={post.id} className="bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                            {/* Post Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden
                                        ${post.isAnonymous ? "bg-purple-100 text-purple-600" : "bg-gray-100"}
                                    `}>
                                        {post.avatar ? (
                                            <img src={post.avatar} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-[#1a4d2e] text-sm">{post.user}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider
                                                ${post.category === 'Success Stories' ? 'bg-green-100 text-green-700' :
                                                    post.category === 'Mental Health' ? 'bg-purple-100 text-purple-700' :
                                                        post.category === 'Diet' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-100 text-gray-600'}
                                            `}>
                                                {post.category}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400">{formatTime(post.time || post.createdAt)}</p>
                                    </div>
                                </div>
                                <button className="text-gray-300 hover:text-gray-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                                {post.content}
                            </p>

                            {/* Post Image */}
                            {post.imageUrl && (
                                <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                                    <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-80" />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleLike(post)}
                                    className={`flex items-center gap-2 transition-colors group ${likedPostIds.has(post.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                                >
                                    <Heart className={`w-5 h-5 ${likedPostIds.has(post.id) ? "fill-current" : ""}`} />
                                    <span className="text-xs font-bold">{post.likes}</span>
                                </button>

                                <button className="flex items-center gap-2 text-gray-400 hover:text-[#48A359] transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-xs font-bold">{post.comments}</span>
                                </button>

                                <button
                                    onClick={() => handleSave(post)}
                                    className={`flex items-center gap-2 transition-colors group ${savedPostIds.has(post.id) ? "text-[#48A359]" : "text-gray-400 hover:text-[#48A359]"}`}
                                >
                                    <Bookmark className={`w-5 h-5 ${savedPostIds.has(post.id) ? "fill-current" : ""}`} />
                                </button>

                                <button className="flex items-center gap-2 text-gray-400 hover:text-[#48A359] ml-auto transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Post Modal */}
            {showPostModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="bg-white w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] p-6 animate-in slide-in-from-bottom sm:zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#1a4d2e]">Create Post</h3>
                            <button onClick={() => setShowPostModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex gap-4 mb-4 overflow-x-auto pb-2 no-scrollbar">
                            {filters.slice(1).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setNewPostCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                                        ${newPostCategory === cat ? "bg-[#1a4d2e] text-white" : "bg-gray-100 text-gray-500"}
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Share your thoughts, questions, or experiences..."
                            className="w-full h-32 p-4 bg-gray-50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#48A359]/20 border border-transparent focus:border-[#48A359] mb-4 text-sm"
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative mb-4 inline-block">
                                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-gray-200" />
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 hover:text-[#1a4d2e] transition-colors"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                />

                                <button
                                    onClick={() => setIsAnonymous(!isAnonymous)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-colors
                                        ${isAnonymous ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}
                                    `}
                                >
                                    <Shield className="w-4 h-4" />
                                    {isAnonymous ? "Posting Anonymously" : "Post Anonymously"}
                                </button>
                            </div>

                            <button
                                onClick={handleCreatePost}
                                disabled={(!newPostContent.trim() && !selectedImage) || isUploading}
                                className="bg-[#1a4d2e] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 hover:bg-[#143d24] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isUploading ? (
                                    <span className="animate-pulse">Posting...</span>
                                ) : (
                                    <>
                                        <span>Post</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
