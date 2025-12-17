"use client"

interface ArticleDetailProps {
  article: any
  onClose: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}

export default function ArticleDetail({ article, onClose, isFavorite, onToggleFavorite }: ArticleDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {article.category}
            </span>
            <h2 className="text-2xl font-bold text-foreground mt-3">{article.title}</h2>
            <p className="text-sm text-muted-foreground mt-2">{article.readTime} read</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onToggleFavorite}
              className={`px-3 py-2 rounded-lg transition-smooth ${
                isFavorite ? "bg-accent-red/10 text-accent-red" : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {isFavorite ? "★" : "☆"}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-muted text-muted-foreground hover:bg-border rounded-lg transition-smooth"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 text-foreground">
          <p className="text-lg leading-relaxed">{article.content}</p>

          {article.keyPoints && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Key Points</h3>
              <ul className="space-y-2">
                {article.keyPoints.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.resources && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2">
                {article.resources.map((resource: string, idx: number) => (
                  <li key={idx} className="text-sm text-primary hover:underline cursor-pointer">
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
