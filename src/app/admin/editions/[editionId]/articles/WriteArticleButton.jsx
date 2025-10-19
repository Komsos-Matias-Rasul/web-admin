"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const WriteArticleButton = ({ editionId }) => {
  const r = useRouter()
  const handleNewArticle = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/create/${editionId}`,
        { method: "POST" }
      )
      if (!res.ok) {
        const jsonData = await res.json()
        if (jsonData) {
          throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
        }
      }
      const jsonData = await res.json()
      const articleId = jsonData.data.article_id
      r.push(`/admin/editor/${articleId}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <button
      className="bg-blue-primary text-white font-bold hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer"
      aria-label="write"
      title="Write articles"
      onClick={handleNewArticle}
    >
      Write New Article
    </button>
  )
}