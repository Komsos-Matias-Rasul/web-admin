"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/ConfirmModal"

export const WriteArticleButton = ({ editionId }) => {
  const r = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNewArticle = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/article`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editionId: editionId,
        }),
      })
      const jsonData = await res.json().catch(() => null)
      if (!res.ok) {
        const reason = jsonData?.data?.error ?? res.statusText
        const traceId = jsonData?._id ? ` (${jsonData._id})` : ""
        throw new Error(`${res.status} ${reason}${traceId}`)
      }
      const articleId = jsonData.data.article_id
      setIsModalOpen(false)
      r.push(`/admin/editions/${editionId}/articles/${articleId}`)
    } catch (err) {
      toast.error(err.message)
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={isLoading}
        className="bg-blue-primary text-white font-bold hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:bg-blue-primary/30 disabled:cursor-not-allowed"
        aria-label="write"
        title="Write articles"
        onClick={() => setIsModalOpen(true)}
      >
        Write New Article
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleNewArticle}
        isLoading={isLoading}
        title="Buat Artikel Baru"
        message={<p>Draft artikel baru akan dibuat pada edisi ini. Lanjutkan?</p>}
        confirmLabel="Buat Artikel"
      />
    </>
  )
}
